import React, { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { useSpring, animated } from 'react-spring';

const DynamicBackground = () => {
    const [particles, setParticles] = useState([]);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [deviceOrientation, setDeviceOrientation] = useState({ alpha: 0, beta: 0, gamma: 0 });
    const containerRef = useRef(null);
    
    // Motion values for interactive effects
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    
    // Transform mouse position to particle movement
    const particleX = useTransform(mouseX, [0, window.innerWidth], [-20, 20]);
    const particleY = useTransform(mouseY, [0, window.innerHeight], [-20, 20]);

    useEffect(() => {
        // Generate interactive particles
        const generateParticles = () => {
            const newParticles = [];
            const particleCount = window.innerWidth < 768 ? 15 : 25; // Fewer particles on mobile
            
            for (let i = 0; i < particleCount; i++) {
                newParticles.push({
                    id: i,
                    x: Math.random() * window.innerWidth,
                    y: Math.random() * window.innerHeight,
                    size: Math.random() * 6 + 3,
                    delay: Math.random() * 8,
                    duration: Math.random() * 6 + 4,
                    type: Math.random() > 0.7 ? 'star' : 'circle', // Some particles are stars
                    color: `hsl(${Math.random() * 60 + 200}, 70%, 60%)` // Blue to purple range
                });
            }
            setParticles(newParticles);
        };

        generateParticles();

        // Mouse/touch tracking
        const handleMouseMove = (e) => {
            const rect = containerRef.current?.getBoundingClientRect();
            if (rect) {
                setMousePosition({
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top
                });
                mouseX.set(e.clientX);
                mouseY.set(e.clientY);
            }
        };

        // Touch tracking for mobile
        const handleTouchMove = (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const rect = containerRef.current?.getBoundingClientRect();
            if (rect) {
                setMousePosition({
                    x: touch.clientX - rect.left,
                    y: touch.clientY - rect.top
                });
                mouseX.set(touch.clientX);
                mouseY.set(touch.clientY);
            }
        };

        // Device orientation tracking
        const handleOrientation = (e) => {
            setDeviceOrientation({
                alpha: e.alpha || 0,
                beta: e.beta || 0,
                gamma: e.gamma || 0
            });
        };

        // Add event listeners
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('touchmove', handleTouchMove, { passive: false });
        window.addEventListener('deviceorientation', handleOrientation);
        window.addEventListener('resize', generateParticles);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('deviceorientation', handleOrientation);
            window.removeEventListener('resize', generateParticles);
        };
    }, [mouseX, mouseY]);

    // Dynamic gradient based on time and interaction
    const gradientSpring = useSpring({
        from: { 
            background: 'linear-gradient(-45deg, #667eea, #764ba2, #f093fb, #f5576c)',
            backgroundSize: '400% 400%'
        },
        to: async (next) => {
            while (true) {
                await next({
                    background: 'linear-gradient(-45deg, #667eea, #764ba2, #f093fb, #f5576c)',
                    backgroundSize: '400% 400%',
                    backgroundPosition: '0% 50%'
                });
                await next({
                    background: 'linear-gradient(-45deg, #667eea, #764ba2, #f093fb, #f5576c)',
                    backgroundSize: '400% 400%',
                    backgroundPosition: '100% 50%'
                });
            }
        },
        config: { duration: 15000 }
    });

    return (
        <div ref={containerRef} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }}>
            <animated.div 
                className="dynamic-background"
                style={{
                    ...gradientSpring,
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    transform: `translate(${particleX}px, ${particleY}px)`
                }}
            />
            
            <div className="particles">
                {particles.map((particle) => (
                    <motion.div
                        key={particle.id}
                        className={`particle ${particle.type}`}
                        style={{
                            left: particle.x,
                            top: particle.y,
                            width: particle.size,
                            height: particle.size,
                            backgroundColor: particle.color,
                            filter: 'blur(0.5px)'
                        }}
                        animate={{
                            y: [-20, -100 - deviceOrientation.beta * 0.5, -20],
                            x: [0, 50 + deviceOrientation.gamma * 0.3, 0],
                            opacity: [0.3, 0.8, 0.3],
                            scale: [1, 1.2, 1],
                            rotate: particle.type === 'star' ? [0, 180, 360] : [0, 0, 0]
                        }}
                        transition={{
                            duration: particle.duration,
                            delay: particle.delay,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        whileHover={{
                            scale: 1.5,
                            filter: 'blur(0px)',
                            transition: { duration: 0.2 }
                        }}
                    >
                        {particle.type === 'star' && (
                            <div style={{
                                width: '100%',
                                height: '100%',
                                background: 'radial-gradient(circle, transparent 30%, currentColor 30%, currentColor 70%, transparent 70%)',
                                clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'
                            }} />
                        )}
                    </motion.div>
                ))}
            </div>
            
            {/* Interactive ripple effect */}
            <motion.div
                className="ripple-effect"
                style={{
                    position: 'absolute',
                    left: mousePosition.x - 50,
                    top: mousePosition.y - 50,
                    width: 100,
                    height: 100,
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
                    pointerEvents: 'none',
                    zIndex: 1
                }}
                animate={{
                    scale: [0, 2],
                    opacity: [0.5, 0]
                }}
                transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "easeOut"
                }}
            />
        </div>
    );
};

export default DynamicBackground; 