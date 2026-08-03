import type { Metadata } from "next";
import { AboutHero } from "@/components/pages/about/AboutHero";
import { AboutStats } from "@/components/pages/about/AboutStats";
import { AboutMissionVision } from "@/components/pages/about/AboutMissionVision";
import { AboutValues } from "@/components/pages/about/AboutValues";
import { AboutContact } from "@/components/pages/about/AboutContact";

export const metadata: Metadata = {
  title: "درباره ما",
  description:
    "آشنایی با رانین فرایند، پیشرو در تأمین و عرضه رله‌های حفاظتی و تجهیزات حفاظت الکتریکی صنعتی؛ مأموریت، ارزش‌ها و سابقه فعالیت ما.",
  alternates: { canonical: "/about" },
};

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
