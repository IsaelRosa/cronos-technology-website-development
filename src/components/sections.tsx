import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  ClipboardList,
  Code2,
  HeartHandshake,
  Layers3,
  MessageSquareText,
  MousePointerClick,
  PencilRuler,
  Rocket,
  ShieldCheck,
  Users,
  Clock3,
} from "lucide-react";
import type { Post } from "@/types";
import { useCms } from "@/store/cms";
import { getIcon } from "@/lib/icons";
import { formatDate } from "@/lib/utils";
import { cn } from "@/utils/cn";
import { Button, Container, Reveal, SectionHeading } from "./ui";

/* ----------------------------------- Serviços ---------------------------------- */
export function ServicesGrid({ limit, compact }: { limit?: number; compact?: boolean }) {
  const { state } = useCms();
  const list = limit ? state.services.slice(0, limit) : state.services;
  return (
    <div className={cn("grid gap-5 sm:grid-cols-2", compact ? "lg:grid-cols-3" : "lg:grid-cols-3 xl:grid-cols-4")}>
      {list.map((s, i) => {
        const Icon = getIcon(s.icon);
        return (
          <Reveal key={s.id} delay={(i % 4) * 80} className="h-full">
            <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/8 bg-night-900/50 p-7 card-glow card-glow-hover">
              <div
                className="pointer-events-none absolute -right-12 -top-12 size-40 rounded-full bg-electric-500/10 blur-3xl transition-opacity duration-500 group-hover:opacity-100 opacity-0"
                aria-hidden
              />
              <span className="relative inline-flex size-12 items-center justify-center rounded-2xl border border-electric-400/20 bg-gradient-to-br from-electric-500/20 to-cyan-400/10 text-cyan-300 shadow-[inset_0_1px_0_rgba(255,255,255,.08)] transition-transform duration-500 group-hover:scale-110">
                <Icon className="size-[22px]" />
              </span>
              <h3 className="relative mt-5 text-lg font-semibold leading-snug text-white">{s.title}</h3>
              <p className="relative mt-3 text-sm leading-relaxed text-slate-400">{s.description}</p>
              <span className="relative mt-auto block h-px w-0 bg-gradient-to-r from-electric-400 to-cyan-400 pt-0 transition-all duration-500 group-hover:w-full" aria-hidden />
            </article>
          </Reveal>
        );
      })}
    </div>
  );
}

/* --------------------------------- Diferenciais -------------------------------- */
const DIFFERENTIALS = [
  {
    icon: PencilRuler,
    title: "Soluções desenvolvidas sob medida",
    text: "Nada de pacotes genéricos: cada sistema nasce dos processos, metas e desafios reais do seu negócio.",
  },
  {
    icon: Layers3,
    title: "Tecnologia moderna e escalável",
    text: "Arquiteturas em nuvem, código limpo e frameworks atuais para crescer sem precisar recomeçar.",
  },
  {
    icon: Users,
    title: "Experiência multidisciplinar",
    text: "Desenvolvimento, dados, design, infraestrutura e gestão de projetos em uma equipe integrada.",
  },
  {
    icon: MousePointerClick,
    title: "Foco na experiência do usuário",
    text: "Interfaces intuitivas que reduzem treinamento, evitam erros e tornam o trabalho mais produtivo.",
  },
  {
    icon: ShieldCheck,
    title: "Segurança e organização dos dados",
    text: "Boas práticas de segurança, backups, controle de acesso e conformidade com a LGPD desde o início.",
  },
  {
    icon: HeartHandshake,
    title: "Atendimento personalizado",
    text: "Comunicação direta com quem desenvolve, prazos claros e acompanhamento próximo em todas as fases.",
  },
];

