import type { Metadata } from "next";
import { BlogHeader } from "@/components/blog/blog-header";

export const metadata: Metadata = {
  alternates: {
    types: {
      "application/rss+xml": "/feed.xml",
    },
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <BlogHeader />
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">{children}</div>
    </div>
  );
}
