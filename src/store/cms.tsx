import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type {
  Category,
  CmsState,
  ContactMessage,
  Post,
  Project,
  Service,
  Settings,
} from "@/types";
import { DEFAULT_ADMIN_PASSWORD, seedState } from "@/data/seed";

const STORAGE_KEY = "cronos_cms_v1";
const SESSION_KEY = "cronos_admin_session";

export const uid = () =>
  Math.random().toString(36).slice(2, 8) + Date.now().toString(36);

export function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function hashPassword(pw: string): Promise<string> {
  const input = "cronos::" + pw;
  try {
    if (typeof crypto !== "undefined" && crypto.subtle) {
      const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
      return Array.from(new Uint8Array(buf))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
    }
  } catch {
    /* fallback abaixo */
  }
  let h = 5381;
  for (let i = 0; i < input.length; i++) h = ((h << 5) + h + input.charCodeAt(i)) | 0;
  return "djb2:" + (h >>> 0).toString(16);
}

function mergeWithSeed(parsed: Partial<CmsState>): CmsState {
  const parsedSettings: Partial<Settings> = parsed.settings ?? {};
  const outdated = (parsed.version ?? 1) < seedState.version;
  const replaceLegacyBrand = (value: string) =>
    value.replace(/khronos/gi, (match) =>
      match === match.toUpperCase() ? "KRONOS" : match[0] === match[0].toUpperCase() ? "Kronos" : "kronos",
    );
  const projects = outdated ? seedState.projects : parsed.projects ?? seedState.projects;
  return {
    ...seedState,
    ...parsed,
    version: seedState.version,
    projects: projects.map((project) => ({
      ...project,
      name: replaceLegacyBrand(project.name),
      description: replaceLegacyBrand(project.description),
      longDescription: project.longDescription ? replaceLegacyBrand(project.longDescription) : project.longDescription,
      link: project.link ? replaceLegacyBrand(project.link) : project.link,
      client: project.client ? replaceLegacyBrand(project.client) : project.client,
    })),
    categories: outdated ? seedState.categories : parsed.categories ?? seedState.categories,
    services: (parsed.services ?? seedState.services).map((service) => ({
      ...service,
      title: replaceLegacyBrand(service.title),
      description: replaceLegacyBrand(service.description),
    })),
    posts:
      parsed.posts?.map((post) => {
        const migrated =
          post.author === "Equipe Cronos"
            ? {
                ...post,
                author: "Equipe Kronos",
                content: post.content.replace(/Cronos/g, "Kronos"),
              }
            : post;
        return {
          ...migrated,
          title: replaceLegacyBrand(migrated.title),
          excerpt: replaceLegacyBrand(migrated.excerpt),
          content: replaceLegacyBrand(migrated.content),
          author: replaceLegacyBrand(migrated.author),
        };
      }) ?? seedState.posts,
    settings: {
      ...seedState.settings,
      ...parsedSettings,
      companyName:
        parsedSettings.companyName === "Cronos Tecnologia e Sistemas" ||
        parsedSettings.companyName === "Khronos Tecnologia e Sistemas"
          ? seedState.settings.companyName
          : replaceLegacyBrand(parsedSettings.companyName ?? seedState.settings.companyName),
      shortName:
        parsedSettings.shortName === "Cronos" || parsedSettings.shortName === "Khronos"
          ? seedState.settings.shortName
          : replaceLegacyBrand(parsedSettings.shortName ?? seedState.settings.shortName),
      tagline: replaceLegacyBrand(parsedSettings.tagline ?? seedState.settings.tagline),
      description: replaceLegacyBrand(parsedSettings.description ?? seedState.settings.description),
      email:
        parsedSettings.email === "contato@kronostecnologiaesistemas.com.br"
          ? seedState.settings.email
          : parsedSettings.email ?? seedState.settings.email,
      whatsappMessage: replaceLegacyBrand(parsedSettings.whatsappMessage ?? seedState.settings.whatsappMessage),
      siteUrl: replaceLegacyBrand(parsedSettings.siteUrl ?? seedState.settings.siteUrl),
      formProvider: "hostinger",
      social: {
        ...seedState.settings.social,
        ...(parsedSettings.social ?? {}),
        instagram:
          parsedSettings.social?.instagram === "https://instagram.com/cronostecnologia"
            ? seedState.settings.social.instagram
            : parsedSettings.social?.instagram ?? seedState.settings.social.instagram,
      },
      stats: outdated ? seedState.settings.stats : parsedSettings.stats ?? seedState.settings.stats,
      ...(outdated
        ? {
            email: seedState.settings.email,
            phone: seedState.settings.phone,
            whatsapp: seedState.settings.whatsapp,
          }
        : {}),
    },
  };
}

