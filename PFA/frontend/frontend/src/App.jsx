import React, { useState, useEffect } from 'react';
import './App.css';

// Import components
import RecruteurDashboard from './components/RecruteurDashboard';

// --- CONNECTION STATUS COMPONENT ---
const ConnectionStatus = ({ status }) => {
    if (!status) return null;

    const getStyle = (status) => {
        switch (status) {
            case 'success':
                return 'status-success';
            case 'loading':
                return 'status-loading'; 
            case 'error':
                return 'status-error';
            default:
                return 'status-default';
        }
    };

    const message = {
        loading: "🚀 Vérification de la connexion au backend Spring Boot en cours...",
        success: "✅ Succès ! La communication Frontend (React) ↔ Backend (Spring Boot) est opérationnelle.",
        error: "❌ Échec de la connexion. Assurez-vous que le backend Spring Boot est démarré sur http://localhost:8080.",
    }[status];

    return (
        <div className={`connection-status ${getStyle(status)}`}>
            <p>{message}</p>
        </div>
    );
};

// --- LANDING PAGE COMPONENT ---
const LandingPage = ({ connectionStatus, navigateToPage }) => (
    <div className="app">
        <header className="navbar">
            <div className="logo" onClick={() => navigateToPage('home')}>Career Platform IA</div>
            <nav className="nav-links">
                <a href="#features">Fonctionnalités</a>
                <a href="#roles">Pour qui ?</a>
                <a href="#contact">Contact</a>
            </nav>
            <button 
                className="btn-outline"
                onClick={() => navigateToPage('recruteur-dashboard')} 
            >
                Accès Recruteur
            </button>
        </header>

        <main>
            <ConnectionStatus status={connectionStatus} />

            {/* Hero Section */}
            <div className="hero">
                <div className="hero-text">
                    <h1>
                        La plateforme IA qui <span>connecte</span> les talents aux opportunités.
                    </h1>
                    <p>
                        Centralisez les profils, les offres et laissez l'IA vous aider à trouver le meilleur match entre étudiants, diplômés et recruteurs.
                    </p>
                    <div className="hero-actions">
                        <button className="btn-primary">
                            Je suis étudiant(e)
                        </button>
                        <button 
                            className="btn-secondary"
                            onClick={() => navigateToPage('recruteur-dashboard')}
                        >
                            Je suis recruteur
                        </button>
                    </div>
                    <p className="hero-note">
                        Version PFA – Prototype en cours de développement.
                    </p>
                </div>

                <div className="hero-card">
                    <h2>Statut du projet</h2>
                    <ul>
                        <li>Backend Spring Boot installé</li>
                        <li>Base de données PostgreSQL configurée</li>
                        <li>Frontend React/Vite prêt</li>
                        <li>Matching IA en cours de conception</li>
                    </ul>
                </div>
            </div>

            {/* Features Section */}
            <section id="features" className="section features">
                <h2>Fonctionnalités principales</h2>
                <div className="cards">
                    <div className="card">
                        <h3>Profils intelligents</h3>
                        <p>
                            Les étudiants créent un profil complet : compétences, intérêts, expériences, CV et projets.
                        </p>
                    </div>
                    <div className="card">
                        <h3>Matching IA</h3>
                        <p>
                            Un moteur de recommandation suggère les offres les plus adaptées à chaque profil.
                        </p>
                    </div>
                    <div className="card">
                        <h3>Espace recruteur</h3>
                        <p>
                            Les entreprises publient des offres, filtrent les candidats et visualisent les meilleurs matchs.
                        </p>
                    </div>
                </div>
            </section>

            {/* Roles Section */}
            <section id="roles" className="section roles">
                <h2>Une plateforme pour tous les acteurs</h2>
                <div className="cards">
                    <div className="card">
                        <h3>Étudiants / Diplômés</h3>
                        <p>
                            Découvrez des opportunités alignées avec votre profil et vos objectifs professionnels.
                        </p>
                    </div>
                    <div className="card">
                        <h3>Recruteurs</h3>
                        <p>
                            Gagnez du temps avec des listes courtes de candidats déjà filtrés par l'IA.
                        </p>
                    </div>
                    <div className="card">
                        <h3>Écoles / Universités</h3>
                        <p>
                            Suivez les placements, les offres et les besoins du marché en temps réel.
                        </p>
                    </div>
                </div>
            </section>
        </main>

        {/* Footer */}
        <footer id="contact" className="footer">
            <p style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Projet PFA – Career Platform IA</p>
            <p style={{ marginBottom: '0.5rem' }}>Backend : Spring Boot · Frontend : React/Vite · DB : PostgreSQL</p>
            <p style={{ fontSize: '0.75rem' }}>© 2024. Tous droits réservés.</p>
        </footer>
    </div>
);

// --- MAIN APP COMPONENT ---
const App = () => {
    const [connectionStatus, setConnectionStatus] = useState('loading');
    const [currentPage, setCurrentPage] = useState('home'); 
    
    const navigateToPage = (pageName) => {
        setCurrentPage(pageName);
        window.scrollTo(0, 0); 
    };

    const BACKEND_URL = "http://localhost:8080/api/health";

    useEffect(() => {
        const checkBackend = async () => {
            try {
                const maxRetries = 3;
                let delay = 1000;
                let response = null;

                for (let i = 0; i < maxRetries; i++) {
                    try {
                        response = await fetch(BACKEND_URL);
                        if (response.ok) break;
                    } catch (e) {
                        // Retry after delay
                    }
                    if (i < maxRetries - 1) {
                        await new Promise(resolve => setTimeout(resolve, delay));
                        delay *= 2; 
                    }
                }

                if (response && response.ok) {
                    const data = await response.json();
                    if (data.status === 'UP') {
                        setConnectionStatus('success');
                    } else {
                         setConnectionStatus('error');
                    }
                } else {
                    setConnectionStatus('error');
                }
            } catch (error) {
                console.error("Erreur de connexion au backend:", error);
                setConnectionStatus('error');
            }
        };

        const timer = setTimeout(checkBackend, 1500); 
        return () => clearTimeout(timer); 
    }, []); 

    // Render dashboard if that page is active
    if (currentPage === 'recruteur-dashboard') {
        return (
            <RecruteurDashboard navigateToPage={navigateToPage} />
        );
    } 

    // Default: render landing page
    return (
        <LandingPage 
            connectionStatus={connectionStatus} 
            navigateToPage={navigateToPage}
        />
    );
};

export default App;