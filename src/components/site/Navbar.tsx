import { useEffect, useState } from "react";
import { Menu, X, Moon, Sun, Heart, ChevronDown, User as UserIcon, LogOut } from "lucide-react";
import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";
import { supabase } from "@/integrations/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";


type NavItem = { to: string; label: string; children?: { to: string; label: string; desc?: string }[] };

const nav: NavItem[] = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  {
    to: "/sponsor",
    label: "Sponsor",
    children: [
      { to: "/sponsor", label: "Sponsor a Child", desc: "Education, books, uniforms" },
      { to: "/sponsor", label: "Support an Elder", desc: "Healthcare, medicines, care" },
    ],
  },
  {
    to: "/register/beneficiary",
    label: "Register",
    children: [
      { to: "/register/beneficiary", label: "Register Beneficiary", desc: "Child or elderly person needing support" },
      { to: "/register/volunteer", label: "Become a Volunteer", desc: "Join field teams, mentoring, events" },
    ],
  },
  { to: "/campaigns", label: "Campaigns" },
  { to: "/transparency", label: "Transparency" },
  { to: "/contact", label: "Contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUserEmail(data.session?.user.email ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUserEmail(session?.user.email ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  };



  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300",
        scrolled || pathname !== "/"
          ? "glass shadow-[var(--shadow-soft)]"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Logo />

          <nav className="hidden lg:flex items-center gap-0.5">
            {nav.map((item) => (
              <div key={item.to + item.label} className="relative group">
                <Link
                  to={item.to}
                  activeOptions={{ exact: item.to === "/" }}
                  className={cn(
                    "px-3 py-2 text-sm font-medium transition-colors flex items-center gap-1 data-[status=active]:text-primary",
                    scrolled || pathname !== "/" ? "text-foreground/80 hover:text-primary" : "text-white/90 hover:text-accent"
                  )}
                >
                  {item.label}
                  {item.children && <ChevronDown className="size-3.5 opacity-60" />}
                </Link>
                {item.children && (
                  <div className="absolute left-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    <div className="bg-card border rounded-2xl shadow-[var(--shadow-card)] p-2 w-64">
                      {item.children.map((c) => (
                        <Link
                          key={c.label}
                          to={c.to}
                          className="block px-3 py-2 rounded-lg hover:bg-muted"
                        >
                          <div className="font-semibold text-sm">{c.label}</div>
                          {c.desc && <div className="text-xs text-muted-foreground">{c.desc}</div>}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setDark((d) => !d)}
              aria-label="Toggle theme"
              className="hidden sm:inline-flex"
            >
              {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </Button>
            {userEmail ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="hidden sm:inline-flex" aria-label="Account">
                    <UserIcon className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5 text-xs text-muted-foreground truncate">{userEmail}</div>
                  <DropdownMenuItem asChild>
                    <Link to="/donor"><UserIcon className="size-4 mr-2" /> Donor Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/admin"><UserIcon className="size-4 mr-2" /> Admin Console</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="size-4 mr-2" /> Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
                <Link to="/auth">Sign in</Link>
              </Button>
            )}
            <Button
              asChild
              className="hidden sm:inline-flex bg-accent text-accent-foreground hover:brightness-105 shadow-[var(--shadow-soft)] font-semibold"
            >
              <Link to="/donate">
                <Heart className="size-4 mr-1" fill="currentColor" /> Donate Now
              </Link>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setOpen((o) => !o)}
              aria-label="Toggle menu"
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </Button>
          </div>
        </div>

        {open && (
          <div className="lg:hidden pb-4 animate-fade-in">
            <nav className="flex flex-col gap-1 glass rounded-2xl p-3">
              {nav.map((item) => (
                <Link
                  key={item.to + item.label}
                  to={item.to}
                  className="px-4 py-3 rounded-lg text-sm font-medium hover:bg-muted data-[status=active]:bg-primary data-[status=active]:text-primary-foreground"
                  activeOptions={{ exact: item.to === "/" }}
                >
                  {item.label}
                </Link>
              ))}
              <Button asChild className="bg-accent text-accent-foreground mt-2 font-bold">
                <Link to="/donate">
                  <Heart className="size-4 mr-1" fill="currentColor" /> Donate Now
                </Link>
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
