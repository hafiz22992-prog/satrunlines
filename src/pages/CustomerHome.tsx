import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookingForm } from "@/components/BookingForm";
import { BookingsList } from "@/components/BookingsList";
import { useAuth } from "@/hooks/use-auth";
import { useLocations } from "@/hooks/use-locations";
import { api } from "@/convex/_generated/api";
import { useConvexAuth, useQuery } from "convex/react";
import {
  Armchair,
  ArrowLeft,
  Bus,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  Clock3,
  Headphones,
  LogOut,
  MapPin,
  Search,
  ShieldCheck,
  Ticket,
  User,
  WalletCards,
} from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { toArabicIndic } from "@/lib/arabic";

const WEEKDAYS = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
const HERO_IMAGE =
  "https://images.unsplash.com/photo-1562828709-4be7bdbe13c2?auto=format&fit=crop&fm=jpg&q=82&w=2200";

function tripRunsOnDate(days: string[] | undefined, date: string) {
  if (!date || !days?.length) return true;
  if (days.includes("يومياً")) return true;
  const day = WEEKDAYS[new Date(`${date}T12:00:00`).getDay()];
  return days.includes(day);
}

export default function CustomerHome() {
  const { user, signOut } = useAuth();
  const { isAuthenticated } = useConvexAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { saudiCities, yemenCities, isLoading: citiesLoading } = useLocations();

  // كل بيانات الرحلات والشركات والحجوزات تأتي من Convex — لا توجد أسعار أو رحلات تجريبية هنا.
  const trips = useQuery(api.trips.list, {});
  const companies = useQuery(api.companies.listActive);
  const bookings = useQuery(api.bookings.list);

  const initialFrom = searchParams.get("from") ?? "";
  const initialTo = searchParams.get("to") ?? "";
  const initialDate = searchParams.get("date") ?? "";
  const [quickFrom, setQuickFrom] = useState(initialFrom);
  const [quickTo, setQuickTo] = useState(initialTo);
  const [quickDate, setQuickDate] = useState(initialDate);

  const companyBySlug = useMemo(
    () => new Map((companies ?? []).map((company) => [company.slug, company])),
    [companies],
  );

  const visibleTrips = useMemo(() => {
    return (trips ?? [])
      .filter((trip) => trip.active !== false)
      .filter((trip) => !quickFrom || trip.from === quickFrom)
      .filter((trip) => !quickTo || trip.to === quickTo)
      .filter((trip) => tripRunsOnDate(trip.days, quickDate));
  }, [trips, quickFrom, quickTo, quickDate]);

  const featuredTrips = visibleTrips.slice(0, 6);
  const confirmedCount = useMemo(
    () => (bookings ?? []).filter((booking) => booking.status === "confirmed").length,
    [bookings],
  );

  const handleQuickSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (quickFrom) params.set("from", quickFrom);
    if (quickTo) params.set("to", quickTo);
    if (quickDate) params.set("date", quickDate);
    const query = params.toString();
    navigate(query ? `/customer?${query}` : "/customer", { replace: true });
    window.setTimeout(
      () => document.getElementById("trips")?.scrollIntoView({ behavior: "smooth", block: "start" }),
      50,
    );
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const bookingHref = (from: string, to: string) =>
    `/customer?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}#booking`;

  const selectClass =
    "h-14 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold outline-none transition focus:border-[#0b2b55] focus:ring-4 focus:ring-[#0b2b55]/10 cursor-pointer";

  return (
    <div dir="rtl" className="min-h-screen bg-[#f7f8fb] text-slate-900 selection:bg-[#e5b34f]/30">
      <header className="sticky top-0 z-50 border-b border-white/50 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link to="/customer" className="flex min-w-0 items-center gap-3">
            <img src="/saturn-lines-logo.svg" alt="خطوط زحل" className="h-11 w-auto shrink-0" />
            <div className="hidden border-r border-slate-200 pr-3 sm:block">
              <p className="font-black tracking-tight text-[#0b2b55]">خطوط زحل</p>
              <p className="text-[11px] text-slate-500">منصة مقارنة وحجز النقل البري</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-7 text-sm font-bold text-slate-600 lg:flex">
            <a href="#top" className="text-[#0b2b55] transition hover:text-[#d09a34]">الرئيسية</a>
            <a href="#trips" className="transition hover:text-[#0b2b55]">الرحلات</a>
            <a href="#companies" className="transition hover:text-[#0b2b55]">شركات النقل</a>
            <a href="#booking" className="transition hover:text-[#0b2b55]">الحجز</a>
            <a href="#footer" className="transition hover:text-[#0b2b55]">تواصل معنا</a>
          </nav>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <div className="hidden text-left sm:block">
                <p className="text-sm font-black text-[#0b2b55]">{user?.name || user?.email || "مسافر"}</p>
                <p className="text-[11px] text-slate-500">
                  {confirmedCount ? `${toArabicIndic(confirmedCount)} حجوزات مؤكدة` : "حساب مسافر"}
                </p>
              </div>
            )}
            {isAuthenticated ? (
              <Button type="button" variant="outline" size="sm" className="gap-1.5 rounded-xl" onClick={handleSignOut}>
                <LogOut className="size-4" />
                خروج
              </Button>
            ) : (
              <Button asChild size="sm" className="gap-1.5 rounded-xl bg-[#0b2b55] shadow-sm hover:bg-[#123d72]">
                <Link to="/auth"><User className="size-4" />تسجيل الدخول</Link>
              </Button>
            )}
          </div>
        </div>
      </header>

      <main id="top">
        {/* Hero حقيقي: صورة فوتوغرافية + طبقات إضاءة، بينما البحث والبيانات حقيقية من Convex. */}
        <section className="relative isolate min-h-[690px] overflow-visible bg-[#06152d]">
          <img
            src={HERO_IMAGE}
            alt="حافلة في رحلة عبر الصحراء"
            className="absolute inset-0 -z-20 h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(4,20,45,.96)_0%,rgba(5,25,53,.82)_38%,rgba(5,25,53,.28)_72%,rgba(5,25,53,.12)_100%)]" />
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(0deg,rgba(4,20,45,.95)_0%,transparent_38%,rgba(4,20,45,.12)_100%)]" />
          <div className="absolute right-[8%] top-24 -z-10 size-44 rounded-full bg-[#e5b34f]/20 blur-3xl" />

          <div className="mx-auto max-w-7xl px-4 pb-40 pt-20 sm:px-6 sm:pt-28">
            <div className="max-w-2xl">
              <Badge className="mb-6 gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-white shadow-lg backdrop-blur-md">
                <ShieldCheck className="size-4 text-[#f2c45f]" />
                منصة تجمعك بشركات النقل المستقلة
              </Badge>
              <h1 className="text-4xl font-black leading-[1.12] tracking-tight text-white sm:text-6xl lg:text-7xl">
                سافر بثقة،
                <br />
                <span className="text-[#f2c45f]">واحجز رحلتك</span>
                <br />
                من مكان واحد
              </h1>
              <p className="mt-6 max-w-xl text-base leading-8 text-white/85 sm:text-lg">
                قارن الرحلات المتاحة من شركات النقل البري، اعرف السعر والمقاعد وموعد الانطلاق، ثم أكمل حجزك من خلال المنصة.
              </p>
              <div className="mt-7 flex flex-wrap gap-3 text-xs font-bold text-white/80">
                <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2 backdrop-blur">بيانات رحلات فعلية</span>
                <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2 backdrop-blur">شركات نقل مستقلة</span>
                <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2 backdrop-blur">حجز من حسابك</span>
              </div>
            </div>
          </div>

          <div className="absolute inset-x-0 bottom-0 translate-y-1/2 px-4 sm:px-6">
            <form
              id="search"
              onSubmit={handleQuickSearch}
              className="mx-auto max-w-7xl rounded-[28px] border border-white/60 bg-white p-4 shadow-[0_25px_70px_rgba(2,18,42,.25)] sm:p-6"
            >
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-lg font-black text-[#0b2b55]">إلى أين تريد السفر؟</p>
                  <p className="mt-1 text-xs text-slate-500">ابحث في الرحلات المنشورة فعلياً على المنصة</p>
                </div>
                <div className="hidden items-center gap-2 rounded-full bg-[#f5f7fa] px-3 py-2 text-xs font-bold text-slate-500 sm:flex">
                  <ShieldCheck className="size-4 text-[#d09a34]" />
                  نتائج مرتبطة بقاعدة بيانات الرحلات
                </div>
              </div>

              <div className="grid gap-3 lg:grid-cols-[1fr_1fr_1fr_auto]">
                <div className="relative">
                  <label htmlFor="qs-from" className="mb-2 flex items-center gap-2 text-xs font-black text-slate-600">
                    <span className="flex size-7 items-center justify-center rounded-lg bg-[#0b2b55]/5 text-[#0b2b55]"><MapPin className="size-4" /></span>
                    من السعودية
                  </label>
                  <select id="qs-from" value={quickFrom} onChange={(e) => setQuickFrom(e.target.value)} disabled={citiesLoading} className={selectClass}>
                    <option value="">كل المدن</option>
                    {saudiCities.map((city) => <option key={city} value={city}>{city}</option>)}
                  </select>
                </div>

                <div>
                  <label htmlFor="qs-to" className="mb-2 flex items-center gap-2 text-xs font-black text-slate-600">
                    <span className="flex size-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700"><MapPin className="size-4" /></span>
                    إلى اليمن
                  </label>
                  <select id="qs-to" value={quickTo} onChange={(e) => setQuickTo(e.target.value)} disabled={citiesLoading} className={selectClass}>
                    <option value="">كل المدن</option>
                    {yemenCities.map((city) => <option key={city} value={city}>{city}</option>)}
                  </select>
                </div>

                <div>
                  <label htmlFor="qs-date" className="mb-2 flex items-center gap-2 text-xs font-black text-slate-600">
                    <span className="flex size-7 items-center justify-center rounded-lg bg-[#0b2b55]/5 text-[#0b2b55]"><CalendarDays className="size-4" /></span>
                    تاريخ السفر
                  </label>
                  <input id="qs-date" type="date" value={quickDate} onChange={(e) => setQuickDate(e.target.value)} min={new Date().toISOString().slice(0, 10)} className={selectClass} />
                </div>

                <div className="flex items-end">
                  <Button type="submit" size="lg" className="h-14 w-full gap-2 rounded-2xl bg-[#d9a441] px-8 text-base font-black text-[#071a3a] shadow-lg shadow-[#d9a441]/20 hover:bg-[#c89532] lg:w-auto">
                    <Search className="size-5" />
                    ابحث عن الرحلات
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </section>

        <section className="relative z-10 mx-auto max-w-7xl px-4 pt-28 sm:px-6 sm:pt-24">
          <div className="grid overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,.08)] md:grid-cols-4">
            {[
              [ShieldCheck, "شركات مستقلة", "قارن بين خيارات شركات النقل المتاحة"],
              [Armchair, "مقاعد واضحة", "اعتمد على المقاعد المسجلة للرحلة"],
              [WalletCards, "أسعار الرحلات", "السعر المعروض مرتبط ببيانات الرحلة"],
              [Headphones, "حجز منظم", "احتفظ بحجوزاتك وتذاكرك في حسابك"],
            ].map(([Icon, title, desc], index) => {
              const ItemIcon = Icon as typeof ShieldCheck;
              return (
                <div key={index} className="group flex items-center gap-4 border-b border-slate-100 p-5 last:border-0 md:border-b-0 md:border-l md:last:border-l-0">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[#0b2b55]/5 text-[#0b2b55] transition group-hover:bg-[#0b2b55] group-hover:text-white">
                    <ItemIcon className="size-6" />
                  </div>
                  <div>
                    <p className="font-black text-[#0b2b55]">{title as string}</p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">{desc as string}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section id="companies" className="mx-auto max-w-7xl scroll-mt-28 px-4 py-16 sm:px-6">
          <div className="mb-7 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="mb-1 text-sm font-bold text-[#c89532]">شركاء الرحلة</p>
              <h2 className="text-3xl font-black tracking-tight text-[#0b2b55]">شركات النقل المتاحة</h2>
              <p className="mt-2 text-sm text-slate-500">خيارات مستقلة تظهر حسب حالة النظام الحالية.</p>
            </div>
            <span className="rounded-full bg-white px-4 py-2 text-xs font-bold text-slate-500 shadow-sm ring-1 ring-slate-200">
              {companies === undefined ? "جاري التحميل…" : `${toArabicIndic(companies.length)} شركات مسجلة`}
            </span>
          </div>

          {companies === undefined ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-36 animate-pulse rounded-3xl border bg-white" />)}
            </div>
          ) : companies.length === 0 ? (
            <div className="rounded-3xl border border-dashed bg-white p-10 text-center text-slate-500">لا توجد شركات نقل نشطة حالياً.</div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {companies.map((company) => (
                <Link key={company.slug} to={bookingHref(quickFrom, quickTo)} className="group rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-[#d9a441]/50 hover:shadow-xl">
                  <div className="flex items-center gap-3">
                    {company.logo ? (
                      <img src={company.logo} alt="" className="size-14 rounded-2xl object-contain ring-1 ring-slate-100" />
                    ) : (
                      <div className="flex size-14 items-center justify-center rounded-2xl bg-[#0b2b55]/5 text-[#0b2b55]"><Bus className="size-7" /></div>
                    )}
                    <div className="min-w-0">
                      <p className="truncate font-black text-[#0b2b55]">{company.name}</p>
                      <p className="mt-1 text-xs text-slate-500">شركة نقل مستقلة</p>
                    </div>
                  </div>
                  {company.base && <p className="mt-4 flex items-center gap-1.5 text-xs text-slate-500"><MapPin className="size-3.5" />{company.base}</p>}
                  <div className="mt-5 flex items-center justify-between text-xs font-black text-[#0b2b55]"><span>عرض الرحلات والحجز</span><ChevronLeft className="size-4 transition group-hover:-translate-x-1" /></div>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section id="trips" className="scroll-mt-28 bg-white py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="mb-7 flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="mb-1 text-sm font-bold text-[#c89532]">البيانات الحية</p>
                <h2 className="text-3xl font-black tracking-tight text-[#0b2b55]">الرحلات المتاحة</h2>
                <p className="mt-2 text-sm text-slate-500">نتائج مطابقة للمرشحات الحالية من Convex.</p>
              </div>
              <span className="text-sm font-bold text-slate-500">{trips === undefined ? "جاري التحميل…" : `${toArabicIndic(visibleTrips.length)} رحلة مطابقة`}</span>
            </div>

            {trips === undefined ? (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-60 animate-pulse rounded-3xl border bg-slate-50" />)}
              </div>
            ) : featuredTrips.length === 0 ? (
              <div className="rounded-3xl border border-dashed bg-slate-50 p-12 text-center">
                <Bus className="mx-auto size-11 text-slate-300" />
                <h3 className="mt-4 font-black text-[#0b2b55]">لا توجد رحلة مطابقة لبحثك</h3>
                <p className="mt-1 text-sm text-slate-500">جرّب مدينة أخرى أو أزل تاريخ السفر والمرشحات.</p>
                <Button type="button" variant="outline" className="mt-5 rounded-xl" onClick={() => { setQuickFrom(""); setQuickTo(""); setQuickDate(""); navigate("/customer", { replace: true }); }}>إظهار كل الرحلات</Button>
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {featuredTrips.map((trip) => {
                  const company = companyBySlug.get(trip.companyId);
                  const soldOut = trip.availableSeats <= 0;
                  return (
                    <article key={trip._id} className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                      <div className="relative overflow-hidden bg-[#071a3a] px-5 py-5 text-white">
                        <div className="absolute -left-8 -top-12 size-32 rounded-full bg-[#e5b34f]/15 blur-2xl" />
                        <div className="relative flex items-center justify-between gap-3">
                          <div className="flex min-w-0 items-center gap-2">
                            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/10"><Bus className="size-5 text-[#e5b34f]" /></span>
                            <span className="truncate text-sm font-black">{company?.name ?? "شركة نقل"}</span>
                          </div>
                          <Badge className="shrink-0 rounded-full border-white/20 bg-white/10 text-white">{soldOut ? "مكتملة" : `${toArabicIndic(trip.availableSeats)} مقعد`}</Badge>
                        </div>
                      </div>
                      <div className="p-5">
                        <div className="flex items-center justify-between gap-3">
                          <div><p className="text-xs text-slate-400">من</p><p className="mt-1 font-black text-[#0b2b55]">{trip.from}</p></div>
                          <div className="flex flex-1 items-center gap-2"><div className="h-px flex-1 bg-slate-200" /><ArrowLeft className="size-4 text-[#d09a34]" /><div className="h-px flex-1 bg-slate-200" /></div>
                          <div className="text-left"><p className="text-xs text-slate-400">إلى</p><p className="mt-1 font-black text-[#0b2b55]">{trip.to}</p></div>
                        </div>
                        <div className="mt-5 grid grid-cols-2 gap-3 rounded-2xl bg-slate-50 p-3 text-sm">
                          <div className="flex items-center gap-2"><Clock3 className="size-4 text-[#0b2b55]" /><span>الانطلاق <b>{trip.departureTime}</b></span></div>
                          <div className="flex items-center gap-2"><WalletCards className="size-4 text-[#0b2b55]" /><span><b>{toArabicIndic(trip.price)}</b> ريال</span></div>
                        </div>
                        <p className="mt-3 text-xs text-slate-500">أيام التشغيل: {trip.days?.join("، ") || "حسب جدول الشركة"}</p>
                        <Button asChild disabled={soldOut} className="mt-4 w-full gap-2 rounded-2xl bg-[#0b2b55] hover:bg-[#123d72]">
                          <a href={soldOut ? "#trips" : bookingHref(trip.from, trip.to)}><Ticket className="size-4" />{soldOut ? "لا توجد مقاعد متاحة" : "ابدأ حجز هذه الرحلة"}</a>
                        </Button>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <div className="overflow-hidden rounded-[32px] bg-[#071a3a] p-7 text-white shadow-2xl sm:p-10">
            <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <p className="text-sm font-bold text-[#e5b34f]">تجربة واضحة من البداية</p>
                <h2 className="mt-2 text-2xl font-black sm:text-3xl">ابحث، قارن، احجز، ثم تابع تذكرتك</h2>
                <p className="mt-3 max-w-2xl leading-8 text-white/65">خطوط زحل لا تملك الحافلات ولا تعمل كشركة نقل؛ دورها هو جمع المسافر مع شركات النقل المستقلة وعرض الرحلات المتاحة في النظام.</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-3 lg:w-[620px]">
                {[
                  [Search, "١", "ابحث عن وجهتك"],
                  [WalletCards, "٢", "قارن الرحلات والشركات"],
                  [CheckCircle2, "٣", "أكمل الحجز وتابع التذكرة"],
                ].map(([Icon, number, title]) => {
                  const ItemIcon = Icon as typeof Search;
                  return <div key={number as string} className="rounded-2xl border border-white/10 bg-white/5 p-4"><div className="flex items-center justify-between"><ItemIcon className="size-5 text-[#e5b34f]" /><span className="text-xs text-white/40">{number as string}</span></div><p className="mt-4 text-sm font-bold">{title as string}</p></div>;
                })}
              </div>
            </div>
          </div>
        </section>

        <section id="booking" className="scroll-mt-28 border-t bg-[#f7f8fb] py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="mb-7">
              <p className="mb-1 text-sm font-bold text-[#c89532]">الحجز الفعلي</p>
              <h2 className="text-3xl font-black tracking-tight text-[#0b2b55]">أكمل بيانات المسافر واختر الرحلة</h2>
              <p className="mt-2 text-sm text-slate-500">نستخدم نموذج الحجز الحالي المتصل بـ Convex، ولا ننشئ بيانات تجريبية.</p>
            </div>
            <BookingForm key={`${initialFrom}-${initialTo}`} initialFrom={initialFrom || undefined} initialTo={initialTo || undefined} />
          </div>
        </section>

        {isAuthenticated && (
          <section className="border-t bg-white py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
              <div className="mb-7 flex items-center gap-2"><Ticket className="size-5 text-[#0b2b55]" /><h2 className="text-3xl font-black text-[#0b2b55]">حجوزاتي</h2></div>
              <BookingsList />
            </div>
          </section>
        )}
      </main>

      <footer id="footer" className="bg-[#04142d] text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-3">
              <img src="/saturn-lines-logo.svg" alt="خطوط زحل" className="h-12 w-auto brightness-0 invert" />
              <div><p className="font-black">خطوط زحل</p><p className="text-xs text-white/45">منصة مقارنة وحجز</p></div>
            </div>
            <p className="mt-5 max-w-md text-sm leading-8 text-white/60">منصة تربط المسافرين بشركات النقل البري المستقلة العاملة بين السعودية واليمن. خطوط زحل ليست شركة نقل ولا تملك الحافلات.</p>
          </div>
          <div>
            <h3 className="font-black">روابط سريعة</h3>
            <div className="mt-4 grid gap-3 text-sm text-white/55"><a href="#trips" className="transition hover:text-white">الرحلات المتاحة</a><a href="#companies" className="transition hover:text-white">شركات النقل</a><a href="#booking" className="transition hover:text-white">الحجز</a><a href="#top" className="transition hover:text-white">العودة للأعلى</a></div>
          </div>
          <div>
            <h3 className="font-black">معلومات المنصة</h3>
            <p className="mt-4 flex items-start gap-2 text-sm leading-8 text-white/55"><ShieldCheck className="mt-2 size-4 shrink-0 text-[#e5b34f]" />الرحلات والأسعار والمقاعد التي تظهر للمسافر مرتبطة ببيانات النظام الحالية، بينما تنفيذ النقل يتم بواسطة شركة النقل المستقلة.</p>
          </div>
        </div>
        <div className="border-t border-white/10"><div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-xs text-white/35 sm:flex-row sm:items-center sm:justify-between"><span>© خطوط زحل — منصة النقل البري</span><span>السعودية ← اليمن</span></div></div>
      </footer>
    </div>
  );
}
