"use client";

import { useEffect, useRef } from "react";

export default function MagneticCursor() {
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mouseX = -100, mouseY = -100;
    let ringX  = -100, ringY  = -100;
    let raf: number;

    const lerp = (a: number, b: number, n: number) => a + (b - a) * n;

    const move = (e: MouseEvent) => { mouseX = e.clientX; mouseY = e.clientY; };
    window.addEventListener("mousemove", move);

    const loop = () => {
      ringX = lerp(ringX, mouseX, 0.12);
      ringY = lerp(ringY, mouseY, 0.12);

      if (dotRef.current) {
        dotRef.current.style.transform =
          `translate(${mouseX - 4}px,${mouseY - 4}px)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform =
          `translate(${ringX - 20}px,${ringY - 20}px)`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    // Hover state
    const addHover = (el: Element) => {
      el.addEventListener("mouseenter", () => ringRef.current?.classList.add("hovering"));
      el.addEventListener("mouseleave", () => ringRef.current?.classList.remove("hovering"));
    };

    // Dark section detection
    const onScroll = () => {
      const darkSections = document.querySelectorAll("[data-dark]");
      let onDark = false;
      darkSections.forEach((sec) => {
        const rect = sec.getBoundingClientRect();
        if (rect.top < window.innerHeight / 2 && rect.bottom > window.innerHeight / 2) {
          onDark = true;
        }
      });
      dotRef.current?.classList.toggle("on-dark", onDark);
      ringRef.current?.classList.toggle("on-dark", onDark);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    // Initial hover bindings
    const bindAll = () => {
      document.querySelectorAll("a, button, [data-hover]").forEach(addHover);
    };
    bindAll();
    const observer = new MutationObserver(bindAll);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", move);
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <div ref={dotRef}  className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
    </>
  );
}
