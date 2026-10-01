"use client";

import { type FormEvent, useState } from "react";

type ContactStatus = {
  type: "success" | "error";
  message: string;
};

export default function ContactSection() {
  const [status, setStatus] = useState<ContactStatus | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    setIsSubmitting(true);
    setStatus(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        body: formData,
      });

      const payload = (await response.json().catch(() => null)) as
        | { message?: string; error?: string }
        | null;

      if (!response.ok) {
        throw new Error(payload?.error || payload?.message || "Une erreur est survenue.");
      }

      setStatus({
        type: "success",
        message: payload?.message || "Merci, votre demande a été envoyée.",
      });
      form.reset();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erreur lors de l’envoi. Réessayez ou appelez-nous.";
      setStatus({ type: "error", message });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="contact-form-section" id="contact">
      <div className="container">
        <div className="section-header">
          <span className="section-subtitle">Contact exclusif</span>
          <h2>Votre résidence d’exception vous attend</h2>
          <div className="gold-line"></div>
          <p>Contactez notre équipe dédiée pour une visite privée.</p>
        </div>

        <div className="contact-form-container">
          <form id="ava-contact-form" className="contact-form" onSubmit={handleSubmit} noValidate>
            {status && <div className={`form-message ${status.type === "success" ? "success" : "error"}`}>{status.message}</div>}

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Nom complet *</label>
                <input type="text" id="name" name="name" required autoComplete="name" />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input type="email" id="email" name="email" required autoComplete="email" inputMode="email" />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="phone">Téléphone</label>
                <input type="tel" id="phone" name="phone" autoComplete="tel" inputMode="tel" />
              </div>
              <div className="form-group">
                <label htmlFor="subject">Sujet *</label>
                <select id="subject" name="subject" required>
                  <option value="">Sélectionnez un sujet</option>
                  <option value="Visite Privée">Demande de visite privée</option>
                  <option value="Information">Demande d’information</option>
                  <option value="Investissement">Opportunité d’investissement</option>
                  <option value="Rendez-vous">Prise de rendez-vous</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>
            </div>

            <div className="form-group full-width">
              <label htmlFor="message">Votre message *</label>
              <textarea id="message" name="message" rows={5} required></textarea>
            </div>

            <div className="form-submit">
              <button type="submit" className="cta-button" disabled={isSubmitting}>
                {isSubmitting ? "Envoi en cours..." : "Réserver ma visite privée"}
              </button>
            </div>

            <div className="form-notice">
              <p><i className="fas fa-lock" aria-hidden="true"></i> Données confidentielles, jamais partagées à des tiers.</p>
            </div>
          </form>

          <aside className="contact-info-sidebar" aria-label="Coordonnées">
            <div className="contact-info-card">
              <h3>Coordonnées directes</h3>
              <div className="contact-item">
                <div className="contact-icon"><i className="fas fa-envelope" aria-hidden="true"></i></div>
                <div className="contact-details"><h4>Email</h4><p>commercial@promed.tn</p></div>
              </div>
              <div className="contact-item">
                <div className="contact-icon"><i className="fas fa-phone" aria-hidden="true"></i></div>
                <div className="contact-details"><h4>Téléphone</h4><p>+216 92 700 100</p></div>
              </div>
              <div className="contact-item">
                <div className="contact-icon"><i className="fas fa-map-marker-alt" aria-hidden="true"></i></div>
                <div className="contact-details"><h4>Adresse</h4><p>Rue du lac Chad, Zen Building — 1053 Les Berges du Lac</p></div>
              </div>
              <div className="contact-item">
                <div className="contact-icon"><i className="fas fa-clock" aria-hidden="true"></i></div>
                <div className="contact-details"><h4>Disponibilité</h4><p>Lun–Ven : 8h–18h<br />Samedi : 9h–14h</p></div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
