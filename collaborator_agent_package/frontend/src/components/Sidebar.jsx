import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Home, 
  User, 
  MessageCircle, 
  Target, 
  Clock, 
  CheckCircle, 
  LogOut,
  Settings
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import "../styles/sidebar.css";

const Sidebar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const isBrand = user?.role === "brand";

    const menuItems = [
        { name: "Home", icon: <Home size={20} />, path: isBrand ? "/brand-dashboard" : "/influencer-dashboard" },
        { name: "Matching", icon: <Target size={20} />, path: isBrand ? "/brand-matching" : "/influencer-matching" },
        { name: "Messages", icon: <MessageCircle size={20} />, path: "/chat/recent" },
        { name: "Deliverables", icon: <CheckCircle size={20} />, path: "/deliverables" },
        { name: "History", icon: <Clock size={20} />, path: "/history" },
        { name: "Settings", icon: <Settings size={20} />, path: isBrand ? "/brand-form" : "/influencer-form" },
    ];

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <aside className="app-sidebar">
            <div className="sidebar-header">
                <img src="/src/assets/CollaboratorLogo.png" alt="Logo" className="sidebar-logo" />
                <span className="sidebar-brand">Collaborator</span>
            </div>

            <nav className="sidebar-nav">
                {menuItems.map((item) => (
                    <button
                        key={item.name}
                        className={`nav-item ${location.pathname === item.path ? "active" : ""}`}
                        onClick={() => navigate(item.path)}
                    >
                        {item.icon}
                        <span>{item.name}</span>
                    </button>
                ))}
            </nav>

            <div className="sidebar-footer">
                <div className="user-info">
                    <img src={user?.profileImg || "https://ui-avatars.com/api/?name=" + user?.name} alt="Profile" className="user-avatar" />
                    <div className="user-details">
                        <p className="user-name">{user?.name || "User"}</p>
                        <p className="user-role capitalize">{user?.role}</p>
                    </div>
                </div>
                <button className="logout-btn" onClick={handleLogout}>
                    <LogOut size={18} />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
