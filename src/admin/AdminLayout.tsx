import { useState, type FormEvent } from "react";
import { Link, Navigate, NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  ArrowUpRight,
  Briefcase,
  ExternalLink,
  FileText,
  Inbox,
  LayoutDashboard,
  Lock,
  LogOut,
  Menu,
  Settings,
  Wrench,
  X,
  AlertTriangle,
} from "lucide-react";
import Logo, { LogoMark } from "@/components/Logo";
import { useCms } from "@/store/cms";
import { useSEO } from "@/hooks";
import { formatDateTime } from "@/lib/utils";
import { cn } from "@/utils/cn";
import { AdminButton, AdminCard, AdminHeader, Input } from "./fields";

/* ---------------------------------- Login ---------------------------------- */
export function AdminLogin() {
  const { isAuthed, login } = useCms();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  useSEO({ title: "Área administrativa", noIndex: true });

  if (isAuthed) return <Navigate to="/admin/dashboard" replace />;

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const ok = await login(password);
    setBusy(false);
    if (ok) navigate("/admin/dashboard", { replace: true });
    else setError("Senha incorreta. Tente novamente.");
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-16">
      <div className="pointer-events-none absolute inset-0 grid-bg grid-fade" aria-hidden />
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-[420px] w-[620px] -translate-x-1/2 rounded-full bg-electric-600/25 blur-[140px]" aria-hidden />
      <div className="relative w-full max-w-md animate-fade-up">
        <div className="mb-8 flex justify-center">
          <Link to="/" aria-label="Voltar ao site">
            <Logo size={44} />
          </Link>
        </div>
        <form onSubmit={onSubmit} className="rounded-3xl border border-white/10 bg-night-900/80 p-8 shadow-2xl backdrop-blur">
          <span className="flex size-12 items-center justify-center rounded-2xl bg-electric-500/15 text-cyan-300">
            <Lock className="size-5" />
          </span>
          <h1 className="mt-5 text-2xl font-bold text-white">Painel administrativo</h1>
          <p className="mt-1.5 text-sm text-slate-400">Acesso restrito à equipe da Khronos.</p>
          <label className="mt-6 block">
            <span className="mb-1.5 block text-sm font-medium text-slate-200">Senha de acesso</span>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
              autoComplete="current-password"
              placeholder="••••••••"
              aria-invalid={!!error}
            />
          </label>
          {error && (
            <p role="alert" className="mt-2 text-sm text-red-300">
              {error}
            </p>
          )}
          <AdminButton type="submit" disabled={busy || !password} className="mt-6 h-11 w-full">
            {busy ? "Verificando..." : "Entrar"}
          </AdminButton>
          <p className="mt-5 rounded-xl border border-amber-400/20 bg-amber-400/10 p-3 text-xs leading-relaxed text-amber-200">
            Senha inicial: <code className="font-mono font-semibold">cronos2024</code>. Altere-a em{" "}
            <strong>Configurações → Segurança</strong> após o primeiro acesso.
          </p>
        </form>
        <p className="mt-6 text-center text-xs text-slate-500">
          <Link to="/" className="hover:text-slate-300">
            ← Voltar para o site
          </Link>
        </p>
      </div>
    </div>
  );
}

/* --------------------------------- Layout ---------------------------------- */
const MENU = [
  { to: "/admin/dashboard", label: "Visão geral", icon: LayoutDashboard },
  { to: "/admin/projetos", label: "Portfólio", icon: Briefcase },
  { to: "/admin/servicos", label: "Serviços", icon: Wrench },
  { to: "/admin/blog", label: "Blog", icon: FileText },
  { to: "/admin/mensagens", label: "Mensagens", icon: Inbox },
  { to: "/admin/configuracoes", label: "Configurações", icon: Settings },
];

