import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Building2, MapPin, Phone } from "lucide-react";
import { Link } from "react-router";
import { CustomerLayout } from "@/components/CustomerLayout";

export default function CustomerCompanies() {
  const companies = useQuery(api.companies.listActive);
  return <CustomerLayout><main className="mx-auto max-w-7xl px-4 py-10 sm:px-6"><p className="text-sm font-black text-[#c89532]">شركاء النقل</p><h1 className="mt-1 text-3xl font-black text-[#0b2b55]">شركات النقل</h1><p className="mt-2 text-sm text-slate-500">تعرّف على شركات النقل المستقلة المتاحة على المنصة.</p><div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{(companies ?? []).map(company => <article key={company._id} className="rounded-3xl border bg-white p-6 shadow-sm"><div className="flex items-center gap-3"><div className="flex size-12 items-center justify-center rounded-2xl bg-[#0b2b55]/5"><Building2 className="size-6 text-[#0b2b55]"/></div><div><h2 className="font-black text-[#0b2b55]">{company.name}</h2><p className="text-xs text-slate-500">شركة نقل مستقلة</p></div></div>{company.address && <p className="mt-5 flex gap-2 text-sm text-slate-600"><MapPin className="size-4 shrink-0"/>{company.address}</p>}{company.phone && <p className="mt-2 flex gap-2 text-sm text-slate-600"><Phone className="size-4 shrink-0"/>{company.phone}</p>}<Link to={`/company/${company.slug}`} className="mt-5 block rounded-xl border px-4 py-2 text-center text-sm font-black text-[#0b2b55]">عرض الشركة</Link></article>)}</div></main></CustomerLayout>;
}
