import { Container, PageHero } from "@/components/ui";
import { CtaBand } from "@/components/sections";
import { PortfolioGallery } from "@/components/portfolio";
import { useCms } from "@/store/cms";
import { useSEO } from "@/hooks";

export default function Portfolio() {
  const { state } = useCms();
  useSEO({
    title: "Portfólio de projetos",
    description:
      "Conheça os sistemas de gestão, sites, aplicações web, aplicativos e soluções com inteligência artificial desenvolvidos pela Khronos Tecnologia e Sistemas.",
  });

  return (
    <>
      <PageHero
        eyebrow="Nosso trabalho"
        title={<>Projetos que demonstram nossa <span className="text-gradient">capacidade técnica</span></>}
        description={`${state.projects.length} soluções desenvolvidas em diferentes segmentos. Filtre por categoria, assista às demonstrações e acesse os sistemas publicados.`}
      />
      <section className="pb-24">
        <Container>
          <PortfolioGallery showFilters showSearch />
        </Container>
      </section>
      <CtaBand />
    </>
  );
}
