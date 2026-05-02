import { cn } from "@/lib/utils";

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
}

export function Progress({ className, value, ...props }: ProgressProps) {
  const v = Math.min(100, Math.max(0, value));
  return (
    <div
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full border border-border bg-background",
        className,
      )}
      {...props}
    >
      <div
        className="h-full rounded-full bg-gradient-to-r from-neon-dim to-neon transition-all duration-500 shadow-[0_0_12px_rgba(82,255,114,0.35)]"
        style={{ width: `${v}%` }}
      />
    </div>
  );
}
