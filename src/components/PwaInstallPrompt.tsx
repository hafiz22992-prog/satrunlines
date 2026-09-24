import { Download, X } from "lucide-react";
import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

function isStandalone() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

function isIOS() {
  return /iphone|ipad|ipod/i.test(window.navigator.userAgent);
}

export function PwaInstallPrompt() {
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [ios, setIos] = useState(false);

  useEffect(() => {
    if (isStandalone()) return;

    const onBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallEvent(event as BeforeInstallPromptEvent);
      setVisible(true);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    const iosDevice = isIOS();
    setIos(iosDevice);

    if (iosDevice) {
      const dismissed = sessionStorage.getItem("saturn-pwa-install-dismissed");
      if (!dismissed) setVisible(true);
    }

    return () => window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
  }, []);

  if (!visible) return null;

  const install = async () => {
    if (!installEvent) return;
    await installEvent.prompt();
    const choice = await installEvent.userChoice;
    if (choice.outcome === "accepted") setVisible(false);
    setInstallEvent(null);
  };

  const dismiss = () => {
    setVisible(false);
    sessionStorage.setItem("saturn-pwa-install-dismissed", "1");
  };

  return (
    <div
      className="fixed inset-x-3 bottom-3 z-[100] mx-auto max-w-xl rounded-2xl border border-[#d9c58a] bg-white/95 p-3 shadow-2xl backdrop-blur"
      dir="rtl"
      role="dialog"
      aria-label="تثبيت تطبيق خطوط زحل"
    >
      <div className="flex items-start gap-3">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#112d70] text-white">
          <Download className="size-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-extrabold text-[#0f2355]">تطبيق خطوط زحل على جوالك</p>
          <p className="mt-1 text-xs leading-5 text-slate-600">
            ثبّت خطوط زحل على الشاشة الرئيسية للوصول السريع، أو تابع استخدام الموقع من المتصفح.
            {ios ? " في iPhone/iPad اختر «مشاركة» ثم «إضافة إلى الشاشة الرئيسية»." : ""}
          </p>
          <div className="mt-2.5 flex flex-wrap gap-2">
            {installEvent ? (
              <button
                type="button"
                onClick={install}
                className="rounded-xl bg-[#112d70] px-4 py-2 text-xs font-bold text-white transition hover:opacity-90"
              >
                تثبيت التطبيق
              </button>
            ) : null}
            <button
              type="button"
              onClick={dismiss}
              className="rounded-xl border px-4 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
            >
              المتابعة عبر المتصفح
            </button>
          </div>
        </div>
        <button
          type="button"
          onClick={dismiss}
          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          aria-label="إغلاق رسالة تثبيت التطبيق"
        >
          <X className="size-4" />
        </button>
      </div>
    </div>
  );
}
