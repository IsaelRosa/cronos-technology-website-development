export interface Category {
  id: string;
  label: string;
}

export interface Project {
  id: string;
  name: string;
  cover: string; // URL, data URL ou "asset:<chave>"
  description: string;
  longDescription?: string;
  category: string; // id da categoria
  technologies: string[];
  videoUrl?: string;
  link?: string;
  client?: string;
  year?: string;
  featured: boolean;
  createdAt: string;
}

export interface Service {
  id: string;
  icon: string; // nome do ícone (ver lib/icons.ts)
  title: string;
  description: string;
}

export interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string; // texto com markdown simplificado
  cover: string;
  category: string;
  date: string; // ISO yyyy-mm-dd
  author: string;
  published: boolean;
}

export interface ContactMessage {
  id: string;
  name: string;
  company?: string;
  email: string;
  phone: string;
  service: string;
  subject: string;
  message: string;
  date: string; // ISO
  read: boolean;
  delivered: boolean; // enviado por e-mail via integração
}

export type FormProvider = "none" | "hostinger" | "formspree" | "web3forms" | "custom";

export interface SocialLinks {
  instagram: string;
  linkedin: string;
  facebook: string;
  youtube: string;
  github: string;
}

export interface Stat {
  value: string;
  label: string;
}

export interface Settings {
  companyName: string;
  shortName: string;
  tagline: string;
  description: string;
  email: string;
  phone: string;
  whatsapp: string; // somente dígitos com DDI, ex: 5511999999999
  whatsappMessage: string;
  address: string;
  city: string;
  mapUrl: string; // URL de incorporação do Google Maps (opcional)
  businessHours: string;
  siteUrl: string;
  social: SocialLinks;
  stats: Stat[];
  analyticsId: string;
  formProvider: FormProvider;
  formspreeId: string;
  web3formsKey: string;
  customEndpoint: string;
  adminPasswordHash: string;
}

export interface CmsState {
  version: number;
  categories: Category[];
  projects: Project[];
  services: Service[];
  posts: Post[];
  messages: ContactMessage[];
  settings: Settings;
}
