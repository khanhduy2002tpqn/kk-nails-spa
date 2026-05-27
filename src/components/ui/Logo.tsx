import { BRAND } from "@/lib/constants";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative flex h-11 w-11 items-center justify-center rounded-full border border-pink-cream/70 bg-cream shadow-sm dark:bg-black/60">
        <span className="font-display text-xl font-bold tracking-tight text-pink-accent dark:text-pink-cream">
          KK
        </span>
        <svg
          className="absolute inset-0 h-full w-full text-pink-cream/50"
          viewBox="0 0 44 44"
          fill="none"
          aria-hidden
        >
          <circle cx="22" cy="22" r="20" stroke="currentColor" strokeWidth="0.5" />
          <path
            d="M8 22c4-8 8-12 14-12s10 4 14 12c-4 8-8 12-14 12S12 30 8 22z"
            stroke="currentColor"
            strokeWidth="0.5"
          />
        </svg>
      </div>
      <div className="hidden sm:block">
        <p className="font-display text-base font-bold leading-tight tracking-wide text-foreground">
          {BRAND.name}
        </p>
        <p className="text-xs uppercase tracking-[0.15em] text-muted">{BRAND.tagline}</p>
      </div>
    </div>
  );
}