export function Differentials() {
  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {DIFFERENTIALS.map((d, i) => (
        <Reveal key={d.title} delay={(i % 3) * 90} className="h-full">
          <div className="group relative h-full overflow-hidden rounded-3xl border border-white/8 bg-gradient-to-b from-white/[0.05] to-transparent p-7 card-glow card-glow-hover">
            <div className="flex items-start gap-4">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-electric-500/15 text-electric-300 ring-1 ring-electric-400/20 transition-colors duration-500 group-hover:bg-cyan-400/15 group-hover:text-cyan-300">
                <d.icon className="size-5" />
              </span>
              <div>
                <h3 className="text-base font-semibold text-white">{d.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{d.text}</p>
              </div>
            </div>
            <span className="absolute right-6 top-6 font-display text-4xl font-bold text-white/[0.04]">0{i + 1}</span>
          </div>
        </Reveal>
      ))}
    </div>
  );
}

/* --------------------------------- Como trabalhamos ---------------------------- */
const STEPS = [
  {
    icon: MessageSquareText,
    title: "Entendimento da necessidade",
    text: "Ouvimos o cliente, mapeamos processos, dores e objetivos para entender o problema real a ser resolvido.",
  },
  {
    icon: ClipboardList,
    title: "Planejamento da solução",
    text: "Definimos escopo, arquitetura, tecnologias, cronograma e protótipos para alinhar expectativas antes de codificar.",
  },
  {
    icon: Code2,
    title: "Desenvolvimento e implementação",
    text: "Construímos a solução em ciclos curtos, com entregas incrementais e acompanhamento transparente.",
  },
  {
    icon: CheckCircle2,
    title: "Testes e validação",
    text: "Testes funcionais, de segurança e de desempenho, além da validação com usuários reais.",
  },
  {
    icon: Rocket,
    title: "Entrega e acompanhamento",
    text: "Publicação, treinamento da equipe, monitoramento e evolução contínua do sistema.",
  },
];

