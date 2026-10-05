"use client";

import { useEffect, useRef, useState } from "react";
import { MapPinIcon, CrownIcon, GemIcon } from "./FeaturesIcons";
import styles from "./FeaturesSection.module.css";

interface FeatureCardProps {
  index: number;
  icon: React.ReactNode;
  number: string;
  title: string;
  text: string;
  tag: string;
  watermark: string;
  inView: boolean;
}

function FeatureCard({
  index,
  icon,
  number,
  title,
  text,
  tag,
  watermark,
  inView,
}: FeatureCardProps) {
  const cardRef = useRef<HTMLElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const reducedMotionRef = useRef(false);

  useEffect(() => {
    reducedMotionRef.current =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  return (
    <article
      ref={cardRef}
      className={`${styles.featureCard} ${inView ? styles.visible : ""} ${
        isHovered ? styles.hovered : ""
      }`}
      style={{
        "--index": index,
        "--delay": `${index * 150}ms`,
      } as React.CSSProperties}
      onPointerEnter={() => !reducedMotionRef.current && setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
      onFocus={() => !reducedMotionRef.current && setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
      tabIndex={0}
      aria-label={title}
    >
      <span className={styles.cardNumber}>{number}</span>
      <div className={styles.cardBody}>
        <div className={styles.iconWrapper}>
          <div className={styles.iconCircle} aria-hidden="true">
            {icon}
          </div>
          <svg className={styles.dottedRing} viewBox="0 0 100 100" aria-hidden="true">
            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 6" strokeDashoffset="0" pathLength="1" />
          </svg>
        </div>
        <h3 className={styles.cardTitle}>{title}</h3>
        <p className={styles.cardText}>{text}</p>
        <span className={styles.cardTag}>
          <span className={styles.tagLine} aria-hidden="true" />
          {tag}
          <span className={styles.tagLine} aria-hidden="true" />
        </span>
      </div>
      <span className={styles.cardWatermark} aria-hidden="true">
        {watermark}
      </span>
    </article>
  );
}

interface StatItemProps {
  countTo: number | null;
  label: string;
  inView: boolean;
}

function StatItem({ countTo, label, inView }: StatItemProps) {
  const [count, setCount] = useState(() => countTo ?? 0);
  const shouldAnimate = useRef(false);

  useEffect(() => {
    if (!inView || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      shouldAnimate.current = false;
      return;
    }
    shouldAnimate.current = true;
    let frame = 0;
    const totalFrames = 60;
    const animate = () => {
      if (!shouldAnimate.current) return;
      frame++;
      const progress = frame / totalFrames;
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * (countTo ?? 0)));
      if (frame < totalFrames) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
    return () => {
      shouldAnimate.current = false;
    };
  }, [inView, countTo]);

  return (
    <li className={styles.statItem}>
      <span className={styles.statValue} aria-label={label}>
        {countTo !== null ? `${count.toLocaleString()} MIN` : ""}
      </span>
      <span className={styles.statLabel}>{label}</span>
    </li>
  );
}

export default function FeaturesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [sectionInView, setSectionInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setSectionInView(entry.isIntersecting),
      { threshold: 0.2, rootMargin: "0px 0px -100px 0px" }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const cardData = [
    {
      icon: <MapPinIcon width={32} height={32} />,
      number: "01",
      title: "Emplacement exclusif",
      text: "Au cœur des Jardins de Carthage, 10 minutes de l'aéroport, 5 minutes de Tunisia Mall, proche universités, écoles, banques et assurances.",
      tag: "Carthage",
      watermark: "1",
    },
    {
      icon: <CrownIcon width={32} height={32} />,
      number: "02",
      title: "Luxe & bien-être",
      text: "Aux étages, des piscines privatives offrent un havre de tranquillité, un cadre intime et exclusif.",
      tag: "Piscines privatives",
      watermark: "2",
    },
    {
      icon: <GemIcon width={32} height={32} />,
      number: "03",
      title: "Élégance & confort",
      text: "Chaque détail crée une atmosphère d'élégance subtile et de luxe raffiné.",
      tag: "Détails raffinés",
      watermark: "3",
    },
  ];

  const statsData = [
    { countTo: 10, label: "de l'aéroport" },
    { countTo: 5, label: "de Tunisia Mall" },
    { countTo: null, label: "Élégance & calme" },
  ];

  return (
    <section ref={sectionRef} className={styles.section} aria-labelledby="features-title">
      <div className={styles.container}>
        <header className={styles.header}>
          <span className={styles.kicker}>Signature Residences</span>
          <h2 id="features-title" className={styles.title}>
            Une mélodie de <span className={styles.luxe}>luxe</span> et de raffinement
          </h2>
          <div className={styles.ornament} aria-hidden="true">
            <span className={styles.ornamentLine} />
            <span className={styles.ornamentDiamond} />
            <span className={styles.ornamentLine} />
          </div>
        </header>

        <div className={styles.grid} role="list">
          {cardData.map((card, index) => (
            <FeatureCard
              key={card.title}
              index={index}
              inView={sectionInView}
              number={card.number}
              icon={card.icon}
              title={card.title}
              text={card.text}
              tag={card.tag}
              watermark={card.watermark}
            />
          ))}
        </div>

        <ul className={styles.statsStrip} role="list" aria-label="Statistiques clés">
          {statsData.map((stat, index) => (
            <StatItem key={index} inView={sectionInView} countTo={stat.countTo} label={stat.label} />
          ))}
        </ul>
      </div>
    </section>
  );
}