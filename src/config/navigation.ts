export type NavItemId =
  | "home"
  | "projects"
  | "experiments"
  | "case-studies"
  | "process"
  | "about"
  | "contact";

export interface NavItem {
  id: NavItemId;
  label: string;
  href: string;
  /** Homepage scroll-spy section; omit on route-only links */
  sectionId?: string;
}

/** Central nav registry — add items here to scale the dock. */
export const NAV_ITEMS: NavItem[] = [
  { id: "home", label: "Home", href: "/#home", sectionId: "home" },
  { id: "projects", label: "Projects", href: "/projects", sectionId: "projects" },
  {
    id: "experiments",
    label: "Experiments",
    href: "/projects/videos",
    sectionId: "experiments",
  },
  {
    id: "case-studies",
    label: "Case Studies",
    href: "/projects/case-study",
    sectionId: "case-studies",
  },
  {
    id: "process",
    label: "Process",
    href: "/projects/ui-ux-product-design",
    sectionId: "process",
  },
  { id: "about", label: "About", href: "/#about", sectionId: "about" },
  { id: "contact", label: "Contact", href: "/#contact", sectionId: "contact" },
];

export const SECTION_IDS = NAV_ITEMS.map((item) => item.sectionId).filter(
  (id): id is string => Boolean(id)
);
