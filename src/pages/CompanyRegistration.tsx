import { CustomerLayout } from "@/components/CustomerLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { useMutation, useQuery } from "convex/react";
import { Building2, CheckCircle2, Loader2, LockKeyhole } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import { toast } from "sonner";

export default function CompanyRegistration() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const mine = useQuery(api.companyRegistrationRequests.mine, isAuthenticated ? {} : "skip");
  const submit = useMutation(api.companyRegistrationRequests.submit);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({ companyName: "", contactName: "", phone: "", city: "", address: "", routes: "", commercialRegistrationNumber: "", licenseNumber: "", notes: "" });
  const update = (key: keyof typeof form, value: string) => setForm((old) => ({ ...old, [key]: value }));
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    try {
      await submit({ ...form, address: form.address || undefined, commercialRegistrationNumber: form.commercialRegistrationNumber || undefined, licenseNumber: form.licenseNumber || undefined, notes: form.notes || undefined });
      toast.success("تم استلام طلبك وإرساله للمراجعة");
      setForm({ companyName: "", contactName: "", phone: "", city: "", address: "", routes: "", commercialRegistrationNumber: "", licenseNumber: "", notes: "" });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "تعذر إرسال الطلب");
    } finally { setBusy(false); }
  };
  return <CustomerLayout><main dir="rtl" className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
    <div className="mb-7 rounded-3xl bg-[#082750] p-7 text-white sm:p-9">
      <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-white/10"><Building2 className="size-7 text-[#e2b451]" /></div>
      <p className="text-sm font-bold text-[#e2b451]">شركاء النجاح</p>
      <h1 className="mt-2 text-2xl font-black sm:text-3xl">انضم إلى شركات النقل في خطوط زحل</h1>
      <p className="mt-3 text-sm leading-7 text-white/75">أرسل بيانات شركتك ليقوم فريق المنصة بمراجعتها والتواصل معك. إرسال الطلب لا يعني اعتماد الشركة أو نشر رحلاتها تلقائياً.</p>
    </div>
    {!isAuthenticated ? <div className="rounded-2xl border bg-white p-7 text-center shadow-sm">
      <LockKeyhole className="mx-auto size-9 text-[#b78327]" /><h2 className="mt-3 text-lg font-black text-[#082750]">سجّل الدخول لإرسال طلبك</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">نستخدم بريد حسابك لربط الطلب بك وإتاحة متابعة حالته بأمان.</p>
      <Button asChild className="mt-5 rounded-xl bg-[#082750]"><Link to="/auth?returnTo=/company/register">تسجيل الدخول بالبريد الإلكتروني</Link></Button>
    </div> : <>
      <div className="mb-5 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">سيُربط الطلب بالبريد: <b dir="ltr">{user?.email}</b></div>
      {mine?.filter((item) => item.status === "pending" || item.status === "needs_info").map((item) => <div key={item._id} className="mb-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm"><b>لديك طلب قيد المتابعة: {item.companyName}</b><p className="mt-1">الحالة: {item.status === "pending" ? "قيد المراجعة" : "يتطلب استكمال معلومات"}</p>{item.reviewNote && <p className="mt-1">ملاحظة المنصة: {item.reviewNote}</p>}</div>)}
      {mine !== undefined && !mine.some((item) => item.status === "pending" || item.status === "needs_info") && <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border bg-white p-6 shadow-sm sm:p-8">
        <div className="grid gap-4 sm:grid-cols-2">
          {([["companyName","اسم شركة النقل"],["contactName","اسم المسؤول"],["phone","رقم الجوال"],["city","المدينة"],["commercialRegistrationNumber","رقم السجل التجاري (اختياري)"],["licenseNumber","رقم ترخيص النقل (اختياري)"]] as const).map(([key,label]) => <div key={key} className="space-y-2"><Label htmlFor={key}>{label}{["companyName","contactName","phone","city"].includes(key) && " *"}</Label><Input id={key} value={form[key]} onChange={(e) => update(key,e.target.value)} required={["companyName","contactName","phone","city"].includes(key)} /></div>)}
        </div>
        <div className="space-y-2"><Label htmlFor="address">عنوان الشركة (اختياري)</Label><Input id="address" value={form.address} onChange={(e)=>update("address",e.target.value)} /></div>
        <div className="space-y-2"><Label htmlFor="routes">المدن والمسارات التي تخدمها الشركة *</Label><Textarea id="routes" value={form.routes} onChange={(e)=>update("routes",e.target.value)} required placeholder="مثال: جدة – صنعاء، جدة – عدن" /></div>
        <div className="space-y-2"><Label htmlFor="notes">معلومات إضافية (اختياري)</Label><Textarea id="notes" value={form.notes} onChange={(e)=>update("notes",e.target.value)} /></div>
        <Button type="submit" disabled={busy} className="h-12 w-full rounded-xl bg-[#082750] font-black">{busy ? <><Loader2 className="ml-2 size-4 animate-spin" /> جارٍ إرسال الطلب</> : "إرسال طلب الانضمام"}</Button>
      </form>}
      {mine === undefined && <div className="py-8 text-center text-sm text-slate-500">جارٍ تحميل بيانات طلباتك…</div>}
    </>}
    <p className="mt-6 text-center text-xs leading-6 text-slate-500">منصة خطوط زحل وسيط رقمي للحجز والمقارنة؛ تنفيذ الرحلات مسؤولية شركة النقل المعتمدة.</p>
  </main></CustomerLayout>;
}
