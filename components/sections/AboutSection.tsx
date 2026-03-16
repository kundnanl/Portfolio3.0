"use client";

import { useEffect, useRef } from "react";
import {
  motion, useScroll, useTransform, useSpring, useInView,
} from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { personal, hobbies } from "@/data/portfolio";

gsap.registerPlugin(ScrollTrigger);

/* ── Word-by-word paragraph ───────────────────────────────── */
function AnimatedPara({ text, delay = 0 }: { text: string; delay?: number }) {
  const ref    = useRef<HTMLParagraphElement>(null);
  const inView = useInView(ref, { once: true, margin: "-8%" });
  const words  = text.split(" ");
  return (
    <p ref={ref} className="about-para">
      {words.map((w, i) => (
        <motion.span
          key={i}
          style={{ display: "inline-block", marginRight: "0.3em" }}
          initial={{ opacity: 0, y: 18, filter: "blur(5px)" }}
          animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: 0.5, delay: delay + i * 0.022, ease: [0.16, 1, 0.3, 1] }}
        >{w}</motion.span>
      ))}
    </p>
  );
}

/* ── 3-D draggable hobbies carousel ──────────────────────── */
function HobbiesCarousel() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const cards   = useRef<HTMLDivElement[]>([]);
  const angle   = useRef(0);
  const vel     = useRef(0);
  const dragging = useRef(false);
  const lastX   = useRef(0);
  const raf     = useRef<number>(0);
  const N = hobbies.length;

  const draw = () => {
    cards.current.forEach((c, i) => {
      if (!c) return;
      const theta = (i / N) * Math.PI * 2 + angle.current;
      const x = Math.sin(theta) * 290;
      const z = Math.cos(theta) * 290;
      const s = (z + 390) / 680;
      c.style.transform = `translate(-50%,-50%) translateX(${x}px) translateZ(${z}px) scale(${s})`;
      c.style.opacity   = String(Math.min(Math.max(s * 1.1, 0), 1));
      c.style.zIndex    = String(Math.round(z + 390));
    });
  };

  useEffect(() => {
    draw();
    const inertia = () => {
      vel.current *= 0.94;
      if (Math.abs(vel.current) > 0.0008) {
        angle.current += vel.current;
        draw();
        raf.current = requestAnimationFrame(inertia);
      }
    };
    const el = wrapRef.current;
    if (!el) return;

    const md = (e: MouseEvent) => { dragging.current = true; lastX.current = e.clientX; cancelAnimationFrame(raf.current); };
    const mm = (e: MouseEvent) => { if (!dragging.current) return; vel.current = (e.clientX - lastX.current) * 0.004; angle.current += vel.current; draw(); lastX.current = e.clientX; };
    const mu = () => { dragging.current = false; raf.current = requestAnimationFrame(inertia); };
    const ts = (e: TouchEvent) => { dragging.current = true; lastX.current = e.touches[0].clientX; cancelAnimationFrame(raf.current); };
    const tm = (e: TouchEvent) => { if (!dragging.current) return; vel.current = (e.touches[0].clientX - lastX.current) * 0.004; angle.current += vel.current; draw(); lastX.current = e.touches[0].clientX; };
    const te = () => { dragging.current = false; raf.current = requestAnimationFrame(inertia); };

    el.addEventListener("mousedown", md);
    window.addEventListener("mousemove", mm);
    window.addEventListener("mouseup", mu);
    el.addEventListener("touchstart", ts);
    window.addEventListener("touchmove", tm);
    window.addEventListener("touchend", te);
    return () => {
      el.removeEventListener("mousedown", md);
      window.removeEventListener("mousemove", mm);
      window.removeEventListener("mouseup", mu);
      el.removeEventListener("touchstart", ts);
      window.removeEventListener("touchmove", tm);
      window.removeEventListener("touchend", te);
      cancelAnimationFrame(raf.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const hobbyImages = [
    "/images/hobby-music.jpg",
    "/images/hobby-travel.jpg",
    "/images/hobby-gym.jpg",
    "/images/hobby-tech.jpg",
    "/images/hobby-sports.jpg",
  ];

  return (
    <section className="hobbies-wrap">
      <div className="hobbies-orbit" />
      <div style={{ position: "absolute", top: "4.8rem", left: "4.8rem", zIndex: 10 }}>
        <span className="section-label">More About Me — drag to explore</span>
      </div>
      <div ref={wrapRef} className="hobbies-inner">
        {hobbies.map((h, i) => (
          <div
            key={h.title}
            className="hobby-card"
            ref={(el) => { if (el) cards.current[i] = el; }}
          >
            <div className="hobby-img" style={{ position: "relative", overflow: "hidden" }}>
              <Image
                src={hobbyImages[i % hobbyImages.length]}
                alt={h.title}
                fill
                sizes="20vw"
                style={{ objectFit: "cover", borderRadius: "2.4rem" }}
              />
            </div>
            <h3 className="hobby-title">{h.title}</h3>
            <p className="hobby-desc">{h.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── About section ───────────────────────────────────────── */
export default function AboutSection() {
  const stickyRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: stickyRef,
    offset: ["start start", "end start"],
  });

  // Image scales slightly as you scroll through the sticky zone
  const imgScale = useSpring(useTransform(scrollYProgress, [0, 1], [1.0, 1.18]), { stiffness: 55, damping: 20 });
  const imgY     = useSpring(useTransform(scrollYProgress, [0, 1], ["0%",  "9%"]),  { stiffness: 55, damping: 20 });
  const labelOp  = useTransform(scrollYProgress, [0, 0.25], [1, 0]);

  return (
    <div id="about" className="about-section">

      {/* ── Sticky full-screen image panel ─────────────── */}
      <div ref={stickyRef} className="about-sticky-wrap">
        <div className="about-sticky-img">
          <motion.div className="about-img-inner" style={{ scale: imgScale, y: imgY }}>
            <Image
              src="/images/about.jpg"
              alt="About Laksh"
              fill
              sizes="100vw"
              style={{ objectFit: "cover", borderRadius: "3.2rem" }}
              priority
            />
          </motion.div>
          {/* Subtle gradient at bottom */}
          <div style={{
            position: "absolute", inset: 0, borderRadius: "3.2rem",
            background: "linear-gradient(to top, rgba(250,247,242,0.6) 0%, transparent 50%)",
            pointerEvents: "none",
          }} />
          <motion.div
            style={{ position: "absolute", top: "4.8rem", left: "4.8rem", opacity: labelOp }}
          >
            <span className="section-label">About Me</span>
          </motion.div>
        </div>
      </div>

      {/* ── Text copy ──────────────────────────────────── */}
      <div className="about-copy">
        <AnimatedPara text={personal.about1} delay={0} />
        <div style={{ height: "8rem" }} />
        <AnimatedPara text={personal.about2} delay={0.04} />

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{ marginTop: "8rem", display: "flex", gap: "5.6rem", flexWrap: "wrap" }}
        >
          {[
            { v: "2+",   l: "Years at RBC"    },
            { v: "10M+", l: "Records / day"   },
            { v: "60%",  l: "Query speedup"   },
            { v: "50+",  l: "Data sources"    },
          ].map(({ v, l }, i) => (
            <motion.div
              key={l}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <div style={{
                fontFamily: "Yatra One, serif", fontSize: "5.6rem",
                letterSpacing: "-0.04em", lineHeight: 1, color: "var(--ink)",
                textShadow: "2px 2px 0 var(--shadow-color), 3px 3px 0 var(--shadow-color)",
              }}>{v}</div>
              <div style={{
                fontFamily: "DM Mono, monospace", fontSize: "1.2rem",
                letterSpacing: "0.06em", textTransform: "uppercase",
                color: "var(--ink-60)", marginTop: "0.8rem",
              }}>{l}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* ── Hobbies carousel ───────────────────────────── */}
      <HobbiesCarousel />
    </div>
  );
}
