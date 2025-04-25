import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/AlterWebsite.css';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AlterWebsite: React.FC = () => {
    const [url, setUrl] = useState('');
    const [websiteName, setWebsiteName] = useState('');
    const [newWebsiteName, setNewWebsiteName] = useState('');
    const [newUrl, setNewUrl] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const token = localStorage.getItem('token'); // Retrieve the token for authentication

    if (!token) {
        navigate('/login'); // Redirect to login if not authenticated
        return null;
    }

    const config = {
        headers: {
            Authorization: `${token}`,
        },
    };

    const handleAddWebsite = async () => {
        if (!websiteName || !url) {
            setMessage('Please provide both website name and URL.');
            return;
        }
        try {
            setLoading(true);
            const response = await axios.post(
                `${API_BASE_URL}/api/register-website`,
                { websiteName, url },
                config
            );
            setMessage(response.data.message || 'Website added successfully!');
            setUrl('');
            setWebsiteName('');
        } catch (error: any) {
            setMessage(
                `Error adding website: ${
                    error.response?.data?.message || error.message
                }`
            );
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateWebsite = async () => {
        if (!websiteName || (!newUrl && !newWebsiteName)) {
            setMessage(
                'Please provide the current website name and at least one field to update (new name or new URL).'
            );
            return;
        }
        try {
            setLoading(true);
            const response = await axios.put(
                `${API_BASE_URL}/api/update-website`,
                { websiteName, newUrl, newWebsiteName },
                config
            );
            setMessage(response.data.message || 'Website updated successfully!');
            setWebsiteName('');
            setNewWebsiteName('');
            setNewUrl('');
        } catch (error: any) {
            setMessage(
                `Error updating website: ${
                    error.response?.data?.message || error.message
                }`
            );
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteWebsite = async () => {
        if (!websiteName) {
            setMessage('Please provide the website name to delete.');
            return;
        }
        try {
            setLoading(true);
            const response = await axios.delete(`${API_BASE_URL}/api/delete-website`, {
                ...config,
                data: { websiteName },
            });
            setMessage(response.data.message || 'Website deleted successfully!');
            setWebsiteName('');
        } catch (error: any) {
            setMessage(
                `Error deleting website: ${
                    error.response?.data?.message || error.message
                }`
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="alter-website-page-container">
            <h2 className="alter-website-title">Alter Website</h2>
            <div>
                <label className="block mb-1 font-medium">Website Name</label>
                <input
                    type="text"
                    className="alter-website-input"
                    placeholder="Enter website name"
                    value={websiteName}
                    onChange={(e) => setWebsiteName(e.target.value)}
                />
            </div>
            <div>
                <label className="block mb-1 font-medium">Website URL</label>
                <input
                    type="url"
                    className="alter-website-input"
                    placeholder="Enter website URL"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                />
            </div>
            <div>
                <label className="block mb-1 font-medium">New Website Name (For Update)</label>
                <input
                    type="text"
                    className="alter-website-input"
                    placeholder="Enter new website name"
                    value={newWebsiteName}
                    onChange={(e) => setNewWebsiteName(e.target.value)}
                />
            </div>
            <div>
                <label className="block mb-1 font-medium">New Website URL (For Update)</label>
                <input
                    type="url"
                    className="alter-website-input"
                    placeholder="Enter new website URL"
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                />
            </div>
            <div className="button-group">
                <button
                    className="alter-website-button add-button"
                    onClick={handleAddWebsite}
                    disabled={loading}
                >
                    {loading ? 'Adding...' : 'Add Website'}
                </button>
                <button
                    className="alter-website-button update-button"
                    onClick={handleUpdateWebsite}
                    disabled={loading}
                >
                    {loading ? 'Updating...' : 'Update Website'}
                </button>
                <button
                    className="alter-website-button delete-button"
                    onClick={handleDeleteWebsite}
                    disabled={loading}
                >
                    {loading ? 'Deleting...' : 'Delete Website'}
                </button>
            </div>
            {message && (
                <p
                    className={`alter-website-message ${
                        message.includes('Error') ? 'error-message' : 'success-message'
                    }`}
                >
                    {message}
                </p>
            )}
        </div>
    );
};

export default AlterWebsite;