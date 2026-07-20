import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const workspace = process.cwd();
const storeSlug = "chai-smoker";
const bucket = "marketplace-category-assets";
const sourceDirectory = path.join(
  workspace,
  "artifacts",
  "category-source",
  "chai-smoker-supplied-v1",
  "chai-smoker-category-assets-final",
  "transparent-png",
);
const generatedAllAsset = path.join(
  workspace,
  "artifacts",
  "generated",
  "marketplace",
  "categories",
  "chai-smoker",
  "all-category-v1.png",
);

const sourceByCategorySlug = new Map([
  ["all", "all-category-v1.png"],
  ["chai", "01-chai.png"],
  ["hot-coffee", "02-hot-coffee.png"],
  ["cold-coffee", "03-cold-coffee.png"],
  ["ice-tea-refreshers", "04-ice-tea.png"],
  ["shakes", "05-shakes.png"],
  ["bites-bread", "08-bites-fries.png"],
  ["burger", "09-burger.png"],
  ["patties", "10-patties.png"],
  ["maggi", "12-maggi.png"],
  ["sandwich", "13-sandwich.png"],
  ["pizza", "14-pizza.png"],
]);

function parseEnv(source) {
  return Object.fromEntries(
    source
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#") && line.includes("="))
      .map((line) => {
        const separator = line.indexOf("=");
        const key = line.slice(0, separator).trim();
        let value = line.slice(separator + 1).trim();
        if (
          (value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))
        ) {
          value = value.slice(1, -1);
        }
        return [key, value];
      }),
  );
}

async function assertPublicUrl(url, attempts = 3) {
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(url, { method: "HEAD" });
      if (response.ok) return;
      if (attempt === attempts) {
        throw new Error(
          `Asset verification failed (${response.status}): ${url}`,
        );
      }
    } catch (error) {
      if (attempt === attempts) throw error;
    }

    await new Promise((resolve) => setTimeout(resolve, attempt * 500));
  }
}

async function main() {
  const fileEnv = parseEnv(
    await readFile(path.join(workspace, ".env"), "utf8"),
  );
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL || fileEnv.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY || fileEnv.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.",
    );
  }

  const supabase = createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data: store, error: storeError } = await supabase
    .from("stores")
    .select("id")
    .eq("slug", storeSlug)
    .single();
  if (storeError) throw storeError;

  const { data: existingAllCategory, error: existingAllCategoryError } =
    await supabase
      .from("catalogue_categories")
      .select("id")
      .eq("store_id", store.id)
      .eq("slug", "all")
      .maybeSingle();
  if (existingAllCategoryError) throw existingAllCategoryError;

  if (!existingAllCategory) {
    const { error: insertAllCategoryError } = await supabase
      .from("catalogue_categories")
      .insert({
        store_id: store.id,
        name: "All",
        slug: "all",
        sort_order: 0,
        is_active: true,
      });
    if (insertAllCategoryError) throw insertAllCategoryError;
  }

  const { data: categories, error: categoryError } = await supabase
    .from("catalogue_categories")
    .select("id, slug, name")
    .eq("store_id", store.id)
    .eq("is_active", true)
    .order("sort_order", { ascending: true });
  if (categoryError) throw categoryError;

  const unknownCategories = categories.filter(
    (category) => !sourceByCategorySlug.has(category.slug),
  );
  if (unknownCategories.length) {
    throw new Error(
      `No supplied asset mapping for: ${unknownCategories.map((category) => category.slug).join(", ")}`,
    );
  }

  const linked = [];
  for (const category of categories) {
    const sourceName = sourceByCategorySlug.get(category.slug);
    const filePath =
      category.slug === "all"
        ? generatedAllAsset
        : path.join(sourceDirectory, sourceName);
    const file = await stat(filePath);
    if (file.size <= 0 || file.size > 3 * 1024 * 1024) {
      throw new Error(
        `Invalid source size for ${sourceName}: ${file.size} bytes.`,
      );
    }

    const objectPath = `${storeSlug}/storefront-categories/${category.slug}/tile-v1.png`;
    const bytes = await readFile(filePath);
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(objectPath, bytes, {
        cacheControl: "31536000",
        contentType: "image/png",
        upsert: true,
      });
    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from(bucket).getPublicUrl(objectPath);
    const { error: updateError } = await supabase
      .from("catalogue_categories")
      .update({ image_url: data.publicUrl })
      .eq("id", category.id);
    if (updateError) throw updateError;

    linked.push({ slug: category.slug, sourceName, publicUrl: data.publicUrl });
  }

  await Promise.all(linked.map(({ publicUrl }) => assertPublicUrl(publicUrl)));

  const { data: verificationRows, error: verificationError } = await supabase
    .from("catalogue_categories")
    .select("slug, image_url")
    .eq("store_id", store.id)
    .eq("is_active", true)
    .order("sort_order", { ascending: true });
  if (verificationError) throw verificationError;

  const invalid = verificationRows.filter(
    (category) =>
      !category.image_url ||
      !category.image_url.includes(
        `/${bucket}/${storeSlug}/storefront-categories/`,
      ),
  );
  if (invalid.length) {
    throw new Error(
      `Unlinked category rows: ${invalid.map((row) => row.slug).join(", ")}`,
    );
  }

  console.log(
    JSON.stringify(
      {
        bucket,
        linkedCategories: linked.length,
        mappings: linked.map(({ slug, sourceName }) => ({ slug, sourceName })),
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
