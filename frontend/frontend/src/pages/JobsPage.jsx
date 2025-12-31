// src/pages/JobsPage.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { FAKE_OFFERS } from "../data/Offers";

function JobsPage() {
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");

  // Get unique types and locations for filters
  const types = ["all", ...new Set(FAKE_OFFERS.map(o => o.type))];
  const locations = ["all", ...new Set(FAKE_OFFERS.map(o => o.location))];

  const filtered = FAKE_OFFERS.filter((o) => {
    const matchesSearch = (o.title + o.company + o.location)
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesType = selectedType === "all" || o.type === selectedType;
    const matchesLocation = selectedLocation === "all" || o.location === selectedLocation;
    return matchesSearch && matchesType && matchesLocation;
  });

  return (
    <div style={styles.container}>
      {/* HEADER */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.breadcrumb}>
            <span style={styles.breadcrumbItem}>Dashboard</span>
            <span style={styles.breadcrumbSeparator}>›</span>
            <span style={{...styles.breadcrumbItem, ...styles.breadcrumbActive}}>Offres d'emploi</span>
          </div>
          <h1 style={styles.title}>
            <span style={styles.titleIcon}>💼</span>
            Offres d'emploi
          </h1>
          <p style={styles.subtitle}>
            Découvre les meilleures opportunités correspondant à ton profil
          </p>
        </div>

        {/* STATS */}
        <div style={styles.statsBar}>
          <div style={styles.statCard}>
            <div style={styles.statValue}>{FAKE_OFFERS.length}</div>
            <div style={styles.statLabel}>Offres disponibles</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statValue}>{filtered.length}</div>
            <div style={styles.statLabel}>Résultats</div>
          </div>
        </div>
      </header>

      <main style={styles.main}>
        {/* FILTERS BAR */}
        <div style={styles.filtersCard}>
          <div style={styles.filtersHeader}>
            <span style={styles.filtersIcon}>🔍</span>
            <h3 style={styles.filtersTitle}>Recherche & Filtres</h3>
          </div>

          <div style={styles.filtersGrid}>
            {/* SEARCH INPUT */}
            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>
                <span style={styles.labelIcon}>🔎</span>
                Recherche
              </label>
              <div style={styles.searchWrapper}>
                <input
                  type="text"
                  placeholder="Poste, entreprise, mot-clé..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={styles.searchInput}
                />
                {search && (
                  <button 
                    style={styles.clearButton}
                    onClick={() => setSearch("")}
                    aria-label="Clear search"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            {/* TYPE FILTER */}
            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>
                <span style={styles.labelIcon}>📋</span>
                Type de contrat
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                style={styles.select}
              >
                {types.map(type => (
                  <option key={type} value={type}>
                    {type === "all" ? "Tous les types" : type}
                  </option>
                ))}
              </select>
            </div>

            {/* LOCATION FILTER */}
            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>
                <span style={styles.labelIcon}>📍</span>
                Localisation
              </label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                style={styles.select}
              >
                {locations.map(loc => (
                  <option key={loc} value={loc}>
                    {loc === "all" ? "Toutes les villes" : loc}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* ACTIVE FILTERS */}
          {(search || selectedType !== "all" || selectedLocation !== "all") && (
            <div style={styles.activeFilters}>
              <span style={styles.activeFiltersLabel}>Filtres actifs:</span>
              {search && (
                <span style={styles.filterTag}>
                  Recherche: "{search}"
                  <button 
                    style={styles.filterTagClose}
                    onClick={() => setSearch("")}
                  >×</button>
                </span>
              )}
              {selectedType !== "all" && (
                <span style={styles.filterTag}>
                  Type: {selectedType}
                  <button 
                    style={styles.filterTagClose}
                    onClick={() => setSelectedType("all")}
                  >×</button>
                </span>
              )}
              {selectedLocation !== "all" && (
                <span style={styles.filterTag}>
                  Lieu: {selectedLocation}
                  <button 
                    style={styles.filterTagClose}
                    onClick={() => setSelectedLocation("all")}
                  >×</button>
                </span>
              )}
              <button 
                style={styles.clearAllButton}
                onClick={() => {
                  setSearch("");
                  setSelectedType("all");
                  setSelectedLocation("all");
                }}
              >
                Effacer tout
              </button>
            </div>
          )}
        </div>

        {/* JOBS GRID */}
        <div style={styles.jobsGrid}>
          {filtered.map((offer) => (
            <div 
              key={offer.id} 
              style={styles.jobCard}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.4)';
                e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.6), 0 0 24px rgba(99, 102, 241, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'rgba(148, 163, 184, 0.15)';
                e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.5)';
              }}
            >
              {/* CARD HEADER */}
              <div style={styles.jobCardHeader}>
                <div style={styles.companyLogo}>
                  {offer.company.charAt(0)}
                </div>
                <div style={styles.jobCardHeaderContent}>
                  <h3 style={styles.jobTitle}>{offer.title}</h3>
                  <p style={styles.jobCompany}>
                    {offer.company}
                  </p>
                </div>
              </div>

              {/* CARD META */}
              <div style={styles.jobMeta}>
                <span style={styles.jobMetaItem}>
                  <span style={styles.metaIcon}>📍</span>
                  {offer.location}
                </span>
                <span style={styles.jobMetaItem}>
                  <span style={styles.metaIcon}>💼</span>
                  {offer.type}
                </span>
                <span style={styles.jobMetaItem}>
                  <span style={styles.metaIcon}>⏱️</span>
                  {offer.experience}
                </span>
              </div>

              {/* SALARY */}
              {offer.salaryMin && offer.salaryMax && (
                <div style={styles.salaryBadge}>
                  <span style={styles.salaryIcon}>💰</span>
                  {offer.salaryMin}-{offer.salaryMax}k {offer.currency}
                </div>
              )}

              {/* APPLICATIONS COUNT */}
              <div style={styles.applicationsInfo}>
                <span style={styles.applicationsIcon}>👥</span>
                <span style={styles.applicationsText}>
                  {offer.applicationsCount} candidature{offer.applicationsCount > 1 ? 's' : ''}
                </span>
              </div>

              {/* ACTIONS */}
              <div style={styles.jobActions}>
                <Link 
                  to={`/jobs/${offer.id}`} 
                  style={styles.btnSecondary}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(30, 41, 59, 0.9)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(30, 41, 59, 0.7)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <span style={styles.btnIcon}>👁️</span>
                  Voir l'offre
                </Link>
                <Link 
                  to={`/jobs/${offer.id}`} 
                  style={styles.btnPrimary}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(99, 102, 241, 0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(99, 102, 241, 0.4)';
                  }}
                >
                  <span style={styles.btnIcon}>📤</span>
                  Postuler
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* EMPTY STATE */}
        {filtered.length === 0 && (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>🔍</div>
            <h3 style={styles.emptyTitle}>Aucune offre trouvée</h3>
            <p style={styles.emptyText}>
              Essaie de modifier tes critères de recherche ou explore d'autres catégories
            </p>
            <button 
              style={styles.emptyButton}
              onClick={() => {
                setSearch("");
                setSelectedType("all");
                setSelectedLocation("all");
              }}
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

// ========================================================================
// STYLES
// ========================================================================

const styles = {
  container: {
    padding: '3rem',
    width: '100%',
    minHeight: 'calc(100vh - 120px)',
    maxWidth: '1600px',
    margin: '0 auto',
  },

  // HEADER
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '3rem',
    marginBottom: '3rem',
    padding: '3rem',
    background: 'rgba(15, 23, 42, 0.6)',
    backdropFilter: 'blur(20px) saturate(180%)',
    borderRadius: '1.5rem',
    border: '1px solid rgba(148, 163, 184, 0.15)',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
    position: 'relative',
    overflow: 'hidden',
  },

  headerContent: {
    flex: 1,
  },

  breadcrumb: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '1rem',
    fontSize: '0.875rem',
  },

  breadcrumbItem: {
    color: '#94a3b8',
    transition: 'color 0.25s',
  },

  breadcrumbActive: {
    color: '#e2e8f0',
    fontWeight: 600,
  },

  breadcrumbSeparator: {
    color: '#94a3b8',
    opacity: 0.5,
  },

  title: {
    fontSize: 'clamp(2rem, 4vw, 2.5rem)',
    fontWeight: 800,
    color: '#f8fafc',
    marginBottom: '1rem',
    letterSpacing: '-0.02em',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },

  titleIcon: {
    fontSize: '2.5rem',
  },

  subtitle: {
    fontSize: '1.05rem',
    lineHeight: 1.7,
    color: '#cbd5e1',
    maxWidth: '600px',
  },

  statsBar: {
    display: 'flex',
    gap: '1.5rem',
  },

  statCard: {
    padding: '1.5rem',
    background: 'rgba(30, 41, 59, 0.5)',
    borderRadius: '1rem',
    border: '1px solid rgba(148, 163, 184, 0.1)',
    minWidth: '120px',
    textAlign: 'center',
    transition: 'all 0.25s',
  },

  statValue: {
    fontSize: '2rem',
    fontWeight: 800,
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    lineHeight: 1,
    marginBottom: '0.5rem',
  },

  statLabel: {
    fontSize: '0.875rem',
    color: '#94a3b8',
    fontWeight: 500,
  },

  // MAIN
  main: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
  },

  // FILTERS
  filtersCard: {
    background: 'rgba(15, 23, 42, 0.6)',
    backdropFilter: 'blur(20px) saturate(180%)',
    borderRadius: '1.5rem',
    padding: '2rem',
    border: '1px solid rgba(148, 163, 184, 0.15)',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
  },

  filtersHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '1.5rem',
  },

  filtersIcon: {
    fontSize: '1.5rem',
  },

  filtersTitle: {
    fontSize: '1.25rem',
    fontWeight: 700,
    color: '#f8fafc',
    margin: 0,
  },

  filtersGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem',
  },

  filterGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },

  filterLabel: {
    fontSize: '0.9rem',
    fontWeight: 600,
    color: '#e2e8f0',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },

  labelIcon: {
    fontSize: '1rem',
  },

  searchWrapper: {
    position: 'relative',
  },

  searchInput: {
    width: '100%',
    padding: '0.875rem 1.125rem',
    paddingRight: '2.5rem',
    background: 'rgba(30, 41, 59, 0.5)',
    border: '1px solid rgba(148, 163, 184, 0.2)',
    borderRadius: '0.75rem',
    color: '#f8fafc',
    fontSize: '0.95rem',
    fontFamily: 'inherit',
    transition: 'all 0.25s',
    outline: 'none',
  },

  clearButton: {
    position: 'absolute',
    right: '0.5rem',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'rgba(148, 163, 184, 0.2)',
    border: 'none',
    borderRadius: '50%',
    width: '24px',
    height: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#cbd5e1',
    fontSize: '1.25rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },

  select: {
    width: '100%',
    padding: '0.875rem 1.125rem',
    background: 'rgba(30, 41, 59, 0.5)',
    border: '1px solid rgba(148, 163, 184, 0.2)',
    borderRadius: '0.75rem',
    color: '#f8fafc',
    fontSize: '0.95rem',
    fontFamily: 'inherit',
    transition: 'all 0.25s',
    outline: 'none',
    cursor: 'pointer',
  },

  activeFilters: {
    marginTop: '1.5rem',
    padding: '1rem',
    background: 'rgba(99, 102, 241, 0.05)',
    borderRadius: '0.75rem',
    border: '1px solid rgba(99, 102, 241, 0.15)',
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.75rem',
    alignItems: 'center',
  },

  activeFiltersLabel: {
    fontSize: '0.875rem',
    fontWeight: 600,
    color: '#a78bfa',
  },

  filterTag: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.35rem 0.875rem',
    background: 'rgba(99, 102, 241, 0.15)',
    border: '1px solid rgba(99, 102, 241, 0.3)',
    borderRadius: '9999px',
    fontSize: '0.875rem',
    color: '#a78bfa',
    fontWeight: 600,
  },

  filterTagClose: {
    background: 'transparent',
    border: 'none',
    color: '#a78bfa',
    fontSize: '1.25rem',
    cursor: 'pointer',
    padding: 0,
    width: '16px',
    height: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  clearAllButton: {
    padding: '0.35rem 0.875rem',
    background: 'rgba(239, 68, 68, 0.15)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    borderRadius: '9999px',
    fontSize: '0.875rem',
    color: '#ef4444',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s',
    marginLeft: 'auto',
  },

  // JOBS GRID
  jobsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
    gap: '1.5rem',
  },

  jobCard: {
    background: 'rgba(15, 23, 42, 0.6)',
    backdropFilter: 'blur(20px) saturate(180%)',
    borderRadius: '1.5rem',
    padding: '2rem',
    border: '1px solid rgba(148, 163, 184, 0.15)',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
    transition: 'all 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },

  jobCardHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '1rem',
  },

  companyLogo: {
    width: '56px',
    height: '56px',
    borderRadius: '1rem',
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.5rem',
    fontWeight: 800,
    color: 'white',
    flexShrink: 0,
    boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)',
  },

  jobCardHeaderContent: {
    flex: 1,
  },

  jobTitle: {
    fontSize: '1.25rem',
    fontWeight: 700,
    color: '#f8fafc',
    margin: '0 0 0.5rem 0',
    lineHeight: 1.3,
  },

  jobCompany: {
    fontSize: '0.95rem',
    color: '#94a3b8',
    margin: 0,
  },

  jobMeta: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1rem',
  },

  jobMetaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.875rem',
    color: '#cbd5e1',
    padding: '0.35rem 0.75rem',
    background: 'rgba(30, 41, 59, 0.4)',
    borderRadius: '9999px',
    border: '1px solid rgba(148, 163, 184, 0.1)',
  },

  metaIcon: {
    fontSize: '0.875rem',
  },

  salaryBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 1rem',
    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(5, 150, 105, 0.15))',
    border: '1.5px solid rgba(16, 185, 129, 0.4)',
    borderRadius: '9999px',
    fontSize: '0.875rem',
    fontWeight: 700,
    color: '#10b981',
    boxShadow: '0 0 16px rgba(16, 185, 129, 0.2)',
    alignSelf: 'flex-start',
  },

  salaryIcon: {
    fontSize: '1rem',
  },

  applicationsInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem',
    background: 'rgba(99, 102, 241, 0.05)',
    borderRadius: '0.75rem',
    border: '1px solid rgba(99, 102, 241, 0.1)',
  },

  applicationsIcon: {
    fontSize: '1rem',
  },

  applicationsText: {
    fontSize: '0.875rem',
    color: '#cbd5e1',
  },

  jobActions: {
    display: 'flex',
    gap: '0.75rem',
    marginTop: 'auto',
  },

  btnPrimary: {
    flex: 1,
    padding: '0.875rem 1.5rem',
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    color: 'white',
    border: 'none',
    borderRadius: '9999px',
    fontSize: '0.95rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.25s',
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)',
  },

  btnSecondary: {
    flex: 1,
    padding: '0.875rem 1.5rem',
    background: 'rgba(30, 41, 59, 0.7)',
    border: '1px solid rgba(148, 163, 184, 0.3)',
    color: '#f8fafc',
    borderRadius: '9999px',
    fontSize: '0.95rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.25s',
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    backdropFilter: 'blur(8px)',
  },

  btnIcon: {
    fontSize: '1rem',
  },

  // EMPTY STATE
  emptyState: {
    padding: '4rem 2rem',
    textAlign: 'center',
    background: 'rgba(15, 23, 42, 0.6)',
    backdropFilter: 'blur(20px) saturate(180%)',
    borderRadius: '1.5rem',
    border: '1px solid rgba(148, 163, 184, 0.15)',
  },

  emptyIcon: {
    fontSize: '4rem',
    marginBottom: '1.5rem',
    opacity: 0.5,
  },

  emptyTitle: {
    fontSize: '1.5rem',
    fontWeight: 700,
    color: '#f8fafc',
    marginBottom: '0.75rem',
  },

  emptyText: {
    fontSize: '1rem',
    color: '#94a3b8',
    marginBottom: '2rem',
    maxWidth: '500px',
    margin: '0 auto 2rem',
  },

  emptyButton: {
    padding: '0.875rem 2rem',
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    color: 'white',
    border: 'none',
    borderRadius: '9999px',
    fontSize: '0.95rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.25s',
    boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)',
  },
};

export default JobsPage;