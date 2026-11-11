import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Cookie, X } from "lucide-react";
import { WhatsappIcon } from "./BrandIcons";
import { useSettings } from "@/store/cms";
import { whatsappLink } from "@/lib/utils";

/* ------------------------------ Scroll to top ------------------------------ */
export function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);
  return null;
}

/* ---------------------------- Botão do WhatsApp ---------------------------- */
export function WhatsAppButton() {
  const settings = useSettings();
  if (!settings.whatsapp) return null;
  return (
    <a
      href={whatsappLink(settings)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar com a Kronos pelo WhatsApp"
      className="group fixed bottom-6 right-5 z-40 flex items-center gap-3 sm:right-6"
    >
      <span className="pointer-events-none hidden rounded-full border border-white/10 bg-night-900/90 px-4 py-2 text-sm font-medium text-white opacity-0 shadow-xl backdrop-blur transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 translate-x-2 sm:block">
        Fale conosco
      </span>
      <span className="relative flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_12px_30px_-8px_rgba(37,211,102,.7)] transition-transform duration-300 group-hover:scale-105">
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-pulse-ring" aria-hidden />
        <WhatsappIcon width={26} height={26} className="relative" />
      </span>
    </a>
  );
}

/* --------------------------- Consentimento LGPD ---------------------------- */
const CONSENT_KEY = "cronos_cookie_consent";

function loadAnalytics(id: string) {
  if (!id || document.getElementById("ga-script")) return;
  const s = document.createElement("script");
  s.id = "ga-script";
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
  document.head.appendChild(s);
  const w = window as unknown as { dataLayer: unknown[]; gtag?: (...args: unknown[]) => void };
  w.dataLayer = w.dataLayer || [];
  w.gtag = function gtag(...args: unknown[]) {
    w.dataLayer.push(args);
  };
  w.gtag("js", new Date());
  w.gtag("config", id, { anonymize_ip: true });
}

export function CookieBanner() {
  const settings = useSettings();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (!stored) {
      const t = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(t);
    }
    if (stored === "accepted") loadAnalytics(settings.analyticsId);
  }, [settings.analyticsId]);

  const decide = (value: "accepted" | "rejected") => {
    localStorage.setItem(CONSENT_KEY, value);
    setVisible(false);
    if (value === "accepted") loadAnalytics(settings.analyticsId);
  };

  if (!visible) return null;
  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Aviso de cookies e privacidade"
      className="fixed inset-x-4 bottom-24 z-40 mx-auto max-w-xl rounded-2xl border border-white/10 bg-night-900/95 p-5 shadow-2xl backdrop-blur-xl animate-fade-up sm:inset-x-auto sm:left-6 sm:bottom-6"
    >
      <div className="flex gap-4">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-electric-500/15 text-cyan-300">
          <Cookie className="size-5" />
        </span>
        <div className="flex-1">
          <p className="text-sm font-semibold text-white">Sua privacidade importa</p>
          <p className="mt-1 text-sm leading-relaxed text-slate-400">
            Utilizamos cookies para melhorar sua experiência e analisar o uso do site, em conformidade com a LGPD.
            Saiba mais na nossa{" "}
            <Link to="/privacidade" className="text-cyan-300 underline underline-offset-2">
              Política de Privacidade
            </Link>
            .
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => decide("accepted")}
              className="rounded-full bg-gradient-brand px-5 py-2 text-sm font-semibold text-white"
            >
              Aceitar
            </button>
            <button
              type="button"
              onClick={() => decide("rejected")}
              className="rounded-full border border-white/10 px-5 py-2 text-sm font-medium text-slate-300 hover:bg-white/5"
            >
              Apenas essenciais
            </button>
          </div>
        </div>
        <button
          type="button"
          onClick={() => decide("rejected")}
          aria-label="Fechar aviso"
          className="self-start text-slate-500 hover:text-white"
        >
          <X className="size-4" />
        </button>
      </div>
    </div>
  );
}
