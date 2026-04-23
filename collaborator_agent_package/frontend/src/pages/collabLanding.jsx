import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { User, LogOut, ChevronDown } from "lucide-react";
// import logo from "../assets/CollaboratorLogo.png";
const logo = "https://via.placeholder.com/150?text=Collaborator";

import "../styles/collabLanding.css";
import { useNavigate } from "react-router-dom";
import CurrencySelector from "../components/CurrencySelector";
import BackgroundEffects from "../components/BackgroundEffects";
import api from "../services/apiService";

export default function CollabLanding() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [deliverablesCount, setDeliverablesCount] = useState(0);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const menuRef = useRef(null);

  // Auto-redirect if user already has a profile (based on role)
  useEffect(() => {
    if (user && (user.role === 'brand' || user.role === 'influencer')) {
      navigate(user.role === 'brand' ? '/brand-dashboard' : '/influencer-dashboard');
    }
  }, [user, navigate]);

  const fetchDeliverablesCount = async () => {
    if (!user) return;
    try {
      const res = await api.get("/deliverables");
      setDeliverablesCount(Array.isArray(res.data) ? res.data.length : 0);
    } catch (err) {
      console.error("Error fetching deliverables count", err);
    }
  };

  useState(() => {
    fetchDeliverablesCount();
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "light"
  );

  document.documentElement.setAttribute("data-theme", theme);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.setAttribute("data-theme", next);
  };

  return (
    <div className="collab-container">
      <div><BackgroundEffects /></div>

      <div className="collab-glow"></div>

      {/* TOP BAR — Only Left + Right */}
      <div className="collab-top">

        {/* LEFT: BACK BUTTON */}
        <button onClick={() => navigate(-1)} className="back-btn">
          ← Back
        </button>


        {/* RIGHT: THEME + PROFILE */}
        <div className="collab-top-right" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>

          <CurrencySelector />
          <button className="theme-toggle" onClick={toggleTheme}>
            {theme === "dark" ? "☀️" : "🌙"}
          </button>

          {user ? (
            <div className="profile-menu-container" ref={menuRef}>
              <button 
                className="profile-trigger" 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
              >
                {user.profileImg ? (
                  <img
                    src={user.profileImg}
                    alt="Profile"
                    className="collab-profile-img"
                  />
                ) : (
                  <div className="profile-placeholder">
                    <User size={20} />
                  </div>
                )}
                <ChevronDown size={16} className={`chevron ${showProfileMenu ? 'open' : ''}`} />
                
                {deliverablesCount > 0 && (
                  <div className="badge-count">
                    {deliverablesCount}
                  </div>
                )}
              </button>

              {showProfileMenu && (
                <div className="profile-dropdown-menu">
                  <div className="menu-header">
                    <p className="menu-name">{user.name || "User"}</p>
                    <p className="menu-email">{user.email}</p>
                  </div>
                  <div className="menu-divider"></div>
                  <button className="menu-item logout" onClick={handleLogout}>
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="collab-top-right-noauth" style={{ display: 'flex', gap: '10px' }}>
              <button className="back-btn" onClick={() => navigate("/login")}>
                Login
              </button>
              <button className="btn-primary" style={{ padding: '8px 20px', borderRadius: '99px' }} onClick={() => navigate("/signup")}>
                Sign Up
              </button>
            </div>
          )}
        </div>

      </div>

      {/* MAIN HERO LOGO (center of page) */}
      <div className="collab-hero-logo-wrap">
        <img src={logo} className="collab-hero-logo" alt="Collaborator Logo" />
        <h2 className="collab-hero-title">Collaborator</h2>
      </div>

      {/* CONTENT */}
      <div className="collab-content">
        <h1 className="collab-title">
          Connect. <span className="gradient-text">Collab.</span> Conquer.
        </h1>

        <p className="collab-sub">
          AI-powered matchmaking for Influencers & Brands — fast, reliable, smart.
        </p>

        <div className="collab-actions">
          <button
            className="btn-primary big-btn" onClick={() => navigate("/influencer-form")} >
            I'm an Influencer
          </button>

          <button
            className="btn-secondary big-btn" onClick={() => navigate("/brand-form")}>
            I'm a Brand
          </button>

        </div>
      </div>


    </div>
  );
}



