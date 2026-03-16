"use client";

import { useEffect, useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

const TICKER = [
  "Data Engineer","RBC","Toronto",
  "Apache Spark","Kafka","Snowflake","dbt",
  "Sheridan College","Python","Airflow",
  "Delta Lake","AWS","Real-time Streams",
];

export default function HeroSection() {
  const sectionRef  = useRef<HTMLElement>(null);
  const innerRef    = useRef<HTMLDivElement>(null);
  const leftRef     = useRef<HTMLDivElement>(null);
  const rightRef    = useRef<HTMLDivElement>(null);
  const labelRef    = useRef<HTMLDivElement>(null);
  const marqueeRef  = useRef<HTMLDivElement>(null);
  const photoColRef = useRef<HTMLDivElement>(null);
  const photoInRef  = useRef<HTMLDivElement>(null);

  // ── mouse-steered text shadow ─────────────────────────────
  useEffect(() => {
    const inner = innerRef.current;   // sticky viewport div — always 100svh
    const left  = leftRef.current;
    const right = rightRef.current;
    if (!inner || !left || !right) return;

    const onMove = (e: MouseEvent) => {
      const r  = inner.getBoundingClientRect();
      const dx = (e.clientX - r.left - r.width  / 2) / r.width;
      const dy = (e.clientY - r.top  - r.height / 2) / r.height;
      const shadow = Array.from({ length: 20 }, (_, i) => {
        const n = i + 1;
        return `${dx * n * 2.5}px ${dy * n * 2.5}px 0 #ebda28`;
      }).join(", ");
      left.style.textShadow  = shadow;
      right.style.textShadow = shadow;
    };

    const onLeave = () => {
      const shadow = Array.from({ length: 20 }, (_, i) => {
        const n = i + 1;
        return `${n}px ${n}px 0 #ebda28`;
      }).join(", ");
      left.style.textShadow  = shadow;
      right.style.textShadow = shadow;
    };

    inner.addEventListener("mousemove",  onMove);
    inner.addEventListener("mouseleave", onLeave);
    return () => {
      inner.removeEventListener("mousemove",  onMove);
      inner.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  // ── entrance animation ────────────────────────────────────
  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.4 });
    tl.to(labelRef.current,   { opacity: 0.7, filter: "blur(0px)", duration: 0.9, ease: "power4.out" })
      .to(leftRef.current,    { opacity: 1,   filter: "blur(0px)", duration: 1.0, ease: "power4.out" }, "-=0.5")
      .to(rightRef.current,   { opacity: 1,   filter: "blur(0px)", duration: 1.0, ease: "power4.out" }, "-=0.75")
      .to(photoInRef.current, { opacity: 1,   filter: "blur(0px)", scale: 1, duration: 1.1, ease: "power3.out" }, "-=0.8");
  }, []);

  // ── scroll: photo expansion (no GSAP pin — section is 200svh) ────
  useLayoutEffect(() => {
    const section  = sectionRef.current;
    const photoIn  = photoInRef.current;
    const photoCol = photoColRef.current;
    const inner    = innerRef.current;
    if (!section || !photoIn || !photoCol || !inner) return;

    const ctx = gsap.context(() => {
      const init = () => {
        const rect = photoIn.getBoundingClientRect();
        if (rect.width === 0) return;

        const scaleTarget = Math.max(
          window.innerWidth  / rect.width,
          window.innerHeight / rect.height,
        ) * 1.02;

        const tx = -(rect.left + rect.width  / 2 - window.innerWidth  / 2);
        const ty = -(rect.top  + rect.height / 2 - window.innerHeight / 2);

        // Allow photo to expand beyond column
        photoCol.style.overflow = "visible";
        // Allow photo to expand beyond inner viewport container
        inner.style.overflow = "visible";

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=100%",      // 100svh of scroll (section is 200svh tall)
            scrub: 1.4,
          },
        });

        tl
          // 1. fade words + labels
          .to([leftRef.current, rightRef.current], {
            opacity: 0, y: -30, duration: 0.35, ease: "power2.in",
          }, 0)
          .to([labelRef.current, marqueeRef.current], {
            opacity: 0, duration: 0.25,
          }, 0)
          // 2. expand photo to fill screen
          .to(photoIn, {
            scale: scaleTarget,
            x: tx,
            y: ty,
            borderRadius: 0,
            duration: 0.8,
            ease: "power2.inOut",
          }, 0.05);
      };

      requestAnimationFrame(() => requestAnimationFrame(init));
    }, section);

    return () => ctx.revert();
  }, []);

  const doubled = [...TICKER, ...TICKER];

  return (
    // 200svh: first 100svh is sticky viewport, second 100svh is the scroll distance for the expansion
    <section
      ref={sectionRef}
      id="hero"
      className="hero"
      style={{ height: "200svh" }}
    >
      {/* Sticky viewport container */}
      <div
        ref={innerRef}
        style={{
          position: "sticky",
          top: 0,
          height: "100svh",
          overflow: "hidden",
          background: "var(--cream)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          paddingBottom: "4.8rem",
        }}
      >
        {/* Grain */}
        <div className="hero-grain" />

        {/* Label */}
        <div
          ref={labelRef}
          className="hero-label-wrap"
          style={{ opacity: 0, filter: "blur(8px)" }}
        >
          <p className="hero-label">
            Data Engineer · Royal Bank of Canada<br />
            Sheridan College · Toronto, Canada
          </p>
        </div>

        {/* Title grid */}
        <div className="hero-grid" style={{ overflow: "visible" }}>
          {/* DATA */}
          <div
            ref={leftRef}
            className="hero-word left"
            style={{ opacity: 0, filter: "blur(16px)" }}
          >
            DATA
          </div>

          {/* Photo column */}
          <div ref={photoColRef} className="hero-photo-col">
            <div
              ref={photoInRef}
              className="hero-photo-inner"
              style={{
                opacity: 0, filter: "blur(12px)", transform: "scale(0.9)",
                borderRadius: "3.2rem", overflow: "hidden",
                position: "relative", zIndex: 10,
              }}
            >
              <Image
                src="/images/hero.jpg"
                alt="Laksh — Data Engineer"
                width={440}
                height={586}
                className="hero-photo-img"
                priority
                style={{ borderRadius: "3.2rem", display: "block", width: "100%", height: "auto" }}
              />
            </div>
          </div>

          {/* ENG. */}
          <div
            ref={rightRef}
            className="hero-word right"
            style={{ opacity: 0, filter: "blur(16px)" }}
          >
            ENG.
          </div>
        </div>

        {/* Marquee */}
        <div ref={marqueeRef} className="marquee-strip">
          <div className="marquee-track">
            {doubled.map((item, i) => (
              <span key={i} className="marquee-item">
                {item}
                {i < doubled.length - 1 && <span className="marquee-dot" />}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
