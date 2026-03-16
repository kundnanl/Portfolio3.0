"use client";

import { useEffect, useRef, useState } from "react";

export default function CustomScrollbar() {
  const thumbRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const startY    = useRef(0);
  const startScroll = useRef(0);

  useEffect(() => {
    const update = () => {
      const t = thumbRef.current;
      if (!t) return;
      const dh = document.documentElement.scrollHeight;
      const wh = window.innerHeight;
      const sy = window.scrollY;
      const ratio = wh / dh;
      const th = Math.max(ratio * wh, 48);
      const ty = (sy / (dh - wh)) * (wh - th);
      t.style.height = `${th}px`;
      t.style.top    = `${ty}px`;
    };
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
    return () => { window.removeEventListener("scroll", update); window.removeEventListener("resize", update); };
  }, []);

  useEffect(() => {
    if (!dragging) return;
    const onMove = (e: MouseEvent) => {
      const t   = thumbRef.current;
      if (!t) return;
      const dh  = document.documentElement.scrollHeight;
      const wh  = window.innerHeight;
      const th  = t.offsetHeight;
      const delta = e.clientY - startY.current;
      window.scrollTo({ top: startScroll.current + (delta / (wh - th)) * (dh - wh) });
    };
    const onUp = () => setDragging(false);
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup",   onUp);
    return () => { document.removeEventListener("mousemove", onMove); document.removeEventListener("mouseup", onUp); };
  }, [dragging]);

  return (
    <div className="scrollbar-track">
      <div
        ref={thumbRef}
        className={`scrollbar-thumb${dragging ? " dragging" : ""}`}
        onMouseDown={(e) => {
          setDragging(true);
          startY.current     = e.clientY;
          startScroll.current = window.scrollY;
          e.preventDefault();
        }}
      />
    </div>
  );
}
