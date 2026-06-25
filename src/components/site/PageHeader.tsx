import type { ReactNode } from "react";

export function PageHeader({ eyebrow, title, subtitle, children }: { eyebrow?: string; title: ReactNode; subtitle?: string; children?: ReactNode }) {
  return (
    <section className="pt-32 pb-12 lg:pt-40 lg:pb-16 gradient-hero text-primary-foreground relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_70%_30%,_color-mix(in_oklab,_var(--accent)_20%,_transparent),_transparent_50%)]" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        {eyebrow && <span className="text-sm font-semibold text-accent uppercase tracking-widest">{eyebrow}</span>}
        <h1 className="font-heading text-4xl lg:text-6xl font-extrabold mt-2 mb-4 max-w-3xl leading-tight">{title}</h1>
        {subtitle && <p className="text-lg text-primary-foreground/85 max-w-2xl">{subtitle}</p>}
        {children && <div className="mt-6">{children}</div>}
      </div>
    </section>
  );
}
