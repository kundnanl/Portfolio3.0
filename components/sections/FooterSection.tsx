"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import gsap from "gsap";
import { personal } from "@/data/portfolio";
import { Github, Linkedin, Instagram, ArrowUpRight, Copy, Check } from "lucide-react";
import { smoothScrollTo } from "@/utils/smoothNav";

/* ── time display ────────────────────────────────────────── */
function LiveClock() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const tick = () => {
      setTime(
        new Date().toLocaleTimeString("en-US", {
          timeZone: "America/Toronto",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return <span>{time} EST</span>;
}

export default function FooterSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const [copied, setCopied] = useState(false);

  const inView = useInView(sectionRef, { once: true, margin: "-8%" });

  /* ── magnetic headline on mouse ────────────────────────── */
  useEffect(() => {
    const headline = headlineRef.current;
    const section = sectionRef.current;
    if (!headline || !section) return;

    const onMove = (e: MouseEvent) => {
      const r = section.getBoundingClientRect();
      const dx = (e.clientX - r.left - r.width / 2) / r.width;
      const dy = (e.clientY - r.top - r.height / 2) / r.height;
      gsap.to(headline, { x: dx * 20, y: dy * 10, duration: 0.6, ease: "power3.out" });
    };

    const onLeave = () => {
      gsap.to(headline, { x: 0, y: 0, duration: 0.8, ease: "elastic.out(1, 0.4)" });
    };

    section.addEventListener("mousemove", onMove);
    section.addEventListener("mouseleave", onLeave);
    return () => {
      section.removeEventListener("mousemove", onMove);
      section.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  /* ── copy email ────────────────────────────────────────── */
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(personal.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* fallback — select the text */
    }
  };

  const socials = [
    { label: "GitHub", icon: Github, href: personal.github },
    { label: "LinkedIn", icon: Linkedin, href: personal.linkedin },
    { label: "Instagram", icon: Instagram, href: personal.instagram },
  ];

  const navLinks = [
    { label: "Projects", href: "#projects" },
    { label: "About", href: "#about" },
    { label: "Skills", href: "#skills" },
    { label: "Contact", href: "#contact" },
  ];

  const stagger = (i: number) => ({
    initial: { opacity: 0, y: 30, filter: "blur(6px)" },
    animate: inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {},
    transition: {
      duration: 0.8,
      delay: i * 0.08,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  });

  return (
    <footer
      ref={sectionRef}
      id="contact"
      style={{
        background: "var(--ink)",
        color: "white",
        position: "relative",
        overflow: "hidden",
      }}
      data-dark="true"
    >
      {/* Grain overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.04,
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Accent gradient glow */}
      <div
        style={{
          position: "absolute",
          top: "-20%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "80%",
          height: "50%",
          background:
            "radial-gradient(ellipse at center, rgba(235,218,40,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* ─── Main CTA Area ──────────────────────────────────── */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          padding: "14rem 5.6rem 0",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        {/* Availability badge */}
        <motion.div {...stagger(0)}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "1rem",
              padding: "0.8rem 2rem",
              borderRadius: "10rem",
              border: "1px solid rgba(255,255,255,0.1)",
              background: "rgba(255,255,255,0.03)",
              marginBottom: "4rem",
            }}
          >
            <span
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "#28C840",
                display: "inline-block",
                boxShadow: "0 0 8px rgba(40,200,64,0.5)",
                animation: "footer-pulse 2.5s ease infinite",
              }}
            />
            <span
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "1.15rem",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.6)",
              }}
            >
              Available for opportunities
            </span>
          </div>
        </motion.div>

        {/* Big CTA headline */}
        <motion.div {...stagger(1)}>
          <h2
            ref={headlineRef}
            style={{
              fontFamily: "'Yatra One', serif",
              fontSize: "clamp(4.8rem, 8vw, 11rem)",
              letterSpacing: "-0.04em",
              lineHeight: 1,
              color: "white",
              marginBottom: "3.2rem",
              willChange: "transform",
            }}
          >
            Let&apos;s build
            <br />
            <span style={{ color: "var(--shadow-color)" }}>something</span> great
          </h2>
        </motion.div>

        {/* Subtitle */}
        <motion.div {...stagger(2)}>
          <p
            style={{
              fontFamily: "'Manrope', sans-serif",
              fontSize: "1.7rem",
              color: "rgba(255,255,255,0.4)",
              maxWidth: "48rem",
              lineHeight: 1.7,
              marginBottom: "4.8rem",
            }}
          >
            Got a project, a role, or just want to talk about innovation
            at unreasonable hours? I&apos;m all ears.
          </p>
        </motion.div>

        {/* Email button + copy */}
        <motion.div
          {...stagger(3)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1.6rem",
            marginBottom: "2.4rem",
          }}
        >
          <a
            href={`mailto:${personal.email}`}
            data-hover
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "clamp(1.4rem, 2vw, 1.8rem)",
              letterSpacing: "0.02em",
              color: "var(--ink)",
              background: "var(--shadow-color)",
              padding: "1.6rem 4rem",
              borderRadius: "10rem",
              display: "inline-flex",
              alignItems: "center",
              gap: "1rem",
              transition: "transform 0.25s ease, box-shadow 0.25s ease",
              fontWeight: 500,
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)";
              (e.currentTarget as HTMLElement).style.boxShadow =
                "0 12px 40px rgba(235,218,40,0.25)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
              (e.currentTarget as HTMLElement).style.boxShadow = "none";
            }}
          >
            {personal.email}
            <ArrowUpRight size={18} />
          </a>

          <button
            onClick={handleCopy}
            data-hover
            style={{
              width: "4.8rem",
              height: "4.8rem",
              borderRadius: "50%",
              border: "1px solid rgba(255,255,255,0.15)",
              background: "rgba(255,255,255,0.05)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background 0.2s, border-color 0.2s",
              cursor: "none",
              flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.1)";
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.3)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)";
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.15)";
            }}
            title="Copy email"
          >
            {copied ? (
              <Check size={16} color="#28C840" />
            ) : (
              <Copy size={16} color="rgba(255,255,255,0.5)" />
            )}
          </button>
        </motion.div>

        {copied && (
          <motion.span
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "1.1rem",
              color: "#28C840",
              letterSpacing: "0.04em",
            }}
          >
            Copied to clipboard
          </motion.span>
        )}
      </div>

      {/* ─── Info Grid ──────────────────────────────────────── */}
      <motion.div
        {...stagger(4)}
        style={{
          position: "relative",
          zIndex: 2,
          padding: "10rem 5.6rem 0",
          display: "grid",
          gridTemplateColumns: "1.5fr 1fr 1fr 1fr",
          gap: "4rem",
        }}
      >
        {/* Col 1 — Bio snippet */}
        <div>
          <span
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "1.1rem",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.3)",
              display: "block",
              marginBottom: "1.6rem",
            }}
          >
            About
          </span>
          <p
            style={{
              fontFamily: "'Manrope', sans-serif",
              fontSize: "1.4rem",
              color: "rgba(255,255,255,0.5)",
              lineHeight: 1.7,
              maxWidth: "32rem",
            }}
          >
            Software & Data Engineer at RBC. Building resilient backend systems
            and the invisible data highways behind billion-dollar decisions.
          </p>
        </div>

        {/* Col 2 — Navigation */}
        <div>
          <span
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "1.1rem",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.3)",
              display: "block",
              marginBottom: "1.6rem",
            }}
          >
            Navigate
          </span>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  smoothScrollTo(link.href);
                }}
                data-hover
                style={{
                  fontFamily: "'Manrope', sans-serif",
                  fontSize: "1.4rem",
                  color: "rgba(255,255,255,0.5)",
                  transition: "color 0.2s",
                  display: "inline-block",
                  width: "fit-content",
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.color = "white";
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.color = "rgba(255,255,255,0.5)";
                }}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        {/* Col 3 — Socials */}
        <div>
          <span
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "1.1rem",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.3)",
              display: "block",
              marginBottom: "1.6rem",
            }}
          >
            Connect
          </span>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
            {socials.map(({ label, icon: Icon, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                data-hover
                style={{
                  fontFamily: "'Manrope', sans-serif",
                  fontSize: "1.4rem",
                  color: "rgba(255,255,255,0.5)",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.8rem",
                  transition: "color 0.2s",
                  width: "fit-content",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.color = "white";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.5)";
                }}
              >
                <Icon size={15} />
                {label}
                <ArrowUpRight size={11} style={{ opacity: 0.4 }} />
              </a>
            ))}
          </div>
        </div>

        {/* Col 4 — Local time + location */}
        <div>
          <span
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "1.1rem",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.3)",
              display: "block",
              marginBottom: "1.6rem",
            }}
          >
            Local Time
          </span>
          <div
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "1.35rem",
              color: "rgba(255,255,255,0.55)",
              lineHeight: 1.8,
            }}
          >
            <LiveClock />
            <br />
            <span style={{ color: "rgba(255,255,255,0.35)" }}>Toronto, Canada</span>
          </div>
        </div>
      </motion.div>

      {/* ─── Divider ────────────────────────────────────────── */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          margin: "6rem 5.6rem 0",
          height: "1px",
          background: "rgba(255,255,255,0.08)",
        }}
      />

      {/* ─── Copyright bar ──────────────────────────────────── */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          padding: "2.4rem 5.6rem 3.2rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "1.1rem",
            letterSpacing: "0.04em",
            color: "rgba(255,255,255,0.25)",
          }}
        >
          © {new Date().getFullYear()} {personal.fullName}
        </span>

        <button
          onClick={() => smoothScrollTo("#hero")}
          data-hover
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "1.1rem",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.35)",
            display: "flex",
            alignItems: "center",
            gap: "0.8rem",
            transition: "color 0.2s",
            cursor: "none",
            background: "none",
            border: "none",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.7)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.35)";
          }}
        >
          Back to top
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            style={{ transform: "rotate(-90deg)" }}
          >
            <path
              d="M2 6h8M7 3l3 3-3 3"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <span
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "1.1rem",
            letterSpacing: "0.04em",
            color: "rgba(255,255,255,0.25)",
          }}
        >
          Crafted with precision
        </span>
      </div>

      <style jsx>{`
        @keyframes footer-pulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 8px rgba(40, 200, 64, 0.5); }
          50% { opacity: 0.4; box-shadow: 0 0 4px rgba(40, 200, 64, 0.2); }
        }
      `}</style>
    </footer>
  );
}