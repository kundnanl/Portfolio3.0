"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { skills as skillsData } from "@/data/portfolio";

type Cat = keyof typeof skillsData;
const cats = Object.keys(skillsData) as Cat[];

export default function SkillsSection() {
  const sectionRef     = useRef<HTMLElement>(null);
  const areaRef        = useRef<HTMLDivElement>(null);
  const [tab, setTab]  = useState<Cat>(cats[0]);
  const cleanupRef     = useRef<(() => void) | null>(null);
  const hasLaunchedRef = useRef(false);

  const runPhysics = useCallback(async (category: Cat) => {
    const area = areaRef.current;
    if (!area) return;

    // Tear down previous simulation
    cleanupRef.current?.();
    cleanupRef.current = null;

    // Remove any leftover canvases from previous runs
    area.querySelectorAll("canvas").forEach((c) => c.remove());

    // Wait one frame so flex layout has resolved
    await new Promise<void>((r) => requestAnimationFrame(() => r()));

    const W = area.clientWidth;
    const H = area.clientHeight;
    if (W === 0 || H === 0) return;

    try {
      const M = (await import("matter-js")).default;
      const { Engine, Render, Runner, Bodies, Composite, Mouse, MouseConstraint, Events } = M;

      const engine = Engine.create({ gravity: { y: 1.2 } });

      // Let Matter.js create and inject its own canvas into the container
      const render = Render.create({
        element: area,
        engine,
        options: {
          width:      W,
          height:     H,
          pixelRatio: 1,
          wireframes: false,
          background: "transparent",
        },
      });

      // Make the auto-created canvas fill the container
      render.canvas.style.cssText =
        "position:absolute;top:0;left:0;width:100%;height:100%;display:block;";

      // Invisible walls
      const invis = { fillStyle: "transparent", strokeStyle: "transparent", lineWidth: 0 };
      Composite.add(engine.world, [
        Bodies.rectangle(W / 2, H + 25,  W * 2, 50,  { isStatic: true, render: invis }),
        Bodies.rectangle(-25,   H / 2,   50,    H * 2, { isStatic: true, render: invis }),
        Bodies.rectangle(W + 25, H / 2,  50,    H * 2, { isStatic: true, render: invis }),
        Bodies.rectangle(W / 2, -25,     W * 2, 50,  { isStatic: true, render: invis }),
      ]);

      // Badge bodies
      const items: { label: string; color: string }[] = skillsData[category];
      const bodies: Matter.Body[] = [];

      items.forEach((item, i) => {
        const isEmoji = [...item.label].length <= 2 && /\p{Emoji}/u.test(item.label);
        const bW = isEmoji ? 60 : Math.min(Math.max(item.label.length * 11 + 44, 88), 260);
        const bH = 50;

        const body = Bodies.rectangle(
          40 + Math.random() * (W - 80),
          -i * 90 - 80,
          bW, bH,
          {
            restitution: 0.5,
            friction:    0.18,
            frictionAir: 0.012,
            chamfer:     { radius: bH / 2 },
            render:      { fillStyle: item.color },
          },
        );
        (body as unknown as Record<string, unknown>)._lbl = item.label;
        bodies.push(body);
      });
      Composite.add(engine.world, bodies);

      // Mouse drag support
      const mouse = Mouse.create(render.canvas);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mAny = mouse as unknown as any;
      if (mAny.mousewheel) {
        mouse.element.removeEventListener("mousewheel",     mAny.mousewheel);
        mouse.element.removeEventListener("DOMMouseScroll", mAny.mousewheel);
      }

      const mc = MouseConstraint.create(engine, {
        mouse,
        constraint: { stiffness: 0.2, damping: 0.01, render: { visible: false } },
      });
      Composite.add(engine.world, mc);
      render.mouse = mouse;

      Events.on(mc, "startdrag", () => { render.canvas.style.cursor = "grabbing"; });
      Events.on(mc, "enddrag",   () => { render.canvas.style.cursor = "grab"; });
      render.canvas.style.cursor = "grab";

      // Draw text labels over each pill
      Events.on(render, "afterRender", () => {
        const ctx = render.context;
        bodies.forEach((b) => {
          const lbl = (b as unknown as Record<string, unknown>)._lbl as string;
          ctx.save();
          ctx.translate(b.position.x, b.position.y);
          ctx.rotate(b.angle);
          ctx.fillStyle    = "rgba(26,22,18,0.85)";
          ctx.font         = "500 13px 'DM Mono', monospace";
          ctx.textAlign    = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(lbl, 0, 0);
          ctx.restore();
        });
      });

      // Start — Matter.js 0.20 requires runner as first arg
      const runner = Runner.create();
      Runner.run(runner, engine);
      Render.run(render);

      cleanupRef.current = () => {
        Events.off(render, "afterRender");
        Runner.stop(runner);
        Render.stop(render);
        Composite.clear(engine.world, false);
        Engine.clear(engine);
        render.canvas?.remove();
      };
    } catch (err) {
      console.error("[SkillsSection] physics init failed:", err);
    }
  }, []);

  // Launch once the section enters the viewport
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasLaunchedRef.current) {
          hasLaunchedRef.current = true;
          observer.disconnect();
          runPhysics(tab);
        }
      },
      { threshold: 0.05 },
    );
    observer.observe(section);

    return () => observer.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-run on tab switch (only after first launch)
  useEffect(() => {
    if (!hasLaunchedRef.current) return;
    runPhysics(tab);
  }, [tab, runPhysics]);

  // Cleanup on unmount
  useEffect(() => () => { cleanupRef.current?.(); }, []);

  return (
    <section ref={sectionRef} id="skills" className="skills-section">
      <div className="skills-sticky">

        <span className="section-label" style={{ marginBottom: "2rem", display: "block" }}>
          Skills &amp; Services
        </span>

        {/* Category tabs */}
        <div className="skills-tabs">
          {cats.map((c) => (
            <motion.button
              key={c}
              className={`skills-tab${tab === c ? " active" : ""}`}
              onClick={() => setTab(c)}
              whileTap={{ scale: 0.95 }}
            >
              {tab === c && <span>[</span>}
              {c}
              {tab === c && <span>]</span>}
            </motion.button>
          ))}
          <span className="skills-hint">Grab &amp; throw →</span>
        </div>

        {/* Matter.js injects its canvas here */}
        <div ref={areaRef} className="skills-canvas-area" />

      </div>
    </section>
  );
}
