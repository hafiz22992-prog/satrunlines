import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowUpLeft, Bus, CalendarDays, CheckCircle2, ChevronLeft, Clock3, MapPin, Route, Search, ShieldCheck, Sparkles, Ticket, Users, Building2, Star, WalletCards } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router";
import { toArabicIndic } from "@/lib/arabic";
import { useLocations } from "@/hooks/use-locations";

const steps = [
  { n: "١", title: "ابحث", text: "حدد مدينة الانطلاق والوجهة وتاريخ السفر." },
  { n: "٢", title: "قارن", text: "قارن شركات النقل والرحلات والأسعار والمقاعد." },
  { n: "٣", title: "اختر", text: "راجع تفاصيل الرحلة واختر الخيار الأنسب لك." },
  { n: "٤", title: "احجز", text: "أكمل الحجز واحصل على تذكرتك عبر المنصة." },
];

function tripTime(value?: string) {
  if (!value) return "حسب الجدول";
  const [h, m] = value.split(":").map(Number);
  if (!Number.isFinite(h) || !Number.isFinite(m)) return value;
  const suffix = h >= 12 ? "م" : "ص";
  const hour = h % 12 || 12;
  return `${toArabicIndic(hour)}:${String(m).padStart(2, "0")} ${suffix}`;
}

function duration(departure?: string, arrival?: string) {
  if (!departure || !arrival) return "حسب جدول الرحلة";
  const [dh, dm] = departure.split(":").map(Number);
  const [ah, am] = arrival.split(":").map(Number);
  if (![dh, dm, ah, am].every(Number.isFinite)) return "حسب جدول الرحلة";
  let minutes = ah * 60 + am - (dh * 60 + dm);
  if (minutes < 0) minutes += 24 * 60;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins ? `${toArabicIndic(hours)} س ${toArabicIndic(mins)} د` : `${toArabicIndic(hours)} ساعات`;
}

function formatTravelDate(value: string) {
  if (!value) return "اختر تاريخ السفر";
  const [year, month, day] = value.split("-").map(Number);
  if (![year, month, day].every(Number.isFinite)) return "اختر تاريخ السفر";
  return `${toArabicIndic(day)} / ${toArabicIndic(month)} / ${toArabicIndic(year)}`;
}

