import { useMemo } from "react";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Bus, Search } from "lucide-react";
import { useSearchParams, Link } from "react-router";
import { CustomerLayout } from "@/components/CustomerLayout";
import { TripCard } from "@/components/customer/TripCard";

export default function CustomerTrips() {
  const [params] = useSearchParams();
  const from = params.get("from") ?? "";
  const to = params.get("to") ?? "";
  const trips = useQuery(api.trips.list, {});
  const companies = useQuery(api.companies.listActive);
  const companyBySlug = useMemo(
    () => new Map((companies ?? []).map((company) => [company.slug, company])),
    [companies],
  );
  const visible = (trips ?? []).filter(
    (trip) =>
      trip.active !== false &&
      (!from || trip.from === from) &&
      (!to || trip.to === to),
  );

  return (
    <CustomerLayout>
      <main className="bg-[#f7f9fc]">
        <section className="mx-auto max-w-7xl px-4 pb-14 pt-8 sm:px-6 lg:pt-10">
          <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-2 text-sm font-black text-[#c89532]">
                <Bus className="size-4" />
                خيارات السفر
              </div>
              <h1 className="mt-1 text-3xl font-black tracking-tight text-[#0b2b55] sm:text-4xl">
                الرحلات المتاحة
              </h1>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                قارن الرحلات المنشورة من شركات النقل المستقلة واختر ما يناسبك.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 text-sm font-bold">
              <Link
                to="/customer/trips"
                className="rounded-xl bg-[#3974b9] px-4 py-2.5 text-white shadow-sm"
              >
                كل الرحلات
              </Link>
              <Link
                to="/customer"
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-[#0b2b55] shadow-sm"
              >
                بحث جديد
              </Link>
            </div>
          </div>

          {visible.length === 0 ? (
            <div className="rounded-[28px] border border-slate-200 bg-white p-12 text-center shadow-sm">
              <Search className="mx-auto mb-3 size-9 text-[#3974b9]" />
              <p className="font-black text-[#0b2b55]">لا توجد رحلات مطابقة حالياً.</p>
              <p className="mt-1 text-sm text-slate-500">جرّب تغيير مدينة المغادرة أو الوصول.</p>
            </div>
          ) : (
            <div className="mx-auto grid max-w-5xl gap-4">
              {visible.map((trip) => {
                const company = companyBySlug.get(trip.companyId);
                return (
                  <TripCard
                    key={trip._id}
                    trip={trip}
                    companyName={company?.name}
                    vip={trip.totalSeats <= 30}
                  />
                );
              })}
            </div>
          )}
        </section>
      </main>
    </CustomerLayout>
  );
}
