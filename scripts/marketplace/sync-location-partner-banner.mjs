import { readFile } from "node:fs/promises";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const workspace = process.cwd();
const bucket = "marketplace-store-assets";
const objectPath =
  "locations/malviya-nagar/merchant-cta/list-your-restaurant-v2.webp";
const sourcePath = path.join(
  workspace,
  "artifacts",
  "generated",
  "marketplace",
  "locations",
  "malviya-nagar",
  "list-your-restaurant-v2.webp",
);

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
  const bytes = await readFile(sourcePath);
  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(objectPath, bytes, {
      cacheControl: "31536000",
      contentType: "image/webp",
      upsert: true,
    });
  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from(bucket).getPublicUrl(objectPath);
  await assertPublicUrl(data.publicUrl);

  console.log(
    JSON.stringify({ bucket, objectPath, publicUrl: data.publicUrl }, null, 2),
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
