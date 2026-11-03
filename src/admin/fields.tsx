import { useCallback, useEffect, useRef, useState, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from "react";
import { AlertTriangle, CheckCircle2, ImagePlus, Link2, Upload, X } from "lucide-react";
import { compressImageFile } from "@/lib/utils";
import { resolveImage } from "@/data/seed";
import { useBodyLock } from "@/hooks";
import { cn } from "@/utils/cn";

/* ------------------------------- Page header ------------------------------- */
export function AdminHeader({ title, description, actions }: { title: string; description?: string; actions?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-white sm:text-3xl">{title}</h1>
        {description && <p className="mt-1.5 text-sm text-slate-400">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function AdminCard({ className, children, title, description }: { className?: string; children: ReactNode; title?: string; description?: string }) {
  return (
    <section className={cn("rounded-2xl border border-white/8 bg-night-900/60 p-6", className)}>
      {title && (
        <div className="mb-5">
          <h2 className="text-base font-semibold text-white">{title}</h2>
          {description && <p className="mt-1 text-xs text-slate-500">{description}</p>}
        </div>
      )}
      {children}
    </section>
  );
}

/* --------------------------------- Fields ---------------------------------- */
export function FieldWrap({ label, hint, error, children, className }: { label: string; hint?: string; error?: string; children: ReactNode; className?: string }) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-1.5 block text-sm font-medium text-slate-200">{label}</span>
      {children}
      {hint && !error && <span className="mt-1 block text-xs text-slate-500">{hint}</span>}
      {error && <span className="mt-1 block text-xs text-red-300">{error}</span>}
    </label>
  );
}

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn("input-dark", props.className)} />;
}
export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={cn("input-dark resize-y", props.className)} />;
}
export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={cn("input-dark [&>option]:bg-night-900", props.className)} />;
}

export function Toggle({ checked, onChange, label, description }: { checked: boolean; onChange: (v: boolean) => void; label: string; description?: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-left"
    >
      <span>
        <span className="block text-sm font-medium text-slate-200">{label}</span>
        {description && <span className="block text-xs text-slate-500">{description}</span>}
      </span>
      <span className={cn("relative h-6 w-11 shrink-0 rounded-full transition-colors", checked ? "bg-electric-500" : "bg-white/15")}>
        <span className={cn("absolute top-0.5 size-5 rounded-full bg-white transition-all", checked ? "left-[22px]" : "left-0.5")} />
      </span>
    </button>
  );
}

