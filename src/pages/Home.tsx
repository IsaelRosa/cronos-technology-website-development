import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, BrainCircuit, CheckCircle2, Plug, ShieldCheck, Sparkles, Terminal } from "lucide-react";
import { Button, Container, Eyebrow, Orb, Reveal, SectionHeading } from "@/components/ui";
import { BlogPreview, CtaBand, Differentials, ProcessSteps, ServicesGrid, StatsRow, TechMarquee } from "@/components/sections";
import { PortfolioGallery } from "@/components/portfolio";
import { useCms } from "@/store/cms";
import { ASSETS } from "@/data/seed";
import { useSEO } from "@/hooks";

const TERMINAL_LINES = [
  "$ khronos deploy erp-industrial --prod",
  "✓ build concluído em 38s",
  "✓ 214 testes automatizados aprovados",
  "✓ integrações: ERP · WhatsApp · Pagamentos",
  "✓ sistema online — disponibilidade 99,9%",
];

function TerminalCard() {
  const [lines, setLines] = useState<string[]>([]);
  const [current, setCurrent] = useState("");

  useEffect(() => {
    let li = 0;
    let ci = 0;
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      const line = TERMINAL_LINES[li];
      if (ci <= line.length) {
        setCurrent(line.slice(0, ci));
        ci += 1;
        timer = setTimeout(tick, li === 0 ? 38 : 16);
      } else {
        setLines((prev) => [...prev, line]);
        setCurrent("");
        li += 1;
        ci = 0;
        if (li < TERMINAL_LINES.length) timer = setTimeout(tick, 420);
        else
          timer = setTimeout(() => {
            setLines([]);
            li = 0;
            tick();
          }, 5200);
      }
    };
    timer = setTimeout(tick, 900);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="glass rounded-2xl p-4 font-mono text-[0.72rem] leading-relaxed shadow-card sm:text-xs" aria-hidden>
      <div className="mb-3 flex items-center gap-1.5">
        <span className="size-2.5 rounded-full bg-red-400/80" />
        <span className="size-2.5 rounded-full bg-amber-400/80" />
        <span className="size-2.5 rounded-full bg-emerald-400/80" />
        <span className="ml-3 flex items-center gap-1.5 text-slate-500">
          <Terminal className="size-3" /> khronos-cli
        </span>
      </div>
      <div className="min-h-[6.2rem] space-y-1">
        {lines.map((l, i) => (
          <p key={i} className={l.startsWith("✓") ? "text-emerald-300" : "text-slate-200"}>
            {l}
          </p>
        ))}
        <p className={current.startsWith("✓") ? "text-emerald-300" : "text-slate-200"}>
          {current}
          <span className="ml-0.5 inline-block h-3 w-1.5 translate-y-0.5 bg-cyan-300 animate-blink" />
        </p>
      </div>
    </div>
  );
}

