import type { ReactNode } from "react";

const bottomOffset =
  "max(4.25rem, calc(3.5rem + env(safe-area-inset-bottom, 0px)))" as const;

/**
 * Barre d’actions fixée au-dessus de la bottom nav mobile (lg:hidden).
 * Le parent de la page doit prévoir du padding bas (ex. pb-28) pour éviter le chevauchement du contenu.
 */
export function MobileStickyQuickBar({ children }: { children: ReactNode }) {
  return (
    <div
      className="pointer-events-none fixed inset-x-0 z-40 px-3 lg:hidden"
      style={{ bottom: bottomOffset }}
    >
      <div className="pointer-events-auto flex gap-2 rounded-2xl border border-border bg-background/95 p-2.5 shadow-lg backdrop-blur-md">
        {children}
      </div>
    </div>
  );
}
