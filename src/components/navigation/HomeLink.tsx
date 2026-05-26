"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps } from "react";
import { HOME_HREF, scrollToHome } from "@/lib/navigation/scroll";

type HomeLinkProps = Omit<ComponentProps<typeof Link>, "href"> & {
  href?: string;
};

export default function HomeLink({
  href = HOME_HREF,
  onClick,
  scroll = false,
  ...props
}: HomeLinkProps) {
  const pathname = usePathname();

  return (
    <Link
      href={href}
      prefetch
      scroll={scroll}
      {...props}
      onClick={(e) => {
        if (pathname === "/") {
          e.preventDefault();
          scrollToHome();
        }
        onClick?.(e);
      }}
    />
  );
}
