import { stats } from "./content";

export default function HeroSection() {
  return (
    <section className="hero" id="hero">
      <div className="container">
        <div className="hero-content">
          <div className="hero-left">
            <img src="/images/Oiseau.png" alt="Emblème AVA" className="oiseau" width={120} height={120} loading="eager" />
          </div>

          <div className="hero-right">
            <div className="hero-subtitle">Signature Residences</div>
            <img src="/images/Une Melodie de Luxe et de Raffinement.png" alt="Une mélodie de luxe et de raffinement" className="melodie" width={900} height={160} loading="eager" />

            <p>Dans l’univers fascinant d’AVA Residences, où chaque espace inspire le génie des plus grands maîtres. Découvrez un projet unique, conçu majestueusement pour éveiller vos sens et sublimer votre quotidien.</p>

            <div className="stats-grid">
              {stats.map((stat) => (
                <div className="stat-item" key={stat.label}>
                  <div className="stat-value">{stat.value}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="hero-buttons">
              <a href="/pack" className="cta-button">Accéder à l’expérience AVA</a>
              <a href="#contact" className="cta-button">Réserver ma visite</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
