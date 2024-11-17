import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Use useNavigate instead of useHistory
import axios from 'axios';
import '../styles/dashboardPage.css';

const DashboardPage: React.FC = () => {
    const [websites, setWebsites] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const navigate = useNavigate(); // Use useNavigate for redirection

    useEffect(() => {
        const fetchWebsites = async () => {
            try {
                const token = localStorage.getItem('token');

                if (!token) {
                    setError('User is not authenticated.');
                    return;
                }

                const response = await axios.get('/api/websites', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setWebsites(response.data);
            } catch (error) {
                setError('Error fetching websites: ');
                // setError('Error fetching websites: ' + (error.response?.data?.message || error.message));
            } finally {
                setLoading(false);
            }
        };

        fetchWebsites();
    }, []);

    const handleLogout = () => {
        // Clear the token from localStorage
        localStorage.removeItem('token');
        // Redirect the user to the login page using useNavigate
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
                    <p className="loading-message">Loading...</p>
                ) : error ? (
                    <p className="error-message">{error}</p>
                ) : websites.length > 0 ? (
                    <div className="website-list">
                        {websites.map((website: any) => (
                            <div key={website.id} className="website-card">
                                <p className="website-url">{website.url}</p>
                                <p className={`website-status ${website.status === 'Down' ? 'down' : ''}`}>
                                    Status: {website.status}
                                </p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="no-websites">No websites added yet.</p>
                )}
            </div>
        </div>
    );
};

export default DashboardPage;
