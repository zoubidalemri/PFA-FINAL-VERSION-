import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/client";
import "../Styles/profile.css";
import { useAuth } from "../context/AuthContext";

const emptyProfile = {
  firstName: "",
  lastName: "",
  headline: "",
  bio: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  country: "",
  dateOfBirth: "",
  openToWork: true,
  linkedinUrl: "",
  githubUrl: "",
  portfolioUrl: "",
  experiences: [],
  educations: [],
  certifications: [],
  languages: [],
  skills: [],
};

function ProfilePage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(emptyProfile);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState("");

  const [documents, setDocuments] = useState([]);
  const [docLabel, setDocLabel] = useState("");
  const [docType, setDocType] = useState("CV");
  const [docFile, setDocFile] = useState(null);
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [docMessage, setDocMessage] = useState("");

  // mini formulaires pour les sections CV
  const [expForm, setExpForm] = useState({
    title: "",
    company: "",
    location: "",
    startDate: "",
    endDate: "",
    description: "",
  });

  const [eduForm, setEduForm] = useState({
    school: "",
    degree: "",
    field: "",
    startDate: "",
    endDate: "",
    description: "",
  });

  const [certForm, setCertForm] = useState({
    name: "",
    provider: "",
    dateObtained: "",
    expiryDate: "",
    credentialUrl: "",
  });

  const [langForm, setLangForm] = useState({
    language: "",
    level: "",
  });

  const [skillForm, setSkillForm] = useState({
    name: "",
    level: "",
  });

  // 0. Redirection si pas connecté
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  // 1. Chargement profil complet + documents
  useEffect(() => {
    if (!user) return;
    const candidateId = user.id;

    const fetchData = async () => {
      try {
        const profileRes = await apiClient.get(
          `/api/candidates/${candidateId}/profile`
        );
        const p = profileRes.data || {};

        setProfile({
          ...emptyProfile,
          ...p,
          dateOfBirth: p.dateOfBirth ? p.dateOfBirth.substring(0, 10) : "",
          experiences: p.experiences || [],
          educations: p.educations || [],
          certifications: p.certifications || [],
          languages: p.languages || [],
          skills: p.skills || [],
        });

        const docsRes = await apiClient.get(
          `/api/candidates/${candidateId}/documents`
        );
        setDocuments(docsRes.data || []);
      } catch (err) {
        console.error("Erreur chargement profil/documents", err);
        setProfileMessage("Erreur lors du chargement du profil.");
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchData();
  }, [user]);

  // 2. Gestion formulaire infos générales
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!user) return;

    setSavingProfile(true);
    setProfileMessage("");

    try {
      const payload = {
        ...profile,
        dateOfBirth: profile.dateOfBirth || null,
      };

      const res = await apiClient.put(
        `/api/candidates/${user.id}/profile`,
        payload
      );

      const p = res.data || {};
      setProfile((prev) => ({
        ...prev,
        ...p,
        dateOfBirth: p.dateOfBirth
          ? p.dateOfBirth.substring(0, 10)
          : prev.dateOfBirth,
      }));

      setProfileMessage("Profil enregistré avec succès.");
    } catch (err) {
      console.error("Erreur sauvegarde profil", err);
      setProfileMessage("Erreur lors de l’enregistrement du profil.");
    } finally {
      setSavingProfile(false);
    }
  };

  // 3. Upload docs
  const handleDocFileChange = (e) => {
    setDocFile(e.target.files?.[0] || null);
  };

  const handleUploadDoc = async (e) => {
    e.preventDefault();
    if (!user) return;

    setDocMessage("");

    if (!docFile) {
      setDocMessage("Merci de choisir un fichier.");
      return;
    }
    if (!docLabel.trim()) {
      setDocMessage("Merci de saisir un libellé pour le document.");
      return;
    }

    setUploadingDoc(true);
    try {
      const formData = new FormData();
      formData.append("label", docLabel);
      formData.append("type", docType);
      formData.append("file", docFile);

      const res = await apiClient.post(
        `/api/candidates/${user.id}/documents`,
        formData
      );

      setDocuments((prev) => [...prev, res.data]);
      setDocLabel("");
      setDocType("CV");
      setDocFile(null);

      setDocMessage("Document uploadé avec succès.");
    } catch (err) {
      console.error("Erreur upload document", err);
      setDocMessage("Erreur lors de l’upload du document.");
    } finally {
      setUploadingDoc(false);
    }
  };

  // 4. Auto-fill depuis un CV
  const handleAutoFillFromCv = async (documentId) => {
    if (!user) return;

    setProfileMessage("");

    try {
      const res = await apiClient.post(
        `/api/candidates/${user.id}/profile/autofill-from-cv`,
        null,
        { params: { documentId } }
      );

      const p = res.data || {};
      setProfile((prev) => ({
        ...prev,
        ...p,
        dateOfBirth: p.dateOfBirth
          ? p.dateOfBirth.substring(0, 10)
          : prev.dateOfBirth,
        experiences: p.experiences || prev.experiences,
        educations: p.educations || prev.educations,
        certifications: p.certifications || prev.certifications,
        languages: p.languages || prev.languages,
        skills: p.skills || prev.skills,
      }));

      setProfileMessage(
        "Profil pré-rempli à partir du CV (vérifie avant d’enregistrer)."
      );
    } catch (err) {
      console.error("Erreur auto-fill CV", err);
      setProfileMessage(
        "Erreur lors du remplissage automatique depuis le CV."
      );
    }
  };

  // 5. Ajout expérience
  const handleAddExperience = async (e) => {
    e.preventDefault();
    if (!user) return;

    try {
      const res = await apiClient.post(
        `/api/candidates/${user.id}/experiences`,
        expForm
      );
      setProfile((prev) => ({
        ...prev,
        experiences: [...prev.experiences, res.data],
      }));
      setExpForm({
        title: "",
        company: "",
        location: "",
        startDate: "",
        endDate: "",
        description: "",
      });
    } catch (err) {
      console.error("Erreur ajout expérience", err);
    }
  };

  // 6. Ajout formation
  const handleAddEducation = async (e) => {
    e.preventDefault();
    if (!user) return;

    try {
      const res = await apiClient.post(
        `/api/candidates/${user.id}/educations`,
        eduForm
      );
      setProfile((prev) => ({
        ...prev,
        educations: [...prev.educations, res.data],
      }));
      setEduForm({
        school: "",
        degree: "",
        field: "",
        startDate: "",
        endDate: "",
        description: "",
      });
    } catch (err) {
      console.error("Erreur ajout formation", err);
    }
  };

  // 7. Ajout certification
  const handleAddCertification = async (e) => {
    e.preventDefault();
    if (!user) return;

    try {
      const res = await apiClient.post(
        `/api/candidates/${user.id}/certifications`,
        certForm
      );
      setProfile((prev) => ({
        ...prev,
        certifications: [...prev.certifications, res.data],
      }));
      setCertForm({
        name: "",
        provider: "",
        dateObtained: "",
        expiryDate: "",
        credentialUrl: "",
      });
    } catch (err) {
      console.error("Erreur ajout certification", err);
    }
  };

  // 8. Ajout langue
  const handleAddLanguage = async (e) => {
    e.preventDefault();
    if (!user) return;

    try {
      const res = await apiClient.post(
        `/api/candidates/${user.id}/languages`,
        langForm
      );
      setProfile((prev) => ({
        ...prev,
        languages: [...prev.languages, res.data],
      }));
      setLangForm({ language: "", level: "" });
    } catch (err) {
      console.error("Erreur ajout langue", err);
    }
  };

  // 9. Ajout compétence
  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (!user) return;

    try {
      const res = await apiClient.post(
        `/api/candidates/${user.id}/skills`,
        skillForm
      );
      setProfile((prev) => ({
        ...prev,
        skills: [...prev.skills, res.data],
      }));
      setSkillForm({ name: "", level: "" });
    } catch (err) {
      console.error("Erreur ajout compétence", err);
    }
  };

  if (loadingProfile) {
    return (
      <div className="profile-page">
        <p>Chargement du profil...</p>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <header className="profile-header">
        <div>
          <h1>Mon profil</h1>
          <p className="profile-subtitle">
            Complète ton profil pour que la plateforme IA puisse analyser ton
            parcours et te proposer des objectifs adaptés.
          </p>
        </div>
      </header>

      <main className="profile-layout">
        {/* INFOS PERSONNELLES */}
        <section className="profile-card">
          <h2>Informations personnelles</h2>
          {profileMessage && (
            <p className="profile-message">{profileMessage}</p>
          )}

          <form onSubmit={handleSaveProfile} className="profile-form">
            <div className="form-grid-2">
              <div className="form-group">
                <label>Prénom</label>
                <input
                  type="text"
                  name="firstName"
                  value={profile.firstName}
                  onChange={handleProfileChange}
                />
              </div>
              <div className="form-group">
                <label>Nom</label>
                <input
                  type="text"
                  name="lastName"
                  value={profile.lastName}
                  onChange={handleProfileChange}
                />
              </div>
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleProfileChange}
                />
              </div>
              <div className="form-group">
                <label>Téléphone</label>
                <input
                  type="text"
                  name="phone"
                  value={profile.phone}
                  onChange={handleProfileChange}
                />
              </div>
            </div>

            <div className="form-grid-3">
              <div className="form-group">
                <label>Adresse</label>
                <input
                  type="text"
                  name="address"
                  value={profile.address}
                  onChange={handleProfileChange}
                />
              </div>
              <div className="form-group">
                <label>Ville</label>
                <input
                  type="text"
                  name="city"
                  value={profile.city}
                  onChange={handleProfileChange}
                />
              </div>
              <div className="form-group">
                <label>Pays</label>
                <input
                  type="text"
                  name="country"
                  value={profile.country}
                  onChange={handleProfileChange}
                />
              </div>
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label>Date de naissance</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={profile.dateOfBirth || ""}
                  onChange={handleProfileChange}
                />
              </div>
              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    name="openToWork"
                    checked={profile.openToWork}
                    onChange={handleCheckboxChange}
                  />
                  Ouvert(e) aux opportunités
                </label>
              </div>
            </div>

            <div className="form-group">
              <label>Titre / Headline</label>
              <input
                type="text"
                name="headline"
                placeholder="Ex : Étudiante en génie logiciel, Backend Java junior..."
                value={profile.headline}
                onChange={handleProfileChange}
              />
            </div>

            <div className="form-group">
              <label>Résumé / Bio</label>
              <textarea
                name="bio"
                rows={4}
                placeholder="Présente ton profil, tes objectifs, tes domaines favoris..."
                value={profile.bio}
                onChange={handleProfileChange}
              />
            </div>

            <h3>Liens professionnels</h3>
            <div className="form-grid-3">
              <div className="form-group">
                <label>LinkedIn</label>
                <input
                  type="url"
                  name="linkedinUrl"
                  value={profile.linkedinUrl}
                  onChange={handleProfileChange}
                  placeholder="https://www.linkedin.com/in/..."
                />
              </div>
              <div className="form-group">
                <label>GitHub</label>
                <input
                  type="url"
                  name="githubUrl"
                  value={profile.githubUrl}
                  onChange={handleProfileChange}
                  placeholder="https://github.com/..."
                />
              </div>
              <div className="form-group">
                <label>Portfolio</label>
                <input
                  type="url"
                  name="portfolioUrl"
                  value={profile.portfolioUrl}
                  onChange={handleProfileChange}
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="form-actions">
              <button
                type="submit"
                className="btn-primary"
                disabled={savingProfile}
              >
                {savingProfile ? "Enregistrement..." : "Enregistrer le profil"}
              </button>
            </div>
          </form>
        </section>

        {/* DOCUMENTS */}
        <section className="profile-card">
          <h2>CV & documents</h2>
          <p className="muted">
            Ajoute ton CV, tes lettres de motivation et certificats de langue
            pour aider l’IA à analyser ton profil.
          </p>

          {docMessage && <p className="profile-message">{docMessage}</p>}

          <form className="doc-upload-form" onSubmit={handleUploadDoc}>
            <div className="form-grid-2">
              <div className="form-group">
                <label>Libellé</label>
                <input
                  type="text"
                  value={docLabel}
                  onChange={(e) => setDocLabel(e.target.value)}
                  placeholder="Ex : CV principal, Lettre motivation PFE..."
                />
              </div>
              <div className="form-group">
                <label>Type</label>
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value)}
                >
                  <option value="CV">CV</option>
                  <option value="MOTIVATION">Lettre de motivation</option>
                  <option value="LANGUAGE_CERT">Certificat de langue</option>
                  <option value="OTHER">Autre</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Fichier</label>
              <input type="file" onChange={handleDocFileChange} />
            </div>

            <div className="form-actions">
              <button
                type="submit"
                className="btn-secondary"
                disabled={uploadingDoc}
              >
                {uploadingDoc ? "Upload en cours..." : "Ajouter le document"}
              </button>
            </div>
          </form>

          <h3>Mes documents</h3>
          {documents.length === 0 ? (
            <p className="muted">Aucun document pour l’instant.</p>
          ) : (
            <ul className="doc-list">
              {documents.map((doc) => (
                <li key={doc.id} className="doc-item">
                  <div>
                    <strong>{doc.label}</strong>{" "}
                    <span className="doc-type">[{doc.type}]</span>
                    <div className="muted small">
                      {doc.fileName} •{" "}
                      {doc.uploadedAt &&
                        new Date(doc.uploadedAt).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="doc-actions">
                    {doc.type === "CV" && (
                      <button
                        type="button"
                        className="btn-small"
                        onClick={() => handleAutoFillFromCv(doc.id)}
                      >
                        Remplir le profil depuis ce CV
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* EXPERIENCES */}
        <section className="profile-card">
          <h2>Expériences</h2>
          {profile.experiences.length === 0 ? (
            <p className="muted">Aucune expérience ajoutée.</p>
          ) : (
            <ul className="cv-list">
              {profile.experiences.map((exp) => (
                <li key={exp.id}>
                  <strong>{exp.title}</strong> • {exp.company}
                  <div className="muted">
                    {exp.location} • {exp.startDate} -{" "}
                    {exp.endDate || "Aujourd'hui"}
                  </div>
                  {exp.description && <p>{exp.description}</p>}
                </li>
              ))}
            </ul>
          )}

          <form className="mini-form" onSubmit={handleAddExperience}>
            <h3>Ajouter une expérience</h3>
            <div className="form-grid-2">
              <div className="form-group">
                <label>Poste</label>
                <input
                  type="text"
                  value={expForm.title}
                  onChange={(e) =>
                    setExpForm((f) => ({ ...f, title: e.target.value }))
                  }
                />
              </div>
              <div className="form-group">
                <label>Entreprise</label>
                <input
                  type="text"
                  value={expForm.company}
                  onChange={(e) =>
                    setExpForm((f) => ({ ...f, company: e.target.value }))
                  }
                />
              </div>
            </div>

            <div className="form-grid-3">
              <div className="form-group">
                <label>Lieu</label>
                <input
                  type="text"
                  value={expForm.location}
                  onChange={(e) =>
                    setExpForm((f) => ({ ...f, location: e.target.value }))
                  }
                />
              </div>
              <div className="form-group">
                <label>Début</label>
                <input
                  type="date"
                  value={expForm.startDate}
                  onChange={(e) =>
                    setExpForm((f) => ({ ...f, startDate: e.target.value }))
                  }
                />
              </div>
              <div className="form-group">
                <label>Fin</label>
                <input
                  type="date"
                  value={expForm.endDate}
                  onChange={(e) =>
                    setExpForm((f) => ({ ...f, endDate: e.target.value }))
                  }
                />
              </div>
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                rows={3}
                value={expForm.description}
                onChange={(e) =>
                  setExpForm((f) => ({ ...f, description: e.target.value }))
                }
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-small">
                Ajouter
              </button>
            </div>
          </form>
        </section>

        {/* FORMATIONS */}
        <section className="profile-card">
          <h2>Formations</h2>
          {profile.educations.length === 0 ? (
            <p className="muted">Aucune formation ajoutée.</p>
          ) : (
            <ul className="cv-list">
              {profile.educations.map((edu) => (
                <li key={edu.id}>
                  <strong>{edu.degree}</strong> • {edu.school}
                  <div className="muted">
                    {edu.field} • {edu.startDate} - {edu.endDate}
                  </div>
                  {edu.description && <p>{edu.description}</p>}
                </li>
              ))}
            </ul>
          )}

          <form className="mini-form" onSubmit={handleAddEducation}>
            <h3>Ajouter une formation</h3>
            <div className="form-grid-2">
              <div className="form-group">
                <label>Établissement</label>
                <input
                  type="text"
                  value={eduForm.school}
                  onChange={(e) =>
                    setEduForm((f) => ({ ...f, school: e.target.value }))
                  }
                />
              </div>
              <div className="form-group">
                <label>Diplôme</label>
                <input
                  type="text"
                  value={eduForm.degree}
                  onChange={(e) =>
                    setEduForm((f) => ({ ...f, degree: e.target.value }))
                  }
                />
              </div>
            </div>

            <div className="form-group">
              <label>Domaine</label>
              <input
                type="text"
                value={eduForm.field}
                onChange={(e) =>
                  setEduForm((f) => ({ ...f, field: e.target.value }))
                }
              />
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label>Début</label>
                <input
                  type="date"
                  value={eduForm.startDate}
                  onChange={(e) =>
                    setEduForm((f) => ({ ...f, startDate: e.target.value }))
                  }
                />
              </div>
              <div className="form-group">
                <label>Fin</label>
                <input
                  type="date"
                  value={eduForm.endDate}
                  onChange={(e) =>
                    setEduForm((f) => ({ ...f, endDate: e.target.value }))
                  }
                />
              </div>
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                rows={3}
                value={eduForm.description}
                onChange={(e) =>
                  setEduForm((f) => ({ ...f, description: e.target.value }))
                }
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-small">
                Ajouter
              </button>
            </div>
          </form>
        </section>

        {/* CERTIFICATIONS */}
        <section className="profile-card">
          <h2>Certifications</h2>
          {profile.certifications.length === 0 ? (
            <p className="muted">Aucune certification ajoutée.</p>
          ) : (
            <ul className="cv-list">
              {profile.certifications.map((cert) => (
                <li key={cert.id}>
                  <strong>{cert.name}</strong> • {cert.provider}
                  <div className="muted">
                    Obtenue le {cert.dateObtained}
                    {cert.expiryDate && ` • Expire le ${cert.expiryDate}`}
                  </div>
                  {cert.credentialUrl && (
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="small-link"
                    >
                      Voir le certificat
                    </a>
                  )}
                </li>
              ))}
            </ul>
          )}

          <form className="mini-form" onSubmit={handleAddCertification}>
            <h3>Ajouter une certification</h3>
            <div className="form-grid-2">
              <div className="form-group">
                <label>Nom</label>
                <input
                  type="text"
                  value={certForm.name}
                  onChange={(e) =>
                    setCertForm((f) => ({ ...f, name: e.target.value }))
                  }
                />
              </div>
              <div className="form-group">
                <label>Organisme</label>
                <input
                  type="text"
                  value={certForm.provider}
                  onChange={(e) =>
                    setCertForm((f) => ({ ...f, provider: e.target.value }))
                  }
                />
              </div>
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label>Date d&apos;obtention</label>
                <input
                  type="date"
                  value={certForm.dateObtained}
                  onChange={(e) =>
                    setCertForm((f) => ({
                      ...f,
                      dateObtained: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="form-group">
                <label>Date d&apos;expiration (optionnel)</label>
                <input
                  type="date"
                  value={certForm.expiryDate}
                  onChange={(e) =>
                    setCertForm((f) => ({ ...f, expiryDate: e.target.value }))
                  }
                />
              </div>
            </div>

            <div className="form-group">
              <label>URL du certificat (optionnel)</label>
              <input
                type="url"
                value={certForm.credentialUrl}
                onChange={(e) =>
                  setCertForm((f) => ({
                    ...f,
                    credentialUrl: e.target.value,
                  }))
                }
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-small">
                Ajouter
              </button>
            </div>
          </form>
        </section>

        {/* LANGUES */}
        <section className="profile-card">
          <h2>Langues</h2>
          {profile.languages.length === 0 ? (
            <p className="muted">Aucune langue ajoutée.</p>
          ) : (
            <ul className="cv-list-inline">
              {profile.languages.map((lang) => (
                <li key={lang.id}>
                  <strong>{lang.language}</strong> – {lang.level}
                </li>
              ))}
            </ul>
          )}

          <form className="mini-form-inline" onSubmit={handleAddLanguage}>
            <h3>Ajouter une langue</h3>
            <div className="form-grid-2">
              <div className="form-group">
                <label>Langue</label>
                <input
                  type="text"
                  value={langForm.language}
                  onChange={(e) =>
                    setLangForm((f) => ({ ...f, language: e.target.value }))
                  }
                />
              </div>
              <div className="form-group">
                <label>Niveau (A1–C2, natif, etc.)</label>
                <input
                  type="text"
                  value={langForm.level}
                  onChange={(e) =>
                    setLangForm((f) => ({ ...f, level: e.target.value }))
                  }
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-small">
                Ajouter
              </button>
            </div>
          </form>
        </section>

        {/* COMPÉTENCES */}
        <section className="profile-card">
          <h2>Compétences</h2>
          {profile.skills.length === 0 ? (
            <p className="muted">Aucune compétence ajoutée.</p>
          ) : (
            <ul className="cv-list-inline">
              {profile.skills.map((s) => (
                <li key={s.id}>
                  <strong>{s.name}</strong>
                  {s.level && ` – ${s.level}`}
                </li>
              ))}
            </ul>
          )}

          <form className="mini-form-inline" onSubmit={handleAddSkill}>
            <h3>Ajouter une compétence</h3>
            <div className="form-grid-2">
              <div className="form-group">
                <label>Compétence</label>
                <input
                  type="text"
                  value={skillForm.name}
                  onChange={(e) =>
                    setSkillForm((f) => ({ ...f, name: e.target.value }))
                  }
                />
              </div>
              <div className="form-group">
                <label>Niveau (optionnel)</label>
                <input
                  type="text"
                  value={skillForm.level}
                  onChange={(e) =>
                    setSkillForm((f) => ({ ...f, level: e.target.value }))
                  }
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-small">
                Ajouter
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}

export default ProfilePage;
