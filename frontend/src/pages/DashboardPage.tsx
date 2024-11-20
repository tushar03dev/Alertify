import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/dashboardPage.css';

const API_BASE_URL = 'http://localhost:5000';

const DashboardPage: React.FC = () => {
    const [websites, setWebsites] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const [userName, setUserName] = useState<string>('User'); // Default fallback
    const navigate = useNavigate();

    // Function to fetch website data
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
            setError(''); // Clear previous errors if successful
        } catch (error) {
            console.error('Error fetching websites:', error);
            setError('Failed to load websites. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Function to fetch user details
    const fetchUserName = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('User is not authenticated.');
                return;
            }

            const response = await axios.get(`${API_BASE_URL}/api/user/user-profile`, {
                headers: {
                    Authorization: `${token}`,
                },
            });

            setUserName(response.data.user.name || 'User'); // Set user name or fallback to 'User'
        } catch (error) {
            console.error('Error fetching user name:', error);
            setError('Failed to load user details.');
        }
    };

    // UseEffect to fetch websites and user details initially
    useEffect(() => {
        fetchWebsites();
        fetchUserName();
        const intervalId = setInterval(fetchWebsites, 60000); // Fetch every 60 seconds
        return () => clearInterval(intervalId); // Cleanup on component unmount
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div className="dashboard-page-container">
            <h2 className="dashboard-title">Dashboard</h2>
            <div className="logout-container">
                <span className="welcome-message">Welcome, {userName}!</span>
                <div className="button-group">
                    <Link to="/add-website" className="add-website-button">
                        Alter Website
                    </Link>
                    <button onClick={handleLogout} className="logout-button">
                        Logout
                    </button>
                </div>
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
                                <strong>{website.websiteName}</strong>: {website.url}
                                <p>
                                    Status: <span
                                    className={website.currentStatus.status === 'up' ? 'status-up' : 'status-down'}>
                                        {website.currentStatus.status}
                                    </span>
                                </p>
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
