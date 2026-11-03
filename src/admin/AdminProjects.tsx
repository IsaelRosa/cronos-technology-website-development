import { useMemo, useState } from "react";
import { ExternalLink, Pencil, Plus, Search, Star, Trash2, Video, X } from "lucide-react";
import type { Project } from "@/types";
import { useCms } from "@/store/cms";
import { resolveImage } from "@/data/seed";
import { getEmbed } from "@/lib/utils";
import { VideoEmbed } from "@/components/portfolio";
import { cn } from "@/utils/cn";
import { AdminButton, AdminCard, AdminHeader, ConfirmDialog, EmptyState, FieldWrap, ImageInput, Input, Modal, Select, Textarea, Toggle, useToast } from "./fields";

type Draft = Omit<Project, "id" | "createdAt" | "technologies"> & { technologies: string };

const emptyDraft = (category: string): Draft => ({
  name: "",
  cover: "",
  description: "",
  longDescription: "",
  category,
  technologies: "",
  videoUrl: "",
  link: "",
  client: "",
  year: String(new Date().getFullYear()),
  featured: false,
});

export default function AdminProjects() {
  const { state, addProject, updateProject, deleteProject, addCategory, deleteCategory } = useCms();
  const { toast, show } = useToast();
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<{ id?: string; draft: Draft } | null>(null);
  const [toDelete, setToDelete] = useState<Project | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [newCat, setNewCat] = useState("");

  const catLabel = (id: string) => state.categories.find((c) => c.id === id)?.label ?? id;

  const list = useMemo(() => {
    const q = query.toLowerCase();
    return state.projects.filter((p) => !q || p.name.toLowerCase().includes(q) || catLabel(p.category).toLowerCase().includes(q));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.projects, query, state.categories]);

  const openNew = () => {
    setErrors({});
    setEditing({ draft: emptyDraft(state.categories[0]?.id ?? "") });
  };
  const openEdit = (p: Project) => {
    setErrors({});
    setEditing({ id: p.id, draft: { ...p, technologies: p.technologies.join(", ") } });
  };
  const setDraft = <K extends keyof Draft>(k: K, v: Draft[K]) => setEditing((e) => (e ? { ...e, draft: { ...e.draft, [k]: v } } : e));

  const save = () => {
    if (!editing) return;
    const d = editing.draft;
    const errs: Record<string, string> = {};
    if (d.name.trim().length < 2) errs.name = "Informe o nome do projeto.";
    if (d.description.trim().length < 10) errs.description = "Descreva a solução (mín. 10 caracteres).";
    if (!d.category) errs.category = "Selecione uma categoria.";
    if (d.videoUrl && !getEmbed(d.videoUrl)) errs.videoUrl = "URL de vídeo não reconhecida.";
    if (d.link && !/^https?:\/\//i.test(d.link)) errs.link = "O link deve começar com http:// ou https://";
    setErrors(errs);
    if (Object.keys(errs).length) return;

    const payload = {
      ...d,
      name: d.name.trim(),
      technologies: d.technologies.split(",").map((t) => t.trim()).filter(Boolean),
    };
    if (editing.id) {
      updateProject(editing.id, payload);
      show("Projeto atualizado com sucesso.");
    } else {
      addProject(payload);
      show("Projeto adicionado ao portfólio.");
    }
    setEditing(null);
  };

  const confirmDelete = () => {
    if (toDelete) {
      deleteProject(toDelete.id);
      show("Projeto excluído.");
      setToDelete(null);
    }
  };

  const handleAddCategory = () => {
    if (newCat.trim().length < 2) return;
    addCategory(newCat.trim());
    setNewCat("");
    show("Categoria adicionada.");
  };

  return (
    <>
      <AdminHeader
        title="Portfólio de projetos"
        description="Adicione, edite ou remova projetos. As alterações aparecem imediatamente no site."
        actions={
          <AdminButton onClick={openNew} icon={<Plus className="size-4" />}>
            Novo projeto
          </AdminButton>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_300px]">
        <div>
          <label className="relative mb-5 block">
            <span className="sr-only">Buscar</span>
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar por nome ou categoria" className="pl-11" />
          </label>

          {list.length === 0 ? (
            <EmptyState text="Nenhum projeto cadastrado." action={<AdminButton onClick={openNew}>Adicionar o primeiro projeto</AdminButton>} />
          ) : (
            <ul className="grid gap-4 md:grid-cols-2">
              {list.map((p) => (
                <li key={p.id} className="flex gap-4 rounded-2xl border border-white/8 bg-night-900/60 p-4">
                  <div className="relative h-24 w-36 shrink-0 overflow-hidden rounded-xl bg-night-800">
                    {resolveImage(p.cover) && <img src={resolveImage(p.cover)} alt="" className="h-full w-full object-cover" />}
                    {p.featured && (
                      <span className="absolute left-1.5 top-1.5 rounded-full bg-gradient-brand p-1 text-white" title="Destaque">
                        <Star className="size-3" />
                      </span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-white">{p.name}</p>
                    <p className="mt-0.5 text-xs text-cyan-300">{catLabel(p.category)}</p>
                    <p className="mt-1 line-clamp-2 text-xs text-slate-400">{p.description}</p>
                    <div className="mt-2 flex items-center gap-1.5">
                      {getEmbed(p.videoUrl) && <Video className="size-3.5 text-slate-500" aria-label="Com vídeo" />}
                      {p.link && <ExternalLink className="size-3.5 text-slate-500" aria-label="Com link externo" />}
                      <span className="ml-auto flex gap-1">
                        <button type="button" onClick={() => openEdit(p)} className="rounded-lg p-1.5 text-slate-400 hover:bg-white/5 hover:text-white" aria-label={`Editar ${p.name}`}>
                          <Pencil className="size-4" />
                        </button>
                        <button type="button" onClick={() => setToDelete(p)} className="rounded-lg p-1.5 text-slate-400 hover:bg-red-500/10 hover:text-red-300" aria-label={`Excluir ${p.name}`}>
                          <Trash2 className="size-4" />
                        </button>
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <AdminCard title="Categorias" description="Usadas nos filtros do portfólio.">
          <ul className="space-y-2">
            {state.categories.map((c) => {
              const count = state.projects.filter((p) => p.category === c.id).length;
              return (
                <li key={c.id} className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.03] px-3 py-2 text-sm">
                  <span className="text-slate-200">
                    {c.label} <span className="text-xs text-slate-500">({count})</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => (count ? show("Remova ou mova os projetos desta categoria antes.", "err") : deleteCategory(c.id))}
                    className={cn("rounded-lg p-1 text-slate-500 hover:text-red-300", count && "opacity-40")}
                    aria-label={`Remover categoria ${c.label}`}
                  >
                    <X className="size-4" />
                  </button>
                </li>
              );
            })}
          </ul>
          <div className="mt-4 flex gap-2">
            <Input value={newCat} onChange={(e) => setNewCat(e.target.value)} placeholder="Nova categoria" onKeyDown={(e) => e.key === "Enter" && handleAddCategory()} />
            <AdminButton variant="outline" onClick={handleAddCategory} aria-label="Adicionar categoria">
              <Plus className="size-4" />
            </AdminButton>
          </div>
        </AdminCard>
      </div>

      {/* Formulário */}
      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title={editing?.id ? "Editar projeto" : "Novo projeto"}
        wide
        footer={
          <>
            <AdminButton variant="ghost" onClick={() => setEditing(null)}>
              Cancelar
            </AdminButton>
            <AdminButton onClick={save}>{editing?.id ? "Salvar alterações" : "Publicar projeto"}</AdminButton>
          </>
        }
      >
        {editing && (
          <div className="grid gap-5 lg:grid-cols-2">
            <FieldWrap label="Nome do projeto" error={errors.name} className="lg:col-span-2">
              <Input value={editing.draft.name} onChange={(e) => setDraft("name", e.target.value)} placeholder="Ex.: Sistema de gestão para clínicas" />
            </FieldWrap>
            <div className="lg:col-span-2">
              <ImageInput label="Imagem de capa / captura de tela" value={editing.draft.cover} onChange={(v) => setDraft("cover", v)} />
            </div>
            <FieldWrap label="Categoria" error={errors.category}>
              <Select value={editing.draft.category} onChange={(e) => setDraft("category", e.target.value)}>
                {state.categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </Select>
            </FieldWrap>
            <FieldWrap label="Tecnologias utilizadas" hint="Separe por vírgula. Ex.: React, Node.js, PostgreSQL">
              <Input value={editing.draft.technologies} onChange={(e) => setDraft("technologies", e.target.value)} placeholder="React, Node.js, PostgreSQL" />
            </FieldWrap>
            <FieldWrap label="Descrição resumida" error={errors.description} className="lg:col-span-2" hint="Aparece no card do portfólio.">
              <Textarea rows={3} value={editing.draft.description} onChange={(e) => setDraft("description", e.target.value)} />
            </FieldWrap>
            <FieldWrap label="Descrição completa" className="lg:col-span-2" hint="Detalhes exibidos ao abrir o projeto (desafio, solução, resultados).">
              <Textarea rows={5} value={editing.draft.longDescription ?? ""} onChange={(e) => setDraft("longDescription", e.target.value)} />
            </FieldWrap>
            <FieldWrap label="Vídeo demonstrativo" error={errors.videoUrl} hint="YouTube, Vimeo, Loom, Google Drive ou arquivo .mp4">
              <Input value={editing.draft.videoUrl ?? ""} onChange={(e) => setDraft("videoUrl", e.target.value)} placeholder="https://www.youtube.com/watch?v=..." />
            </FieldWrap>
            <FieldWrap label="Link externo do sistema/site" error={errors.link} hint="Exibido no botão 'Acessar projeto'.">
              <Input value={editing.draft.link ?? ""} onChange={(e) => setDraft("link", e.target.value)} placeholder="https://" />
            </FieldWrap>
            {getEmbed(editing.draft.videoUrl) && (
              <div className="aspect-video overflow-hidden rounded-xl border border-white/10 bg-black lg:col-span-2">
                <VideoEmbed url={editing.draft.videoUrl} title={editing.draft.name || "Pré-visualização"} />
              </div>
            )}
            <FieldWrap label="Cliente / segmento">
              <Input value={editing.draft.client ?? ""} onChange={(e) => setDraft("client", e.target.value)} placeholder="Ex.: Rede de clínicas" />
            </FieldWrap>
            <FieldWrap label="Ano">
              <Input value={editing.draft.year ?? ""} onChange={(e) => setDraft("year", e.target.value)} placeholder="2025" />
            </FieldWrap>
            <div className="lg:col-span-2">
              <Toggle checked={editing.draft.featured} onChange={(v) => setDraft("featured", v)} label="Projeto em destaque" description="Destaques aparecem primeiro e na página inicial." />
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={!!toDelete}
        title="Excluir projeto"
        text={`Tem certeza que deseja excluir "${toDelete?.name}"? Esta ação não pode ser desfeita.`}
        onCancel={() => setToDelete(null)}
        onConfirm={confirmDelete}
      />
      {toast}
    </>
  );
}
