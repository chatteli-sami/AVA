import ContactSection from "../../components/home/ContactSection";
import FeaturesSection from "../../components/home/FeaturesSection";
import GallerySection from "../../components/home/GallerySection";
import HeroSection from "../../components/home/HeroSection";
import InventorySection from "../../components/home/InventorySection";
import LocationSection from "../../components/home/LocationSection";
import PromoterSection from "../../components/home/PromoterSection";
import ScrollStorySection from "../../components/home/ScrollStorySection";
import SiteFooter from "../../components/home/SiteFooter";
import TestimonialsSection from "../../components/home/TestimonialsSection";
import Section from "../../components/Section";

export default function Home() {
  return (
    <>
      <main>
        <ScrollStorySection />
        <Section threshold={0.12} rootMargin="0px 0px -72px 0px" once>
          <HeroSection />
        </Section>
        <Section threshold={0.12} once>
          <LocationSection />
        </Section>
        <Section threshold={0.12} once>
          <FeaturesSection />
        </Section>
        <Section threshold={0.12} once>
          <GallerySection />
        </Section>
        <Section threshold={0.12} once>
          <InventorySection />
        </Section>
        <Section threshold={0.12} once>
          <PromoterSection />
        </Section>
        <Section threshold={0.12} once>
          <TestimonialsSection />
        </Section>
        <Section threshold={0.12} once>
          <ContactSection />
        </Section>
      </main>
      <SiteFooter />
    </>
  );
}
