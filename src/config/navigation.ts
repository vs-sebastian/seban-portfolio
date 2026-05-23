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
  sectionId: string;
}

/** Central nav registry — add items here to scale the dock. */
export const NAV_ITEMS: NavItem[] = [
  { id: "home", label: "Home", href: "#home", sectionId: "home" },
  { id: "projects", label: "Projects", href: "#projects", sectionId: "projects" },
  { id: "experiments", label: "Experiments", href: "#experiments", sectionId: "experiments" },
  { id: "case-studies", label: "Case Studies", href: "#case-studies", sectionId: "case-studies" },
  { id: "process", label: "Process", href: "#process", sectionId: "process" },
  { id: "about", label: "About", href: "#about", sectionId: "about" },
  { id: "contact", label: "Contact", href: "#contact", sectionId: "contact" },
];

export const SECTION_IDS = NAV_ITEMS.map((item) => item.sectionId);
