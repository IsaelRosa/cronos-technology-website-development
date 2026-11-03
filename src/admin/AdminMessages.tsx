import { useState } from "react";
import { Building2, Mail, MailCheck, MailOpen, Phone, Trash2 } from "lucide-react";
import { WhatsappIcon } from "@/components/BrandIcons";
import { useCms } from "@/store/cms";
import { formatDateTime } from "@/lib/utils";
import { cn } from "@/utils/cn";
import { AdminButton, AdminHeader, ConfirmDialog, EmptyState, useToast } from "./fields";

export default function AdminMessages() {
  const { state, updateMessage, deleteMessage } = useCms();
  const { toast, show } = useToast();
  const [selectedId, setSelectedId] = useState<string | null>(state.messages[0]?.id ?? null);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [toDelete, setToDelete] = useState<string | null>(null);

  const list = state.messages.filter((m) => filter === "all" || !m.read);
  const selected = state.messages.find((m) => m.id === selectedId) ?? null;

  const open = (id: string) => {
    setSelectedId(id);
    const m = state.messages.find((x) => x.id === id);
    if (m && !m.read) updateMessage(id, { read: true });
  };

  const waDigits = (phone: string) => {
    const d = phone.replace(/\D/g, "");
    return d.length <= 11 ? `55${d}` : d;
  };

  return (
    <>
      <AdminHeader
        title="Mensagens recebidas"
        description="Solicitações enviadas pelo formulário de contato do site."
        actions={
          <div className="flex rounded-xl border border-white/10 p-1">
            {(["all", "unread"] as const).map((f) => (
              <button key={f} type="button" onClick={() => setFilter(f)} className={cn("rounded-lg px-3 py-1.5 text-sm font-medium transition", filter === f ? "bg-electric-500/20 text-white" : "text-slate-400 hover:text-white")}>
                {f === "all" ? "Todas" : "Não lidas"}
              </button>
            ))}
          </div>
        }
      />

      {state.messages.length === 0 ? (
        <EmptyState text="Nenhuma mensagem recebida até o momento." />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
          <ul className="max-h-[70vh] space-y-2 overflow-y-auto pr-1">
            {list.length === 0 && <li className="p-6 text-center text-sm text-slate-500">Nenhuma mensagem não lida.</li>}
            {list.map((m) => (
              <li key={m.id}>
                <button
                  type="button"
                  onClick={() => open(m.id)}
                  className={cn(
                    "w-full rounded-2xl border p-4 text-left transition",
                    selectedId === m.id ? "border-electric-400/50 bg-electric-500/10" : "border-white/8 bg-night-900/60 hover:border-white/20",
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="flex items-center gap-2 truncate text-sm font-semibold text-white">
                      {!m.read && <span className="size-2 shrink-0 rounded-full bg-cyan-400" />}
                      {m.name}
                    </p>
                    <span className="shrink-0 text-[0.68rem] text-slate-500">{formatDateTime(m.date)}</span>
                  </div>
                  <p className="mt-1 truncate text-sm text-slate-300">{m.subject}</p>
                  <p className="mt-0.5 truncate text-xs text-slate-500">{m.service}</p>
                </button>
              </li>
            ))}
          </ul>

          {selected ? (
            <article className="rounded-2xl border border-white/8 bg-night-900/60 p-6 sm:p-8">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white">{selected.subject}</h2>
                  <p className="mt-1 text-sm text-slate-400">
                    {formatDateTime(selected.date)} · <span className="text-cyan-300">{selected.service}</span>
                  </p>
                </div>
                <div className="flex gap-2">
                  <AdminButton variant="outline" onClick={() => updateMessage(selected.id, { read: !selected.read })} icon={selected.read ? <MailOpen className="size-4" /> : <MailCheck className="size-4" />}>
                    {selected.read ? "Marcar não lida" : "Marcar lida"}
                  </AdminButton>
                  <AdminButton variant="danger" onClick={() => setToDelete(selected.id)} icon={<Trash2 className="size-4" />} aria-label="Excluir mensagem" />
                </div>
              </div>

              <dl className="mt-6 grid gap-3 rounded-xl border border-white/5 bg-white/[0.03] p-4 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-xs uppercase tracking-wider text-slate-500">Nome</dt>
                  <dd className="text-white">{selected.name}</dd>
                </div>
                {selected.company && (
                  <div>
                    <dt className="text-xs uppercase tracking-wider text-slate-500">Empresa</dt>
                    <dd className="flex items-center gap-1.5 text-white"><Building2 className="size-3.5 text-slate-500" /> {selected.company}</dd>
                  </div>
                )}
                <div>
                  <dt className="text-xs uppercase tracking-wider text-slate-500">E-mail</dt>
                  <dd><a href={`mailto:${selected.email}`} className="text-cyan-300 hover:underline">{selected.email}</a></dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wider text-slate-500">Telefone</dt>
                  <dd className="text-white">{selected.phone}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-xs uppercase tracking-wider text-slate-500">Entrega por e-mail</dt>
                  <dd className={selected.delivered ? "text-emerald-300" : "text-amber-200"}>
                    {selected.delivered ? "Enviada ao e-mail institucional" : "Registrada apenas no painel (configure a integração em Configurações)"}
                  </dd>
                </div>
              </dl>

              <p className="mt-6 whitespace-pre-wrap text-base leading-relaxed text-slate-200">{selected.message}</p>

              <div className="mt-8 flex flex-wrap gap-2 border-t border-white/5 pt-6">
                <a
                  href={`mailto:${selected.email}?subject=${encodeURIComponent("Re: " + selected.subject)}`}
                  className="inline-flex h-10 items-center gap-2 rounded-xl bg-gradient-brand px-4 text-sm font-semibold text-white hover:brightness-110"
                >
                  <Mail className="size-4" /> Responder por e-mail
                </a>
                <a
                  href={`https://wa.me/${waDigits(selected.phone)}?text=${encodeURIComponent(`Olá ${selected.name.split(" ")[0]}, aqui é da Khronos Tecnologia e Sistemas. Recebemos sua solicitação sobre "${selected.subject}".`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#25D366] px-4 text-sm font-semibold text-white hover:brightness-105"
                >
                  <WhatsappIcon width={16} height={16} /> Responder no WhatsApp
                </a>
                <a href={`tel:${selected.phone.replace(/\D/g, "")}`} className="inline-flex h-10 items-center gap-2 rounded-xl border border-white/10 px-4 text-sm font-semibold text-slate-200 hover:bg-white/5">
                  <Phone className="size-4" /> Ligar
                </a>
              </div>
            </article>
          ) : (
            <EmptyState text="Selecione uma mensagem para visualizar." />
          )}
        </div>
      )}

      <ConfirmDialog
        open={!!toDelete}
        title="Excluir mensagem"
        text="Esta mensagem será removida permanentemente do painel."
        onCancel={() => setToDelete(null)}
        onConfirm={() => {
          if (toDelete) {
            deleteMessage(toDelete);
            setSelectedId(null);
            setToDelete(null);
            show("Mensagem excluída.");
          }
        }}
      />
      {toast}
    </>
  );
}
