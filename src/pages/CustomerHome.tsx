import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookingForm } from "@/components/BookingForm";
import { BookingsList } from "@/components/BookingsList";
import { useAuth } from "@/hooks/use-auth";
import { useLocations } from "@/hooks/use-locations";
import { api } from "@/convex/_generated/api";
import { useConvexAuth, useQuery } from "convex/react";
import { Armchair, ArrowLeft, Bus, CalendarDays, CheckCircle2, ChevronLeft, Clock3, Headphones, LogOut, MapPin, Search, ShieldCheck, Ticket, User, WalletCards } from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { toArabicIndic } from "@/lib/arabic";

const WEEKDAYS = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];

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

  // الصفحة تقرأ الرحلات والشركات والحجوزات الفعلية من Convex ولا تستخدم بيانات تجريبية.
  const trips = useQuery(api.trips.list, {});
  const companies = useQuery(api.companies.listActive);
  const bookings = useQuery(api.bookings.list);

  const initialFrom = searchParams.get("from") ?? "";
  const initialTo = searchParams.get("to") ?? "";
  const initialDate = searchParams.get("date") ?? "";
  const [quickFrom, setQuickFrom] = useState(initialFrom);
  const [quickTo, setQuickTo] = useState(initialTo);
  const [quickDate, setQuickDate] = useState(initialDate);

  const companyBySlug = useMemo(() => new Map((companies ?? []).map((company) => [company.slug, company])), [companies]);

  const visibleTrips = useMemo(() => {
    return (trips ?? [])
      .filter((trip) => trip.active !== false)
      .filter((trip) => !quickFrom || trip.from === quickFrom)
      .filter((trip) => !quickTo || trip.to === quickTo)
      .filter((trip) => tripRunsOnDate(trip.days, quickDate));
  }, [trips, quickFrom, quickTo, quickDate]);

  const featuredTrips = visibleTrips.slice(0, 6);
  const confirmedCount = useMemo(() => (bookings ?? []).filter((booking) => booking.status === "confirmed").length, [bookings]);

  const handleQuickSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (quickFrom) params.set("from", quickFrom);
    if (quickTo) params.set("to", quickTo);
    if (quickDate) params.set("date", quickDate);
    const query = params.toString();
    navigate(query ? `/customer?${query}` : "/customer", { replace: true });
    window.setTimeout(() => document.getElementById("trips")?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const bookingHref = (from: string, to: string) => `/customer?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}#booking`;
  const selectClass = "h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-[#0b2b55] focus:ring-2 focus:ring-[#0b2b55]/10 cursor-pointer";

  return (
    <div dir="rtl" className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link to="/customer" className="flex min-w-0 items-center gap-3">
            <img src="/saturn-lines-logo.svg" alt="خطوط زحل" className="h-12 w-auto shrink-0" />
            <div className="hidden border-r border-slate-200 pr-3 sm:block">
              <p className="font-black text-[#0b2b55]">خطوط زحل</p>
              <p className="text-xs text-slate-500">حجوزات النقل البري من السعودية إلى اليمن</p>
            </div>
          </Link>
          <nav className="hidden items-center gap-7 text-sm font-bold text-slate-600 lg:flex">
            <a href="#top" className="text-[#0b2b55]">الصفحة الرئيسية</a>
            <a href="#trips" className="transition hover:text-[#0b2b55]">الرحلات</a>
            <a href="#booking" className="transition hover:text-[#0b2b55]">الحجز</a>
            <a href="#companies" className="transition hover:text-[#0b2b55]">شركات النقل</a>
            <a href="#footer" className="transition hover:text-[#0b2b55]">تواصل معنا</a>
          </nav>
          <div className="flex items-center gap-2">
            {isAuthenticated && <div className="hidden text-left sm:block"><p className="text-sm font-black text-[#0b2b55]">{user?.name || user?.email || "مسافر"}</p><p className="text-xs text-slate-500">{confirmedCount ? `${toArabicIndic(confirmedCount)} حجوزات مؤكدة` : "مسافر"}</p></div>}
            {isAuthenticated ? (
              <Button type="button" variant="outline" size="sm" className="gap-1.5" onClick={handleSignOut}><LogOut className="size-4" />خروج</Button>
            ) : (
              <Button asChild size="sm" className="gap-1.5 bg-[#0b2b55] hover:bg-[#123d72]"><Link to="/auth"><User className="size-4" />تسجيل الدخول</Link></Button>
            )}
          </div>
        </div>
      </header>

      <main id="top">
        <section className="relative overflow-visible bg-[#071a3a]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_15%,rgba(229,179,79,0.18),transparent_28%),linear-gradient(135deg,#071a3a_0%,#0b2b55_60%,#153d65_100%)]" />
          <img src="/customer-hero.svg" alt="طريق وحافلة للنقل البري" className="absolute inset-0 h-full w-full object-cover opacity-95" />
          <div className="absolute inset-0 bg-gradient-to-l from-[#071a3a]/20 via-transparent to-[#071a3a]/35" />
          <div className="relative mx-auto max-w-7xl px-4 pb-28 pt-16 sm:px-6 sm:pt-20 lg:pb-32">
            <div className="max-w-3xl text-right lg:mr-auto">
              <Badge className="mb-5 gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-white backdrop-blur"><ShieldCheck className="size-4" />منصة تجمعك بشركات النقل المستقلة</Badge>
              <h1 className="text-4xl font-black leading-tight tracking-tight text-white sm:text-6xl">رحلتك تبدأ من <span className="text-[#e5b34f]">هنا</span></h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-white/90 sm:text-lg">اختر مدينتك ووجهتك، قارن الرحلات المتاحة فعلياً من شركات النقل، ثم أكمل الحجز وتابع تذكرتك من حسابك.</p>
            </div>

            <form id="search" onSubmit={handleQuickSearch} className="relative mt-12 rounded-3xl border border-white/40 bg-white p-4 shadow-2xl sm:p-6">
              <div className="grid gap-4 lg:grid-cols-[1fr_1fr_1fr_auto]">
                <div className="space-y-2"><label htmlFor="qs-from" className="flex items-center gap-1.5 text-sm font-black"><MapPin className="size-4 text-[#0b2b55]" />من (السعودية)</label><select id="qs-from" value={quickFrom} onChange={(e) => setQuickFrom(e.target.value)} disabled={citiesLoading} className={selectClass}><option value="">كل المدن</option>{saudiCities.map((city) => <option key={city} value={city}>{city}</option>)}</select></div>
                <div className="space-y-2"><label htmlFor="qs-to" className="flex items-center gap-1.5 text-sm font-black"><MapPin className="size-4 text-emerald-600" />إلى (اليمن)</label><select id="qs-to" value={quickTo} onChange={(e) => setQuickTo(e.target.value)} disabled={citiesLoading} className={selectClass}><option value="">كل المدن</option>{yemenCities.map((city) => <option key={city} value={city}>{city}</option>)}</select></div>
                <div className="space-y-2"><label htmlFor="qs-date" className="flex items-center gap-1.5 text-sm font-black"><CalendarDays className="size-4 text-[#0b2b55]" />تاريخ السفر</label><input id="qs-date" type="date" value={quickDate} onChange={(e) => setQuickDate(e.target.value)} min={new Date().toISOString().slice(0, 10)} className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-[#0b2b55] focus:ring-2 focus:ring-[#0b2b55]/10" /></div>
                <div className="flex items-end"><Button type="submit" size="lg" className="h-12 w-full gap-2 rounded-xl bg-[#d9a441] px-8 text-base font-black text-[#071a3a] hover:bg-[#c89532] lg:w-auto"><Search className="size-5" />ابحث عن الرحلات</Button></div>
              </div>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-slate-500"><span className="flex items-center gap-1.5"><ShieldCheck className="size-4 text-[#d9a441]" />النتائج من قاعدة بيانات الرحلات</span><span className="flex items-center gap-1.5"><Clock3 className="size-4 text-[#0b2b55]" />المقاعد تُعرض حسب الرحلة</span></div>
            </form>
          </div>
        </section>

        <section className="relative z-10 mx-auto -mt-14 max-w-7xl px-4 sm:px-6">
          <div className="grid overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl md:grid-cols-4">
            {[[ShieldCheck,"شركات نقل مستقلة","قارن بين الشركات المتاحة على المنصة"],[Armchair,"مقاعد متاحة","اعتمد على العدد الفعلي للرحلة"],[WalletCards,"أسعار واضحة","السعر المعروض مرتبط بالرحلة"],[Headphones,"تجربة حجز منظمة","بيانات الحجز والتذكرة في حسابك"]].map(([Icon,title,desc], index) => { const ItemIcon = Icon as typeof ShieldCheck; return <div key={index} className="flex items-center gap-4 border-b border-slate-100 p-5 last:border-0 md:border-b-0 md:border-l md:last:border-l-0"><div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[#0b2b55]/5 text-[#0b2b55]"><ItemIcon className="size-6" /></div><div><p className="font-black text-[#0b2b55]">{title as string}</p><p className="mt-1 text-xs leading-5 text-slate-500">{desc as string}</p></div></div>; })}
          </div>
        </section>

        <section id="companies" className="mx-auto max-w-7xl scroll-mt-28 px-4 py-12 sm:px-6">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3"><div><p className="mb-1 text-sm font-bold text-[#d09a34]">شركاؤنا</p><h2 className="text-2xl font-black text-[#0b2b55]">شركات النقل المتاحة</h2></div><span className="text-sm text-slate-500">{companies === undefined ? "جاري التحميل…" : `${toArabicIndic(companies.length)} شركات مسجلة`}</span></div>
          {companies === undefined ? <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-32 animate-pulse rounded-2xl border bg-white" />)}</div> : companies.length === 0 ? <div className="rounded-2xl border border-dashed bg-white p-8 text-center text-slate-500">لا توجد شركات نقل نشطة حالياً.</div> : <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{companies.map((company) => <Link key={company.slug} to={bookingHref(quickFrom, quickTo)} className="group rounded-2xl border bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"><div className="flex items-center gap-3">{company.logo ? <img src={company.logo} alt="" className="size-12 rounded-xl object-contain" /> : <div className="flex size-12 items-center justify-center rounded-xl bg-[#0b2b55]/5 text-[#0b2b55]"><Bus className="size-6" /></div>}<div className="min-w-0"><p className="truncate font-black text-[#0b2b55]">{company.name}</p><p className="mt-1 text-xs text-slate-500">شركة نقل مستقلة</p></div></div>{company.base && <p className="mt-4 flex items-center gap-1.5 text-xs text-slate-500"><MapPin className="size-3.5" />{company.base}</p>}<div className="mt-4 flex items-center justify-between text-xs font-bold text-[#0b2b55]"><span>ابدأ الحجز</span><ChevronLeft className="size-4 transition group-hover:-translate-x-1" /></div></Link>)}</div>}
        </section>

        <section id="trips" className="scroll-mt-28 bg-white py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-3"><div><p className="mb-1 text-sm font-bold text-[#d09a34]">البيانات الحية</p><h2 className="text-2xl font-black text-[#0b2b55]">الرحلات المتاحة</h2></div><div className="text-sm text-slate-500">{trips === undefined ? "جاري التحميل…" : `${toArabicIndic(visibleTrips.length)} رحلة مطابقة`}</div></div>
            {trips === undefined ? <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-56 animate-pulse rounded-2xl border bg-slate-50" />)}</div> : featuredTrips.length === 0 ? <div className="rounded-2xl border border-dashed bg-slate-50 p-10 text-center"><Bus className="mx-auto size-10 text-slate-300" /><h3 className="mt-3 font-black text-[#0b2b55]">لا توجد رحلة مطابقة لبحثك</h3><p className="mt-1 text-sm text-slate-500">جرّب مدينة أخرى أو أزل تاريخ السفر والمرشحات.</p><Button type="button" variant="outline" className="mt-5" onClick={() => { setQuickFrom(""); setQuickTo(""); setQuickDate(""); navigate("/customer", { replace: true }); }}>إظهار كل الرحلات</Button></div> : <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{featuredTrips.map((trip) => { const company = companyBySlug.get(trip.companyId); const soldOut = trip.availableSeats <= 0; return <article key={trip._id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"><div className="flex items-center justify-between bg-[#071a3a] px-5 py-4 text-white"><div className="flex min-w-0 items-center gap-2"><Bus className="size-5 shrink-0 text-[#e5b34f]" /><span className="truncate text-sm font-bold">{company?.name ?? "شركة نقل"}</span></div><Badge className="shrink-0 border-white/20 bg-white/10 text-white">{soldOut ? "مكتملة" : `${toArabicIndic(trip.availableSeats)} مقعد`}</Badge></div><div className="p-5"><div className="flex items-center justify-between gap-3"><div><p className="text-xs text-slate-500">من</p><p className="mt-1 font-black text-[#0b2b55]">{trip.from}</p></div><div className="flex flex-1 items-center gap-2"><div className="h-px flex-1 bg-slate-200" /><ArrowLeft className="size-4 text-[#d09a34]" /><div className="h-px flex-1 bg-slate-200" /></div><div className="text-left"><p className="text-xs text-slate-500">إلى</p><p className="mt-1 font-black text-[#0b2b55]">{trip.to}</p></div></div><div className="mt-5 grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-3 text-sm"><div className="flex items-center gap-2"><Clock3 className="size-4 text-[#0b2b55]" /><span>الانطلاق <b>{trip.departureTime}</b></span></div><div className="flex items-center gap-2"><WalletCards className="size-4 text-[#0b2b55]" /><span><b>{toArabicIndic(trip.price)}</b> ريال</span></div></div><p className="mt-3 text-xs text-slate-500">أيام التشغيل: {trip.days?.join("، ") || "حسب جدول الشركة"}</p><Button asChild disabled={soldOut} className="mt-4 w-full gap-2 rounded-xl bg-[#0b2b55] hover:bg-[#123d72]"><a href={soldOut ? "#trips" : bookingHref(trip.from, trip.to)}><Ticket className="size-4" />{soldOut ? "لا توجد مقاعد متاحة" : "ابدأ حجز هذه الرحلة"}</a></Button></div></article>; })}</div>}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6"><div className="overflow-hidden rounded-3xl bg-[#071a3a] p-7 text-white shadow-xl sm:p-10"><div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center"><div><p className="text-sm font-bold text-[#e5b34f]">كيف تعمل المنصة؟</p><h2 className="mt-2 text-2xl font-black sm:text-3xl">من البحث إلى التذكرة بخطوات واضحة</h2><p className="mt-3 max-w-2xl leading-7 text-white/70">خطوط زحل تجمع المسافر مع شركات النقل المستقلة، وتعرض بيانات الرحلات المتاحة من النظام قبل إتمام الحجز.</p></div><div className="grid gap-3 sm:grid-cols-3 lg:w-[620px]">{[[Search,"١","ابحث عن رحلتك"],[WalletCards,"٢","اختر الشركة والرحلة"],[CheckCircle2,"٣","أكمل الحجز وتابع التذكرة"]].map(([Icon, number, title]) => { const ItemIcon = Icon as typeof Search; return <div key={number as string} className="rounded-2xl border border-white/10 bg-white/5 p-4"><div className="flex items-center justify-between"><ItemIcon className="size-5 text-[#e5b34f]" /><span className="text-xs text-white/50">{number as string}</span></div><p className="mt-4 text-sm font-bold">{title as string}</p></div>; })}</div></div></div></section>

        <section id="booking" className="scroll-mt-28 border-t bg-slate-50 py-12"><div className="mx-auto max-w-7xl px-4 sm:px-6"><div className="mb-6"><p className="mb-1 text-sm font-bold text-[#d09a34]">الحجز الفعلي</p><h2 className="text-2xl font-black text-[#0b2b55]">أكمل بيانات المسافر واختر الرحلة</h2><p className="mt-2 text-sm text-slate-500">نستخدم نموذج الحجز الحالي المتصل بـ Convex، ولا يتم إنشاء أي بيانات تجريبية.</p></div><BookingForm key={`${initialFrom}-${initialTo}`} initialFrom={initialFrom || undefined} initialTo={initialTo || undefined} /></div></section>

        {isAuthenticated && <section className="border-t bg-white py-12"><div className="mx-auto max-w-7xl px-4 sm:px-6"><div className="mb-6 flex items-center gap-2"><Ticket className="size-5 text-[#0b2b55]" /><h2 className="text-2xl font-black text-[#0b2b55]">حجوزاتي</h2></div><BookingsList /></div></section>}
      </main>

      <footer id="footer" className="bg-[#04142d] text-white"><div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3"><div><div className="flex items-center gap-3"><img src="/saturn-lines-logo.svg" alt="خطوط زحل" className="h-12 w-auto brightness-0 invert" /><div><p className="font-black">خطوط زحل</p><p className="text-xs text-white/50">منصة حجز ومقارنة</p></div></div><p className="mt-4 max-w-md text-sm leading-7 text-white/60">منصة تربط المسافرين بشركات النقل البري المستقلة العاملة بين السعودية واليمن. خطوط زحل ليست شركة نقل ولا تملك الحافلات.</p></div><div><h3 className="font-black">روابط سريعة</h3><div className="mt-4 grid gap-2 text-sm text-white/60"><a href="#trips" className="hover:text-white">الرحلات المتاحة</a><a href="#companies" className="hover:text-white">شركات النقل</a><a href="#booking" className="hover:text-white">الحجز</a><a href="#top" className="hover:text-white">العودة للأعلى</a></div></div><div><h3 className="font-black">معلومات المنصة</h3><p className="mt-4 flex items-start gap-2 text-sm leading-7 text-white/60"><ShieldCheck className="mt-1 size-4 shrink-0 text-[#e5b34f]" />بيانات الرحلات والحجوزات تُدار من النظام، وتظهر للمسافر حسب ما هو متاح في قاعدة البيانات.</p></div></div><div className="border-t border-white/10"><div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between"><span>© خطوط زحل — منصة النقل البري</span><span>السعودية ← اليمن</span></div></div></footer>
    </div>
  );
}
