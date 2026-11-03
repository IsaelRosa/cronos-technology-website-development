import { Link } from "react-router-dom";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { FacebookIcon, GithubIcon, InstagramIcon, LinkedinIcon, YoutubeIcon } from "./BrandIcons";
import Logo from "./Logo";
import { Container } from "./ui";
import { useCms } from "@/store/cms";
import { NAV_LINKS } from "./Navbar";

export default function Footer() {
  const { state } = useCms();
  const s = state.settings;
  const socials = [
    { key: "instagram", href: s.social.instagram, icon: InstagramIcon, label: "Instagram" },
    { key: "linkedin", href: s.social.linkedin, icon: LinkedinIcon, label: "LinkedIn" },
    { key: "facebook", href: s.social.facebook, icon: FacebookIcon, label: "Facebook" },
    { key: "youtube", href: s.social.youtube, icon: YoutubeIcon, label: "YouTube" },
    { key: "github", href: s.social.github, icon: GithubIcon, label: "GitHub" },
  ].filter((x) => x.href);

  return (
    <footer className="relative mt-24 border-t border-white/5 bg-night-950">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-electric-500/60 to-transparent" aria-hidden />
      <Container className="py-16">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Logo />
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-slate-400">{s.description}</p>
            {socials.length > 0 && (
              <ul className="mt-6 flex gap-2" aria-label="Redes sociais">
                {socials.map(({ key, href, icon: Icon, label }) => (
                  <li key={key}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="inline-flex size-10 items-center justify-center rounded-xl border border-white/10 text-slate-400 transition hover:border-electric-400/50 hover:bg-electric-500/10 hover:text-white"
                    >
                      <Icon className="size-[18px]" />
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-white">Navegação</h3>
            <ul className="mt-5 space-y-3">
              {NAV_LINKS.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-sm text-slate-400 transition hover:text-cyan-300">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-white">Soluções</h3>
            <ul className="mt-5 space-y-3">
              {state.services.slice(0, 6).map((sv) => (
                <li key={sv.id}>
                  <Link to="/solucoes" className="text-sm text-slate-400 transition hover:text-cyan-300">
                    {sv.title}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/portfolio" className="inline-flex items-center gap-1 text-sm font-medium text-electric-300 hover:text-cyan-300">
                  Ver portfólio <ArrowUpRight className="size-3.5" />
                </Link>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-white">Contato</h3>
            <ul className="mt-5 space-y-4 text-sm text-slate-400">
              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 size-4 shrink-0 text-cyan-400" />
                <a href={`mailto:${s.email}`} className="break-all transition hover:text-white">
                  {s.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="mt-0.5 size-4 shrink-0 text-cyan-400" />
                <a href={`tel:${s.phone.replace(/\D/g, "")}`} className="transition hover:text-white">
                  {s.phone}
                </a>
              </li>
              {(s.address || s.city) && (
                <li className="flex items-start gap-3">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-cyan-400" />
                  <span>
                    {s.address}
                    {s.address && s.city ? <br /> : null}
                    {s.city}
                  </span>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 text-xs text-slate-500 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {s.companyName}. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-5">
            <Link to="/privacidade" className="transition hover:text-slate-300">
              Política de Privacidade
            </Link>
            <Link to="/admin" className="transition hover:text-slate-300">
              Área administrativa
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