export default function Landing() {
  const trips = useQuery(api.trips.list, {});
  const activeCompanies = useQuery(api.companies.listActive);
  const { saudiCities, yemenCities, isLoading: locationsLoading } = useLocations();
  const [from, setFrom] = useState("all");
  const [to, setTo] = useState("all");
  const [date, setDate] = useState("");
  const companies = activeCompanies ?? [];
  const companyById = useMemo(() => new Map(companies.map((company) => [company.slug, company])), [companies]);
  const filteredTrips = useMemo(() => (trips ?? []).filter((trip) => (from === "all" || trip.from === from) && (to === "all" || trip.to === to)), [trips, from, to]);
  const query = new URLSearchParams();
  if (from !== "all") query.set("from", from);
  if (to !== "all") query.set("to", to);
  if (date) query.set("date", date);
  const customerPath = query.toString() ? `/customer?${query.toString()}` : "/customer";
  const bookingHref = `/auth?returnTo=${encodeURIComponent(customerPath)}`;
  const reset = () => { setFrom("all"); setTo("all"); setDate(""); };

  return (
    <div dir="rtl" className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-background/85 backdrop-blur-2xl">
        <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link to="/" className="flex shrink-0 items-center gap-3"><img src="/saturn-lines-logo.svg" alt="خطوط زحل" className="h-11 w-auto object-contain" /><div className="hidden leading-tight sm:block"><p className="font-black text-primary">خطوط زحل</p><p className="text-[10px] text-muted-foreground">منصة حجز ومقارنة النقل البري</p></div></Link>
          <nav className="hidden items-center gap-7 text-sm font-bold text-muted-foreground lg:flex"><a href="#search" className="transition hover:text-primary">ابحث عن رحلة</a><a href="#companies" className="transition hover:text-primary">شركات النقل</a><a href="#trips" className="transition hover:text-primary">الرحلات</a><a href="#how" className="transition hover:text-primary">كيف تعمل؟</a></nav>
          <Button asChild className="rounded-xl gap-2 px-5 shadow-lg shadow-primary/15"><Link to={bookingHref}>دخول<ArrowLeft className="size-4" /></Link></Button>
        </div>
      </header>

      <main>
        <section className="relative isolate overflow-hidden bg-[#081b33] text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(242,196,95,.20),transparent_30%),radial-gradient(circle_at_85%_10%,rgba(51,102,153,.45),transparent_35%),linear-gradient(135deg,#061426,#0b2948)]" />
          <div className="absolute -bottom-32 right-1/3 size-96 rounded-full bg-primary/10 blur-3xl" />
          <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[1.02fr_.98fr] lg:py-24">
            <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .6 }}>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold backdrop-blur"><Sparkles className="size-3.5 text-[#f2c45f]" />منصة تجمع المسافر بشركات النقل البري</div>
              <h1 className="max-w-3xl text-4xl font-black leading-[1.12] tracking-tight sm:text-5xl lg:text-[4.25rem]">رحلتك إلى اليمن<br /><span className="text-[#f2c45f]">تبدأ من هنا</span></h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-white/75 sm:text-lg">قارن رحلات النقل البري من السعودية إلى اليمن، واكتشف الشركات والمواعيد والأسعار والمقاعد المتاحة قبل أن تختار وتحجز.</p>
              <div className="mt-8 flex flex-wrap gap-3"><Button asChild size="lg" className="rounded-xl bg-[#f2c45f] px-7 font-black text-[#10243c] hover:bg-[#f7d67c]"><a href="#search">ابحث عن رحلتك<Search className="size-5" /></a></Button><Button asChild size="lg" variant="outline" className="rounded-xl border-white/20 bg-white/5 px-7 text-white hover:bg-white/10 hover:text-white"><a href="#companies">استعرض شركات النقل<ArrowUpLeft className="size-5" /></a></Button></div>
              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-xs font-semibold text-white/65"><span className="flex items-center gap-2"><ShieldCheck className="size-4 text-[#f2c45f]" />شركات نقل مستقلة</span><span className="flex items-center gap-2"><CheckCircle2 className="size-4 text-[#f2c45f]" />مقارنة قبل الحجز</span><span className="flex items-center gap-2"><Ticket className="size-4 text-[#f2c45f]" />حجز وتذكرة إلكترونية</span></div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 24, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: .65, delay: .1 }}><div className="relative mx-auto max-w-xl overflow-hidden rounded-[2rem] border border-white/15 bg-white/10 p-3 shadow-2xl shadow-black/30 backdrop-blur-xl"><div className="overflow-hidden rounded-[1.5rem] bg-white text-[#10243c]"><div className="bg-gradient-to-l from-[#0b2c4d] to-[#12466d] p-6 text-white"><div className="flex items-center justify-between"><div><p className="text-xs text-white/60">رحلة مقترحة</p><h2 className="mt-1 text-2xl font-black">جدة <span className="mx-2 text-[#f2c45f]">←</span> صنعاء</h2></div><div className="flex size-12 items-center justify-center rounded-2xl bg-white/10"><Bus className="size-6" /></div></div><div className="mt-7 flex items-center gap-3"><div className="rounded-xl bg-white/10 px-4 py-3"><p className="text-[10px] text-white/60">المغادرة</p><p className="mt-1 font-black">جدة</p></div><div className="flex flex-1 items-center"><span className="h-px flex-1 bg-white/20" /><span className="mx-2 flex size-8 items-center justify-center rounded-full bg-[#f2c45f] text-[#10243c]"><Route className="size-4" /></span><span className="h-px flex-1 bg-white/20" /></div><div className="rounded-xl bg-white/10 px-4 py-3 text-left"><p className="text-[10px] text-white/60">الوصول</p><p className="mt-1 font-black">صنعاء</p></div></div></div><div className="grid grid-cols-3 gap-3 p-5"><div className="rounded-2xl bg-slate-50 p-4"><Clock3 className="size-5 text-primary" /><p className="mt-3 text-[10px] text-muted-foreground">الموعد</p><p className="mt-1 text-sm font-black">حسب الرحلة</p></div><div className="rounded-2xl bg-slate-50 p-4"><WalletCards className="size-5 text-primary" /><p className="mt-3 text-[10px] text-muted-foreground">السعر</p><p className="mt-1 text-sm font-black">قارن قبل الحجز</p></div><div className="rounded-2xl bg-slate-50 p-4"><Users className="size-5 text-primary" /><p className="mt-3 text-[10px] text-muted-foreground">المقاعد</p><p className="mt-1 text-sm font-black">حسب التوفر</p></div></div><div className="flex items-center justify-between border-t px-5 py-4"><span className="text-xs font-bold text-muted-foreground">شركة النقل المنفذة تظهر في تفاصيل الحجز</span><span className="rounded-full bg-primary/10 px-3 py-1 text-[10px] font-black text-primary">منصة خطوط زحل</span></div></div></div></motion.div>
          </div>
        </section>

        <section id="search" className="relative z-20 mx-auto -mt-8 max-w-7xl px-4 sm:px-6"><motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-[1.75rem] border bg-card p-4 shadow-2xl shadow-slate-900/10 sm:p-6"><div className="mb-5 flex items-center justify-between gap-4"><div className="flex items-center gap-3"><div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary"><Search className="size-5" /></div><div><h2 className="font-black">ابحث عن رحلتك</h2><p className="text-xs leading-6 text-muted-foreground">اختر المسار والتاريخ ثم انتقل إلى نتائج الحجز.</p></div></div><span className="hidden rounded-full bg-muted px-3 py-1.5 text-[11px] font-bold text-muted-foreground sm:block">قارن أولًا، ثم احجز</span></div><div className="grid gap-3 md:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto]"><div><p className="mb-2 text-xs font-bold text-muted-foreground">من السعودية</p><Select value={from} onValueChange={setFrom}><SelectTrigger className="h-13 rounded-xl"><SelectValue placeholder="مدينة المغادرة" /></SelectTrigger><SelectContent><SelectItem value="all">كل المدن</SelectItem>{saudiCities.map((city) => <SelectItem key={city} value={city}>{city}</SelectItem>)}</SelectContent></Select></div><div><p className="mb-2 text-xs font-bold text-muted-foreground">إلى اليمن</p><Select value={to} onValueChange={setTo}><SelectTrigger className="h-13 rounded-xl"><SelectValue placeholder="الوجهة" /></SelectTrigger><SelectContent><SelectItem value="all">كل الوجهات</SelectItem>{yemenCities.map((city) => <SelectItem key={city} value={city}>{city}</SelectItem>)}</SelectContent></Select></div><div><p className="mb-2 text-xs font-bold text-muted-foreground">تاريخ السفر</p><div className="relative h-13"><CalendarDays className="pointer-events-none absolute right-3.5 top-4 z-10 size-4 text-muted-foreground" /><div className="pointer-events-none flex h-full w-full items-center rounded-xl border bg-background px-10 text-sm font-medium"><span className={date ? "text-foreground" : "text-muted-foreground"}>{formatTravelDate(date)}</span></div><input type="date" value={date} onChange={(e) => setDate(e.target.value)} aria-label="اختر تاريخ السفر" className="absolute inset-0 z-20 h-full w-full cursor-pointer opacity-0" /></div></div><Button asChild className="h-13 rounded-xl px-7 font-black"><Link to={bookingHref}>عرض الرحلات<Search className="size-4" /></Link></Button></div></motion.div></section>

        <section id="trips" className="mx-auto max-w-7xl px-4 py-20 sm:px-6"><div className="mb-9 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><Badge variant="secondary" className="rounded-full px-3 py-1">رحلات المنصة</Badge><h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">اختر الرحلة التي تناسبك</h2><p className="mt-2 max-w-2xl text-sm leading-7 text-muted-foreground">اعرض الخيارات الحالية وقارن السعر والموعد والمقاعد وشركة النقل قبل الحجز.</p></div><a href="#search" className="inline-flex items-center gap-1 text-sm font-bold text-primary hover:underline">تعديل البحث<ChevronLeft className="size-4" /></a></div>{trips === undefined ? <div className="rounded-[1.75rem] border bg-card p-12 text-center text-sm text-muted-foreground">جارٍ تحميل الرحلات…</div> : filteredTrips.length === 0 ? <div className="rounded-[1.75rem] border bg-card p-12 text-center"><div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-muted"><Search className="size-6 text-muted-foreground" /></div><h3 className="mt-5 font-black">لا توجد رحلات مطابقة حاليًا</h3><p className="mt-2 text-sm text-muted-foreground">جرّب تغيير مدينة المغادرة أو الوجهة.</p><Button variant="outline" className="mt-5 rounded-xl" onClick={reset}>عرض جميع الرحلات</Button></div> : <div className="grid gap-5 lg:grid-cols-2">{filteredTrips.slice(0, 8).map((trip, index) => { const company = companyById.get(trip.companyId); const soldOut = trip.availableSeats <= 0; return <motion.article key={`${trip._id}-${index}`} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: Math.min(index * .05, .3) }} className="group overflow-hidden rounded-[1.5rem] border bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10"><div className="border-b bg-gradient-to-l from-muted/70 to-card p-5"><div className="flex items-center justify-between gap-4"><div><div className="flex items-center gap-2 text-xs font-bold text-primary"><Building2 className="size-4" />{company?.name ?? "شركة نقل مستقلة"}</div><h3 className="mt-2 text-xl font-black">{trip.from} <span className="mx-1 text-primary">←</span> {trip.to}</h3></div><span className={`rounded-full px-3 py-1.5 text-[10px] font-black ${soldOut ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-700"}`}>{soldOut ? "مكتملة" : `متاح ${toArabicIndic(trip.availableSeats)} مقعد`}</span></div></div><div className="grid grid-cols-3 gap-3 p-5"><div className="rounded-xl bg-muted/60 p-3"><p className="text-[10px] text-muted-foreground">المغادرة</p><p className="mt-1 text-sm font-black">{tripTime(trip.departureTime)}</p></div><div className="rounded-xl bg-muted/60 p-3"><p className="text-[10px] text-muted-foreground">المدة</p><p className="mt-1 text-sm font-black">{duration(trip.departureTime, trip.arrivalTime)}</p></div><div className="rounded-xl bg-muted/60 p-3"><p className="text-[10px] text-muted-foreground">السعر</p><p className="mt-1 text-sm font-black">{toArabicIndic(trip.price)} <span className="text-[10px] font-medium">ر.س</span></p></div></div><div className="flex items-center justify-between gap-3 border-t p-5"><span className="text-xs text-muted-foreground">شركة النقل المنفذة للرحلة موضحة في تفاصيل الحجز</span><Button asChild size="sm" disabled={soldOut} className="rounded-xl font-bold"><Link to={bookingHref}>{soldOut ? "غير متاح" : "عرض الرحلة"}<ArrowLeft className="size-4" /></Link></Button></div></motion.article>; })}</div>}</section>

        <section id="companies" className="bg-muted/35 py-20"><div className="mx-auto max-w-7xl px-4 sm:px-6"><div className="mb-10 max-w-2xl"><Badge variant="secondary" className="rounded-full">شركات النقل</Badge><h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">قارن بين شركات النقل المستقلة</h2><p className="mt-3 text-sm leading-7 text-muted-foreground">خطوط زحل تجمع المسافر بالشركات المستقلة المسجلة على المنصة، بينما تنفذ الرحلة الشركة الموضحة في الحجز.</p></div>{companies.length === 0 ? <div className="rounded-3xl border bg-card p-10 text-center text-sm text-muted-foreground">لا توجد شركات نقل نشطة حاليًا.</div> : <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{companies.slice(0, 9).map((company, index) => <motion.div key={company.slug} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * .04 }} className="group rounded-[1.5rem] border bg-card p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"><div className="flex items-start justify-between gap-4"><div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary"><Bus className="size-6" /></div><span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-black text-emerald-700"><CheckCircle2 className="mr-1 inline size-3" />شركة مستقلة</span></div><h3 className="mt-5 text-lg font-black">{company.name}</h3><p className="mt-1 text-xs text-muted-foreground">شركة نقل مسجلة على المنصة</p><div className="mt-5 flex items-center justify-between border-t pt-4"><span className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground"><Star className="size-4 text-[#eab84d]" />بيانات الشركة ورحلاتها</span><a href="#trips" className="text-xs font-black text-primary">عرض الرحلات ←</a></div></motion.div>)}</div>}</div></section>

        <section id="how" className="mx-auto max-w-7xl px-4 py-20 sm:px-6"><div className="mx-auto max-w-2xl text-center"><Badge variant="secondary" className="rounded-full">كيف تعمل؟</Badge><h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">من البحث إلى الحجز في خطوات واضحة</h2><p className="mt-3 text-sm leading-7 text-muted-foreground">تجربة مصممة لتساعدك على المقارنة قبل اتخاذ قرار الحجز.</p></div><div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{steps.map((step, index) => <motion.div key={step.n} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * .06 }} className="relative rounded-[1.5rem] border bg-card p-6"><div className="flex size-12 items-center justify-center rounded-2xl bg-primary text-lg font-black text-primary-foreground shadow-lg shadow-primary/15">{step.n}</div><h3 className="mt-5 font-black">{step.title}</h3><p className="mt-2 text-sm leading-7 text-muted-foreground">{step.text}</p></motion.div>)}</div></section>

        <section className="bg-[#081b33] py-20 text-white"><div className="mx-auto max-w-7xl px-4 sm:px-6"><div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-8 text-center shadow-2xl backdrop-blur sm:p-12"><div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-[#f2c45f] text-[#10243c]"><Ticket className="size-7" /></div><h2 className="mt-6 text-3xl font-black sm:text-4xl">جاهز لرحلتك القادمة؟</h2><p className="mx-auto mt-4 max-w-2xl text-sm leading-8 text-white/70">ابحث عن الرحلات المتاحة، قارن الخيارات، ثم اختر شركة النقل والرحلة المناسبة لك.</p><Button asChild size="lg" className="mt-7 rounded-xl bg-[#f2c45f] px-8 font-black text-[#10243c] hover:bg-[#f7d67c]"><a href="#search">ابدأ البحث الآن<Search className="size-5" /></a></Button></div></div></section>
      </main>

      <footer className="bg-[#061426] py-12 text-white"><div className="mx-auto max-w-7xl px-4 sm:px-6"><div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]"><div><div className="flex items-center gap-3"><img src="/saturn-lines-logo.svg" alt="خطوط زحل" className="h-10 w-auto brightness-0 invert" /><span className="text-lg font-black">خطوط زحل</span></div><p className="mt-4 max-w-sm text-sm leading-7 text-white/55">منصة حجز ومقارنة تربط المسافرين بشركات النقل البري المستقلة بين السعودية واليمن.</p></div><div><h3 className="font-black">المنصة</h3><div className="mt-4 space-y-3 text-sm text-white/55"><a href="#search" className="block hover:text-white">البحث عن رحلة</a><a href="#companies" className="block hover:text-white">شركات النقل</a><a href="#trips" className="block hover:text-white">الرحلات</a></div></div><div><h3 className="font-black">المساعدة</h3><div className="mt-4 space-y-3 text-sm text-white/55"><a href="#how" className="block hover:text-white">كيف تعمل؟</a><Link to={bookingHref} className="block hover:text-white">دخول المسافر</Link></div></div><div><h3 className="font-black">للشركات</h3><div className="mt-4 space-y-3 text-sm text-white/55"><span className="block">شركات النقل المستقلة</span><span className="block">بوابة الشركات</span></div></div></div><div className="mt-10 border-t border-white/10 pt-6 text-center text-[11px] leading-6 text-white/45">خطوط زحل منصة حجز ومقارنة، وليست شركة نقل أو مالكة للحافلات. يتم تنفيذ الرحلة من خلال شركة النقل الموضحة في الحجز.<br />© 2026 خطوط زحل — جميع الحقوق محفوظة.</div></div></footer>
    </div>
  );
}
