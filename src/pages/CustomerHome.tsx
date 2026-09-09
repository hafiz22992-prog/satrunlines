import { Button } from "@/components/ui/button";
import { useLocations } from "@/hooks/use-locations";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import {
  ArrowLeft,
  BusFront,
  CalendarDays,
  ChevronLeft,
  CircleHelp,
  Compass,
  MapPin,
  Search,
  ShieldCheck,
  Ticket,
  Building2,
  WalletCards,
} from "lucide-react";
import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { CustomerLayout } from "@/components/CustomerLayout";

const HERO_IMAGE =
  "https://en.yutong.com/res/res/2024/3/7/product/productCatPic/8ac292568d4047ec018e16ae18c80031.webp";

export default function CustomerHome() {
  const navigate = useNavigate();
  const { saudiCities, yemenCities, isLoading: citiesLoading } = useLocations();
  const trips = useQuery(api.trips.list, {});
  const companies = useQuery(api.companies.listActive);

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");

  const search = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    if (date) params.set("date", date);
    navigate(`/customer/trips${params.toString() ? `?${params.toString()}` : ""}`);
  };

  const quickLink = (href: string) => navigate(href);

  return (
    <CustomerLayout>
      <main className="bg-[#f6f8fb]">
        {/* Premium hero: the coach stays visually secondary so the road and landscape remain visible. */}
        <section className="relative overflow-hidden bg-[#061a38]">
          <div className="absolute inset-0">
            <img
              src={HERO_IMAGE}
              alt="حافلة سفر حديثة على طريق مفتوح"
              className="h-full min-h-[570px] w-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(3,17,39,.96)_0%,rgba(5,25,53,.82)_30%,rgba(5,25,53,.38)_58%,rgba(5,25,53,.08)_100%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(3,17,39,.94)_0%,transparent_48%,rgba(3,17,39,.18)_100%)]" />
          </div>

          <div className="relative mx-auto grid min-h-[570px] max-w-7xl items-center gap-8 px-4 pb-32 pt-16 sm:px-6 lg:grid-cols-[.92fr_1.08fr]">
            <div className="max-w-xl text-white">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-black backdrop-blur-md">
                <Compass className="size-4 text-[#f2c45f]" />
                منصة مقارنة وحجز النقل البري
              </div>
              <h1 className="text-4xl font-black leading-[1.12] tracking-tight sm:text-5xl lg:text-6xl">
                رحلتك القادمة
                <br />
                <span className="text-[#f2c45f]">تبدأ من هنا</span>
              </h1>
              <p className="mt-5 max-w-lg text-sm leading-8 text-white/78 sm:text-base">
                ابحث عن الرحلات المنشورة، قارن شركات النقل المستقلة، واختر الرحلة التي تناسبك من مكان واحد.
              </p>
              <div className="mt-6 flex flex-wrap gap-2.5 text-xs font-bold">
                <span className="rounded-full border border-white/15 bg-white/10 px-3.5 py-2 backdrop-blur">شركات نقل مستقلة</span>
                <span className="rounded-full border border-white/15 bg-white/10 px-3.5 py-2 backdrop-blur">أسعار ومقاعد الرحلة</span>
                <span className="rounded-full border border-white/15 bg-white/10 px-3.5 py-2 backdrop-blur">حجز وتذاكر</span>
              </div>
            </div>

            <div className="hidden lg:block" aria-hidden="true" />
          </div>

          <div className="absolute inset-x-0 bottom-0 z-10 px-4 sm:px-6">
            <form onSubmit={search} className="mx-auto max-w-7xl rounded-[26px] border border-white/70 bg-white p-4 shadow-[0_24px_70px_rgba(1,15,36,.3)] sm:p-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-black text-[#082750] sm:text-lg">ابحث عن رحلتك</h2>
                  <p className="mt-1 text-[11px] text-slate-500">اختر مدينة المغادرة والوصول وتاريخ السفر</p>
                </div>
                <Search className="hidden size-5 text-[#c99737] sm:block" />
              </div>

              <div className="grid gap-3 md:grid-cols-[1fr_1fr_1fr_auto]">
                <label className="block">
                  <span className="mb-1.5 flex items-center gap-1.5 text-[11px] font-black text-slate-600"><MapPin className="size-3.5 text-[#0b2b55]" />من السعودية</span>
                  <select value={from} onChange={(e) => setFrom(e.target.value)} disabled={citiesLoading} className="h-13 h-[52px] w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-bold text-slate-800 outline-none transition focus:border-[#0b2b55] focus:bg-white focus:ring-4 focus:ring-[#0b2b55]/10">
                    <option value="">اختر مدينة المغادرة</option>
                    {saudiCities.map((city) => <option key={city} value={city}>{city}</option>)}
                  </select>
                </label>

                <label className="block">
                  <span className="mb-1.5 flex items-center gap-1.5 text-[11px] font-black text-slate-600"><MapPin className="size-3.5 text-emerald-700" />إلى اليمن</span>
                  <select value={to} onChange={(e) => setTo(e.target.value)} disabled={citiesLoading} className="h-[52px] w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-bold text-slate-800 outline-none transition focus:border-[#0b2b55] focus:bg-white focus:ring-4 focus:ring-[#0b2b55]/10">
                    <option value="">اختر مدينة الوصول</option>
                    {yemenCities.map((city) => <option key={city} value={city}>{city}</option>)}
                  </select>
                </label>

                <label className="block">
                  <span className="mb-1.5 flex items-center gap-1.5 text-[11px] font-black text-slate-600"><CalendarDays className="size-3.5 text-[#0b2b55]" />تاريخ السفر</span>
                  <input type="date" value={date} onChange={(e) => setDate(e.target.value)} min={new Date().toISOString().slice(0, 10)} className="h-[52px] w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-bold text-slate-800 outline-none transition focus:border-[#0b2b55] focus:bg-white focus:ring-4 focus:ring-[#0b2b55]/10" />
                </label>

                <div className="flex items-end">
                  <Button type="submit" className="h-[52px] w-full gap-2 rounded-xl bg-[#d6a13c] px-7 font-black text-[#071a3a] shadow-lg shadow-[#d6a13c]/20 hover:bg-[#c58f2d] md:w-auto">
                    <Search className="size-4" />
                    بحث
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </section>

        {/* Short navigation: each major passenger area has its own page. */}
        <section className="mx-auto max-w-7xl px-4 pb-10 pt-24 sm:px-6 sm:pt-20">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <Link to="/customer/trips" className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-[#d6a13c]/60 hover:shadow-lg">
              <span className="flex size-11 items-center justify-center rounded-xl bg-[#0b2b55]/7 text-[#0b2b55]"><BusFront className="size-5" /></span>
              <p className="mt-3 font-black text-[#0b2b55]">الرحلات</p>
              <p className="mt-1 text-xs leading-5 text-slate-500">تصفح وقارن الرحلات المتاحة</p>
              <ChevronLeft className="mt-3 size-4 text-[#c99737] transition group-hover:-translate-x-1" />
            </Link>

            <Link to="/customer/companies" className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-[#d6a13c]/60 hover:shadow-lg">
              <span className="flex size-11 items-center justify-center rounded-xl bg-[#0b2b55]/7 text-[#0b2b55]"><Building2 className="size-5" /></span>
              <p className="mt-3 font-black text-[#0b2b55]">شركات النقل</p>
              <p className="mt-1 text-xs leading-5 text-slate-500">تعرف على الشركات المستقلة</p>
              <ChevronLeft className="mt-3 size-4 text-[#c99737] transition group-hover:-translate-x-1" />
            </Link>

            <Link to="/customer/booking" className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-[#d6a13c]/60 hover:shadow-lg">
              <span className="flex size-11 items-center justify-center rounded-xl bg-[#0b2b55]/7 text-[#0b2b55]"><WalletCards className="size-5" /></span>
              <p className="mt-3 font-black text-[#0b2b55]">الحجز</p>
              <p className="mt-1 text-xs leading-5 text-slate-500">أكمل حجز رحلتك بسهولة</p>
              <ChevronLeft className="mt-3 size-4 text-[#c99737] transition group-hover:-translate-x-1" />
            </Link>

            <Link to="/customer/contact" className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-[#d6a13c]/60 hover:shadow-lg">
              <span className="flex size-11 items-center justify-center rounded-xl bg-[#0b2b55]/7 text-[#0b2b55]"><CircleHelp className="size-5" /></span>
              <p className="mt-3 font-black text-[#0b2b55]">المساعدة</p>
              <p className="mt-1 text-xs leading-5 text-slate-500">تواصل مع المنصة عند الحاجة</p>
              <ChevronLeft className="mt-3 size-4 text-[#c99737] transition group-hover:-translate-x-1" />
            </Link>

            <button type="button" onClick={() => quickLink("/customer/trips")} className="group rounded-2xl border border-[#d6a13c]/30 bg-[#fffaf0] p-4 text-right shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
              <span className="flex size-11 items-center justify-center rounded-xl bg-[#d6a13c]/15 text-[#9b6b17]"><Ticket className="size-5" /></span>
              <p className="mt-3 font-black text-[#0b2b55]">ابدأ الحجز</p>
              <p className="mt-1 text-xs leading-5 text-slate-500">اختر رحلة ثم انتقل للحجز</p>
              <ChevronLeft className="mt-3 size-4 text-[#c99737] transition group-hover:-translate-x-1" />
            </button>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <ShieldCheck className="size-6 text-[#c99737]" />
              <p className="mt-3 font-black text-[#0b2b55]">منصة محايدة</p>
              <p className="mt-1 text-xs leading-6 text-slate-500">خطوط زحل تربط المسافر بشركات النقل المستقلة ولا تملك الحافلات.</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <BusFront className="size-6 text-[#c99737]" />
              <p className="mt-3 font-black text-[#0b2b55]">بيانات حقيقية</p>
              <p className="mt-1 text-xs leading-6 text-slate-500">{trips === undefined ? "جاري تحميل بيانات الرحلات…" : `${trips.length} رحلة مسجلة حالياً في النظام.`}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <Building2 className="size-6 text-[#c99737]" />
              <p className="mt-3 font-black text-[#0b2b55]">خيارات النقل</p>
              <p className="mt-1 text-xs leading-6 text-slate-500">{companies === undefined ? "جاري تحميل الشركات…" : `${companies.length} شركة نقل نشطة متاحة حالياً.`}</p>
            </div>
          </div>
        </section>

        <section className="border-t border-slate-200 bg-white">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-xs text-slate-500 sm:px-6 md:flex-row md:items-center md:justify-between">
            <p>خطوط زحل — منصة مقارنة وحجز النقل البري بين السعودية واليمن.</p>
            <p className="font-bold text-[#0b2b55]">السعودية ← اليمن</p>
          </div>
        </section>
      </main>
    </CustomerLayout>
  );
}
