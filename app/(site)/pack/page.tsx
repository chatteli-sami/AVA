"use client";

import Link from "next/link";
import { useState } from "react";

const quickLinks = [
  { label: "WhatsApp", href: "https://wa.me/21692700100", icon: "🟢" },
  { label: "Appeler", href: "tel:+21692700100", icon: "📞" },
  { label: "Brochure", href: "/docs/AVA-Brochure.pdf", icon: "⬇️" },
  { label: "Plans interactifs", href: "/plans", icon: "🗺️" },
];

const highlights = [
  "20 unités haut standing",
  "S+3 • S+4.5 • Duplex",
  "8 duplex",
];

const points = [
  { label: "05 min", value: "Tunisia Mall" },
  { label: "09 min", value: "Carrefour" },
  { label: "10 min", value: "La Marsa" },
  { label: "15 min", value: "Aéroport Tunis-Carthage" },
];

const packMessage =
  "AVA Residences — projet d'exception aux Jardins de Carthage. Visites privées sur rendez-vous. Contact: +216 92 700 100";

export default function PackPage() {
  const [copied, setCopied] = useState(false);

  const copyText = async (value: string) => {
    try {
      if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
        await navigator.clipboard.writeText(value);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = value;
        textarea.setAttribute("readonly", "true");
        textarea.style.position = "fixed";
        textarea.style.left = "-9999px";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }

      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const handleShare = async () => {
    const sharePayload = {
      title: "AVA Residences",
      text: packMessage,
      url: typeof window !== "undefined" ? window.location.href : "https://ava-residences.example",
    };

    if (navigator.share) {
      try {
        await navigator.share(sharePayload);
        return;
      } catch {
        // Fall back to clipboard copy
      }
    }

    await copyText(packMessage);
  };

  return (
    <main className="pack-page">
      <div className="container pack-page-actions">
        <div className="topbar__actions">
          <button type="button" className="btn btn--ghost" onClick={() => copyText(packMessage)}>
            {copied ? "Copié !" : "Copier"}
          </button>
          <a className="btn btn--primary" href="https://wa.me/21692700100" target="_blank" rel="noreferrer">WhatsApp</a>
        </div>
      </div>

      <section className="hero-pack">
        <div className="container hero-pack__grid">
          <div className="hero-pack__left">
            <div className="kicker">AVA RESIDENCES</div>
            <h1>Pack d’informations</h1>
            <p>
              Tout ce qu’il faut pour décider vite : brochure, plans, localisation et contact direct.
              Conçu pour être partagé en quelques secondes.
            </p>

            <div className="pillrow" aria-label="Chiffres clés">
              {highlights.map((item) => (
                <span key={item} className="pill">{item}</span>
              ))}
            </div>

            <div className="quick">
              {quickLinks.map((item) => (
                <a
                  key={item.label}
                  className="cardbtn"
                  href={item.href}
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                  rel={item.href.startsWith("http") ? "noreferrer" : undefined}
                >
                  <span className="cardbtn__ico" aria-hidden="true">{item.icon}</span>
                  <span className="cardbtn__txt">
                    <strong>{item.label}</strong>
                    <em>{item.label === "Brochure" ? "Télécharger (PDF)" : item.label === "Plans interactifs" ? "Ouvrir" : "Demander disponibilités"}</em>
                  </span>
                </a>
              ))}
            </div>

            <div className="note">
              Astuce : en rendez-vous, clique sur <strong>Copier</strong> puis colle sur WhatsApp / Messenger.
            </div>
          </div>

          <div className="hero-pack__right">
            <div className="heroCard">
              <img src="/images/SuitePanoramique.jpg" alt="Suite panoramique AVA" width={900} height={600} loading="lazy" />
              <div className="heroCard__overlay">
                <div className="heroCard__badge">Jardins de Carthage</div>
                <div className="heroCard__line">Résidence d’exception — visites privées</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pack-section">
        <div className="container">
          <div className="section-head">
            <h2>Plans & typologies</h2>
            <p>Envoie un lien direct ou un PDF. Zéro friction.</p>
          </div>

          <div className="grid3">
            <article className="box">
              <div className="box__top">
                <h3>S+3</h3>
                <span className="tag">Piscine selon lot</span>
              </div>
              <p className="muted">Plan PDF prêt à partager + aperçu rapide.</p>
              <div className="box__actions">
                <a className="btn btn--ghost" href="/docs/Plans-AVA-S3.pdf" target="_blank" rel="noreferrer">Voir PDF</a>
                <button type="button" className="btn btn--primary" onClick={handleShare}>Partager</button>
              </div>
            </article>

            <article className="box">
              <div className="box__top">
                <h3>S+4.5</h3>
                <span className="tag">Premium</span>
              </div>
              <p className="muted">Plan PDF + détails. Format optimisé WhatsApp.</p>
              <div className="box__actions">
                <a className="btn btn--ghost" href="/docs/Plans-AVA-S45.pdf" target="_blank" rel="noreferrer">Voir PDF</a>
                <button type="button" className="btn btn--primary" onClick={handleShare}>Partager</button>
              </div>
            </article>

            <article className="box">
              <div className="box__top">
                <h3>Duplex</h3>
                <span className="tag">Piscines privatives</span>
              </div>
              <p className="muted">Plan PDF + concept duplex. Ultra clair.</p>
              <div className="box__actions">
                <a className="btn btn--ghost" href="/docs/Plans-AVA-Duplex.pdf" target="_blank" rel="noreferrer">Voir PDF</a>
                <button type="button" className="btn btn--primary" onClick={handleShare}>Partager</button>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="pack-section pack-section--soft">
        <div className="container">
          <div className="section-head">
            <h2>Localisation</h2>
            <p>Un seul bouton : ouvrir l’itinéraire.</p>
          </div>

          <div className="grid2">
            <div className="box">
              <h3>Points clés</h3>
              <ul className="list">
                {points.map((point) => (
                  <li key={point.label}><strong>{point.label}</strong> {point.value}</li>
                ))}
              </ul>
              <a className="btn btn--primary" href="https://www.google.com/maps?q=36.8495089,10.2992665" target="_blank" rel="noreferrer">Ouvrir Google Maps</a>
            </div>

            <div className="box">
              <h3>Contact direct</h3>
              <p className="muted">Réponse rapide. Visites privées sur rendez-vous.</p>

              <div className="contact">
                <a className="contact__row" href="tel:+21692700100"><span className="contact__k">Téléphone</span><span className="contact__v">+216 92 700 100</span></a>
                <a className="contact__row" href="mailto:commercial@promed.tn"><span className="contact__k">Email</span><span className="contact__v">commercial@promed.tn</span></a>
                <div className="contact__row" role="text"><span className="contact__k">Adresse</span><span className="contact__v">Rue du lac Chad, Zen Building — 1053 Les Berges du Lac</span></div>
              </div>

              <div className="box__actions">
                <Link className="btn btn--ghost" href="/">Site complet</Link>
                <Link className="btn btn--primary" href="/#contact">Réserver une visite</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
