import { useMemo } from "react";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Bus, CalendarDays, Clock3, MapPin, Search } from "lucide-react";
import { useSearchParams, Link } from "react-router";
import { CustomerLayout } from "@/components/CustomerLayout";

export default function CustomerTrips() {
  const [params] = useSearchParams();
  const from = params.get("from") ?? "";
  const to = params.get("to") ?? "";
  const trips = useQuery(api.trips.list, {});
  const companies = useQuery(api.companies.listActive);
  const companyBySlug = useMemo(() => new Map((companies ?? []).map(c => [c.slug, c])), [companies]);
  const visible = (trips ?? []).filter(t => t.active !== false && (!from || t.from === from) && (!to || t.to === to));

  return <CustomerLayout><main className="mx-auto max-w-7xl px-4 py-10 sm:px-6"><div className="mb-8"><p className="text-sm font-black text-[#c89532]">استكشف خيارات السفر</p><h1 className="mt-1 text-3xl font-black text-[#0b2b55]">الرحلات المتاحة</h1><p className="mt-2 text-sm text-slate-500">قارن الرحلات المنشورة من شركات النقل المستقلة.</p></div><div className="mb-6 flex flex-wrap gap-2 text-sm font-bold"><Link to="/customer/trips" className="rounded-xl bg-[#0b2b55] px-4 py-2 text-white">كل الرحلات</Link><Link to="/customer" className="rounded-xl border bg-white px-4 py-2">بحث جديد</Link></div>{visible.length === 0 ? <div className="rounded-3xl border bg-white p-10 text-center text-slate-500"><Search className="mx-auto mb-3 size-8"/><p className="font-bold">لا توجد رحلات مطابقة حالياً.</p></div> : <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{visible.map(trip => { const company = companyBySlug.get(trip.companyId); return <article key={trip._id} className="rounded-3xl border bg-white p-5 shadow-sm"><div className="flex items-start justify-between gap-3"><div><p className="font-black text-[#0b2b55]">{trip.from} ← {trip.to}</p><p className="mt-1 text-xs text-slate-500">{company?.name ?? "شركة نقل مستقلة"}</p></div><Bus className="size-5 text-[#c89532]"/></div><div className="mt-5 grid grid-cols-2 gap-3 text-xs font-bold text-slate-600"><span className="flex gap-2"><Clock3 className="size-4"/>{trip.departureTime}</span><span className="flex gap-2"><CalendarDays className="size-4"/>{trip.days?.join("، ") || "حسب الجدول"}</span><span className="flex gap-2"><MapPin className="size-4"/>{trip.availableSeats} مقاعد</span></div><div className="mt-5 flex items-center justify-between border-t pt-4"><strong className="text-lg text-[#0b2b55]">{trip.price} ريال</strong><Link to={`/customer/booking?from=${encodeURIComponent(trip.from)}&to=${encodeURIComponent(trip.to)}`} className="rounded-xl bg-[#d9a441] px-4 py-2 text-sm font-black text-[#071a3a]">احجز</Link></div></article>})}</div>}</main></CustomerLayout>;
}
