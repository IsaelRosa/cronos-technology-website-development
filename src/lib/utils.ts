import type { Settings } from "@/types";

export function whatsappLink(settings: Settings, message?: string) {
  const digits = settings.whatsapp.replace(/\D/g, "");
  const text = encodeURIComponent(message ?? settings.whatsappMessage);
  return `https://wa.me/${digits}?text=${text}`;
}

export function formatDate(iso: string, opts: Intl.DateTimeFormatOptions = {}) {
  if (!iso) return "";
  const d = iso.length === 10 ? new Date(iso + "T12:00:00") : new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric", ...opts });
}

export function formatDateTime(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

/** Máscara simples de telefone brasileiro. */
export function formatPhone(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());

export type Embed =
  | { type: "iframe"; src: string }
  | { type: "video"; src: string }
  | null;

/** Converte URLs do YouTube, Vimeo, Loom, Google Drive e arquivos de vídeo em embeds. */
export function getEmbed(url?: string): Embed {
  if (!url) return null;
  const u = url.trim();
  if (!u) return null;

  const yt =
    u.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/) ||
    u.match(/[?&]v=([A-Za-z0-9_-]{11})/);
  if (yt) return { type: "iframe", src: `https://www.youtube-nocookie.com/embed/${yt[1]}?rel=0` };

  const vimeo = u.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeo) return { type: "iframe", src: `https://player.vimeo.com/video/${vimeo[1]}` };

  const loom = u.match(/loom\.com\/(?:share|embed)\/([a-zA-Z0-9]+)/);
  if (loom) return { type: "iframe", src: `https://www.loom.com/embed/${loom[1]}` };

  const drive = u.match(/drive\.google\.com\/file\/d\/([^/]+)/);
  if (drive) return { type: "iframe", src: `https://drive.google.com/file/d/${drive[1]}/preview` };

  if (/\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(u)) return { type: "video", src: u };

  if (/^https?:\/\//i.test(u)) return { type: "iframe", src: u };
  return null;
}

/** Comprime uma imagem local para data URL (máx. largura e qualidade configuráveis). */
export function compressImageFile(file: File, maxWidth = 1280, quality = 0.82): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Falha ao ler o arquivo"));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("Arquivo de imagem inválido"));
      img.onload = () => {
        const scale = Math.min(1, maxWidth / img.width);
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("Canvas não suportado"));
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const isPng = file.type === "image/png";
        resolve(canvas.toDataURL(isPng ? "image/png" : "image/jpeg", quality));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export function downloadText(filename: string, text: string, mime = "application/json") {
  const blob = new Blob([text], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Renderização simplificada de markdown (títulos, listas, parágrafos, negrito, links). */
export function parseSimpleMarkdown(content: string) {
  const blocks = content.replace(/\r\n/g, "\n").split(/\n{2,}/);
  return blocks
    .map((raw) => raw.trim())
    .filter(Boolean)
    .map((block) => {
      if (/^###\s/.test(block)) return { type: "h3" as const, text: block.replace(/^###\s/, "") };
      if (/^##\s/.test(block)) return { type: "h2" as const, text: block.replace(/^##\s/, "") };
      if (/^#\s/.test(block)) return { type: "h2" as const, text: block.replace(/^#\s/, "") };
      if (/^>\s/.test(block)) return { type: "quote" as const, text: block.replace(/^>\s?/gm, "") };
      const lines = block.split("\n");
      if (lines.every((l) => /^[-*]\s/.test(l)))
        return { type: "ul" as const, items: lines.map((l) => l.replace(/^[-*]\s/, "")) };
      if (lines.every((l) => /^\d+[.)]\s/.test(l)))
        return { type: "ol" as const, items: lines.map((l) => l.replace(/^\d+[.)]\s/, "")) };
      return { type: "p" as const, text: block };
    });
}

/** Converte **negrito** e [texto](url) em segmentos para renderização segura. */
export function inlineSegments(text: string) {
  const segments: Array<{ kind: "text" | "bold" | "link"; value: string; href?: string }> = [];
  const regex = /(\*\*([^*]+)\*\*)|(\[([^\]]+)\]\((https?:\/\/[^)\s]+)\))/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = regex.exec(text))) {
    if (m.index > last) segments.push({ kind: "text", value: text.slice(last, m.index) });
    if (m[2]) segments.push({ kind: "bold", value: m[2] });
    else if (m[4]) segments.push({ kind: "link", value: m[4], href: m[5] });
    last = regex.lastIndex;
  }
  if (last < text.length) segments.push({ kind: "text", value: text.slice(last) });
  return segments;
}

export function readingTime(content: string) {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}
