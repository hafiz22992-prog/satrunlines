import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useConvexAuth } from "convex/react";
import { LogOut, User, Ticket, CircleHelp } from "lucide-react";
import { Link, useNavigate } from "react-router";

export function CustomerLayout({ children }: { children: React.ReactNode }) {
  const { user, signOut } = useAuth();
  const { isAuthenticated } = useConvexAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div dir="rtl" className="min-h-screen bg-[#f5f7fa] text-slate-900">
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link to="/customer" className="flex min-w-0 items-center gap-3">
            <img src="/saturn-lines-logo.svg" alt="خطوط زحل" className="h-11 w-auto shrink-0" />
            <div className="hidden border-r border-slate-200 pr-3 sm:block">
              <p className="font-black tracking-tight text-[#082750]">خطوط زحل</p>
              <p className="text-[10px] font-bold text-slate-500">منصة حجز النقل البري</p>
            </div>
          </Link>

          <nav aria-label="تنقل المسافر" className="hidden items-center gap-1 text-sm font-black text-slate-600 md:flex">
            <Link to="/customer" className="rounded-xl px-4 py-2.5 transition hover:bg-[#f5f7fa] hover:text-[#082750]">الرئيسية</Link>
            <Link to="/customer/trips" className="rounded-xl px-4 py-2.5 transition hover:bg-[#f5f7fa] hover:text-[#082750]">ابحث عن رحلة</Link>
            <Link to="/customer/booking" className="rounded-xl px-4 py-2.5 transition hover:bg-[#f5f7fa] hover:text-[#082750]">احجز رحلتك</Link>
            <Link to="/customer/contact" className="rounded-xl px-4 py-2.5 transition hover:bg-[#f5f7fa] hover:text-[#082750]">المساعدة</Link>
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            <Link to="/customer/booking" className="hidden items-center gap-1.5 rounded-xl bg-[#f8f4e9] px-3 py-2 text-xs font-black text-[#082750] transition hover:bg-[#efe6cf] sm:flex">
              <Ticket className="size-4" />
              احجز رحلتك
            </Link>
            {isAuthenticated && (
              <Link to="/customer/booking" className="hidden items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-black text-[#082750] transition hover:bg-[#f5f7fa] sm:flex">
                <Ticket className="size-4" />
                حجوزاتي
              </Link>
            )}
            {isAuthenticated && <span className="hidden text-xs font-bold text-slate-500 xl:inline">{user?.name || user?.email || "مسافر"}</span>}
            {isAuthenticated ? (
              <Button type="button" variant="outline" size="sm" className="gap-1.5 rounded-xl" onClick={handleSignOut}>
                <LogOut className="size-4" />
                <span className="hidden sm:inline">خروج</span>
              </Button>
            ) : (
              <Button asChild size="sm" className="gap-1.5 rounded-xl bg-[#082750] px-4 hover:bg-[#123d72]">
                <Link to="/auth"><User className="size-4" />تسجيل الدخول</Link>
              </Button>
            )}
          </div>
        </div>
      </header>
      {children}
      <footer className="border-t border-white/10 bg-[#061a38] text-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-lg font-black">خطوط زحل</p>
              <p className="mt-2 max-w-md text-xs leading-6 text-white/60">منصة مقارنة وحجز تربط المسافر بشركات النقل البري المستقلة. الرحلة تُنفذ بواسطة شركة النقل الموضحة في الحجز.</p>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-white/70">
              <Link to="/customer" className="rounded-lg px-3 py-2 hover:bg-white/10 hover:text-white">الرئيسية</Link>
              <Link to="/customer/trips" className="rounded-lg px-3 py-2 hover:bg-white/10 hover:text-white">الرحلات</Link>
              <Link to="/customer/booking" className="rounded-lg px-3 py-2 hover:bg-white/10 hover:text-white">احجز رحلتك</Link>
              <Link to="/customer/contact" className="rounded-lg px-3 py-2 hover:bg-white/10 hover:text-white"><CircleHelp className="ml-1 inline size-3.5" />المساعدة</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
