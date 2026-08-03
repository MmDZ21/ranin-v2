import type { Metadata } from "next";
import { AboutHero } from "@/components/pages/about/AboutHero";
import { AboutMissionVision } from "@/components/pages/about/AboutMissionVision";
import { AboutValues } from "@/components/pages/about/AboutValues";
import { AboutContact } from "@/components/pages/about/AboutContact";

export const metadata: Metadata = {
  title: "درباره ما",
  description:
    "آشنایی با تمرکز رانین فرایند بر تأمین رله‌های حفاظتی و تجهیزات حفاظت الکتریکی صنعتی.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <AboutMissionVision />
      <AboutValues />
      <AboutContact />
    </>
  );
}