export default function Home() {
  const { state } = useCms();
  const s = state.settings;
  useSEO({
    title: "Khronos Tecnologia e Sistemas | Tecnologia inteligente, soluções que transformam",
    description: s.description,
  });

  return (
    <>
      {/* ------------------------------------ HERO ------------------------------------ */}
      <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40 lg:pb-28">
        <div className="pointer-events-none absolute inset-0 grid-bg grid-fade" aria-hidden />
        <Orb className="-left-32 top-20 h-[460px] w-[460px] bg-electric-600/30" />
        <Orb className="right-[-10%] top-[30%] h-[520px] w-[520px] bg-cyan-500/15" />
        <Container className="relative">
          <div className="grid items-center gap-16 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <div className="animate-fade-up">
                <Eyebrow>Desenvolvimento de software & transformação digital</Eyebrow>
              </div>
              <h1
                className="mt-7 text-[2.6rem] font-bold leading-[1.05] text-white sm:text-6xl lg:text-[4.2rem] animate-fade-up"
                style={{ animationDelay: "120ms" }}
              >
                Tecnologia inteligente,{" "}
                <span className="text-gradient">soluções que transformam.</span>
              </h1>
              <p className="mt-7 max-w-xl text-lg leading-relaxed text-slate-400 animate-fade-up" style={{ animationDelay: "220ms" }}>
                {s.description}
              </p>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row animate-fade-up" style={{ animationDelay: "320ms" }}>
                <Button to="/portfolio" size="lg" arrow>
                  Conheça nossos projetos
                </Button>
                <Button to="/contato" size="lg" variant="secondary">
                  Solicite um orçamento
                </Button>
              </div>
              <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-400 animate-fade-up" style={{ animationDelay: "420ms" }}>
                {["Sistemas sob medida", "Apps e plataformas", "IA e automação", "Suporte contínuo"].map((t) => (
                  <li key={t} className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-cyan-400" /> {t}
                  </li>
                ))}
              </ul>
            </div>

            {/* Composição visual */}
            <div className="relative lg:col-span-6 animate-fade-up" style={{ animationDelay: "260ms" }}>
              <div className="pointer-events-none absolute -inset-10 rounded-full border border-electric-400/10 animate-spin-slow" aria-hidden>
                <span className="absolute left-1/2 top-0 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400 shadow-[0_0_14px_#22d3ee]" />
              </div>
              <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-night-900 shadow-[0_40px_90px_-30px_rgba(47,107,255,.5)]">
                <img
                  src={ASSETS.hero}
                  alt="Painel de dados futurista representando soluções tecnológicas da Khronos"
                  width={1280}
                  height={720}
                  fetchPriority="high"
                  className="aspect-[16/10] w-full object-cover"
                />
                <div className="pointer-events-none absolute inset-x-0 top-0 h-24 w-full bg-gradient-to-b from-cyan-300/20 to-transparent animate-scan" aria-hidden />
                <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10 rounded-[1.75rem]" aria-hidden />
              </div>

              {/* Chips flutuantes */}
              <div className="absolute -left-4 top-8 hidden animate-float sm:block lg:-left-10">
                <div className="glass flex items-center gap-3 rounded-2xl px-4 py-3 shadow-card">
                  <span className="flex size-9 items-center justify-center rounded-xl bg-emerald-400/15 text-emerald-300">
                    <ShieldCheck className="size-4" />
                  </span>
                  <div>
                    <p className="text-xs text-slate-400">Disponibilidade</p>
                    <p className="text-sm font-semibold text-white">99,9% uptime</p>
                  </div>
                </div>
              </div>
              <div className="absolute -right-3 top-1/3 hidden animate-float-slow sm:block lg:-right-8" style={{ animationDelay: "1.2s" }}>
                <div className="glass flex items-center gap-3 rounded-2xl px-4 py-3 shadow-card">
                  <span className="flex size-9 items-center justify-center rounded-xl bg-electric-500/20 text-electric-300">
                    <Plug className="size-4" />
                  </span>
                  <div>
                    <p className="text-xs text-slate-400">Integrações</p>
                    <p className="text-sm font-semibold text-white">APIs conectadas</p>
                  </div>
                </div>
              </div>
              <div className="absolute -right-2 -top-6 hidden animate-float sm:block" style={{ animationDelay: "2s" }}>
                <div className="glass flex items-center gap-3 rounded-2xl px-4 py-3 shadow-card">
                  <span className="flex size-9 items-center justify-center rounded-xl bg-cyan-400/15 text-cyan-300">
                    <BrainCircuit className="size-4" />
                  </span>
                  <div>
                    <p className="text-xs text-slate-400">Inteligência artificial</p>
                    <p className="text-sm font-semibold text-white">Aplicada ao negócio</p>
                  </div>
                </div>
              </div>
              <div className="relative -mt-14 ml-auto w-[88%] sm:absolute sm:-bottom-10 sm:left-6 sm:mt-0 sm:w-[62%] lg:-left-6">
                <TerminalCard />
              </div>
            </div>
          </div>
        </Container>
      </section>

      <TechMarquee />

      {/* ----------------------------------- SOBRE ----------------------------------- */}
      <section className="relative py-24 lg:py-32" id="sobre">
        <Container>
          <div className="grid items-center gap-14 lg:grid-cols-2">
            <Reveal className="relative">
              <div className="relative overflow-hidden rounded-[2rem] border border-white/10">
                <img src={ASSETS.about} alt="Estúdio de desenvolvimento da Khronos" loading="lazy" className="aspect-[4/3] w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-tr from-night-950/70 via-transparent to-transparent" aria-hidden />
              </div>
            </Reveal>
            <div>
              <SectionHeading
                align="left"
                eyebrow="Sobre a Khronos"
                title={<>Parceira estratégica na sua <span className="text-gradient">jornada digital</span></>}
                description="A Khronos Tecnologia e Sistemas nasceu para aproximar tecnologia de ponta das necessidades reais de empresas, profissionais e instituições. Unimos engenharia de software, design e visão de negócio para entregar soluções que funcionam — e continuam funcionando."
              />
              <Reveal delay={150}>
                <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                  {[
                    "Desenvolvimento de soluções personalizadas",
                    "Compromisso com qualidade e eficiência",
                    "Tecnologia aplicada à resolução de problemas",
                    "Atendimento próximo e personalizado",
                    "Inovação e melhoria contínua",
                    "Transparência em prazos e investimento",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3 text-sm text-slate-300">
                      <Sparkles className="mt-0.5 size-4 shrink-0 text-cyan-400" />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  <Button to="/sobre" variant="secondary" arrow>
                    Conheça a empresa
                  </Button>
                </div>
              </Reveal>
            </div>
          </div>
        </Container>
      </section>

      {/* ---------------------------------- SERVIÇOS --------------------------------- */}
      <section className="relative py-24 lg:py-28" id="solucoes">
        <Orb className="left-1/2 top-0 h-[400px] w-[800px] -translate-x-1/2 bg-electric-600/15" />
        <Container className="relative">
          <SectionHeading
            eyebrow="Soluções e serviços"
            title={<>Tudo o que sua operação precisa, <span className="text-gradient">em um só parceiro</span></>}
            description="Do site institucional ao sistema de gestão completo, passando por automações e inteligência artificial."
            className="mb-14"
          />
          <ServicesGrid limit={6} compact />
          <Reveal className="mt-12 text-center">
            <Button to="/solucoes" variant="secondary" arrow>
              Ver todas as soluções
            </Button>
          </Reveal>
        </Container>
      </section>

      {/* --------------------------------- PORTFÓLIO --------------------------------- */}
      <section className="relative py-24 lg:py-28" id="portfolio">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-night-900/60 to-transparent" aria-hidden />
        <Container className="relative">
          <div className="mb-14 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading
              align="left"
              eyebrow="Nosso trabalho"
              title={<>Projetos que viraram <span className="text-gradient">resultado para nossos clientes</span></>}
              description="Uma amostra do que já construímos: sistemas de gestão, plataformas, aplicativos e soluções com IA em produção."
            />
            <Link to="/portfolio" className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-electric-300 hover:text-cyan-300">
              Ver portfólio completo <ArrowUpRight className="size-4" />
            </Link>
          </div>
          <PortfolioGallery limit={3} featuredOnly showFilters={false} />
          <Reveal className="mt-12 text-center lg:hidden">
            <Button to="/portfolio" variant="secondary" arrow>
              Ver portfólio completo
            </Button>
          </Reveal>
        </Container>
      </section>

      {/* -------------------------------- DIFERENCIAIS ------------------------------- */}
      <section className="py-24 lg:py-28" id="diferenciais">
        <Container>
          <SectionHeading
            eyebrow="Diferenciais"
            title={<>Por que empresas escolhem a <span className="text-gradient">Khronos</span></>}
            description="Mais do que código: entregamos previsibilidade, segurança e uma parceria de longo prazo."
            className="mb-14"
          />
          <Differentials />
          <StatsRow className="mt-14" />
        </Container>
      </section>

      {/* --------------------------------- PROCESSO ---------------------------------- */}
      <section className="relative py-24 lg:py-28" id="como-trabalhamos">
        <Orb className="right-0 top-1/3 h-[380px] w-[380px] bg-cyan-500/10" />
        <Container className="relative">
          <SectionHeading
            eyebrow="Como trabalhamos"
            title={<>Um processo claro, <span className="text-gradient">do briefing à entrega</span></>}
            description="Metodologia enxuta com entregas incrementais e comunicação constante em todas as etapas."
            className="mb-16"
          />
          <ProcessSteps />
        </Container>
      </section>

      <BlogPreview />
      <CtaBand />
    </>
  );
}
