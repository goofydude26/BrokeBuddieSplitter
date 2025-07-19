import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DynamicBackground from './components/DynamicBackground';
import Header from './components/Header';
import MobileOptimizedForm from './components/MobileOptimizedForm';
import BalancesCard from './components/BalancesCard';
import ExpensesList from './components/ExpensesList';
import QuickActions from './components/QuickActions';
import SettlementModal from './components/SettlementModal';
import MobileGestureHandler from './components/MobileGestureHandler';
import Footer from './components/Footer';
import './App.css';

const App = () => {
    const [expenses, setExpenses] = useState([]);
    const [balances, setBalances] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [settlements, setSettlements] = useState([]);
    const [isMobile, setIsMobile] = useState(false);
    const [gestureFeedback, setGestureFeedback] = useState('');

    // Load data from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('brokeBuddieSplitter');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                setExpenses(data.expenses || []);
                setBalances(data.balances || {});
            } catch (e) {
                console.error('Error loading saved data:', e);
            }
        }
    }, []);

    // Detect mobile device
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768 || 'ontouchstart' in window);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Calculate balances whenever expenses change
    useEffect(() => {
        calculateBalances();
        saveToLocalStorage();
    }, [expenses]);

    const calculateBalances = () => {
        const newBalances = {};
        
        // Initialize balances
        expenses.forEach(expense => {
            expense.buddies.forEach(buddy => {
                if (!newBalances[buddy]) {
                    newBalances[buddy] = 0;
                }
            });
        });
        
        // Calculate net amounts
        expenses.forEach(expense => {
            // Payer gets credited the full amount
            newBalances[expense.payer] += expense.amount;
            
            // Each buddy owes their share
            expense.buddies.forEach(buddy => {
                newBalances[buddy] -= expense.splitAmount;
            });
        });
        
        setBalances(newBalances);
    };

    const addExpense = (expense) => {
        setExpenses(prev => [...prev, expense]);
    };

    const calculateOptimalSettlements = () => {
        const settlements = [];
        const balancesCopy = { ...balances };
        
        // Separate debtors and creditors
        const debtors = Object.entries(balancesCopy)
            .filter(([, balance]) => balance < 0)
            .sort(([,a], [,b]) => a - b);
        
        const creditors = Object.entries(balancesCopy)
            .filter(([, balance]) => balance > 0)
            .sort(([,a], [,b]) => b - a);
        
        let debtorIndex = 0;
        let creditorIndex = 0;
        
        while (debtorIndex < debtors.length && creditorIndex < creditors.length) {
            const [debtor, debtAmount] = debtors[debtorIndex];
            const [creditor, creditAmount] = creditors[creditorIndex];
            
            const settlementAmount = Math.min(Math.abs(debtAmount), creditAmount);
            
            if (settlementAmount > 0.01) { // Avoid tiny amounts
                settlements.push({
                    from: debtor,
                    to: creditor,
                    amount: settlementAmount
                });
                
                // Update balances
                debtors[debtorIndex][1] += settlementAmount;
                creditors[creditorIndex][1] -= settlementAmount;
                
                // Move to next if balance is settled
                if (Math.abs(debtors[debtorIndex][1]) < 0.01) {
                    debtorIndex++;
                }
                if (creditors[creditorIndex][1] < 0.01) {
                    creditorIndex++;
                }
            } else {
                break;
            }
        }
        
        return settlements;
    };

    const handleSettle = () => {
        const newSettlements = calculateOptimalSettlements();
        setSettlements(newSettlements);
        setIsModalOpen(true);
    };

    const handleExport = () => {
        let summary = 'BrokeBuddieSplitter - Expense Summary\n';
        summary += '=====================================\n\n';
        
        // Expenses
        summary += 'EXPENSES:\n';
        summary += '---------\n';
        expenses.forEach((expense, index) => {
            const date = new Date(expense.date).toLocaleDateString();
            summary += `${index + 1}. ${expense.description}\n`;
            summary += `   Paid by: ${expense.payer}\n`;
            summary += `   Amount: ₹${expense.amount.toFixed(2)}\n`;
            summary += `   Split: ${expense.buddies.join(', ')}\n`;
            summary += `   Date: ${date}\n\n`;
        });
        
        // Balances
        summary += 'CURRENT BALANCES:\n';
        summary += '-----------------\n';
        Object.entries(balances)
            .sort(([,a], [,b]) => Math.abs(b) - Math.abs(a))
            .forEach(([buddy, balance]) => {
                const status = balance > 0 ? 'Will receive' : balance < 0 ? 'Owes' : 'Settled';
                summary += `${buddy}: ${status} ₹${Math.abs(balance).toFixed(2)}\n`;
            });
        
        // Create and download file
        const blob = new Blob([summary], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'broke-buddie-splitter-summary.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleClear = () => {
        if (window.confirm('Are you sure you want to clear all data? This cannot be undone.')) {
            setExpenses([]);
            setBalances({});
            localStorage.removeItem('brokeBuddieSplitter');
        }
    };

    const saveToLocalStorage = () => {
        const data = {
            expenses,
            balances
        };
        localStorage.setItem('brokeBuddieSplitter', JSON.stringify(data));
    };

    // Gesture handlers
    const handleSwipe = (direction) => {
        setGestureFeedback(`Swiped ${direction}`);
        setTimeout(() => setGestureFeedback(''), 2000);
        
        // Haptic feedback
        if ('vibrate' in navigator) {
            navigator.vibrate(100);
        }
        
        // Handle different swipe actions
        switch (direction) {
            case 'left':
                // Could open a different view or action
                break;
            case 'right':
                // Could open a different view or action
                break;
            case 'up':
                // Could refresh or show summary
                break;
            case 'down':
                // Could hide/show elements
                break;
            default:
                break;
        }
    };

    const handlePinch = ({ scale, rotate }) => {
        setGestureFeedback(`Pinched: scale=${scale.toFixed(2)}, rotate=${rotate.toFixed(1)}°`);
        setTimeout(() => setGestureFeedback(''), 2000);
    };

    return (
        <div className="app">
            <DynamicBackground />
            
            <MobileGestureHandler
                onSwipe={handleSwipe}
                onPinch={handlePinch}
            >
                <div className="container">
                    <Header />
                    
                    {/* Gesture feedback indicator */}
                    {gestureFeedback && (
                        <motion.div
                            className="gesture-feedback"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            style={{
                                position: 'fixed',
                                top: '20px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                background: 'rgba(0,0,0,0.8)',
                                color: 'white',
                                padding: '10px 20px',
                                borderRadius: '20px',
                                zIndex: 1000,
                                fontSize: '14px'
                            }}
                        >
                            {gestureFeedback}
                        </motion.div>
                    )}
                    
                    <main className="main-content">
                        <motion.div 
                            className="dashboard-grid"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                        >
                            <MobileOptimizedForm onAddExpense={addExpense} />
                            <BalancesCard balances={balances} />
                            <ExpensesList expenses={expenses} />
                            <QuickActions 
                                expenses={expenses}
                                onSettle={handleSettle}
                                onExport={handleExport}
                                onClear={handleClear}
                            />
                        </motion.div>
                    </main>
                    
                    <Footer />
                </div>
            </MobileGestureHandler>
            
            <SettlementModal 
                isOpen={isModalOpen}
                settlements={settlements}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
};

export default App; 