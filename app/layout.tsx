import type { Metadata } from "next";
import { Cormorant_Garamond, Inter_Tight, Montserrat } from "next/font/google";
import CoverTransitionLayer from "../components/CoverTransitionLayer";
import ScrollReset from "../components/ScrollReset";
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
      </head>
      <body>
        <ScrollReset />
        {children}
        <CoverTransitionLayer />
      </body>
    </html>
  );
}