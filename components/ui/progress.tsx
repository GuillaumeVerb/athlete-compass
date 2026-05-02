import { cn } from "@/lib/utils";

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
}

export function Progress({ className, value, ...props }: ProgressProps) {
  const v = Math.min(100, Math.max(0, value));
  return (
    <div
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full bg-[#0a0c10] border border-[#252a36]",
        className,
      )}
      {...props}
    >
      <div
        className="h-full rounded-full bg-gradient-to-r from-[#145522] to-[#52ff72] transition-all duration-500 shadow-[0_0_12px_rgba(82,255,114,0.35)]"
        style={{ width: `${v}%` }}
      />
    </div>
  );
}
