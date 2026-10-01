import ScrollLink from "../../components/ScrollLink";
import Section from "../../components/Section";
import styles from "../../styles/motion-demo.module.css";

const experiences = [
  { number: "01", title: "Route transitions", description: "Soft page transitions with reduced-motion support." },
  { number: "02", title: "Scroll reveals", description: "Reveal content only as it enters the viewport." },
  { number: "03", title: "Accessible anchors", description: "Navigate to a section and move keyboard focus with it." },
];

export default function MotionDemoPage() {
  return (
    <main className={styles.page}>
      <section className={styles.intro}>
        <p className={styles.eyebrow}>AVA · Motion system</p>
        <h1>Movement with purpose.</h1>
        <p className={styles.lede}>
          Scroll through the examples to see the reveal behavior. Use the links below to test same-page and cross-page navigation.
        </p>
        <div className={styles.actions}>
          <ScrollLink href="#staggered-list" className={styles.primaryLink}>View staggered reveal</ScrollLink>
          <ScrollLink href="/#contact" className={styles.textLink}>Go to homepage contact</ScrollLink>
        </div>
      </section>

      <Section
        id="staggered-list"
        className={styles.staggeredList}
        threshold={0.18}
        rootMargin="0px 0px -80px 0px"
        once
        staggerChildren={0.12}
      >
        <div className={styles.staggeredHeading}>
          <p className={styles.eyebrow}>Scroll reveal · Stagger 120ms</p>
          <h2>One moment at a time.</h2>
        </div>
        {experiences.map((experience) => (
          <article className={styles.experience} key={experience.number}>
            <span className={styles.number}>{experience.number}</span>
            <h3>{experience.title}</h3>
            <p>{experience.description}</p>
          </article>
        ))}
      </Section>

      <Section id="anchor-examples" className={styles.anchorSection} threshold={0.2} once={false}>
        <div>
          <p className={styles.eyebrow}>Navigation examples</p>
          <h2>Move between pages and sections.</h2>
          <p>Cross-page links preserve the destination hash, then scroll and focus the target after the route transition.</p>
        </div>
        <div className={styles.actions}>
          <ScrollLink href="/#gallery" className={styles.primaryLink}>Homepage gallery</ScrollLink>
          <ScrollLink href="/pack" className={styles.textLink}>Open the information pack</ScrollLink>
        </div>
      </Section>
    </main>
  );
}
