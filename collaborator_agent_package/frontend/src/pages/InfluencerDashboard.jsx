import React, { useEffect, useState, Suspense } from "react";
import { MessageCircle, Menu } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";
import "../styles/dashboard.css";
import BackgroundEffects from "../components/BackgroundEffects";
import LineStatsChart from "../components/charts/LineStatsChart";
import { profileService, matchService, CollabService } from "../services/apiService";
import InfluencerMatchResults from "./InfluencerMatchResults";
import CurrencySelector from "../components/CurrencySelector";
import { useCollabCore } from "../context/CollabCoreContext";
import { localizeText } from "../utils/textUtils";

import { useCurrency } from "../context/CurrencyContext";

export default function InfluencerDashboard() {
  const { currency } = useCurrency();
  const navigate = useNavigate();
  const { userId } = useParams(); // Get target userId for inspection
  const { user } = useAuth();
  const { hasUnreadMessages } = useCollabCore();
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 1024);

  const [profile, setProfile] = useState(null);
  const [publicMemory, setPublicMemory] = useState(null); 
  const [showModal, setShowModal] = useState(false);
  const [findingMatches, setFindingMatches] = useState(false);

  // Fetch Real Profile Data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (userId) {
          const profileData = await profileService.getInfluencerById(userId);
          const memoryData = await CollabService.getPublicMemory(userId);
          setProfile(profileData);
          setPublicMemory(memoryData);
        } else if (user?.token) {
          const data = await profileService.getInfluencer(user.token);
          setProfile(data);
        }
      } catch (err) {
        console.error("Failed to fetch influencer profile", err);
      }
    };
    fetchProfile();
  }, [user, userId]);

  const data = profile || user || {};

  const processBudget = (budgetStr) => {
    if (!budgetStr) return "N/A";
    return budgetStr.replace(/[₹$£€¥د.إR$₽A$C$]/g, currency);
  };

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 18);
    };
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleFindMatches = async () => {
    if (profile && Object.keys(profile).length > 0) {
      setFindingMatches(true);
      try {
        const results = await matchService.getInfluencerMatches(user.uniqueId || "INF-TEMP");
        navigate("/match-results", { state: { matches: results, role: 'influencer' } });
      } catch (err) {
        console.error("Match failed", err);
      } finally {
        setFindingMatches(false);
      }
    } else {
      navigate("/influencer/matching");
    }
  };

  const followerCategory = () => {
    if (!data) return "Beginner";
    const f = data.followers || "";
    if (f.includes("100k")) return "Expert";
    if (f.includes("50k")) return "Expert";
    if (f.includes("10k")) return "Intermediate";
    return "Beginner";
  };

  const totalCollabs = profile?.userId?.totalCollabs || user?.totalCollabs || 0;
  const successfulCollabs = profile?.userId?.successfulCollabs || user?.successfulCollabs || 0;
  const badges = [
    { id: 1, name: "Creator Pro", color: "gold" },
    { id: 2, name: "Top 10%", color: "silver" },
    { id: 3, name: "Engagement Star", color: "gradient" },
    { id: 4, name: "Verified", color: "blue" },
    { id: 5, name: "Fast Responder", color: "purple" },
    { id: 6, name: "Brand Friendly", color: "teal" },
  ];

  const toggleTheme = () => {
    const current = document.documentElement.getAttribute("data-theme") || "light";
    const next = current === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  };

  return (
    <div className="dashboard-wrapper">
      <BackgroundEffects />
      
      <div className={`influencer-dashboard ${sidebarOpen ? "sidebar-open" : ""}`}>
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="dashboard-content">
          <nav className={`influencer-navbar ${scrolled ? "scrolled" : ""}`}>
            <div className="nav-left">
              <button className="mobile-menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
                <Menu size={24} />
              </button>
              <div className="nav-brand">
                {localizeText("Collaborator", profile?.userId?.name || user?.name, userId)}
              </div>
            </div>

            <div className="nav-right">
              {!userId && (
                <div className="mobile-hidden">
                  <button
                    className="btn-primary-gradient"
                    onClick={handleFindMatches}
                    style={{ padding: '8px 20px', borderRadius: '99px' }}
                  >
                    {findingMatches ? "Finding..." : "Find Matches"}
                  </button>
                </div>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CurrencySelector />
                <button
                  id="theme-toggle"
                  className="theme-toggle"
                  onClick={toggleTheme}
                >
                  {(document.documentElement.getAttribute("data-theme") || "light") === "dark"
                    ? "☀️"
                    : "🌙"}
                </button>
              </div>
              <div
                className="nav-profile-icon"
                onClick={() => setShowModal(true)}
                title="View Profile"
              >
                {data?.profileImg ? (
                  <img src={data.profileImg} alt="Profile" className="nav-profile-img-inner" />
                ) : (
                  <div className="nav-profile-placeholder">👤</div>
                )}
              </div>
            </div>
          </nav>
          <div className="influencer-main">

          {showModal && (
            <div className="modal-overlay" onClick={() => setShowModal(false)}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button onClick={() => setShowModal(false)} className="modal-close-btn">×</button>

                <div className="modal-header-center">
                  <div className="modal-profile-img-container">
                    {data?.profileImg ? (
                      <img src={data.profileImg} className="nav-profile-img-inner" alt="Profile" />
                    ) : (
                      <div className="modal-profile-placeholder">👤</div>
                    )}
                  </div>
                  <h2>{data?.userId?.name || user?.name || "Influencer"}</h2>
                  <p className="text-muted-custom">
                    {data?.niche || "Niche not set"} • {followerCategory()}
                  </p>
                </div>

                <div className="modal-details-grid">
                  <div className="modal-info-row">
                    <strong>Followers:</strong> {data?.followers || "N/A"}
                  </div>
                  <div className="modal-info-row">
                    <strong>Engagement:</strong> {data?.engagementRate ? `${data.engagementRate}%` : "N/A"}
                  </div>
                  <div className="modal-info-row">
                    <strong>Expected Budget:</strong> {processBudget(data?.budget)}
                  </div>
                </div>

              </div>
            </div>
          )}

          <section className="profile-card">
            <div className="profile-right">
              <div className="profile-info">
                <div className="profile-photo">
                  {data?.profileImg ? <img src={data.profileImg} alt="profile" /> : <span>👤</span>}
                </div>
                <div className="profile-meta">
                  <div className="profile-name">
                    {profile?.userId?.name || (userId ? "Loading..." : (user?.name || "Anonymous"))}
                  </div>
                  <div className="profile-sub">{followerCategory()}</div>
                </div>
              </div>
            </div>

            <div className="profile-left">
              <div className="profile-actions">
                {!userId && (
                  <>
                    <button
                      className="btn-primary-gradient"
                      onClick={() => { alert("Coming Soon: AI Profile Optimization"); }}
                      style={{ marginRight: '10px' }}
                    >
                      <span>✨</span> Enhance Profile
                    </button>
                    <button className="btn-outline" onClick={() => navigate("/influencer-form")}>Edit Profile</button>
                    <button className="btn-outline">Settings</button>
                  </>
                )}
              </div>
            </div>
          </section>

          <main className="analytics-area">
            <div className="analytics-grid">
              <div className="card neon-card">
                <div className="rating-header">
                  <div className="rating-main">
                    <div className="rating-label">
                      {localizeText("Total Collaborations", profile?.userId?.name, userId)}
                    </div>
                    <div className="rating-value">
                      {totalCollabs}
                    </div>
                  </div>
                </div>
                <div className="line-chart-wrap">
                  <LineStatsChart />
                </div>
                <div className="chart-range">
                  <span>May 2025</span>
                  <span>Dec 2025</span>
                </div>
              </div>

              <div className="card neon-card">
                <div className="card-head">
                  <h4>{localizeText("Your influence", profile?.userId?.name, userId)}</h4>
                  <div className="card-sub">Global ranking statistics coming soon.</div>
                </div>
                <div className="card-body" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '150px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px' }}>
                  <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.9rem' }}>Influence Reach Visualization</span>
                </div>
              </div>

              <div className="card neon-card">
                <div className="card-head">
                  <h4>Successful Collaborations</h4>
                  <div className="card-sub">Completed on Collaborator</div>
                </div>
                <div className="card-body">
                  <div className="active-large">{successfulCollabs}</div>
                  <div className="active-actions">
                    <button className="btn-primary" onClick={() => navigate('/history')}>View History</button>
                    <button className="btn-secondary" onClick={() => navigate('/insights')}>Manage</button>
                  </div>
                </div>
              </div>

              <div className="card neon-card">
                <div className="card-head" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4>Badges</h4>
                    <div className="card-sub">Achievements</div>
                  </div>
                  <span className="coming-soon-badge" style={{ fontSize: '10px', background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '10px', color: 'rgba(255,255,255,0.6)' }}>COMING SOON</span>
                </div>
                <div className="card-body badges-grid">
                  {badges.map((b) => (
                    <div className="badge" key={b.id}>
                      <div className={`badge-icon ${b.color === "gradient" ? "badge-gradient" : ""}`}>
                        🏅
                      </div>
                      <div className="badge-name">{b.name}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </main>
          </div>
        </div>
      </div>

      {!userId && (
        <button
          onClick={() => navigate('/chat/recent')}
          className="floating-chat-btn"
          title="Open Chat Inbox"
        >
          <MessageCircle size={28} />
          {hasUnreadMessages && <span className="glowing-dot"></span>}
        </button>
      )}

      {!userId && (
        <div className="mobile-find-matches-footer">
          <button
            className="btn-primary-gradient"
            onClick={handleFindMatches}
            disabled={findingMatches}
            style={{ width: '100%', padding: '14px', fontSize: '16px', borderRadius: '12px' }}
          >
            {findingMatches ? "Finding Matches..." : "Find Matches"}
          </button>
        </div>
      )}
    </div>
  );
}



/* --------------------------
   Circular progress as component
   -------------------------- */
function CircularProgress({ percent = 50, label = "Top 50%" }) {
  // Clamp percent
  const p = Math.max(0, Math.min(100, percent));
  const radius = 48;
  const stroke = 10;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (p / 100) * circumference;

  return (
    <div className="circular-wrap">
      <svg height={radius * 2} width={radius * 2} className="circular-svg">
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgb(99,102,241)" />
            <stop offset="100%" stopColor="rgb(168,85,247)" />
          </linearGradient>
        </defs>

        {/* Background circle */}
        <circle
          stroke="rgba(255,255,255,0.06)"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        {/* Foreground progress */}
        <circle
          stroke="url(#grad1)"
          fill="transparent"
          strokeWidth={stroke}
          strokeLinecap="round"
          className="circular-progress-svg-circle"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          transform={`rotate(-90 ${radius} ${radius})`}
        />
      </svg>

      <div className="circular-label">
        <div className="circular-number">{percent}%</div>
        <div className="circular-text">{label}</div>
      </div>
    </div>
  );
}



