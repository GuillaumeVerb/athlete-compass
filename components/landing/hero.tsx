"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight, ShieldCheck, Timer, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MedicalDisclaimer } from "@/components/disclaimer";

const brands = ["HYROX", "CrossFit", "Rogue", "Concept2", "Strava"];

function HeroVisual() {
  const [showFallback, setShowFallback] = useState(false);
  return (
    <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-surface to-background shadow-[0_0_60px_-20px_rgba(82,255,114,0.3)]">
      {!showFallback ? (
        <Image
          src="/hero-design.png"
          alt="Interface Athlete Compass"
          fill
          className="object-cover object-center opacity-90"
          sizes="(max-width: 1024px) 100vw, 480px"
          priority
          onError={() => setShowFallback(true)}
        />
      ) : (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(82,255,114,0.2),transparent_45%),radial-gradient(circle_at_80%_60%,rgba(245,184,46,0.1),transparent_50%),linear-gradient(160deg,var(--color-surface),var(--color-background))]" />
      )}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      <div className="absolute inset-0 flex flex-col justify-end p-8">
        <p className="text-display text-sm font-medium text-amber">
          Hybrid Score
        </p>
        <p className="mt-1 text-4xl font-semibold text-foreground">76</p>
        <p className="mt-2 text-sm text-muted">
          Profil : Moteur Court — aperçu démo
        </p>
      </div>
    </div>
  );
}

export function LandingHero() {
  return (
    <section className="relative overflow-hidden mesh-bg">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neon/10 via-transparent to-transparent" />
      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-neon/35 bg-neon/15 text-neon">
            <Zap className="h-5 w-5" />
          </span>
          <span className="text-display font-semibold tracking-tight text-foreground">
            Athlete Compass
          </span>
        </div>
        <nav className="hidden items-center gap-8 text-sm text-muted md:flex">
          <a href="#how" className="transition-colors hover:text-foreground">
            Comment ça marche
          </a>
          <a href="#features" className="transition-colors hover:text-foreground">
            Fonctionnalités
          </a>
          <a href="#about" className="transition-colors hover:text-foreground">
            À propos
          </a>
          <Link href="/pricing" className="transition-colors hover:text-foreground">
            Tarifs
          </Link>
        </nav>
      </header>

      <div className="relative z-10 mx-auto grid max-w-6xl gap-12 px-6 pb-24 pt-4 lg:grid-cols-2 lg:items-center">
        <div>
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="inline-flex items-center gap-1 rounded-full border border-neon/30 bg-neon/10 px-3 py-1 text-xs font-medium text-neon">
              <Timer className="h-3.5 w-3.5" /> Rapide
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-muted">
              <ShieldCheck className="h-3.5 w-3.5 text-neon" />{" "}
              Scientifique
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-amber/30 bg-amber/10 px-3 py-1 text-xs font-medium text-amber">
              Actionnable
            </span>
          </div>
          <h1 className="text-display text-4xl font-semibold leading-[1.08] tracking-tight text-foreground sm:text-5xl lg:text-[3.25rem]">
            Ton âge réel n&apos;est pas ton{" "}
            <span className="text-neon">âge athlétique</span>.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">
            Découvre ton niveau, tes forces, tes faiblesses et le plan minimal
            pour devenir un athlète hybride.
          </p>
          <div className="mt-4">
            <MedicalDisclaimer />
          </div>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button asChild size="lg" className="rounded-2xl px-7">
              <Link href="/profile">
                Commencer mon bilan gratuit
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="secondary" size="lg" className="rounded-2xl">
              <Link href="/results">Voir un exemple de résultats</Link>
            </Button>
          </div>
          <p className="mt-5 max-w-xl text-sm text-muted">
            Déjà utilisé par des pratiquants HYROX, CrossFit et salle — pour
            cadrer un bilan court avant d&apos;optimiser l&apos;entraînement
            (démo V1).
          </p>
          <p className="mt-6 text-xs text-muted/70">
            Estimation de performance, pas un diagnostic médical.
          </p>
        </div>

        <div className="relative lg:pl-4">
          <HeroVisual />
        </div>
      </div>

      <div id="partenaires" className="border-t border-border bg-background/80">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-10 gap-y-4 px-6 py-8 text-xs font-semibold uppercase tracking-[0.2em] text-muted/50">
          {brands.map((b) => (
            <span key={b}>{b}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
