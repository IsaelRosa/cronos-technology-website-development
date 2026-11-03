import { cn } from "@/utils/cn";

interface LogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
  light?: boolean;
}

export function LogoMark({ size = 40, className }: { size?: number; className?: string }) {
  const id = "cronos-grad";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={id} x1="4" y1="4" x2="36" y2="36" gradientUnits="userSpaceOnUse">
          <stop stopColor="#5C90FF" />
          <stop offset="1" stopColor="#22D3EE" />
        </linearGradient>
        <filter id="cronos-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="1.2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {/* Anel em "C" */}
      <path
        d="M30.7 29 A14 14 0 1 1 30.7 11"
        stroke={`url(#${id})`}
        strokeWidth="3.4"
        strokeLinecap="round"
        filter="url(#cronos-glow)"
      />
      {/* Nós de circuito nas pontas */}
      <circle cx="30.7" cy="29" r="2.3" fill="#22D3EE" />
      <circle cx="30.7" cy="11" r="2.3" fill="#5C90FF" />
      {/* Ponteiros */}
      <path d="M20 20 L20 12.5" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M20 20 L27.5 20" stroke={`url(#${id})`} strokeWidth="2.6" strokeLinecap="round" />
      <circle cx="20" cy="20" r="2.4" fill="#fff" />
      {/* Traço de circuito */}
      <path d="M11 20 H6" stroke="#22D3EE" strokeWidth="1.6" strokeLinecap="round" opacity="0.8" />
      <circle cx="4.5" cy="20" r="1.4" fill="#22D3EE" opacity="0.9" />
    </svg>
  );
}

export default function Logo({ className, size = 40, showText = true, light = true }: LogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <LogoMark size={size} />
      {showText && (
        <span className="flex flex-col leading-none">
          <span
            className={cn(
              "font-display text-[1.15rem] font-bold tracking-[0.18em]",
              light ? "text-white" : "text-night-900",
            )}
          >
            KHRONOS
          </span>
          <span
            className={cn(
              "mt-1 text-[0.58rem] font-medium uppercase tracking-[0.28em]",
              light ? "text-slate-400" : "text-slate-500",
            )}
          >
            Tecnologia e Sistemas
          </span>
        </span>
      )}
    </span>
  );
}
