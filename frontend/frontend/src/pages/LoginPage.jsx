// src/pages/LoginPage.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import apiClient from "../api/client";
import { useAuth } from "../context/AuthContext";
import "../Styles/auth.css";

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const res = await apiClient.post("/api/auth/login", { email, password });
      login(res.data);
      navigate("/candidate/home");
    } catch (err) {
      setMessage("Email ou mot de passe incorrect.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Connexion</h1>
        <p className="auth-subtitle">
          Accédez à votre espace pour suivre vos candidatures, vos parcours et vos recommandations IA.
        </p>

        {message && <div className="auth-alert auth-alert-error">{message}</div>}

        <form className="auth-form" onSubmit={handleLogin}>
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
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="auth-form-row">
            <label className="auth-checkbox">
              <input type="checkbox" />
              <span>Se souvenir de moi</span>
            </label>

            <button
              type="button"
              className="auth-link-btn"
              onClick={() => {}}
            >
              Mot de passe oublié ?
            </button>
          </div>

          <button
            type="submit"
            className="auth-primary-btn"
            disabled={loading}
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        <p className="auth-bottom-text">
          Pas encore de compte ?{" "}
          <Link to="/register" className="auth-link">
            Créer un compte
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
