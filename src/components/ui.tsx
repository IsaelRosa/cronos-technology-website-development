import { forwardRef, type ButtonHTMLAttributes, type CSSProperties, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { cn } from "@/utils/cn";
import { useInView } from "@/hooks";

/* ---------------------------------- Container --------------------------------- */
export function Container({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10", className)}>{children}</div>;
}

/* ------------------------------------ Button ---------------------------------- */
type Variant = "primary" | "secondary" | "ghost" | "white" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  to?: string;
  href?: string;
  icon?: ReactNode;
  arrow?: boolean;
  external?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-gradient-brand text-white shadow-[0_10px_30px_-10px_rgba(47,107,255,.7)] hover:shadow-[0_14px_40px_-10px_rgba(34,211,238,.6)] hover:brightness-110",
  secondary:
    "glass text-white hover:bg-white/10 hover:border-electric-400/50",
  ghost: "text-slate-200 hover:text-white hover:bg-white/5",
  white: "bg-white text-night-900 hover:bg-slate-100",
  danger: "bg-red-500/15 text-red-300 border border-red-500/30 hover:bg-red-500/25",
};
const sizeClasses: Record<Size, string> = {
  sm: "h-9 px-4 text-sm gap-1.5",
  md: "h-11 px-6 text-sm gap-2",
  lg: "h-13 px-8 text-base gap-2.5",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", to, href, icon, arrow, external, className, children, ...rest },
  ref,
) {
  const classes = cn(
    "group/btn inline-flex items-center justify-center rounded-full font-semibold tracking-tight transition-all duration-300 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60",
    variantClasses[variant],
    sizeClasses[size],
    className,
  );
  const content = (
    <>
      {icon}
      {children}
      {arrow && (
        <ArrowRight className="size-4 transition-transform duration-300 group-hover/btn:translate-x-1" aria-hidden />
      )}
    </>
  );
  if (to) {
    return (
      <Link to={to} className={classes}>
        {content}
      </Link>
    );
  }
  if (href) {
    return (
      <a
        href={href}
        className={classes}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {content}
      </a>
    );
  }
  return (
    <button ref={ref} className={classes} {...rest}>
      {content}
    </button>
  );
});

/* ------------------------------------ Reveal ---------------------------------- */
interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "section" | "article" | "li" | "span";
  style?: CSSProperties;
}
export function Reveal({ children, className, delay = 0, as = "div", style }: RevealProps) {
  const [ref, inView] = useInView<HTMLDivElement>();
  const Tag = as as "div";
  return (
    <Tag
      ref={ref}
      className={cn("reveal", inView && "reveal-visible", className)}
      style={{ transitionDelay: `${delay}ms`, ...style }}
    >
      {children}
    </Tag>
  );
}

/* --------------------------------- Typography --------------------------------- */
export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-electric-500/30 bg-electric-500/10 px-3.5 py-1.5 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-electric-300",
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee]" aria-hidden />
      {children}
    </span>
  );
}

interface SectionHeadingProps {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  className?: string;
  light?: boolean;
}
export function SectionHeading({ eyebrow, title, description, align = "center", className }: SectionHeadingProps) {
  return (
    <Reveal className={cn("max-w-3xl", align === "center" ? "mx-auto text-center" : "text-left", className)}>
      {eyebrow && <Eyebrow className="mb-5">{eyebrow}</Eyebrow>}
      <h2 className="text-3xl font-bold leading-[1.1] text-white sm:text-4xl lg:text-[2.75rem]">{title}</h2>
      {description && <p className="mt-5 text-base leading-relaxed text-slate-400 sm:text-lg">{description}</p>}
    </Reveal>
  );
}

export function Tag({ children, className, active }: { children: ReactNode; className?: string; active?: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2.5 py-1 text-[0.72rem] font-medium tracking-wide",
        active
          ? "border-cyan-400/40 bg-cyan-400/10 text-cyan-300"
          : "border-white/10 bg-white/5 text-slate-300",
        className,
      )}
    >
      {children}
    </span>
  );
}

/* ---------------------------------- Page hero --------------------------------- */
interface PageHeroProps {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  children?: ReactNode;
}
export function PageHero({ eyebrow, title, description, children }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden pt-36 pb-16 sm:pt-44 sm:pb-20">
      <div className="pointer-events-none absolute inset-0 grid-bg grid-fade" aria-hidden />
      <div
        className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-electric-600/25 blur-[140px]"
        aria-hidden
      />
      <Container className="relative">
        <div className="mx-auto max-w-3xl text-center animate-fade-up">
          <Eyebrow className="mb-6">{eyebrow}</Eyebrow>
          <h1 className="text-4xl font-bold leading-[1.08] text-white sm:text-5xl lg:text-6xl">{title}</h1>
          {description && <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-400">{description}</p>}
          {children && <div className="mt-8">{children}</div>}
        </div>
      </Container>
    </section>
  );
}

/* ---------------------------------- Glow orbs --------------------------------- */
export function Orb({ className }: { className?: string }) {
  return <div aria-hidden className={cn("pointer-events-none absolute rounded-full blur-[120px]", className)} />;
}
