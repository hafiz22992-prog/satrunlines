import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";

export function CompanyRegistrationRequests() {
  const requests = useQuery(api.companyRegistrationRequests.listForOwner);
  const review = useMutation(api.companyRegistrationRequests.review);
  const [notes, setNotes] = useState<Record<string,string>>({});
  const [busy, setBusy] = useState<string | null>(null);
  const decide = async (id: any, decision: "approved" | "rejected" | "needs_info") => {
    setBusy(id);
    try {
      const result = await review({ id, decision, note: notes[id] || undefined });
      toast.success(decision === "approved" ? `تم اعتماد الشركة وإنشاء ملفها (${result.companySlug})` : decision === "rejected" ? "تم رفض الطلب" : "تم طلب استكمال المعلومات");
    } catch (error) { toast.error(error instanceof Error ? error.message : "تعذرت مراجعة الطلب"); }
    finally { setBusy(null); }
  };
  if (requests === undefined) return <div className="rounded-xl border p-6 text-center text-sm text-muted-foreground">جارٍ تحميل الطلبات…</div>;
  if (!requests.length) return <div className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">لا توجد طلبات انضمام حتى الآن.</div>;
  const pending = requests.filter((r) => r.status === "pending" || r.status === "needs_info").length;
  return <div className="space-y-4">
    <div className="flex items-center justify-between rounded-xl bg-muted/40 px-4 py-3 text-sm"><span>إجمالي الطلبات: <b>{requests.length}</b></span><Badge variant={pending ? "default" : "secondary"}>{pending} تحتاج مراجعة</Badge></div>
    {requests.slice().sort((a,b)=>b.createdAt-a.createdAt).map((item) => <article key={item._id} className="space-y-3 rounded-xl border bg-card p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-2"><h3 className="font-black">{item.companyName}</h3><Badge variant={item.status === "approved" ? "default" : item.status === "rejected" ? "destructive" : "secondary"}>{item.status === "pending" ? "جديد" : item.status === "needs_info" ? "استكمال معلومات" : item.status === "approved" ? "معتمد" : "مرفوض"}</Badge></div>
      <div className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
        <p>المسؤول: {item.contactName}</p><p>الجوال: <b dir="ltr">{item.phone}</b></p><p>البريد: <b dir="ltr">{item.email}</b></p><p>المدينة: {item.city}</p><p>السجل التجاري: {item.commercialRegistrationNumber || "—"}</p><p>ترخيص النقل: {item.licenseNumber || "—"}</p>
      </div>
      <p className="text-sm leading-6"><b>المسارات:</b> {item.routes}</p>{item.address && <p className="text-sm"><b>العنوان:</b> {item.address}</p>}{item.notes && <p className="text-sm"><b>ملاحظات مقدم الطلب:</b> {item.notes}</p>}
      {item.reviewNote && <p className="rounded-lg bg-muted p-3 text-sm">آخر ملاحظة: {item.reviewNote}</p>}
      {(item.status === "pending" || item.status === "needs_info") && <>
        <Textarea value={notes[item._id] || ""} onChange={(e)=>setNotes((old)=>({...old,[item._id]:e.target.value}))} placeholder="ملاحظة لمقدم الطلب (اختياري)" />
        <div className="flex flex-wrap gap-2"><Button size="sm" disabled={busy===item._id} onClick={()=>decide(item._id,"approved")}>اعتماد وإنشاء ملف الشركة</Button><Button size="sm" variant="outline" disabled={busy===item._id} onClick={()=>decide(item._id,"needs_info")}>طلب استكمال</Button><Button size="sm" variant="destructive" disabled={busy===item._id} onClick={()=>decide(item._id,"rejected")}>رفض الطلب</Button></div>
      </>}
    </article>)}
  </div>;
}
