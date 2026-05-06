"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, BookOpen, ClipboardList, Gauge, History, Home, Layers, LineChart, Lock, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Accueil", icon: Home },
  { href: "/profile", label: "Profil", icon: ClipboardList },
  { href: "/performances", label: "Performances", icon: Activity },
  { href: "/results", label: "Résultats", icon: Gauge },
  { href: "/bilans", label: "Mes bilans", icon: History },
  { href: "/plan", label: "Plan 4 sem.", icon: Layers },
  { href: "/report", label: "Rapport", icon: Lock },
  { href: "/tests", label: "Protocoles", icon: BookOpen },
  { href: "/equivalences", label: "Équivalences", icon: LineChart },
  { href: "/pricing", label: "Tarifs", icon: Sparkles },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="sticky top-0 hidden min-h-screen w-64 shrink-0 flex-col border-r border-border bg-background/95 backdrop-blur-sm lg:flex">
      <div className="p-6 pb-4">
        <Link href="/" className="group flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-neon/35 bg-neon/15 text-neon">
            <Activity className="h-5 w-5" />
          </span>
          <div>
            <div className="text-display text-sm font-semibold tracking-tight text-foreground">
              Athlete Compass
            </div>
            <div className="text-[10px] uppercase tracking-widest text-muted">
              Performance lab
            </div>
          </div>
        </Link>
      </div>
      <nav className="flex-1 space-y-0.5 px-3">
        {links.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/"
              ? pathname === "/"
              : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
                active
                  ? "border border-border bg-surface-elevated text-neon"
                  : "text-muted hover:bg-white/5 hover:text-foreground",
              )}
            >
              <Icon className="h-4 w-4 shrink-0 opacity-80" />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto border-t border-border p-4 text-[10px] leading-snug text-muted/80">
        Estimation de performance — usage démo V1.
      </div>
    </aside>
  );
}
