/** Canonical home URL — matches nav config and scroll target. */
export const HOME_HREF = "/#home";

export function isHomeHref(href: string): boolean {
  const trimmed = href.trim();
  if (trimmed === "/" || trimmed === "/#home" || trimmed === "#home") return true;
  try {
    const url = new URL(trimmed, "http://local");
    return url.pathname === "/" && (!url.hash || url.hash === "#home");
  } catch {
    return false;
  }
}

function withInstantScroll(fn: () => void): void {
  const html = document.documentElement;
  const prev = html.style.scrollBehavior;
  html.style.scrollBehavior = "auto";
  fn();
  requestAnimationFrame(() => {
    html.style.scrollBehavior = prev;
  });
}

export function scrollToTop(): void {
  withInstantScroll(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  });
}

/**
 * Scroll to the cinematic hero (#home). Retries while the homepage mounts.
 */
export function scrollToHome(): void {
  const run = () => {
    withInstantScroll(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      document.getElementById("home")?.scrollIntoView({ block: "start" });
    });
  };

  run();
  if (!document.getElementById("home")) {
    for (const delay of [50, 150, 400]) {
      window.setTimeout(run, delay);
    }
  }
}

export function applyRouteScroll(pathname: string): void {
  if (pathname === "/") {
    const hash = window.location.hash.slice(1);
    if (hash && hash !== "home") {
      withInstantScroll(() => {
        document.getElementById(hash)?.scrollIntoView({ block: "start" });
      });
    } else {
      scrollToHome();
    }
    return;
  }

  scrollToTop();
}
