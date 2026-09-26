import { HeroSection } from "@/components/home/hero-section";
import {
  CtaSection,
  FaqSection,
  FeaturesSection,
  HowItWorksSection,
  SupportedPlatformsSection,
} from "@/components/home/sections";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <SupportedPlatformsSection />
      <HowItWorksSection />
      <FeaturesSection />
      <FaqSection />
      <CtaSection />
    </>
  );
}
