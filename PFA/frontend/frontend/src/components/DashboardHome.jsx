import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/DashboardHome.css';

// --- NEW COMPONENT: Interview Popover ---
const InterviewPopover = ({ date, interviews, position, onClose, onDelete }) => {
    // Format the date for the header
    const formattedDate = new Date(date).toLocaleDateString('fr-FR', {
        year: 'numeric', month: 'long', day: 'numeric'
    });

    return (
        // The style positions the popover based on the clicked element's location
        <div 
            className="interview-popover" 
            style={{ top: position.top, left: position.left }}
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
        >
            <div className="popover-header">
                <h4>Entretiens du {formattedDate}</h4>
                <button className="popover-close" onClick={onClose}>×</button>
            </div>
            <div className="popover-body">
                {interviews.length === 0 ? (
                    <p>Aucun entretien planifié pour ce jour.</p>
                ) : (
                    <ul className="popover-list">
                        {interviews.map(interview => (
                            <li key={interview.id} className="popover-item">
                                <div>
                                    <p className="popover-candidate">👤 {interview.candidateName} - {interview.poste}</p>
                                    <p className="popover-time">🕐 {interview.time} | 📍 {interview.type}</p>
                                </div>
                                <button 
                                    className="btn-delete-interview-small"
                                    onClick={() => onDelete(interview.id)}
                                >
                                    🗑️
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

// --- DashboardHome Component ---
const DashboardHome = ({ recruteurId, onNavigate }) => {
    // Helper functions
    const getTodayDateString = () => new Date().toISOString().split('T')[0];
    const getNowTimeString = () => {
        const now = new Date();
        return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    };

    // State Initialization
    const [stats, setStats] = useState({
        totalOffres: 0, offresActives: 0, totalCandidatures: 0, candidaturesEnAttente: 0, 
        candidaturesEnCours: 0, candidaturesAcceptees: 0
    });
    const [interviews, setInterviews] = useState([]);
    const [showAddInterview, setShowAddInterview] = useState(false);
    const [currentDate, setCurrentDate] = useState(new Date()); 
    const [selectedDate, setSelectedDate] = useState(getTodayDateString()); 
    const [newInterview, setNewInterview] = useState({
        candidateName: '', poste: '', date: getTodayDateString(), time: getNowTimeString(),
        type: 'Présentiel', notes: ''
    });

    // POPOVER STATE
    const [showPopover, setShowPopover] = useState(false);
    const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 });
    const [popoverInterviews, setPopoverInterviews] = useState({ date: '', list: [] });

    // --- Effects and Data Loading ---

    useEffect(() => {
        loadStats();
        loadInterviews();
        // Close popover when navigating or clicking outside (global click handler)
        const handleClickOutside = () => setShowPopover(false);
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [recruteurId]);

    const loadStats = async () => {
        // Mock data loading logic for brevity, replace with your actual API calls
        setStats(prev => prev); // Keeps current mock state
    };

    const loadInterviews = () => {
        const saved = localStorage.getItem(`interviews_${recruteurId}`);
        if (saved) {
            setInterviews(JSON.parse(saved));
        }
    };

    const saveInterviews = (updatedInterviews) => {
        localStorage.setItem(`interviews_${recruteurId}`, JSON.stringify(updatedInterviews));
        setInterviews(updatedInterviews);
    };

    // --- Interview Management Handlers ---

    const handleAddInterview = () => {
        if (!newInterview.candidateName || !newInterview.date || !newInterview.time) {
            alert('Veuillez remplir tous les champs obligatoires (Nom du Candidat, Date, Heure).');
            return;
        }

        const interview = {
            id: Date.now(), 
            ...newInterview,
            createdAt: new Date().toISOString()
        };

        const updatedInterviews = [...interviews, interview];
        saveInterviews(updatedInterviews);

        // Reset form and close modal
        setNewInterview({
            candidateName: '', poste: '', date: getTodayDateString(), time: getNowTimeString(),
            type: 'Présentiel', notes: ''
        });
        setShowAddInterview(false);
    };

    const handleDeleteInterview = (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cet entretien ?')) {
            const updatedInterviews = interviews.filter(i => i.id !== id);
            saveInterviews(updatedInterviews);
            
            // If the deleted interview was in the popover, update the popover
            if (showPopover && popoverInterviews.list.some(i => i.id === id)) {
                const remaining = popoverInterviews.list.filter(i => i.id !== id);
                if (remaining.length === 0) {
                    setShowPopover(false);
                } else {
                    setPopoverInterviews(prev => ({ ...prev, list: remaining }));
                }
            }
        }
    };

    // --- Popover and Day Click Handler ---
    const handleDayClick = (e, dateStr, dayInterviews) => {
        // 1. Update the calendar's internal selected date state
        setSelectedDate(dateStr);

        // 2. Check if there are interviews for this day
        if (dayInterviews.length > 0) {
            const rect = e.currentTarget.getBoundingClientRect();
            
            // Calculate popover position
            setPopoverPosition({
                top: rect.bottom + 10, 
                left: rect.left + rect.width / 2 
            });
            
            setPopoverInterviews({ date: dateStr, list: dayInterviews });
            setShowPopover(true);
        } else {
            setShowPopover(false);
        }
    };

    // --- Helper Functions for Rendering ---
    
    // Function to reliably check interviews for a date string - ONLY SHOWS FUTURE/TODAY INTERVIEWS
    const getInterviewsForDate = (date) => {
        let dateStr;

        if (typeof date === 'string') {
            dateStr = date;
        } else {
            const dateObj = date;
            if (isNaN(dateObj.getTime())) {
                return [];
            }
            dateStr = dateObj.toISOString().split('T')[0];
        }
        
        // Only show interviews that are today or in the future
        const today = getTodayDateString();
        
        return interviews.filter(interview => 
            interview.date === dateStr && interview.date >= today
        );
    };

    const getUpcomingInterviews = () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        return interviews
            .filter(interview => new Date(interview.date) >= today)
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .slice(0, 5);
    };
    
    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        // getDay() returns 0 for Sunday (Dim), 1 for Monday (Lun), etc.
        const firstDay = new Date(year, month, 1);
        const startingDayOfWeek = firstDay.getDay(); 
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        
        return { daysInMonth, startingDayOfWeek };
    };

    const renderCalendar = () => {
        const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);
        const days = [];
        const monthNames = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

        // Empty cells
        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
        }

        // Days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
            
            // CRITICAL FIX: Manually construct YYYY-MM-DD string to avoid timezone shifts
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0'); 
            const dayStr = String(day).padStart(2, '0');
            const dateStr = `${year}-${month}-${dayStr}`;

            // This now only returns future/today interviews
            const dayInterviews = getInterviewsForDate(dateStr); 
            
            const isToday = getTodayDateString() === dateStr;
            const isSelected = selectedDate === dateStr;

            days.push(
                <div 
                    key={day}
                    className={`calendar-day ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''} ${dayInterviews.length > 0 ? 'has-interview' : ''}`}
                    onClick={(e) => handleDayClick(e, dateStr, dayInterviews)}
                >
                    <span className="day-number">{day}</span>
                    {dayInterviews.length > 0 && (
                        <span className="interview-badge">{dayInterviews.length}</span>
                    )}
                </div>
            );
        }

        return (
            <div className="calendar-wrapper">
                <div className="calendar-header">
                    <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}>
                        ‹
                    </button>
                    <h3>{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h3>
                    <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}>
                        ›
                    </button>
                </div>
                <div className="calendar-weekdays">
                    {['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map(day => (
                        <div key={day} className="weekday">{day}</div>
                    ))}
                </div>
                <div className="calendar-grid">
                    {days}
                </div>
            </div>
        );
    };

    const upcomingInterviews = getUpcomingInterviews();

    // --- Main JSX Render ---
    return (
        <div className="dashboard-home">
            <div className="welcome-section">
                <h2>Bienvenue sur votre Tableau de Bord</h2>
                <p>Gérez vos recrutements efficacement</p>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid">
                <div className="stat-card" onClick={() => onNavigate('gerer')}>
                    <div className="stat-icon">📋</div>
                    <div className="stat-content">
                        <h3>{stats.totalOffres}</h3>
                        <p>Offres Totales</p>
                        <span className="stat-detail">{stats.offresActives} actives</span>
                    </div>
                </div>
                <div className="stat-card" onClick={() => onNavigate('candidatures')}>
                    <div className="stat-icon">👥</div>
                    <div className="stat-content">
                        <h3>{stats.totalCandidatures}</h3>
                        <p>Candidatures</p>
                        <span className="stat-detail">{stats.candidaturesEnAttente} nouvelles</span>
                    </div>
                </div>
                <div className="stat-card" onClick={() => onNavigate('candidatures')}>
                    <div className="stat-icon">⏳</div>
                    <div className="stat-content">
                        <h3>{stats.candidaturesEnCours}</h3>
                        <p>En Cours</p>
                        <span className="stat-detail">À traiter</span>
                    </div>
                </div>
                <div className="stat-card" onClick={() => onNavigate('candidatures')}>
                    <div className="stat-icon">✅</div>
                    <div className="stat-content">
                        <h3>{stats.candidaturesAcceptees}</h3>
                        <p>Acceptées</p>
                        <span className="stat-detail">Ce mois-ci</span>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="dashboard-content-grid">
                {/* Calendar */}
                <div className="dashboard-card calendar-card">
                    <div className="card-header">
                        <h3>📅 Calendrier des Entretiens</h3>
                        <button 
                            className="btn-add-interview"
                            onClick={() => {
                                setShowAddInterview(true);
                                setNewInterview(prev => ({ 
                                    ...prev, 
                                    date: selectedDate,
                                    time: getNowTimeString() 
                                }));
                            }}
                        >
                            + Ajouter
                        </button>
                    </div>
                    <div style={{ position: 'relative' }}> 
                        {renderCalendar()}
                        
                        {/* POPOVER RENDERED HERE */}
                        {showPopover && (
                            <InterviewPopover
                                date={popoverInterviews.date}
                                interviews={popoverInterviews.list}
                                position={popoverPosition}
                                onClose={() => setShowPopover(false)}
                                onDelete={handleDeleteInterview}
                            />
                        )}
                    </div>
                </div>

                {/* Upcoming Interviews */}
                <div className="dashboard-card interviews-card">
                    <h3>🗓️ Entretiens à Venir</h3>
                    {upcomingInterviews.length === 0 ? (
                        <p className="no-data">Aucun entretien programmé</p>
                    ) : (
                        <div className="interviews-list">
                            {upcomingInterviews.map(interview => (
                                <div key={interview.id} className="interview-item">
                                    <div className="interview-info">
                                        <h4>{interview.candidateName}</h4>
                                        <p className="interview-poste">{interview.poste}</p>
                                        <div className="interview-details">
                                            <span>📅 {new Date(interview.date).toLocaleDateString('fr-FR')}</span>
                                            <span>🕐 {interview.time}</span>
                                            <span>📍 {interview.type}</span>
                                        </div>
                                        {interview.notes && (
                                            <p className="interview-notes">{interview.notes}</p>
                                        )}
                                    </div>
                                    <button 
                                        className="btn-delete-interview"
                                        onClick={() => handleDeleteInterview(interview.id)}
                                    >
                                        🗑️
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Quick Actions */}
            <div className="quick-actions">
                <h3>Actions Rapides</h3>
                <div className="actions-grid">
                    <button className="action-btn" onClick={() => onNavigate('creer')}>
                        <span className="action-icon">➕</span>
                        <span>Créer une Offre</span>
                    </button>
                    <button className="action-btn" onClick={() => onNavigate('candidatures')}>
                        <span className="action-icon">📧</span>
                        <span>Consulter Candidatures</span>
                    </button>
                    <button className="action-btn" onClick={() => onNavigate('gerer')}>
                        <span className="action-icon">⚙️</span>
                        <span>Gérer les Offres</span>
                    </button>
                </div>
            </div>

            {/* Add Interview Modal */}
            {showAddInterview && (
                <div className="modal-overlay" onClick={() => setShowAddInterview(false)}>
                    <div className="modal-content interview-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Planifier un Entretien</h3>
                            <button className="modal-close" onClick={() => setShowAddInterview(false)}>×</button>
                        </div>
                        
                        <div className="modal-body">
                            <div className="form-group">
                                <label>Nom du Candidat *</label>
                                <input 
                                    type="text" 
                                    value={newInterview.candidateName} 
                                    onChange={(e) => setNewInterview({...newInterview, candidateName: e.target.value})} 
                                    placeholder="Ex: Jean Dupont" 
                                />
                            </div>
                            <div className="form-group">
                                <label>Poste</label>
                                <input 
                                    type="text" 
                                    value={newInterview.poste} 
                                    onChange={(e) => setNewInterview({...newInterview, poste: e.target.value})} 
                                    placeholder="Ex: Développeur Full Stack" 
                                />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Date *</label>
                                    <input 
                                        type="date" 
                                        value={newInterview.date} 
                                        onChange={(e) => setNewInterview({...newInterview, date: e.target.value})} 
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Heure *</label>
                                    <input 
                                        type="time" 
                                        value={newInterview.time} 
                                        onChange={(e) => setNewInterview({...newInterview, time: e.target.value})} 
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Type d'Entretien</label>
                                <select 
                                    value={newInterview.type} 
                                    onChange={(e) => setNewInterview({...newInterview, type: e.target.value})}
                                >
                                    <option value="Présentiel">Présentiel</option>
                                    <option value="Visio">Visioconférence</option>
                                    <option value="Téléphone">Téléphone</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Notes</label>
                                <textarea 
                                    value={newInterview.notes} 
                                    onChange={(e) => setNewInterview({...newInterview, notes: e.target.value})} 
                                    placeholder="Notes additionnelles..." 
                                    rows="3" 
                                />
                            </div>
                        </div>
                        
                        <div className="modal-footer">
                            <button className="btn-cancel" onClick={() => setShowAddInterview(false)}>
                                Annuler
                            </button>
                            <button className="btn-save" onClick={handleAddInterview}>
                                Enregistrer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DashboardHome;