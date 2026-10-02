import type { Metadata } from "next";
import PageTransition from "../../components/work/PageTransition";
import styles from "../../styles/work.module.css";

export const metadata: Metadata = {
  title: "Featured Work — Studio AVA",
  description: "Projets d’intérieur et d’architecture livrés par le studio AVA.",
};

export default function GalleryLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className={styles.shell}>
      <PageTransition>{children}</PageTransition>
    </div>
  );
}