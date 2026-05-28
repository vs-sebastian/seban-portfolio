"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import {
  HOME_HREF,
  isHomeHref,
  scrollToHome,
  scrollToTop,
} from "@/lib/navigation/scroll";

interface NavBackLinkProps {
  href: string;
  label: string;
  className?: string;
}

export default function NavBackLink({
  href,
  label,
  className = "inline-flex items-center gap-2 text-sm text-white/50 hover:text-white/90 transition-colors mb-10 group",
}: NavBackLinkProps) {
  const pathname = usePathname();
  const resolvedHref = isHomeHref(href) ? HOME_HREF : href;
  const homeLink = isHomeHref(href);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (homeLink && pathname === "/") {
      e.preventDefault();
      scrollToHome();
      return;
    }

    const [targetPath, hashPart] = href.split("#");
    const hash = hashPart ? decodeURIComponent(hashPart) : null;

    if (targetPath === pathname) {
      e.preventDefault();
      scrollToTop();
      if (hash) {
        document.getElementById(hash)?.scrollIntoView({ block: "start" });
      }
    }
  };

  return (
    <Link
      href={resolvedHref}
      prefetch={homeLink ? true : undefined}
      scroll={!homeLink}
      onClick={handleClick}
      className={className}
    >
      <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
      {label}
    </Link>
  );
}
