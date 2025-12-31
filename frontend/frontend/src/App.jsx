// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from "./components/Header";

import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import CandidateHome from "./pages/CandidateHome";
import JobsPage from "./pages/JobsPage";
import ProfilePage from "./pages/ProfilePage";
import MyCareerPath from "./pages/MyCareerPath";
import ChatbotPage from "./pages/ChatbotPage";
import ApplicationsPage from "./pages/ApplicationsPage";
import JobDetailsPage from "./pages/JobDetailsPage";

import { AuthProvider } from "./context/AuthContext";  // ⬅️ IMPORTANT

import "./Styles/global.css";

function App() {
  return (
    <AuthProvider>   {/* ⬅️ on enveloppe toute l’app */}
      <Router>
        <div className="app">
          <Header />

          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />

            {/* Dashboard candidat */}
            <Route path="/candidate/home" element={<CandidateHome />} />
            <Route path="/jobs" element={<JobsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/candidate/career-path" element={<MyCareerPath />} />
            <Route path="/chatbot" element={<ChatbotPage />} />
            <Route path="/jobs/:id" element={<JobDetailsPage />} />
            <Route path="/applications" element={<ApplicationsPage />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
