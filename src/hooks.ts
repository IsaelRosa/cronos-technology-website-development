import { useEffect, useRef, useState, type RefObject } from "react";

interface SeoOptions {
  title: string;
  description?: string;
  image?: string;
  noIndex?: boolean;
}

function setMeta(selector: string, attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

/** Atualiza título, descrição e tags Open Graph da página (SEO). */
export function useSEO({ title, description, image, noIndex }: SeoOptions) {
  useEffect(() => {
    const fullTitle = title.includes("Kronos") ? title : `${title} | Kronos Tecnologia e Sistemas`;
    document.title = fullTitle;
    if (description) {
      setMeta('meta[name="description"]', "name", "description", description);
      setMeta('meta[property="og:description"]', "property", "og:description", description);
      setMeta('meta[name="twitter:description"]', "name", "twitter:description", description);
    }
    setMeta('meta[property="og:title"]', "property", "og:title", fullTitle);
    setMeta('meta[name="twitter:title"]', "name", "twitter:title", fullTitle);
    setMeta('meta[property="og:url"]', "property", "og:url", window.location.href);
    if (image) setMeta('meta[property="og:image"]', "property", "og:image", image);
    setMeta('meta[name="robots"]', "name", "robots", noIndex ? "noindex, nofollow" : "index, follow");
  }, [title, description, image, noIndex]);
}

/**
 * Detecta quando o elemento entra na viewport (animações de revelação).
 * Usa IntersectionObserver com um fallback por scroll/resize para garantir
 * que nenhum conteúdo permaneça oculto em cenários de rolagem atípicos.
 */
export function useInView<T extends HTMLElement>(): [RefObject<T | null>, boolean] {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let done = false;
    let obs: IntersectionObserver | null = null;
    let ticking = false;

    const cleanup = () => {
      obs?.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      clearTimeout(timer);
    };
    const show = () => {
      if (done) return;
      done = true;
      setInView(true);
      cleanup();
    };
    const check = () => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.94) show();
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        check();
      });
    };

    if (typeof IntersectionObserver !== "undefined") {
      obs = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) show();
        },
        { threshold: 0.05, rootMargin: "0px 0px -6% 0px" },
      );
      obs.observe(el);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    const timer = setTimeout(check, 250);
    return cleanup;
  }, []);

  return [ref, inView];
}

/** Retorna true após a página rolar além de `offset` pixels. */
export function useScrolled(offset = 24) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > offset);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [offset]);
  return scrolled;
}

/** Trava a rolagem do body enquanto `locked` for verdadeiro (modais/menus). */
export function useBodyLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [locked]);
}
