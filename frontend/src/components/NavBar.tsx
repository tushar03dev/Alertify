import React from 'react';
import { Link } from 'react-router-dom';

const NavBar: React.FC = () => {
    return (
        <nav className="bg-blue-500 p-4 shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-white text-2xl font-bold">My Project</h1>
                <div className="space-x-4">
                    <Link to="/" className="text-white hover:underline">Home</Link>
                    <Link to="/auth" className="text-white hover:underline">Get Started</Link>
                    <Link to="/dashboard" className="text-white hover:underline">Dashboard</Link>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;