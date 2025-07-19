import React from 'react';
import { motion } from 'framer-motion';

const Header = () => {
    return (
        <motion.header 
            className="header"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
        >
            <motion.div 
                className="logo"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
            >
                <motion.i 
                    className="fas fa-users"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
                <h1>BrokeBuddieSplitter</h1>
            </motion.div>
            <motion.p 
                className="tagline"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
            >
                Split expenses with your buddies, not your friendships
            </motion.p>
        </motion.header>
    );
};

export default Header; 