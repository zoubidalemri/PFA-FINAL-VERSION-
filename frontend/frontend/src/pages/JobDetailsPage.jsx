// src/pages/JobDetailsPage.jsx
import { Link, useParams } from "react-router-dom";
import { getOfferById } from "../data/Offers";
import { useState, useEffect } from "react";

function JobDetailsPage() {
  const { id } = useParams();
  const offer = getOfferById(id);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!offer) {
    return (
      <div style={styles.pageWrapper}>
        <div style={styles.notFoundContainer}>
          <div style={styles.notFoundContent}>
            <div style={styles.notFoundIconWrapper}>
              <span style={styles.notFoundIcon}>🔍</span>
            </div>
            <h2 style={styles.notFoundTitle}>Offre introuvable</h2>
            <p style={styles.notFoundText}>
              Cette offre n'existe pas ou a été supprimée de notre plateforme
            </p>
            <Link to="/jobs" style={styles.notFoundButton}>
              <span>←</span> Retour aux offres
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.animatedBg}></div>

      {/* FLOATING BAR */}
      <div style={{...styles.floatingBar, transform: scrolled ? 'translateY(0)' : 'translateY(-150%)'}}>
        <div style={styles.floatingContent}>
          <div style={styles.floatingInfo}>
            <div style={styles.floatingLogo}>{offer.company.charAt(0)}</div>
            <div>
              <div style={styles.floatingTitle}>{offer.title}</div>
              <div style={styles.floatingCompany}>{offer.company}</div>
            </div>
          </div>
          <div style={styles.floatingActions}>
            <button style={styles.floatingBtn} onClick={handleCopyLink}>
              {copied ? '✓' : '📋'}
            </button>
            <button style={styles.floatingBtnPrimary} onClick={() => setShowApplyModal(true)}>
              <span>📤</span> Postuler
            </button>
          </div>
        </div>
      </div>

      {/* HERO */}
      <div style={styles.hero}>
        <div style={styles.heroGradient}></div>
        <div style={styles.breadcrumb}>
          <Link to="/jobs" style={styles.breadcrumbLink}>
            <span>💼</span> Offres d'emploi
          </Link>
          <span style={styles.breadcrumbSep}>›</span>
          <span style={styles.breadcrumbCurrent}>{offer.title}</span>
        </div>

        <div style={styles.heroContent}>
          <div style={styles.heroLeft}>
            <div style={styles.companyLogoLarge}>
              <span style={styles.logoText}>{offer.company.charAt(0)}</span>
            </div>
            
            <div style={styles.heroInfo}>
              <div style={styles.statusBadgeWrapper}>
                <span style={styles.statusDot}></span>
                <span style={styles.statusText}>{offer.status}</span>
              </div>
              
              <h1 style={styles.heroTitle}>{offer.title}</h1>
              
              <div style={styles.heroMeta}>
                <div style={styles.metaChip}>
                  <span>🏢</span> {offer.company}
                </div>
                <div style={styles.metaChip}>
                  <span>📍</span> {offer.location}
                </div>
              </div>

              <div style={styles.keyStats}>
                <div style={styles.statItem}>
                  <div style={styles.statLabel}>Contrat</div>
                  <div style={styles.statValue}>{offer.type}</div>
                </div>
                <div style={styles.statItem}>
                  <div style={styles.statLabel}>Expérience</div>
                  <div style={styles.statValue}>{offer.experience}</div>
                </div>
                <div style={styles.statItem}>
                  <div style={styles.statLabel}>Salaire</div>
                  <div style={{...styles.statValue, ...styles.salaryValue}}>
                    {offer.salaryMin}-{offer.salaryMax}k €
                  </div>
                </div>
                <div style={styles.statItem}>
                  <div style={styles.statLabel}>Candidatures</div>
                  <div style={styles.statValue}>{offer.applicationsCount}</div>
                </div>
              </div>
            </div>
          </div>

          <div style={styles.heroRight}>
            <button style={styles.primaryButton} onClick={() => setShowApplyModal(true)}>
              <span style={styles.buttonShine}></span>
              <span>📤</span> Postuler maintenant
            </button>

            <button style={styles.secondaryButton} onClick={handleCopyLink}>
              <span>{copied ? '✓' : '📋'}</span> {copied ? 'Copié !' : 'Partager'}
            </button>

            <div style={styles.externalLinksGrid}>
              <a href={offer.externalLinks.linkedin} target="_blank" rel="noreferrer" style={styles.externalButton}>
                <span>💼</span> LinkedIn
              </a>
              <a href={offer.externalLinks.indeed} target="_blank" rel="noreferrer" style={{...styles.externalButton, ...styles.indeedButton}}>
                <span>🔍</span> Indeed
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div style={styles.contentWrapper}>
        <div style={styles.contentGrid}>
          <div style={styles.mainColumn}>
            <section style={styles.contentCard}>
              <div style={styles.cardHeader}>
                <div style={styles.cardHeaderIcon}>📄</div>
                <h2 style={styles.cardTitle}>Description du poste</h2>
              </div>
              <p style={styles.description}>{offer.description}</p>
            </section>

            <section style={styles.contentCard}>
              <div style={styles.cardHeader}>
                <div style={styles.cardHeaderIcon}>🎯</div>
                <div>
                  <h2 style={styles.cardTitle}>Missions principales</h2>
                  <p style={styles.cardSubtitle}>Ce que tu vas faire au quotidien</p>
                </div>
              </div>
              <div style={styles.itemsList}>
                {offer.responsibilities.map((item, i) => (
                  <div key={i} style={styles.listItemCard}>
                    <div style={styles.itemNumber}>{i + 1}</div>
                    <div style={styles.itemContent}>
                      <p style={styles.itemText}>{item}</p>
                    </div>
                    <div style={styles.itemCheck}>✓</div>
                  </div>
                ))}
              </div>
            </section>

            <section style={styles.contentCard}>
              <div style={styles.cardHeader}>
                <div style={styles.cardHeaderIcon}>🎓</div>
                <div>
                  <h2 style={styles.cardTitle}>Profil recherché</h2>
                  <p style={styles.cardSubtitle}>Les compétences attendues</p>
                </div>
              </div>
              <div style={styles.requirementsGrid}>
                {offer.requirements.map((req, i) => (
                  <div key={i} style={styles.requirementCard}>
                    <div style={styles.requirementIcon}>✨</div>
                    <p style={styles.requirementText}>{req}</p>
                  </div>
                ))}
              </div>
            </section>

            <section style={styles.contentCard}>
              <div style={styles.cardHeader}>
                <div style={styles.cardHeaderIcon}>🎁</div>
                <div>
                  <h2 style={styles.cardTitle}>Avantages</h2>
                  <p style={styles.cardSubtitle}>Ce que l'entreprise t'offre</p>
                </div>
              </div>
              <div style={styles.benefitsGrid}>
                {offer.benefits.map((benefit, i) => (
                  <div key={i} style={styles.benefitCard}>
                    <div style={styles.benefitIcon}>
                      {['🏥', '🍽️', '🏋️', '🚗', '💰', '🎓', '🌴', '💻'][i % 8]}
                    </div>
                    <p style={styles.benefitText}>{benefit}</p>
                    <div style={styles.benefitGlow}></div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div style={styles.sidebar}>
            <div style={styles.sidebarCard}>
              <div style={styles.sidebarHeader}>
                <div style={styles.sidebarIconWrapper}>
                  <span>📊</span>
                </div>
                <h3 style={styles.sidebarTitle}>Informations clés</h3>
              </div>
              <div style={styles.infoGrid}>
                <div style={styles.infoRow}>
                  <span style={styles.infoLabel}>Type de contrat</span>
                  <span style={styles.infoValueBadge}>{offer.type}</span>
                </div>
                <div style={styles.infoRow}>
                  <span style={styles.infoLabel}>Expérience</span>
                  <span style={styles.infoValueBadge}>{offer.experience}</span>
                </div>
                <div style={styles.infoRow}>
                  <span style={styles.infoLabel}>Localisation</span>
                  <span style={styles.infoValueBadge}>{offer.location}</span>
                </div>
                <div style={styles.infoRow}>
                  <span style={styles.infoLabel}>Candidatures</span>
                  <span style={{...styles.infoValueBadge, ...styles.candidaturesBadge}}>
                    {offer.applicationsCount}
                  </span>
                </div>
              </div>
            </div>

            <div style={styles.sidebarCard}>
              <div style={styles.sidebarHeader}>
                <div style={styles.sidebarIconWrapper}>
                  <span>🏢</span>
                </div>
                <h3 style={styles.sidebarTitle}>À propos de {offer.company}</h3>
              </div>
              <div style={styles.companyLogoSmall}>
                {offer.company.charAt(0)}
              </div>
              <p style={styles.companyDescription}>
                {offer.company} est une entreprise innovante qui recherche des talents 
                motivés pour rejoindre son équipe.
              </p>
              <div style={styles.companyStats}>
                <div style={styles.companyStat}>
                  <div style={styles.companyStatValue}>50+</div>
                  <div style={styles.companyStatLabel}>Employés</div>
                </div>
                <div style={styles.companyStat}>
                  <div style={styles.companyStatValue}>2015</div>
                  <div style={styles.companyStatLabel}>Fondée en</div>
                </div>
              </div>
            </div>

            <div style={{...styles.sidebarCard, ...styles.tipsCard}}>
              <div style={styles.tipsIcon}>💡</div>
              <h4 style={styles.tipsTitle}>Conseil</h4>
              <p style={styles.tipsText}>
                Personnalise ta candidature en mettant en avant tes expériences pertinentes.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM CTA */}
      <div style={styles.bottomCta}>
        <div style={styles.ctaContent}>
          <div style={styles.ctaText}>
            <h3 style={styles.ctaTitle}>Intéressé(e) par cette opportunité ?</h3>
            <p style={styles.ctaSubtitle}>
              Postule maintenant et fais passer ta carrière au niveau supérieur
            </p>
          </div>
          <div style={styles.ctaButtons}>
            <Link to="/jobs" style={styles.ctaSecondary}>
              <span>←</span> Voir d'autres offres
            </Link>
            <button style={styles.ctaPrimary} onClick={() => setShowApplyModal(true)}>
              <span>📤</span> Postuler
            </button>
          </div>
        </div>
      </div>

      {/* MODAL */}
      {showApplyModal && (
        <div style={styles.modalOverlay} onClick={() => setShowApplyModal(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalGradient}></div>
            <button style={styles.modalClose} onClick={() => setShowApplyModal(false)}>✕</button>
            
            <div style={styles.modalContent}>
              <div style={styles.modalIconWrapper}>
                <span style={styles.modalIcon}>📤</span>
              </div>
              
              <h3 style={styles.modalTitle}>Postuler chez {offer.company}</h3>
              <p style={styles.modalDescription}>
                Tu es sur le point de postuler pour <strong>{offer.title}</strong>. 
                Cette fonctionnalité sera bientôt disponible.
              </p>

              <div style={styles.modalDivider}>
                <span style={styles.dividerText}>En attendant, postule via</span>
              </div>

              <div style={styles.modalActions}>
                <a href={offer.externalLinks.linkedin} target="_blank" rel="noreferrer" style={styles.modalBtnLinkedIn}>
                  <span>💼</span> Postuler sur LinkedIn
                </a>
                <a href={offer.externalLinks.indeed} target="_blank" rel="noreferrer" style={styles.modalBtnIndeed}>
                  <span>🔍</span> Postuler sur Indeed
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// PREMIUM STYLES
const styles = {
  pageWrapper: { minHeight: '100vh', background: '#0f172a', position: 'relative', paddingBottom: '4rem' },
  animatedBg: { position: 'fixed', inset: 0, background: `radial-gradient(circle at 20% 30%, rgba(99, 102, 241, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)`, pointerEvents: 'none', zIndex: 0 },
  
  floatingBar: { position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, background: 'rgba(15, 23, 42, 0.95)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(148, 163, 184, 0.1)', boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)', transition: 'transform 0.4s' },
  floatingContent: { maxWidth: '1400px', margin: '0 auto', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  floatingInfo: { display: 'flex', alignItems: 'center', gap: '1rem' },
  floatingLogo: { width: '48px', height: '48px', borderRadius: '0.75rem', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', fontWeight: 800, color: 'white' },
  floatingTitle: { fontSize: '1rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.25rem' },
  floatingCompany: { fontSize: '0.875rem', color: '#94a3b8' },
  floatingActions: { display: 'flex', gap: '0.75rem', alignItems: 'center' },
  floatingBtn: { width: '44px', height: '44px', borderRadius: '0.75rem', background: 'rgba(30, 41, 59, 0.6)', border: '1px solid rgba(99, 102, 241, 0.3)', color: '#cbd5e1', fontSize: '1.125rem', cursor: 'pointer', transition: 'all 0.25s' },
  floatingBtnPrimary: { padding: '0.75rem 1.5rem', borderRadius: '9999px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none', color: 'white', fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.25s', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)' },
  
  notFoundContainer: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' },
  notFoundContent: { textAlign: 'center', maxWidth: '600px' },
  notFoundIconWrapper: { position: 'relative', display: 'inline-block', marginBottom: '2rem' },
  notFoundIcon: { fontSize: '6rem', filter: 'drop-shadow(0 0 40px rgba(99, 102, 241, 0.3))' },
  notFoundTitle: { fontSize: '2.5rem', fontWeight: 800, color: '#f8fafc', marginBottom: '1rem' },
  notFoundText: { fontSize: '1.125rem', color: '#94a3b8', marginBottom: '2.5rem', lineHeight: 1.6 },
  notFoundButton: { display: 'inline-flex', alignItems: 'center', gap: '0.75rem', padding: '1rem 2.5rem', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white', textDecoration: 'none', borderRadius: '9999px', fontSize: '1.0625rem', fontWeight: 600, transition: 'all 0.3s', boxShadow: '0 10px 30px rgba(99, 102, 241, 0.3)' },
  
  hero: { position: 'relative', padding: '8rem 2rem 4rem', maxWidth: '1400px', margin: '0 auto', zIndex: 1 },
  heroGradient: { position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', height: '400px', background: 'radial-gradient(ellipse at top, rgba(99, 102, 241, 0.15) 0%, transparent 70%)', pointerEvents: 'none' },
  breadcrumb: { display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '3rem', fontSize: '0.9375rem' },
  breadcrumbLink: { display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#94a3b8', textDecoration: 'none', transition: 'color 0.25s', fontWeight: 500 },
  breadcrumbSep: { color: '#475569' },
  breadcrumbCurrent: { color: '#cbd5e1', fontWeight: 600 },
  heroContent: { display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '4rem', alignItems: 'start' },
  heroLeft: { display: 'flex', gap: '2rem' },
  companyLogoLarge: { position: 'relative', width: '120px', height: '120px', flexShrink: 0 },
  logoText: { position: 'relative', zIndex: 1, width: '100%', height: '100%', borderRadius: '1.5rem', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', fontWeight: 800, color: 'white', boxShadow: '0 20px 40px rgba(99, 102, 241, 0.3), 0 0 80px rgba(99, 102, 241, 0.2)' },
  heroInfo: { flex: 1 },
  statusBadgeWrapper: { display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '9999px', marginBottom: '1.5rem' },
  statusDot: { width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 12px rgba(16, 185, 129, 0.6)' },
  statusText: { fontSize: '0.875rem', fontWeight: 600, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.05em' },
  heroTitle: { fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900, color: '#f8fafc', marginBottom: '1.5rem', lineHeight: 1.1, letterSpacing: '-0.03em' },
  heroMeta: { display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' },
  metaChip: { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.625rem 1.125rem', background: 'rgba(30, 41, 59, 0.6)', backdropFilter: 'blur(10px)', border: '1px solid rgba(148, 163, 184, 0.15)', borderRadius: '9999px', fontSize: '0.9375rem', color: '#cbd5e1', fontWeight: 500 },
  keyStats: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', padding: '2rem', background: 'rgba(30, 41, 59, 0.4)', backdropFilter: 'blur(20px)', borderRadius: '1.25rem', border: '1px solid rgba(148, 163, 184, 0.1)' },
  statItem: { textAlign: 'center' },
  statLabel: { fontSize: '0.8125rem', color: '#94a3b8', marginBottom: '0.5rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' },
  statValue: { fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc' },
  salaryValue: { background: 'linear-gradient(135deg, #10b981, #059669)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  
  heroRight: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  primaryButton: { position: 'relative', padding: '1.25rem 2rem', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white', border: 'none', borderRadius: '1rem', fontSize: '1.0625rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.4s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', boxShadow: '0 10px 30px rgba(99, 102, 241, 0.3)', overflow: 'hidden' },
  buttonShine: { position: 'absolute', top: 0, left: '-100%', width: '100%', height: '100%', background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)', transition: 'left 0.5s' },
  secondaryButton: { padding: '1rem 1.75rem', background: 'rgba(30, 41, 59, 0.6)', backdropFilter: 'blur(10px)', border: '1.5px solid rgba(99, 102, 241, 0.3)', color: '#cbd5e1', borderRadius: '0.875rem', fontSize: '0.9375rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.3s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.625rem' },
  externalLinksGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '0.5rem' },
  externalButton: { padding: '0.875rem 1rem', background: 'rgba(10, 102, 194, 0.1)', border: '1px solid rgba(10, 102, 194, 0.3)', borderRadius: '0.75rem', color: '#60a5fa', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.3s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' },
  indeedButton: { background: 'rgba(42, 100, 246, 0.1)', border: '1px solid rgba(42, 100, 246, 0.3)' },
  
  contentWrapper: { maxWidth: '1400px', margin: '0 auto', padding: '0 2rem 4rem', position: 'relative', zIndex: 1 },
  contentGrid: { display: 'grid', gridTemplateColumns: '1.75fr 1fr', gap: '2.5rem', alignItems: 'start' },
  mainColumn: { display: 'flex', flexDirection: 'column', gap: '2rem' },
  contentCard: { background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(20px)', borderRadius: '1.5rem', padding: '2.5rem', border: '1px solid rgba(148, 163, 184, 0.1)', boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)' },
  cardHeader: { display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '2rem' },
  cardHeaderIcon: { width: '56px', height: '56px', borderRadius: '1rem', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(139, 92, 246, 0.2))', border: '1px solid rgba(99, 102, 241, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', boxShadow: '0 0 30px rgba(99, 102, 241, 0.2)' },
  cardTitle: { fontSize: '1.75rem', fontWeight: 800, color: '#f8fafc', margin: 0, letterSpacing: '-0.02em' },
  cardSubtitle: { fontSize: '0.9375rem', color: '#94a3b8', marginTop: '0.5rem', margin: 0 },
  description: { fontSize: '1.0625rem', lineHeight: 1.8, color: '#cbd5e1', margin: 0 },
  
  itemsList: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  listItemCard: { display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '1.5rem', background: 'rgba(30, 41, 59, 0.4)', backdropFilter: 'blur(10px)', borderRadius: '1rem', border: '1px solid rgba(148, 163, 184, 0.1)' },
  itemNumber: { width: '40px', height: '40px', borderRadius: '0.75rem', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', fontWeight: 800, flexShrink: 0, boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)' },
  itemContent: { flex: 1 },
  itemText: { fontSize: '1rem', lineHeight: 1.6, color: '#e2e8f0', margin: 0 },
  itemCheck: { width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem', fontWeight: 'bold', flexShrink: 0 },
  
  requirementsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' },
  requirementCard: { display: 'flex', alignItems: 'flex-start', gap: '1rem', padding: '1.25rem', background: 'rgba(30, 41, 59, 0.4)', borderRadius: '1rem', border: '1px solid rgba(148, 163, 184, 0.1)' },
  requirementIcon: { fontSize: '1.5rem', flexShrink: 0 },
  requirementText: { fontSize: '0.9375rem', lineHeight: 1.6, color: '#cbd5e1', margin: 0 },
  
  benefitsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' },
  benefitCard: { position: 'relative', padding: '1.5rem', background: 'rgba(30, 41, 59, 0.4)', borderRadius: '1rem', border: '1px solid rgba(148, 163, 184, 0.1)', textAlign: 'center', overflow: 'hidden' },
  benefitIcon: { fontSize: '2rem', marginBottom: '0.75rem', display: 'block' },
  benefitText: { fontSize: '0.875rem', fontWeight: 500, color: '#cbd5e1', lineHeight: 1.5, margin: 0 },
  benefitGlow: { position: 'absolute', bottom: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #6366f1, #8b5cf6, #10b981)', opacity: 0 },
  
  sidebar: { position: 'sticky', top: '120px', display: 'flex', flexDirection: 'column', gap: '1.5rem' },
  sidebarCard: { background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(20px)', borderRadius: '1.5rem', padding: '2rem', border: '1px solid rgba(148, 163, 184, 0.1)', boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)' },
  sidebarHeader: { display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' },
  sidebarIconWrapper: { width: '48px', height: '48px', borderRadius: '0.875rem', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(139, 92, 246, 0.2))', border: '1px solid rgba(99, 102, 241, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', boxShadow: '0 0 20px rgba(99, 102, 241, 0.2)' },
  sidebarTitle: { fontSize: '1.125rem', fontWeight: 700, color: '#f8fafc', margin: 0 },
  infoGrid: { display: 'flex', flexDirection: 'column', gap: '0.875rem' },
  infoRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', padding: '0.875rem 1rem', background: 'rgba(30, 41, 59, 0.4)', borderRadius: '0.75rem' },
  infoLabel: { fontSize: '0.875rem', color: '#94a3b8', fontWeight: 500 },
  infoValueBadge: { padding: '0.375rem 0.875rem', background: 'rgba(99, 102, 241, 0.15)', border: '1px solid rgba(99, 102, 241, 0.3)', borderRadius: '9999px', fontSize: '0.8125rem', fontWeight: 700, color: '#a78bfa' },
  candidaturesBadge: { background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#10b981' },
  companyLogoSmall: { width: '80px', height: '80px', margin: '0 auto 1.5rem', borderRadius: '1rem', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 800, color: 'white', boxShadow: '0 10px 30px rgba(99, 102, 241, 0.3)' },
  companyDescription: { fontSize: '0.9375rem', lineHeight: 1.7, color: '#cbd5e1', marginBottom: '1.5rem' },
  companyStats: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' },
  companyStat: { padding: '1rem', background: 'rgba(30, 41, 59, 0.4)', borderRadius: '0.75rem', textAlign: 'center' },
  companyStatValue: { fontSize: '1.5rem', fontWeight: 800, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '0.25rem' },
  companyStatLabel: { fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 },
  tipsCard: { background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1))', border: '1px solid rgba(99, 102, 241, 0.3)' },
  tipsIcon: { fontSize: '2.5rem', marginBottom: '1rem', display: 'block' },
  tipsTitle: { fontSize: '1.125rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.75rem' },
  tipsText: { fontSize: '0.9375rem', lineHeight: 1.6, color: '#cbd5e1', margin: 0 },
  
  bottomCta: { maxWidth: '1400px', margin: '4rem auto 0', padding: '0 2rem', position: 'relative', zIndex: 1 },
  ctaContent: { padding: '3rem', background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(20px)', borderRadius: '2rem', border: '1px solid rgba(148, 163, 184, 0.1)', boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '3rem' },
  ctaText: { flex: 1 },
  ctaTitle: { fontSize: '2rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.75rem', letterSpacing: '-0.02em' },
  ctaSubtitle: { fontSize: '1.0625rem', color: '#94a3b8', lineHeight: 1.6, margin: 0 },
  ctaButtons: { display: 'flex', gap: '1rem', flexShrink: 0 },
  ctaSecondary: { padding: '1.125rem 2rem', background: 'rgba(30, 41, 59, 0.6)', border: '1.5px solid rgba(148, 163, 184, 0.3)', color: '#cbd5e1', textDecoration: 'none', borderRadius: '9999px', fontSize: '1rem', fontWeight: 600, transition: 'all 0.3s', display: 'flex', alignItems: 'center', gap: '0.625rem' },
  ctaPrimary: { padding: '1.125rem 2.5rem', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white', border: 'none', borderRadius: '9999px', fontSize: '1rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.4s', display: 'flex', alignItems: 'center', gap: '0.75rem', boxShadow: '0 10px 30px rgba(99, 102, 241, 0.3)' },
  
  modalOverlay: { position: 'fixed', inset: 0, background: 'rgba(0, 0, 0, 0.8)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: '2rem' },
  modal: { position: 'relative', background: 'rgba(15, 23, 42, 0.95)', backdropFilter: 'blur(20px)', borderRadius: '2rem', border: '1px solid rgba(148, 163, 184, 0.2)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.9)', maxWidth: '560px', width: '100%', overflow: 'hidden' },
  modalGradient: { position: 'absolute', top: 0, left: 0, right: 0, height: '200px', background: 'radial-gradient(ellipse at top, rgba(99, 102, 241, 0.2) 0%, transparent 70%)', pointerEvents: 'none' },
  modalClose: { position: 'absolute', top: '1.5rem', right: '1.5rem', width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(30, 41, 59, 0.6)', border: '1px solid rgba(148, 163, 184, 0.2)', color: '#cbd5e1', fontSize: '1.25rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1 },
  modalContent: { position: 'relative', padding: '3rem', zIndex: 1 },
  modalIconWrapper: { width: '80px', height: '80px', margin: '0 auto 1.5rem', borderRadius: '1.25rem', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 20px 40px rgba(99, 102, 241, 0.4)' },
  modalIcon: { fontSize: '2.5rem' },
  modalTitle: { fontSize: '2rem', fontWeight: 800, color: '#f8fafc', textAlign: 'center', marginBottom: '1rem', letterSpacing: '-0.02em' },
  modalDescription: { fontSize: '1.0625rem', lineHeight: 1.7, color: '#cbd5e1', textAlign: 'center', marginBottom: '2rem' },
  modalDivider: { position: 'relative', textAlign: 'center', margin: '2rem 0' },
  dividerText: { position: 'relative', display: 'inline-block', padding: '0 1rem', background: 'rgba(15, 23, 42, 0.95)', fontSize: '0.875rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', zIndex: 1 },
  modalActions: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  modalBtnLinkedIn: { padding: '1.125rem 2rem', background: 'linear-gradient(135deg, #0a66c2, #0077b5)', color: 'white', textDecoration: 'none', borderRadius: '1rem', fontSize: '1rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', border: 'none', transition: 'all 0.3s' },
  modalBtnIndeed: { padding: '1.125rem 2rem', background: 'linear-gradient(135deg, #2a64f6, #1a54e6)', color: 'white', textDecoration: 'none', borderRadius: '1rem', fontSize: '1rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', border: 'none', transition: 'all 0.3s' },
};

export default JobDetailsPage;