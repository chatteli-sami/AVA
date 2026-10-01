import { features } from "./content";

export default function FeaturesSection() {
  return (
    <section className="features" id="features">
      <div className="container">
        <div className="section-title">
          <img src="/images/logoava.avif" alt="Logo AVA Tunis" className="logo-avif" width={200} height={70} loading="lazy" />
        </div>

        <div className="features-grid">
          {features.map((feature) => (
            <article className="feature-card" key={feature.title}>
              <div className="feature-icon" aria-hidden="true"><i className={`fas ${feature.icon}`}></i></div>
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
