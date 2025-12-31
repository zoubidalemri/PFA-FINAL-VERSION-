import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "../Styles/candidate-home.css";
import { useAuth } from "../context/AuthContext";
import { FAKE_OFFERS } from "../data/Offers";

function CandidateHome() {
  const { user } = useAuth();
  const [showAssistant, setShowAssistant] = useState(false);
  const [assistantMessage, setAssistantMessage] = useState("");
  const [stats, setStats] = useState({
    profileViews: 0,
    newMatches: 0,
    responsesReceived: 0
  });

  const candidate = {
    firstName: user?.firstName || "Candidat(e)",
    avatar: user?.avatar || null,
    status: user ? "En recherche d'opportunités" : "Connecte-toi pour personnaliser ton dashboard",
    profileCompletion: 70,
    targetJob: "Développeur backend junior",
    skills: ["JavaScript", "React", "Node.js", "PostgreSQL"],
    experience: "2 ans",
    availability: "Immédiate"
  };

  // Simulate real-time stats updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        profileViews: prev.profileViews + Math.floor(Math.random() * 3),
        newMatches: prev.newMatches + (Math.random() > 0.8 ? 1 : 0),
        responsesReceived: prev.responsesReceived + (Math.random() > 0.9 ? 1 : 0)
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // AI Assistant intelligence
  const assistantMessages = [
    "🎯 J'ai trouvé 3 nouvelles offres qui correspondent parfaitement à ton profil !",
    "💡 Ton profil a été vu 12 fois aujourd'hui. Continue comme ça !",
    "✨ Astuce : Ajouter des projets récents pourrait augmenter tes chances de 40%",
    "🚀 2 recruteurs ont consulté ton profil cette semaine !",
    "📈 Ton taux de matching a augmenté de 15% ce mois-ci"
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAssistant(true);
      setAssistantMessage(assistantMessages[Math.floor(Math.random() * assistantMessages.length)]);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Enhanced recommendations with AI scoring
  const recommendedJobs = FAKE_OFFERS.map((offer, index) => ({
    id: offer.id,
    title: offer.title,
    company: offer.company,
    location: offer.location,
    matchScore: offer.id === 1 ? 92 : offer.id === 2 ? 86 : 81,
    matchReasons: offer.id === 1 
      ? ["Tech stack correspond", "Niveau d'expérience", "Localisation"]
      : offer.id === 2 
      ? ["Compétences requises", "Type de contrat"]
      : ["Secteur d'activité"],
    salary: offer.id === 1 ? "45-55k €" : offer.id === 2 ? "40-50k €" : "42-52k €",
    remote: offer.id === 1 ? "Hybride" : offer.id === 2 ? "Full remote" : "Présentiel",
    postedDate: new Date(Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000).toLocaleDateString()
  }));

  const applications = [
    { 
      id: 1, 
      jobId: 1, 
      appliedAt: "2025-11-20", 
      status: "En cours",
      stage: "CV examiné",
      nextStep: "Entretien RH prévu"
    },
    { 
      id: 2, 
      jobId: 2, 
      appliedAt: "2025-11-18", 
      status: "Entretien",
      stage: "1er entretien passé",
      nextStep: "Test technique"
    },
  ];

  // Generate avatar initials or use image
  const getAvatarContent = () => {
    if (candidate.avatar) {
      return <img src={candidate.avatar} alt={candidate.firstName} />;
    }
    const initials = candidate.firstName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    return <span className="avatar-initials">{initials}</span>;
  };

  return (
    <div className="dashboard">
      {/* AI ASSISTANT FLOATING */}
      {showAssistant && (
        <div className={`ai-assistant ${showAssistant ? 'ai-assistant-visible' : ''}`}>
          <div className="ai-assistant-avatar">
            <div className="ai-avatar-pulse"></div>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="16" r="16" fill="url(#gradient-ai)" />
              <path d="M16 8L18.5 13.5L24 16L18.5 18.5L16 24L13.5 18.5L8 16L13.5 13.5L16 8Z" fill="white" />
              <defs>
                <linearGradient id="gradient-ai" x1="0" y1="0" x2="32" y2="32">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div className="ai-assistant-content">
            <div className="ai-assistant-name">Assistant IA</div>
            <div className="ai-assistant-message">{assistantMessage}</div>
          </div>
          <button 
            className="ai-assistant-close"
            onClick={() => setShowAssistant(false)}
            aria-label="Fermer"
          >
            ×
          </button>
        </div>
      )}

      <div className="dashboard-content">
        {/* ENHANCED HEADER WITH AVATAR */}
        <div className="dashboard-header">
          <div className="dashboard-header-content">
            <div className="dashboard-user-section">
              <div className="user-avatar-wrapper">
                <div className="user-avatar">
                  {getAvatarContent()}
                </div>
                <div className="user-avatar-status"></div>
              </div>
              <div className="user-info">
                <h1>Bienvenue, {candidate.firstName}</h1>
                <p className="dashboard-subtitle">
                  {candidate.status}
                </p>
                <div className="user-quick-stats">
                  <span className="quick-stat">
                    <span className="stat-icon">💼</span>
                    {candidate.experience}
                  </span>
                  <span className="quick-stat">
                    <span className="stat-icon">📍</span>
                    {candidate.availability}
                  </span>
                </div>
              </div>
            </div>
            {!user && (
              <div className="auth-prompt">
                <p>Tu n'es pas connecté(e).</p>
                <div className="auth-buttons">
                  <Link to="/login" className="btn-auth-primary">Connexion</Link>
                  <Link to="/signup" className="btn-auth-secondary">Créer un compte</Link>
                </div>
              </div>
            )}
          </div>
          <button className="btn-ai-chat">
            <span className="btn-ai-icon">✨</span>
            <span>Parler au conseiller IA</span>
          </button>
        </div>

        {/* REAL-TIME STATS BAR */}
        <div className="stats-bar">
          <div className="stat-card">
            <div className="stat-icon-wrapper stat-icon-views">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.profileViews}</div>
              <div className="stat-label">Vues du profil</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon-wrapper stat-icon-matches">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.newMatches}</div>
              <div className="stat-label">Nouveaux matchs</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon-wrapper stat-icon-responses">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.responsesReceived}</div>
              <div className="stat-label">Réponses reçues</div>
            </div>
          </div>
        </div>

        {/* MAIN GRID */}
        <div className="dashboard-grid">
          {/* PROFILE CARD WITH ENHANCED VISUALS */}
          <div className="card profile-card">
            <div className="card-header">
              <h3>Mon profil</h3>
              <span className="profile-badge">Premium</span>
            </div>
            
            <div className="profile-completion-section">
              <div className="progress-container">
                <div className="progress-label">
                  <span>Complétion du profil</span>
                  <span className="progress-percentage">{candidate.profileCompletion}%</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-bar-fill" 
                    style={{ width: `${candidate.profileCompletion}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="profile-tips">
                <div className="tip-item">
                  <span className="tip-icon">📝</span>
                  <span>Ajoute 2 projets pour atteindre 85%</span>
                </div>
                <div className="tip-item">
                  <span className="tip-icon">🎓</span>
                  <span>Complète tes certifications</span>
                </div>
              </div>
            </div>

            <div className="profile-skills">
              <h4>Compétences principales</h4>
              <div className="skills-grid">
                {candidate.skills.map((skill, idx) => (
                  <span key={idx} className="skill-badge">{skill}</span>
                ))}
              </div>
            </div>

            <Link to="/profile" className="btn-small btn-full-width">
              <span>Voir / modifier mon profil</span>
            </Link>
          </div>

          {/* TARGET JOB CARD */}
          <div className="card target-card">
            <div className="card-header">
              <h3>Poste cible</h3>
              <span className="target-status">Actif</span>
            </div>
            
            <div className="target-job-content">
              <div className="target-job-title">
                <span className="target-icon">🎯</span>
                <h4>{candidate.targetJob}</h4>
              </div>
              
              <div className="target-preferences">
                <div className="preference-item">
                  <span className="preference-label">Type de contrat</span>
                  <span className="preference-value">CDI</span>
                </div>
                <div className="preference-item">
                  <span className="preference-label">Télétravail</span>
                  <span className="preference-value">Hybride</span>
                </div>
                <div className="preference-item">
                  <span className="preference-label">Salaire souhaité</span>
                  <span className="preference-value">45-55k €</span>
                </div>
              </div>
            </div>

            <Link to="/candidate/career-path" className="btn-small btn-full-width">
  <span>Voir le parcours objectif</span>
</Link>

          </div>
        </div>

        {/* JOBS & APPLICATIONS SECTION */}
        <div className="dashboard-grid dashboard-grid-large">
          {/* RECOMMENDED JOBS - ENHANCED */}
          <div className="card jobs-card">
            <div className="card-header">
              <h3>Offres recommandées pour toi</h3>
              <span className="recommendation-badge">
                <span className="badge-icon">✨</span>
                IA
              </span>
            </div>

            {recommendedJobs.length === 0 ? (
              <div className="empty-state">
                <p>Aucune recommandation.</p>
              </div>
            ) : (
              <ul className="list jobs-list">
                {recommendedJobs.map((job) => (
                  <li key={job.id} className="list-item job-item">
                    <div className="job-item-content">
                      <div className="job-header">
                        <h4>{job.title}</h4>
                        <span className="match-score">
                          <span className="match-icon">⚡</span>
                          {job.matchScore}%
                        </span>
                      </div>
                      <div className="job-company">
                        {job.company} • {job.location}
                      </div>
                      <div className="job-meta">
                        <span className="job-meta-item">
                          <span className="meta-icon">💰</span>
                          {job.salary}
                        </span>
                        <span className="job-meta-item">
                          <span className="meta-icon">🏠</span>
                          {job.remote}
                        </span>
                        <span className="job-meta-item">
                          <span className="meta-icon">📅</span>
                          {job.postedDate}
                        </span>
                      </div>
                      <div className="job-match-reasons">
                        {job.matchReasons.map((reason, idx) => (
                          <span key={idx} className="match-reason-tag">
                            {reason}
                          </span>
                        ))}
                      </div>
                    </div>
                    <Link to={`/jobs/${job.id}`} className="btn-small btn-job-view">
                      Voir l'offre
                    </Link>
                  </li>
                ))}
              </ul>
            )}

            <Link to="/jobs" className="btn-small btn-full-width btn-see-all">
              Voir toutes les offres
            </Link>
          </div>

          {/* APPLICATIONS - ENHANCED */}
          <div className="card applications-card">
            <div className="card-header">
              <h3>Mes dernières candidatures</h3>
              <span className="applications-count">{applications.length}</span>
            </div>

            {applications.length === 0 ? (
              <div className="empty-state">
                <p>Aucune candidature.</p>
              </div>
            ) : (
              <ul className="list applications-list">
                {applications.map((app) => {
                  const offer = FAKE_OFFERS.find((o) => o.id === app.jobId);
                  if (!offer) return null;

                  return (
                    <li key={app.id} className="list-item application-item">
                      <div className="application-item-content">
                        <div className="application-header">
                          <h4>{offer.title}</h4>
                          <span className={`status-badge status-${app.status.toLowerCase().replace(' ', '_')}`}>
                            {app.status}
                          </span>
                        </div>
                        <div className="application-company">
                          {offer.company}
                        </div>
                        <div className="application-timeline">
                          <div className="timeline-item">
                            <span className="timeline-icon">📤</span>
                            <span className="timeline-text">
                              Candidature du {new Date(app.appliedAt).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="timeline-item">
                            <span className="timeline-icon">📋</span>
                            <span className="timeline-text">{app.stage}</span>
                          </div>
                          <div className="timeline-item timeline-item-next">
                            <span className="timeline-icon">⏭️</span>
                            <span className="timeline-text">{app.nextStep}</span>
                          </div>
                        </div>
                      </div>
                      <Link to={`/jobs/${app.jobId}`} className="btn-small btn-application-view">
                        Voir l'offre
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}

            <Link to="/applications" className="btn-small btn-full-width btn-see-all">
              Voir toutes mes candidatures
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CandidateHome;