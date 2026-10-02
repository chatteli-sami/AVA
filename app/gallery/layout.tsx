import type { Metadata } from "next";
import { Inter_Tight } from "next/font/google";
import PageTransition from "../../components/work/PageTransition";
import styles from "../../styles/work.module.css";

const interTight = Inter_Tight({
  variable: "--font-work",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Featured Work — Studio AVA",
  description: "Projets d’intérieur et d’architecture livrés par le studio AVA.",
};

export default function GalleryLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className={`${styles.shell} ${interTight.variable}`}>
      <PageTransition>{children}</PageTransition>
    </div>
  );
}