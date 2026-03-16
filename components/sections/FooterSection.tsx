"use client";

import { useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import gsap from "gsap";
import { personal } from "@/data/portfolio";
import { Github, Linkedin, Instagram, ArrowUpRight } from "lucide-react";

export default function FooterSection() {
  const logoRef    = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const logo    = logoRef.current;
    const section = sectionRef.current;
    if (!logo || !section) return;

    const onMove = (e: MouseEvent) => {
      const r  = section.getBoundingClientRect();
      const dx = (e.clientX - r.left - r.width  / 2) / r.width;
      const dy = (e.clientY - r.top  - r.height / 2) / r.height;

      const shadows = Array.from({ length: 20 }, (_, i) => {
        const n = i + 1;
        return `${dx * n * 2}px ${dy * n * 2}px 0 #ebda28`;
      }).join(", ");
      logo.style.textShadow = shadows;

      gsap.to(logo, { x: dx * 28, y: dy * 14, duration: 0.45, ease: "power4.out" });
    };

    const onLeave = () => {
      logo.style.textShadow = Array.from({ length: 20 }, (_, i) => {
        const n = i + 1;
        return `${n}px ${n}px 0 #ebda28`;
      }).join(", ");
      gsap.to(logo, { x: 0, y: 0, duration: 0.45, ease: "back.out(3)" });
    };

    section.addEventListener("mousemove", onMove);
    section.addEventListener("mouseleave", onLeave);
    return () => {
      section.removeEventListener("mousemove", onMove);
      section.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  const inView = useInView(sectionRef, { once: true, margin: "-5%" });

  const socials = [
    { label: "GitHub",    icon: Github,    href: personal.github    },
    { label: "LinkedIn",  icon: Linkedin,  href: personal.linkedin  },
    { label: "Instagram", icon: Instagram, href: personal.instagram },
  ];

  const stagger = (i: number) => ({
    initial:  { opacity: 0, y: 24, filter: "blur(8px)" },
    animate:  inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {},
    transition: { duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] },
  });

  return (
    <footer ref={sectionRef} id="contact" className="footer">

      {/* CTA */}
      <motion.div {...stagger(0)}>
        <span className="footer-cta-label">Let&apos;s Work Together</span>
        <a href={`mailto:${personal.email}`} className="footer-cta" data-hover>
          {personal.email}
        </a>
      </motion.div>

      {/* Socials */}
      <motion.div className="footer-socials" {...stagger(1)}>
        {socials.map(({ label, icon: Icon, href }) => (
          <a key={label} href={href} target="_blank" rel="noopener noreferrer"
            className="footer-social-link" data-hover>
            <Icon size={16} />
            {label}
            <ArrowUpRight size={12} style={{ opacity: 0.5 }} />
          </a>
        ))}
      </motion.div>

      {/* Divider */}
      <motion.div className="footer-rule" {...stagger(2)} />

      {/* Bottom row */}
      <motion.div className="footer-bottom" {...stagger(3)}>
        <span>Toronto, Canada</span>
        <span>{personal.name} · Data Engineer</span>
        <span>RBC · Sheridan College</span>
        <span style={{ textAlign: "right" }}>© {new Date().getFullYear()}</span>
      </motion.div>

      {/* Oversized magnetic logo */}
      <motion.div className="footer-logo-wrap" {...stagger(4)}>
        <div ref={logoRef} className="footer-logo">
          {personal.fullName}
        </div>
      </motion.div>
    </footer>
  );
}
