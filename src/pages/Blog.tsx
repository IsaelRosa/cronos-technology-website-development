import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, User } from "lucide-react";
import { Button, Container, PageHero, Reveal, Tag } from "@/components/ui";
import { BlogCard, CtaBand } from "@/components/sections";
import { useCms } from "@/store/cms";
import { useSEO } from "@/hooks";
import { formatDate, inlineSegments, parseSimpleMarkdown, readingTime } from "@/lib/utils";
import { cn } from "@/utils/cn";

export default function Blog() {
  const { state } = useCms();
  const [cat, setCat] = useState("Todos");
  useSEO({
    title: "Blog e conteúdos",
    description:
      "Artigos sobre tecnologia da informação, inteligência artificial, transformação digital, desenvolvimento de sistemas e tendências de inovação.",
  });

  const posts = useMemo(
    () => state.posts.filter((p) => p.published).sort((a, b) => b.date.localeCompare(a.date)),
    [state.posts],
  );
  const categories = ["Todos", ...Array.from(new Set(posts.map((p) => p.category)))];
  const filtered = cat === "Todos" ? posts : posts.filter((p) => p.category === cat);
  const [first, ...rest] = filtered;

  return (
    <>
      <PageHero
        eyebrow="Blog e conteúdos"
        title={<>Ideias, tendências e <span className="text-gradient">conhecimento aplicado</span></>}
        description="Conteúdos sobre tecnologia da informação, inteligência artificial, transformação digital e desenvolvimento de sistemas."
      />
      <section className="pb-24">
        <Container>
          <div className="mb-10 flex gap-2 overflow-x-auto pb-1 no-scrollbar" role="tablist" aria-label="Categorias do blog">
            {categories.map((c) => (
              <button
                key={c}
                role="tab"
                aria-selected={cat === c}
                onClick={() => setCat(c)}
                className={cn(
                  "shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-all",
                  cat === c
                    ? "border-transparent bg-gradient-brand text-white shadow-glow"
                    : "border-white/10 bg-white/[0.03] text-slate-300 hover:border-electric-400/40 hover:text-white",
                )}
              >
                {c}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <p className="rounded-3xl border border-dashed border-white/10 p-14 text-center text-slate-400">
              Nenhum artigo publicado nesta categoria ainda.
            </p>
          ) : (
            <>
              {first && (
                <Reveal className="mb-6">
                  <BlogCard post={first} featured />
                </Reveal>
              )}
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {rest.map((p, i) => (
                  <Reveal key={p.id} delay={(i % 3) * 90} className="h-full">
                    <BlogCard post={p} />
                  </Reveal>
                ))}
              </div>
            </>
          )}
        </Container>
      </section>
      <CtaBand />
    </>
  );
}

export function BlogPost() {
  const { slug } = useParams();
  const { state } = useCms();
  const post = state.posts.find((p) => p.slug === slug && p.published);

  useSEO({
    title: post ? post.title : "Artigo não encontrado",
    description: post?.excerpt,
    image: post?.cover,
  });

  if (!post) {
    return (
      <section className="pt-40 pb-24 text-center">
        <Container>
          <h1 className="text-3xl font-bold text-white">Artigo não encontrado</h1>
          <p className="mt-4 text-slate-400">O conteúdo pode ter sido removido ou o endereço está incorreto.</p>
          <Button to="/blog" variant="secondary" className="mt-8" icon={<ArrowLeft className="size-4" />}>
            Voltar ao blog
          </Button>
        </Container>
      </section>
    );
  }

  const blocks = parseSimpleMarkdown(post.content);
  const related = state.posts.filter((p) => p.published && p.id !== post.id).slice(0, 3);

  const renderInline = (text: string) =>
    inlineSegments(text).map((seg, i) =>
      seg.kind === "bold" ? (
        <strong key={i}>{seg.value}</strong>
      ) : seg.kind === "link" ? (
        <a key={i} href={seg.href} target="_blank" rel="noopener noreferrer">
          {seg.value}
        </a>
      ) : (
        <span key={i}>{seg.value}</span>
      ),
    );

  return (
    <>
      <article className="pt-32 sm:pt-40">
        <Container>
          <div className="mx-auto max-w-3xl">
            <Link to="/blog" className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-cyan-300">
              <ArrowLeft className="size-4" /> Voltar ao blog
            </Link>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Tag active>{post.category}</Tag>
              <span className="flex items-center gap-1.5 text-xs text-slate-500">
                <Calendar className="size-3.5" /> {formatDate(post.date, { month: "long" })}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-slate-500">
                <Clock className="size-3.5" /> {readingTime(post.content)} min de leitura
              </span>
              <span className="flex items-center gap-1.5 text-xs text-slate-500">
                <User className="size-3.5" /> {post.author}
              </span>
            </div>
            <h1 className="mt-5 text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">{post.title}</h1>
            <p className="mt-6 text-lg leading-relaxed text-slate-400">{post.excerpt}</p>
          </div>
          <div className="mx-auto mt-10 max-w-4xl overflow-hidden rounded-[2rem] border border-white/10">
            <img src={post.cover} alt="" className="aspect-[16/8] w-full object-cover" />
          </div>
          <div className="prose-cronos mx-auto mt-12 max-w-3xl">
            {blocks.map((b, i) => {
              switch (b.type) {
                case "h2":
                  return <h2 key={i}>{renderInline(b.text)}</h2>;
                case "h3":
                  return <h3 key={i}>{renderInline(b.text)}</h3>;
                case "quote":
                  return <blockquote key={i}>{renderInline(b.text)}</blockquote>;
                case "ul":
                  return (
                    <ul key={i}>
                      {b.items.map((it, j) => (
                        <li key={j}>{renderInline(it)}</li>
                      ))}
                    </ul>
                  );
                case "ol":
                  return (
                    <ol key={i}>
                      {b.items.map((it, j) => (
                        <li key={j}>{renderInline(it)}</li>
                      ))}
                    </ol>
                  );
                default:
                  return <p key={i}>{renderInline(b.text)}</p>;
              }
            })}
          </div>
          <div className="mx-auto mt-14 max-w-3xl rounded-3xl border border-electric-400/20 bg-electric-500/10 p-8 text-center">
            <h2 className="text-xl font-bold text-white">Quer aplicar isso no seu negócio?</h2>
            <p className="mt-2 text-sm text-slate-300">Converse com a Kronos e descubra como a tecnologia pode acelerar seus resultados.</p>
            <Button to="/contato" className="mt-6" arrow>
              Falar com um especialista
            </Button>
          </div>
        </Container>
      </article>

      {related.length > 0 && (
        <section className="py-24">
          <Container>
            <h2 className="mb-8 text-2xl font-bold text-white">Leia também</h2>
            <div className="grid gap-6 md:grid-cols-3">
              {related.map((p) => (
                <BlogCard key={p.id} post={p} />
              ))}
            </div>
          </Container>
        </section>
      )}
      <CtaBand />
    </>
  );
}
