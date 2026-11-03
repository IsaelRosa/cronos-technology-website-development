import type { CmsState, Settings } from "@/types";
import heroImg from "@/assets/hero.jpg";
import aboutImg from "@/assets/about.jpg";
import pErp from "@/assets/p-erp.jpg";
import pSite from "@/assets/p-site.jpg";
import pEad from "@/assets/p-ead.jpg";
import pApp from "@/assets/p-app.jpg";
import pIa from "@/assets/p-ia.jpg";
import pLog from "@/assets/p-log.jpg";

/** Imagens internas referenciadas por "asset:<chave>" para não inflar o armazenamento local. */
export const ASSETS: Record<string, string> = {
  hero: heroImg,
  about: aboutImg,
  "p-erp": pErp,
  "p-site": pSite,
  "p-ead": pEad,
  "p-app": pApp,
  "p-ia": pIa,
  "p-log": pLog,
};

export function resolveImage(src: string | undefined): string {
  if (!src) return "";
  if (src.startsWith("asset:")) return ASSETS[src.slice(6)] ?? "";
  return src;
}

export const DEFAULT_ADMIN_PASSWORD = "cronos2024";

export const defaultSettings: Settings = {
  companyName: "Cronos Tecnologia e Sistemas",
  shortName: "Cronos",
  tagline: "Tecnologia inteligente, soluções que transformam.",
  description:
    "Desenvolvemos sistemas personalizados, plataformas web, aplicativos e soluções com inteligência artificial que impulsionam a transformação digital de empresas, profissionais e instituições.",
  email: "contato@cronostecnologia.com.br",
  phone: "+55 (11) 99999-0000",
  whatsapp: "5511999990000",
  whatsappMessage: "Olá! Gostaria de solicitar um orçamento com a Cronos Tecnologia e Sistemas.",
  address: "Av. Paulista, 1000 - Bela Vista",
  city: "São Paulo - SP",
  mapUrl: "",
  businessHours: "Segunda a sexta, das 9h às 18h",
  siteUrl: "https://www.cronostecnologia.com.br",
  social: {
    instagram: "https://instagram.com/cronostecnologia",
    linkedin: "https://linkedin.com/company/cronostecnologia",
    facebook: "",
    youtube: "",
    github: "",
  },
  stats: [
    { value: "+120", label: "Projetos entregues" },
    { value: "+10", label: "Anos de experiência" },
    { value: "98%", label: "Clientes satisfeitos" },
    { value: "24h", label: "Tempo médio de resposta" },
  ],
  analyticsId: "",
  formProvider: "none",
  formspreeId: "",
  web3formsKey: "",
  customEndpoint: "",
  adminPasswordHash: "",
};

