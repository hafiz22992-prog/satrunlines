import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowUpLeft, Bus, CalendarDays, CheckCircle2, ChevronLeft, Clock3, MapPin, Route, Search, ShieldCheck, Sparkles, Ticket, Users, Building2, WalletCards } from "lucide-react";
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
              <h1 className="max-w-3xl text-4xl font-black leading-[1.12] tracking-tight sm:text-5xl lg:text-[4.25rem]">إلى اليمن…<br /><span className="text-[#f2c45f]">رحلتك تبدأ من اختيارك</span></h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-white/75 sm:text-lg">قارن رحلات النقل البري من السعودية إلى اليمن، واكتشف خيارات متعددة من شركات النقل المستقلة، ثم اختر الرحلة التي تناسبك واحجز بثقة.</p>
              <div className="mt-8 flex flex-wrap gap-3"><Button asChild size="lg" className="rounded-xl bg-[#f2c45f] px-7 font-black text-[#10243c] hover:bg-[#f7d67c]"><a href="#search">ابحث عن رحلتك<Search className="size-5" /></a></Button><Button asChild size="lg" variant="outline" className="rounded-xl border-white/20 bg-white/5 px-7 text-white hover:bg-white/10 hover:text-white"><a href="#companies">استعرض شركات النقل<ArrowUpLeft className="size-5" /></a></Button></div>
              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-xs font-semibold text-white/65"><span className="flex items-center gap-2"><ShieldCheck className="size-4 text-[#f2c45f]" />شركات نقل مستقلة</span><span className="flex items-center gap-2"><CheckCircle2 className="size-4 text-[#f2c45f]" />مقارنة قبل الحجز</span><span className="flex items-center gap-2"><Ticket className="size-4 text-[#f2c45f]" />حجز وتذكرة إلكترونية</span></div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 24, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: .65, delay: .1 }}><div className="relative mx-auto max-w-xl overflow-hidden rounded-[2rem] border border-white/15 bg-white/10 p-3 shadow-2xl shadow-black/30 backdrop-blur-xl"><div className="overflow-hidden rounded-[1.5rem] bg-white text-[#10243c]"><div className="bg-gradient-to-l from-[#0b2c4d] to-[#12466d] p-6 text-white"><div className="flex items-center justify-between"><div><p className="text-xs text-white/60">رحلة مقترحة</p><h2 className="mt-1 text-2xl font-black">جدة <span className="mx-2 text-[#f2c45f]">←</span> صنعاء</h2></div><div className="flex size-12 items-center justify-center rounded-2xl bg-white/10"><Bus className="size-6" /></div></div><div className="mt-7 flex items-center gap-3"><div className="rounded-xl bg-white/10 px-4 py-3"><p className="text-[10px] text-white/60">المغادرة</p><p className="mt-1 font-black">جدة</p></div><div className="flex flex-1 items-center"><span className="h-px flex-1 bg-white/20" /><span className="mx-2 flex size-8 items-center justify-center rounded-full bg-[#f2c45f] text-[#10243c]"><Route className="size-4" /></span><span className="h-px flex-1 bg-white/20" /></div><div className="rounded-xl bg-white/10 px-4 py-3 text-left"><p className="text-[10px] text-white/60">الوصول</p><p className="mt-1 font-black">صنعاء</p></div></div></div><div className="grid grid-cols-3 gap-3 p-5"><div className="rounded-2xl bg-slate-50 p-4"><Clock3 className="size-5 text-primary" /><p className="mt-3 text-[10px] text-muted-foreground">الموعد</p><p className="mt-1 text-sm font-black">حسب الرحلة</p></div><div className="rounded-2xl bg-slate-50 p-4"><WalletCards className="size-5 text-primary" /><p className="mt-3 text-[10px] text-muted-foreground">السعر</p><p className="mt-1 text-sm font-black">قارن قبل الحجز</p></div><div className="rounded-2xl bg-slate-50 p-4"><Users className="size-5 text-primary" /><p className="mt-3 text-[10px] text-muted-foreground">المقاعد</p><p className="mt-1 text-sm font-black">حسب التوفر</p></div></div><div className="flex items-center justify-between border-t px-5 py-4"><span className="text-xs font-bold text-muted-foreground">شركة النقل المنفذة تظهر في تفاصيل الحجز</span><span className="rounded-full bg-primary/10 px-3 py-1 text-[10px] font-black text-primary">منصة خطوط زحل</span></div></div></div></motion.div>
          </div>
        </section>

        <section id="search" className="relative z-20 mx-auto -mt-8 max-w-7xl px-4 sm:px-6"><motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-[1.75rem] border bg-card p-4 shadow-2xl shadow-slate-900/10 sm:p-6"><div className="mb-5 flex items-center justify-between gap-4"><div className="flex items-center gap-3"><div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary"><Search className="size-5" /></div><div><h2 className="font-black">ابحث عن رحلتك</h2><p className="text-xs leading-6 text-muted-foreground">اختر المسار والتاريخ ثم انتقل إلى نتائج الحجز.</p></div></div><span className="hidden rounded-full bg-muted px-3 py-1.5 text-[11px] font-bold text-muted-foreground sm:block">قارن أولًا، ثم احجز</span></div><div className="grid gap-3 md:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto]"><div><p className="mb-2 text-xs font-bold text-muted-foreground">من السعودية</p><Select value={from} onValueChange={setFrom}><SelectTrigger className="h-13 rounded-xl"><SelectValue placeholder="مدينة المغادرة" /></SelectTrigger><SelectContent><SelectItem value="all">كل المدن</SelectItem>{saudiCities.map((city) => <SelectItem key={city} value={city}>{city}</SelectItem>)}</SelectContent></Select></div><div><p className="mb-2 text-xs font-bold text-muted-foreground">إلى اليمن</p><Select value={to} onValueChange={setTo}><SelectTrigger className="h-13 rounded-xl"><SelectValue placeholder="الوجهة" /></SelectTrigger><SelectContent><SelectItem value="all">كل الوجهات</SelectItem>{yemenCities.map((city) => <SelectItem key={city} value={city}>{city}</SelectItem>)}</SelectContent></Select></div><div><p className="mb-2 text-xs font-bold text-muted-foreground">تاريخ السفر</p><div className="relative h-13"><CalendarDays className="pointer-events-none absolute right-3.5 top-4 z-10 size-4 text-muted-foreground" /><div className="pointer-events-none flex h-full w-full items-center rounded-xl border bg-background px-10 text-sm font-medium"><span className={date ? "text-foreground" : "text-muted-foreground"}>{formatTravelDate(date)}</span></div><input type="date" value={date} onChange={(e) => setDate(e.target.value)} aria-label="اختر تاريخ السفر" className="absolute inset-0 z-20 h-full w-full cursor-pointer opacity-0" /></div></div><Button asChild className="h-13 rounded-xl px-7 font-black"><Link to={bookingHref}>عرض الرحلات<Search className="size-4" /></Link></Button></div><div className="mt-4 flex items-center justify-between gap-4 border-t pt-4"><p className="text-xs leading-6 text-muted-foreground">تظهر لك خيارات الشركات والرحلات المتاحة لتقارن بينها قبل إتمام الحجز.</p><button onClick={reset} className="shrink-0 text-xs font-bold text-primary hover:underline">إعادة التعيين</button></div></motion.div></section>

        <section id="trips" className="mx-auto max-w-7xl px-4 py-20 sm:px-6"><div className="mb-8 flex items-end justify-between gap-4"><div><Badge variant="secondary" className="mb-3 rounded-full px-3">خيارات الرحلة</Badge><h2 className="text-3xl font-black tracking-tight sm:text-4xl">رحلات متاحة للمقارنة</h2><p className="mt-2 text-sm leading-7 text-muted-foreground">اطّلع على الرحلات المنشورة من شركات النقل المستقلة واختر ما يناسبك.</p></div><Button asChild variant="ghost" className="hidden gap-2 sm:flex"><Link to={bookingHref}>عرض الكل<ChevronLeft className="size-4" /></Link></Button></div>{filteredTrips.length === 0 ? <div className="rounded-3xl border border-dashed bg-muted/30 p-10 text-center"><Bus className="mx-auto size-10 text-muted-foreground" /><h3 className="mt-4 font-black">لا توجد رحلات مطابقة حاليًا</h3><p className="mt-2 text-sm text-muted-foreground">جرّب تغيير المدن أو التاريخ، أو استعرض الرحلات المتاحة من صفحة الحجز.</p></div> : <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{filteredTrips.slice(0, 6).map((trip) => { const company = companyById.get(trip.companyId); return <motion.article key={trip._id} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="group rounded-3xl border bg-card p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"><div className="flex items-start justify-between gap-3"><div><div className="flex items-center gap-2 text-sm font-black"><MapPin className="size-4 text-primary" />{trip.from}<span className="text-muted-foreground">←</span>{trip.to}</div><p className="mt-2 text-xs text-muted-foreground">{company?.name ?? "شركة نقل مستقلة"}</p></div><Badge className="rounded-full">متاح</Badge></div><div className="my-5 grid grid-cols-3 gap-2"><div className="rounded-2xl bg-muted/60 p-3"><p className="text-[10px] text-muted-foreground">المغادرة</p><p className="mt-1 font-black">{tripTime(trip.departureTime)}</p></div><div className="rounded-2xl bg-muted/60 p-3"><p className="text-[10px] text-muted-foreground">المدة</p><p className="mt-1 font-black">{duration(trip.departureTime, trip.arrivalTime)}</p></div><div className="rounded-2xl bg-muted/60 p-3"><p className="text-[10px] text-muted-foreground">المقاعد</p><p className="mt-1 font-black">{toArabicIndic(trip.availableSeats ?? 0)}</p></div></div><div className="flex items-center justify-between border-t pt-4"><div><p className="text-[10px] text-muted-foreground">السعر</p><p className="text-lg font-black text-primary">{toArabicIndic(trip.price ?? 0)} ريال</p></div><Button asChild size="sm" className="rounded-xl"><Link to={bookingHref}>التفاصيل</Link></Button></div></motion.article>; })}</div>}</section>

        <section id="companies" className="bg-muted/35"><div className="mx-auto max-w-7xl px-4 py-20 sm:px-6"><div className="mx-auto max-w-3xl text-center"><Badge variant="secondary" className="rounded-full px-3">شركاؤنا</Badge><h2 className="mt-4 text-3xl font-black sm:text-4xl">قارن بين شركات النقل المستقلة</h2><p className="mt-4 leading-8 text-muted-foreground">خطوط زحل منصة تجمع المسافر بشركات النقل البري المستقلة، وتساعدك على مقارنة الخيارات المتاحة. الرحلة تُنفّذ بواسطة شركة النقل الموضحة في تفاصيل الحجز.</p></div>{companies.length > 0 && <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{companies.slice(0, 8).map((company) => <div key={company._id} className="rounded-3xl border bg-card p-5"><div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary"><Building2 className="size-5" /></div><h3 className="mt-4 font-black">{company.name}</h3><p className="mt-1 text-xs text-muted-foreground">شركة نقل مستقلة</p><div className="mt-4 rounded-full bg-primary/5 px-3 py-2 text-center text-xs font-bold text-primary">متاحة للمقارنة</div></div>)}</div>}</div></section>

        <section id="how" className="mx-auto max-w-7xl px-4 py-20 sm:px-6"><div className="text-center"><Badge variant="secondary" className="rounded-full px-3">بخطوات بسيطة</Badge><h2 className="mt-4 text-3xl font-black sm:text-4xl">كيف تعمل خطوط زحل؟</h2><p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">تجربة واضحة من البحث إلى الحجز، مع إبقاء قرار اختيار الرحلة بيدك.</p></div><div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">{steps.map((step) => <div key={step.n} className="relative rounded-3xl border bg-card p-6"><span className="flex size-11 items-center justify-center rounded-2xl bg-primary text-lg font-black text-primary-foreground">{step.n}</span><h3 className="mt-5 text-lg font-black">{step.title}</h3><p className="mt-2 text-sm leading-7 text-muted-foreground">{step.text}</p></div>)}</div></section>

        <section className="px-4 pb-20 sm:px-6"><div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-[#0b2948] px-6 py-12 text-center text-white shadow-2xl sm:px-10"><Sparkles className="mx-auto size-7 text-[#f2c45f]" /><h2 className="mt-4 text-3xl font-black sm:text-4xl">جاهز لاختيار رحلتك؟</h2><p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-white/70">ابدأ بالمقارنة، اكتشف الخيارات المتاحة، ثم اختر الرحلة التي تناسبك واحجزها عبر منصة خطوط زحل.</p><Button asChild size="lg" className="mt-7 rounded-xl bg-[#f2c45f] px-8 font-black text-[#10243c] hover:bg-[#f7d67c]"><Link to={bookingHref}>ابدأ البحث عن رحلتك<Search className="size-5" /></Link></Button></div></section>
      </main>

      <footer className="border-t bg-[#061426] text-white"><div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3"><div><div className="flex items-center gap-3"><img src="/saturn-lines-logo.svg" alt="خطوط زحل" className="h-12 w-auto" /><span className="font-black">خطوط زحل</span></div><p className="mt-4 max-w-sm text-sm leading-7 text-white/60">منصة حجز ومقارنة للنقل البري، تجمع المسافرين بشركات النقل المستقلة وتسهّل اكتشاف الرحلات وحجزها.</p></div><div><h3 className="font-black">روابط سريعة</h3><div className="mt-4 grid gap-3 text-sm text-white/65"><a href="#search" className="hover:text-white">ابحث عن رحلة</a><a href="#companies" className="hover:text-white">شركات النقل</a><a href="#how" className="hover:text-white">كيف تعمل؟</a></div></div><div><h3 className="font-black">عن المنصة</h3><p className="mt-4 text-sm leading-7 text-white/60">خطوط زحل ليست شركة نقل ولا تملك أو تشغّل حافلات. يتم تنفيذ الرحلات بواسطة شركة النقل المستقلة الموضحة في الحجز.</p></div></div><div className="border-t border-white/10"><div className="mx-auto max-w-7xl px-4 py-5 text-center text-xs text-white/45 sm:px-6">© {new Date().getFullYear()} منصة خطوط زحل — جميع الحقوق محفوظة</div></div></footer>
    </div>
  );
}
