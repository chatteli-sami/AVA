export default function SiteFooter() {
  return (
    <footer>
      <div className="container">
        <div className="footer-grid">
          <div className="footer-column">
            <img src="/images/logoava.avif" alt="AVA Tunis" width={200} height={70} loading="lazy" />
            <p>Redéfinir l’art de vivre en Tunisie avec des résidences d’exception qui allient luxe, confort et investissement intelligent.</p>
            <div className="social-links" aria-label="Réseaux sociaux">
              <a href="https://www.facebook.com/mzpromed/" target="_blank" rel="noreferrer"><i className="fab fa-facebook" aria-hidden="true"></i><span className="sr-only">Facebook</span></a>
              <a href="https://www.instagram.com/promed_immobiliere/" target="_blank" rel="noreferrer"><i className="fab fa-instagram" aria-hidden="true"></i><span className="sr-only">Instagram</span></a>
              <a href="https://www.linkedin.com/company/promed-tunisie/" target="_blank" rel="noreferrer"><i className="fab fa-linkedin-in" aria-hidden="true"></i><span className="sr-only">LinkedIn</span></a>
            </div>
          </div>

          <div className="footer-column">
            <h3>Découvrir</h3>
            <ul>
              <li><a href="#hero"><i className="fas fa-chevron-right"></i> Accueil</a></li>
              <li><a href="#features"><i className="fas fa-chevron-right"></i> Le concept</a></li>
              <li><a href="#gallery"><i className="fas fa-chevron-right"></i> Galerie</a></li>
              <li><a href="#testimonials"><i className="fas fa-chevron-right"></i> Témoignages</a></li>
              <li><a href="#contact"><i className="fas fa-chevron-right"></i> Contact</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h3>Contact</h3>
            <ul>
              <li><i className="fas fa-map-marker-alt"></i> Rue du lac Chad, Zen Building — Les Berges du Lac</li>
              <li><a href="tel:+21692700100"><i className="fas fa-phone"></i> +216 92 700 100</a></li>
              <li><a href="mailto:commercial@promed.tn"><i className="fas fa-envelope"></i> commercial@promed.tn</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h3>Visite privée</h3>
            <p>Réservez votre visite exclusive avec notre directeur de projet.</p>
            <a href="#contact" className="cta-button">Demander un rendez-vous</a>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} AVA. Tous droits réservés. | Conçu pour les investisseurs exigeants</p>
        </div>
      </div>
    </footer>
  );
}
