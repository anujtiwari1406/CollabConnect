import React from "react";
import { Lock, X, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const UnlockMatchModal = ({ isOpen, match, onClose, onConfirm }) => {
    if (!isOpen || !match) return null;

    return (
        <AnimatePresence>
            <div className="modal-overlay">
                <motion.div
                    className="modal-card"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                >
                    <button className="modal-close" onClick={onClose}><X size={20} /></button>
                    
                    <div className="modal-icon-header">
                        <div className="icon-circle border-gold">
                            <Lock size={32} className="text-gold" />
                        </div>
                    </div>

                    <div className="modal-body text-center">
                        <h2 className="modal-title">Unlock Full Profile?</h2>
                        <p className="modal-subtitle">We've found a <strong>{match.matchScore}% match</strong> for your requirements.</p>

                        <div className="unlock-benefits">
                            <div className="benefit-item">
                                <CheckCircle size={18} className="text-success" />
                                <span>Full reach and engagement metrics</span>
                            </div>
                            <div className="benefit-item">
                                <CheckCircle size={18} className="text-success" />
                                <span>Direct message and collaboration link</span>
                            </div>
                            <div className="benefit-item">
                                <CheckCircle size={18} className="text-success" />
                                <span>Complete campaign history and reviews</span>
                            </div>
                        </div>

                        <button className="modal-submit large w-full mt-large" onClick={() => onConfirm(match._id)}>
                            Unlock Now
                        </button>
                        <button className="modal-cancel w-full mt-small" onClick={onClose}>
                            Maybe Later
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default UnlockMatchModal;