function loadState(): CmsState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return mergeWithSeed(JSON.parse(raw));
  } catch (e) {
    console.warn("Não foi possível carregar os dados locais.", e);
  }
  return seedState;
}

interface CmsContextValue {
  state: CmsState;
  storageWarning: string | null;
  addProject: (p: Omit<Project, "id" | "createdAt">) => Project;
  updateProject: (id: string, patch: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  addCategory: (label: string) => void;
  deleteCategory: (id: string) => void;
  addService: (s: Omit<Service, "id">) => void;
  updateService: (id: string, patch: Partial<Service>) => void;
  deleteService: (id: string) => void;
  moveService: (id: string, dir: -1 | 1) => void;
  addPost: (p: Omit<Post, "id">) => void;
  updatePost: (id: string, patch: Partial<Post>) => void;
  deletePost: (id: string) => void;
  addMessage: (m: Omit<ContactMessage, "id" | "date" | "read">) => ContactMessage;
  updateMessage: (id: string, patch: Partial<ContactMessage>) => void;
  deleteMessage: (id: string) => void;
  updateSettings: (patch: Partial<Settings>) => void;
  exportJson: () => string;
  importJson: (json: string) => boolean;
  resetAll: () => void;
  isAuthed: boolean;
  login: (password: string) => Promise<boolean>;
  logout: () => void;
  changePassword: (current: string, next: string) => Promise<boolean>;
}

const CmsContext = createContext<CmsContextValue | null>(null);

export function CmsProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CmsState>(loadState);
  const [storageWarning, setStorageWarning] = useState<string | null>(null);
  const [isAuthed, setAuthed] = useState<boolean>(
    () => sessionStorage.getItem(SESSION_KEY) === "1",
  );

