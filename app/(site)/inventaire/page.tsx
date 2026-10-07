import type { Metadata } from "next";
import Link from "next/link";
import {
  getUnitsByType,
  maxSurface,
  minSurface,
  totalUnits,
  unitsWithPool,
  type UnitType,
} from "../../../data/inventory";
import InventoryTabs from "../../../components/InventoryTabs";
import SummaryStrip from "../../../components/SummaryStrip";
import InventoryList from "../../../components/InventoryList";
import styles from "../../../styles/inventory.module.css";

export const metadata: Metadata = {
  title: "Inventaire — Liste des appartements et duplex",
  description:
    "Découvrez l'inventaire complet d'AVA Residences : duplex avec piscine privative, appartements S+3 et S+4.5. Consultez les plans et demandez une visite privée.",
  keywords: [
    "inventaire",
    "appartements",
    "duplex",
    "S+3",
    "S+4.5",
    "AVA Residences",
    "plans",
    "immobilier",
    "Tunisie",
  ],
  openGraph: {
    title: "Inventaire — Liste des appartements et duplex",
    description:
      "Découvrez les duplex avec piscine privative et les appartements S+3 et S+4.5 d'AVA Residences.",
    type: "website",
    locale: "fr_FR",
    siteName: "AVA Residences",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
};

interface InventairePageProps {
  searchParams: Promise<{ type?: string }>;
}

export default async function InventairePage({ searchParams }: InventairePageProps) {
  const params = await searchParams;
  const rawType = params.type;
  const activeType: UnitType =
    rawType === "s3" || rawType === "s45" || rawType === "duplex" ? rawType : "duplex";

  const units = [...getUnitsByType(activeType)];
  const unitsWithPoolCount = unitsWithPool();

  return (
    <main className={styles.invPage}>
      <div className={styles.invContainer}>
        <header className={styles.invHeader}>
          <p className={styles.invEyebrow}>Signature Residences</p>
          <h1 className={styles.invTitle}>Liste des appartements et duplex</h1>
          <div className={styles.invOrnament} aria-hidden="true">
            <span className={styles.invOrnamentDiamond} />
          </div>
          <p className={styles.invLede}>
            Chaque unité est pensée pour un quotidien d&apos;exception. Consultez les plans,
            choisissez votre typologie et demandez une visite privée.
          </p>
        </header>

        <SummaryStrip
          total={totalUnits()}
          withPool={unitsWithPoolCount}
          minSurface={minSurface()}
          maxSurface={maxSurface()}
        />

        <InventoryTabs />

        <InventoryList key={activeType} units={units} activeType={activeType} />

        <div className={styles.invCta}>
          <p className={styles.invCtaK}>Une visite privée ?</p>
          <h2 className={styles.invCtaTitle}>Rencontrez l&apos;équipe AVA sur rendez-vous</h2>
          <Link className={styles.invBtn} href="/#contact">
            Réserver une visite
          </Link>
        </div>
      </div>
    </main>
  );
}
