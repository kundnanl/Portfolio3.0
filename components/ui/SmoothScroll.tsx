"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // 1. Prevent browser from restoring old scroll position
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }

    // 2. Force scroll to top before Lenis takes over
    window.scrollTo(0, 0);

    const lenis = new Lenis({
      lerp: 0.08,
      smoothWheel: true,
      syncTouch: false,
    });

    // 3. Tell Lenis to start at position 0
    lenis.scrollTo(0, { immediate: true });

    const onScroll = () => ScrollTrigger.update();
    lenis.on("scroll", onScroll);

    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    (window as Window & { __lenis?: Lenis }).__lenis = lenis;

    // 4. Recalculate ScrollTrigger after layout settles
    const timeout = setTimeout(() => {
      ScrollTrigger.refresh(true);
    }, 150);

    return () => {
      clearTimeout(timeout);
      lenis.off("scroll", onScroll);
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}