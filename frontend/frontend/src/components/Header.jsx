// src/components/Header.jsx
import { Link, useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();

  return (
    <header className="navbar">
      <div
        className="logo"
        onClick={() => navigate("/")}
        style={{ cursor: "pointer" }}
      >
        Career Platform IA
      </div>

      <nav className="nav-links">
        {/* Pour l’instant on bloque l’ancre, on verra plus tard pour le scroll */}
        <Link to="#" onClick={(e) => e.preventDefault()}>
          Fonctionnalités
        </Link>
        <Link to="#" onClick={(e) => e.preventDefault()}>
          Pour qui ?
        </Link>
        <Link to="#" onClick={(e) => e.preventDefault()}>
          Contact
        </Link>
      </nav>

      <button
        className="btn-outline"
        onClick={() => navigate("/login")}
      >
        Se connecter
      </button>
    </header>
  );
}

export default Header;
