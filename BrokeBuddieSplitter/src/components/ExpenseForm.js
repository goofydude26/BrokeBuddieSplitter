import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpring, animated } from 'react-spring';

const ExpenseForm = ({ onAddExpense }) => {
    const [formData, setFormData] = useState({
        payer: '',
        amount: '',
        description: ''
    });
    const [buddies, setBuddies] = useState(new Set());
    const [newBuddy, setNewBuddy] = useState('');

    // Spring animation for form
    const formSpring = useSpring({
        from: { opacity: 0, transform: 'translateY(30px)' },
        to: { opacity: 1, transform: 'translateY(0px)' },
        config: { tension: 300, friction: 20 }
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const addBuddy = () => {
        const buddyName = newBuddy.trim();
        if (buddyName && !buddies.has(buddyName)) {
            setBuddies(prev => new Set([...prev, buddyName]));
            setNewBuddy('');
        }
    };

    const removeBuddy = (buddyName) => {
        setBuddies(prev => {
            const newBuddies = new Set(prev);
            newBuddies.delete(buddyName);
            return newBuddies;
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!formData.payer || !formData.amount || !formData.description) {
            alert('Please fill in all fields');
            return;
        }

        if (buddies.size === 0) {
            alert('Please add at least one buddy to split with');
            return;
        }

        const expense = {
            id: Date.now(),
            payer: formData.payer,
            amount: parseFloat(formData.amount),
            description: formData.description,
            buddies: Array.from(buddies),
            date: new Date().toISOString(),
            splitAmount: parseFloat(formData.amount) / buddies.size
        };

        onAddExpense(expense);
        
        // Reset form
        setFormData({ payer: '', amount: '', description: '' });
        setBuddies(new Set());
    };

    return (
        <animated.div style={formSpring} className="card add-expense-card">
            <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
            >
                <i className="fas fa-plus-circle"></i> Add New Expense
            </motion.h2>
            
            <form onSubmit={handleSubmit} className="expense-form">
                <motion.div 
                    className="form-group"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <label htmlFor="payer">Who Paid?</label>
                    <input
                        type="text"
                        id="payer"
                        name="payer"
                        value={formData.payer}
                        onChange={handleInputChange}
                        placeholder="Enter name"
                        required
                    />
                </motion.div>

                <motion.div 
                    className="form-group"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <label htmlFor="amount">Amount</label>
                    <div className="amount-input">
                        <span className="currency">₹</span>
                        <input
                            type="number"
                            id="amount"
                            name="amount"
                            value={formData.amount}
                            onChange={handleInputChange}
                            placeholder="0.00"
                            step="0.01"
                            min="0"
                            required
                        />
                    </div>
                </motion.div>

                <motion.div 
                    className="form-group"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <label htmlFor="description">Description</label>
                    <input
                        type="text"
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="What was it for?"
                        required
                    />
                </motion.div>

                <motion.div 
                    className="form-group"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                >
                    <label>Split Between</label>
                    <div className="buddies-container">
                        <div className="buddies-list">
                            <AnimatePresence>
                                {Array.from(buddies).map((buddy, index) => (
                                    <motion.div
                                        key={buddy}
                                        className="buddy-tag"
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        transition={{ duration: 0.2 }}
                                        style={{ animationDelay: `${index * 0.1}s` }}
                                    >
                                        {buddy}
                                        <button
                                            type="button"
                                            onClick={() => removeBuddy(buddy)}
                                            title="Remove buddy"
                                        >
                                            <i className="fas fa-times"></i>
                                        </button>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                        <div className="add-buddy">
                            <input
                                type="text"
                                value={newBuddy}
                                onChange={(e) => setNewBuddy(e.target.value)}
                                placeholder="Add buddy name"
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        addBuddy();
                                    }
                                }}
                            />
                            <motion.button
                                type="button"
                                onClick={addBuddy}
                                className="btn-secondary"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <i className="fas fa-plus"></i>
                            </motion.button>
                        </div>
                    </div>
                </motion.div>

                <motion.button
                    type="submit"
                    className="btn-primary"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                >
                    <i className="fas fa-save"></i> Add Expense
                </motion.button>
            </form>
        </animated.div>
    );
};

export default ExpenseForm; 