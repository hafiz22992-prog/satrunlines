import { BookingForm } from "@/components/BookingForm";
import { CustomerLayout } from "@/components/CustomerLayout";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { Link, useSearchParams } from "react-router";

export default function CustomerBooking() {
  const [params] = useSearchParams();
  const from = params.get("from") ?? "";
  const to = params.get("to") ?? "";

  return (
    <CustomerLayout>
      <main className="min-h-[calc(100vh-76px)] bg-[#f7f9fc]">
        <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-10">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2 text-sm font-black text-[#c89532]">
                <ShieldCheck className="size-4" />
                حجز عبر منصة خطوط زحل
              </div>
              <h1 className="text-3xl font-black tracking-tight text-[#082750] sm:text-4xl">
                احجز رحلتك
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-500">
                أكمل بيانات المسافر، اختر شركة النقل والرحلة المناسبة، ثم حدّد طريقة الدفع.
                خطوط زحل منصة حجز ومقارنة، أما تنفيذ الرحلة فيتم بواسطة شركة النقل الموضحة في الحجز.
              </p>
            </div>
            <Link
              to="/customer/trips"
              className="inline-flex items-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-black text-[#082750] shadow-sm transition hover:border-[#c89532]"
            >
              <ArrowRight className="size-4" />
              العودة إلى الرحلات
            </Link>
          </div>

          <BookingForm initialFrom={from} initialTo={to} />
        </section>
      </main>
    </CustomerLayout>
  );
}
