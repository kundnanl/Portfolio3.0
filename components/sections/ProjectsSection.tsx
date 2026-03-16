"use client";

import { useRef, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { projects } from "@/data/portfolio";

gsap.registerPlugin(ScrollTrigger);

// Assign a background image to each project card (pair rotated)
const cardImages = [
  "/images/proj-workspace.jpg",
  "/images/proj-tech.jpg",
  "/images/proj-workspace.jpg",
  "/images/proj-tech.jpg",
];

/* ── Single stacking project card ────────────────────────── */
function ProjectCard({
  project,
  index,
}: {
  project: (typeof projects)[0];
  index: number;
}) {
  const cardRef  = useRef<HTMLDivElement>(null);
  const lineRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Parallax on the background image as card scrolls through view
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });
  const bgY     = useSpring(useTransform(scrollYProgress, [0, 1], ["-14%", "14%"]), { stiffness: 55, damping: 20 });
  const bgScale = useSpring(useTransform(scrollYProgress, [0, 1], [1.22, 1.0]),     { stiffness: 55, damping: 20 });

  // Animate content + progress lines when card is at the top
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    ScrollTrigger.create({
      trigger: card,
      start: "top 20%",
      onEnter: () => {
        lineRefs.current.forEach((el, i) => {
          if (!el) return;
          gsap.to(el, { width: "100%", duration: 0.65, delay: i * 0.08, ease: "power2.out" });
        });
      },
      onLeaveBack: () => {
        lineRefs.current.forEach((el) => {
          if (el) gsap.set(el, { width: "0%" });
        });
      },
    });
  }, []);

  return (
    <div
      ref={cardRef}
      data-dark="true"
      style={{
        position: "sticky",
        top: 0,
        height: "100svh",
        zIndex: index + 2,     // each card on top of previous
        overflow: "hidden",
        borderRadius: "3.2rem",
        marginBottom: 0,
      }}
    >
      {/* ── Parallax background image ──────────────────── */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", borderRadius: "3.2rem" }}>
        <motion.div
          style={{ position: "absolute", inset: "-15%", y: bgY, scale: bgScale }}
        >
          <Image
            src={cardImages[index % cardImages.length]}
            alt={project.title}
            fill
            sizes="100vw"
            style={{ objectFit: "cover" }}
            priority={index === 0}
          />
        </motion.div>
        {/* Colour tint */}
        <div style={{
          position: "absolute", inset: 0,
          background: project.themeColor,
          opacity: 0.72,
        }} />
        {/* Gradient for readability */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.3) 55%, rgba(0,0,0,0.08) 100%)",
        }} />
      </div>

      {/* ── Content ────────────────────────────────────── */}
      <div style={{
        position: "relative", zIndex: 1,
        height: "100%", display: "flex", flexDirection: "column",
        justifyContent: "flex-end", padding: "5.6rem",
      }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(8,1fr)", columnGap: "1.2rem", alignItems: "flex-end" }}>

          {/* Left: meta + title + desc */}
          <motion.div
            style={{ gridColumn: "span 4" }}
            initial={{ opacity: 0, y: 50, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-15%" }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <span style={{
              display: "block", marginBottom: "1.6rem",
              fontFamily: "DM Mono, monospace", fontSize: "1.2rem",
              letterSpacing: "0.06em", textTransform: "uppercase",
              color: "rgba(255,255,255,0.45)",
            }}>
              {String(index + 1).padStart(2, "0")} — {project.year} · {project.type}
            </span>

            <h2 style={{
              fontFamily: "Yatra One, serif",
              fontSize: "var(--h2)",
              letterSpacing: "-0.04em",
              lineHeight: 1,
              color: "white",
            }}>
              {project.title}
            </h2>

            <p style={{
              fontFamily: "Manrope, sans-serif", fontSize: "1.5rem",
              color: "rgba(255,255,255,0.6)", maxWidth: "480px",
              lineHeight: 1.7, marginTop: "1.6rem",
            }}>
              {project.description}
            </p>

            <div style={{ marginTop: "2.8rem" }}>
              <span className="ext-link">
                <span className="br l">[</span>
                View Case Study
                <span className="br r">→]</span>
              </span>
            </div>
          </motion.div>

          {/* Right: tech tags + progress bars */}
          <motion.div
            style={{ gridColumn: "span 4", paddingLeft: "4.8rem" }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15%" }}
            transition={{ duration: 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
              {project.tech.map((t, i) => (
                <div key={t}>
                  <span style={{
                    fontFamily: "DM Mono, monospace", fontSize: "1.3rem",
                    letterSpacing: "0.04em", textTransform: "uppercase",
                    color: "rgba(255,255,255,0.6)",
                  }}>{t}</span>
                  <div style={{
                    height: "1px", background: "rgba(255,255,255,0.18)",
                    marginTop: "0.5rem", position: "relative", overflow: "hidden",
                  }}>
                    <div
                      ref={(el) => { lineRefs.current[i] = el; }}
                      style={{
                        position: "absolute", inset: 0,
                        background: "rgba(255,255,255,0.7)",
                        width: "0%",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Card number badge */}
            <div style={{
              marginTop: "4.8rem",
              width: "6.4rem", height: "6.4rem",
              borderRadius: "50%",
              border: "1px solid rgba(255,255,255,0.25)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "Yatra One, serif", fontSize: "2.4rem",
              color: "white",
            }}>
              {String(index + 1).padStart(2, "0")}
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}

/* ── Section ──────────────────────────────────────────────── */
export default function ProjectsSection() {
  return (
    <section
      id="projects"
      style={{ background: "var(--ink)", position: "relative", zIndex: 10 }}
    >
      {/* Section header — sticks at very top */}
      <div style={{
        position: "sticky", top: 0, zIndex: 1,
        padding: "2.4rem 4.8rem",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        background: "linear-gradient(to bottom, rgba(26,22,18,0.95) 0%, transparent 100%)",
      }}>
        <span className="section-label" style={{ color: "rgba(255,255,255,0.5)" }}>
          Selected Work
        </span>
        <span className="section-label" style={{ color: "rgba(255,255,255,0.5)" }}>
          {projects.length} Projects
        </span>
      </div>

      {/* Stacking sticky cards */}
      <div style={{ position: "relative" }}>
        {projects.map((p, i) => (
          <ProjectCard key={p.id} project={p} index={i} />
        ))}
      </div>
    </section>
  );
}
