import { landingContent } from "@/lib/landing-content";

export function Logo() {
  return (
    <div className="flex items-center gap-3">
      <svg
        aria-hidden="true"
        className="h-10 w-10 shrink-0"
        viewBox="0 0 120 120"
        fill="none"
      >
        <defs>
          <linearGradient id="logo-gradient" x1="10" y1="18" x2="110" y2="100">
            <stop stopColor="#e8443a" />
            <stop offset="1" stopColor="#ff7a45" />
          </linearGradient>
        </defs>
        <rect x="10" y="18" width="100" height="74" rx="22" fill="url(#logo-gradient)" />
        <path
          d="M34 52h14l10-16 8 30 8-20 4 6h12"
          stroke="white"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M44 96l10 10 18-22"
          stroke="white"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <div className="leading-tight">
        <div className="text-base font-semibold text-zinc-950">
          {landingContent.product.name}
        </div>
        <div className="text-xs font-medium text-zinc-500">
          {landingContent.product.englishName}
        </div>
      </div>
    </div>
  );
}
