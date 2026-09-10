import { Button } from "@/components/ui/button";
import { useLocations } from "@/hooks/useLocations";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { BusFront, CalendarDays, ChevronLeft, CircleHelp, Compass, MapPin, Search, ShieldCheck, Ticket, Building2, WalletCards } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import CustomerLayout from "@/components/customer/CustomerLayout";
import TripCard from "@/components/customer/TripCard";

const HERO_IMAGE = "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1800&q=85";

function formatTravelDate(value: string) {
  if (!value) return "اختر تاريخ السفر";
  const [year, month, day] = value.split("-");
  if (!year || !month || !day) return "اختر تاريخ السفر";
  return `${day} / ${month} / ${year}`;
}

export default function CustomerHome() {
  const navigate = useNavigate();
  const { saudiCities, yemenGovernorates } = useLocations();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");

  const trips = useQuery(api.trips.list, {
    fromCityId: from || undefined,
    toGovernorateId: to || undefined,
    date: date || undefined,
  });
  const companies = useQuery(api.companies.listActive, {});

  const submitSearch = (event: FormEvent) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    if (date) params.set("date", date);
    navigate(`/customer/trips${params.toString() ? `?${params}` : ""}`);
  };

  return (
    <CustomerLayout>
      <main dir="rtl" className="min-h-screen bg-slate-50">
        <section className="relative overflow-hidden bg-[#071d38] text-white">
          <div className="absolute inset-0">
            <img src={HERO_IMAGE} alt="حافلة للنقل البري" className="h-full w-full object-cover opacity-35" />
            <div className="absolute inset-0 bg-gradient-to-l from-[#071d38]/95 via-[#071d38]/80 to-[#071d38]/55" />
          </div>
          <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
            <div className="max-w-3xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold backdrop-blur">
                <Compass className="size-4" /> منصة مقارنة وحجز النقل البري
              </div>
              <h1 className="text-3xl font-black leading-tight sm:text-5xl">رحلتك القادمة تبدأ من هنا</h1>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-200 sm:text-base">
                قارن الرحلات المتاحة من شركات النقل المستقلة، اختر الأنسب لك، ثم أكمل حجزك بسهولة من خلال منصة خطوط زحل.
              </p>
            </div>

            <form onSubmit={submitSearch} className="mt-10 grid gap-3 rounded-2xl border border-white/10 bg-white p-3 text-slate-900 shadow-2xl sm:grid-cols-2 lg:grid-cols-4">
              <label className="block">
                <span className="mb-1.5 flex items-center gap-1.5 text-[11px] font-black text-slate-600"><MapPin className="size-3.5 text-[#0b2b55]" />مدينة المغادرة</span>
                <select value={from} onChange={(e) => setFrom(e.target.value)} className="h-[52px] w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-bold outline-none focus:border-[#0b2b55] focus:bg-white focus:ring-4 focus:ring-[#0b2b55]/10">
                  <option value="">اختر مدينة المغادرة</option>
                  {saudiCities?.map((city: any) => <option key={city._id} value={city._id}>{city.name}</option>)}
                </select>
              </label>

              <label className="block">
                <span className="mb-1.5 flex items-center gap-1.5 text-[11px] font-black text-slate-600"><MapPin className="size-3.5 text-[#0b2b55]" />الوجهة</span>
                <select value={to} onChange={(e) => setTo(e.target.value)} className="h-[52px] w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-bold outline-none focus:border-[#0b2b55] focus:bg-white focus:ring-4 focus:ring-[#0b2b55]/10">
                  <option value="">اختر المحافظة اليمنية</option>
                  {yemenGovernorates?.map((governorate: any) => <option key={governorate._id} value={governorate._id}>{governorate.name}</option>)}
                </select>
              </label>

              <label className="block">
                <span className="mb-1.5 flex items-center gap-1.5 text-[11px] font-black text-slate-600"><CalendarDays className="size-3.5 text-[#0b2b55]" />تاريخ السفر</span>
                <div className="relative h-[52px] overflow-hidden rounded-xl border border-slate-200 bg-slate-50 focus-within:border-[#0b2b55] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#0b2b55]/10">
                  <div aria-hidden="true" className={`pointer-events-none absolute inset-0 z-10 flex items-center justify-end px-3 text-sm font-bold ${date ? "text-slate-800" : "text-slate-400"}`} dir="ltr">
                    {formatTravelDate(date)}
                  </div>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    min={new Date().toISOString().slice(0, 10)}
                    aria-label="اختر تاريخ السفر"
                    className="absolute inset-0 z-20 h-full w-full cursor-pointer opacity-0"
                  />
                </div>
              </label>

              <Button type="submit" className="h-[52px] self-end rounded-xl bg-[#0b2b55] text-sm font-black hover:bg-[#123d70]">
                <Search className="ml-2 size-4" /> بحث عن الرحلات
              </Button>
            </form>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-4 md:grid-cols-4">
            {[
              [Search, "قارن الرحلات", "قارن المواعيد والأسعار والخدمات في مكان واحد."],
              [Building2, "شركات نقل مستقلة", "اختر شركة النقل المنفذة للرحلة قبل الحجز."],
              [Ticket, "حجز واضح", "استلم تفاصيل حجزك وتذكرتك بشكل منظم."],
              [ShieldCheck, "تجربة موثوقة", "معلومات الرحلة والشركة واضحة قبل إتمام الحجز."],
            ].map(([Icon, title, text]) => {
              const IconComponent = Icon as typeof Search;
              return <div key={title as string} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><IconComponent className="size-5 text-[#0b2b55]" /><h2 className="mt-4 font-black text-slate-900">{title as string}</h2><p className="mt-2 text-xs leading-6 text-slate-500">{text as string}</p></div>;
            })}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-end justify-between gap-4"><div><p className="text-xs font-black text-[#0b2b55]">رحلات متاحة</p><h2 className="mt-1 text-2xl font-black text-slate-900">اكتشف الرحلات</h2></div><Link to="/customer/trips" className="flex items-center gap-1 text-sm font-bold text-[#0b2b55]">عرض الكل <ChevronLeft className="size-4" /></Link></div>
          {trips === undefined ? <div className="rounded-2xl border bg-white p-8 text-center text-sm text-slate-500">جاري تحميل الرحلات...</div> : trips.length === 0 ? <div className="rounded-2xl border bg-white p-8 text-center"><BusFront className="mx-auto size-8 text-slate-300" /><p className="mt-3 font-bold text-slate-700">لا توجد رحلات مطابقة حاليًا</p><p className="mt-1 text-xs text-slate-500">جرّب تغيير مدينة المغادرة أو الوجهة أو التاريخ.</p></div> : <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{trips.slice(0, 6).map((trip: any) => <TripCard key={trip._id} trip={trip} />)}</div>}
        </section>

        <section className="bg-white py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-7 flex items-end justify-between"><div><p className="text-xs font-black text-[#0b2b55]">شركاؤنا</p><h2 className="mt-1 text-2xl font-black text-slate-900">شركات النقل المشاركة</h2></div><Link to="/customer/companies" className="text-sm font-bold text-[#0b2b55]">استعرض الشركات</Link></div>
            {companies === undefined ? <div className="text-sm text-slate-500">جاري التحميل...</div> : companies.length === 0 ? <div className="rounded-2xl border border-dashed p-8 text-center text-sm text-slate-500">ستظهر شركات النقل المشاركة هنا عند توفرها.</div> : <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{companies.slice(0, 8).map((company: any) => <Link key={company._id} to={`/company/${company.slug || company._id}`} className="rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:-translate-y-0.5 hover:border-[#0b2b55]/30 hover:bg-white hover:shadow-md"><div className="flex items-center gap-3"><div className="flex size-11 items-center justify-center rounded-xl bg-[#0b2b55]/10 text-[#0b2b55]"><Building2 className="size-5" /></div><div><h3 className="font-black text-slate-900">{company.name}</h3><p className="mt-1 text-xs text-slate-500">شركة نقل مستقلة</p></div></div></Link>)}</div>}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="rounded-3xl bg-[#071d38] p-7 text-white lg:col-span-2"><WalletCards className="size-7" /><h2 className="mt-5 text-2xl font-black">منصة واحدة لمقارنة خياراتك</h2><p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">خطوط زحل منصة رقمية تربط المسافر بشركات النقل البري المستقلة. نحن لا نملك الحافلات ولا ننفذ الرحلات؛ شركة النقل الموضحة في الحجز هي المسؤولة عن تنفيذ الرحلة.</p></div>
            <div className="rounded-3xl border bg-white p-7"><CircleHelp className="size-7 text-[#0b2b55]" /><h2 className="mt-5 text-xl font-black">تحتاج مساعدة؟</h2><p className="mt-2 text-sm leading-6 text-slate-500">اطلع على معلومات التواصل والأسئلة الشائعة.</p><Link to="/customer/contact" className="mt-5 inline-flex text-sm font-black text-[#0b2b55]">تواصل معنا <ChevronLeft className="mr-1 size-4" /></Link></div>
          </div>
        </section>
      </main>
    </CustomerLayout>
  );
}
