import type { ComponentProps, ReactNode } from "react";
import Link from "next/link";

type MdxProviderType = typeof import("@mdx-js/react").MDXProvider;

function Anchor({
  href,
  children,
  ...rest
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & { children?: ReactNode }) {
  if (href?.startsWith("/")) {
    return (
      <Link href={href} className="text-neon underline-offset-2 hover:underline" {...rest}>
        {children}
      </Link>
    );
  }
  return (
    <a
      href={href}
      className="text-neon underline-offset-2 hover:underline"
      target="_blank"
      rel="noopener noreferrer"
      {...rest}
    >
      {children}
    </a>
  );
}

type MdxMap = NonNullable<ComponentProps<MdxProviderType>["components"]>;

export const blogMdxComponents: MdxMap = {
  h1: (props) => (
    <h1 className="text-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl" {...props} />
  ),
  h2: (props) => (
    <h2
      className="text-display mt-12 scroll-mt-24 border-b border-border pb-2 text-xl font-semibold text-foreground first:mt-0 sm:text-2xl"
      {...props}
    />
  ),
  h3: (props) => (
    <h3 className="text-display mt-8 text-lg font-semibold text-foreground sm:text-xl" {...props} />
  ),
  p: (props) => <p className="leading-relaxed text-foreground/90" {...props} />,
  ul: (props) => <ul className="my-4 list-disc space-y-2 pl-5 text-foreground/90" {...props} />,
  ol: (props) => <ol className="my-4 list-decimal space-y-2 pl-5 text-foreground/90" {...props} />,
  li: (props) => <li className="leading-relaxed" {...props} />,
  strong: (props) => <strong className="font-semibold text-foreground" {...props} />,
  blockquote: (props) => (
    <blockquote
      className="my-6 border-l-2 border-neon/50 bg-surface/80 py-3 pl-4 pr-4 text-sm text-muted italic"
      {...props}
    />
  ),
  hr: () => <hr className="my-10 border-border" />,
  table: (props) => (
    <div className="my-6 overflow-x-auto rounded-xl border border-border">
      <table className="w-full min-w-lg border-collapse text-left text-sm" {...props} />
    </div>
  ),
  thead: (props) => <thead className="bg-surface-elevated text-foreground" {...props} />,
  th: (props) => (
    <th className="border-b border-border px-3 py-2 font-semibold" {...props} />
  ),
  td: (props) => <td className="border-b border-border/80 px-3 py-2 text-foreground/90" {...props} />,
  tr: (props) => <tr className="even:bg-white/2" {...props} />,
  code: (props) => {
    const inline = typeof props.className === "undefined";
    if (inline) {
      return (
        <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[0.9em] text-neon" {...props} />
      );
    }
    return <code className="font-mono text-sm" {...props} />;
  },
  pre: (props) => (
    <pre className="my-4 overflow-x-auto rounded-xl border border-border bg-[#0a0e14] p-4 text-sm" {...props} />
  ),
  a: Anchor,
};
