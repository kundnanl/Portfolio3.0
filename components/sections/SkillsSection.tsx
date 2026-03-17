"use client";

import Matter from "matter-js";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { skills as skillsData } from "@/data/portfolio";

type SkillItem = { label: string; color: string };
type Cat = keyof typeof skillsData;

const TEXT_COLOR = "rgba(26,22,18,0.88)";
const FONT = "500 13px 'DM Mono', monospace";

export default function SkillsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const areaRef = useRef<HTMLDivElement>(null);

  const [tab, setTab] = useState<Cat>(Object.keys(skillsData)[0] as Cat);

  const sceneRef = useRef<{
    engine: Matter.Engine | null;
    render: Matter.Render | null;
    runner: Matter.Runner | null;
    resizeHandler: (() => void) | null;
    afterRenderHandler: (() => void) | null;
    bodies: Matter.Body[];
    mouseConstraint: Matter.MouseConstraint | null;
  }>({
    engine: null,
    render: null,
    runner: null,
    resizeHandler: null,
    afterRenderHandler: null,
    bodies: [],
    mouseConstraint: null,
  });

  const launchedRef = useRef(false);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  const categories = useMemo(() => Object.keys(skillsData) as Cat[], []);

  const destroyScene = useCallback(() => {
    const scene = sceneRef.current;

    if (scene.resizeHandler) {
      window.removeEventListener("resize", scene.resizeHandler);
      scene.resizeHandler = null;
    }

    if (scene.render && scene.afterRenderHandler) {
      Matter.Events.off(scene.render, "afterRender", scene.afterRenderHandler);
      scene.afterRenderHandler = null;
    }

    if (scene.runner) {
      Matter.Runner.stop(scene.runner);
    }

    if (scene.render) {
      Matter.Render.stop(scene.render);
      scene.render.canvas.remove();
      scene.render.textures = {};
    }

    if (scene.engine) {
      Matter.World.clear(scene.engine.world, false);
      Matter.Engine.clear(scene.engine);
    }

    scene.engine = null;
    scene.render = null;
    scene.runner = null;
    scene.bodies = [];
    scene.mouseConstraint = null;
  }, []);

  const buildScene = useCallback(
    (category: Cat) => {
      const area = areaRef.current;
      if (!area) return;

      const width = area.clientWidth;
      const height = area.clientHeight;

      if (!width || !height) return;

      destroyScene();

      const {
        Engine,
        Render,
        Runner,
        World,
        Bodies,
        Mouse,
        MouseConstraint,
        Events,
        Composite,
        Body,
      } = Matter;

      const engine = Engine.create({
        gravity: { x: 0, y: 1.05 },
      });

      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

      const render = Render.create({
        element: area,
        engine,
        options: {
          width,
          height,
          wireframes: false,
          background: "transparent",
          pixelRatio,
        },
      });

      /* ── Canvas styling ──────────────────────────────── */
      Object.assign(render.canvas.style, {
        position: "absolute",
        inset: "0",
        width: "100%",
        height: "100%",
        display: "block",
        pointerEvents: "auto",
        touchAction: "none", // crucial – prevents browser from stealing touch events
      });

      /* ── Prevent Lenis / parent scroll from swallowing pointer events ── */
      const stopPropagation = (e: Event) => e.stopPropagation();
      render.canvas.addEventListener("pointerdown", stopPropagation, {
        passive: false,
      });
      render.canvas.addEventListener("pointermove", stopPropagation, {
        passive: false,
      });
      render.canvas.addEventListener("touchstart", stopPropagation, {
        passive: false,
      });
      render.canvas.addEventListener("touchmove", stopPropagation, {
        passive: false,
      });

      /* ── Walls ───────────────────────────────────────── */
      const wallStyle = {
        fillStyle: "transparent",
        strokeStyle: "transparent",
        lineWidth: 0,
      };

      const floor = Bodies.rectangle(width / 2, height + 30, width + 200, 60, {
        isStatic: true,
        render: wallStyle,
      });

      const leftWall = Bodies.rectangle(
        -30,
        height / 2,
        60,
        height + 200,
        { isStatic: true, render: wallStyle }
      );

      const rightWall = Bodies.rectangle(
        width + 30,
        height / 2,
        60,
        height + 200,
        { isStatic: true, render: wallStyle }
      );

      const topWall = Bodies.rectangle(
        width / 2,
        -220,
        width + 400,
        60,
        { isStatic: true, render: wallStyle }
      );

      World.add(engine.world, [floor, leftWall, rightWall, topWall]);

      /* ── Pill bodies ─────────────────────────────────── */
      const items = skillsData[category] as SkillItem[];
      const bodies: Matter.Body[] = [];

      const getPillWidth = (label: string) => {
        const emojiOnly = [...label].length <= 2 && /\p{Emoji}/u.test(label);
        if (emojiOnly) return 64;
        return Math.min(Math.max(label.length * 10.5 + 46, 96), 260);
      };

      items.forEach((item, index) => {
        const pillW = getPillWidth(item.label);
        const pillH = 50;

        const x = 70 + Math.random() * Math.max(width - 140, 1);
        const y = 40 + (index % 3) * 16 + Math.random() * 30;

        const body = Bodies.rectangle(x, y, pillW, pillH, {
          restitution: 0.55,
          friction: 0.12,
          frictionAir: 0.018,
          density: 0.0022,
          chamfer: { radius: pillH / 2 },
          render: {
            fillStyle: item.color,
          },
        });

        Body.setVelocity(body, {
          x: (Math.random() - 0.5) * 2.2,
          y: Math.random() * 0.5,
        });

        (body as Matter.Body & { skillLabel?: string }).skillLabel = item.label;
        bodies.push(body);
      });

      World.add(engine.world, bodies);

      /* ── Mouse constraint (THE FIX) ──────────────────── */
      const mouse = Mouse.create(render.canvas);

      // Sync pixel ratio so click coordinates match the physics world
      mouse.pixelRatio = pixelRatio;

      // angularStiffness is valid at runtime but missing from @types/matter-js
      const constraintOptions = {
        stiffness: 0.18,
        damping: 0.08,
        angularStiffness: 0.2,
        render: { visible: false },
      };

      const mouseConstraint = MouseConstraint.create(engine, {
        mouse,
        constraint: constraintOptions as Matter.IConstraintDefinition,
      });

      // Keep render in sync with the mouse
      render.mouse = mouse;

      World.add(engine.world, mouseConstraint);

      /* ── Remove Matter's default wheel listeners so page still scrolls ── */
      const mouseAny = mouse as unknown as {
        mousewheel?: EventListener;
        element?: HTMLElement;
      };

      if (mouseAny.mousewheel && mouseAny.element) {
        mouseAny.element.removeEventListener(
          "mousewheel",
          mouseAny.mousewheel
        );
        mouseAny.element.removeEventListener(
          "DOMMouseScroll",
          mouseAny.mousewheel
        );
        mouseAny.element.removeEventListener("wheel", mouseAny.mousewheel);
      }

      /* ── Cursor feedback ─────────────────────────────── */
      render.canvas.style.cursor = "grab";

      Events.on(mouseConstraint, "startdrag", () => {
        render.canvas.style.cursor = "grabbing";
      });

      Events.on(mouseConstraint, "enddrag", () => {
        render.canvas.style.cursor = "grab";
      });

      /* ── Draw labels on each frame ───────────────────── */
      const afterRenderHandler = () => {
        const ctx = render.context;
        ctx.save();
        ctx.font = FONT;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        for (const body of bodies) {
          const label =
            (body as Matter.Body & { skillLabel?: string }).skillLabel || "";
          ctx.save();
          ctx.translate(body.position.x, body.position.y);
          ctx.rotate(body.angle);
          ctx.fillStyle = TEXT_COLOR;
          ctx.fillText(label, 0, 0);
          ctx.restore();
        }

        ctx.restore();
      };

      Events.on(render, "afterRender", afterRenderHandler);

      /* ── Run ─────────────────────────────────────────── */
      const runner = Runner.create();
      Runner.run(runner, engine);
      Render.run(render);

      /* ── Resize handler ──────────────────────────────── */
      let resizeTimeout: ReturnType<typeof setTimeout>;
      const resizeHandler = () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
          const el = areaRef.current;
          if (!el || !sceneRef.current.render) return;
          const newWidth = el.clientWidth;
          const newHeight = el.clientHeight;
          if (!newWidth || !newHeight) return;
          buildScene(category);
        }, 150); // debounce so resize doesn't thrash
      };

      window.addEventListener("resize", resizeHandler);

      sceneRef.current = {
        engine,
        render,
        runner,
        resizeHandler,
        afterRenderHandler,
        bodies,
        mouseConstraint,
      };

      // Small settle nudge so everything starts lively
      setTimeout(() => {
        const allBodies = Composite.allBodies(engine.world).filter(
          (b) => !b.isStatic
        );
        allBodies.forEach((b, i) => {
          Body.applyForce(b, b.position, {
            x: (i % 2 === 0 ? 1 : -1) * 0.0008,
            y: 0,
          });
        });
      }, 60);
    },
    [destroyScene]
  );

  /* ── Intersection observer: first launch ─────────────── */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || launchedRef.current) return;
        launchedRef.current = true;
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            buildScene(tab);
          });
        });
      },
      { threshold: 0.08 }
    );

    io.observe(section);

    return () => {
      io.disconnect();
    };
  }, [buildScene, tab]);

  /* ── Rebuild when tab changes ────────────────────────── */
  useEffect(() => {
    if (!launchedRef.current) return;
    buildScene(tab);
  }, [tab, buildScene]);

  /* ── ResizeObserver for container size changes ───────── */
  useEffect(() => {
    const area = areaRef.current;
    if (!area) return;

    resizeObserverRef.current?.disconnect();

    let resizeTimeout: ReturnType<typeof setTimeout>;
    resizeObserverRef.current = new ResizeObserver(() => {
      if (!launchedRef.current) return;
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => buildScene(tab), 150);
    });
    resizeObserverRef.current.observe(area);

    return () => {
      clearTimeout(resizeTimeout);
      resizeObserverRef.current?.disconnect();
      resizeObserverRef.current = null;
    };
  }, [buildScene, tab]);

  /* ── Cleanup on unmount ──────────────────────────────── */
  useEffect(() => {
    return () => {
      destroyScene();
      resizeObserverRef.current?.disconnect();
      launchedRef.current = false;
    };
  }, [destroyScene]);

  return (
    <section ref={sectionRef} id="skills" className="skills-section">
      <div className="skills-sticky">
        <span className="section-label skills-label">
          Skills &amp; Services
        </span>

        <div className="skills-tabs">
          {categories.map((c) => (
            <motion.button
              key={c}
              type="button"
              className={`skills-tab${tab === c ? " active" : ""}`}
              onClick={() => setTab(c)}
              whileTap={{ scale: 0.97 }}
            >
              {tab === c && <span>[</span>}
              {c}
              {tab === c && <span>]</span>}
            </motion.button>
          ))}

          <span className="skills-hint">Grab &amp; throw →</span>
        </div>

        <div ref={areaRef} className="skills-canvas-area" />
      </div>
    </section>
  );
}