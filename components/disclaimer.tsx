import { cn } from "@/lib/utils";

export function MedicalDisclaimer({ className }: { className?: string }) {
  return (
    <p
      className={cn(
        "text-xs leading-relaxed text-[#6b7289] max-w-prose",
        className,
      )}
    >
      L&apos;âge athlétique est une estimation de performance, pas une mesure
      biologique ni un diagnostic médical.
    </p>
  );
}
