import type { Metadata } from "next";
import { Cormorant_Garamond, Inter_Tight, Montserrat } from "next/font/google";
import CoverTransitionLayer from "../components/CoverTransitionLayer";
import ScrollReset from "../components/ScrollReset";
import GalleryReturnWatcher from "../components/GalleryReturnWatcher";
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

const interTight = Inter_Tight({
  variable: "--font-work",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "AVA RESIDENCES — Résidences de luxe aux Jardins de Carthage",
  description: "AVA RESIDENCES — Appartements de luxe aux Jardins de Carthage. Investissement exclusif, finitions premium, visites privées.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${cormorant.variable} ${montserrat.variable} ${interTight.variable}`}>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var d=document.documentElement;var skip=(window.matchMedia('(prefers-reduced-motion: reduce)').matches)||(function(){try{return sessionStorage.getItem('galleryReturnPending')==='true'}catch(e){return false}}());if(skip){d.dataset.intro='done';d.style.overflow=''}else{d.removeAttribute('data-intro')}})();`,
          }}
        />
        <style
          dangerouslySetInnerHTML={{
            __html: `#intro-overlay{position:fixed;inset:0;z-index:9999;background:#F0F1FA;overflow:hidden;opacity:1;visibility:visible;pointer-events:auto}#intro-overlay .active{opacity:1;visibility:visible}html[data-intro] #intro-overlay{opacity:0;visibility:hidden;pointer-events:none;transition:opacity 1000ms ease}html[data-intro="done"] #intro-overlay{transition:none}`,
          }}
        />
      </head>
      <body suppressHydrationWarning>
        <ScrollReset />
        <GalleryReturnWatcher />
        {children}
        <CoverTransitionLayer />
      </body>
    </html>
  );
}