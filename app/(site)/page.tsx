import ContactSection from "../../components/home/ContactSection";
import FeaturesSection from "../../components/home/FeaturesSection";
import GallerySection from "../../components/home/GallerySection";
import IntroSection from "../../components/home/IntroSection";
import InventoryHashRedirect from "../../components/InventoryHashRedirect";
import LocationSection from "../../components/home/LocationSection";
import PromoterSection from "../../components/home/PromoterSection";
import ScrollStorySection from "../../components/home/ScrollStorySection";
import Section from "../../components/Section";
import SiteFooter from "../../components/home/SiteFooter";
import TestimonialsSection from "../../components/home/TestimonialsSection";

export default function Home() {
  return (
    <>
      <InventoryHashRedirect />
      <main>
        <ScrollStorySection />
        <IntroSection />
        <Section threshold={0.12} once>
          <LocationSection />
        </Section>
        <Section threshold={0.12} once>
          <FeaturesSection />
        </Section>
        {/* No <Section> wrapper: the gallery animates its own cards on scroll,
            and a parent with `variants` would propagate down and override it. */}
        <GallerySection />
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
