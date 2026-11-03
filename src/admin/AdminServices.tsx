import { useState } from "react";
import { ArrowDown, ArrowUp, Pencil, Plus, Trash2 } from "lucide-react";
import type { Service } from "@/types";
import { useCms } from "@/store/cms";
import { ICON_NAMES, getIcon } from "@/lib/icons";
import { cn } from "@/utils/cn";
import { AdminButton, AdminHeader, ConfirmDialog, EmptyState, FieldWrap, Input, Modal, Textarea, useToast } from "./fields";

type Draft = Omit<Service, "id">;
const empty: Draft = { icon: "Sparkles", title: "", description: "" };

export default function AdminServices() {
  const { state, addService, updateService, deleteService, moveService } = useCms();
  const { toast, show } = useToast();
  const [editing, setEditing] = useState<{ id?: string; draft: Draft } | null>(null);
  const [toDelete, setToDelete] = useState<Service | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const setDraft = <K extends keyof Draft>(k: K, v: Draft[K]) => setEditing((e) => (e ? { ...e, draft: { ...e.draft, [k]: v } } : e));

  const save = () => {
    if (!editing) return;
    const d = editing.draft;
    const errs: Record<string, string> = {};
    if (d.title.trim().length < 3) errs.title = "Informe o título do serviço.";
    if (d.description.trim().length < 10) errs.description = "Informe uma breve descrição.";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    if (editing.id) {
      updateService(editing.id, d);
      show("Serviço atualizado.");
    } else {
      addService(d);
      show("Serviço adicionado.");
    }
    setEditing(null);
  };

  return (
    <>
      <AdminHeader
        title="Serviços oferecidos"
        description="Cards exibidos na página inicial e na página de soluções. Use as setas para ordenar."
        actions={
          <AdminButton onClick={() => { setErrors({}); setEditing({ draft: empty }); }} icon={<Plus className="size-4" />}>
            Novo serviço
          </AdminButton>
        }
      />

      {state.services.length === 0 ? (
        <EmptyState text="Nenhum serviço cadastrado." />
      ) : (
        <ul className="space-y-3">
          {state.services.map((s, i) => {
            const Icon = getIcon(s.icon);
            return (
              <li key={s.id} className="flex items-center gap-4 rounded-2xl border border-white/8 bg-night-900/60 p-4">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-electric-500/15 text-cyan-300">
                  <Icon className="size-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-white">{s.title}</p>
                  <p className="line-clamp-2 text-xs text-slate-400">{s.description}</p>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <button type="button" disabled={i === 0} onClick={() => moveService(s.id, -1)} className="rounded-lg p-1.5 text-slate-400 hover:bg-white/5 hover:text-white disabled:opacity-30" aria-label="Mover para cima">
                    <ArrowUp className="size-4" />
                  </button>
                  <button type="button" disabled={i === state.services.length - 1} onClick={() => moveService(s.id, 1)} className="rounded-lg p-1.5 text-slate-400 hover:bg-white/5 hover:text-white disabled:opacity-30" aria-label="Mover para baixo">
                    <ArrowDown className="size-4" />
                  </button>
                  <button type="button" onClick={() => { setErrors({}); setEditing({ id: s.id, draft: { icon: s.icon, title: s.title, description: s.description } }); }} className="rounded-lg p-1.5 text-slate-400 hover:bg-white/5 hover:text-white" aria-label={`Editar ${s.title}`}>
                    <Pencil className="size-4" />
                  </button>
                  <button type="button" onClick={() => setToDelete(s)} className="rounded-lg p-1.5 text-slate-400 hover:bg-red-500/10 hover:text-red-300" aria-label={`Excluir ${s.title}`}>
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title={editing?.id ? "Editar serviço" : "Novo serviço"}
        footer={
          <>
            <AdminButton variant="ghost" onClick={() => setEditing(null)}>Cancelar</AdminButton>
            <AdminButton onClick={save}>Salvar</AdminButton>
          </>
        }
      >
        {editing && (
          <div className="space-y-5">
            <FieldWrap label="Título" error={errors.title}>
              <Input value={editing.draft.title} onChange={(e) => setDraft("title", e.target.value)} />
            </FieldWrap>
            <FieldWrap label="Descrição breve" error={errors.description}>
              <Textarea rows={3} value={editing.draft.description} onChange={(e) => setDraft("description", e.target.value)} />
            </FieldWrap>
            <div>
              <span className="mb-1.5 block text-sm font-medium text-slate-200">Ícone</span>
              <div className="grid grid-cols-6 gap-2 sm:grid-cols-9">
                {ICON_NAMES.map((name) => {
                  const I = getIcon(name);
                  const active = editing.draft.icon === name;
                  return (
                    <button
                      key={name}
                      type="button"
                      title={name}
                      aria-label={name}
                      aria-pressed={active}
                      onClick={() => setDraft("icon", name)}
                      className={cn(
                        "flex aspect-square items-center justify-center rounded-xl border transition",
                        active ? "border-cyan-400 bg-cyan-400/15 text-cyan-300" : "border-white/10 text-slate-400 hover:border-electric-400/50 hover:text-white",
                      )}
                    >
                      <I className="size-5" />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={!!toDelete}
        title="Excluir serviço"
        text={`Excluir "${toDelete?.title}" da lista de serviços?`}
        onCancel={() => setToDelete(null)}
        onConfirm={() => { if (toDelete) { deleteService(toDelete.id); show("Serviço excluído."); setToDelete(null); } }}
      />
      {toast}
    </>
  );
}