export function AdminLayout() {
  const { isAuthed, logout, state, storageWarning } = useCms();
  const [open, setOpen] = useState(false);
  useSEO({ title: "Painel administrativo", noIndex: true });

  if (!isAuthed) return <Navigate to="/admin" replace />;
  const unread = state.messages.filter((m) => !m.read).length;

  const nav = (
    <nav className="flex flex-1 flex-col gap-1" aria-label="Menu administrativo">
      {MENU.map((m) => (
        <NavLink
          key={m.to}
          to={m.to}
          onClick={() => setOpen(false)}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition",
              isActive ? "bg-electric-500/15 text-white ring-1 ring-electric-400/30" : "text-slate-400 hover:bg-white/5 hover:text-white",
            )
          }
        >
          <m.icon className="size-[18px]" />
          {m.label}
          {m.to === "/admin/mensagens" && unread > 0 && (
            <span className="ml-auto rounded-full bg-cyan-400 px-2 py-0.5 text-[0.65rem] font-bold text-night-950">{unread}</span>
          )}
        </NavLink>
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen bg-night-950 lg:grid lg:grid-cols-[260px_1fr]">
      {/* Sidebar desktop */}
      <aside className="sticky top-0 hidden h-screen flex-col border-r border-white/5 bg-night-900/50 p-5 lg:flex">
        <Link to="/admin/dashboard" className="mb-8 flex items-center gap-3 px-2">
          <LogoMark size={36} />
          <span className="flex flex-col leading-none">
            <span className="font-display text-sm font-bold tracking-[0.18em] text-white">KHRONOS</span>
            <span className="mt-1 text-[0.6rem] uppercase tracking-[0.25em] text-slate-500">Painel</span>
          </span>
        </Link>
        {nav}
        <div className="mt-auto space-y-1 border-t border-white/5 pt-4">
          <Link to="/" target="_blank" className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm text-slate-400 hover:bg-white/5 hover:text-white">
            <ExternalLink className="size-[18px]" /> Ver site
          </Link>
          <button type="button" onClick={logout} className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm text-slate-400 hover:bg-white/5 hover:text-white">
            <LogOut className="size-[18px]" /> Sair
          </button>
        </div>
      </aside>

      {/* Topbar mobile */}
      <div className="flex min-w-0 flex-col">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-white/5 bg-night-950/80 px-4 py-3 backdrop-blur lg:hidden">
          <Link to="/admin/dashboard" className="flex items-center gap-2">
            <LogoMark size={30} />
            <span className="font-display text-sm font-bold tracking-[0.18em] text-white">PAINEL</span>
          </Link>
          <button type="button" onClick={() => setOpen((o) => !o)} aria-label="Menu" aria-expanded={open} className="rounded-xl border border-white/10 p-2 text-white">
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </header>
        {open && (
          <div className="border-b border-white/5 bg-night-900 p-4 lg:hidden">
            {nav}
            <div className="mt-3 flex gap-2 border-t border-white/5 pt-3">
              <Link to="/" className="flex-1 rounded-xl border border-white/10 px-3 py-2 text-center text-sm text-slate-300">
                Ver site
              </Link>
              <button type="button" onClick={logout} className="flex-1 rounded-xl border border-white/10 px-3 py-2 text-sm text-slate-300">
                Sair
              </button>
            </div>
          </div>
        )}

        <main className="flex-1 p-5 sm:p-8 lg:p-10">
          {storageWarning && (
            <div className="mb-6 flex items-start gap-3 rounded-xl border border-amber-400/30 bg-amber-400/10 p-4 text-sm text-amber-200">
              <AlertTriangle className="mt-0.5 size-4 shrink-0" /> {storageWarning}
            </div>
          )}
          <Outlet />
        </main>
      </div>
    </div>
  );
}

/* -------------------------------- Dashboard -------------------------------- */
export function AdminDashboard() {
  const { state } = useCms();
  const unread = state.messages.filter((m) => !m.read).length;
  const cards = [
    { label: "Projetos no portfólio", value: state.projects.length, to: "/admin/projetos", icon: Briefcase },
    { label: "Serviços publicados", value: state.services.length, to: "/admin/servicos", icon: Wrench },
    { label: "Artigos do blog", value: state.posts.filter((p) => p.published).length, to: "/admin/blog", icon: FileText },
    { label: "Mensagens não lidas", value: unread, to: "/admin/mensagens", icon: Inbox },
  ];
  const recent = state.messages.slice(0, 5);
  const integrationOk = state.settings.formProvider !== "none";

  return (
    <>
      <AdminHeader title="Visão geral" description={`Bem-vindo ao painel da ${state.settings.companyName}. Gerencie todo o conteúdo do site sem tocar em código.`} />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((c) => (
          <Link key={c.label} to={c.to} className="group rounded-2xl border border-white/8 bg-night-900/60 p-5 transition hover:border-electric-400/40">
            <div className="flex items-center justify-between">
              <span className="flex size-10 items-center justify-center rounded-xl bg-electric-500/15 text-cyan-300">
                <c.icon className="size-5" />
              </span>
              <ArrowUpRight className="size-4 text-slate-600 transition group-hover:text-cyan-300" />
            </div>
            <p className="mt-4 font-display text-3xl font-bold text-white">{c.value}</p>
            <p className="mt-1 text-xs uppercase tracking-wider text-slate-500">{c.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <AdminCard className="lg:col-span-2" title="Mensagens recentes" description="Solicitações enviadas pelo formulário de contato.">
          {recent.length === 0 ? (
            <p className="text-sm text-slate-500">Nenhuma mensagem recebida ainda.</p>
          ) : (
            <ul className="divide-y divide-white/5">
              {recent.map((m) => (
                <li key={m.id} className="flex items-start justify-between gap-4 py-3">
                  <div className="min-w-0">
                    <p className="flex items-center gap-2 text-sm font-medium text-white">
                      {!m.read && <span className="size-2 rounded-full bg-cyan-400" aria-label="Não lida" />}
                      {m.name} {m.company && <span className="text-slate-500">· {m.company}</span>}
                    </p>
                    <p className="truncate text-sm text-slate-400">{m.subject}</p>
                  </div>
                  <span className="shrink-0 text-xs text-slate-500">{formatDateTime(m.date)}</span>
                </li>
              ))}
            </ul>
          )}
          <Link to="/admin/mensagens" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-electric-300 hover:text-cyan-300">
            Ver todas <ArrowUpRight className="size-4" />
          </Link>
        </AdminCard>

        <AdminCard title="Status do site">
          <ul className="space-y-3 text-sm">
            <li className="flex items-center justify-between">
              <span className="text-slate-400">Envio de e-mails</span>
              <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-semibold", integrationOk ? "bg-emerald-400/15 text-emerald-300" : "bg-amber-400/15 text-amber-200")}>
                {integrationOk ? "Configurado" : "Pendente"}
              </span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-slate-400">Google Analytics</span>
              <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-semibold", state.settings.analyticsId ? "bg-emerald-400/15 text-emerald-300" : "bg-white/10 text-slate-300")}>
                {state.settings.analyticsId ? "Ativo" : "Não configurado"}
              </span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-slate-400">Senha personalizada</span>
              <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-semibold", state.settings.adminPasswordHash ? "bg-emerald-400/15 text-emerald-300" : "bg-amber-400/15 text-amber-200")}>
                {state.settings.adminPasswordHash ? "Definida" : "Padrão"}
              </span>
            </li>
          </ul>
          <Link to="/admin/configuracoes" className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-electric-300 hover:text-cyan-300">
            Abrir configurações <ArrowUpRight className="size-4" />
          </Link>
        </AdminCard>
      </div>
    </>
  );
}
