import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, Calendar, ExternalLink, Play, Search, Tag as TagIcon, User, X } from "lucide-react";
import type { Project } from "@/types";
import { useCms } from "@/store/cms";
import { resolveImage } from "@/data/seed";
import { getEmbed } from "@/lib/utils";
import { useBodyLock } from "@/hooks";
import { cn } from "@/utils/cn";
import { Button, Reveal, Tag } from "./ui";

/* ------------------------------- Video embed ------------------------------- */
export function VideoEmbed({ url, title, className }: { url?: string; title: string; className?: string }) {
  const embed = getEmbed(url);
  if (!embed) return null;
  if (embed.type === "video") {
    return (
      <video controls preload="metadata" className={cn("h-full w-full bg-black", className)} title={title}>
        <source src={embed.src} />
        Seu navegador não suporta vídeo HTML5.
      </video>
    );
  }
  return (
    <iframe
      src={embed.src}
      title={`Vídeo demonstrativo: ${title}`}
      className={cn("h-full w-full", className)}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowFullScreen
      loading="lazy"
      referrerPolicy="strict-origin-when-cross-origin"
    />
  );
}

/* ------------------------------- Project card ------------------------------ */
interface CardProps {
  project: Project;
  categoryLabel: string;
  onOpen: (p: Project) => void;
  large?: boolean;
}
export function ProjectCard({ project, categoryLabel, onOpen, large }: CardProps) {
  const cover = resolveImage(project.cover);
  const hasVideo = !!getEmbed(project.videoUrl);
  return (
    <article
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/8 bg-night-900/60 card-glow card-glow-hover",
      )}
    >
      <button
        type="button"
        onClick={() => onOpen(project)}
        className={cn("relative block w-full overflow-hidden text-left", large ? "aspect-[16/10]" : "aspect-[16/10]")}
        aria-label={`Ver detalhes do projeto ${project.name}`}
      >
        {cover ? (
          <img
            src={cover}
            alt={`Capa do projeto ${project.name}`}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-night-800 to-night-950 text-slate-500">
            <TagIcon className="size-10" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-night-950 via-night-950/20 to-transparent opacity-80" aria-hidden />
        <div className="absolute left-4 top-4 flex items-center gap-2">
          <span className="rounded-full border border-white/15 bg-night-950/70 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-wider text-cyan-300 backdrop-blur">
            {categoryLabel}
          </span>
          {project.featured && (
            <span className="rounded-full bg-gradient-brand px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-wider text-white">
              Destaque
            </span>
          )}
        </div>
        {hasVideo && (
          <span className="absolute right-4 top-4 flex size-9 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur" aria-hidden>
            <Play className="ml-0.5 size-4" />
          </span>
        )}
        <span className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-500 group-hover:opacity-100" aria-hidden>
          <span className="rounded-full bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-md ring-1 ring-white/30">
            Ver detalhes
          </span>
        </span>
      </button>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-xl font-semibold text-white transition-colors group-hover:text-cyan-200">{project.name}</h3>
        <p className="mt-2.5 line-clamp-3 text-sm leading-relaxed text-slate-400">{project.description}</p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {project.technologies.slice(0, 4).map((t) => (
            <Tag key={t}>{t}</Tag>
          ))}
          {project.technologies.length > 4 && <Tag>+{project.technologies.length - 4}</Tag>}
        </div>
        <div className="mt-6 flex items-center justify-between gap-3 border-t border-white/5 pt-5">
          <button
            type="button"
            onClick={() => onOpen(project)}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-electric-300 transition hover:text-cyan-300"
          >
            Conhecer projeto <ArrowUpRight className="size-4" />
          </button>
          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex size-9 items-center justify-center rounded-full border border-white/10 text-slate-400 transition hover:border-cyan-400/50 hover:text-cyan-300"
              aria-label={`Acessar ${project.name} em nova aba`}
              title="Acessar sistema"
            >
              <ExternalLink className="size-4" />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

/* ------------------------------ Project modal ------------------------------ */
export function ProjectModal({
  project,
  categoryLabel,
  onClose,
}: {
  project: Project | null;
  categoryLabel: string;
  onClose: () => void;
}) {
  useBodyLock(!!project);
  useEffect(() => {
    if (!project) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [project, onClose]);

  if (!project) return null;
  const cover = resolveImage(project.cover);
  const hasVideo = !!getEmbed(project.videoUrl);

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end justify-center bg-night-950/80 p-0 backdrop-blur-sm animate-fade-in sm:items-center sm:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-modal-title"
    >
      <div
        className="relative max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-t-3xl border border-white/10 bg-night-900 shadow-2xl animate-fade-up sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar"
          className="absolute right-4 top-4 z-10 flex size-10 items-center justify-center rounded-full bg-night-950/70 text-white backdrop-blur transition hover:bg-white/15"
        >
          <X className="size-5" />
        </button>

        <div className="aspect-video w-full overflow-hidden bg-black sm:rounded-t-3xl">
          {hasVideo ? (
            <VideoEmbed url={project.videoUrl} title={project.name} />
          ) : cover ? (
            <img src={cover} alt={`Capa do projeto ${project.name}`} className="h-full w-full object-cover" />
          ) : null}
        </div>

        <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_280px]">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Tag active>{categoryLabel}</Tag>
              {project.featured && <Tag>Destaque</Tag>}
            </div>
            <h2 id="project-modal-title" className="mt-4 text-2xl font-bold text-white sm:text-3xl">
              {project.name}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-300">{project.description}</p>
            {project.longDescription && (
              <p className="mt-4 text-base leading-relaxed text-slate-400">{project.longDescription}</p>
            )}
            {hasVideo && cover && (
              <div className="mt-6 overflow-hidden rounded-2xl border border-white/10">
                <img src={cover} alt={`Captura de tela de ${project.name}`} className="w-full object-cover" loading="lazy" />
              </div>
            )}
          </div>

          <aside className="space-y-6 lg:border-l lg:border-white/5 lg:pl-8">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Tecnologias</h3>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {project.technologies.map((t) => (
                  <Tag key={t}>{t}</Tag>
                ))}
              </div>
            </div>
            {(project.client || project.year) && (
              <dl className="space-y-3 text-sm">
                {project.client && (
                  <div className="flex items-center gap-2.5 text-slate-300">
                    <User className="size-4 text-cyan-400" />
                    <dt className="sr-only">Cliente</dt>
                    <dd>{project.client}</dd>
                  </div>
                )}
                {project.year && (
                  <div className="flex items-center gap-2.5 text-slate-300">
                    <Calendar className="size-4 text-cyan-400" />
                    <dt className="sr-only">Ano</dt>
                    <dd>{project.year}</dd>
                  </div>
                )}
              </dl>
            )}
            <div className="flex flex-col gap-3">
              {project.link && (
                <Button href={project.link} external className="w-full" icon={<ExternalLink className="size-4" />}>
                  Acessar projeto
                </Button>
              )}
              <Button to="/contato" variant="secondary" className="w-full">
                Quero um projeto assim
              </Button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------- Gallery with filters ---------------------------- */
interface GalleryProps {
  limit?: number;
  featuredOnly?: boolean;
  showFilters?: boolean;
  showSearch?: boolean;
}
export function PortfolioGallery({ limit, featuredOnly, showFilters = true, showSearch = false }: GalleryProps) {
  const { state } = useCms();
  const [active, setActive] = useState("all");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Project | null>(null);

  const catLabel = (id: string) => state.categories.find((c) => c.id === id)?.label ?? "Projeto";

  const base = useMemo(() => {
    let list = [...state.projects].sort((a, b) => Number(b.featured) - Number(a.featured) || b.createdAt.localeCompare(a.createdAt));
    if (featuredOnly) {
      const f = list.filter((p) => p.featured);
      list = f.length ? f : list;
    }
    return list;
  }, [state.projects, featuredOnly]);

  const counts = useMemo(() => {
    const map: Record<string, number> = { all: base.length };
    base.forEach((p) => (map[p.category] = (map[p.category] ?? 0) + 1));
    return map;
  }, [base]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = active === "all" ? base : base.filter((p) => p.category === active);
    if (q)
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.technologies.some((t) => t.toLowerCase().includes(q)),
      );
    return limit ? list.slice(0, limit) : list;
  }, [base, active, query, limit]);

  const categoriesWithItems = state.categories.filter((c) => counts[c.id]);

  return (
    <div>
      {(showFilters || showSearch) && (
        <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          {showFilters && (
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar lg:flex-wrap lg:overflow-visible" role="tablist" aria-label="Filtrar por categoria">
              {[{ id: "all", label: "Todos" }, ...categoriesWithItems].map((c) => (
                <button
                  key={c.id}
                  role="tab"
                  aria-selected={active === c.id}
                  onClick={() => setActive(c.id)}
                  className={cn(
                    "shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-300",
                    active === c.id
                      ? "border-transparent bg-gradient-brand text-white shadow-glow"
                      : "border-white/10 bg-white/[0.03] text-slate-300 hover:border-electric-400/40 hover:text-white",
                  )}
                >
                  {c.label}
                  <span className={cn("ml-2 text-xs", active === c.id ? "text-white/80" : "text-slate-500")}>
                    {counts[c.id] ?? 0}
                  </span>
                </button>
              ))}
            </div>
          )}
          {showSearch && (
            <label className="relative block lg:w-72">
              <span className="sr-only">Buscar projetos</span>
              <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar por nome ou tecnologia"
                className="input-dark pl-11"
              />
            </label>
          )}
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-white/10 p-14 text-center text-slate-400">
          Nenhum projeto encontrado para esse filtro.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((p, i) => (
            <Reveal key={p.id} delay={(i % 3) * 90} className="h-full">
              <ProjectCard project={p} categoryLabel={catLabel(p.category)} onOpen={setSelected} />
            </Reveal>
          ))}
        </div>
      )}

      <ProjectModal
        project={selected}
        categoryLabel={selected ? catLabel(selected.category) : ""}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}
