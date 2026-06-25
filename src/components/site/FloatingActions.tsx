import { useEffect, useState } from "react";
import { Heart, ArrowUp } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function FloatingActions() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
      {show && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top"
          className="size-12 rounded-full bg-card border shadow-[var(--shadow-card)] grid place-items-center hover:bg-muted transition-all animate-scale-in"
        >
          <ArrowUp className="size-5" />
        </button>
      )}
      <Link
        to="/donate"
        aria-label="Donate"
        className="size-14 rounded-full gradient-accent text-accent-foreground grid place-items-center shadow-[var(--shadow-glow)] hover:scale-110 transition-transform animate-float"
      >
        <Heart className="size-6" fill="currentColor" />
      </Link>
    </div>
  );
}
