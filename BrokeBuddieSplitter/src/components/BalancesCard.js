import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BalancesCard = ({ balances }) => {
    const hasBalances = Object.keys(balances).length > 0;

    return (
        <motion.div 
            className="card balances-card"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
        >
            <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
            >
                <i className="fas fa-balance-scale"></i> Current Balances
            </motion.h2>
            
            <div className="balances-list">
                <AnimatePresence>
                    {!hasBalances ? (
                        <motion.div 
                            className="empty-state"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <i className="fas fa-coins"></i>
                            <p>No expenses added yet</p>
                            <small>Add your first expense to see balances</small>
                        </motion.div>
                    ) : (
                        Object.entries(balances)
                            .sort(([,a], [,b]) => Math.abs(b) - Math.abs(a))
                            .map(([buddy, balance], index) => {
                                const balanceClass = balance > 0 ? 'positive' : balance < 0 ? 'negative' : '';
                                const balanceText = balance > 0 ? `+₹${balance.toFixed(2)}` : 
                                                  balance < 0 ? `-₹${Math.abs(balance).toFixed(2)}` : 
                                                  '₹0.00';
                                
                                return (
                                    <motion.div
                                        key={buddy}
                                        className={`balance-item ${balanceClass}`}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        transition={{ 
                                            duration: 0.3, 
                                            delay: index * 0.1 
                                        }}
                                        whileHover={{ 
                                            scale: 1.02,
                                            boxShadow: "0 8px 25px rgba(0,0,0,0.15)"
                                        }}
                                    >
                                        <div className="balance-info">
                                            <div className="balance-name">{buddy}</div>
                                            <small>
                                                {balance > 0 ? 'Will receive' : 
                                                 balance < 0 ? 'Owes' : 'Settled'}
                                            </small>
                                        </div>
                                        <div className={`balance-amount ${balanceClass}`}>
                                            {balanceText}
                                        </div>
                                    </motion.div>
                                );
                            })
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

export default BalancesCard; 