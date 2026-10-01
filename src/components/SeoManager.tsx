import { useEffect } from "react";
import { useLocation } from "react-router";

const SITE_URL = "https://www.satrunlines.com";
const SITE_NAME = "خطوط زحل";
const DEFAULT_DESCRIPTION = "منصة خطوط زحل لمقارنة وحجز رحلات النقل البري بين السعودية واليمن، مع عرض الشركات والأسعار والمواعيد والمقاعد وإصدار التذكرة عبر المنصة.";

const ROUTE_META: Record<string, { title: string; description: string; index: boolean }> = {
  "/": {
    title: "خطوط زحل | حجز ومقارنة رحلات النقل البري بين السعودية واليمن",
    description: "قارن واحجز رحلات النقل البري بين السعودية واليمن. اعرض شركات النقل والأسعار والمواعيد والمقاعد ثم اختر الرحلة المناسبة وأصدر تذكرتك عبر منصة خطوط زحل.",
    index: true,
  },
  "/customer": {
    title: "حجز رحلات السعودية إلى اليمن | خطوط زحل",
    description: "ابحث عن رحلات النقل البري من مدن السعودية إلى مدن اليمن وقارن الأسعار والمواعيد والمقاعد وشركات النقل قبل الحجز.",
    index: true,
  },
  "/customer/trips": {
    title: "رحلات وحجوزات النقل البري السعودية اليمن | خطوط زحل",
    description: "استعرض الرحلات المتاحة بين السعودية واليمن وقارن السعر والموعد والمقاعد ونوع الرحلة الاقتصادية أو VIP قبل الحجز.",
    index: true,
  },
  "/customer/companies": {
    title: "شركات النقل البري السعودية اليمن | خطوط زحل",
    description: "تعرّف على شركات النقل البري المستقلة المشاركة في منصة خطوط زحل وقارن خيارات الرحلات قبل الحجز.",
    index: true,
  },
  "/customer/booking": {
    title: "حجز تذكرة السفر | خطوط زحل",
    description: DEFAULT_DESCRIPTION,
    index: false,
  },
  "/customer/contact": {
    title: "تواصل مع خطوط زحل | منصة حجز النقل البري",
    description: "تواصل مع منصة خطوط زحل للاستفسار عن الحجز والرحلات وخدمات المقارنة بين شركات النقل البري.",
    index: true,
  },
  "/auth": {
    title: "تسجيل الدخول | خطوط زحل",
    description: DEFAULT_DESCRIPTION,
    index: false,
  },
  "/company": {
    title: "بوابة شركات النقل | خطوط زحل",
    description: "بوابة شركات النقل المستقلة لإدارة الرحلات والحجوزات عبر منصة خطوط زحل.",
    index: false,
  },
  "/owner": {
    title: "إدارة المنصة | خطوط زحل",
    description: DEFAULT_DESCRIPTION,
    index: false,
  },
};

const KEYWORDS = [
  "حجز سفر",
  "حجز تذكرة",
  "حجز تذاكر",
  "حجز باص",
  "حجز حافلة",
  "تذاكر سفر",
  "أسعار التذاكر",
  "أسعار السفر",
  "رحلات برية",
  "النقل البري",
  "حجز رحلة",
  "السفر من السعودية إلى اليمن",
  "رحلات السعودية اليمن",
  "حجز جدة اليمن",
  "جدة صنعاء",
  "جدة عدن",
  "الرياض اليمن",
  "تذاكر السعودية اليمن",
  "أسعار السفر إلى اليمن",
].join(", ");

function upsertMeta(name: string, content: string, property = false) {
  const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement("meta");
    if (property) element.setAttribute("property", name);
    else element.setAttribute("name", name);
    document.head.appendChild(element);
  }
  element.content = content;
}

function upsertLink(rel: string, href: string) {
  let element = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!element) {
    element = document.createElement("link");
    element.rel = rel;
    document.head.appendChild(element);
  }
  element.href = href;
}

