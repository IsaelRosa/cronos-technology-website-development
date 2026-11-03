import { useState } from "react";
import { Eye, EyeOff, Pencil, Plus, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import type { Post } from "@/types";
import { slugify, useCms } from "@/store/cms";
import { formatDate } from "@/lib/utils";
import { cn } from "@/utils/cn";
import { AdminButton, AdminHeader, ConfirmDialog, EmptyState, FieldWrap, ImageInput, Input, Modal, Textarea, Toggle, useToast } from "./fields";

type Draft = Omit<Post, "id">;
const CATEGORIES = ["Tecnologia da Informação", "Inteligência Artificial", "Transformação Digital", "Desenvolvimento de Sistemas", "Inovação e Tendências"];

const empty = (): Draft => ({
  slug: "",
  title: "",
  excerpt: "",
  content: "",
  cover: "",
  category: CATEGORIES[0],
  date: new Date().toISOString().slice(0, 10),
  author: "Equipe Cronos",
  published: true,
});

export default function AdminBlog() {
  const { state, addPost, updatePost, deletePost } = useCms();
  const { toast, show } = useToast();
  const [editing, setEditing] = useState<{ id?: string; draft: Draft; slugTouched: boolean } | null>(null);
  const [toDelete, setToDelete] = useState<Post | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const setDraft = <K extends keyof Draft>(k: K, v: Draft[K]) =>
    setEditing((e) => {
      if (!e) return e;
      const draft = { ...e.draft, [k]: v };
      if (k === "title" && !e.slugTouched) draft.slug = slugify(String(v));
      return { ...e, draft, slugTouched: k === "slug" ? true : e.slugTouched };
    });

  const save = () => {
    if (!editing) return;
    const d = { ...editing.draft, slug: slugify(editing.draft.slug || editing.draft.title) };
    const errs: Record<string, string> = {};
    if (d.title.trim().length < 5) errs.title = "Informe um título.";
    if (!d.slug) errs.slug = "Informe um endereço (slug).";
    if (state.posts.some((p) => p.slug === d.slug && p.id !== editing.id)) errs.slug = "Já existe um artigo com este endereço.";
    if (d.excerpt.trim().length < 10) errs.excerpt = "Informe um resumo.";
    if (d.content.trim().length < 50) errs.content = "O conteúdo deve ter pelo menos 50 caracteres.";
    if (!d.date) errs.date = "Informe a data.";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    if (editing.id) {
      updatePost(editing.id, d);
      show("Artigo atualizado.");
    } else {
      addPost(d);
      show("Artigo publicado.");
    }
    setEditing(null);
  };

  const posts = [...state.posts].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <>
      <AdminHeader
        title="Blog e conteúdos"
        description="Publique artigos sobre tecnologia, IA, transformação digital e inovação."
        actions={
          <AdminButton onClick={() => { setErrors({}); setEditing({ draft: empty(), slugTouched: false }); }} icon={<Plus className="size-4" />}>
            Novo artigo
          </AdminButton>
        }
      />

      {posts.length === 0 ? (
        <EmptyState text="Nenhum artigo cadastrado." />
      ) : (
        <ul className="space-y-3">
          {posts.map((p) => (
            <li key={p.id} className="flex items-center gap-4 rounded-2xl border border-white/8 bg-night-900/60 p-4">
              <div className="h-16 w-24 shrink-0 overflow-hidden rounded-xl bg-night-800">
                {p.cover && <img src={p.cover} alt="" className="h-full w-full object-cover" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-white">{p.title}</p>
                <p className="mt-0.5 text-xs text-slate-400">
                  <span className="text-cyan-300">{p.category}</span> · {formatDate(p.date)} · {p.author}
                </p>
                <span className={cn("mt-1.5 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[0.65rem] font-semibold", p.published ? "bg-emerald-400/15 text-emerald-300" : "bg-white/10 text-slate-400")}>
                  {p.published ? <Eye className="size-3" /> : <EyeOff className="size-3" />} {p.published ? "Publicado" : "Rascunho"}
                </span>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                {p.published && (
                  <Link to={`/blog/${p.slug}`} target="_blank" className="rounded-lg p-1.5 text-slate-400 hover:bg-white/5 hover:text-white" aria-label="Ver no site">
                    <Eye className="size-4" />
                  </Link>
                )}
                <button type="button" onClick={() => { setErrors({}); setEditing({ id: p.id, draft: { ...p }, slugTouched: true }); }} className="rounded-lg p-1.5 text-slate-400 hover:bg-white/5 hover:text-white" aria-label={`Editar ${p.title}`}>
                  <Pencil className="size-4" />
                </button>
                <button type="button" onClick={() => setToDelete(p)} className="rounded-lg p-1.5 text-slate-400 hover:bg-red-500/10 hover:text-red-300" aria-label={`Excluir ${p.title}`}>
                  <Trash2 className="size-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title={editing?.id ? "Editar artigo" : "Novo artigo"}
        wide
        footer={
          <>
            <AdminButton variant="ghost" onClick={() => setEditing(null)}>Cancelar</AdminButton>
            <AdminButton onClick={save}>Salvar artigo</AdminButton>
          </>
        }
      >
        {editing && (
          <div className="grid gap-5 lg:grid-cols-2">
            <FieldWrap label="Título" error={errors.title} className="lg:col-span-2">
              <Input value={editing.draft.title} onChange={(e) => setDraft("title", e.target.value)} />
            </FieldWrap>
            <FieldWrap label="Endereço (slug)" error={errors.slug} hint={`/blog/${editing.draft.slug || "..."}`}>
              <Input value={editing.draft.slug} onChange={(e) => setDraft("slug", e.target.value)} />
            </FieldWrap>
            <FieldWrap label="Categoria">
              <Input list="blog-categorias" value={editing.draft.category} onChange={(e) => setDraft("category", e.target.value)} />
              <datalist id="blog-categorias">
                {CATEGORIES.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </FieldWrap>
            <FieldWrap label="Data de publicação" error={errors.date}>
              <Input type="date" value={editing.draft.date} onChange={(e) => setDraft("date", e.target.value)} className="[color-scheme:dark]" />
            </FieldWrap>
            <FieldWrap label="Autor">
              <Input value={editing.draft.author} onChange={(e) => setDraft("author", e.target.value)} />
            </FieldWrap>
            <div className="lg:col-span-2">
              <ImageInput label="Imagem de capa" value={editing.draft.cover} onChange={(v) => setDraft("cover", v)} />
            </div>
            <FieldWrap label="Resumo" error={errors.excerpt} className="lg:col-span-2">
              <Textarea rows={2} value={editing.draft.excerpt} onChange={(e) => setDraft("excerpt", e.target.value)} />
            </FieldWrap>
            <FieldWrap
              label="Conteúdo"
              error={errors.content}
              className="lg:col-span-2"
              hint="Formatação: '## Título', '- item de lista', '1. item numerado', '> citação', **negrito**, [link](https://...). Separe parágrafos com uma linha em branco."
            >
              <Textarea rows={14} value={editing.draft.content} onChange={(e) => setDraft("content", e.target.value)} className="font-mono text-sm" />
            </FieldWrap>
            <div className="lg:col-span-2">
              <Toggle checked={editing.draft.published} onChange={(v) => setDraft("published", v)} label="Publicado" description="Rascunhos não aparecem no site." />
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={!!toDelete}
        title="Excluir artigo"
        text={`Excluir "${toDelete?.title}"? Esta ação não pode ser desfeita.`}
        onCancel={() => setToDelete(null)}
        onConfirm={() => { if (toDelete) { deletePost(toDelete.id); show("Artigo excluído."); setToDelete(null); } }}
      />
      {toast}
    </>
  );
}
