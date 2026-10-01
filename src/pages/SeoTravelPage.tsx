import { ArrowLeft, BusFront, CheckCircle2, MapPin, Search, ShieldCheck, Ticket, Users } from "lucide-react";
import { Link, useParams } from "react-router";

const PAGES: Record<string, {
  title: string;
  intro: string;
  points: string[];
  from?: string;
  to?: string;
}> = {
  "saudi-yemen": {
    title: "السفر من السعودية إلى اليمن وحجز تذاكر النقل البري",
    intro: "خطوط زحل منصة رقمية لمقارنة رحلات النقل البري بين السعودية واليمن. ابحث عن الرحلات المنشورة، قارن شركات النقل والأسعار والمواعيد والمقاعد، ثم اختر الرحلة المناسبة لك.",
    points: ["مقارنة شركات النقل البري المستقلة", "عرض أسعار ومواعيد الرحلات المتاحة", "اختيار الرحلة الاقتصادية أو VIP عندما تكون متاحة", "إصدار التذكرة عبر منصة خطوط زحل"],
  },
  "jeddah-yemen": {
    title: "حجز رحلات جدة إلى اليمن وأسعار تذاكر السفر",
    intro: "إذا كنت تبحث عن حجز سفر من جدة إلى اليمن، استخدم منصة خطوط زحل للبحث في الرحلات المنشورة ومقارنة السعر والموعد والمقاعد وشركة النقل المنفذة.",
    points: ["رحلات جدة إلى مدن اليمن حسب الرحلات المنشورة", "مقارنة أسعار التذاكر قبل الحجز", "معرفة شركة النقل المنفذة بوضوح", "الحجز وإصدار التذكرة إلكترونيًا"],
    from: "جدة",
  },
  "jeddah-sanaa": {
    title: "حجز جدة إلى صنعاء | تذاكر وأسعار السفر البري",
    intro: "صفحة إرشادية للباحثين عن السفر من جدة إلى صنعاء برًا. توفر منصة خطوط زحل البحث والمقارنة للرحلات المنشورة من شركات النقل المستقلة، وتظهر الأسعار والمقاعد والمواعيد وفق البيانات المتاحة.",
    points: ["البحث عن رحلات جدة – صنعاء", "مقارنة السعر والموعد والمقاعد", "اختيار الرحلة الاقتصادية أو VIP عند توفرها", "الحجز عبر منصة خطوط زحل"],
    from: "جدة",
    to: "صنعاء",
  },
  "jeddah-aden": {
    title: "حجز جدة إلى عدن | تذاكر وأسعار السفر البري",
    intro: "ابحث عن رحلات جدة إلى عدن وقارن الخيارات المتاحة من شركات النقل البري المستقلة عبر منصة خطوط زحل.",
    points: ["عرض الرحلات المنشورة والمتاحة", "مقارنة الأسعار والمواعيد", "معرفة المقاعد المتاحة وشركة النقل", "إتمام الحجز وإصدار التذكرة"],
    from: "جدة",
    to: "عدن",
  },
  "riyadh-yemen": {
    title: "حجز رحلات الرياض إلى اليمن | تذاكر وأسعار السفر",
    intro: "استخدم منصة خطوط زحل للبحث عن رحلات النقل البري من الرياض إلى اليمن، ومقارنة الشركات والأسعار والمواعيد والمقاعد قبل الحجز.",
    points: ["البحث عن الرحلات المنشورة من الرياض", "مقارنة خيارات النقل المستقلة", "عرض السعر والموعد والمقاعد", "الحجز الإلكتروني عبر المنصة"],
    from: "الرياض",
  },
};

export default function SeoTravelPage() {
  const { slug } = useParams();
  const page = slug ? PAGES[slug] : undefined;
  if (!page) return <main className="mx-auto max-w-3xl px-6 py-24 text-center" dir="rtl"><h1 className="text-3xl font-black">صفحة السفر غير موجودة</h1><Link className="mt-6 inline-flex items-center gap-2 font-bold text-primary" to="/">العودة إلى خطوط زحل <ArrowLeft className="size-4" /></Link></main>;

  const params = new URLSearchParams();
  if (page.from) params.set("from", page.from);
  if (page.to) params.set("to", page.to);
  const href = `/customer/trips?${params.toString()}`;

  return (
    <main dir="rtl" className="min-h-screen bg-[#f6f8fb] text-[#082750]">
      <header className="border-b bg-white"><div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6"><Link to="/" className="flex items-center gap-3"><img src="/saturn-lines-logo.svg" alt="خطوط زحل" className="h-10 w-auto" /><span className="font-black">خطوط زحل</span></Link><Link to={href} className="inline-flex items-center gap-2 rounded-xl bg-[#0b2b55] px-5 py-3 text-sm font-black text-white"><Search className="size-4" /> ابحث عن رحلة</Link></div></header>
      <section className="bg-[#061a38] px-4 py-16 text-white sm:px-6 sm:py-24"><div className="mx-auto max-w-4xl"><p className="text-sm font-bold text-[#f2c45f]">خطوط زحل — منصة حجز ومقارنة النقل البري</p><h1 className="mt-4 text-4xl font-black leading-tight sm:text-5xl">{page.title}</h1><p className="mt-6 max-w-3xl text-base leading-8 text-white/75">{page.intro}</p><Link to={href} className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#f2c45f] px-6 py-3 font-black text-[#10243c]">استعرض الرحلات <ArrowLeft className="size-5" /></Link></div></section>
      <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6"><div className="grid gap-4 sm:grid-cols-2">{page.points.map((point) => <div key={point} className="rounded-2xl border bg-white p-5 shadow-sm"><CheckCircle2 className="size-5 text-[#b78327]" /><p className="mt-3 font-bold">{point}</p></div>)}</div>
        <div className="mt-12 grid gap-5 md:grid-cols-3"><div className="rounded-2xl border bg-white p-6"><BusFront className="size-6 text-primary" /><h2 className="mt-3 font-black">مقارنة الرحلات</h2><p className="mt-2 text-sm leading-7 text-slate-600">قارن السعر والموعد والمقاعد وشركة النقل بدل البحث في مصادر متفرقة.</p></div><div className="rounded-2xl border bg-white p-6"><Ticket className="size-6 text-primary" /><h2 className="mt-3 font-black">حجز وتذكرة</h2><p className="mt-2 text-sm leading-7 text-slate-600">بعد اختيار الرحلة، يتم إصدار الحجز عبر منصة خطوط زحل وتظهر شركة النقل المنفذة بوضوح.</p></div><div className="rounded-2xl border bg-white p-6"><ShieldCheck className="size-6 text-primary" /><h2 className="mt-3 font-black">منصة وليست شركة نقل</h2><p className="mt-2 text-sm leading-7 text-slate-600">خطوط زحل منصة تجمع المسافر بشركات النقل المستقلة ولا تملك الحافلات ولا تنفذ الرحلات بنفسها.</p></div></div>
        <div className="mt-12 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-7 text-amber-950"><strong>مهم:</strong> الأسعار والمواعيد والمقاعد تتغير بحسب الرحلات التي تنشرها شركات النقل. تأكد من تفاصيل الرحلة قبل إتمام الحجز.</div>
      </section>
      <footer className="border-t bg-white"><div className="mx-auto max-w-5xl px-4 py-8 text-xs leading-6 text-slate-500 sm:px-6">خطوط زحل — منصة حجز ومقارنة النقل البري بين السعودية واليمن.</div></footer>
    </main>
  );
}
