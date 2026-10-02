import Link from "next/link";

const planCards = [
  {
    title: "Plan interactif",
    description: "Navigation cliquable de la façade et des étages du projet AVA.",
    href: "/docs/plans/",
    tag: "Interactive",
  },
  {
    title: "S+3",
    description: "Appartement spacieux avec distribution pensée pour un quotidien élégant.",
    href: "/docs/Plans-AVA-S3.pdf",
    tag: "PDF",
  },
  {
    title: "S+4.5",
    description: "Typologie premium avec volumes généreux et qualité d’exception.",
    href: "/docs/Plans-AVA-S45.pdf",
    tag: "PDF",
  },
  {
    title: "Duplex",
    description: "Périmètre haut standing, piscines privatives et finitions raffinées.",
    href: "/docs/Plans-AVA-Duplex.pdf",
    tag: "PDF",
  },
];

export default function PlansPage() {
  return (
    <main className="pack-page pack-page--plans">
      <div className="container pack-page-actions">
        <Link className="btn btn--primary" href="/pack">Retour au pack</Link>
      </div>

      <section className="pack-section">
        <div className="container">
          <div className="section-head">
            <h2>Plans interactifs & documents</h2>
            <p>Accédez directement au plan cliquable et aux documents de chaque typologie.</p>
          </div>

          <div className="grid3">
            {planCards.map((plan) => (
              <article className="box" key={plan.title}>
                <div className="box__top">
                  <h3>{plan.title}</h3>
                  <span className="tag">{plan.tag}</span>
                </div>
                <p className="muted">{plan.description}</p>
                <div className="box__actions">
                  <a className="btn btn--primary" href={plan.href} target={plan.href.startsWith("/docs/") ? undefined : "_blank"} rel={plan.href.startsWith("/docs/") ? undefined : "noreferrer"}>
                    Ouvrir le plan
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
