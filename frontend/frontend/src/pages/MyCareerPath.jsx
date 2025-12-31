// src/pages/MyCareerPath.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/myCareerPath.css";
import apiClient from "../api/client";
import { useAuth } from "../context/AuthContext";

const MOCK_CAREER_PATH = {
  targetJob: "PFE en cybersécurité – Analyste SOC junior",
  targetDomain: "Cybersécurité",
  objectiveType: "PFE",
  timeHorizonMonths: 6,
  description:
    "Obtenir un stage PFE en cybersécurité (SOC / Blue Team) et me reconvertir progressivement vers un poste d'analyste sécurité.",
  readinessScore: 35,
  actions: [
    {
      id: 1,
      label: "Suivre un cours complet sur les fondamentaux de la cybersécurité",
      category: "SKILL",
      completed: false,
      weight: 10,
      estimatedTime: "2-3 semaines",
      priority: "high"
    },
    {
      id: 2,
      label: "Obtenir une certification d'entrée (ex : Fortinet NSE1/2/3, ou équivalent)",
      category: "CERTIFICATION",
      completed: false,
      weight: 15,
      estimatedTime: "1-2 mois",
      priority: "high"
    },
    {
      id: 3,
      label: "Mettre en avant 1 projet lab (home lab, SIEM, etc.) sur le CV / GitHub",
      category: "EXPERIENCE",
      completed: false,
      weight: 15,
      estimatedTime: "2-4 semaines",
      priority: "medium"
    },
    {
      id: 4,
      label: "Améliorer l'anglais à un niveau B2 pour lire la doc / offres",
      category: "LANGUAGE",
      completed: true,
      weight: 10,
      estimatedTime: "Continue",
      priority: "medium"
    },
    {
      id: 5,
      label: "Adapter le CV et LinkedIn au profil cybersécurité",
      category: "CV",
      completed: false,
      weight: 10,
      estimatedTime: "1 semaine",
      priority: "high"
    },
    {
      id: 6,
      label: "Postuler à au moins 5 offres PFE en cybersécurité ciblées",
      category: "NETWORKING",
      completed: false,
      weight: 20,
      estimatedTime: "2-3 semaines",
      priority: "medium"
    },
  ],
};

const EMPTY_GOAL = {
  targetJob: "",
  targetDomain: "",
  objectiveType: "PFE",
  timeHorizonMonths: 6,
  description: "",
  readinessScore: 0,
  actions: [],
};

const CATEGORY_ICONS = {
  SKILL: "📚",
  CERTIFICATION: "🎓",
  EXPERIENCE: "💼",
  LANGUAGE: "🌐",
  CV: "📝",
  NETWORKING: "🤝",
  PROJECT: "🚀",
  OTHER: "✨"
};

const CATEGORY_LABELS = {
  SKILL: "Compétence",
  CERTIFICATION: "Certification",
  EXPERIENCE: "Expérience",
  LANGUAGE: "Langue",
  CV: "CV/Profil",
  NETWORKING: "Réseau",
  PROJECT: "Projet",
  OTHER: "Autre"
};

const PRIORITY_CONFIG = {
  high: { label: "Priorité haute", color: "priority-high" },
  medium: { label: "Priorité moyenne", color: "priority-medium" },
  low: { label: "Priorité basse", color: "priority-low" }
};

