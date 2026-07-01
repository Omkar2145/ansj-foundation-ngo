import { Link } from "@tanstack/react-router";
import logoAsset from "@/assets/ansj-logo.jpeg.asset.json";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2.5 group">
      <img
        src={logoAsset.url}
        alt="ANSJ Welfare & Education Foundation"
        className="size-11 rounded-full object-contain bg-white shadow-[var(--shadow-soft)]"
      />
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
