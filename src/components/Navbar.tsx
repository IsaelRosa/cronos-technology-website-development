import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, MessageCircle, X } from "lucide-react";
import Logo from "./Logo";
import { Button, Container } from "./ui";
import { cn } from "@/utils/cn";
import { useBodyLock, useScrolled } from "@/hooks";
import { useSettings } from "@/store/cms";
import { whatsappLink } from "@/lib/utils";

export const NAV_LINKS = [
  { to: "/", label: "Início" },
  { to: "/sobre", label: "Sobre" },
  { to: "/solucoes", label: "Soluções" },
  { to: "/portfolio", label: "Portfólio" },
  { to: "/blog", label: "Blog" },
  { to: "/contato", label: "Contato" },
];

export default function Navbar() {
  const scrolled = useScrolled(16);
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const settings = useSettings();
  useBodyLock(open);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        open
          ? "border-b border-white/5 bg-night-950/95 py-3 shadow-[0_10px_40px_-20px_rgba(0,0,0,.8)] backdrop-blur-xl"
          : scrolled
            ? "border-b border-white/5 bg-night-950/80 py-3 shadow-[0_10px_40px_-20px_rgba(0,0,0,.8)] backdrop-blur-xl"
            : "bg-transparent py-5",
      )}
    >
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-electric-500 focus:px-4 focus:py-2 focus:text-white"
      >
        Pular para o conteúdo
      </a>
      <Container className="flex items-center justify-between">
        <Link to="/" aria-label="Khronos Tecnologia e Sistemas - página inicial" className="shrink-0">
          <Logo size={38} />
        </Link>

        <nav aria-label="Navegação principal" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {NAV_LINKS.map((l) => (
              <li key={l.to}>
                <NavLink
                  to={l.to}
                  end={l.to === "/"}
                  className={({ isActive }) =>
                    cn(
                      "relative rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300",
                      isActive ? "text-white" : "text-slate-300 hover:text-white",
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      {l.label}
                      <span
                        className={cn(
                          "absolute inset-x-4 -bottom-0.5 h-px bg-gradient-to-r from-electric-400 to-cyan-400 transition-all duration-300",
                          isActive ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0",
                        )}
                        aria-hidden
                      />
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <a
            href={whatsappLink(settings)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex size-10 items-center justify-center rounded-full border border-white/10 text-slate-300 transition hover:border-emerald-400/50 hover:text-emerald-300"
            aria-label="Falar no WhatsApp"
            title="Falar no WhatsApp"
          >
            <MessageCircle className="size-[18px]" />
          </a>
          <Button to="/contato" size="sm" className="h-10 px-5">
            Solicitar orçamento
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="inline-flex size-11 items-center justify-center rounded-xl border border-white/10 text-white lg:hidden"
          aria-expanded={open}
          aria-controls="menu-mobile"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </Container>

      {/* Menu mobile */}
      <div
        id="menu-mobile"
        className={cn(
          "lg:hidden overflow-hidden transition-[max-height,opacity] duration-500 ease-out",
          open ? "max-h-[80vh] opacity-100" : "max-h-0 opacity-0 pointer-events-none",
        )}
      >
        <Container className="pb-6 pt-4">
          <ul className="flex flex-col gap-1">
            {NAV_LINKS.map((l, i) => (
              <li key={l.to} style={{ transitionDelay: `${i * 40}ms` }}>
                <NavLink
                  to={l.to}
                  end={l.to === "/"}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center justify-between rounded-xl px-4 py-3.5 text-base font-medium transition",
                      isActive ? "bg-electric-500/15 text-white" : "text-slate-300 hover:bg-white/5 hover:text-white",
                    )
                  }
                >
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex flex-col gap-3">
            <Button to="/contato" className="w-full">
              Solicitar orçamento
            </Button>
            <Button href={whatsappLink(settings)} external variant="secondary" className="w-full" icon={<MessageCircle className="size-4" />}>
              Falar no WhatsApp
            </Button>
          </div>
        </Container>
      </div>
    </header>
  );
}
