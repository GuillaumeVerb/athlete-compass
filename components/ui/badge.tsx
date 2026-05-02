import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#52ff72]/25",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[#52ff72]/15 text-[#52ff72] border-[#52ff72]/30",
        secondary: "border-transparent bg-white/5 text-[#c5cad8]",
        amber:
          "border-[#f5b942]/40 bg-[#f5b942]/10 text-[#f5b942]",
        outline: "text-foreground border-[#252a36]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
