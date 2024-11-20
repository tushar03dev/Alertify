// src/pages/AddWebsitePage.tsx
import React, { useState } from 'react';
import axios from 'axios';  // Import axios to make API calls
import { useNavigate } from 'react-router-dom';  // For navigation after successful submission
import '../styles/addWebsitePage.css'; // Import the CSS file

const AddWebsitePage: React.FC = () => {
    const [url, setUrl] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();  // Hook for navigation after success

    const handleAddWebsite = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);  // Set loading state while waiting for the API response
        try {
            // Get the token from localStorage (or any other storage mechanism you are using)
            const token = localStorage.getItem('token');

            if (!token) {
                setMessage('User is not authenticated.');
                return;
            }

            // Send POST request to the backend API
            const response = await axios.post(
                '/api/website/register-website',
                { url },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,  // Attach the token for authentication
                    }
                }
            );

            setMessage('Website added successfully!');
            // Optionally navigate to another page (e.g., dashboard or website list)
            navigate('/dashboard');  // Adjust based on your routing setup
        } catch (error) {
            // @ts-ignore
            setMessage('Error adding website: ' + error.message);
        } finally {
            setLoading(false);  // Reset loading state
        }
    };

    return (
        <div className="add-website-page-container">
            <h2 className="add-website-title">Add New Website</h2>
            <form onSubmit={handleAddWebsite}>
                <div>
                    <label className="block mb-1 font-medium">Website URL</label>
                    <input
                        type="url"
                        className="add-website-input"
                        placeholder="Enter website URL"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                    />
                </div>
                <button
                    type="submit"
                    className={`add-website-button ${loading ? 'disabled' : ''}`}
                    disabled={loading}
                >
                    {loading ? 'Adding...' : 'Add Website'}
                </button>
            </form>
            {message && (
                <p className={`add-website-message ${message.includes('Error') ? 'error-message' : 'success-message'}`}>
                    {message}
                </p>
            )}
        </div>
    );
};

export default AddWebsitePage;
