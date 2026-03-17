"use client";

import { useRef, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
} from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { projects } from "@/data/portfolio";

gsap.registerPlugin(ScrollTrigger);

function BrowserMockup({
  src,
  themeColor,
  style,
}: {
  src: string;
  themeColor: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        borderRadius: "1.6rem",
        overflow: "hidden",
        boxShadow:
          "0 0 0 1px rgba(255,255,255,0.06), 0 40px 100px rgba(0,0,0,0.5), 0 12px 32px rgba(0,0,0,0.35)",
        background: "#0d0d0d",
        ...style,
      }}
    >
      {/* Browser chrome */}
      <div
        style={{
          height: "3.6rem",
          background: "rgba(255,255,255,0.03)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          alignItems: "center",
          padding: "0 1.6rem",
          gap: "0.7rem",
          flexShrink: 0,
        }}
      >
        {["#FF5F57", "#FEBC2E", "#28C840"].map((c, i) => (
          <span
            key={i}
            style={{
              width: "1rem",
              height: "1rem",
              borderRadius: "50%",
              background: c,
              opacity: 0.8,
              flexShrink: 0,
            }}
          />
        ))}
        <div
          style={{
            flex: 1,
            height: "2rem",
            background: "rgba(255,255,255,0.04)",
            borderRadius: "0.6rem",
            margin: "0 1rem",
            display: "flex",
            alignItems: "center",
            paddingLeft: "1rem",
            gap: "0.5rem",
          }}
        >
          <span
            style={{
              width: "0.6rem",
              height: "0.6rem",
              borderRadius: "50%",
              background: themeColor,
              opacity: 0.7,
            }}
          />
          <span
            style={{
              fontFamily: "DM Mono, monospace",
              fontSize: "0.95rem",
              color: "rgba(255,255,255,0.25)",
              letterSpacing: "0.02em",
            }}
          >
            localhost:3000
          </span>
        </div>
      </div>

      {/* Screenshot */}
      <div style={{ position: "relative", aspectRatio: "16/10", overflow: "hidden" }}>
        <Image
          src={src}
          alt="Project screenshot"
          fill
          sizes="(max-width: 768px) 90vw, 55vw"
          style={{ objectFit: "cover", objectPosition: "top" }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 40%)",
            pointerEvents: "none",
          }}
        />
      </div>
    </div>
  );
}

function ProjectCard({
  project,
  index,
}: {
  project: (typeof projects)[0];
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const mockupRef = useRef<HTMLDivElement>(null);

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const glareX = useMotionValue(50);
  const glareY = useMotionValue(50);

  const springRX = useSpring(rotateX, { stiffness: 100, damping: 20 });
  const springRY = useSpring(rotateY, { stiffness: 100, damping: 20 });

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });

  const bgY = useSpring(useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]), {
    stiffness: 50,
    damping: 20,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = mockupRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    rotateY.set((px - 0.5) * 12);
    rotateX.set((py - 0.5) * -12);
    glareX.set(px * 100);
    glareY.set(py * 100);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    glareX.set(50);
    glareY.set(50);
  };

  const projectImage = project.images?.[0] ?? "/images/project-1.jpg";
  const isEven = index % 2 === 1;

  return (
    <div
      ref={cardRef}
      data-dark="true"
      style={{
        position: "sticky",
        top: 0,
        height: "100svh",
        zIndex: index + 2,
        overflow: "hidden",
        borderRadius: "2.4rem 2.4rem 0 0",
      }}
    >
      {/* Background */}
      <motion.div
        style={{
          position: "absolute",
          inset: 0,
          y: bgY,
          transformOrigin: "center",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(ellipse at ${isEven ? "25%" : "75%"} 35%, ${project.themeColor}44 0%, #0a0a0a 60%)`,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.03,
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
            backgroundSize: "256px",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.1) 60%, transparent 100%)",
          }}
        />
      </motion.div>

      {/* Content grid */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          height: "100%",
          display: "grid",
          gridTemplateColumns: isEven ? "1fr 1.15fr" : "1.15fr 1fr",
          padding: "0 5.6rem",
          gap: "5rem",
          alignItems: "center",
        }}
      >
        {/* Text side */}
        <motion.div
          style={{ order: isEven ? 2 : 1 }}
          initial={{ opacity: 0, y: 48, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1.2rem",
              marginBottom: "3.2rem",
            }}
          >
            <span
              style={{
                fontFamily: "DM Mono, monospace",
                fontSize: "1.1rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: project.themeColor,
              }}
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            <span
              style={{ width: "3.2rem", height: "1px", background: `${project.themeColor}60` }}
            />
            <span
              style={{
                fontFamily: "DM Mono, monospace",
                fontSize: "1.1rem",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.3)",
              }}
            >
              {project.year} · {project.type}
            </span>
          </div>

          <h2
            style={{
              fontFamily: "Yatra One, serif",
              fontSize: "clamp(4rem, 5.5vw, 7rem)",
              letterSpacing: "-0.04em",
              lineHeight: 0.96,
              color: "white",
              marginBottom: "2.4rem",
            }}
          >
            {project.title}
          </h2>

          <p
            style={{
              fontFamily: "Manrope, sans-serif",
              fontSize: "1.5rem",
              color: "rgba(255,255,255,0.48)",
              maxWidth: "40rem",
              lineHeight: 1.75,
              marginBottom: "3.6rem",
            }}
          >
            {project.description}
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.8rem" }}>
            {project.tech.map((t) => (
              <span
                key={t}
                style={{
                  fontFamily: "DM Mono, monospace",
                  fontSize: "1.1rem",
                  letterSpacing: "0.04em",
                  color: "rgba(255,255,255,0.5)",
                  padding: "0.6rem 1.4rem",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "10rem",
                  background: "rgba(255,255,255,0.03)",
                }}
              >
                {t}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Mockup side */}
        <motion.div style={{ order: isEven ? 1 : 2, perspective: "1200px" }}>
          <div
            ref={mockupRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
              position: "relative",
              transformStyle: "preserve-3d",
            }}
          >
            <motion.div
              style={{
                rotateX: springRX,
                rotateY: springRY,
                transformStyle: "preserve-3d",
                willChange: "transform",
              }}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <BrowserMockup src={projectImage} themeColor={project.themeColor} />

              <motion.div
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: "1.6rem",
                  pointerEvents: "none",
                  background: useTransform(
                    [glareX, glareY],
                    ([x, y]) =>
                      `radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255,0.14), transparent 30%)`
                  ),
                }}
              />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function ProjectsSection() {
  return (
    <section
      id="projects"
      style={{
        background: "#080808",
        position: "relative",
        zIndex: 10,
        paddingBottom: 0,
        marginBottom: 0,
      }}
    >
      {/* Section header */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1,
          padding: "2.8rem 5.6rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "linear-gradient(to bottom, rgba(8,8,8,0.96) 0%, transparent 100%)",
          pointerEvents: "none",
        }}
      >
        <span className="section-label" style={{ color: "rgba(255,255,255,0.35)" }}>
          Selected Work
        </span>
        <span className="section-label" style={{ color: "rgba(255,255,255,0.35)" }}>
          {projects.length} Projects
        </span>
      </div>

      <div style={{ position: "relative" }}>
        {projects.map((p, i) => (
          <ProjectCard key={p.id} project={p} index={i} />
        ))}
      </div>
    </section>
  );
}