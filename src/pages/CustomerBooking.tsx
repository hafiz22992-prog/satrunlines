import { BookingForm } from "@/components/BookingForm";
import { CustomerLayout } from "@/components/CustomerLayout";
import { useSearchParams } from "react-router";

export default function CustomerBooking() {
  const [params] = useSearchParams();
  return <CustomerLayout><main className="mx-auto max-w-5xl px-4 py-10 sm:px-6"><div className="mb-7"><p className="text-sm font-black text-[#c89532]">الحجز</p><h1 className="mt-1 text-3xl font-black text-[#0b2b55]">احجز رحلتك</h1><p className="mt-2 text-sm text-slate-500">أكمل بيانات المسافر واختر الرحلة وطريقة الدفع المتاحة.</p></div><BookingForm initialFrom={params.get("from") ?? ""} initialTo={params.get("to") ?? ""} /></main></CustomerLayout>;
}
