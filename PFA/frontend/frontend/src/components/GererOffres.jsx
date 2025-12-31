import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/GererOffres.css';

const GererOffres = ({ recruteurId }) => {
    const [offres, setOffres] = useState([]);
    const [filtreStatut, setFiltreStatut] = useState('TOUS');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [offreSelectionnee, setOffreSelectionnee] = useState(null);
    const [modeEdition, setModeEdition] = useState(false);

    useEffect(() => {
        if (recruteurId) {
            chargerOffres();
        }
    }, [recruteurId, filtreStatut]);

    const chargerOffres = async () => {
        try {
            setLoading(true);
            setError('');
            
            let url = `http://localhost:8080/api/recruteur/offres/recruteur/${recruteurId}`;
            
            if (filtreStatut !== 'TOUS') {
                url = `http://localhost:8080/api/recruteur/offres/recruteur/${recruteurId}/statut/${filtreStatut}`;
            }
            
            console.log('Fetching offres from:', url);
            const response = await axios.get(url);
            setOffres(response.data);
        } catch (err) {
            console.error('Error loading offres:', err);
            console.error('Error response:', err.response);
            
            let errorMessage = 'Erreur lors du chargement des offres';
            
            if (err.response) {
                if (err.response.status === 404) {
                    errorMessage = 'Aucune offre trouvée';
                } else if (err.response.status === 500) {
                    errorMessage = 'Erreur serveur - vérifiez les logs backend';
                } else if (err.response.data) {
                    if (typeof err.response.data === 'string') {
                        errorMessage = err.response.data;
                    } else if (err.response.data.message) {
                        errorMessage = err.response.data.message;
                    }
                }
            } else if (err.request) {
                errorMessage = 'Pas de réponse du serveur - vérifiez que le backend est lancé';
            } else {
                errorMessage = err.message;
            }
            
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const changerStatut = async (offreId, nouveauStatut) => {
        try {
            setError('');
            console.log(`Changing status of offre ${offreId} to ${nouveauStatut}`);
            
            const response = await axios.patch(
                `http://localhost:8080/api/recruteur/offres/${offreId}/statut?statut=${nouveauStatut}`
            );
            
            console.log('Status changed successfully:', response.data);
            await chargerOffres();
        } catch (err) {
            console.error('Error changing status:', err);
            console.error('Error response:', err.response);
            
            let errorMessage = 'Erreur lors du changement de statut';
            
            if (err.response) {
                if (err.response.status === 404) {
                    errorMessage = 'Offre non trouvée';
                } else if (err.response.status === 500) {
                    errorMessage = 'Erreur serveur - vérifiez les logs backend';
                } else if (err.response.data) {
                    if (typeof err.response.data === 'string') {
                        errorMessage = err.response.data;
                    } else if (err.response.data.message) {
                        errorMessage = err.response.data.message;
                    } else {
                        errorMessage = `Erreur ${err.response.status}`;
                    }
                }
            } else if (err.request) {
                errorMessage = 'Pas de réponse du serveur';
            } else {
                errorMessage = err.message;
            }
            
            setError(errorMessage);
        }
    };

    const supprimerOffre = async (offreId) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette offre ?')) {
            try {
                setError('');
                console.log('Deleting offre:', offreId);
                
                await axios.delete(`http://localhost:8080/api/recruteur/offres/${offreId}`);
                
                console.log('Offre deleted successfully');
                await chargerOffres();
                
                setError('');
                alert('Offre supprimée avec succès!');
            } catch (err) {
                console.error('Error deleting offre:', err);
                console.error('Error response:', err.response);
                console.error('Error status:', err.response?.status);
                console.error('Error data:', err.response?.data);
                
                let errorMessage = 'Erreur lors de la suppression';
                
                if (err.response) {
                    if (err.response.status === 404) {
                        errorMessage = 'Offre non trouvée';
                    } else if (err.response.status === 500) {
                        errorMessage = 'Erreur serveur - vérifiez les logs backend';
                    } else if (err.response.data) {
                        if (typeof err.response.data === 'string') {
                            errorMessage = err.response.data;
                        } else if (err.response.data.message) {
                            errorMessage = err.response.data.message;
                        } else {
                            errorMessage = `Erreur ${err.response.status}: ${JSON.stringify(err.response.data)}`;
                        }
                    }
                } else if (err.request) {
                    errorMessage = 'Pas de réponse du serveur - vérifiez que le backend est lancé';
                } else {
                    errorMessage = err.message;
                }
                
                setError(errorMessage);
            }
        }
    };

    const modifierOffre = (offre) => {
        setOffreSelectionnee({...offre});
        setModeEdition(true);
        setError('');
    };

    const handleModification = async (e) => {
        e.preventDefault();
        try {
            setError('');
            console.log('Updating offre:', offreSelectionnee);
            
            const dataToSend = {
                ...offreSelectionnee,
                dateExpiration: offreSelectionnee.dateExpiration 
                    ? (typeof offreSelectionnee.dateExpiration === 'string' && 
                       offreSelectionnee.dateExpiration.length === 10
                       ? `${offreSelectionnee.dateExpiration}T23:59:59`
                       : offreSelectionnee.dateExpiration)
                    : null
            };
            
            await axios.put(
                `http://localhost:8080/api/recruteur/offres/${offreSelectionnee.id}`,
                dataToSend
            );
            
            setModeEdition(false);
            setOffreSelectionnee(null);
            await chargerOffres();
            alert('Offre modifiée avec succès!');
        } catch (err) {
            console.error('Error updating offre:', err);
            console.error('Error response:', err.response);
            
            let errorMessage = 'Erreur lors de la modification';
            
            if (err.response) {
                if (err.response.status === 404) {
                    errorMessage = 'Offre non trouvée';
                } else if (err.response.status === 500) {
                    errorMessage = 'Erreur serveur - vérifiez les logs backend';
                } else if (err.response.data) {
                    if (typeof err.response.data === 'string') {
                        errorMessage = err.response.data;
                    } else if (err.response.data.message) {
                        errorMessage = err.response.data.message;
                    }
                }
            } else if (err.request) {
                errorMessage = 'Pas de réponse du serveur';
            } else {
                errorMessage = err.message;
            }
            
            setError(errorMessage);
        }
    };

    const getStatutBadgeClass = (statut) => {
        switch (statut) {
            case 'ACTIVE': return 'badge-active';
            case 'FERMEE': return 'badge-fermee';
            case 'BROUILLON': return 'badge-brouillon';
            default: return '';
        }
    };
    
    const shareOffre = (platform, offre) => {
        const offerUrl = encodeURIComponent(`http://localhost:3000/offre/${offre.id}`);
        const title = encodeURIComponent(offre.titre);
        const company = encodeURIComponent('Votre Entreprise');

        let shareUrl = '';

        if (platform === 'linkedin') {
            shareUrl = `https://www.linkedin.com/sharing/share-off-site/?url=${offerUrl}`;
        } else if (platform === 'indeed') {
            shareUrl = `https://apply.indeed.com/indeed/job-search?q=${title}+${company}&l=${offre.localisation}`;
            alert("L'intégration directe à Indeed pour poster est complexe. Nous allons ouvrir une recherche ou vous diriger vers le portail de publication.");
        }
        
        if (shareUrl) {
            window.open(shareUrl, '_blank');
        }
    };

    if (!recruteurId) {
        return (
            <div className="gerer-offres-container">
                <div className="alert alert-error">
                    Erreur: ID du recruteur manquant
                </div>
            </div>
        );
    }

    if (loading) return <div className="loading">Chargement...</div>;

    return (
        <div className="gerer-offres-container">
            <div className="header">
                <h2>Gérer Mes Offres</h2>
                <div className="filtres">
                    <label>Filtrer par statut:</label>
                    <select 
                        value={filtreStatut} 
                        onChange={(e) => setFiltreStatut(e.target.value)}
                        className="filtre-select"
                    >
                        <option value="TOUS">Tous</option>
                        <option value="ACTIVE">Actives</option>
                        <option value="BROUILLON">Brouillons</option>
                        <option value="FERMEE">Fermées</option>
                    </select>
                </div>
            </div>

            {error && (
                <div className="alert alert-error">
                    {error}
                    <button onClick={() => setError('')} style={{marginLeft: '10px'}}>✕</button>
                </div>
            )}

            {/* MODAL EDITION */}
            {modeEdition && offreSelectionnee ? (
                <div className="modal-overlay" onClick={() => {
                    setModeEdition(false);
                    setOffreSelectionnee(null);
                }}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h3>Modifier l'Offre</h3>
                        <form onSubmit={handleModification}>
                            <div className="form-group">
                                <label>Titre *</label>
                                <input
                                    type="text"
                                    value={offreSelectionnee.titre || ''}
                                    onChange={(e) => setOffreSelectionnee({
                                        ...offreSelectionnee,
                                        titre: e.target.value
                                    })}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Description *</label>
                                <textarea
                                    value={offreSelectionnee.description || ''}
                                    onChange={(e) => setOffreSelectionnee({
                                        ...offreSelectionnee,
                                        description: e.target.value
                                    })}
                                    rows="5"
                                    required
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Type de Contrat *</label>
                                    <select
                                        value={offreSelectionnee.typeContrat || 'CDI'}
                                        onChange={(e) => setOffreSelectionnee({
                                            ...offreSelectionnee,
                                            typeContrat: e.target.value
                                        })}
                                        required
                                    >
                                        <option value="CDI">CDI</option>
                                        <option value="CDD">CDD</option>
                                        <option value="Stage">Stage</option>
                                        <option value="Alternance">Alternance</option>
                                        <option value="Freelance">Freelance</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Localisation *</label>
                                    <input
                                        type="text"
                                        value={offreSelectionnee.localisation || ''}
                                        onChange={(e) => setOffreSelectionnee({
                                            ...offreSelectionnee,
                                            localisation: e.target.value
                                        })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Niveau d'Expérience *</label>
                                <select
                                    value={offreSelectionnee.niveauExperience || 'Junior'}
                                    onChange={(e) => setOffreSelectionnee({
                                        ...offreSelectionnee,
                                        niveauExperience: e.target.value
                                    })}
                                    required
                                >
                                    <option value="Junior">Junior (0-2 ans)</option>
                                    <option value="Intermédiaire">Intermédiaire (2-5 ans)</option>
                                    <option value="Senior">Senior (5+ ans)</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Compétences Requises *</label>
                                <textarea
                                    value={offreSelectionnee.competencesRequises || ''}
                                    onChange={(e) => setOffreSelectionnee({
                                        ...offreSelectionnee,
                                        competencesRequises: e.target.value
                                    })}
                                    rows="3"
                                    required
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Salaire Min (€/an)</label>
                                    <input
                                        type="number"
                                        value={offreSelectionnee.salaireMin || ''}
                                        onChange={(e) => setOffreSelectionnee({
                                            ...offreSelectionnee,
                                            salaireMin: e.target.value
                                        })}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Salaire Max (€/an)</label>
                                    <input
                                        type="number"
                                        value={offreSelectionnee.salaireMax || ''}
                                        onChange={(e) => setOffreSelectionnee({
                                            ...offreSelectionnee,
                                            salaireMax: e.target.value
                                        })}
                                    />
                                </div>
                            </div>

                            <div className="modal-actions">
                                <button type="submit" className="btn-primary">
                                    Enregistrer
                                </button>
                                <button 
                                    type="button" 
                                    className="btn-secondary"
                                    onClick={() => {
                                        setModeEdition(false);
                                        setOffreSelectionnee(null);
                                    }}
                                >
                                    Annuler
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            ) : null}

            {/* Offres Grid */}
            <div className="offres-grid">
                {offres.length === 0 ? (
                    <div className="no-data">Aucune offre trouvée</div>
                ) : (
                    offres.map(offre => (
                        <div key={offre.id} className="offre-card">
                            <div className="offre-header">
                                <h3>{offre.titre}</h3>
                                <span className={`badge ${getStatutBadgeClass(offre.statut)}`}>
                                    {offre.statut}
                                </span>
                            </div>

                            <div className="offre-info">
                                <p><strong>Type:</strong> {offre.typeContrat}</p>
                                <p><strong>Localisation:</strong> {offre.localisation}</p>
                                <p><strong>Expérience:</strong> {offre.niveauExperience}</p>
                                {offre.salaireMin && offre.salaireMax && (
                                    <p><strong>Salaire:</strong> {offre.salaireMin}€ - {offre.salaireMax}€</p>
                                )}
                                <p><strong>Candidatures:</strong> {offre.nombreCandidatures || 0}</p>
                            </div>

                            <div className="offre-description">
                                <p>{offre.description?.substring(0, 150)}...</p>
                            </div>
                            
                            {/* Share Buttons */}
                            {offre.statut === 'ACTIVE' && (
                                <div className="offre-share-actions">
                                    <button 
                                        className="btn-share btn-linkedin"
                                        onClick={() => shareOffre('linkedin', offre)}
                                        title="Partager sur LinkedIn"
                                    >
                                        <span className="share-icon">in</span> LinkedIn
                                    </button>
                                    <button
                                        className="btn-share btn-indeed"
                                        onClick={() => shareOffre('indeed', offre)}
                                        title="Simuler un partage Indeed"
                                    >
                                        <span className="share-icon">i</span> Indeed
                                    </button>
                                </div>
                            )}

                            <div className="offre-actions">
                                <button 
                                    className="btn-action btn-edit"
                                    onClick={() => modifierOffre(offre)}
                                    title="Modifier cette offre"
                                >
                                    Modifier
                                </button>
                                
                                {offre.statut === 'BROUILLON' && (
                                    <button
                                        className="btn-action btn-publish"
                                        onClick={() => changerStatut(offre.id, 'ACTIVE')}
                                        title="Publier cette offre"
                                    >
                                        Publier
                                    </button>
                                )}
                                
                                {offre.statut === 'ACTIVE' && (
                                    <button
                                        className="btn-action btn-close"
                                        onClick={() => changerStatut(offre.id, 'FERMEE')}
                                        title="Fermer cette offre"
                                    >
                                        Fermer
                                    </button>
                                )}
                                
                                <button
                                    className="btn-action btn-delete"
                                    onClick={() => supprimerOffre(offre.id)}
                                    title="Supprimer définitivement"
                                >
                                    Supprimer
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default GererOffres;