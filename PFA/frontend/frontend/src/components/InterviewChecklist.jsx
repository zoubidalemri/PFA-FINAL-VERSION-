import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/InterviewChecklist.css';

const InterviewChecklist = ({ offre, onClose }) => {
  const [checklistItems, setChecklistItems] = useState([]);
  const [checkedItems, setCheckedItems] = useState({});
  const [comments, setComments] = useState({});
  const [globalNotes, setGlobalNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    if (offre) {
      loadChecklistData();
    }
  }, [offre]);

  const loadChecklistData = async () => {
    // Always extract skills from competencesRequises first
    const skills = extractSkills(offre.competencesRequises || '');
    setChecklistItems(skills);
    
    try {
      // Try to load existing checklist data
      const response = await axios.get(
        `http://localhost:8080/api/recruteur/offres/${offre.id}/checklist`
      );
      
      console.log('Loaded checklist response:', response.data);
      
      // Access the nested interviewChecklist object
      if (response.data && response.data.interviewChecklist) {
        const data = response.data.interviewChecklist;
        setCheckedItems(data.checkedItems || {});
        setComments(data.comments || {});
        setGlobalNotes(data.globalNotes || '');
      } else {
        // Initialize empty if no saved data
        initializeEmpty(skills);
      }
    } catch (err) {
      console.log('No existing checklist, starting fresh:', err.message);
      initializeEmpty(skills);
    }
  };

  const initializeEmpty = (skills) => {
    const initialChecked = {};
    skills.forEach((_, index) => {
      initialChecked[index] = false;
    });
    setCheckedItems(initialChecked);
  };

  const extractSkills = (text) => {
    if (!text) return [];
    
    const separators = /[,;\n•\-\*]/g;
    const skills = text.split(separators)
      .map(skill => skill.trim())
      .filter(skill => skill.length > 0 && skill.length < 100);
    
    return skills;
  };

  const handleCheckToggle = (index) => {
    setCheckedItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const handleCommentChange = (index, value) => {
    setComments(prev => ({
      ...prev,
      [index]: value
    }));
  };

  const getProgress = () => {
    const total = checklistItems.length;
    const checked = Object.values(checkedItems).filter(Boolean).length;
    return total > 0 ? Math.round((checked / total) * 100) : 0;
  };

  const saveChecklist = async () => {
    setSaving(true);
    setSaveMessage('');
    
    try {
      const checklistData = {
        checkedItems: checkedItems,
        comments: comments,
        globalNotes: globalNotes,
        lastUpdated: new Date().toISOString()
      };

      console.log('Saving checklist data:', { interviewChecklist: checklistData });

      const response = await axios.patch(
        `http://localhost:8080/api/recruteur/offres/${offre.id}/checklist`,
        { interviewChecklist: checklistData }
      );
      
      console.log('Save response:', response.data);
      
      setSaveMessage('✓ Sauvegardé avec succès!');
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      console.error('Error saving checklist:', err);
      console.error('Error response:', err.response?.data);
      console.error('Error status:', err.response?.status);
      
      let errorMessage = '✗ Erreur lors de la sauvegarde';
      
      if (err.response) {
        if (err.response.status === 404) {
          errorMessage = '✗ Offre non trouvée';
        } else if (err.response.status === 500) {
          errorMessage = '✗ Erreur serveur: ' + (err.response.data?.message || 'Vérifiez les logs backend');
        } else if (err.response.data) {
          errorMessage = '✗ ' + (err.response.data.message || err.response.data);
        }
      } else if (err.request) {
        errorMessage = '✗ Pas de réponse du serveur - vérifiez que le backend est lancé';
      } else {
        errorMessage = '✗ ' + err.message;
      }
      
      setSaveMessage(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  if (!offre) return null;

  const progress = getProgress();

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content interview-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>🎯 Checklist d'Entretien</h3>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="interview-info">
          <h4>{offre.titre}</h4>
          <p className="company-name">{offre.entreprise || 'Entreprise'}</p>
          <p className="location">{offre.localisation}</p>
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

        <div className="checklist-section">
          <h5>Compétences à Évaluer:</h5>
          {checklistItems.length === 0 ? (
            <p className="no-items">Aucune compétence trouvée dans la description</p>
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
                    value={comments[index] || ''}
                    onChange={(e) => handleCommentChange(index, e.target.value)}
                    rows="2"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="global-notes-section">
          <h5>Notes Générales de l'Entretien:</h5>
          <textarea
            className="global-notes"
            placeholder="Notes générales: points forts, points faibles, impressions, questions pour le prochain entretien..."
            value={globalNotes}
            onChange={(e) => setGlobalNotes(e.target.value)}
            rows="5"
          />
        </div>

        {saveMessage && (
          <div className={`save-message ${saveMessage.includes('✓') ? 'success' : 'error'}`}>
            {saveMessage}
          </div>
        )}

        <div className="modal-actions">
          <button 
            className="btn-secondary" 
            onClick={onClose}
            disabled={saving}
          >
            Annuler
          </button>
          <button 
            className="btn-primary" 
            onClick={saveChecklist}
            disabled={saving}
          >
            {saving ? 'Sauvegarde...' : 'Sauvegarder & Fermer'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InterviewChecklist;