export function ProcessSteps() {
  return (
    <ol className="relative grid gap-8 lg:grid-cols-5 lg:gap-6">
      <span
        className="pointer-events-none absolute left-[27px] top-6 hidden h-[calc(100%-3rem)] w-px bg-gradient-to-b from-electric-500/60 via-cyan-400/40 to-transparent sm:block lg:left-0 lg:top-[27px] lg:h-px lg:w-full lg:bg-gradient-to-r"
        aria-hidden
      />
      {STEPS.map((s, i) => (
        <Reveal as="li" key={s.title} delay={i * 110} className="relative flex gap-5 lg:block">
          <div className="relative z-10 flex size-14 shrink-0 items-center justify-center rounded-2xl border border-electric-400/30 bg-night-900 text-cyan-300 shadow-glow">
            <s.icon className="size-6" />
            <span className="absolute -right-2 -top-2 flex size-6 items-center justify-center rounded-full bg-gradient-brand text-[0.7rem] font-bold text-white">
              {i + 1}
            </span>
          </div>
          <div className="lg:mt-6">
            <h3 className="text-base font-semibold text-white">{s.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">{s.text}</p>
          </div>
        </Reveal>
      ))}
    </ol>
  );
}

/* ---------------------------------- Tecnologias -------------------------------- */
const TECHS = [
  "React", "Next.js", "TypeScript", "Node.js", "Python", "PostgreSQL", "MySQL", "Flutter", "Laravel", ".NET",
  "Docker", "AWS", "Azure", "Firebase", "Redis", "OpenAI", "n8n", "Vue.js", "Tailwind CSS", "GraphQL",
];
export function TechMarquee() {
  const items = [...TECHS, ...TECHS];
  return (
    <div className="relative overflow-hidden border-y border-white/5 bg-night-900/40 py-5" aria-label="Tecnologias que utilizamos">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-night-950 to-transparent" aria-hidden />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-night-950 to-transparent" aria-hidden />
      <ul className="flex w-max gap-10 animate-marquee hover:[animation-play-state:paused]">
        {items.map((t, i) => (
          <li key={`${t}-${i}`} className="flex items-center gap-3 text-sm font-medium tracking-wide text-slate-400" aria-hidden={i >= TECHS.length}>
            <span className="size-1.5 rounded-full bg-cyan-400/70" />
            {t}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ------------------------------------ Stats ------------------------------------ */
export function StatsRow({ className }: { className?: string }) {
  const { state } = useCms();
  return (
    <dl className={cn("grid grid-cols-2 gap-6 lg:grid-cols-4", className)}>
      {state.settings.stats.map((s, i) => (
        <Reveal key={s.label} delay={i * 90}>
          <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-6 text-center">
            <dd className="font-display text-3xl font-bold text-gradient sm:text-4xl">{s.value}</dd>
            <dt className="mt-2 text-xs font-medium uppercase tracking-[0.15em] text-slate-400">{s.label}</dt>
          </div>
        </Reveal>
      ))}
    </dl>
  );
}

/* ----------------------------------- CTA band ---------------------------------- */
export function CtaBand() {
  return (
    <section className="py-10">
      <Container>
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] border border-electric-400/20 bg-gradient-to-br from-night-800 via-night-900 to-night-950 px-8 py-14 text-center sm:px-14 lg:py-20">
            <div className="pointer-events-none absolute inset-0 grid-bg opacity-60" aria-hidden />
            <div className="pointer-events-none absolute -left-20 top-0 size-72 rounded-full bg-electric-500/30 blur-[100px]" aria-hidden />
            <div className="pointer-events-none absolute -right-20 bottom-0 size-72 rounded-full bg-cyan-400/20 blur-[100px]" aria-hidden />
            <div className="relative mx-auto max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-slate-300">
                <Clock3 className="size-3.5 text-cyan-300" /> Resposta em até 24 horas úteis
              </span>
              <h2 className="mt-6 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
                Pronto para transformar sua ideia em uma <span className="text-gradient">solução real</span>?
              </h2>
              <p className="mt-5 text-lg text-slate-400">
                Conte o seu desafio. Nossa equipe analisa o cenário e apresenta um caminho tecnológico claro, com prazo e investimento.
              </p>
              <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
                <Button to="/contato" size="lg" arrow>
                  Solicite um orçamento
                </Button>
                <Button to="/portfolio" size="lg" variant="secondary">
                  Conheça nossos projetos
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

/* ------------------------------------ Blog ------------------------------------- */
export function BlogCard({ post, featured }: { post: Post; featured?: boolean }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-white/8 bg-night-900/50 card-glow card-glow-hover">
      <Link to={`/blog/${post.slug}`} className={cn("relative block overflow-hidden", featured ? "aspect-[16/9]" : "aspect-[16/10]")}>
        <img
          src={post.cover}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-night-950/80 to-transparent" aria-hidden />
        <span className="absolute left-4 top-4 rounded-full border border-white/15 bg-night-950/70 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-wider text-cyan-300 backdrop-blur">
          {post.category}
        </span>
      </Link>
      <div className="flex flex-1 flex-col p-6">
        <time dateTime={post.date} className="text-xs font-medium uppercase tracking-wider text-slate-500">
          {formatDate(post.date)}
        </time>
        <h3 className={cn("mt-2 font-semibold leading-snug text-white transition-colors group-hover:text-cyan-200", featured ? "text-2xl" : "text-lg")}>
          <Link to={`/blog/${post.slug}`}>{post.title}</Link>
        </h3>
        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-slate-400">{post.excerpt}</p>
        <Link to={`/blog/${post.slug}`} className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-electric-300 transition hover:text-cyan-300">
          Ler artigo <ArrowRight className="size-4" />
        </Link>
      </div>
    </article>
  );
}

export function BlogPreview() {
  const { state } = useCms();
  const posts = state.posts.filter((p) => p.published).sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3);
  if (posts.length === 0) return null;
  return (
    <section className="py-24">
      <Container>
        <div className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            align="left"
            eyebrow="Blog e conteúdos"
            title={<>Conhecimento que gera <span className="text-gradient">resultado</span></>}
            description="Artigos sobre tecnologia, inteligência artificial, transformação digital e desenvolvimento de sistemas."
          />
          <Link to="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-electric-300 hover:text-cyan-300">
            Ver todos os artigos <ArrowUpRight className="size-4" />
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {posts.map((p, i) => (
            <Reveal key={p.id} delay={i * 90} className="h-full">
              <BlogCard post={p} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
