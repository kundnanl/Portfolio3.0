"use client";

import dynamic from "next/dynamic";
import SmoothScroll   from "@/components/ui/SmoothScroll";
import CustomScrollbar from "@/components/ui/CustomScrollbar";
import MagneticCursor  from "@/components/ui/MagneticCursor";
import Navbar          from "@/components/ui/Navbar";
import HeroSection     from "@/components/sections/HeroSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import AboutSection    from "@/components/sections/AboutSection";
import FooterSection   from "@/components/sections/FooterSection";

const SkillsSection = dynamic(
  () => import("@/components/sections/SkillsSection"),
  { ssr: false }
);

export default function Home() {
  return (
    <SmoothScroll>
      <MagneticCursor />
      <CustomScrollbar />
      <Navbar />
      <HeroSection />
      <ProjectsSection />
      <AboutSection />
      <SkillsSection />
      <FooterSection />
    </SmoothScroll>
  );
}
