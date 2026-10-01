"use client";

import { useState } from "react";
import { inventory, type InventoryKey } from "./content";

export default function InventorySection() {
  const [openAccordion, setOpenAccordion] = useState<InventoryKey | null>("duplex");
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  return (
    <>
      <section id="inventaire" className="inventaire">
        <div className="container">
          <h2 className="inventaire-title">LISTES DES APPARTEMENTS ET DUPLEX</h2>

          <div className="inv-accordion" id="invAcc">
            {(Object.entries(inventory) as [InventoryKey, (typeof inventory)[InventoryKey]][]).map(([key, group]) => (
              <div className="inv-item" key={key}>
                <button
                  type="button"
                  className="inv-head"
                  aria-expanded={openAccordion === key}
                  onClick={() => setOpenAccordion((current) => (current === key ? null : key))}
                >
                  <span>{group.label}</span>
                  <em>EN SAVOIR PLUS</em>
                </button>

                {openAccordion === key && (
                  <div className="inv-panel" id={`panel-${key}`}>
                    <div className="inv-table-wrap">
                      <table className="inv-table">
                        <thead>
                          <tr>
                            <th>Référence</th>
                            <th>Surface</th>
                            <th>Chambres</th>
                            <th>Piscine</th>
                            <th>Plan</th>
                          </tr>
                        </thead>
                        <tbody>
                          {group.rows.map((row) => (
                            <tr key={row.reference}>
                              <td>{row.reference}</td>
                              <td>{row.surface}</td>
                              <td>{row.bedrooms}</td>
                              <td><span className={`badge ${row.pool === "Oui" ? "badge--green" : "badge--red"}`}>{row.pool}</span></td>
                              <td>
                                <button type="button" className="plan-btn" onClick={() => setSelectedPlan(row.planHref)}>
                                  {row.plan}
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {selectedPlan && (
        <div className="plan-modal-backdrop" onClick={() => setSelectedPlan(null)}>
          <div className="plan-modal" onClick={(event) => event.stopPropagation()}>
            <div className="plan-modal-header">
              <button type="button" className="plan-modal-close" onClick={() => setSelectedPlan(null)}>
                Fermer
              </button>
              <button type="button" className="plan-modal-return" onClick={() => setSelectedPlan(null)}>
                Retour aux plans
              </button>
            </div>
            <iframe title="Plan AVA" src={selectedPlan} className="plan-modal-frame" loading="lazy" />
          </div>
        </div>
      )}
    </>
  );
}
