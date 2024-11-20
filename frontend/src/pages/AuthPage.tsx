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
    const [loading, setLoading] = useState(false);

    const toggleAuthMode = () => {
        setIsLogin(!isLogin);
        setErrorMessage(''); // Clear error messages when switching modes
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        if (isLogin) {
            // Login flow
            try {
                const response = await axios.post('/api/auth/login', { email, password });

                if (response.data.token) {
                    localStorage.setItem('token', response.data.token);
                    alert('Login successful!');
                    window.location.href = '/dashboard';
                } else {
                    setErrorMessage('Login failed. Please try again.');
                }
            } catch (error) {
                setErrorMessage('Error logging in. Please try again.');
            }
        } else {
            // Sign-up flow: Send OTP
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

        setLoading(false);
    };

    const handleOtpSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post('/api/otp/verify', { otpToken, otp });

            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                alert('Sign up successful!');
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

        setLoading(false);
    };

    return (
        <div className="auth-page">
            <div className={`container ${isLogin ? '' : 'right-panel-active'}`}>
                <div className="form-container sign-up-container">
                    <form onSubmit={otpToken ? handleOtpSubmit : handleSubmit}>
                        <h1>{otpToken ? 'Verify OTP' : 'Create Account'}</h1>
                        {!otpToken && (
                            <>
                                <input
                                    type="text"
                                    placeholder="Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                <input
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </>
                        )}
                        {otpToken && (
                            <input
                                type="text"
                                placeholder="Enter OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                required
                            />
                        )}
                        {errorMessage && <p className="error-message">{errorMessage}</p>}
                        <button type="submit" disabled={loading}>
                            {loading ? 'Loading...' : otpToken ? 'Verify OTP' : 'Sign Up'}
                        </button>
                    </form>
                </div>
                <div className="form-container sign-in-container">
                    <form onSubmit={handleSubmit}>
                        <h1>Sign in</h1>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        {errorMessage && <p className="error-message">{errorMessage}</p>}
                        <button type="submit" disabled={loading}>
                            {loading ? 'Loading...' : 'Sign In'}
                        </button>
                    </form>
                </div>
                <div className="overlay-container">
                    <div className="overlay">
                        <div className="overlay-panel overlay-left">
                            <h1>Welcome Back!</h1>
                            <p>To keep connected with us please login with your personal info</p>
                            <button className="ghost" onClick={toggleAuthMode}>
                                Sign In
                            </button>
                        </div>
                        <div className="overlay-panel overlay-right">
                            <h1>Hello, Friend!</h1>
                            <p>Enter your details and start your journey with us</p>
                            <button className="ghost" onClick={toggleAuthMode}>
                                Sign Up
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