export const seedState: CmsState = {
  version: 1,
  settings: defaultSettings,
  categories: [
    { id: "gestao", label: "Sistemas de gestão" },
    { id: "sites", label: "Sites institucionais" },
    { id: "web", label: "Aplicações web" },
    { id: "personalizados", label: "Sistemas personalizados" },
    { id: "apps", label: "Aplicativos" },
    { id: "automacao-ia", label: "Automação e IA" },
  ],
  services: [
    {
      id: "s1",
      icon: "Code2",
      title: "Desenvolvimento de sistemas web",
      description:
        "Sistemas robustos, seguros e escaláveis, acessíveis de qualquer lugar e construídos sob medida para o seu processo.",
    },
    {
      id: "s2",
      icon: "Globe",
      title: "Sites institucionais e comerciais",
      description:
        "Presença digital profissional com design moderno, alta performance, SEO e foco em conversão de visitantes em clientes.",
    },
    {
      id: "s3",
      icon: "Layers",
      title: "Plataformas personalizadas",
      description:
        "Marketplaces, portais, áreas de membros e plataformas completas desenhadas a partir do seu modelo de negócio.",
    },
    {
      id: "s4",
      icon: "Smartphone",
      title: "Aplicativos e sistemas de gestão",
      description:
        "Apps mobile e ERPs que organizam operações, equipes, vendas e finanças em uma única solução integrada.",
    },
    {
      id: "s5",
      icon: "Workflow",
      title: "Automação de processos",
      description:
        "Elimine tarefas repetitivas com fluxos automatizados, robôs e integrações que reduzem custos e erros operacionais.",
    },
    {
      id: "s6",
      icon: "Plug",
      title: "Integrações entre sistemas e APIs",
      description:
        "Conectamos ERPs, CRMs, meios de pagamento, marketplaces e serviços externos para que seus dados fluam sem retrabalho.",
    },
    {
      id: "s7",
      icon: "Compass",
      title: "Consultoria em tecnologia da informação",
      description:
        "Diagnóstico, arquitetura e roadmap tecnológico para decisões seguras e investimentos com retorno real.",
    },
    {
      id: "s8",
      icon: "BrainCircuit",
      title: "Soluções com inteligência artificial",
      description:
        "Assistentes virtuais, análise preditiva, processamento de documentos e IA generativa aplicada ao seu negócio.",
    },
    {
      id: "s9",
      icon: "Database",
      title: "Banco de dados e gestão de informações",
      description:
        "Modelagem, migração, otimização e governança de dados para informações confiáveis e decisões mais rápidas.",
    },
    {
      id: "s10",
      icon: "LifeBuoy",
      title: "Manutenção, suporte e evolução",
      description:
        "Acompanhamento contínuo, correções, monitoramento e novas funcionalidades para o seu sistema nunca parar.",
    },
  ],
  projects: [
    {
      id: "p1",
      name: "Cronos ERP Industrial",
      cover: "asset:p-erp",
      description:
        "Sistema de gestão completo para indústria de médio porte, integrando produção, estoque, compras, financeiro e indicadores em tempo real.",
      longDescription:
        "O cliente operava com planilhas e três sistemas desconectados. Desenvolvemos um ERP web sob medida com módulos de PCP, estoque com rastreabilidade por lote, compras, financeiro e BI integrado. O resultado foi a redução de 40% no tempo de fechamento mensal e visibilidade total da operação em um único painel.",
      category: "gestao",
      technologies: ["React", "Node.js", "PostgreSQL", "Docker", "AWS"],
      videoUrl: "",
      link: "https://www.cronostecnologia.com.br",
      client: "Indústria metalúrgica",
      year: "2024",
      featured: true,
      createdAt: "2024-03-10",
    },
    {
      id: "p2",
      name: "Portal Institucional Advocacia Prime",
      cover: "asset:p-site",
      description:
        "Site institucional de alto padrão para escritório de advocacia, com área de artigos, formulário de atendimento e otimização para buscadores.",
      longDescription:
        "Projeto focado em credibilidade e conversão: identidade visual sóbria, arquitetura de informação clara, blog jurídico gerenciável, agendamento de consulta e performance acima de 95 pontos no Lighthouse. Em 90 dias o escritório triplicou os contatos qualificados vindos do Google.",
      category: "sites",
      technologies: ["Next.js", "Tailwind CSS", "Headless CMS", "Vercel"],
      videoUrl: "",
      link: "https://www.cronostecnologia.com.br",
      client: "Escritório de advocacia",
      year: "2024",
      featured: true,
      createdAt: "2024-05-22",
    },
    {
      id: "p3",
      name: "Plataforma EAD Conecta Saber",
      cover: "asset:p-ead",
      description:
        "Plataforma de ensino a distância com trilhas de aprendizagem, aulas em vídeo, avaliações, certificados automáticos e painel do instrutor.",
      longDescription:
        "Ambiente de aprendizagem completo com streaming protegido de vídeos, gamificação, fóruns, emissão de certificados com validação por QR Code e dashboards de engajamento. Suporta milhares de alunos simultâneos com infraestrutura escalável em nuvem.",
      category: "web",
      technologies: ["React", "NestJS", "PostgreSQL", "Redis", "Cloud Storage"],
      videoUrl: "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
      link: "https://www.cronostecnologia.com.br",
      client: "Instituição de ensino",
      year: "2023",
      featured: true,
      createdAt: "2023-11-05",
    },
    {
      id: "p4",
      name: "App Field Service Pro",
      cover: "asset:p-app",
      description:
        "Aplicativo para equipes externas de manutenção: ordens de serviço, check-list com fotos, assinatura digital e sincronização offline.",
      longDescription:
        "Técnicos recebem ordens de serviço no celular, executam check-lists com evidências fotográficas, coletam assinatura do cliente e geram relatório automaticamente. Funciona offline e sincroniza ao reconectar. Integração com o ERP do cliente via API REST.",
      category: "apps",
      technologies: ["Flutter", "Firebase", "Node.js", "REST API"],
      videoUrl: "",
      link: "",
      client: "Empresa de manutenção predial",
      year: "2024",
      featured: false,
      createdAt: "2024-07-18",
    },
    {
      id: "p5",
      name: "Assistente Virtual com IA – Atende+",
      cover: "asset:p-ia",
      description:
        "Automação de atendimento com inteligência artificial integrada ao WhatsApp, treinada com a base de conhecimento da empresa.",
      longDescription:
        "Assistente conversacional baseado em IA generativa que responde dúvidas, qualifica leads, agenda atendimentos e transfere para humanos quando necessário. Fluxos de automação conectam CRM, agenda e e-mail. Redução de 65% no volume de atendimentos manuais.",
      category: "automacao-ia",
      technologies: ["Python", "OpenAI API", "WhatsApp API", "n8n", "PostgreSQL"],
      videoUrl: "",
      link: "https://www.cronostecnologia.com.br",
      client: "Clínica multiespecialidades",
      year: "2025",
      featured: true,
      createdAt: "2025-01-14",
    },
    {
      id: "p6",
      name: "Torre de Controle Logística",
      cover: "asset:p-log",
      description:
        "Sistema personalizado de monitoramento de frotas e entregas, com rastreamento em mapa, roteirização e alertas inteligentes.",
      longDescription:
        "Painel em tempo real que consolida posição de veículos, status de entregas, SLA por cliente e ocorrências. Algoritmo de roteirização reduz quilometragem e um módulo de alertas notifica atrasos antes que impactem o cliente final.",
      category: "personalizados",
      technologies: ["Vue.js", "Laravel", "MySQL", "Mapbox", "WebSockets"],
      videoUrl: "",
      link: "",
      client: "Operador logístico",
      year: "2023",
      featured: false,
      createdAt: "2023-08-02",
    },
  ],
  posts: [
    {
      id: "b1",
      slug: "ia-generativa-nas-empresas",
      title: "IA generativa nas empresas: por onde começar sem desperdiçar investimento",
      excerpt:
        "Antes de sair contratando ferramentas, entenda quais processos realmente se beneficiam de inteligência artificial e como medir o retorno.",
      content:
        "A inteligência artificial generativa deixou de ser tendência para se tornar uma vantagem competitiva concreta. Mas a pergunta que mais ouvimos dos nossos clientes é simples: por onde começar?\n\n## Comece pelos processos, não pela tecnologia\n\nO erro mais comum é adotar uma ferramenta e depois procurar um problema para ela resolver. O caminho inverso é mais eficiente: mapeie tarefas repetitivas, que dependem de leitura ou produção de texto, e que consomem horas da equipe.\n\n- Atendimento e triagem de solicitações\n- Leitura e classificação de documentos\n- Geração de relatórios e resumos\n- Apoio à equipe comercial com propostas\n\n## Meça antes e depois\n\nDefina indicadores claros: tempo médio de resposta, volume de atendimentos manuais, taxa de erro. Sem uma linha de base, é impossível provar o retorno do investimento.\n\n## Segurança e governança dos dados\n\nIA aplicada ao negócio exige cuidado com dados sensíveis. Avalie onde as informações são processadas, quais políticas de retenção existem e como garantir conformidade com a LGPD.\n\n## Conclusão\n\nProjetos de IA bem-sucedidos começam pequenos, com escopo claro e métricas definidas. A Cronos acompanha empresas em toda essa jornada: do diagnóstico à implementação.",
      cover:
        "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
      category: "Inteligência Artificial",
      date: "2025-02-10",
      author: "Equipe Cronos",
      published: true,
    },
    {
      id: "b2",
      slug: "sistema-pronto-ou-sob-medida",
      title: "Sistema pronto ou sob medida? Como decidir com segurança",
      excerpt:
        "Nem todo negócio precisa de um sistema personalizado — mas quando precisa, insistir em soluções genéricas custa caro. Veja os critérios.",
      content:
        "Essa é uma das decisões mais importantes na jornada de transformação digital de uma empresa. Não existe resposta única, mas existem critérios objetivos.\n\n## Quando um sistema pronto resolve\n\nProcessos padronizados de mercado, como emissão de notas fiscais ou folha de pagamento, costumam ser bem atendidos por soluções prontas. O custo inicial é menor e a implantação é rápida.\n\n## Quando o sob medida faz diferença\n\n- Seu processo é um diferencial competitivo\n- Você precisa integrar vários sistemas que não conversam\n- As ferramentas prontas exigem adaptações constantes e planilhas paralelas\n- Os custos de licença crescem junto com a equipe\n\n## O modelo híbrido\n\nMuitas vezes a melhor solução é manter sistemas prontos onde eles funcionam e desenvolver camadas personalizadas que integram tudo e automatizam o que é único do negócio.\n\n## Conclusão\n\nUma consultoria inicial evita investimentos equivocados. Antes de decidir, mapeie processos, custos atuais e o que a operação precisa para crescer.",
      cover:
        "https://images.pexels.com/photos/14314638/pexels-photo-14314638.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
      category: "Desenvolvimento de Sistemas",
      date: "2025-01-22",
      author: "Equipe Cronos",
      published: true,
    },
    {
      id: "b3",
      slug: "tendencias-transformacao-digital",
      title: "5 tendências de transformação digital para acompanhar este ano",
      excerpt:
        "Automação inteligente, dados em tempo real, experiências omnichannel e muito mais: o que deve guiar os investimentos em tecnologia.",
      content:
        "A velocidade das mudanças tecnológicas exige atenção constante. Separamos as tendências que mais devem impactar empresas de todos os portes.\n\n## 1. Automação inteligente\n\nA combinação de automação de processos com IA permite que sistemas tomem decisões simples sozinhos, liberando as equipes para atividades estratégicas.\n\n## 2. Dados em tempo real\n\nPainéis atualizados em tempo real substituem relatórios mensais, permitindo correções de rota imediatas.\n\n## 3. Integração total\n\nEmpresas estão eliminando ilhas de informação com integrações via APIs, conectando vendas, operação e financeiro.\n\n## 4. Experiência do usuário como prioridade\n\nSistemas internos também precisam ser agradáveis de usar. Interfaces bem desenhadas reduzem erros e aceleram treinamento.\n\n## 5. Segurança e privacidade por padrão\n\nCom a LGPD consolidada, proteção de dados deixou de ser diferencial para se tornar requisito básico.\n\n## Conclusão\n\nAcompanhar tendências é importante, mas aplicá-las com critério é o que gera resultado. Conte com a Cronos para transformar tecnologia em vantagem competitiva.",
      cover:
        "https://images.pexels.com/photos/14314636/pexels-photo-14314636.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
      category: "Transformação Digital",
      date: "2024-12-05",
      author: "Equipe Cronos",
      published: true,
    },
  ],
  messages: [
    {
      id: "m1",
      name: "Mariana Costa",
      company: "Costa & Filhos Distribuidora",
      email: "mariana@exemplo.com.br",
      phone: "(11) 98888-1234",
      service: "Aplicativos e sistemas de gestão",
      subject: "Sistema de pedidos para representantes",
      message:
        "Olá! Temos 12 representantes externos e hoje os pedidos chegam por WhatsApp e planilha. Gostaríamos de um aplicativo integrado ao nosso ERP para registro de pedidos e consulta de estoque. Podem nos enviar uma proposta?",
      date: "2025-02-18T14:32:00.000Z",
      read: false,
      delivered: false,
    },
  ],
};
