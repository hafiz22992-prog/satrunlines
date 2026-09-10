import { Toaster } from "@/components/ui/sonner";
import { RequireAuth } from "@/components/RequireAuth";
import { RoleRouter, OwnerGate, CompanyGate } from "@/components/RoleGate";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexReactClient } from "convex/react";
import React, { StrictMode, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import "./index.css";

const Landing = lazy(() => import("./pages/Landing.tsx"));
const AuthPage = lazy(() => import("./pages/Auth.tsx"));
const OwnerDashboard = lazy(() => import("./pages/OwnerDashboard.tsx"));
const CompanyDashboard = lazy(() => import("./pages/CompanyDashboard.tsx"));
const CustomerHome = lazy(() => import("./pages/CustomerHome.tsx"));
const CustomerTrips = lazy(() => import("./pages/CustomerTrips.tsx"));
const CustomerCompanies = lazy(() => import("./pages/CustomerCompanies.tsx"));
const CustomerBooking = lazy(() => import("./pages/CustomerBooking.tsx"));
const CustomerContact = lazy(() => import("./pages/CustomerContact.tsx"));
const OwnerLogin = lazy(() => import("./pages/OwnerLogin.tsx"));
const CompanyLogin = lazy(() => import("./pages/CompanyLogin.tsx"));
const CompanyPage = lazy(() => import("./pages/CompanyPage.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));
const Callback = lazy(() => import("./pages/Callback.tsx"));

function RouteLoading() {
  return <div className="min-h-screen flex items-center justify-center"><div className="animate-pulse text-muted-foreground">Loading...</div></div>;
}

class RootErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; message: string; stack: string }> {
  state = { hasError: false, message: "", stack: "" };
  static getDerivedStateFromError(error: Error) { return { hasError: true, message: error.message || "Unknown runtime error", stack: error.stack || "" }; }
  componentDidCatch(err: Error) { console.error("[RootErrorBoundary] Runtime crash:", err); }
  render() {
    if (this.state.hasError) return <div className="min-h-screen flex items-center justify-center bg-background p-6"><div className="max-w-lg text-center"><p className="text-sm font-semibold">حدث خطأ غير متوقع</p><p className="mt-2 text-xs text-muted-foreground break-words">{this.state.message}</p><button type="button" onClick={() => { window.location.href = "/"; }} className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground">العودة للصفحة الرئيسية</button></div></div>;
    return this.props.children;
  }
}

class RouteErrorBoundary extends React.Component<{ children: React.ReactNode; routeName: string }, { hasError: boolean; message: string }> {
  state = { hasError: false, message: "" };
  static getDerivedStateFromError(error: Error) { return { hasError: true, message: error.message || "خطأ غير معروف" }; }
  componentDidCatch(err: Error) { console.error(`[RouteErrorBoundary] ${this.props.routeName} crashed:`, err); }
  render() {
    if (this.state.hasError) return <div className="min-h-screen flex items-center justify-center bg-background p-6" dir="rtl"><div className="max-w-md text-center rounded-xl border bg-card p-8"><p className="text-lg font-bold text-destructive">حدث خطأ</p><p className="mt-2 text-sm text-muted-foreground">{this.state.message}</p><button type="button" onClick={() => { window.location.href = "/"; }} className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground">العودة للصفحة الرئيسية</button></div></div>;
    return this.props.children;
  }
}

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RootErrorBoundary>
      <ConvexAuthProvider client={convex}>
        <BrowserRouter>
          <Suspense fallback={<RouteLoading />}>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/callback" element={<Callback />} />

              {/* تجربة المسافر موزعة على صفحات مستقلة مع أسماء واضحة في شريط التنقل. */}
              <Route path="/customer" element={<RouteErrorBoundary routeName="/customer"><CustomerHome /></RouteErrorBoundary>} />
              <Route path="/customer/trips" element={<RouteErrorBoundary routeName="/customer/trips"><CustomerTrips /></RouteErrorBoundary>} />
              <Route path="/customer/companies" element={<RouteErrorBoundary routeName="/customer/companies"><CustomerCompanies /></RouteErrorBoundary>} />
              <Route path="/customer/booking" element={<RouteErrorBoundary routeName="/customer/booking"><CustomerBooking /></RouteErrorBoundary>} />
              <Route path="/customer/contact" element={<RouteErrorBoundary routeName="/customer/contact"><CustomerContact /></RouteErrorBoundary>} />

              <Route path="/auth" element={<AuthPage redirectAfterAuth="/dashboard" />} />
              <Route path="/company/auth" element={<RouteErrorBoundary routeName="/company/auth"><CompanyLogin /></RouteErrorBoundary>} />
              <Route path="/company/:slug" element={<RouteErrorBoundary routeName="/company/:slug"><CompanyPage /></RouteErrorBoundary>} />
              <Route path="/company" element={<RouteErrorBoundary routeName="/company"><RequireAuth><CompanyGate><CompanyDashboard /></CompanyGate></RequireAuth></RouteErrorBoundary>} />
              <Route path="/owner/auth" element={<OwnerLogin />} />
              <Route path="/owner" element={<RouteErrorBoundary routeName="/owner"><RequireAuth><OwnerGate><OwnerDashboard /></OwnerGate></RequireAuth></RouteErrorBoundary>} />
              <Route path="/dashboard" element={<RouteErrorBoundary routeName="/dashboard"><RequireAuth><RoleRouter /></RequireAuth></RouteErrorBoundary>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
        <Toaster />
      </ConvexAuthProvider>
    </RootErrorBoundary>
  </StrictMode>,
);
