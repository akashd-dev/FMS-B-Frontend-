import { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState('');
  const { setUser } = useContext(AuthContext);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', form, { withCredentials: true });
      if (res.data.success) {
        setUser(res.data.user);
        window.location.href = '/';
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@300;400;500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .login-root {
          min-height: 100vh;
          display: flex;
          font-family: 'DM Sans', sans-serif;
          background: #0a0a0f;
          overflow: hidden;
          position: relative;
        }

        /* Animated mesh background */
        .bg-mesh {
          position: fixed;
          inset: 0;
          z-index: 0;
          background:
            radial-gradient(ellipse 80% 60% at 20% 20%, rgba(20, 180, 120, 0.18) 0%, transparent 60%),
            radial-gradient(ellipse 60% 80% at 80% 80%, rgba(16, 100, 220, 0.14) 0%, transparent 60%),
            radial-gradient(ellipse 40% 40% at 60% 10%, rgba(160, 80, 255, 0.10) 0%, transparent 50%);
          animation: meshShift 8s ease-in-out infinite alternate;
        }

        @keyframes meshShift {
          0%   { filter: hue-rotate(0deg) brightness(1); }
          100% { filter: hue-rotate(20deg) brightness(1.15); }
        }

        /* Floating orbs */
        .orb {
          position: fixed;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.18;
          animation: orbFloat 12s ease-in-out infinite alternate;
          pointer-events: none;
          z-index: 0;
        }
        .orb-1 { width: 420px; height: 420px; background: #14b47a; top: -100px; left: -100px; animation-delay: 0s; }
        .orb-2 { width: 300px; height: 300px; background: #1064dc; bottom: -80px; right: -60px; animation-delay: -4s; }
        .orb-3 { width: 200px; height: 200px; background: #a050ff; top: 50%; right: 10%; animation-delay: -8s; }

        @keyframes orbFloat {
          0%   { transform: translate(0, 0) scale(1); }
          100% { transform: translate(30px, -40px) scale(1.1); }
        }

        /* Grid lines */
        .grid-lines {
          position: fixed;
          inset: 0;
          z-index: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
          background-size: 60px 60px;
        }

        /* Split layout */
        .login-left {
          display: none;
          position: relative;
          z-index: 1;
          flex: 1;
          flex-direction: column;
          justify-content: center;
          padding: 60px;
          border-right: 1px solid rgba(255,255,255,0.06);
        }

        @media (min-width: 900px) {
          .login-left { display: flex; }
        }

        .brand-tag {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(20, 180, 120, 0.12);
          border: 1px solid rgba(20, 180, 120, 0.3);
          border-radius: 100px;
          padding: 6px 16px;
          font-size: 12px;
          color: #14b47a;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          margin-bottom: 48px;
          width: fit-content;
        }

        .brand-tag::before {
          content: '';
          width: 6px; height: 6px;
          background: #14b47a;
          border-radius: 50%;
          animation: blink 2s infinite;
        }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.3; }
        }

        .left-headline {
          font-family: 'Playfair Display', serif;
          font-size: clamp(36px, 4vw, 56px);
          font-weight: 700;
          color: #fff;
          line-height: 1.15;
          letter-spacing: -0.02em;
          margin-bottom: 24px;
        }

        .left-headline span {
          background: linear-gradient(135deg, #14b47a 0%, #1de9b6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .left-sub {
          font-size: 16px;
          color: rgba(255,255,255,0.42);
          line-height: 1.7;
          max-width: 360px;
          font-weight: 300;
          margin-bottom: 56px;
        }

        /* Stats row */
        .stats-row {
          display: flex;
          gap: 32px;
          flex-wrap: wrap;
        }

        .stat {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .stat-num {
          font-family: 'Playfair Display', serif;
          font-size: 28px;
          font-weight: 700;
          color: #fff;
        }

        .stat-label {
          font-size: 12px;
          color: rgba(255,255,255,0.35);
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        /* Right panel — the actual form */
        .login-right {
          position: relative;
          z-index: 1;
          flex: 0 0 480px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 32px;
        }

        @media (max-width: 899px) {
          .login-right { flex: 1; }
        }

        .card {
          width: 100%;
          max-width: 420px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 24px;
          padding: 48px 40px;
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          animation: cardIn 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        @keyframes cardIn {
          from { opacity: 0; transform: translateY(32px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .card-logo {
          width: 44px; height: 44px;
          background: linear-gradient(135deg, #14b47a, #1de9b6);
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 32px;
          font-size: 20px;
        }

        .card-title {
          font-family: 'Playfair Display', serif;
          font-size: 28px;
          font-weight: 700;
          color: #fff;
          margin-bottom: 8px;
          letter-spacing: -0.01em;
        }

        .card-sub {
          font-size: 14px;
          color: rgba(255,255,255,0.35);
          margin-bottom: 36px;
          font-weight: 300;
        }

        /* Error */
        .error-box {
          display: flex;
          align-items: center;
          gap: 10px;
          background: rgba(255, 70, 70, 0.10);
          border: 1px solid rgba(255, 70, 70, 0.25);
          border-radius: 12px;
          padding: 12px 16px;
          margin-bottom: 24px;
          font-size: 13.5px;
          color: #ff6b6b;
          animation: shake 0.35s ease;
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25%       { transform: translateX(-6px); }
          75%       { transform: translateX(6px); }
        }

        /* Field group */
        .field-group {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 28px;
        }

        .field-wrap {
          position: relative;
        }

        .field-label {
          display: block;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.38);
          margin-bottom: 8px;
          transition: color 0.2s;
        }

        .field-wrap.is-focused .field-label {
          color: #14b47a;
        }

        .field-input-wrap {
          position: relative;
        }

        .field-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(255,255,255,0.2);
          pointer-events: none;
          transition: color 0.2s;
          display: flex;
        }

        .field-wrap.is-focused .field-icon {
          color: #14b47a;
        }

        .field-input {
          width: 100%;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          padding: 14px 44px 14px 44px;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          color: #fff;
          outline: none;
          transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
        }

        .field-input::placeholder { color: rgba(255,255,255,0.18); }

        .field-input:focus {
          border-color: rgba(20, 180, 122, 0.5);
          background: rgba(20, 180, 122, 0.06);
          box-shadow: 0 0 0 4px rgba(20, 180, 122, 0.08);
        }

        .toggle-btn {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: rgba(255,255,255,0.25);
          padding: 4px;
          display: flex;
          transition: color 0.2s;
        }

        .toggle-btn:hover { color: #14b47a; }

        /* Forgot */
        .forgot-row {
          display: flex;
          justify-content: flex-end;
          margin-top: -8px;
          margin-bottom: 28px;
        }

        .forgot-link {
          font-size: 12.5px;
          color: rgba(255,255,255,0.3);
          text-decoration: none;
          transition: color 0.2s;
        }

        .forgot-link:hover { color: #14b47a; }

        /* Submit button */
        .submit-btn {
          width: 100%;
          background: linear-gradient(135deg, #14b47a 0%, #0e9464 100%);
          border: none;
          border-radius: 12px;
          padding: 15px;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          font-weight: 500;
          color: #fff;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: transform 0.15s, box-shadow 0.2s, opacity 0.2s;
          box-shadow: 0 4px 24px rgba(20, 180, 120, 0.3);
          letter-spacing: 0.02em;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .submit-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.15), transparent);
          opacity: 0;
          transition: opacity 0.2s;
        }

        .submit-btn:hover:not(:disabled)::before { opacity: 1; }
        .submit-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 8px 32px rgba(20,180,120,0.4); }
        .submit-btn:active:not(:disabled) { transform: translateY(0); }
        .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        /* Spinner */
        .spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        /* Divider */
        .divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 28px 0;
          color: rgba(255,255,255,0.15);
          font-size: 12px;
        }

        .divider::before, .divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: rgba(255,255,255,0.07);
        }

        /* Register row */
        .register-row {
          text-align: center;
          font-size: 13.5px;
          color: rgba(255,255,255,0.3);
        }

        .register-link {
          color: #14b47a;
          text-decoration: none;
          font-weight: 500;
          transition: opacity 0.2s;
        }

        .register-link:hover { opacity: 0.75; }
      `}</style>

      <div className="login-root">
        <div className="bg-mesh" />
        <div className="grid-lines" />
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />

        {/* Left panel */}
        <div className="login-left">
          <div className="brand-tag">Marketplace</div>
          <h1 className="left-headline">
            Your next great<br />deal starts <span>here.</span>
          </h1>
          <p className="left-sub">
            Thousands of verified sellers, curated products, and seamless transactions — all in one place.
          </p>
          <div className="stats-row">
            <div className="stat">
              <span className="stat-num">48K+</span>
              <span className="stat-label">Active Buyers</span>
            </div>
            <div className="stat">
              <span className="stat-num">12K+</span>
              <span className="stat-label">Products</span>
            </div>
            <div className="stat">
              <span className="stat-num">99.4%</span>
              <span className="stat-label">Satisfaction</span>
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div className="login-right">
          <div className="card">
            <div className="card-logo">🛒</div>
            <h2 className="card-title">Welcome back</h2>
            <p className="card-sub">Sign in to your buyer account</p>

            {error && (
              <div className="error-box">
                <span>⚠</span> {error}
              </div>
            )}

            <div className="field-group">
              {/* Email */}
              <div className={`field-wrap${focused === 'email' ? ' is-focused' : ''}`}>
                <label className="field-label">Email</label>
                <div className="field-input-wrap">
                  <span className="field-icon">
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                      <rect x="2" y="4" width="20" height="16" rx="3"/>
                      <path d="M2 7l10 7 10-7"/>
                    </svg>
                  </span>
                  <input
                    className="field-input"
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange}
                    onFocus={() => setFocused('email')}
                    onBlur={() => setFocused('')}
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className={`field-wrap${focused === 'password' ? ' is-focused' : ''}`}>
                <label className="field-label">Password</label>
                <div className="field-input-wrap">
                  <span className="field-icon">
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                      <rect x="3" y="11" width="18" height="11" rx="2"/>
                      <path d="M7 11V7a5 5 0 0110 0v4"/>
                    </svg>
                  </span>
                  <input
                    className="field-input"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={handleChange}
                    onFocus={() => setFocused('password')}
                    onBlur={() => setFocused('')}
                    required
                  />
                  <button
                    type="button"
                    className="toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    ) : (
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="forgot-row">
              <a href="/forgot-password" className="forgot-link">Forgot password?</a>
            </div>

            <button
              className="submit-btn"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <><div className="spinner" /> Signing in…</>
              ) : (
                <>Sign In <span>→</span></>
              )}
            </button>

            <div className="divider">or</div>

            <div className="register-row">
              New buyer?{' '}
              <a href="/register" className="register-link">Create an account</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}