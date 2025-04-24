import React from 'react';
import { Link } from 'react-router-dom';

const NavBar: React.FC = () => {
    return (
        <nav
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                zIndex: 50,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1rem 2rem',
                background: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
                color: 'white',
            }}
        >
            {/* Logo */}
            <h1 style={{ fontSize: '1.5rem', fontWeight: '700' }}>My Project</h1>

            {/* Navigation Links */}
            <div style={{ display: 'flex', gap: '1rem' }}>
                <Link
                    to="/"
                    style={{
                        fontSize: '1rem',
                        fontWeight: '500',
                        color: 'white',
                        textDecoration: 'none',
                        transition: 'color 0.3s',
                    }}
                    onMouseEnter={(e) => ((e.target as HTMLAnchorElement).style.color = 'gray')}
                    onMouseLeave={(e) => ((e.target as HTMLAnchorElement).style.color = 'white')}
                >
                    Home
                </Link>
                <Link
                    to="/auth"
                    style={{
                        fontSize: '1rem',
                        fontWeight: '500',
                        color: 'white',
                        textDecoration: 'none',
                        transition: 'color 0.3s',
                    }}
                    onMouseEnter={(e) => ((e.target as HTMLAnchorElement).style.color = 'gray')}
                    onMouseLeave={(e) => ((e.target as HTMLAnchorElement).style.color = 'white')}
                >
                    Get Started
                </Link>
                <Link
                    to="/dashboard"
                    style={{
                        fontSize: '1rem',
                        fontWeight: '500',
                        color: 'white',
                        textDecoration: 'none',
                        transition: 'color 0.3s',
                    }}
                    onMouseEnter={(e) => ((e.target as HTMLAnchorElement).style.color = 'gray')}
                    onMouseLeave={(e) => ((e.target as HTMLAnchorElement).style.color = 'white')}
                >
                    Dashboard
                </Link>
            </div>
        </nav>
    );
};

export default NavBar;