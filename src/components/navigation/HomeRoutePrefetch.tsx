"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { HOME_HREF } from "@/lib/navigation/scroll";

/**
 * Prefetches the home route (and hero chunk) while browsing project pages.
 */
export default function HomeRoutePrefetch() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (pathname === "/") return;

    router.prefetch(HOME_HREF);

    void import("@/components/ScrollyCanvas");
  }, [pathname, router]);

  return null;
}
