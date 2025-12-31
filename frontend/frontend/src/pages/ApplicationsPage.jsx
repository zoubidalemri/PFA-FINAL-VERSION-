// src/pages/ApplicationsPage.jsx
import { getOfferById } from "../data/Offers";
import { Link } from "react-router-dom";

const FAKE_APPS = [
  { id: 1, jobId: 1, appliedAt: "2025-11-20", status: "En cours" },
  { id: 2, jobId: 2, appliedAt: "2025-11-18", status: "Entretien" },
];

function ApplicationsPage() {
  return (
    <div className="page">
      <header className="page-header">
        <h1>Mes candidatures</h1>
        <p>Suivi de l&apos;état de toutes tes candidatures.</p>
      </header>

      <main className="page-content">
        <div className="cards">
          {FAKE_APPS.map((app) => {
            const offer = getOfferById(app.jobId);
            if (!offer) return null;

            return (
              <div key={app.id} className="card">
                <h2>{offer.title}</h2>
                <p className="muted">
                  {offer.company} • {offer.location} • Candidature du{" "}
                  {new Date(app.appliedAt).toLocaleDateString()}
                </p>
                <p>Statut : {app.status}</p>

                <Link to={`/jobs/${offer.id}`} className="btn-secondary">
                  Voir l&apos;offre (détails RH)
                </Link>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}

export default ApplicationsPage;
