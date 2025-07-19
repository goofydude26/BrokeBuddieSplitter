import React from 'react';
import { motion } from 'framer-motion';

const QuickActions = ({ expenses, onSettle, onExport, onClear }) => {
    const hasExpenses = expenses.length > 0;

    return (
        <motion.div 
            className="card actions-card"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
        >
            <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
            >
                <i className="fas fa-bolt"></i> Quick Actions
            </motion.h2>
            
            <div className="quick-actions">
                <motion.button
                    onClick={onSettle}
                    className="btn-secondary"
                    disabled={!hasExpenses}
                    whileHover={{ scale: hasExpenses ? 1.05 : 1 }}
                    whileTap={{ scale: hasExpenses ? 0.95 : 1 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                >
                    <i className="fas fa-handshake"></i> Settle All Debts
                </motion.button>
                
                <motion.button
                    onClick={onExport}
                    className="btn-secondary"
                    disabled={!hasExpenses}
                    whileHover={{ scale: hasExpenses ? 1.05 : 1 }}
                    whileTap={{ scale: hasExpenses ? 0.95 : 1 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                >
                    <i className="fas fa-download"></i> Export Summary
                </motion.button>
                
                <motion.button
                    onClick={onClear}
                    className="btn-danger"
                    disabled={!hasExpenses}
                    whileHover={{ scale: hasExpenses ? 1.05 : 1 }}
                    whileTap={{ scale: hasExpenses ? 0.95 : 1 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                >
                    <i className="fas fa-trash"></i> Clear All
                </motion.button>
            </div>
        </motion.div>
    );
};

export default QuickActions; 