function MyCareerPath() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [careerPath, setCareerPath] = useState(EMPTY_GOAL);
  const [loading, setLoading] = useState(true);
  const [savingGoal, setSavingGoal] = useState(false);
  const [updatingFromProfile, setUpdatingFromProfile] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [showAIInsight, setShowAIInsight] = useState(false);

  // Redirection si non connecté
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  // Chargement du parcours objectif
  useEffect(() => {
    if (!user) return;

    const candidateId = user.id;

    const fetchCareerPath = async () => {
      try {
        const res = await apiClient.get(
          `/api/candidates/${candidateId}/career-path`
        );
        const data = res.data || {};
        setCareerPath({
          ...EMPTY_GOAL,
          ...data,
          actions: data.actions || [],
        });
        setMessage({ text: "", type: "" });
      } catch (err) {
        console.error("Erreur fetch career path, utilisation du MOCK", err);
        setCareerPath(MOCK_CAREER_PATH);
        setMessage({
          text: "Affichage d'un exemple de parcours objectif (backend non disponible ou non configuré).",
          type: "info"
        });
      } finally {
        setLoading(false);
        // Show AI insight after load
        setTimeout(() => setShowAIInsight(true), 1500);
      }
    };

    fetchCareerPath();
  }, [user]);

  // Calcul des statistiques
  const totalActions = careerPath.actions.length;
  const completedActions = careerPath.actions.filter((a) => a.completed).length;
  const checklistProgress =
    totalActions === 0
      ? 0
      : Math.round((completedActions / totalActions) * 100);

  const totalWeight = careerPath.actions.reduce((sum, a) => sum + (a.weight || 0), 0);
  const completedWeight = careerPath.actions
    .filter(a => a.completed)
    .reduce((sum, a) => sum + (a.weight || 0), 0);
  const weightedProgress = totalWeight === 0 ? 0 : Math.round((completedWeight / totalWeight) * 100);

  // Actions par priorité
  const highPriorityActions = careerPath.actions.filter(a => a.priority === "high" && !a.completed).length;
  const totalPriorityActions = careerPath.actions.filter(a => a.priority === "high").length;

  // Gestion des formulaires
  const handleGoalFieldChange = (e) => {
    const { name, value } = e.target;
    setCareerPath((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveGoal = async (e) => {
    e.preventDefault();
    if (!user) return;

    setSavingGoal(true);
    setMessage({ text: "", type: "" });

    try {
      const payload = {
        targetJob: careerPath.targetJob,
        targetDomain: careerPath.targetDomain,
        objectiveType: careerPath.objectiveType,
        timeHorizonMonths: careerPath.timeHorizonMonths,
        description: careerPath.description,
      };

      const res = await apiClient.put(
        `/api/candidates/${user.id}/career-path`,
        payload
      );

      const data = res.data || {};
      setCareerPath((prev) => ({
        ...prev,
        ...data,
        actions: data.actions || prev.actions,
      }));
      setMessage({ 
        text: "✓ Objectif enregistré avec succès.", 
        type: "success" 
      });
    } catch (err) {
      console.error("Erreur sauvegarde objectif", err);
      setMessage({ 
        text: "Erreur lors de l'enregistrement de l'objectif.", 
        type: "error" 
      });
    } finally {
      setSavingGoal(false);
    }
  };

  const handleGenerateFromProfile = async () => {
    if (!user) return;

    setUpdatingFromProfile(true);
    setMessage({ text: "", type: "" });

    try {
      const res = await apiClient.post(
        `/api/candidates/${user.id}/career-path/generate-from-profile`
      );
      const data = res.data || {};

      setCareerPath({
        ...EMPTY_GOAL,
        ...data,
        actions: data.actions || [],
      });

      setMessage({
        text: "✓ Parcours mis à jour à partir de ton profil. Vérifie les actions proposées.",
        type: "success"
      });
    } catch (err) {
      console.error("Erreur génération parcours depuis profil", err);
      setMessage({
        text: "Erreur lors de la génération du parcours. Vérifie que l'API backend existe.",
        type: "error"
      });
    } finally {
      setUpdatingFromProfile(false);
    }
  };

  const toggleAction = (id) => {
    setCareerPath((prev) => ({
      ...prev,
      actions: prev.actions.map((a) =>
        a.id === id ? { ...a, completed: !a.completed } : a
      ),
    }));
  };

  // Obtenir les prochaines actions recommandées
  const getNextActions = () => {
    return careerPath.actions
      .filter(a => !a.completed && a.priority === "high")
      .slice(0, 3);
  };

  if (loading) {
    return (
      <div className="career-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Chargement de ton parcours objectif...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="career-container">
      {/* AI INSIGHT FLOATING */}
      {showAIInsight && highPriorityActions > 0 && (
        <div className="ai-insight-float">
          <div className="ai-insight-header">
            <div className="ai-insight-icon">✨</div>
            <div className="ai-insight-content">
              <div className="ai-insight-title">Conseil IA</div>
              <div className="ai-insight-message">
                Tu as {highPriorityActions} action{highPriorityActions > 1 ? 's' : ''} prioritaire{highPriorityActions > 1 ? 's' : ''} à compléter. 
                Commence par celles-ci pour maximiser ton impact !
              </div>
            </div>
            <button 
              className="ai-insight-close"
              onClick={() => setShowAIInsight(false)}
              aria-label="Fermer"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* HEADER */}
      <header className="career-header">
        <div className="career-header-content">
          <div className="career-breadcrumb">
            <span className="breadcrumb-item">Dashboard</span>
            <span className="breadcrumb-separator">›</span>
            <span className="breadcrumb-item active">Mon parcours objectif</span>
          </div>
          <h1 className="career-title">
            <span className="title-icon">🎯</span>
            Mon parcours objectif
          </h1>
          <p className="career-subtitle">
            Définis ton objectif professionnel et suis ta progression avec un plan d'actions personnalisé généré par l'IA.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="career-quick-stats">
          <div className="quick-stat-item">
            <div className="stat-icon-wrapper stat-readiness">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </div>
            <div className="stat-details">
              <div className="stat-value">{careerPath.readinessScore || 0}%</div>
              <div className="stat-label">Adaptation</div>
            </div>
          </div>
          <div className="quick-stat-item">
            <div className="stat-icon-wrapper stat-progress">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
            </div>
            <div className="stat-details">
              <div className="stat-value">{completedActions}/{totalActions}</div>
              <div className="stat-label">Actions</div>
            </div>
          </div>
          <div className="quick-stat-item">
            <div className="stat-icon-wrapper stat-time">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
            </div>
            <div className="stat-details">
              <div className="stat-value">{careerPath.timeHorizonMonths || 0}</div>
              <div className="stat-label">Mois</div>
            </div>
          </div>
        </div>
      </header>

      {/* MESSAGE */}
      {message.text && (
        <div className={`career-message message-${message.type}`}>
          <span className="message-icon">
            {message.type === "success" ? "✓" : message.type === "error" ? "✕" : "ℹ"}
          </span>
          {message.text}
        </div>
      )}

      <main className="career-layout">
        {/* COLONNE GAUCHE - DÉFINITION DE L'OBJECTIF */}
        <section className="career-card career-card-form">
          <div className="card-header-section">
            <h2 className="card-title">
              <span className="card-icon">📋</span>
              Définir mon objectif
            </h2>
            <p className="card-description">
              Remplis les informations ci-dessous pour définir ton objectif professionnel
            </p>
          </div>

          <form className="career-form" onSubmit={handleSaveGoal}>
            <div className="form-group">
              <label className="form-label">
                <span className="label-icon">🎯</span>
                Poste / objectif principal
              </label>
              <input
                type="text"
                name="targetJob"
                className="form-input"
                value={careerPath.targetJob}
                onChange={handleGoalFieldChange}
                placeholder="Ex : PFE en cybersécurité, Data analyst junior, Développeur backend..."
              />
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">
                  <span className="label-icon">💼</span>
                  Domaine cible
                </label>
                <input
                  type="text"
                  name="targetDomain"
                  className="form-input"
                  value={careerPath.targetDomain}
                  onChange={handleGoalFieldChange}
                  placeholder="Ex : Cybersécurité, ERP, Data..."
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <span className="label-icon">📊</span>
                  Type d'objectif
                </label>
                <select
                  name="objectiveType"
                  className="form-select"
                  value={careerPath.objectiveType}
                  onChange={handleGoalFieldChange}
                >
                  <option value="PFE">PFE / stage de fin d'études</option>
                  <option value="CHANGE_DOMAIN">Changement de domaine</option>
                  <option value="FIRST_JOB">Premier emploi</option>
                  <option value="OTHER">Autre</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                <span className="label-icon">⏱️</span>
                Horizon temporel
              </label>
              <div className="form-input-group">
                <input
                  type="number"
                  min={1}
                  max={36}
                  name="timeHorizonMonths"
                  className="form-input"
                  value={careerPath.timeHorizonMonths}
                  onChange={handleGoalFieldChange}
                />
                <span className="input-suffix">mois</span>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                <span className="label-icon">📝</span>
                Description / Contexte
              </label>
              <textarea
                name="description"
                rows={4}
                className="form-textarea"
                value={careerPath.description}
                onChange={handleGoalFieldChange}
                placeholder="Explique ta situation actuelle (études, poste) et ce que tu veux atteindre..."
              />
            </div>

            <div className="career-actions-row">
              <button
                type="submit"
                className="btn-primary btn-large"
                disabled={savingGoal}
              >
                {savingGoal ? (
                  <>
                    <span className="btn-spinner"></span>
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <span className="btn-icon">💾</span>
                    Enregistrer l'objectif
                  </>
                )}
              </button>

              <button
                type="button"
                className="btn-secondary btn-large"
                onClick={handleGenerateFromProfile}
                disabled={updatingFromProfile}
              >
                {updatingFromProfile ? (
                  <>
                    <span className="btn-spinner"></span>
                    Analyse en cours...
                  </>
                ) : (
                  <>
                    <span className="btn-icon">✨</span>
                    Générer depuis mon profil
                  </>
                )}
              </button>
            </div>
          </form>
        </section>

        {/* COLONNE DROITE - PROGRESSION & ACTIONS */}
        <div className="career-right-column">
          {/* PROGRESSION CARDS */}
          <div className="progress-cards-grid">
            <div className="progress-card progress-card-primary">
              <div className="progress-card-header">
                <div className="progress-card-icon">🎯</div>
                <div className="progress-card-title">Adaptation au poste</div>
              </div>
              <div className="progress-card-value">{careerPath.readinessScore || 0}%</div>
              <div className="progress-bar-wrapper">
                <div className="progress-bar progress-bar-gradient">
                  <div
                    className="progress-fill progress-fill-primary"
                    style={{ width: `${careerPath.readinessScore || 0}%` }}
                  />
                </div>
              </div>
              <div className="progress-card-footer">
                {careerPath.readinessScore < 50 ? "Continue tes efforts" : careerPath.readinessScore < 80 ? "Bon progrès !" : "Excellent !"}
              </div>
            </div>

            <div className="progress-card progress-card-secondary">
              <div className="progress-card-header">
                <div className="progress-card-icon">📊</div>
                <div className="progress-card-title">Checklist complétée</div>
              </div>
              <div className="progress-card-value">{checklistProgress}%</div>
              <div className="progress-bar-wrapper">
                <div className="progress-bar progress-bar-gradient">
                  <div
                    className="progress-fill progress-fill-secondary"
                    style={{ width: `${checklistProgress}%` }}
                  />
                </div>
              </div>
              <div className="progress-card-footer">
                {completedActions} sur {totalActions} actions
              </div>
            </div>
          </div>

          {/* PROCHAINES ACTIONS RECOMMANDÉES */}
          {getNextActions().length > 0 && (
            <div className="career-card next-actions-card">
              <div className="card-header-section">
                <h3 className="card-title">
                  <span className="card-icon">🚀</span>
                  Prochaines actions recommandées
                </h3>
                <span className="priority-badge badge-high">Priorité haute</span>
              </div>
              <ul className="next-actions-list">
                {getNextActions().map((action) => (
                  <li key={action.id} className="next-action-item">
                    <div className="next-action-icon">
                      {CATEGORY_ICONS[action.category] || "✨"}
                    </div>
                    <div className="next-action-content">
                      <div className="next-action-label">{action.label}</div>
                      {action.estimatedTime && (
                        <div className="next-action-meta">
                          <span className="meta-icon">⏱️</span>
                          {action.estimatedTime}
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* LISTE COMPLÈTE DES ACTIONS */}
          <div className="career-card actions-checklist-card">
            <div className="card-header-section">
              <h3 className="card-title">
                <span className="card-icon">✅</span>
                Plan d'actions complet
              </h3>
              <span className="actions-count-badge">
                {completedActions}/{totalActions}
              </span>
            </div>

            {careerPath.actions.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">📋</div>
                <p className="empty-state-title">Aucune action définie</p>
                <p className="empty-state-text">
                  Enregistre un objectif puis génère ton parcours depuis ton profil pour obtenir des actions personnalisées.
                </p>
              </div>
            ) : (
              <ul className="actions-checklist">
                {careerPath.actions.map((action) => (
                  <li
                    key={action.id}
                    className={`action-item ${action.completed ? "action-completed" : ""}`}
                  >
                    <label className="action-label-wrapper">
                      <div className="action-checkbox-wrapper">
                        <input
                          type="checkbox"
                          className="action-checkbox"
                          checked={action.completed}
                          onChange={() => toggleAction(action.id)}
                        />
                        <span className="checkbox-custom"></span>
                      </div>
                      <div className="action-details">
                        <div className="action-main">
                          <span className="action-icon">
                            {CATEGORY_ICONS[action.category] || "✨"}
                          </span>
                          <span className="action-text">{action.label}</span>
                        </div>
                        <div className="action-meta-row">
                          <span className="action-category-badge">
                            {CATEGORY_LABELS[action.category] || action.category}
                          </span>
                          {action.estimatedTime && (
                            <span className="action-time">
                              <span className="meta-icon">⏱️</span>
                              {action.estimatedTime}
                            </span>
                          )}
                          {action.priority && (
                            <span className={`action-priority ${PRIORITY_CONFIG[action.priority]?.color}`}>
                              {PRIORITY_CONFIG[action.priority]?.label || action.priority}
                            </span>
                          )}
                        </div>
                      </div>
                    </label>
                  </li>
                ))}
              </ul>
            )}

            <div className="card-footer-info">
              <span className="info-icon">💡</span>
              <p className="info-text">
                En complétant ces actions, tu augmentes ton adaptation au poste cible. 
                À 80%+, la plateforme te proposera des offres correspondant à ton nouveau profil.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default MyCareerPath;