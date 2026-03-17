export function smoothScrollTo(hash: string) {
  const lenis = (window as Window & { __lenis?: { scrollTo: (target: string | HTMLElement, opts?: Record<string, unknown>) => void } }).__lenis;

  if (lenis) {
    lenis.scrollTo(hash, {
      offset: 0,
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
  } else {
    document.querySelector(hash)?.scrollIntoView({ behavior: "smooth" });
  }
}
