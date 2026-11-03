import { Button, Container, PageHero, SectionHeading } from "@/components/ui";
import { CtaBand, ProcessSteps, ServicesGrid, TechMarquee } from "@/components/sections";
import { useSEO } from "@/hooks";

const FAQ = [
  {
    q: "Quanto tempo leva para desenvolver um sistema?",
    a: "Depende do escopo. Sites institucionais costumam levar de 2 a 4 semanas; sistemas de gestão e plataformas, de 2 a 6 meses, com entregas parciais ao longo do caminho.",
  },
  {
    q: "Vocês trabalham com sistemas que já existem?",
    a: "Sim. Realizamos integrações, migrações, modernização de sistemas legados e assumimos a manutenção e evolução de soluções desenvolvidas por terceiros.",
  },
  {
    q: "Como funciona o investimento?",
    a: "Após o entendimento da necessidade, apresentamos uma proposta com escopo, cronograma e valor fechado ou por etapas. Também oferecemos planos de suporte mensal.",
  },
  {
    q: "O código-fonte fica com o cliente?",
    a: "Sim. Ao final do projeto, o código, a documentação e os acessos são entregues ao cliente, garantindo total independência.",
  },
];

export default function Services() {
  useSEO({
    title: "Soluções e serviços",
    description:
      "Desenvolvimento de sistemas web, sites, plataformas, aplicativos, automação, integrações, consultoria em TI, inteligência artificial, banco de dados e suporte.",
  });

  return (
    <>
      <PageHero
        eyebrow="Soluções e serviços"
        title={<>Soluções completas para cada etapa da sua <span className="text-gradient">transformação digital</span></>}
        description="Da concepção à operação contínua, oferecemos um portfólio de serviços integrados que cobre todo o ciclo de vida das soluções tecnológicas."
      >
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Button to="/contato" size="lg" arrow>
            Solicitar orçamento
          </Button>
          <Button to="/portfolio" size="lg" variant="secondary">
            Ver projetos entregues
          </Button>
        </div>
      </PageHero>

      <section className="pb-24">
        <Container>
          <ServicesGrid />
        </Container>
      </section>

      <TechMarquee />

      <section className="py-24">
        <Container>
          <SectionHeading
            eyebrow="Como trabalhamos"
            title={<>Método que garante <span className="text-gradient">previsibilidade</span></>}
            description="Cinco etapas claras para transformar sua necessidade em um sistema funcionando."
            className="mb-16"
          />
          <ProcessSteps />
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <SectionHeading eyebrow="Dúvidas frequentes" title="Perguntas que recebemos com frequência" className="mb-12" />
          <div className="mx-auto max-w-3xl space-y-3">
            {FAQ.map((f) => (
              <details key={f.q} className="group rounded-2xl border border-white/8 bg-white/[0.03] open:border-electric-400/40">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 font-semibold text-white [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-white/10 text-cyan-300 transition-transform duration-300 group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="px-6 pb-6 text-sm leading-relaxed text-slate-400">{f.a}</p>
              </details>
            ))}
          </div>
        </Container>
      </section>

      <CtaBand />
    </>
  );
}
