# Portfolio 3.0 — Laksh Kundnani

Personal portfolio for Laksh Kundnani — Software & Data Engineer at RBC. Built with Next.js, Three.js, and a focus on interactive, physics-driven UI.

**LinkedIn:** [lakshkundnani](https://linkedin.com/in/lakshkundnani) &nbsp;|&nbsp; **GitHub:** [kundnanl](https://github.com/kundnanl) &nbsp;|&nbsp; **Email:** lakshkundnani78@gmail.com

---

## Tech Stack

| Layer | Tools |
|---|---|
| Framework | Next.js 15 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS 4, CSS custom properties |
| Animation | GSAP + ScrollTrigger, Framer Motion |
| 3D / Physics | Three.js, React Three Fiber, Drei, Matter.js |
| Smooth Scroll | Lenis |
| Icons | Lucide React |

---

## Sections

**Hero** — Animated title reveal with floating data-themed SVG icons (Kafka, Spark, pipelines, cloud nodes) and mouse parallax.

**Projects** — Sticky-card stack with 3D tilt + glare effect. Features *Remote Collab Hub* and *Cerebro*.

**About** — Word-by-word scroll-triggered paragraphs, stat grid, and a 3D draggable hobbies carousel.

**Skills** — Interactive Matter.js physics canvas. Drag skill pills around — they collide, bounce, and settle. Three tabs: Core Capabilities, Tech Stacks, Services.

**Footer** — Magnetic headline, live Toronto clock, email copy-to-clipboard, social links.

---

## UI Components

- **MagneticCursor** — Custom cursor with a ring that lerps behind, enlarges on hover, inverts over dark sections
- **SmoothScroll** — Lenis wrapper synced with GSAP ScrollTrigger
- **CustomScrollbar** — Draggable proportional scrollbar thumb
- **Navbar** — Hides on scroll-down, adapts color for dark sections via `data-dark` attribute

---

## Project Structure

```
portfolio3.0/
├── app/
│   ├── layout.tsx          # Root layout & metadata
│   ├── page.tsx            # Section composition
│   └── globals.css         # Design tokens, fonts, animations
├── components/
│   ├── sections/           # Hero, Projects, About, Skills, Footer
│   └── ui/                 # Navbar, SmoothScroll, MagneticCursor, CustomScrollbar
├── data/
│   └── portfolio.ts        # Personal info, projects, skills, hobbies
└── utils/
    └── smoothNav.ts        # Lenis scroll-to helper
```

---

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

**Add images** to `public/images/`:
- `project-1.jpg`, `project-2.jpg`
- `hobby-music.jpg`, `hobby-travel.jpg`, `hobby-gym.jpg`, `hobby-tech.jpg`, `hobby-sports.jpg`

**Update content** in `data/portfolio.ts`.

---

## Design System

| Token | Value |
|---|---|
| Cream | `#FAF7F2` |
| Ink | `#1A1612` |
| Accent / Gold | `#ebda28` |
| Display font | Yatra One (serif) |
| Mono font | DM Mono |
| Body font | Manrope |
| Base rem | `62.5%` (1rem = 10px) |

---

## License

MIT
