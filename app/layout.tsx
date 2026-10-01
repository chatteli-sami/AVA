import type { Metadata } from "next";
import { Cormorant_Garamond, Montserrat } from "next/font/google";
import AnimatedLayout from "../components/AnimatedLayout";
import IntroFlight from "../components/IntroFlight";
import Header from "../components/home/Header";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "AVA RESIDENCES — Résidences de luxe aux Jardins de Carthage",
  description: "AVA RESIDENCES — Appartements de luxe aux Jardins de Carthage. Investissement exclusif, finitions premium, visites privées.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${cormorant.variable} ${montserrat.variable}`}>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body>
        <IntroFlight />
        <div id="site-content">
          <Header />
          <AnimatedLayout duration={0.42} easing={[0.22, 1, 0.36, 1]}>
            {children}
          </AnimatedLayout>
        </div>
      </body>
    </html>
  );
}
