import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SettlementModal = ({ isOpen, settlements, onClose }) => {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                className="modal"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
            >
                <motion.div
                    className="modal-content"
                    initial={{ opacity: 0, scale: 0.8, y: -50 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: -50 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="modal-header">
                        <motion.h3
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            <i className="fas fa-handshake"></i> Settlement Summary
                        </motion.h3>
                        <motion.button
                            className="close-btn"
                            onClick={onClose}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            &times;
                        </motion.button>
                    </div>
                    
                    <div className="modal-body">
                        <AnimatePresence>
                            {settlements.length === 0 ? (
                                <motion.div
                                    className="empty-state"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                >
                                    <i className="fas fa-check-circle"></i>
                                    <p>All debts are already settled!</p>
                                    <small>No payments needed</small>
                                </motion.div>
                            ) : (
                                settlements.map((settlement, index) => (
                                    <motion.div
                                        key={index}
                                        className="settlement-step"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        transition={{ 
                                            duration: 0.3, 
                                            delay: index * 0.1 
                                        }}
                                        whileHover={{ 
                                            scale: 1.02,
                                            boxShadow: "0 4px 15px rgba(0,0,0,0.1)"
                                        }}
                                    >
                                        <i className="fas fa-arrow-right"></i>
                                        <div className="settlement-info">
                                            <div>
                                                <strong>{settlement.from}</strong> pays{' '}
                                                <strong>{settlement.to}</strong>
                                            </div>
                                            <small>
                                                Step {index + 1} of {settlements.length}
                                            </small>
                                        </div>
                                        <div className="settlement-amount">
                                            ₹{settlement.amount.toFixed(2)}
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default SettlementModal; 