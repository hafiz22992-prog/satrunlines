import { Button } from "@/components/ui/button";
import { useLocations } from "@/hooks/use-locations";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { ArrowLeft, BusFront, CalendarDays, CheckCircle2, ChevronLeft, Compass, MapPin, Search, ShieldCheck, Star, Ticket, Users } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { CustomerLayout } from "@/components/CustomerLayout";
import { TripCard } from "@/components/customer/TripCard";

const HERO_IMAGE = "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=2200&q=88";

const destinations = [
  { name: "صنعاء", image: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1200&q=85" },
  { name: "عدن", image: "https://images.unsplash.com/photo-1509749837427-ac94a2553d0e?auto=format&fit=crop&w=1200&q=85" },
  { name: "حضرموت", image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=85" },
];

export default function CustomerHome() {
  const navigate = useNavigate();
  const { saudiCities, yemenCities, isLoading: citiesLoading } = useLocations();
  const trips = useQuery(api.trips.list, {});
  const companies = useQuery(api.companies.listActive);

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [passengers, setPassengers] = useState("1");

  const search = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    if (date) params.set("date", date);
    if (passengers) params.set("passengers", passengers);
    navigate(`/customer/trips${params.toString() ? `?${params.toString()}` : ""}`);
  };

  const featuredTrips = (trips ?? []).filter((trip) => trip.active !== false).slice(0, 3);

  return (
    <CustomerLayout>
      <main className="overflow-hidden bg-[#f5f7fa]">
        <section className="relative min-h-[610px] overflow-visible bg-[#061a38]">
          <div className="absolute inset-0">
            <img src={HERO_IMAGE} alt="حافلة سفر حقيقية على طريق مفتوح" className="h-full w-full object-cover object-center" />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(3,17,39,.98)_0%,rgba(5,25,53,.88)_34%,rgba(5,25,53,.48)_68%,rgba(5,25,53,.12)_100%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(3,17,39,.92)_0%,transparent_52%,rgba(3,17,39,.18)_100%)]" />
          </div>

          <div className="relative mx-auto max-w-7xl px-4 pb-40 pt-16 sm:px-6 lg:pb-44 lg:pt-24">
            <div className="max-w-2xl text-white">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-black backdrop-blur-md">
                <Compass className="size-4 text-[#f2c45f]" />
                منصة مقارنة وحجز النقل البري
              </div>
              <h1 className="text-4xl font-black leading-[1.08] tracking-tight sm:text-5xl lg:text-[64px]">
                إلى اليمن…
                <br />
                <span className="text-[#f2c45f]">رحلتك تبدأ من اختيارك</span>
              </h1>
              <p className="mt-6 max-w-xl text-sm leading-8 text-white/80 sm:text-base">
                قارن الرحلات وشركات النقل المستقلة والأسعار والمقاعد، ثم اختر الرحلة المناسبة لك من مكان واحد.
              </p>
              <div className="mt-7 flex flex-wrap gap-3 text-xs font-bold text-white/90">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-2 backdrop-blur"><CheckCircle2 className="size-3.5 text-[#f2c45f]" />خيارات نقل متعددة</span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-2 backdrop-blur"><CheckCircle2 className="size-3.5 text-[#f2c45f]" />أسعار ومقاعد واضحة</span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-2 backdrop-blur"><CheckCircle2 className="size-3.5 text-[#f2c45f]" />حجز وتذكرة إلكترونية</span>
              </div>
            </div>
          </div>

          <div className="absolute inset-x-0 -bottom-28 z-20 px-4 sm:-bottom-24 sm:px-6">
            <form onSubmit={search} className="mx-auto max-w-7xl rounded-[28px] border border-slate-200 bg-white p-4 shadow-[0_24px_80px_rgba(2,19,45,.25)] sm:p-6">
              <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-black text-[#082750]">أين تريد أن تذهب؟</h2>
                  <p className="mt-1 text-xs font-medium text-slate-500">ابدأ بالبحث، وسنترك لك مقارنة الخيارات.</p>
                </div>
                <span className="hidden items-center gap-2 rounded-full bg-[#f8f4e9] px-3 py-2 text-[11px] font-black text-[#8a641d] sm:inline-flex"><ShieldCheck className="size-4" />حجز عبر منصة خطوط زحل</span>
              </div>

              <div className="grid gap-3 lg:grid-cols-[1fr_1fr_1fr_180px_auto]">
                <label className="block rounded-2xl border border-slate-200 bg-slate-50 p-3 transition focus-within:border-[#0b2b55] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#0b2b55]/10">
                  <span className="flex items-center gap-1.5 text-[11px] font-black text-slate-500"><MapPin className="size-3.5 text-[#0b2b55]" />مدينة المغادرة</span>
                  <select value={from} onChange={(e) => setFrom(e.target.value)} disabled={citiesLoading} className="mt-1 h-8 w-full bg-transparent text-sm font-black text-[#082750] outline-none">
                    <option value="">اختر مدينة في السعودية</option>
                    {saudiCities.map((city) => <option key={city} value={city}>{city}</option>)}
                  </select>
                </label>

                <label className="block rounded-2xl border border-slate-200 bg-slate-50 p-3 transition focus-within:border-[#0b2b55] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#0b2b55]/10">
                  <span className="flex items-center gap-1.5 text-[11px] font-black text-slate-500"><MapPin className="size-3.5 text-emerald-700" />مدينة الوصول</span>
                  <select value={to} onChange={(e) => setTo(e.target.value)} disabled={citiesLoading} className="mt-1 h-8 w-full bg-transparent text-sm font-black text-[#082750] outline-none">
                    <option value="">اختر مدينة في اليمن</option>
                    {yemenCities.map((city) => <option key={city} value={city}>{city}</option>)}
                  </select>
                </label>

                <label className="block rounded-2xl border border-slate-200 bg-slate-50 p-3 transition focus-within:border-[#0b2b55] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#0b2b55]/10">
                  <span className="flex items-center gap-1.5 text-[11px] font-black text-slate-500"><CalendarDays className="size-3.5 text-[#0b2b55]" />موعد السفر</span>
                  <input type="date" value={date} onChange={(e) => setDate(e.target.value)} min={new Date().toISOString().slice(0, 10)} className="mt-1 h-8 w-full bg-transparent text-sm font-black text-[#082750] outline-none" />
                </label>

                <label className="block rounded-2xl border border-slate-200 bg-slate-50 p-3 transition focus-within:border-[#0b2b55] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#0b2b55]/10">
                  <span className="flex items-center gap-1.5 text-[11px] font-black text-slate-500"><Users className="size-3.5 text-[#0b2b55]" />المسافرون</span>
                  <select value={passengers} onChange={(e) => setPassengers(e.target.value)} className="mt-1 h-8 w-full bg-transparent text-sm font-black text-[#082750] outline-none">
                    <option value="1">1 مسافر</option>
                    <option value="2">2 مسافرين</option>
                    <option value="3">3 مسافرين</option>
                    <option value="4">4 مسافرين</option>
                    <option value="5">5 مسافرين</option>
                    <option value="6">6 مسافرين</option>
                  </select>
                </label>

                <Button type="submit" className="h-[68px] gap-2 rounded-2xl bg-[#d6a13c] px-8 text-base font-black text-[#071a3a] shadow-lg shadow-[#d6a13c]/20 hover:bg-[#c58f2d]">
                  <Search className="size-5" />
                  ابحث عن الرحلات
                </Button>
              </div>
            </form>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-12 pt-44 sm:px-6 sm:pt-36">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[#0b2b55]/7 text-[#0b2b55]"><BusFront className="size-5" /></span>
              <div><p className="font-black text-[#082750]">قارن الخيارات</p><p className="mt-1 text-xs leading-5 text-slate-500">رحلات من شركات نقل مستقلة.</p></div>
            </div>
            <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[#d6a13c]/12 text-[#9b6b17]"><Ticket className="size-5" /></span>
              <div><p className="font-black text-[#082750]">احجز من مكان واحد</p><p className="mt-1 text-xs leading-5 text-slate-500">اختيار وحجز وتذكرة إلكترونية.</p></div>
            </div>
            <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700"><Users className="size-5" /></span>
              <div><p className="font-black text-[#082750]">منصة للمسافر</p><p className="mt-1 text-xs leading-5 text-slate-500">خطوط زحل لا تملك الحافلات ولا تنفذ الرحلات.</p></div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-black text-[#b78327]">اكتشف خياراتك</p>
              <h2 className="mt-1 text-2xl font-black text-[#082750] sm:text-3xl">وجهات يكثر البحث عنها</h2>
            </div>
            <Link to="/customer/trips" className="hidden items-center gap-1 text-sm font-black text-[#3974b9] sm:inline-flex">عرض الرحلات <ChevronLeft className="size-4" /></Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {destinations.map((destination) => (
              <button key={destination.name} type="button" onClick={() => navigate(`/customer/trips?to=${encodeURIComponent(destination.name)}`)} className="group relative h-52 overflow-hidden rounded-[24px] text-right shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                <img src={destination.image} alt={destination.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#04152d]/90 via-[#04152d]/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 text-white"><p className="text-xl font-black">{destination.name}</p><span className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-white/80">استكشف الرحلات <ArrowLeft className="size-3.5 transition group-hover:-translate-x-1" /></span></div>
              </button>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div><p className="text-xs font-black text-[#b78327]">متاح الآن</p><h2 className="mt-1 text-2xl font-black text-[#082750] sm:text-3xl">رحلات مقترحة</h2></div>
            <Link to="/customer/trips" className="inline-flex items-center gap-1 text-sm font-black text-[#3974b9]">كل الرحلات <ChevronLeft className="size-4" /></Link>
          </div>
          {trips === undefined ? (
            <div className="rounded-[24px] border border-slate-200 bg-white p-8 text-center text-sm font-bold text-slate-500">جاري تحميل الرحلات…</div>
          ) : featuredTrips.length === 0 ? (
            <div className="rounded-[24px] border border-slate-200 bg-white p-8 text-center text-sm font-bold text-slate-500">لا توجد رحلات منشورة حالياً.</div>
          ) : (
            <div className="grid gap-4">{featuredTrips.map((trip) => <TripCard key={trip._id} trip={trip} companyName={companies?.find((company) => company.slug === trip.companyId)?.name} vip={trip.totalSeats <= 30} />)}</div>
          )}
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
          <div className="rounded-[28px] bg-[#082750] px-6 py-8 text-white sm:px-10 sm:py-10">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div><p className="text-xl font-black">جاهز لاختيار رحلتك؟</p><p className="mt-2 max-w-xl text-sm leading-7 text-white/70">ابحث وقارن الرحلات المتاحة بين السعودية واليمن، ثم اختر شركة النقل المنفذة للرحلة التي تناسبك.</p></div>
              <Button asChild className="h-12 shrink-0 rounded-xl bg-[#d6a13c] px-7 font-black text-[#071a3a] hover:bg-[#c58f2d]"><Link to="/customer/trips">استعرض الرحلات <ArrowLeft className="mr-2 size-4" /></Link></Button>
            </div>
          </div>
        </section>

        <section className="border-t border-slate-200 bg-white">
          <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:px-6 md:grid-cols-3">
            <div><ShieldCheck className="size-6 text-[#c99737]" /><p className="mt-3 font-black text-[#082750]">منصة محايدة</p><p className="mt-1 text-xs leading-6 text-slate-500">خطوط زحل تربط المسافر بشركات النقل المستقلة ولا تملك الحافلات.</p></div>
            <div><Star className="size-6 text-[#c99737]" /><p className="mt-3 font-black text-[#082750]">مقارنة أوضح</p><p className="mt-1 text-xs leading-6 text-slate-500">اعرض السعر والموعد والمقاعد ومعلومات الشركة قبل اختيار الرحلة.</p></div>
            <div><CheckCircle2 className="size-6 text-[#c99737]" /><p className="mt-3 font-black text-[#082750]">رحلتك تحت اختيارك</p><p className="mt-1 text-xs leading-6 text-slate-500">الحجز يصدر عبر المنصة، والتنفيذ يتم بواسطة شركة النقل الموضحة في التذكرة.</p></div>
          </div>
        </section>
      </main>
    </CustomerLayout>
  );
}
