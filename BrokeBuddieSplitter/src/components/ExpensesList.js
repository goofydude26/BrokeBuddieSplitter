import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ExpensesList = ({ expenses }) => {
    return (
        <motion.div 
            className="card expenses-card"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
        >
            <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
            >
                <i className="fas fa-history"></i> Recent Expenses
            </motion.h2>
            
            <div className="expenses-list">
                <AnimatePresence>
                    {expenses.length === 0 ? (
                        <motion.div 
                            className="empty-state"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <i className="fas fa-receipt"></i>
                            <p>No expenses yet</p>
                            <small>Your expenses will appear here</small>
                        </motion.div>
                    ) : (
                        expenses.slice().reverse().map((expense, index) => {
                            const date = new Date(expense.date).toLocaleDateString();
                            
                            return (
                                <motion.div
                                    key={expense.id}
                                    className="expense-item"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ 
                                        duration: 0.4, 
                                        delay: index * 0.1 
                                    }}
                                    whileHover={{ 
                                        scale: 1.02,
                                        boxShadow: "0 8px 25px rgba(0,0,0,0.15)"
                                    }}
                                    layout
                                >
                                    <div className="expense-header">
                                        <div>
                                            <div className="expense-title">
                                                {expense.description}
                                            </div>
                                            <div className="expense-details">
                                                Paid by {expense.payer} on {date}
                                            </div>
                                        </div>
                                        <div className="expense-amount">
                                            ₹{expense.amount.toFixed(2)}
                                        </div>
                                    </div>
                                    <div className="expense-split">
                                        Split between {expense.buddies.length} buddies 
                                        (₹{expense.splitAmount.toFixed(2)} each)
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

export default ExpensesList; 