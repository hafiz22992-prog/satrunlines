import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useConvexAuth } from "convex/react";
import { LogOut, User } from "lucide-react";
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
    <div dir="rtl" className="min-h-screen bg-[#f7f8fb] text-slate-900">
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link to="/customer" className="flex min-w-0 items-center gap-3">
            <img src="/saturn-lines-logo.svg" alt="خطوط زحل" className="h-11 w-auto shrink-0" />
            <div className="hidden border-r border-slate-200 pr-3 sm:block">
              <p className="font-black tracking-tight text-[#0b2b55]">خطوط زحل</p>
              <p className="text-[11px] text-slate-500">منصة مقارنة وحجز النقل البري</p>
            </div>
          </Link>

          <nav aria-label="تنقل المسافر" className="flex max-w-[58vw] items-center gap-2 overflow-x-auto pb-1 text-sm font-bold text-slate-600 lg:gap-6">
            <Link to="/customer" className="shrink-0 rounded-lg px-2 py-2 transition hover:text-[#0b2b55]">الرئيسية</Link>
            <Link to="/customer/trips" className="shrink-0 rounded-lg px-2 py-2 transition hover:text-[#0b2b55]">الرحلات</Link>
            <Link to="/customer/companies" className="shrink-0 rounded-lg px-2 py-2 transition hover:text-[#0b2b55]">شركات النقل</Link>
            <Link to="/customer/booking" className="shrink-0 rounded-lg px-2 py-2 transition hover:text-[#0b2b55]">الحجز</Link>
            <Link to="/customer/contact" className="shrink-0 rounded-lg px-2 py-2 transition hover:text-[#0b2b55]">تواصل معنا</Link>
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            {isAuthenticated && <span className="hidden text-xs font-bold text-slate-500 xl:inline">{user?.name || user?.email || "مسافر"}</span>}
            {isAuthenticated ? (
              <Button type="button" variant="outline" size="sm" className="gap-1.5 rounded-xl" onClick={handleSignOut}>
                <LogOut className="size-4" />
                <span className="hidden sm:inline">خروج</span>
              </Button>
            ) : (
              <Button asChild size="sm" className="gap-1.5 rounded-xl bg-[#0b2b55] hover:bg-[#123d72]">
                <Link to="/auth"><User className="size-4" />تسجيل الدخول</Link>
              </Button>
            )}
          </div>
        </div>
      </header>
      {children}
      <footer className="border-t bg-[#071a35] text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm sm:px-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-black">خطوط زحل</p>
            <p className="mt-1 text-xs text-white/60">منصة تربط المسافر بشركات النقل البري المستقلة.</p>
          </div>
          <div className="flex flex-wrap gap-4 text-xs font-bold text-white/70">
            <Link to="/customer/trips" className="hover:text-white">الرحلات</Link>
            <Link to="/customer/companies" className="hover:text-white">شركات النقل</Link>
            <Link to="/customer/booking" className="hover:text-white">الحجز</Link>
            <Link to="/customer/contact" className="hover:text-white">تواصل معنا</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
