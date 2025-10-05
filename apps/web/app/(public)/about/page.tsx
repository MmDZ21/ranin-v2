import { AboutHero } from "@/components/pages/about/AboutHero";
import { AboutStats } from "@/components/pages/about/AboutStats";
import { AboutMissionVision } from "@/components/pages/about/AboutMissionVision";
import { AboutValues } from "@/components/pages/about/AboutValues";
import { AboutContact } from "@/components/pages/about/AboutContact";

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <AboutStats />
      <AboutMissionVision />
      <AboutValues />
      <AboutContact />
    </>
  );
}
