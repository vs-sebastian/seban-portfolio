export const cinematicEase = [0.22, 1, 0.36, 1] as [number, number, number, number];

export const springSoft = {
  type: "spring" as const,
  stiffness: 260,
  damping: 32,
};

export const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: cinematicEase },
};