/* ------------------------------- Image input ------------------------------- */
export function ImageInput({ value, onChange, label = "Imagem", hint }: { value: string; onChange: (v: string) => void; label?: string; hint?: string }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const preview = resolveImage(value);

  const onFile = async (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) return setErr("Selecione um arquivo de imagem.");
    setBusy(true);
    setErr(null);
    try {
      const dataUrl = await compressImageFile(file, 1280, 0.82);
      if (dataUrl.length > 900_000) setErr("Imagem grande: considere hospedá-la e usar a URL.");
      onChange(dataUrl);
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <span className="mb-1.5 block text-sm font-medium text-slate-200">{label}</span>
      <div className="grid gap-4 sm:grid-cols-[160px_1fr]">
        <div className="relative flex aspect-[16/10] items-center justify-center overflow-hidden rounded-xl border border-dashed border-white/15 bg-white/[0.03]">
          {preview ? (
            <>
              <img src={preview} alt="Pré-visualização" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => onChange("")}
                className="absolute right-1.5 top-1.5 rounded-full bg-night-950/80 p-1 text-white"
                aria-label="Remover imagem"
              >
                <X className="size-3.5" />
              </button>
            </>
          ) : (
            <ImagePlus className="size-7 text-slate-600" />
          )}
        </div>
        <div className="space-y-2">
          <div className="relative">
            <Link2 className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
            <Input
              value={value.startsWith("data:") ? "" : value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={value.startsWith("data:") ? "Imagem enviada do computador" : "https://... (URL da imagem)"}
              className="pl-10"
            />
          </div>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={busy}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:border-electric-400/50 hover:bg-electric-500/10 disabled:opacity-50"
          >
            <Upload className="size-4" /> {busy ? "Processando..." : "Enviar do computador"}
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
          <p className="text-xs text-slate-500">{hint ?? "Cole uma URL ou envie um arquivo (JPG/PNG, otimizado automaticamente)."}</p>
          {err && <p className="text-xs text-amber-300">{err}</p>}
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------- Modal ---------------------------------- */
export function Modal({ open, onClose, title, children, footer, wide }: { open: boolean; onClose: () => void; title: string; children: ReactNode; footer?: ReactNode; wide?: boolean }) {
  useBodyLock(open);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-night-950/80 backdrop-blur-sm sm:items-center sm:p-6" onClick={onClose} role="dialog" aria-modal="true" aria-label={title}>
      <div
        className={cn("flex max-h-[94vh] w-full flex-col rounded-t-3xl border border-white/10 bg-night-900 shadow-2xl animate-fade-up sm:rounded-3xl", wide ? "max-w-4xl" : "max-w-2xl")}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-white/5 px-6 py-4">
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          <button type="button" onClick={onClose} aria-label="Fechar" className="rounded-full p-2 text-slate-400 hover:bg-white/5 hover:text-white">
            <X className="size-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
        {footer && <div className="flex flex-wrap justify-end gap-2 border-t border-white/5 px-6 py-4">{footer}</div>}
      </div>
    </div>
  );
}

/* --------------------------------- Confirm --------------------------------- */
export function ConfirmDialog({ open, title, text, onCancel, onConfirm, confirmLabel = "Excluir" }: { open: boolean; title: string; text: string; onCancel: () => void; onConfirm: () => void; confirmLabel?: string }) {
  return (
    <Modal
      open={open}
      onClose={onCancel}
      title={title}
      footer={
        <>
          <AdminButton variant="ghost" onClick={onCancel}>
            Cancelar
          </AdminButton>
          <AdminButton variant="danger" onClick={onConfirm}>
            {confirmLabel}
          </AdminButton>
        </>
      }
    >
      <div className="flex gap-4">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-red-500/15 text-red-300">
          <AlertTriangle className="size-5" />
        </span>
        <p className="text-sm leading-relaxed text-slate-300">{text}</p>
      </div>
    </Modal>
  );
}

/* --------------------------------- Buttons --------------------------------- */
export function AdminButton({ variant = "primary", className, children, icon, ...rest }: { variant?: "primary" | "ghost" | "danger" | "outline"; icon?: ReactNode } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const v = {
    primary: "bg-gradient-brand text-white hover:brightness-110",
    ghost: "text-slate-300 hover:bg-white/5 hover:text-white",
    outline: "border border-white/10 text-slate-200 hover:border-electric-400/50 hover:bg-electric-500/10",
    danger: "bg-red-500/15 text-red-300 border border-red-500/30 hover:bg-red-500/25",
  }[variant];
  return (
    <button
      type="button"
      {...rest}
      className={cn("inline-flex h-10 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50", v, className)}
    >
      {icon}
      {children}
    </button>
  );
}

/* ---------------------------------- Toast ---------------------------------- */
export function useToast() {
  const [toast, setToast] = useState<{ text: string; kind: "ok" | "err" } | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const show = useCallback((text: string, kind: "ok" | "err" = "ok") => {
    setToast({ text, kind });
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(null), 3200);
  }, []);
  const el = toast ? (
    <div
      role="status"
      className={cn(
        "fixed bottom-6 left-1/2 z-[90] flex -translate-x-1/2 items-center gap-2 rounded-full border px-5 py-3 text-sm font-medium shadow-2xl backdrop-blur animate-fade-up",
        toast.kind === "ok" ? "border-emerald-400/30 bg-emerald-500/15 text-emerald-200" : "border-red-400/30 bg-red-500/15 text-red-200",
      )}
    >
      {toast.kind === "ok" ? <CheckCircle2 className="size-4" /> : <AlertTriangle className="size-4" />}
      {toast.text}
    </div>
  ) : null;
  return { toast: el, show };
}

/* -------------------------------- Empty state ------------------------------- */
export function EmptyState({ text, action }: { text: string; action?: ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-white/10 p-12 text-center">
      <p className="text-sm text-slate-400">{text}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
