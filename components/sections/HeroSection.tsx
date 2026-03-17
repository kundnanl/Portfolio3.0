"use client";

import { useEffect, useRef, useLayoutEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { smoothScrollTo } from "@/utils/smoothNav";

gsap.registerPlugin(ScrollTrigger);

/* ── floating SVG objects representing data engineering ───── */
function DatabaseIcon({ size = 80, color = "#ebda28", style }: { size?: number; color?: string; style?: React.CSSProperties }) {
  return (
    <svg width={size} height={size * 1.2} viewBox="0 0 80 96" fill="none" style={style}>
      <ellipse cx="40" cy="16" rx="36" ry="14" stroke={color} strokeWidth="2" fill="none" />
      <path d={`M4 16 v64 c0 7.7 16.1 14 36 14 s36-6.3 36-14 V16`} stroke={color} strokeWidth="2" fill="none" />
      <ellipse cx="40" cy="48" rx="36" ry="14" stroke={color} strokeWidth="1" opacity="0.4" fill="none" />
      <ellipse cx="40" cy="80" rx="36" ry="14" stroke={color} strokeWidth="1" opacity="0.4" fill="none" />
    </svg>
  );
}

function PipelineArrow({ size = 120, color = "#ebda28", style }: { size?: number; color?: string; style?: React.CSSProperties }) {
  return (
    <svg width={size} height={size * 0.35} viewBox="0 0 120 42" fill="none" style={style}>
      <line x1="0" y1="21" x2="90" y2="21" stroke={color} strokeWidth="2" strokeDasharray="6 4" />
      <polygon points="88,12 108,21 88,30" stroke={color} strokeWidth="2" fill="none" />
      <circle cx="12" cy="21" r="6" stroke={color} strokeWidth="1.5" fill="none" />
      <circle cx="45" cy="21" r="4" stroke={color} strokeWidth="1" opacity="0.5" fill={color} fillOpacity="0.15" />
    </svg>
  );
}

function StreamBlock({ size = 60, color = "#ebda28", style }: { size?: number; color?: string; style?: React.CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none" style={style}>
      <rect x="4" y="4" width="52" height="52" rx="6" stroke={color} strokeWidth="2" fill="none" />
      <line x1="16" y1="18" x2="44" y2="18" stroke={color} strokeWidth="1.5" opacity="0.6" />
      <line x1="16" y1="26" x2="36" y2="26" stroke={color} strokeWidth="1.5" opacity="0.4" />
      <line x1="16" y1="34" x2="40" y2="34" stroke={color} strokeWidth="1.5" opacity="0.3" />
      <line x1="16" y1="42" x2="30" y2="42" stroke={color} strokeWidth="1.5" opacity="0.2" />
    </svg>
  );
}

function CloudNode({ size = 70, color = "#ebda28", style }: { size?: number; color?: string; style?: React.CSSProperties }) {
  return (
    <svg width={size} height={size * 0.7} viewBox="0 0 70 49" fill="none" style={style}>
      <path d="M56 42H18c-7.7 0-14-6.3-14-14 0-6.5 4.4-12 10.5-13.5C16.2 6.2 23.5 1 32 1c10.5 0 19.2 7.5 21 17.3C59.5 19.8 64 25 64 31.5 64 37.3 60.4 42 56 42z" stroke={color} strokeWidth="2" fill="none" />
    </svg>
  );
}

function KafkaStream({ size = 90, color = "#ebda28", style }: { size?: number; color?: string; style?: React.CSSProperties }) {
  return (
    <svg width={size} height={size * 0.5} viewBox="0 0 90 45" fill="none" style={style}>
      <path d="M5 22.5 Q22 5, 45 22.5 Q68 40, 85 22.5" stroke={color} strokeWidth="2" fill="none" />
      <path d="M5 30 Q22 12.5, 45 30 Q68 47.5, 85 30" stroke={color} strokeWidth="1" opacity="0.3" fill="none" />
      <path d="M5 15 Q22 -2.5, 45 15 Q68 32.5, 85 15" stroke={color} strokeWidth="1" opacity="0.3" fill="none" />
      <circle cx="45" cy="22.5" r="4" fill={color} fillOpacity="0.3" stroke={color} strokeWidth="1" />
    </svg>
  );
}

function SparkNode({ size = 50, color = "#ebda28", style }: { size?: number; color?: string; style?: React.CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 50 50" fill="none" style={style}>
      <polygon points="25,2 31,18 48,18 34,29 39,46 25,36 11,46 16,29 2,18 19,18" stroke={color} strokeWidth="1.5" fill="none" />
      <circle cx="25" cy="25" r="6" stroke={color} strokeWidth="1" opacity="0.5" fill={color} fillOpacity="0.1" />
    </svg>
  );
}

function BracketLeft({ size = 100, color = "#ebda28", style }: { size?: number; color?: string; style?: React.CSSProperties }) {
  return (
    <svg width={size * 0.4} height={size} viewBox="0 0 40 100" fill="none" style={style}>
      <path d="M35 5 Q10 5, 10 25 L10 42 Q10 50, 5 50 Q10 50, 10 58 L10 75 Q10 95, 35 95" stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function BracketRight({ size = 100, color = "#ebda28", style }: { size?: number; color?: string; style?: React.CSSProperties }) {
  return (
    <svg width={size * 0.4} height={size} viewBox="0 0 40 100" fill="none" style={style}>
      <path d="M5 5 Q30 5, 30 25 L30 42 Q30 50, 35 50 Q30 50, 30 58 L30 75 Q30 95, 5 95" stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </svg>
  );
}

/* ── floating object config ──────────────────────────────── */
interface FloatingObj {
  id: string;
  component: "database" | "pipeline" | "stream" | "cloud" | "kafka" | "spark" | "bracketL" | "bracketR";
  x: string;       // CSS left %
  y: string;       // CSS top %
  size: number;
  speed: number;    // parallax multiplier
  rotate: number;   // initial rotation
  opacity: number;
  color: string;
  delay: number;    // entrance delay
}

const OBJECTS: FloatingObj[] = [
  { id: "db1",  component: "database",  x: "8%",  y: "15%", size: 70, speed: 1.8, rotate: -8,  opacity: 0.6, color: "#ebda28", delay: 0.6 },
  { id: "db2",  component: "database",  x: "85%", y: "60%", size: 55, speed: 1.2, rotate: 12,  opacity: 0.35, color: "#D4A853", delay: 1.2 },
  { id: "p1",   component: "pipeline",  x: "65%", y: "12%", size: 130,speed: 2.0, rotate: -5,  opacity: 0.45, color: "#ebda28", delay: 0.8 },
  { id: "p2",   component: "pipeline",  x: "5%",  y: "72%", size: 100,speed: 1.4, rotate: 15,  opacity: 0.3, color: "#D4A853", delay: 1.4 },
  { id: "s1",   component: "stream",    x: "78%", y: "25%", size: 50, speed: 2.2, rotate: 6,   opacity: 0.5, color: "#ebda28", delay: 0.5 },
  { id: "s2",   component: "stream",    x: "20%", y: "65%", size: 45, speed: 1.6, rotate: -12, opacity: 0.3, color: "#ebda28", delay: 1.0 },
  { id: "c1",   component: "cloud",     x: "50%", y: "8%",  size: 80, speed: 1.0, rotate: 0,   opacity: 0.25, color: "#D4A853", delay: 1.5 },
  { id: "k1",   component: "kafka",     x: "30%", y: "78%", size: 100,speed: 1.8, rotate: 3,   opacity: 0.4, color: "#ebda28", delay: 0.7 },
  { id: "sp1",  component: "spark",     x: "90%", y: "40%", size: 45, speed: 2.5, rotate: 20,  opacity: 0.35, color: "#ebda28", delay: 0.9 },
  { id: "sp2",  component: "spark",     x: "15%", y: "40%", size: 35, speed: 2.0, rotate: -15, opacity: 0.25, color: "#D4A853", delay: 1.3 },
  { id: "bl",   component: "bracketL",  x: "3%",  y: "35%", size: 120,speed: 1.5, rotate: 0,   opacity: 0.2, color: "#ebda28", delay: 1.6 },
  { id: "br",   component: "bracketR",  x: "93%", y: "30%", size: 120,speed: 1.5, rotate: 0,   opacity: 0.2, color: "#ebda28", delay: 1.6 },
];

function FloatingObject({ obj }: { obj: FloatingObj }) {
  const svgStyle: React.CSSProperties = { display: "block" };
  switch (obj.component) {
    case "database":  return <DatabaseIcon size={obj.size} color={obj.color} style={svgStyle} />;
    case "pipeline":  return <PipelineArrow size={obj.size} color={obj.color} style={svgStyle} />;
    case "stream":    return <StreamBlock size={obj.size} color={obj.color} style={svgStyle} />;
    case "cloud":     return <CloudNode size={obj.size} color={obj.color} style={svgStyle} />;
    case "kafka":     return <KafkaStream size={obj.size} color={obj.color} style={svgStyle} />;
    case "spark":     return <SparkNode size={obj.size} color={obj.color} style={svgStyle} />;
    case "bracketL":  return <BracketLeft size={obj.size} color={obj.color} style={svgStyle} />;
    case "bracketR":  return <BracketRight size={obj.size} color={obj.color} style={svgStyle} />;
  }
}

/* ── status ticker lines ─────────────────────────────────── */
const STATUS_LINES = [
  "▸ pipeline.status: RUNNING",
  "▸ kafka.consumer: 12.4k msg/s",
  "▸ spark.job_0042: COMPLETED",
  "▸ snowflake.wh: ACTIVE",
  "▸ airflow.dag_run: SUCCESS",
  "▸ s3.ingestion: 2.1 GB/min",
  "▸ delta.merge: 847k rows",
  "▸ rbc.batch_etl: ON SCHEDULE",
];

export default function HeroSection() {
  const sectionRef  = useRef<HTMLElement>(null);
  const innerRef    = useRef<HTMLDivElement>(null);
  const titleRef    = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const roleRef     = useRef<HTMLDivElement>(null);
  const ctaRef      = useRef<HTMLDivElement>(null);
  const objectRefs  = useRef<(HTMLDivElement | null)[]>([]);
  const statusRef   = useRef<HTMLDivElement>(null);
  const gridLinesRef = useRef<HTMLDivElement>(null);

  const [statusIdx, setStatusIdx] = useState(0);

  // ── cycle status ticker ───────────────────────────────────
  useEffect(() => {
    const interval = setInterval(() => {
      setStatusIdx((prev) => (prev + 1) % STATUS_LINES.length);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  // ── entrance animation ────────────────────────────────────
  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.3 });

    // grid lines fade in
    if (gridLinesRef.current) {
      tl.to(gridLinesRef.current, { opacity: 1, duration: 1.2, ease: "power2.out" }, 0);
    }

    // title reveal
    if (titleRef.current) {
      const chars = titleRef.current.querySelectorAll(".hero-char");
      tl.to(chars, {
        opacity: 1,
        y: 0,
        rotateX: 0,
        filter: "blur(0px)",
        duration: 0.9,
        stagger: 0.04,
        ease: "power4.out",
      }, 0.4);
    }

    // subtitle
    if (subtitleRef.current) {
      tl.to(subtitleRef.current, {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.8,
        ease: "power3.out",
      }, "-=0.4");
    }

    // role line
    if (roleRef.current) {
      tl.to(roleRef.current, {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.8,
        ease: "power3.out",
      }, "-=0.5");
    }

    // CTA
    if (ctaRef.current) {
      tl.to(ctaRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: "power3.out",
      }, "-=0.3");
    }

    // status ticker
    if (statusRef.current) {
      tl.to(statusRef.current, {
        opacity: 1,
        duration: 0.6,
        ease: "power2.out",
      }, "-=0.4");
    }

    // floating objects
    objectRefs.current.forEach((el, i) => {
      if (!el) return;
      const obj = OBJECTS[i];
      gsap.to(el, {
        opacity: obj.opacity,
        scale: 1,
        filter: "blur(0px)",
        duration: 1.2,
        delay: obj.delay,
        ease: "power3.out",
      });
    });
  }, []);

  // ── parallax on scroll ────────────────────────────────────
  useLayoutEffect(() => {
    const section = sectionRef.current;
    const inner = innerRef.current;
    if (!section || !inner) return;

    const ctx = gsap.context(() => {
      // fade out entire hero
      gsap.to(inner, {
        opacity: 0,
        y: -80,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: 0.6,
        },
      });

      // parallax each floating object
      objectRefs.current.forEach((el, i) => {
        if (!el) return;
        const obj = OBJECTS[i];
        gsap.to(el, {
          y: -120 * obj.speed,
          rotate: obj.rotate + (obj.speed > 1.5 ? 25 : -15),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom top",
            scrub: 0.4,
          },
        });
      });
    }, section);

    return () => ctx.revert();
  }, []);

  // ── mouse parallax on objects ─────────────────────────────
  useEffect(() => {
    const inner = innerRef.current;
    if (!inner) return;

    const onMove = (e: MouseEvent) => {
      const r  = inner.getBoundingClientRect();
      const dx = (e.clientX - r.left - r.width / 2) / r.width;
      const dy = (e.clientY - r.top - r.height / 2) / r.height;

      objectRefs.current.forEach((el, i) => {
        if (!el) return;
        const obj = OBJECTS[i];
        gsap.to(el, {
          x: dx * 30 * obj.speed,
          y: `+=${dy * 8 * obj.speed}`,
          duration: 0.8,
          ease: "power2.out",
          overwrite: "auto",
        });
      });
    };

    inner.addEventListener("mousemove", onMove);
    return () => inner.removeEventListener("mousemove", onMove);
  }, []);

  // split "LAKSH" into individual characters
  const titleText = "LAKSH";
  const titleChars = titleText.split("");

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="hero"
      style={{ height: "100svh" }}
    >
      <div
        ref={innerRef}
        style={{
          height: "100svh",
          overflow: "hidden",
          background: "var(--cream)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
        }}
      >
        {/* Grain */}
        <div className="hero-grain" />

        {/* Subtle grid lines */}
        <div
          ref={gridLinesRef}
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0,
            pointerEvents: "none",
            zIndex: 0,
          }}
        >
          {/* vertical lines */}
          {[20, 40, 60, 80].map((pct) => (
            <div
              key={`v${pct}`}
              style={{
                position: "absolute",
                left: `${pct}%`,
                top: 0,
                bottom: 0,
                width: "1px",
                background: "var(--ink-20)",
                opacity: 0.4,
              }}
            />
          ))}
          {/* horizontal lines */}
          {[25, 50, 75].map((pct) => (
            <div
              key={`h${pct}`}
              style={{
                position: "absolute",
                top: `${pct}%`,
                left: 0,
                right: 0,
                height: "1px",
                background: "var(--ink-20)",
                opacity: 0.4,
              }}
            />
          ))}
        </div>

        {/* Floating data objects */}
        {OBJECTS.map((obj, i) => (
          <div
            key={obj.id}
            ref={(el) => { objectRefs.current[i] = el; }}
            style={{
              position: "absolute",
              left: obj.x,
              top: obj.y,
              transform: `rotate(${obj.rotate}deg)`,
              opacity: 0,
              scale: 0.6,
              filter: "blur(8px)",
              zIndex: 1,
              pointerEvents: "none",
              willChange: "transform, opacity",
            }}
          >
            <FloatingObject obj={obj} />
          </div>
        ))}

        {/* Center content */}
        <div
          style={{
            position: "relative",
            zIndex: 5,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0rem",
          }}
        >
          {/* Role label */}
          <div
            ref={roleRef}
            style={{
              opacity: 0,
              transform: "translateY(20px)",
              filter: "blur(6px)",
              marginBottom: "2rem",
            }}
          >
            <span
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "1.2rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "var(--ink-60)",
                display: "flex",
                alignItems: "center",
                gap: "1.2rem",
              }}
            >
              <span style={{ width: "2.4rem", height: "1px", background: "var(--ink-60)" }} />
              Software & Data Engineer
              <span style={{ width: "2.4rem", height: "1px", background: "var(--ink-60)" }} />
            </span>
          </div>

          {/* Big name */}
          <div
            ref={titleRef}
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: "0.2vw",
              perspective: "600px",
            }}
          >
            {titleChars.map((char, i) => (
              <span
                key={i}
                className="hero-char"
                style={{
                  fontFamily: "'Yatra One', serif",
                  fontSize: "clamp(8rem, 16vw, 22rem)",
                  lineHeight: 0.88,
                  letterSpacing: "-0.03em",
                  color: "var(--ink)",
                  display: "inline-block",
                  opacity: 0,
                  transform: "translateY(60px) rotateX(40deg)",
                  filter: "blur(10px)",
                  textShadow: `
                    1px 1px 0 var(--shadow-color),
                    2px 2px 0 var(--shadow-color),
                    3px 3px 0 var(--shadow-color),
                    4px 4px 0 var(--shadow-color),
                    5px 5px 0 var(--shadow-color),
                    6px 6px 0 var(--shadow-color),
                    7px 7px 0 var(--shadow-color),
                    8px 8px 0 var(--shadow-color),
                    9px 9px 0 var(--shadow-color),
                    10px 10px 0 var(--shadow-color),
                    11px 11px 0 var(--shadow-color),
                    12px 12px 0 var(--shadow-color),
                    13px 13px 0 var(--shadow-color),
                    14px 14px 0 var(--shadow-color),
                    15px 15px 0 var(--shadow-color)
                  `,
                  willChange: "transform, opacity, filter",
                }}
              >
                {char}
              </span>
            ))}
          </div>

          {/* Subtitle */}
          <div
            ref={subtitleRef}
            style={{
              opacity: 0,
              transform: "translateY(24px)",
              filter: "blur(6px)",
              marginTop: "2.4rem",
              textAlign: "center",
            }}
          >
            <p
              style={{
                fontFamily: "'Manrope', sans-serif",
                fontSize: "clamp(1.5rem, 1.8vw, 2.2rem)",
                color: "var(--ink-60)",
                lineHeight: 1.6,
                maxWidth: "56rem",
                letterSpacing: "-0.01em",
              }}
            >
              Somewhere between a whiteboard
              <br />
              and a terminal
            </p>
          </div>

          {/* CTA row */}
          <div
            ref={ctaRef}
            style={{
              opacity: 0,
              transform: "translateY(16px)",
              marginTop: "4rem",
              display: "flex",
              alignItems: "center",
              gap: "3.2rem",
            }}
          >
            <a
              href="#projects"
              onClick={(e) => { e.preventDefault(); smoothScrollTo("#projects"); }}
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "1.2rem",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--cream)",
                background: "var(--ink)",
                padding: "1.4rem 3.2rem",
                borderRadius: "10rem",
                transition: "transform 0.25s ease, box-shadow 0.25s ease",
                display: "inline-block",
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.transform = "translateY(-2px)";
                (e.target as HTMLElement).style.boxShadow = "0 8px 32px rgba(26,22,18,0.25)";
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.transform = "translateY(0)";
                (e.target as HTMLElement).style.boxShadow = "none";
              }}
            >
              View Projects
            </a>
            <a
              href="#about"
              onClick={(e) => { e.preventDefault(); smoothScrollTo("#about"); }}
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "1.2rem",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--ink-60)",
                padding: "1.4rem 0",
                borderBottom: "1px solid var(--ink-20)",
                transition: "color 0.2s, border-color 0.2s",
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.color = "var(--ink)";
                (e.target as HTMLElement).style.borderColor = "var(--ink)";
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.color = "var(--ink-60)";
                (e.target as HTMLElement).style.borderColor = "var(--ink-20)";
              }}
            >
              About Me
            </a>
          </div>
        </div>

        {/* Status ticker — bottom left */}
        <div
          ref={statusRef}
          style={{
            position: "absolute",
            bottom: "3.2rem",
            left: "4.8rem",
            opacity: 0,
            zIndex: 5,
          }}
        >
          <div
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "1.1rem",
              letterSpacing: "0.04em",
              color: "var(--ink-60)",
              display: "flex",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "#28C840",
                display: "inline-block",
                animation: "pulse-dot 2s ease infinite",
              }}
            />
            <span
              key={statusIdx}
              style={{
                animation: "status-fade 2.2s ease",
              }}
            >
              {STATUS_LINES[statusIdx]}
            </span>
          </div>
        </div>

        {/* Location — bottom right */}
        <div
          style={{
            position: "absolute",
            bottom: "3.2rem",
            right: "4.8rem",
            zIndex: 5,
          }}
        >
          <span
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "1.1rem",
              letterSpacing: "0.04em",
              color: "var(--ink-60)",
              textTransform: "uppercase",
            }}
          >
            Toronto, Canada · {new Date().getFullYear()}
          </span>
        </div>

        {/* Scroll indicator */}
        <div
          style={{
            position: "absolute",
            bottom: "3.2rem",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 5,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.8rem",
          }}
        >
          <span
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "1rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--ink-60)",
              opacity: 0.5,
            }}
          >
            Scroll
          </span>
          <div
            style={{
              width: "1px",
              height: "3.2rem",
              background: "var(--ink-20)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "50%",
                background: "var(--ink)",
                animation: "scroll-line 2s ease-in-out infinite",
              }}
            />
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        @keyframes status-fade {
          0% { opacity: 0; transform: translateY(6px); }
          15% { opacity: 1; transform: translateY(0); }
          85% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-6px); }
        }
        @keyframes scroll-line {
          0% { top: -50%; }
          100% { top: 100%; }
        }
      `}</style>
    </section>
  );
}