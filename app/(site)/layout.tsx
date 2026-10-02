import IntroFlight from "../../components/IntroFlight";
import AnimatedLayout from "../../components/AnimatedLayout";
import { SITE_CONTENT_ID } from "../../components/intro-flight.constants";
import Header from "../../components/home/Header";

export default function SiteLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <IntroFlight />
      <div id={SITE_CONTENT_ID}>
        <Header />
        <AnimatedLayout duration={0.42} easing={[0.22, 1, 0.36, 1]}>
          {children}
        </AnimatedLayout>
      </div>
    </>
  );
}