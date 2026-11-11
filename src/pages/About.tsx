import { Compass, Eye, Gem, Lightbulb, Target, Users } from "lucide-react";
import { Button, Container, PageHero, Reveal, SectionHeading } from "@/components/ui";
import { CtaBand, Differentials, StatsRow } from "@/components/sections";
import { ASSETS } from "@/data/seed";
import { useSEO } from "@/hooks";

const PILLARS = [
  {
    icon: Target,
    title: "Missão",
    text: "Transformar desafios de negócio em soluções tecnológicas eficientes, seguras e fáceis de usar, gerando resultados mensuráveis para nossos clientes.",
  },
  {
    icon: Eye,
    title: "Visão",
    text: "Ser reconhecida como a parceira de tecnologia mais confiável para empresas e instituições que buscam crescer com inovação e inteligência.",
  },
  {
    icon: Gem,
    title: "Valores",
    text: "Excelência técnica, transparência, proximidade com o cliente, responsabilidade com os dados e melhoria contínua em tudo o que fazemos.",
  },
];

const COMMITMENTS = [
  { icon: Compass, title: "Desenvolvimento de soluções personalizadas", text: "Cada projeto começa com uma folha em branco e o seu processo como ponto de partida." },
  { icon: Gem, title: "Compromisso com qualidade e eficiência", text: "Código testado, documentação clara e desempenho medido em cada entrega." },
  { icon: Lightbulb, title: "Tecnologia aplicada à resolução de problemas", text: "Escolhemos a tecnologia certa para o problema certo, sem modismos ou complexidade desnecessária." },
  { icon: Users, title: "Atendimento próximo e personalizado", text: "Você fala diretamente com quem entende e constrói a sua solução, do início ao pós-entrega." },
  { icon: Target, title: "Inovação e melhoria contínua", text: "Acompanhamos tendências como IA e automação para evoluir seus sistemas continuamente." },
];

export default function About() {
  useSEO({
    title: "Sobre a Kronos",
    description:
      "Conheça a Kronos Tecnologia e Sistemas: missão, visão, valores e o compromisso com soluções digitais sob medida, qualidade e inovação contínua.",
  });

  return (
    <>
      <PageHero
        eyebrow="Sobre a empresa"
        title={<>Tecnologia com propósito, <span className="text-gradient">construída para durar</span></>}
        description="A Kronos Tecnologia e Sistemas desenvolve software sob medida para empresas, profissionais e instituições que querem operar com mais eficiência, inteligência e segurança."
      />

      <section className="pb-24">
        <Container>
          <div className="grid items-center gap-14 lg:grid-cols-2">
            <Reveal>
              <h2 className="text-3xl font-bold text-white sm:text-4xl">Quem somos</h2>
              <div className="mt-6 space-y-5 text-base leading-relaxed text-slate-400 sm:text-lg">
                <p>
                  Somos uma empresa de tecnologia especializada no desenvolvimento de sistemas personalizados, plataformas web,
                  aplicativos e soluções de transformação digital. Nosso nome vem do deus grego do tempo — porque acreditamos que
                  tecnologia bem aplicada devolve às pessoas o seu recurso mais valioso.
                </p>
                <p>
                  Atuamos como parceira estratégica: entendemos o negócio antes de propor tecnologia, planejamos com critério e
                  entregamos soluções escaláveis que acompanham o crescimento dos nossos clientes.
                </p>
                <p>
                  Nossa equipe multidisciplinar reúne desenvolvedores, especialistas em dados, designers e gestores de projeto,
                  unidos pelo compromisso com qualidade, segurança e resultado.
                </p>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button to="/portfolio" arrow>
                  Ver nossos projetos
                </Button>
                <Button to="/contato" variant="secondary">
                  Falar com a equipe
                </Button>
              </div>
            </Reveal>
            <Reveal delay={120}>
              <div className="relative">
                <div className="overflow-hidden rounded-[2rem] border border-white/10">
                  <img src={ASSETS.about} alt="Ambiente de trabalho da equipe Kronos" className="aspect-[4/3] w-full object-cover" loading="lazy" />
                </div>
                <div className="absolute -left-4 -bottom-6 rounded-2xl border border-white/10 bg-night-900/90 p-5 backdrop-blur sm:-left-8">
                  <p className="text-sm font-semibold text-white">Tecnologia inteligente,</p>
                  <p className="text-sm text-gradient font-semibold">soluções que transformam.</p>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <div className="grid gap-5 md:grid-cols-3">
            {PILLARS.map((p, i) => (
              <Reveal key={p.title} delay={i * 100} className="h-full">
                <div className="relative h-full overflow-hidden rounded-3xl border border-white/8 bg-gradient-to-b from-night-800/60 to-night-900/40 p-8">
                  <span className="flex size-12 items-center justify-center rounded-2xl bg-gradient-brand text-white shadow-glow">
                    <p.icon className="size-5" />
                  </span>
                  <h3 className="mt-6 text-xl font-bold text-white">{p.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-400">{p.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <SectionHeading
            eyebrow="Nosso compromisso"
            title={<>O que você pode esperar <span className="text-gradient">da Kronos</span></>}
            className="mb-14"
          />
          <div className="mx-auto max-w-4xl space-y-4">
            {COMMITMENTS.map((c, i) => (
              <Reveal key={c.title} delay={i * 70}>
                <div className="flex gap-5 rounded-2xl border border-white/8 bg-white/[0.03] p-6 transition hover:border-electric-400/40">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-electric-500/15 text-cyan-300">
                    <c.icon className="size-5" />
                  </span>
                  <div>
                    <h3 className="font-semibold text-white">{c.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-slate-400">{c.text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <SectionHeading eyebrow="Diferenciais" title="Por que somos diferentes" className="mb-14" />
          <Differentials />
          <StatsRow className="mt-14" />
        </Container>
      </section>

      <CtaBand />
    </>
  );
}
