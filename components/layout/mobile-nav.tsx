"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Activity,
  ClipboardList,
  Gauge,
  Home,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const main = [
  { href: "/", label: "Accueil", icon: Home, match: (p: string) => p === "/" },
  {
    href: "/profile",
    label: "Profil",
    icon: ClipboardList,
    match: (p: string) => p.startsWith("/profile"),
  },
  {
    href: "/performances",
    label: "Perf",
    icon: Activity,
    match: (p: string) => p.startsWith("/performances"),
  },
  {
    href: "/results",
    label: "Score",
    icon: Gauge,
    match: (p: string) => p.startsWith("/results"),
  },
];

const moreLinks = [
  { href: "/bilans", label: "Mes bilans" },
  { href: "/plan", label: "Plan 4 sem." },
  { href: "/report", label: "Rapport" },
  { href: "/tests", label: "Protocoles" },
  { href: "/equivalences", label: "Équivalences" },
  { href: "/pricing", label: "Tarifs" },
];

export function MobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      {open ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          aria-label="Fermer le menu"
          onClick={() => setOpen(false)}
        />
      ) : null}

      <div
        className={cn(
          "fixed bottom-[5.25rem] left-3 right-3 z-50 rounded-2xl border border-border bg-surface-elevated/95 p-3 shadow-xl backdrop-blur-md transition-all lg:hidden",
          open ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0",
        )}
      >
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="text-xs font-medium text-foreground">Plus</span>
          <button
            type="button"
            className="rounded-lg p-1 text-muted hover:text-foreground"
            onClick={() => setOpen(false)}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <ul className="grid grid-cols-2 gap-2">
          {moreLinks.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                onClick={() => setOpen(false)}
                className="block rounded-xl border border-border bg-background/80 px-3 py-2.5 text-sm text-foreground hover:border-neon/40"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 pb-[env(safe-area-inset-bottom)] pt-1 px-1 backdrop-blur-md lg:hidden">
        <div className="mx-auto flex max-w-lg items-stretch justify-around gap-0">
          {main.map(({ href, label, icon: Icon, match }) => {
            const active = match(pathname);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex flex-1 flex-col items-center justify-center gap-0.5 py-2 rounded-xl text-[10px] font-medium transition-colors min-w-0",
                  active
                    ? "text-neon"
                    : "text-muted hover:text-foreground",
                )}
              >
                <Icon className={cn("h-5 w-5 shrink-0", active && "drop-shadow-[0_0_8px_rgba(82,255,114,0.45)]")} />
                <span className="truncate w-full text-center">{label}</span>
              </Link>
            );
          })}
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className={cn(
              "flex flex-1 flex-col items-center justify-center gap-0.5 py-2 rounded-xl text-[10px] font-medium min-w-0",
              open
                ? "text-neon"
                : "text-muted hover:text-foreground",
            )}
          >
            {open ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
            <span>Plus</span>
          </button>
        </div>
      </nav>
    </>
  );
}
