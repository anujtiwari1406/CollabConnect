import React from "react";
import { Lock } from "lucide-react";
import "../../styles/matchingForms.css";

const LockedMatchCard = ({ match = {}, onUnlockClick }) => {
    return (
        <div className="match-card locked-card">
            <div className="card-blur-overlay">
                <Lock size={32} className="lock-icon" />
                <button className="unlock-btn" onClick={onUnlockClick}>Unlock Profile</button>
            </div>
            
            <div className="card-content">
                <div className="card-header">
                    <div className="avatar-placeholder"></div>
                    <div className="header-info">
                        <div className="skeleton title-skeleton"></div>
                        <div className="skeleton subtitle-skeleton"></div>
                    </div>
                </div>
                
                <div className="card-stats">
                    <div className="stat-item">
                        <span className="stat-label">Match Score</span>
                        <span className="stat-value text-primary">{match?.matchScore ? `${Math.round(match.matchScore * 100)}%` : "N/A"}</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-label">Industry</span>
                        <span className="stat-value">{match?.industry || match?.niche || "N/A"}</span>
                    </div>
                </div>

                <div className="card-tags">
                    {(match?.contentType || match?.contentTypes)?.slice(0, 2).map(tag => (
                        <span key={tag} className="tag-pill">{tag}</span>
                    )) || <div className="skeleton tag-skeleton"></div>}
                </div>
            </div>
        </div>
    );
};

export default LockedMatchCard;