  // Persistência local
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      setStorageWarning(null);
    } catch {
      setStorageWarning(
        "O armazenamento local está cheio. Prefira imagens por URL ou remova conteúdos antigos.",
      );
    }
  }, [state]);

  // Sincroniza alterações feitas em outra aba (ex.: painel admin aberto em paralelo)
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          setState(mergeWithSeed(JSON.parse(e.newValue)));
        } catch {
          /* ignora */
        }
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  /* ---------- Projetos ---------- */
  const addProject = useCallback((p: Omit<Project, "id" | "createdAt">) => {
    const project: Project = { ...p, id: uid(), createdAt: new Date().toISOString() };
    setState((s) => ({ ...s, projects: [project, ...s.projects] }));
    return project;
  }, []);
  const updateProject = useCallback((id: string, patch: Partial<Project>) => {
    setState((s) => ({
      ...s,
      projects: s.projects.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    }));
  }, []);
  const deleteProject = useCallback((id: string) => {
    setState((s) => ({ ...s, projects: s.projects.filter((p) => p.id !== id) }));
  }, []);

  /* ---------- Categorias ---------- */
  const addCategory = useCallback((label: string) => {
    const id = slugify(label);
    if (!id) return;
    setState((s) =>
      s.categories.some((c) => c.id === id)
        ? s
        : { ...s, categories: [...s.categories, { id, label } as Category] },
    );
  }, []);
  const deleteCategory = useCallback((id: string) => {
    setState((s) => ({ ...s, categories: s.categories.filter((c) => c.id !== id) }));
  }, []);

  /* ---------- Serviços ---------- */
  const addService = useCallback((sv: Omit<Service, "id">) => {
    setState((s) => ({ ...s, services: [...s.services, { ...sv, id: uid() }] }));
  }, []);
  const updateService = useCallback((id: string, patch: Partial<Service>) => {
    setState((s) => ({
      ...s,
      services: s.services.map((x) => (x.id === id ? { ...x, ...patch } : x)),
    }));
  }, []);
  const deleteService = useCallback((id: string) => {
    setState((s) => ({ ...s, services: s.services.filter((x) => x.id !== id) }));
  }, []);
  const moveService = useCallback((id: string, dir: -1 | 1) => {
    setState((s) => {
      const idx = s.services.findIndex((x) => x.id === id);
      const to = idx + dir;
      if (idx < 0 || to < 0 || to >= s.services.length) return s;
      const arr = [...s.services];
      [arr[idx], arr[to]] = [arr[to], arr[idx]];
      return { ...s, services: arr };
    });
  }, []);

  /* ---------- Blog ---------- */
  const addPost = useCallback((p: Omit<Post, "id">) => {
    setState((s) => ({ ...s, posts: [{ ...p, id: uid() }, ...s.posts] }));
  }, []);
  const updatePost = useCallback((id: string, patch: Partial<Post>) => {
    setState((s) => ({
      ...s,
      posts: s.posts.map((x) => (x.id === id ? { ...x, ...patch } : x)),
    }));
  }, []);
  const deletePost = useCallback((id: string) => {
    setState((s) => ({ ...s, posts: s.posts.filter((x) => x.id !== id) }));
  }, []);

  /* ---------- Mensagens ---------- */
  const addMessage = useCallback((m: Omit<ContactMessage, "id" | "date" | "read">) => {
    const msg: ContactMessage = { ...m, id: uid(), date: new Date().toISOString(), read: false };
    setState((s) => ({ ...s, messages: [msg, ...s.messages] }));
    return msg;
  }, []);
  const updateMessage = useCallback((id: string, patch: Partial<ContactMessage>) => {
    setState((s) => ({
      ...s,
      messages: s.messages.map((x) => (x.id === id ? { ...x, ...patch } : x)),
    }));
  }, []);
  const deleteMessage = useCallback((id: string) => {
    setState((s) => ({ ...s, messages: s.messages.filter((x) => x.id !== id) }));
  }, []);

  /* ---------- Configurações ---------- */
  const updateSettings = useCallback((patch: Partial<Settings>) => {
    setState((s) => ({ ...s, settings: { ...s.settings, ...patch } }));
  }, []);

  /* ---------- Backup ---------- */
  const exportJson = useCallback(() => JSON.stringify(state, null, 2), [state]);
  const importJson = useCallback((json: string) => {
    try {
      const parsed = JSON.parse(json);
      if (!parsed || typeof parsed !== "object" || !Array.isArray(parsed.projects)) return false;
      setState(mergeWithSeed(parsed));
      return true;
    } catch {
      return false;
    }
  }, []);
  const resetAll = useCallback(() => setState(seedState), []);

  /* ---------- Autenticação ---------- */
  const login = useCallback(
    async (password: string) => {
      const stored = state.settings.adminPasswordHash;
      const ok = stored ? (await hashPassword(password)) === stored : password === DEFAULT_ADMIN_PASSWORD;
      if (ok) {
        sessionStorage.setItem(SESSION_KEY, "1");
        setAuthed(true);
      }
      return ok;
    },
    [state.settings.adminPasswordHash],
  );
  const logout = useCallback(() => {
    sessionStorage.removeItem(SESSION_KEY);
    setAuthed(false);
  }, []);
  const changePassword = useCallback(
    async (current: string, next: string) => {
      const stored = state.settings.adminPasswordHash;
      const ok = stored ? (await hashPassword(current)) === stored : current === DEFAULT_ADMIN_PASSWORD;
      if (!ok || next.length < 6) return false;
      const hash = await hashPassword(next);
      setState((s) => ({ ...s, settings: { ...s.settings, adminPasswordHash: hash } }));
      return true;
    },
    [state.settings.adminPasswordHash],
  );

  const value = useMemo<CmsContextValue>(
    () => ({
      state,
      storageWarning,
      addProject,
      updateProject,
      deleteProject,
      addCategory,
      deleteCategory,
      addService,
      updateService,
      deleteService,
      moveService,
      addPost,
      updatePost,
      deletePost,
      addMessage,
      updateMessage,
      deleteMessage,
      updateSettings,
      exportJson,
      importJson,
      resetAll,
      isAuthed,
      login,
      logout,
      changePassword,
    }),
    [
      state,
      storageWarning,
      addProject,
      updateProject,
      deleteProject,
      addCategory,
      deleteCategory,
      addService,
      updateService,
      deleteService,
      moveService,
      addPost,
      updatePost,
      deletePost,
      addMessage,
      updateMessage,
      deleteMessage,
      updateSettings,
      exportJson,
      importJson,
      resetAll,
      isAuthed,
      login,
      logout,
      changePassword,
    ],
  );

  return <CmsContext.Provider value={value}>{children}</CmsContext.Provider>;
}

export function useCms() {
  const ctx = useContext(CmsContext);
  if (!ctx) throw new Error("useCms deve ser usado dentro de <CmsProvider>");
  return ctx;
}

export function useSettings() {
  return useCms().state.settings;
}
