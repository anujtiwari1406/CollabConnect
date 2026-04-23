import React from "react";
import { Lock } from "lucide-react";
import "../../styles/matchingForms.css";

const LockedMatchCard = ({ match, onUnlock }) => {
    return (
        <div className="match-card locked-card">
            <div className="card-blur-overlay">
                <Lock size={32} className="lock-icon" />
                <button className="unlock-btn" onClick={() => onUnlock(match)}>Unlock Profile</button>
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
                        <span className="stat-value text-primary">{match.matchScore}%</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-label">Industry</span>
                        <span className="stat-value">{match.industry || "N/A"}</span>
                    </div>
                </div>

                <div className="card-tags">
                    {match.contentTypes?.slice(0, 2).map(tag => (
                        <span key={tag} className="tag-pill">{tag}</span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LockedMatchCard;
