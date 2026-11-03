import { Home as HomeIcon } from "lucide-react";
import { Button, Container, PageHero } from "@/components/ui";
import { useSettings } from "@/store/cms";
import { useSEO } from "@/hooks";

export function Privacy() {
  const s = useSettings();
  useSEO({
    title: "Política de Privacidade",
    description: "Saiba como a Cronos Tecnologia e Sistemas coleta, utiliza e protege seus dados pessoais em conformidade com a LGPD.",
  });

  const sections = [
    {
      title: "1. Quem somos",
      text: `A ${s.companyName} ("Cronos") é a controladora dos dados pessoais coletados por meio deste site. Em caso de dúvidas, entre em contato pelo e-mail ${s.email}.`,
    },
    {
      title: "2. Quais dados coletamos",
      text: "Coletamos apenas os dados fornecidos voluntariamente por você no formulário de contato (nome, empresa, e-mail, telefone, tipo de serviço, assunto e descrição da necessidade) e dados de navegação anonimizados, quando você autoriza o uso de cookies analíticos.",
    },
    {
      title: "3. Finalidade do tratamento",
      text: "Utilizamos seus dados exclusivamente para responder à sua solicitação, elaborar propostas comerciais, prestar suporte e melhorar a experiência de navegação. Não vendemos nem compartilhamos dados com terceiros para fins de marketing.",
    },
    {
      title: "4. Base legal",
      text: "O tratamento é realizado com fundamento no consentimento do titular (art. 7º, I, da LGPD), na execução de procedimentos preliminares a contrato (art. 7º, V) e no legítimo interesse para melhoria dos serviços (art. 7º, IX).",
    },
    {
      title: "5. Cookies",
      text: "Utilizamos cookies essenciais ao funcionamento do site e, mediante consentimento, cookies analíticos (Google Analytics) para compreender como o site é utilizado. Você pode revogar o consentimento a qualquer momento limpando os dados do navegador.",
    },
    {
      title: "6. Armazenamento e segurança",
      text: "Adotamos medidas técnicas e administrativas para proteger os dados contra acessos não autorizados, incluindo comunicação criptografada (HTTPS), controle de acesso e boas práticas de desenvolvimento seguro. Os dados são mantidos pelo tempo necessário ao atendimento da finalidade ou conforme exigências legais.",
    },
    {
      title: "7. Seus direitos",
      text: "Nos termos da LGPD, você pode solicitar a confirmação da existência de tratamento, acesso, correção, anonimização, portabilidade, eliminação dos dados e revogação do consentimento. Para exercer seus direitos, envie uma solicitação para o e-mail institucional informado acima.",
    },
    {
      title: "8. Alterações desta política",
      text: "Esta política pode ser atualizada periodicamente. A versão vigente estará sempre disponível nesta página, com a data da última atualização.",
    },
  ];

  return (
    <>
      <PageHero eyebrow="LGPD" title="Política de Privacidade" description="Transparência sobre como tratamos os seus dados pessoais." />
      <section className="pb-24">
        <Container>
          <div className="mx-auto max-w-3xl space-y-8 rounded-[2rem] border border-white/8 bg-night-900/50 p-8 sm:p-12">
            {sections.map((sec) => (
              <div key={sec.title}>
                <h2 className="text-lg font-semibold text-white">{sec.title}</h2>
                <p className="mt-2 leading-relaxed text-slate-400">{sec.text}</p>
              </div>
            ))}
            <p className="border-t border-white/5 pt-6 text-xs text-slate-500">
              Última atualização: {new Date().toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}

export function NotFound() {
  useSEO({ title: "Página não encontrada", noIndex: true });
  return (
    <section className="flex min-h-[70vh] items-center pt-32 pb-20">
      <Container className="text-center">
        <p className="font-display text-7xl font-bold text-gradient sm:text-9xl">404</p>
        <h1 className="mt-4 text-2xl font-bold text-white sm:text-3xl">Página não encontrada</h1>
        <p className="mx-auto mt-3 max-w-md text-slate-400">O endereço pode ter sido alterado ou removido. Volte para a página inicial e continue navegando.</p>
        <Button to="/" className="mt-8" icon={<HomeIcon className="size-4" />}>
          Ir para o início
        </Button>
      </Container>
    </section>
  );
}
