import React, { useState } from 'react';
import '../RecruteurDashboard.css';
import CreerOffre from './CreerOffre';
import GererOffres from './GererOffres';
import ConsulterCandidatures from './ConsulterCandidatures';
import DashboardHome from './DashboardHome';

const RecruteurDashboard = ({ navigateToPage }) => {
    const [recruteurId] = useState(1);
    const [activeTab, setActiveTab] = useState('dashboard'); // Changed default to 'dashboard'

    const handleOffreCreated = (offre) => {
        setActiveTab('gerer');
    };
    
    const getTabClass = (tabName) => 
        `tab-button ${activeTab === tabName ? 'tab-active' : 'tab-inactive'}`;

    return (
        <div className="dashboard-container">
            
            {/* Header */}
            <header className="dashboard-header">
                <div className="dashboard-header-content">
                    <div>
                        <h1 className="dashboard-title">Espace Recruteur</h1>
                        <p className="dashboard-subtitle">Gérez vos offres et candidatures (ID: {recruteurId})</p>
                    </div>
                    <button 
                        className="btn-logout"
                        onClick={() => navigateToPage('home')}
                    >
                        Déconnexion / Accueil
                    </button>
                </div>
            </header>

            <div className="dashboard-main">
                
                {/* Tab Navigation */}
                <nav className="tabs-nav">
                    <button 
                        className={getTabClass('dashboard')}
                        onClick={() => setActiveTab('dashboard')}
                    >
                        🏠 Tableau de Bord
                    </button>
                    <button 
                        className={getTabClass('creer')}
                        onClick={() => setActiveTab('creer')}
                    >
                        📝 Créer une Offre
                    </button>
                    <button 
                        className={getTabClass('gerer')}
                        onClick={() => setActiveTab('gerer')}
                    >
                        📋 Gérer Mes Offres
                    </button>
                    <button 
                        className={getTabClass('candidatures')}
                        onClick={() => setActiveTab('candidatures')}
                    >
                        👥 Consulter Candidatures
                    </button>
                </nav>

                {/* Active Content */}
                <main className="tab-content">
                    {activeTab === 'dashboard' && (
                        <DashboardHome 
                            recruteurId={recruteurId}
                            onNavigate={setActiveTab}
                        />
                    )}

                    {activeTab === 'creer' && (
                        <CreerOffre 
                            recruteurId={recruteurId} 
                            onOffreCreated={handleOffreCreated}
                        />
                    )}
                    
                    {activeTab === 'gerer' && (
                        <GererOffres recruteurId={recruteurId} />
                    )}
                    
                    {activeTab === 'candidatures' && (
                        <ConsulterCandidatures recruteurId={recruteurId} />
                    )}
                </main>
            </div>
        </div>
    );
};

export default RecruteurDashboard;