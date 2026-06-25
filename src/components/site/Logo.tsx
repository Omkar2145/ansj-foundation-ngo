import { HandHeart } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2.5 group">
      <div className="relative size-11 rounded-2xl gradient-hero grid place-items-center shadow-[var(--shadow-soft)] overflow-hidden">
        <HandHeart className="size-6 text-primary-foreground" strokeWidth={2.2} />
        <span className="absolute -bottom-1 -right-1 size-3.5 rounded-full bg-accent ring-2 ring-background" />
      </div>
      {!compact && (
        <div className="leading-tight">
          <div className="font-heading font-extrabold text-[15px] sm:text-base tracking-tight">
            ANSJ <span className="text-primary">Foundation</span>
          </div>
          <div className="text-[9px] sm:text-[10px] uppercase tracking-[0.18em] text-muted-foreground font-semibold">
            Welfare & Education
          </div>
        </div>
      )}
    </Link>
  );
}
