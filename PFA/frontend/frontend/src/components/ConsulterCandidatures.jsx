import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/ConsulterCandidatures.css';

const ConsulterCandidatures = ({ recruteurId }) => {
    const [candidatures, setCandidatures] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filtreStatut, setFiltreStatut] = useState('ALL'); 
    const [error, setError] = useState('');
    const [showContactModal, setShowContactModal] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [showInterviewModal, setShowInterviewModal] = useState(false);
    const [selectedCandidature, setSelectedCandidature] = useState(null);
    
    // Interview checklist states
    const [checklistItems, setChecklistItems] = useState([]);
    const [checkedItems, setCheckedItems] = useState({});
    const [skillComments, setSkillComments] = useState({});
    const [globalNotes, setGlobalNotes] = useState('');

    const API_URL = 'http://localhost:8080/api/recruteur/candidatures';
    const OFFRE_API_URL = 'http://localhost:8080/api/recruteur/offres';

    useEffect(() => {
        if (recruteurId) {
            chargerCandidatures();
        } else {
            setLoading(false);
            setError("Erreur: ID du recruteur manquant.");
        }
    }, [recruteurId, filtreStatut]);

    const chargerCandidatures = async () => {
        setLoading(true);
        setError('');
        try {
            let url = `${API_URL}/recruteur/${recruteurId}`;
            if (filtreStatut !== 'ALL') {
                url = `${API_URL}/recruteur/${recruteurId}/statut/${filtreStatut}`;
            }

            const response = await axios.get(url);
            setCandidatures(response.data);
            setLoading(false);
        } catch (err) {
            console.error('Error loading candidatures:', err);
            if (err.response && (err.response.status === 404 || err.response.data === null || err.response.data.length === 0)) {
                setCandidatures([]);
                setError("Aucune candidature trouvée pour ce recruteur.");
            } else {
                setError("Erreur serveur lors du chargement des candidatures.");
                setCandidatures([]);
            }
            setLoading(false);
        }
    };

    const changerStatut = async (candidatureId, actionType, commentaire = "") => {
        try {
            setError('');
            let actionUrl;
            let statusMessage = '';

            if (actionType === 'Contacter') {
                actionUrl = `${API_URL}/${candidatureId}/en-cours`;
                statusMessage = 'Statut mis à jour : En cours (Contacté)';
            } else if (actionType === 'Rejeter') {
                actionUrl = `${API_URL}/${candidatureId}/refuser`;
                statusMessage = 'Candidature refusée';
            } else if (actionType === 'Accepter') {
                actionUrl = `${API_URL}/${candidatureId}/accepter`;
                statusMessage = 'Candidature acceptée';
            } else if (actionType === 'Interview') {
                actionUrl = `${API_URL}/${candidatureId}/interview`;
                statusMessage = 'Statut mis à jour : Interview';
            } else {
                return;
            }

            await axios.post(actionUrl, { commentaire });
            alert(statusMessage);
            await chargerCandidatures();
        } catch (err) {
            console.error('Error changing status:', err);
            setError(`Erreur lors de l'action: ${err.response?.data?.message || err.message}`);
        }
    };

    // Extract skills from competencesRequises
    const extractSkills = (text) => {
        if (!text) return [];
        
        const separators = /[,;\n•\-\*]/g;
        const skills = text.split(separators)
            .map(skill => skill.trim())
            .filter(skill => skill.length > 0 && skill.length < 100);
        
        return skills;
    };

    // Load interview checklist for a specific candidature
    const handleStartInterview = async (candidature) => {
        setSelectedCandidature(candidature);
        setLoading(true);
        
        try {
            // 1. Fetch the offre details to get competencesRequises
            const offreResponse = await axios.get(`${OFFRE_API_URL}/${candidature.offreId}`);
            const offre = offreResponse.data;
            
            // 2. Extract skills from offre
            const skills = extractSkills(offre.competencesRequises || '');
            setChecklistItems(skills);
            
            // 3. Try to load existing interview data from candidature
            try {
                const candidatureResponse = await axios.get(`${API_URL}/${candidature.id}`);
                const candData = candidatureResponse.data;
                
                // Parse existing interview data if available
                if (candData.interviewChecklistResults) {
                    const parsed = {};
                    candData.interviewChecklistResults.split(';').forEach(item => {
                        const [key, value] = item.split(':');
                        if (key) parsed[key] = value === 'true';
                    });
                    
                    // Map to indices
                    const mappedChecked = {};
                    skills.forEach((skill, index) => {
                        mappedChecked[index] = parsed[skill] || false;
                    });
                    setCheckedItems(mappedChecked);
                } else {
                    // Initialize empty
                    const initialChecked = {};
                    skills.forEach((_, index) => {
                        initialChecked[index] = false;
                    });
                    setCheckedItems(initialChecked);
                }
                
                // Load comments
                if (candData.interviewSkillComments) {
                    try {
                        const parsedComments = JSON.parse(candData.interviewSkillComments);
                        setSkillComments(parsedComments);
                    } catch (e) {
                        setSkillComments({});
                    }
                } else {
                    setSkillComments({});
                }
                
                setGlobalNotes(candData.interviewCommentaire || '');
                
            } catch (err) {
                console.log('No existing interview data, starting fresh');
                // Initialize empty
                const initialChecked = {};
                skills.forEach((_, index) => {
                    initialChecked[index] = false;
                });
                setCheckedItems(initialChecked);
                setSkillComments({});
                setGlobalNotes('');
            }
            
            setShowInterviewModal(true);
        } catch (err) {
            console.error('Error loading interview data:', err);
            setError('Erreur lors du chargement des données de l\'entretien');
        } finally {
            setLoading(false);
        }
    };

    const handleCheckToggle = (index) => {
        setCheckedItems(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    const handleSkillCommentChange = (index, value) => {
        setSkillComments(prev => ({
            ...prev,
            [index]: value
        }));
    };

    const getProgress = () => {
        const total = checklistItems.length;
        const checked = Object.values(checkedItems).filter(Boolean).length;
        return total > 0 ? Math.round((checked / total) * 100) : 0;
    };

    const soumettreNotation = async (e) => {
        e.preventDefault();
        if (!selectedCandidature) return;

        try {
            setError('');
            setLoading(true);

            // Build checklist string: "Skill1:true;Skill2:false;..."
            const checklistString = checklistItems
                .map((skill, index) => `${skill}:${checkedItems[index] || false}`)
                .join(';');

            const data = {
                checklistResults: checklistString,
                skillComments: JSON.stringify(skillComments),
                commentaire: globalNotes
            };

            console.log('Submitting interview notation:', data);

            await axios.post(
                `${API_URL}/${selectedCandidature.id}/noter-interview`,
                data
            );
            
            // Update status to INTERVIEW if not already
            if (selectedCandidature.statut !== 'INTERVIEW') {
                await changerStatut(selectedCandidature.id, 'Interview', globalNotes);
            }
            
            alert('Notation d\'interview enregistrée avec succès !');
            setShowInterviewModal(false);
            await chargerCandidatures();
        } catch (err) {
            console.error('Error submitting interview notation:', err);
            setError(`Erreur lors de la soumission: ${err.response?.data?.message || err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleContacter = (candidature) => {
        setSelectedCandidature(candidature);
        setShowContactModal(true);
    };

    const handleVoirProfil = (candidature) => {
    console.log('Selected candidature:', candidature);
    console.log('CV URL:', candidature.cvUrl);
    setSelectedCandidature(candidature);
    setShowProfileModal(true);
};

    const handleContactMethod = (method) => {
        if (!selectedCandidature) return;

        const email = selectedCandidature.emailCandidat;
        const tel = selectedCandidature.telephoneCandidat;

        if (method === 'phone' && tel) {
            window.location.href = `tel:${tel}`;
        } else if (method === 'email' && email) {
            window.location.href = `mailto:${email}`;
        }

        setShowContactModal(false);
        changerStatut(selectedCandidature.id, 'Contacter');
        setSelectedCandidature(null);
    };

    const getScoreClass = (score) => {
        if (score >= 85) return 'score-excellent';
        if (score >= 70) return 'score-good';
        return 'score-average';
    };

    const getStatutClass = (statut) => {
        switch (statut) {
            case 'EN_ATTENTE':
                return 'statut-nouveau';
            case 'EN_COURS':
                return 'statut-encours'; 
            case 'INTERVIEW': 
                return 'statut-interview'; 
            case 'ACCEPTEE':
                return 'statut-acceptee';
            case 'REFUSEE':
                return 'statut-refuse';
            default:
                return 'statut-nouveau';
        }
    };

    if (loading) {
        return <div className="loading">Chargement des candidatures...</div>;
    }

    const progress = getProgress();

    return (
        <div className="candidatures-container">
            <h2>Candidatures Reçues</h2>
            <p className="subtitle">Filtrage et consultation des CVs - Recruteur ID: {recruteurId}</p>

            <div className="filtres-candidature">
                <label>Filtrer par statut:</label>
                <select 
                    value={filtreStatut} 
                    onChange={(e) => setFiltreStatut(e.target.value)}
                    className="filtre-select"
                >
                    <option value="ALL">Tous</option>
                    <option value="EN_ATTENTE">En attente (Nouveau)</option>
                    <option value="EN_COURS">En cours (Contacté)</option>
                    <option value="INTERVIEW">Interview (Notation)</option>
                    <option value="ACCEPTEE">Acceptées</option>
                    <option value="REFUSEE">Refusées</option>
                </select>
            </div>

            {error && <div className="alert alert-error">{error}</div>}

            <div className="candidatures-list">
                {candidatures.length === 0 ? (
                    <div className="no-data">Aucune candidature trouvée.</div>
                ) : (
                    candidatures.map(candidature => (
                        <div key={candidature.id} className="candidature-card">
                            <div className="candidature-header">
                                <div>
                                    <h3>{candidature.nomCandidat} {candidature.prenomCandidat}</h3>
                                    <p className="poste">Offre: {candidature.titrOffre}</p>
                                </div>
                                <span className={`statut-badge ${getStatutClass(candidature.statut)}`}>
                                    {candidature.statut === 'EN_ATTENTE' ? 'Nouveau' : 
                                     candidature.statut === 'EN_COURS' ? 'Contacté' : 
                                     candidature.statut === 'INTERVIEW' ? 'Interview' : 
                                     candidature.statut}
                                </span>
                            </div>

                            <div className="candidature-info">
                                <div className="info-item">
                                    <span className="label">Score IA:</span>
                                    <span className={`score ${getScoreClass(candidature.scoreMatching)}`}>
                                        {candidature.scoreMatching != null ? `${candidature.scoreMatching.toFixed(0)}%` : 'N/A'}
                                    </span>
                                </div>
                                <div className="info-item">
                                    <span className="label">Date:</span>
                                    <span>{new Date(candidature.dateCandidature).toLocaleDateString('fr-FR')}</span>
                                </div>
                            </div>

                            <div className="candidature-actions">
                                <button 
                                    className="btn-view"
                                    onClick={() => handleVoirProfil(candidature)}
                                >
                                    Voir le profil
                                </button>
                                
                                <button 
                                    className="btn-contact"
                                    onClick={() => handleContacter(candidature)}
                                    disabled={candidature.statut === 'ACCEPTEE' || candidature.statut === 'REFUSEE' || candidature.statut === 'INTERVIEW'}
                                >
                                    Contacter
                                </button>
                                
                                <button
                                    className="btn-interview"
                                    onClick={() => handleStartInterview(candidature)}
                                    disabled={candidature.statut === 'ACCEPTEE' || candidature.statut === 'REFUSEE'}
                                >
                                    {candidature.statut === 'INTERVIEW' ? 'Voir Notation' : 'Interview'}
                                </button>

                                <button 
                                    className="btn-accept"
                                    onClick={() => changerStatut(candidature.id, 'Accepter')}
                                    disabled={candidature.statut === 'ACCEPTEE' || candidature.statut === 'REFUSEE'}
                                >
                                    Accepter
                                </button>

                                <button 
                                    className="btn-reject"
                                    onClick={() => changerStatut(candidature.id, 'Rejeter')}
                                    disabled={candidature.statut === 'ACCEPTEE' || candidature.statut === 'REFUSEE'}
                                >
                                    Rejeter
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Contact Modal */}
            {showContactModal && selectedCandidature && (
                <div className="modal-overlay" onClick={() => setShowContactModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Contacter le candidat</h3>
                            <button 
                                className="modal-close"
                                onClick={() => setShowContactModal(false)}
                            >
                                ×
                            </button>
                        </div>
                        
                        <div className="modal-body">
                            <p className="modal-subtitle">
                                Comment souhaitez-vous contacter <strong>{selectedCandidature.prenomCandidat} {selectedCandidature.nomCandidat}</strong> ?
                            </p>
                            
                            <div className="contact-options">
                                {selectedCandidature.telephoneCandidat && (
                                    <button 
                                        className="contact-option phone"
                                        onClick={() => handleContactMethod('phone')}
                                    >
                                        <span className="icon">📞</span>
                                        <div className="option-details">
                                            <span className="option-title">Appeler</span>
                                            <span className="option-value">{selectedCandidature.telephoneCandidat}</span>
                                        </div>
                                    </button>
                                )}
                                
                                {selectedCandidature.emailCandidat && (
                                    <button 
                                        className="contact-option email"
                                        onClick={() => handleContactMethod('email')}
                                    >
                                        <span className="icon">📧</span>
                                        <div className="option-details">
                                            <span className="option-title">Envoyer un email</span>
                                            <span className="option-value">{selectedCandidature.emailCandidat}</span>
                                        </div>
                                    </button>
                                )}
                                
                                {!selectedCandidature.telephoneCandidat && !selectedCandidature.emailCandidat && (
                                    <p className="no-contact-info">
                                        ⚠️ Aucune information de contact disponible
                                    </p>
                                )}
                            </div>
                        </div>
                        
                        <div className="modal-footer">
                            <button 
                                className="btn-cancel"
                                onClick={() => setShowContactModal(false)}
                            >
                                Annuler
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Profile Modal */}
            {showProfileModal && selectedCandidature && (
                <div className="modal-overlay" onClick={() => setShowProfileModal(false)}>
                    <div className="modal-content profile-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Profil du Candidat</h3>
                            <button 
                                className="modal-close"
                                onClick={() => setShowProfileModal(false)}
                            >
                                ×
                            </button>
                        </div>
                        
                        <div className="modal-body profile-body">
                            <div className="profile-section">
                                <h4>👤 Informations Personnelles</h4>
                                <div className="profile-info-grid">
                                    <div className="profile-info-item">
                                        <span className="profile-label">Nom complet:</span>
                                        <span className="profile-value">{selectedCandidature.prenomCandidat} {selectedCandidature.nomCandidat}</span>
                                    </div>
                                    <div className="profile-info-item">
                                        <span className="profile-label">Email:</span>
                                        <span className="profile-value">{selectedCandidature.emailCandidat || 'Non renseigné'}</span>
                                    </div>
                                    <div className="profile-info-item">
                                        <span className="profile-label">Téléphone:</span>
                                        <span className="profile-value">{selectedCandidature.telephoneCandidat || 'Non renseigné'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="profile-section">
                                <h4>🎓 Formation</h4>
                                <div className="profile-info-grid">
                                    <div className="profile-info-item">
                                        <span className="profile-label">Formation:</span>
                                        <span className="profile-value">{selectedCandidature.formation || 'Non renseigné'}</span>
                                    </div>
                                    <div className="profile-info-item">
                                        <span className="profile-label">Niveau d'étude:</span>
                                        <span className="profile-value">{selectedCandidature.niveauEtude || 'Non renseigné'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="profile-section">
                                <h4>💼 Compétences</h4>
                                <div className="profile-competences">
                                    {selectedCandidature.competences ? (
                                        selectedCandidature.competences.split(',').map((comp, index) => (
                                            <span key={index} className="competence-tag">{comp.trim()}</span>
                                        ))
                                    ) : (
                                        <span className="profile-value">Non renseigné</span>
                                    )}
                                </div>
                            </div>

                            <div className="profile-section">
                                <h4>📄 Candidature</h4>
                                <div className="profile-info-grid">
                                    <div className="profile-info-item">
                                        <span className="profile-label">Poste:</span>
                                        <span className="profile-value">{selectedCandidature.titrOffre}</span>
                                    </div>
                                    <div className="profile-info-item">
                                        <span className="profile-label">Date de candidature:</span>
                                        <span className="profile-value">{new Date(selectedCandidature.dateCandidature).toLocaleDateString('fr-FR')}</span>
                                    </div>
                                    <div className="profile-info-item">
                                        <span className="profile-label">Score IA:</span>
                                        <span className={`score ${getScoreClass(selectedCandidature.scoreMatching)}`}>
                                            {selectedCandidature.scoreMatching != null ? `${selectedCandidature.scoreMatching.toFixed(0)}%` : 'N/A'}
                                        </span>
                                    </div>
                                    <div className="profile-info-item">
                                        <span className="profile-label">Statut:</span>
                                        <span className={`statut-badge ${getStatutClass(selectedCandidature.statut)}`}>
                                            {selectedCandidature.statut === 'EN_ATTENTE' ? 'Nouveau' : 
                                             selectedCandidature.statut === 'EN_COURS' ? 'Contacté' : 
                                             selectedCandidature.statut === 'INTERVIEW' ? 'Interview' : 
                                             selectedCandidature.statut}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {selectedCandidature.lettreMotivation && (
                                <div className="profile-section">
                                    <h4>✉️ Lettre de Motivation</h4>
                                    <div className="lettre-motivation">
                                        {selectedCandidature.lettreMotivation}
                                    </div>
                                </div>
                            )}

                            {/* FIXED CV SECTION - TEMPORARY STATIC CV */}
<div className="profile-section">
    <h4>📎 CV</h4>
    <a
        href="/cv/CV-CHARRAI%20MANAL%20-cybers%C3%A9curit%C3%A9-Data.pdf"
        target="_blank"
        rel="noopener noreferrer"
        className="cv-link"
    >
        📄 Télécharger le CV
    </a>
</div>

                        </div>
                        
                        <div className="modal-footer">
                            <button 
                                className="btn-cancel"
                                onClick={() => setShowProfileModal(false)}
                            >
                                Fermer
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Interview Checklist Modal */}
            {showInterviewModal && selectedCandidature && (
                <div className="modal-overlay" onClick={() => setShowInterviewModal(false)}>
                    <div className="modal-content interview-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>🎯 Checklist d'Entretien</h3>
                            <button 
                                className="modal-close"
                                onClick={() => setShowInterviewModal(false)}
                            >
                                ×
                            </button>
                        </div>

                        <div className="interview-info">
                            <h4>{selectedCandidature.prenomCandidat} {selectedCandidature.nomCandidat}</h4>
                            <p className="company-name">Poste: {selectedCandidature.titrOffre}</p>
                        </div>

                        <div className="progress-section">
                            <div className="progress-label">
                                <span>Progression de l'Évaluation</span>
                                <span className="progress-percentage">{progress}%</span>
                            </div>
                            <div className="progress-bar">
                                <div 
                                    className="progress-fill" 
                                    style={{ width: `${progress}%` }}
                                ></div>
                            </div>
                        </div>

                        <form onSubmit={soumettreNotation}>
                            <div className="modal-body interview-body">
                                
                                <div className="checklist-section">
                                    <h5>Compétences à Évaluer (basées sur l'offre):</h5>
                                    {checklistItems.length === 0 ? (
                                        <p className="no-items">Aucune compétence trouvée dans la description de l'offre</p>
                                    ) : (
                                        <div className="checklist-items">
                                            {checklistItems.map((skill, index) => (
                                                <div key={index} className="checklist-item-wrapper">
                                                    <div className="checklist-item">
                                                        <label className="checkbox-container">
                                                            <input
                                                                type="checkbox"
                                                                checked={checkedItems[index] || false}
                                                                onChange={() => handleCheckToggle(index)}
                                                            />
                                                            <span className="checkmark"></span>
                                                            <span className="skill-text">{skill}</span>
                                                        </label>
                                                    </div>
                                                    <textarea
                                                        className="skill-comment"
                                                        placeholder="Commentaire sur cette compétence..."
                                                        value={skillComments[index] || ''}
                                                        onChange={(e) => handleSkillCommentChange(index, e.target.value)}
                                                        rows="2"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="global-notes-section">
                                    <h5>💬 Notes Générales de l'Entretien:</h5>
                                    <textarea
                                        className="global-notes"
                                        placeholder="Notes générales: points forts, points faibles, impressions générales, décision finale..."
                                        value={globalNotes}
                                        onChange={(e) => setGlobalNotes(e.target.value)}
                                        rows="5"
                                    />
                                </div>

                            </div>
                            
                            <div className="modal-footer">
                                <button 
                                    type="button"
                                    className="btn-cancel"
                                    onClick={() => setShowInterviewModal(false)}
                                >
                                    Annuler
                                </button>
                                <button 
                                    type="submit" 
                                    className="btn-primary"
                                    disabled={loading}
                                >
                                    {loading ? 'Enregistrement...' : 'Enregistrer la Notation'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
};

export default ConsulterCandidatures;