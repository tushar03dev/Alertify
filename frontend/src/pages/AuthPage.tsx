import React, { useState } from 'react';
import axios from 'axios';
import '../styles/authPage.css';

const AuthPage: React.FC = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [otp, setOtp] = useState('');
    const [otpToken, setOtpToken] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false); // To manage loading state

    const toggleAuthMode = () => {
        setIsLogin(!isLogin);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true); // Set loading state to true

        if (isLogin) {
            // Handle login
            try {
                const response = await axios.post('/api/auth/login', { email, password });

                if (response.data.token) {
                    // Save the JWT token to localStorage
                    localStorage.setItem('token', response.data.token);
                    alert('Login successful!');
                    // Redirect to dashboard or another page
                    window.location.href = '/dashboard';
                } else {
                    setErrorMessage('Login failed. Please try again.');
                }
            } catch (error) {
                setErrorMessage('Error logging in. Please try again.');
            }
        } else {
            // Send the OTP to backend and get the OTP token for verification
            try {
                const response = await axios.post('/api/auth/sign-up', { email, password, name });
                setOtpToken(response.data.otpToken);
                alert('OTP sent to your email. Please enter the OTP to complete sign-up.');
            } catch (error: unknown) {
                if (axios.isAxiosError(error)) {
                    setErrorMessage(error.response?.data?.message || 'Error sending OTP, please try again.');
                } else {
                    setErrorMessage('An unexpected error occurred, please try again.');
                }
            }
        }
        setLoading(false); // Set loading state to false
    };

    const handleOtpSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true); // Set loading state to true

        try {
            const response = await axios.post('/api/otp/verify', { otpToken, otp });

            if (response.data.token) {
                // Successfully signed up and received JWT token
                localStorage.setItem('token', response.data.token); // Store the JWT token in localStorage
                alert('Sign up successful!');
                // Redirect to the dashboard or another page
                window.location.href = '/dashboard';
            } else {
                setErrorMessage('Invalid OTP.');
            }
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                setErrorMessage(error.response?.data?.message || 'Error verifying OTP, please try again.');
            } else {
                setErrorMessage('An unexpected error occurred, please try again.');
            }
        }
        setLoading(false); // Set loading state to false
    };

    return (
        <div className="auth-page-container">
            <div className="auth-form-container">
                <h2 className="text-3xl font-bold mb-4">{isLogin ? 'Login' : 'Sign Up'}</h2>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    {!isLogin && (
                        <div>
                            <label className="block mb-1 font-medium">Name</label>
                            <input
                                type="text"
                                className="w-full border rounded p-2"
                                placeholder="Enter your name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                    )}
                    <div>
                        <label className="block mb-1 font-medium">Email</label>
                        <input
                            type="email"
                            className="w-full border rounded p-2"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block mb-1 font-medium">Password</label>
                        <input
                            type="password"
                            className="w-full border rounded p-2"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit" disabled={loading} className="w-full bg-blue-500 text-white py-2 rounded mt-4">
                        {isLogin ? (loading ? 'Logging in...' : 'Login') : (loading ? 'Signing up...' : 'Sign Up')}
                    </button>
                </form>

                {!isLogin && otpToken && (
                    <form className="space-y-4 mt-4" onSubmit={handleOtpSubmit}>
                        <div>
                            <label className="block mb-1 font-medium">OTP</label>
                            <input
                                type="text"
                                className="w-full border rounded p-2"
                                placeholder="Enter OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                            />
                        </div>
                        <button type="submit" disabled={loading} className="w-full bg-green-500 text-white py-2 rounded mt-4">
                            Verify OTP
                        </button>
                        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
                    </form>
                )}

                <button onClick={toggleAuthMode} className="mt-4 text-blue-500 underline">
                    {isLogin ? 'Don\'t have an account? Sign Up' : 'Already have an account? Login'}
                </button>
            </div>
        </div>
    );
};

export default AuthPage;