function upsertJsonLd(id: string, data: unknown) {
  let element = document.getElementById(id) as HTMLScriptElement | null;
  if (!element) {
    element = document.createElement("script");
    element.id = id;
    element.type = "application/ld+json";
    document.head.appendChild(element);
  }
  element.textContent = JSON.stringify(data);
}

export function SeoManager() {
  const location = useLocation();

  useEffect(() => {
    const pathname = location.pathname.replace(/\/$/, "") || "/";
    const exact = ROUTE_META[pathname];
    const isCompany = pathname.startsWith("/company/");
    const isTravelPage = pathname.startsWith("/travel/");
    const title = exact?.title ?? (
      isCompany
        ? `شركة نقل بري السعودية اليمن | ${decodeURIComponent(pathname.split("/").pop() ?? "خطوط زحل")}`
        : isTravelPage
          ? "السفر والنقل البري بين السعودية واليمن | خطوط زحل"
          : "خطوط زحل | منصة حجز ومقارنة النقل البري"
    );
    const description = exact?.description ?? (
      isCompany
        ? "صفحة تعريفية بشركة النقل المنفذة للرحلات المتاحة عبر منصة خطوط زحل."
        : isTravelPage
          ? "معلومات وإرشادات حول السفر والنقل البري والحجز والتذاكر بين السعودية واليمن عبر منصة خطوط زحل."
          : DEFAULT_DESCRIPTION
    );
    const index = exact?.index ?? (isCompany || isTravelPage);
    const canonicalPath = pathname === "/" ? "/" : pathname;
    const canonical = `${SITE_URL}${canonicalPath}`;

    document.documentElement.lang = "ar";
    document.documentElement.dir = "rtl";
    document.title = title;
    upsertMeta("description", description);
    upsertMeta("keywords", KEYWORDS);
    upsertMeta("robots", index ? "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" : "noindex,nofollow");
    upsertMeta("googlebot", index ? "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" : "noindex,nofollow");
    upsertMeta("theme-color", "#112d70");

    upsertMeta("og:type", "website", true);
    upsertMeta("og:site_name", SITE_NAME, true);
    upsertMeta("og:locale", "ar_SA", true);
    upsertMeta("og:title", title, true);
    upsertMeta("og:description", description, true);
    upsertMeta("og:url", canonical, true);
    upsertMeta("og:image", `${SITE_URL}/icons/icon-512.png`, true);

    upsertMeta("twitter:card", "summary_large_image");
    upsertMeta("twitter:title", title);
    upsertMeta("twitter:description", description);
    upsertMeta("twitter:image", `${SITE_URL}/icons/icon-512.png`);

    upsertLink("canonical", canonical);

    upsertJsonLd("saturn-lines-organization-schema", {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
      logo: `${SITE_URL}/icons/icon-512.png`,
      description: "منصة رقمية لمقارنة وحجز رحلات النقل البري تربط المسافرين بشركات النقل المستقلة.",
      areaServed: ["SA", "YE"],
      sameAs: [SITE_URL],
    });

    upsertJsonLd("saturn-lines-website-schema", {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL,
      inLanguage: "ar-SA",
      description: DEFAULT_DESCRIPTION,
      potentialAction: {
        "@type": "SearchAction",
        target: `${SITE_URL}/customer/trips?from={from}&to={to}`,
        "query-input": "required name=from required name=to",
      },
    });

    if (isTravelPage || pathname === "/" || pathname === "/customer" || pathname === "/customer/trips") {
      upsertJsonLd("saturn-lines-travel-schema", {
        "@context": "https://schema.org",
        "@type": "TravelAgency",
        name: SITE_NAME,
        url: SITE_URL,
        description: DEFAULT_DESCRIPTION,
        areaServed: [
          { "@type": "Country", name: "السعودية" },
          { "@type": "Country", name: "اليمن" },
        ],
        serviceType: ["حجز تذاكر السفر", "النقل البري", "مقارنة الرحلات"],
      });
    }
  }, [location.pathname]);

  return null;
}
