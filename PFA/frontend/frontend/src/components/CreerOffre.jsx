import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/CreerOffre.css';

const CreerOffre = ({ recruteurId, onOffreCreated }) => {
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    typeContrat: 'CDI',
    localisation: '',
    niveauExperience: 'Junior',
    competencesRequises: '',
    salaireMin: '',
    salaireMax: '',
    statut: 'BROUILLON',
    dateExpiration: '',
    recruteurId: recruteurId
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // CRITICAL: Update recruteurId when prop changes
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      recruteurId: recruteurId
    }));
  }, [recruteurId]);

  // CRITICAL: Validate recruteurId before rendering
  if (!recruteurId) {
    return (
      <div className="creer-offre-container">
        <div className="alert alert-error">
          Erreur: ID du recruteur manquant. Veuillez vous reconnecter.
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    // CRITICAL: Double-check recruteurId before sending
    if (!formData.recruteurId) {
      setError('ID du recruteur manquant. Impossible de créer l\'offre.');
      setLoading(false);
      return;
    }

    // CRITICAL FIX: Convert date to LocalDateTime format
    const dataToSend = {
      ...formData,
      dateExpiration: formData.dateExpiration 
        ? `${formData.dateExpiration}T23:59:59`  // Add time component
        : null
    };

    // Log the data being sent (for debugging)
    console.log('Sending data:', dataToSend);

    try {
      const response = await axios.post(
        'http://localhost:8080/api/recruteur/offres',
        dataToSend
      );
      
      setSuccess(true);
      setTimeout(() => {
        if (onOffreCreated) {
          onOffreCreated(response.data);
        }
        // Reset form
        setFormData({
          titre: '',
          description: '',
          typeContrat: 'CDI',
          localisation: '',
          niveauExperience: 'Junior',
          competencesRequises: '',
          salaireMin: '',
          salaireMax: '',
          statut: 'BROUILLON',
          dateExpiration: '',
          recruteurId: recruteurId
        });
        setSuccess(false);
      }, 2000);
    } catch (err) {
      console.error('Error details:', err.response?.data);
      
      // Better error handling
      if (err.response?.status === 404) {
        setError('Recruteur non trouvé. Veuillez vérifier votre connexion.');
      } else if (err.response?.status === 500) {
        setError('Erreur serveur: ' + (err.response?.data?.message || 'Vérifiez que toutes les données sont correctes.'));
      } else {
        setError('Erreur lors de la création de l\'offre: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="creer-offre-container">
      <h2>Créer une Nouvelle Offre</h2>
      
      {/* Debug info - Remove in production */}
      <div style={{padding: '10px', background: '#f0f0f0', marginBottom: '10px', fontSize: '12px'}}>
        Debug: Recruteur ID = {recruteurId || 'MISSING!'}
      </div>
      
      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">Offre créée avec succès!</div>}
      
      <form onSubmit={handleSubmit} className="offre-form">
        <div className="form-group">
          <label htmlFor="titre">Titre du Poste *</label>
          <input
            type="text"
            id="titre"
            name="titre"
            value={formData.titre}
            onChange={handleChange}
            required
            placeholder="Ex: Développeur Full Stack"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description *</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="6"
            placeholder="Décrivez le poste, les missions, l'environnement de travail..."
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="typeContrat">Type de Contrat *</label>
            <select
              id="typeContrat"
              name="typeContrat"
              value={formData.typeContrat}
              onChange={handleChange}
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
            <label htmlFor="localisation">Localisation *</label>
            <input
              type="text"
              id="localisation"
              name="localisation"
              value={formData.localisation}
              onChange={handleChange}
              required
              placeholder="Ex: Paris, France"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="niveauExperience">Niveau d'Expérience *</label>
          <select
            id="niveauExperience"
            name="niveauExperience"
            value={formData.niveauExperience}
            onChange={handleChange}
            required
          >
            <option value="Junior">Junior (0-2 ans)</option>
            <option value="Intermédiaire">Intermédiaire (2-5 ans)</option>
            <option value="Senior">Senior (5+ ans)</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="competencesRequises">Compétences Requises *</label>
          <textarea
            id="competencesRequises"
            name="competencesRequises"
            value={formData.competencesRequises}
            onChange={handleChange}
            required
            rows="4"
            placeholder="Ex: Java, Spring Boot, React, PostgreSQL..."
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="salaireMin">Salaire Min (€/an)</label>
            <input
              type="number"
              id="salaireMin"
              name="salaireMin"
              value={formData.salaireMin}
              onChange={handleChange}
              placeholder="35000"
            />
          </div>

          <div className="form-group">
            <label htmlFor="salaireMax">Salaire Max (€/an)</label>
            <input
              type="number"
              id="salaireMax"
              name="salaireMax"
              value={formData.salaireMax}
              onChange={handleChange}
              placeholder="50000"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="statut">Statut *</label>
            <select
              id="statut"
              name="statut"
              value={formData.statut}
              onChange={handleChange}
              required
            >
              <option value="BROUILLON">Brouillon</option>
              <option value="ACTIVE">Active</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="dateExpiration">Date d'Expiration</label>
            <input
              type="date"
              id="dateExpiration"
              name="dateExpiration"
              value={formData.dateExpiration}
              onChange={handleChange}
            />
          </div>
        </div>

        <button 
          type="submit" 
          className="btn-submit"
          disabled={loading}
        >
          {loading ? 'Création en cours...' : 'Créer l\'Offre'}
        </button>
      </form>
    </div>
  );
};

export default CreerOffre;