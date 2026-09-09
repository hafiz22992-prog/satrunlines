import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowUpLeft, Bus, CalendarDays, CheckCircle2, ChevronLeft, Clock3, MapPin, Route, Search, ShieldCheck, Sparkles, Ticket, Users } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router";
import { toArabicIndic } from "@/lib/arabic";
import { useLocations } from "@/hooks/use-locations";

const features = [
  { icon: Search, title: "ابحث بسهولة", text: "حدد مدينة المغادرة والوجهة للوصول إلى الرحلات المتاحة." },
  { icon: Route, title: "قارن الخيارات", text: "قارن الشركات والمواعيد والأسعار قبل اختيار الرحلة." },
  { icon: Users, title: "اعرف المقاعد", text: "تظهر المقاعد المتاحة بحسب بيانات الرحلة المسجلة على المنصة." },
  { icon: Ticket, title: "احجز وتابع", text: "أكمل الحجز ثم تابع تفاصيله وتذكرتك من حسابك." },
];

const steps = [
  { n: "١", title: "حدد رحلتك", text: "اختر مدينة الانطلاق في السعودية والوجهة في اليمن." },
  { n: "٢", title: "قارن", text: "استعرض الشركات والرحلات والأسعار والمقاعد المتاحة." },
  { n: "٣", title: "احجز", text: "اختر الرحلة المناسبة وأكمل الحجز عبر المنصة." },
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
  const filteredTrips = useMemo(
    () => (trips ?? []).filter((trip) => (from === "all" || trip.from === from) && (to === "all" || trip.to === to)),
    [trips, from, to],
  );

  const query = new URLSearchParams();
  if (from !== "all") query.set("from", from);
  if (to !== "all") query.set("to", to);
  if (date) query.set("date", date);
  const customerPath = query.toString() ? `/customer?${query.toString()}` : "/customer";
  const bookingHref = `/auth?returnTo=${encodeURIComponent(customerPath)}`;

  const reset = () => { setFrom("all"); setTo("all"); setDate(""); };

  return (
    <div dir="rtl" className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link to="/" className="flex shrink-0 items-center gap-3">
            <img src="/saturn-lines-logo.svg" alt="خطوط زحل" className="h-11 w-auto object-contain" />
            <div className="hidden leading-tight sm:block">
              <p className="font-black text-primary">خطوط زحل</p>
              <p className="text-[10px] text-muted-foreground">منصة حجز ومقارنة النقل البري</p>
            </div>
          </Link>
          <nav className="hidden items-center gap-7 text-sm font-semibold text-muted-foreground lg:flex">
            <a href="#search" className="transition hover:text-primary">ابحث عن رحلة</a>
            <a href="#companies" className="transition hover:text-primary">شركات النقل</a>
            <a href="#trips" className="transition hover:text-primary">الرحلات</a>
            <a href="#how" className="transition hover:text-primary">كيف تعمل؟</a>
          </nav>
          <Button asChild variant="outline" className="rounded-xl gap-2">
            <Link to={bookingHref}>دخول<ArrowLeft className="size-4" /></Link>
          </Button>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden bg-gradient-to-b from-primary/[0.08] via-background to-background">
          <div className="pointer-events-none absolute -right-40 -top-40 size-[30rem] rounded-full bg-primary/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-40 -left-40 size-[26rem] rounded-full bg-blue-500/10 blur-3xl" />
          <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.08fr_.92fr] lg:py-24">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .55 }}>
              <Badge variant="secondary" className="mb-5 rounded-full px-4 py-2 gap-2">
                <Sparkles className="size-3.5" /> منصة تجمع المسافر بشركات النقل البري
              </Badge>
              <h1 className="max-w-3xl text-4xl font-black leading-[1.18] tracking-tight sm:text-5xl lg:text-6xl">
                قارن رحلات النقل البري
                <span className="mt-2 block text-primary">من السعودية إلى اليمن</span>
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
                ابحث عن الرحلة المناسبة، قارن الشركات والمواعيد والأسعار والمقاعد المتاحة، ثم اختر ما يناسبك واحجز عبر منصة خطوط زحل.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg" className="rounded-xl gap-2 px-6">
                  <Link to={bookingHref}>ابدأ البحث عن رحلة<ArrowUpLeft className="size-5" /></Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-xl px-6">
                  <a href="#companies">استعرض شركات النقل</a>
                </Button>
              </div>
              <div className="mt-9 flex flex-wrap gap-x-7 gap-y-3 text-xs font-medium text-muted-foreground">
                <span className="flex items-center gap-2"><CheckCircle2 className="size-4 text-primary" />{activeCompanies === undefined ? "…" : toArabicIndic(companies.length)} شركات على المنصة</span>
                <span className="flex items-center gap-2"><MapPin className="size-4 text-primary" />{locationsLoading ? "…" : toArabicIndic(yemenCities.length)} وجهة في اليمن</span>
                <span className="flex items-center gap-2"><ShieldCheck className="size-4 text-primary" />مقارنة قبل الحجز</span>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: .97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: .6, delay: .1 }}>
              <div className="overflow-hidden rounded-[2rem] border bg-card shadow-2xl shadow-primary/10">
                <div className="bg-primary p-6 text-primary-foreground">
                  <div className="flex items-center justify-between">
                    <div><p className="text-xs text-primary-foreground/70">خطوط زحل</p><h2 className="mt-1 text-2xl font-black">من جدة إلى صنعاء</h2></div>
                    <div className="flex size-12 items-center justify-center rounded-2xl bg-white/10"><Bus className="size-6" /></div>
                  </div>
                  <div className="mt-7 flex items-center gap-3 rounded-2xl bg-white p-4 text-foreground">
                    <div className="text-center"><p className="text-[10px] text-muted-foreground">المغادرة</p><p className="mt-1 font-black">جدة</p></div>
                    <div className="flex flex-1 items-center gap-2"><span className="h-px flex-1 bg-border" /><div className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary"><Route className="size-4" /></div><span className="h-px flex-1 bg-border" /></div>
                    <div className="text-center"><p className="text-[10px] text-muted-foreground">الوصول</p><p className="mt-1 font-black">صنعاء</p></div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 p-4">
                  {[{ icon: Search, text: "ابحث" }, { icon: Route, text: "قارن" }, { icon: Ticket, text: "احجز" }].map(({ icon: Icon, text }) => <div key={text} className="rounded-2xl bg-muted/60 p-4 text-center"><Icon className="mx-auto size-5 text-primary" /><p className="mt-2 text-xs font-black">{text}</p></div>)}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section id="search" className="relative z-10 mx-auto -mt-5 max-w-7xl px-4 sm:px-6">
          <div className="rounded-[1.75rem] border bg-card p-4 shadow-xl sm:p-6">
            <div className="mb-5 flex items-center gap-3"><div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><Search className="size-5" /></div><div><h2 className="font-black">ابحث عن رحلتك</h2><p className="text-xs text-muted-foreground">حدد المسار والتاريخ ثم انتقل إلى نتائج الحجز.</p></div></div>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto]">
              <div><p className="mb-2 text-xs font-bold text-muted-foreground">من السعودية</p><Select value={from} onValueChange={setFrom}><SelectTrigger className="h-12 rounded-xl"><SelectValue placeholder="مدينة المغادرة" /></SelectTrigger><SelectContent><SelectItem value="all">كل المدن</SelectItem>{saudiCities.map((city) => <SelectItem key={city} value={city}>{city}</SelectItem>)}</SelectContent></Select></div>
              <div><p className="mb-2 text-xs font-bold text-muted-foreground">إلى اليمن</p><Select value={to} onValueChange={setTo}><SelectTrigger className="h-12 rounded-xl"><SelectValue placeholder="الوجهة" /></SelectTrigger><SelectContent><SelectItem value="all">كل الوجهات</SelectItem>{yemenCities.map((city) => <SelectItem key={city} value={city}>{city}</SelectItem>)}</SelectContent></Select></div>
              <div><p className="mb-2 text-xs font-bold text-muted-foreground">تاريخ السفر</p><div className="relative h-12"><CalendarDays className="pointer-events-none absolute right-3 top-3.5 z-10 size-4 text-muted-foreground" /><div className="pointer-events-none flex h-12 w-full items-center rounded-xl border bg-background px-10 text-sm font-medium"><span className={date ? "text-foreground" : "text-muted-foreground"}>{formatTravelDate(date)}</span></div><input type="date" value={date} onChange={(e) => setDate(e.target.value)} aria-label="اختر تاريخ السفر" className="absolute inset-0 z-20 h-full w-full cursor-pointer opacity-0" /></div></div>
              <Button asChild className="h-12 rounded-xl px-7 font-bold"><Link to={bookingHref}>عرض الرحلات<Search className="size-4" /></Link></Button>
            </div>
          </div>
        </section>

        <section id="companies" className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between"><div><Badge variant="secondary" className="rounded-full">شركات النقل</Badge><h2 className="mt-3 text-2xl font-black sm:text-3xl">شركات النقل على المنصة</h2><p className="mt-2 max-w-2xl text-sm leading-7 text-muted-foreground">تعرض المنصة شركات النقل المستقلة المسجلة لديها، بينما تُنفذ الرحلة بواسطة الشركة الموضحة في الحجز.</p></div><span className="text-xs font-bold text-muted-foreground">{activeCompanies === undefined ? "جارٍ التحميل…" : `${toArabicIndic(companies.length)} شركة`}</span></div>
          {activeCompanies === undefined ? <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-32 animate-pulse rounded-2xl border bg-muted/50" />)}</div> : companies.length === 0 ? <div className="rounded-3xl border bg-muted/30 p-12 text-center"><Bus className="mx-auto size-9 text-muted-foreground" /><p className="mt-3 font-black">لا توجد شركات نقل معروضة حالياً</p><p className="mt-1 text-xs text-muted-foreground">ستظهر الشركات بعد إضافتها وتفعيلها من إدارة المنصة.</p></div> : <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">{companies.slice(0, 12).map((company) => <div key={company.slug} className="group rounded-2xl border bg-card p-5 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg"><div className="mx-auto flex size-14 items-center justify-center overflow-hidden rounded-2xl bg-muted" style={{ backgroundColor: company.logo ? undefined : company.color ?? undefined }}>{company.logo ? <img src={company.logo} alt={company.name} className="size-full bg-white object-contain p-1" /> : <Bus className="size-7 text-white" />}</div><p className="mt-4 line-clamp-2 text-xs font-black">{company.name}</p><p className="mt-1 text-[10px] text-muted-foreground">شركة نقل مستقلة</p></div>)}</div>}
        </section>

        <section id="trips" className="bg-muted/30 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="mb-8 flex items-end justify-between gap-4"><div><Badge variant="secondary" className="rounded-full">الرحلات المتاحة</Badge><h2 className="mt-3 text-2xl font-black sm:text-3xl">اختر الرحلة الأنسب لك</h2><p className="mt-2 text-sm text-muted-foreground">البيانات المعروضة مأخوذة من رحلات المنصة الحالية.</p></div><a href="#search" className="hidden items-center gap-1 text-xs font-bold text-primary sm:flex">تعديل البحث<ChevronLeft className="size-4" /></a></div>
            {trips === undefined ? <div className="rounded-3xl border bg-card p-12 text-center text-sm text-muted-foreground">جارٍ تحميل الرحلات…</div> : filteredTrips.length === 0 ? <div className="rounded-3xl border bg-card p-12 text-center"><Route className="mx-auto size-9 text-muted-foreground" /><p className="mt-3 font-black">لا توجد رحلات مطابقة</p><p className="mt-1 text-xs text-muted-foreground">جرّب تغيير مدينة المغادرة أو الوجهة.</p><Button variant="outline" onClick={reset} className="mt-5 rounded-xl">عرض جميع الرحلات</Button></div> : <div className="grid gap-4 lg:grid-cols-2">{filteredTrips.slice(0, 8).map((trip, index) => { const company = companyById.get(trip.companyId); const soldOut = trip.availableSeats <= 0; return <article key={`${trip._id}-${index}`} className="rounded-3xl border bg-card p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"><div className="flex items-start justify-between gap-4"><div><p className="text-[10px] font-bold text-muted-foreground">شركة النقل المنفذة للرحلة</p><h3 className="mt-1 font-black text-primary">{company?.name ?? trip.companyId}</h3></div><Badge variant={soldOut ? "secondary" : "outline"} className="rounded-full">{soldOut ? "مكتملة" : `${toArabicIndic(trip.availableSeats)} مقعد متاح`}</Badge></div><div className="mt-5 grid grid-cols-[1fr_auto_1fr] items-center gap-3"><div className="rounded-2xl bg-muted p-4"><p className="text-[10px] text-muted-foreground">من</p><p className="mt-1 font-black">{trip.from}</p><p className="mt-1 text-xs text-muted-foreground">{tripTime(trip.departureTime)}</p></div><Route className="size-5 text-primary" /><div className="rounded-2xl bg-muted p-4"><p className="text-[10px] text-muted-foreground">إلى</p><p className="mt-1 font-black">{trip.to}</p><p className="mt-1 text-xs text-muted-foreground">{tripTime(trip.arrivalTime)}</p></div></div><div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-muted-foreground"><span className="flex items-center gap-1.5"><Clock3 className="size-4 text-primary" />{duration(trip.departureTime, trip.arrivalTime)}</span><span className="flex items-center gap-1.5"><Users className="size-4 text-primary" />{toArabicIndic(trip.availableSeats)} من {toArabicIndic(trip.totalSeats)} مقعد</span></div><div className="mt-5 flex items-center justify-between border-t pt-4"><div><p className="text-[10px] text-muted-foreground">السعر للراكب الواحد</p><p className="mt-1 text-xl font-black text-primary">{toArabicIndic(trip.price)} <span className="text-xs">ر.س</span></p></div><Link to={`/customer/booking?from=${encodeURIComponent(trip.from)}&to=${encodeURIComponent(trip.to)}&tripId=${encodeURIComponent(trip._id)}`} aria-disabled={soldOut} className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white transition ${soldOut ? "pointer-events-none bg-muted-foreground/30" : "bg-primary hover:bg-primary/90"}`}>{soldOut ? "مكتملة المقاعد" : "اختر الرحلة"}<ArrowLeft className="size-4" /></Link></div></article>; })}</div>}
          </div>
        </section>

        <section id="features" className="mx-auto max-w-7xl px-4 py-16 sm:px-6"><div className="mx-auto max-w-2xl text-center"><Badge variant="secondary" className="rounded-full">لماذا خطوط زحل؟</Badge><h2 className="mt-3 text-2xl font-black sm:text-3xl">تجربة أبسط للبحث والمقارنة والحجز</h2></div><div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{features.map(({ icon: Icon, title, text }) => <div key={title} className="rounded-3xl border bg-card p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"><div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary"><Icon className="size-6" /></div><h3 className="mt-5 font-black">{title}</h3><p className="mt-2 text-xs leading-6 text-muted-foreground">{text}</p></div>)}</div></section>

        <section id="how" className="bg-primary py-16 text-primary-foreground"><div className="mx-auto max-w-7xl px-4 sm:px-6"><div className="mx-auto max-w-2xl text-center"><Badge className="rounded-full bg-white/10 text-white hover:bg-white/10">كيف تعمل المنصة؟</Badge><h2 className="mt-4 text-2xl font-black sm:text-3xl">ثلاث خطوات لرحلتك</h2></div><div className="mt-10 grid gap-5 md:grid-cols-3">{steps.map((step) => <div key={step.n} className="rounded-3xl border border-white/10 bg-white/5 p-7 text-center"><div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-white text-xl font-black text-primary">{step.n}</div><h3 className="mt-5 font-black">{step.title}</h3><p className="mt-2 text-xs leading-6 text-primary-foreground/70">{step.text}</p></div>)}</div><div className="mx-auto mt-10 max-w-3xl rounded-2xl border border-white/10 bg-white/5 p-5 text-center text-xs leading-7 text-primary-foreground/80">منصة خطوط زحل هي منصة حجز ومقارنة تربط المسافر بشركات النقل البري المستقلة، وليست شركة نقل أو مشغل حافلات. تنفيذ الرحلة يكون بواسطة شركة النقل الموضحة في التذكرة.</div></div></section>
      </main>

      <footer className="border-t bg-card"><div className="mx-auto max-w-7xl px-4 py-10 sm:px-6"><div className="grid gap-8 md:grid-cols-3"><div className="md:col-span-2"><img src="/saturn-lines-logo.svg" alt="خطوط زحل" className="h-12 w-auto" /><p className="mt-4 max-w-xl text-xs leading-7 text-muted-foreground">منصة رقمية للبحث والمقارنة وحجز رحلات النقل البري بين المدن السعودية والوجهات اليمنية، مع عرض شركة النقل المنفذة لكل رحلة.</p></div><div><p className="font-black">روابط سريعة</p><div className="mt-3 space-y-2 text-xs text-muted-foreground"><a className="block hover:text-primary" href="#search">البحث عن رحلة</a><a className="block hover:text-primary" href="#companies">شركات النقل</a><a className="block hover:text-primary" href="#trips">الرحلات المتاحة</a><Link className="block hover:text-primary" to="/company">بوابة شركة النقل</Link></div></div></div><div className="mt-8 flex flex-col gap-2 border-t pt-6 text-[11px] text-muted-foreground sm:flex-row sm:items-center sm:justify-between"><span>© 2026 خطوط زحل — جميع الحقوق محفوظة</span><span>منصة حجز ومقارنة النقل البري</span></div></div></footer>
    </div>
  );
}
