import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
    return (
        <div style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden' }}>
            {/* Background Video */}
            <video
                autoPlay
                muted
                loop
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                }}
            >
                <source src="resources/background.mp4" type="video/mp4" />
            </video>

            {/* Foreground Content */}
            <div
                style={{
                    position: 'relative',
                    zIndex: 10,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    height: '100%',
                }}
            >
                <motion.h1
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    style={{
                        fontSize: '3.5rem', // Slightly larger font size
                        fontWeight: '700',
                        color: 'white',
                        marginBottom: '3.5rem', // Increased gap between the heading and the button
                    }}
                >
                    Welcome to Alertify
                </motion.h1>

                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                >
                    <Link
                        to="/auth"
                        style={{
                            padding: '1rem 3rem', // Increased padding for a bigger button
                            fontSize: '1.5rem', // Larger font size
                            backgroundColor: 'white',
                            color: 'black',
                            fontWeight: '600',
                            borderRadius: '0.75rem', // Slightly larger border-radius for aesthetics
                            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                            textDecoration: 'none',
                            transition: 'transform 0.3s, box-shadow 0.3s',
                        }}
                        onMouseEnter={(e) => {
                            (e.target as HTMLAnchorElement).style.transform = 'scale(1.15)';
                            (e.target as HTMLAnchorElement).style.boxShadow = '0px 6px 8px rgba(0, 0, 0, 0.15)';
                        }}
                        onMouseLeave={(e) => {
                            (e.target as HTMLAnchorElement).style.transform = 'scale(1)';
                            (e.target as HTMLAnchorElement).style.boxShadow = '0px 4px 6px rgba(0, 0, 0, 0.1)';
                        }}
                    >
                        Get Started
                    </Link>
                </motion.div>
            </div>
        </div>
    );
};

export default HomePage;