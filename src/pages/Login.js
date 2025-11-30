// src/pages/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase'; // Import the Supabase client
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSigningUp, setIsSigningUp] = useState(false); // State to toggle between Sign In and Sign Up
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setErrorMessage('');

    try {
      if (isSigningUp) {
        // Sign Up logic
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMessage('Sign up successful! Please check your email for a confirmation link.');
      } else {
        // Sign In logic
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;

        // On successful login, Supabase client handles the session.
        // We can manually set our app's logged-in state and navigate.
        if (data.user) {
          localStorage.setItem('isLoggedIn', 'true');
          navigate('/');
        }
      }
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <img src="/public.PNG" alt="Netplix Logo" className="netflix-logo" />

      <form onSubmit={handleSubmit} className="login-form">
        <h2>{isSigningUp ? 'Sign Up' : 'Sign In'}</h2>
        <div className="input-container">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="input-container">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {message && <p className="success-message">{message}</p>}
        <button type="submit" className="login-button" disabled={loading}>
          {loading ? 'Loading...' : (isSigningUp ? 'Sign Up' : 'Sign In')}
        </button>
        <div className="login-help">
          <a href="#" onClick={(e) => {
            e.preventDefault();
            setIsSigningUp(!isSigningUp);
            setMessage('');
            setErrorMessage('');
          }}>
            {isSigningUp ? 'Already have an account? Sign In.' : 'New to Netplix? Sign up now.'}
          </a>
        </div>
      </form>

      <div className="login-footer">
        <p className="login-disclaimer">
          This page is protected by Google reCAPTCHA to ensure you're not a bot.
        </p>
      </div>
    </div>
  );
};

export default Login;

