import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface PageShellProps {
  title: string;
  subtitle?: string;
  backHref?: string;
  backLabel?: string;
  children: React.ReactNode;
}

export default function PageShell({
  title,
  subtitle,
  backHref = "/projects",
  backLabel = "All Projects",
  children,
}: PageShellProps) {
  return (
    <main className="min-h-screen bg-[#121212] text-white pt-28 pb-24 px-6 md:px-16 lg:px-24 relative z-20">
      <div className="absolute top-32 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="max-w-7xl mx-auto relative">
        <Link
          href={backHref}
          className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white/90 transition-colors mb-10 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          {backLabel}
        </Link>

        <header className="mb-16 md:mb-20">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
            {title}
          </h1>
          {subtitle && (
            <p className="text-white/60 font-light text-lg md:text-xl max-w-2xl leading-relaxed">
              {subtitle}
            </p>
          )}
          <div className="w-20 h-1 bg-white/20 rounded-full mt-8" />
        </header>

        {children}
      </div>
    </main>
  );
}
