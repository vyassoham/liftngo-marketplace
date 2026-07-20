import { Clock3, IndianRupee, Info, Mail, MapPin, Phone } from "lucide-react";

interface StorefrontAboutProps {
  store: {
    name: string;
    description: string;
    address: string;
    landmark: string;
    locality: string;
    city: string;
    phone: string;
    email: string;
    supportPhone: string;
    preparationLabel: string;
    minimumOrder: number;
    businessCategory: string | null;
  };
}

export default function StorefrontAbout({ store }: StorefrontAboutProps) {
  const location = [store.address, store.landmark, store.locality, store.city]
    .filter(Boolean)
    .join(", ");

  return (
    <section className="mx-auto hidden max-w-7xl px-4 pb-14 md:block md:px-6 lg:px-8">
      <div className="overflow-hidden rounded-[20px] border border-[#eadfd5] bg-white shadow-[0_10px_30px_rgba(70,43,23,.06)]">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4">
          <StoreFact
            icon={<Clock3 className="h-5 w-5" />}
            label="Preparation"
            value={store.preparationLabel}
          />
          <StoreFact
            icon={<IndianRupee className="h-5 w-5" />}
            label="Minimum order"
            value={`₹${store.minimumOrder}`}
          />
          {store.businessCategory ? (
            <StoreFact
              icon={<Info className="h-5 w-5" />}
              label="Category"
              value={store.businessCategory}
            />
          ) : null}
          {store.supportPhone ? (
            <StoreFact
              icon={<Phone className="h-5 w-5" />}
              label="Support"
              value={store.supportPhone}
              href={`tel:${store.supportPhone}`}
            />
          ) : null}
        </div>

        {store.description || location || store.phone || store.email ? (
          <div className="border-t border-[#eee5dc] bg-[#fffaf5] px-5 py-5 sm:px-7">
            <h2 className="text-lg font-black text-[#251b16]">
              About {store.name}
            </h2>
            {store.description ? (
              <p className="mt-2 max-w-3xl text-sm leading-6 text-[#76695f]">
                {store.description}
              </p>
            ) : null}
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium text-[#675a50]">
              {location ? (
                <span className="inline-flex items-start gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#ff5a00]" />
                  {location}
                </span>
              ) : null}
              {store.phone ? (
                <a
                  href={`tel:${store.phone}`}
                  className="inline-flex items-center gap-2 hover:text-[#ff5a00]"
                >
                  <Phone className="h-4 w-4 text-[#ff5a00]" />
                  {store.phone}
                </a>
              ) : null}
              {store.email ? (
                <a
                  href={`mailto:${store.email}`}
                  className="inline-flex items-center gap-2 hover:text-[#ff5a00]"
                >
                  <Mail className="h-4 w-4 text-[#ff5a00]" />
                  {store.email}
                </a>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}

function StoreFact({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
}) {
  const content = (
    <div className="flex items-center gap-3 px-5 py-5 sm:px-6">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#fff0e7] text-[#ff5a00]">
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block text-xs font-semibold text-[#978a7f]">
          {label}
        </span>
        <span className="mt-0.5 block truncate text-sm font-extrabold text-[#2b211c]">
          {value}
        </span>
      </span>
    </div>
  );

  return (
    <div className="border-b border-[#eee5dc] last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0">
      {href ? <a href={href}>{content}</a> : content}
    </div>
  );
}
