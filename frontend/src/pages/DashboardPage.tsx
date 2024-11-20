import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/dashboardPage.css';

const API_BASE_URL = 'http://localhost:5000';

const DashboardPage: React.FC = () => {
    const [websites, setWebsites] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchWebsites = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setError('User is not authenticated.');
                    return;
                }

                const response = await axios.get(`${API_BASE_URL}/api/websites`, {
                    headers: {
                        Authorization: `${token}`,
                    },
                });

                setWebsites(response.data.websites);
            } catch (error) {
                console.error('Error fetching websites:', error);
                setError('Failed to load websites. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchWebsites();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div className="dashboard-page-container">
            <h2 className="dashboard-title">Dashboard</h2>
            <div className="logout-container">
                <button onClick={handleLogout} className="logout-button">
                    Logout
                </button>
            </div>
            <div className="mb-4">
                <Link to="/add-website" className="add-website-button">
                    Add New Website
                </Link>
            </div>
            <div>
                {loading ? (
                    <p>Loading...</p>
                ) : error ? (
                    <p className="error-message">{error}</p>
                ) : websites.length > 0 ? (
                    <ul className="website-list">
                        {websites.map((website) => (
                            <li key={website._id} className="website-item">
                                {website.websiteName} - {website.url}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No websites found.</p>
                )}
            </div>
        </div>
    );
};

export default DashboardPage;
