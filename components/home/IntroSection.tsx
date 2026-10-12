import AnimatedBuilding from "./AnimatedBuilding";
import AnimatedStat from "./AnimatedStat";
import AnimatedIntro from "./AnimatedIntro";
import FlyingHummingbird from "./FlyingHummingbird";
import { introButtons, introImages, introLabel, introParagraph, stats } from "./content";
import type { BuildingImage } from "./AnimatedBuilding";
import type { Stat } from "./AnimatedStat";
import styles from "./IntroSection.module.css";
import Image from "next/image";

export interface IntroSectionProps {
  /** Section label (e.g., "Signature Residences") */
  label?: string;
  /** Tagline image configuration */
  taglineImage?: BuildingImage;
  /** Main paragraph text */
  paragraph?: string;
  /** Action buttons */
  buttons?: ReadonlyArray<{ label: string; href: string; outlined: boolean }>;
  /** Statistics to display */
  stats?: ReadonlyArray<Stat>;
  /** Building image configuration */
  buildingImage?: BuildingImage;
  /** Hummingbird image configuration */
  hummingbirdImage?: BuildingImage;
  /** Section ID for navigation */
  id?: string;
  /** ARIA label for the section */
  ariaLabel?: string;
}

const defaultProps: Required<Omit<IntroSectionProps, "id" | "ariaLabel">> & { id: string; ariaLabel: string } = {
  label: introLabel,
  taglineImage: introImages.tagline,
  paragraph: introParagraph,
  buttons: introButtons,
  stats: stats,
  buildingImage: introImages.building,
  hummingbirdImage: introImages.hummingbird,
  id: "hero",
  ariaLabel: "AVA Residences - Signature Residences",
};

export default function IntroSection({
  label = defaultProps.label,
  taglineImage = defaultProps.taglineImage,
  paragraph = defaultProps.paragraph,
  buttons = defaultProps.buttons,
  stats: statsProp = defaultProps.stats,
  buildingImage = defaultProps.buildingImage,
  hummingbirdImage = defaultProps.hummingbirdImage,
  id = defaultProps.id,
  ariaLabel = defaultProps.ariaLabel,
}: IntroSectionProps) {
  return (
    <section
      className={styles.introSection}
      id={id}
      aria-labelledby="intro-label"
      aria-label={ariaLabel}
    >
      <AnimatedIntro>
        {/* Full-bleed building image with soft gradient mask */}
        <AnimatedBuilding image={buildingImage} />

        {/* Floating content panel */}
        <div className={styles.floatingPanel} id="intro-panel">
          <span className={styles.floatingDash} aria-hidden="true" />
          <h1 className={styles.floatingLabel} id="intro-label">
            {label}
          </h1>

          <Image
            className={styles.floatingTagline}
            src={taglineImage.src}
            alt={taglineImage.alt}
            width={taglineImage.width}
            height={taglineImage.height}
            loading="eager"
          />

          <div className={styles.floatingDivider} aria-hidden="true" />

          <p className={styles.floatingParagraph}>{paragraph}</p>

          <div className={styles.floatingButtons}>
            {buttons.map((button) => (
              <a
                key={button.href}
                href={button.href}
                className={`${styles.floatingButton} ${button.outlined ? styles.outlined : styles.filled}`}
              >
                {button.label}
                <span className={styles.buttonArrow} aria-hidden="true">
                  →
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* Stats band — reads from the same data as Inventaire */}
        <div className={styles.statsBand}>
          <ul className={styles.statsList}>
            {statsProp.map((stat, index) => {
              const s: Stat = stat;
              return (
                <AnimatedStat
                  key={s.label}
                  value={s.value}
                  label={s.label}
                  index={index}
                />
              );
            })}
          </ul>
        </div>
      </AnimatedIntro>

      {/* Hummingbird — decorative, behind content, flies on scroll */}
      <FlyingHummingbird image={hummingbirdImage} />
    </section>
  );
}