import React from 'react';
import { motion } from 'framer-motion';

const Footer = () => {
    return (
        <motion.footer 
            className="footer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
        >
            <div className="footer-content">
                <p className="copyright">
                    © 2024 BrokeBuddieSplitter. All rights reserved and owned by{' '}
                    <motion.a 
                        href="https://github.com/goofydude26" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="github-link"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        @goofydude26
                    </motion.a>
                    {' '}and{' '}
                    <motion.a 
                        href="https://github.com/lennin311" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="github-link"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        @lennin311
                    </motion.a>
                </p>
            </div>
        </motion.footer>
    );
};

export default Footer; 