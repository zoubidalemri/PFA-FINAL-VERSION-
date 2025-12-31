// src/pages/RegisterPage.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import apiClient from "../api/client";
import { useAuth } from "../context/AuthContext";
import "../Styles/auth.css";

function RegisterPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const res = await apiClient.post("/api/auth/register", {
        firstName,
        lastName,
        email,
        password,
      });
      login(res.data);
      navigate("/profile");
    } catch (err) {
      setMessage("Cet email est déjà utilisé.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Créer un compte</h1>
        <p className="auth-subtitle">
          Créez votre profil pour recevoir des recommandations de carrière personnalisées par l’IA.
        </p>

        {message && <div className="auth-alert auth-alert-error">{message}</div>}

        <form className="auth-form" onSubmit={handleRegister}>
          <div className="auth-two-cols">
            <div className="auth-field">
              <label htmlFor="firstName">Prénom</label>
              <input
                id="firstName"
                type="text"
                className="auth-input"
                placeholder="Prénom"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>

            <div className="auth-field">
              <label htmlFor="lastName">Nom</label>
              <input
                id="lastName"
                type="text"
                className="auth-input"
                placeholder="Nom"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="auth-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className="auth-input"
              placeholder="exemple@domaine.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="auth-field">
            <label htmlFor="password">Mot de passe</label>
            <input
              id="password"
              type="password"
              className="auth-input"
              placeholder="Choisissez un mot de passe sécurisé"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="auth-primary-btn"
            disabled={loading}
          >
            {loading ? "Création du compte..." : "Créer le compte"}
          </button>
        </form>

        <p className="auth-bottom-text">
          Déjà un compte ?{" "}
          <Link to="/login" className="auth-link">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
