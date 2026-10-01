export default function LocationSection() {
  return (
    <section className="location-section">
      <div className="container">
        <div className="location-container">
          <div className="location-map">
            <div className="ava-map-static" aria-label="Carte AVA">
              <div className="map-pin">AVA</div>
            </div>
          </div>
          <div className="location-info">
            <ul className="key-numbers">
              <li><span className="number">09 min</span> <span className="label">Carrefour</span></li>
              <li><span className="number">15 min</span> <span className="label">Aéroport Tunis-Carthage</span></li>
              <li><span className="number">05 min</span> <span className="label">Tunisia Mall</span></li>
              <li><span className="number">10 min</span> <span className="label">La Marsa</span></li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
