import AnimatedFeatures from "@/components/home/AnimatedFeatures";
import Hero from "@/components/home/Hero";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { ParallaxSection } from "@/components/home/ParallaxSection";
import { Products } from "@/components/home/Products";
import { HERO_CONFIG, ANIMATED_FEATURES_CONFIG, PARALLAX_SECTION_CONFIG, PRODUCTS_CATEGORIES_CONFIG, NEWSLETTER_SECTION_CONFIG } from "@/constants";

export default function Home() {
  return (
    <>
      <Hero slides={HERO_CONFIG.slides ?? []} />
      <div className="space-y-0">
        {ANIMATED_FEATURES_CONFIG.map((feature, index) => (
          <AnimatedFeatures key={index} {...feature} />
        ))}
        <ParallaxSection {...PARALLAX_SECTION_CONFIG} />
        <Products {...PRODUCTS_CATEGORIES_CONFIG} />
        <NewsletterSection {...NEWSLETTER_SECTION_CONFIG} />
      </div>
    </>
  );
}
