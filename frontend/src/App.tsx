// src/App.tsx
import React from 'react';
import './index.css';
import './styles/custom.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import AlterWebsite from './pages/AlterWebsite.tsx';

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/add-website" element={<AlterWebsite />} />
            </Routes>
        </Router>
    );
};

export default App;
