"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { personal } from "@/data/portfolio";
import { smoothScrollTo } from "@/utils/smoothNav";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const links = [
  { label: "Projects", href: "#projects" },
  { label: "About Me", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [onDark, setOnDark] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [pastHero, setPastHero] = useState(false);
  const [open, setOpen] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    if (!navRef.current) return;
    gsap.to(navRef.current, { opacity: 1, duration: 0.9, delay: 0.3, ease: "power2.out" });

    const onScroll = () => {
      const currentY = window.scrollY;
      const heroHeight = window.innerHeight;

      setScrolled(currentY > 80);

      // Are we past the hero section?
      const isPastHero = currentY > heroHeight * 0.85;
      setPastHero(isPastHero);

      // Hide/show logic — only kicks in after hero
      if (isPastHero) {
        const delta = currentY - lastScrollY.current;
        if (delta > 8) {
          // scrolling down — hide
          setHidden(true);
        } else if (delta < -8) {
          // scrolling up — show
          setHidden(false);
        }
      } else {
        // Still in hero — always visible
        setHidden(false);
      }

      lastScrollY.current = currentY;

      // Dark section detection
      const darkEls = document.querySelectorAll("[data-dark]");
      let dark = false;
      darkEls.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top < 60 && r.bottom > 60) dark = true;
      });
      setOnDark(dark);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (href: string) => {
    setOpen(false);
    smoothScrollTo(href);
  };

  const cls = [
    "navbar",
    scrolled ? "scrolled" : "",
    onDark ? "on-dark" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <nav
      ref={navRef}
      className={cls}
      style={{
        opacity: 0,
        transform: hidden && pastHero ? "translateY(-110%)" : "translateY(0)",
        transition:
          "transform 0.4s cubic-bezier(0.22, 1, 0.36, 1), background 0.4s ease, border-color 0.4s ease",
      }}
    >
      <div className="nav-logo">{personal.name}</div>

      <ul className="nav-links">
        {links.map((l) => (
          <li key={l.href} className="nav-link-item">
            <span className="nav-bracket left">[</span>
            <button className="nav-link-btn" onClick={() => go(l.href)}>
              {l.label}
            </button>
            <span className="nav-bracket right">]</span>
          </li>
        ))}
      </ul>

      {/* Mobile toggle */}
      <button
        className="nav-link-btn"
        style={{ display: "none" }}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? "Close" : "Menu"}
      </button>

      {open && (
        <div
          style={{
            position: "fixed",
            top: "4.8rem",
            right: "2.4rem",
            background: "rgba(250,247,242,0.9)",
            backdropFilter: "blur(30px)",
            borderRadius: "2rem",
            padding: "2.4rem 3.2rem",
            display: "flex",
            flexDirection: "column",
            gap: "2rem",
            zIndex: 600,
            border: "1px solid rgba(26,22,18,0.12)",
          }}
        >
          {links.map((l) => (
            <button
              key={l.href}
              className="nav-link-btn"
              style={{ fontSize: "1.8rem", opacity: 1, textAlign: "left" }}
              onClick={() => go(l.href)}
            >
              {l.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}