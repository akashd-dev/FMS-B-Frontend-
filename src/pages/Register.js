import { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    location: '',
    role: 'buyer'
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1); // 2-step form

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleNext = (e) => {
    e.preventDefault();
    if (!form.name || !form.email) return;
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', form);
      if (res.data.success) {
        setMessage(res.data.message || 'Registration successful! Redirecting...');
        setForm({ name: '', email: '', phone: '', password: '', location: '', role: 'buyer' });
        setTimeout(() => { window.location.href = '/login'; }, 1800);
      }
    } catch (err) {
      if (err.code === 'ERR_NETWORK') {
        setError('Network Error: Backend server is not running.');
      } else {
        setError(err.response?.data?.message || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const progress = step === 1 ? 50 : 100;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@300;400;500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .reg-root {
          min-height: 100vh;
          display: flex;
          font-family: 'DM Sans', sans-serif;
          background: #0a0a0f;
          overflow: hidden;
          position: relative;
        }

        .bg-mesh {
          position: fixed; inset: 0; z-index: 0;
          background:
            radial-gradient(ellipse 80% 60% at 80% 20%, rgba(20, 180, 120, 0.16) 0%, transparent 60%),
            radial-gradient(ellipse 60% 80% at 20% 80%, rgba(16, 100, 220, 0.12) 0%, transparent 60%),
            radial-gradient(ellipse 40% 40% at 40% 10%, rgba(160, 80, 255, 0.09) 0%, transparent 50%);
          animation: meshShift 8s ease-in-out infinite alternate;
        }

        @keyframes meshShift {
          0%   { filter: hue-rotate(0deg) brightness(1); }
          100% { filter: hue-rotate(20deg) brightness(1.15); }
        }

        .orb {
          position: fixed; border-radius: 50%; filter: blur(80px);
          opacity: 0.16; animation: orbFloat 12s ease-in-out infinite alternate;
          pointer-events: none; z-index: 0;
        }
        .orb-1 { width: 400px; height: 400px; background: #14b47a; top: -80px; right: -80px; animation-delay: 0s; }
        .orb-2 { width: 280px; height: 280px; background: #1064dc; bottom: -60px; left: -40px; animation-delay: -5s; }
        .orb-3 { width: 180px; height: 180px; background: #a050ff; top: 55%; left: 8%; animation-delay: -9s; }

        @keyframes orbFloat {
          0%   { transform: translate(0, 0) scale(1); }
          100% { transform: translate(-30px, 40px) scale(1.1); }
        }

        .grid-lines {
          position: fixed; inset: 0; z-index: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
          background-size: 60px 60px;
        }

        /* Left panel */
        .reg-left {
          display: none;
          position: relative; z-index: 1; flex: 1;
          flex-direction: column; justify-content: center; padding: 60px;
          border-right: 1px solid rgba(255,255,255,0.06);
        }
        @media (min-width: 960px) { .reg-left { display: flex; } }

        .brand-tag {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(20, 180, 120, 0.12);
          border: 1px solid rgba(20, 180, 120, 0.3);
          border-radius: 100px; padding: 6px 16px;
          font-size: 12px; color: #14b47a;
          letter-spacing: 0.12em; text-transform: uppercase;
          margin-bottom: 48px; width: fit-content;
        }
        .brand-tag::before {
          content: ''; width: 6px; height: 6px;
          background: #14b47a; border-radius: 50%;
          animation: blink 2s infinite;
        }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }

        .left-headline {
          font-family: 'Playfair Display', serif;
          font-size: clamp(34px, 3.5vw, 52px);
          font-weight: 700; color: #fff;
          line-height: 1.15; letter-spacing: -0.02em; margin-bottom: 24px;
        }
        .left-headline span {
          background: linear-gradient(135deg, #14b47a 0%, #1de9b6 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }

        .left-sub {
          font-size: 15px; color: rgba(255,255,255,0.38);
          line-height: 1.75; max-width: 360px; font-weight: 300; margin-bottom: 52px;
        }

        /* Perks list */
        .perks { display: flex; flex-direction: column; gap: 18px; }

        .perk {
          display: flex; align-items: center; gap: 14px;
        }

        .perk-icon {
          width: 38px; height: 38px; flex-shrink: 0;
          background: rgba(20,180,120,0.10);
          border: 1px solid rgba(20,180,120,0.2);
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-size: 16px;
        }

        .perk-text { font-size: 14px; color: rgba(255,255,255,0.45); line-height: 1.4; }
        .perk-text strong { color: rgba(255,255,255,0.75); font-weight: 500; display: block; }

        /* Right panel */
        .reg-right {
          position: relative; z-index: 1; flex: 0 0 500px;
          display: flex; align-items: center; justify-content: center;
          padding: 40px 32px;
        }
        @media (max-width: 959px) { .reg-right { flex: 1; } }

        .card {
          width: 100%; max-width: 440px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 24px; padding: 44px 40px;
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          animation: cardIn 0.7s cubic-bezier(0.22,1,0.36,1) both;
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
          margin-bottom: 28px; font-size: 20px;
        }

        .card-title {
          font-family: 'Playfair Display', serif;
          font-size: 26px; font-weight: 700; color: #fff;
          margin-bottom: 6px; letter-spacing: -0.01em;
        }

        .card-sub {
          font-size: 13.5px; color: rgba(255,255,255,0.32);
          margin-bottom: 28px; font-weight: 300;
        }

        /* Progress bar */
        .progress-wrap { margin-bottom: 28px; }

        .progress-labels {
          display: flex; justify-content: space-between;
          margin-bottom: 8px;
        }

        .progress-label {
          font-size: 11px; letter-spacing: 0.08em;
          text-transform: uppercase; font-weight: 500;
          transition: color 0.3s;
        }
        .progress-label.active { color: #14b47a; }
        .progress-label.inactive { color: rgba(255,255,255,0.2); }

        .progress-bar-bg {
          height: 3px; background: rgba(255,255,255,0.07);
          border-radius: 100px; overflow: hidden;
        }

        .progress-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #14b47a, #1de9b6);
          border-radius: 100px;
          transition: width 0.5s cubic-bezier(0.22,1,0.36,1);
          box-shadow: 0 0 8px rgba(20,180,120,0.5);
        }

        /* Alerts */
        .alert-box {
          display: flex; align-items: flex-start; gap: 10px;
          border-radius: 12px; padding: 12px 16px;
          margin-bottom: 20px; font-size: 13px;
          animation: slideIn 0.3s ease;
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .alert-success { background: rgba(20,180,120,0.10); border: 1px solid rgba(20,180,120,0.25); color: #1de9b6; }
        .alert-error   { background: rgba(255,70,70,0.10);  border: 1px solid rgba(255,70,70,0.25);  color: #ff6b6b; animation: shake 0.35s ease; }

        @keyframes shake {
          0%,100% { transform: translateX(0); }
          25%      { transform: translateX(-6px); }
          75%      { transform: translateX(6px); }
        }

        /* Step panels */
        .step-panel {
          animation: stepIn 0.4s cubic-bezier(0.22,1,0.36,1) both;
        }
        @keyframes stepIn {
          from { opacity: 0; transform: translateX(18px); }
          to   { opacity: 1; transform: translateX(0); }
        }

        .field-group { display: flex; flex-direction: column; gap: 14px; margin-bottom: 22px; }

        .field-wrap { position: relative; }

        .field-label {
          display: block; font-size: 11.5px; font-weight: 500;
          letter-spacing: 0.08em; text-transform: uppercase;
          color: rgba(255,255,255,0.35); margin-bottom: 7px; transition: color 0.2s;
        }
        .field-wrap.is-focused .field-label { color: #14b47a; }

        .field-input-wrap { position: relative; }

        .field-icon {
          position: absolute; left: 14px; top: 50%;
          transform: translateY(-50%);
          color: rgba(255,255,255,0.18); pointer-events: none;
          transition: color 0.2s; display: flex;
        }
        .field-wrap.is-focused .field-icon { color: #14b47a; }

        .field-input {
          width: 100%;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 11px; padding: 13px 14px 13px 42px;
          font-family: 'DM Sans', sans-serif; font-size: 14.5px;
          color: #fff; outline: none;
          transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
        }
        .field-input::placeholder { color: rgba(255,255,255,0.16); }
        .field-input:focus {
          border-color: rgba(20,180,122,0.5);
          background: rgba(20,180,122,0.06);
          box-shadow: 0 0 0 4px rgba(20,180,122,0.08);
        }

        .toggle-btn {
          position: absolute; right: 13px; top: 50%;
          transform: translateY(-50%);
          background: none; border: none; cursor: pointer;
          color: rgba(255,255,255,0.22); padding: 4px; display: flex;
          transition: color 0.2s;
        }
        .toggle-btn:hover { color: #14b47a; }

        /* Two-col row */
        .field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

        /* Buttons */
        .btn-primary {
          width: 100%;
          background: linear-gradient(135deg, #14b47a 0%, #0e9464 100%);
          border: none; border-radius: 11px; padding: 14px;
          font-family: 'DM Sans', sans-serif; font-size: 14.5px;
          font-weight: 500; color: #fff; cursor: pointer;
          position: relative; overflow: hidden;
          transition: transform 0.15s, box-shadow 0.2s, opacity 0.2s;
          box-shadow: 0 4px 24px rgba(20,180,120,0.3);
          display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .btn-primary::before {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.15), transparent);
          opacity: 0; transition: opacity 0.2s;
        }
        .btn-primary:hover:not(:disabled)::before { opacity: 1; }
        .btn-primary:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 8px 32px rgba(20,180,120,0.4); }
        .btn-primary:active:not(:disabled) { transform: translateY(0); }
        .btn-primary:disabled { opacity: 0.55; cursor: not-allowed; }

        .btn-ghost {
          width: 100%; background: transparent;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 11px; padding: 13px;
          font-family: 'DM Sans', sans-serif; font-size: 14.5px;
          font-weight: 400; color: rgba(255,255,255,0.45); cursor: pointer;
          transition: border-color 0.2s, color 0.2s, background 0.2s;
          display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .btn-ghost:hover {
          border-color: rgba(255,255,255,0.22);
          color: rgba(255,255,255,0.75);
          background: rgba(255,255,255,0.04);
        }

        .btn-row { display: flex; flex-direction: column; gap: 10px; }

        .spinner {
          width: 15px; height: 15px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff; border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .divider {
          display: flex; align-items: center; gap: 12px;
          margin: 22px 0; color: rgba(255,255,255,0.14); font-size: 12px;
        }
        .divider::before, .divider::after {
          content: ''; flex: 1; height: 1px;
          background: rgba(255,255,255,0.07);
        }

        .login-row {
          text-align: center; font-size: 13px; color: rgba(255,255,255,0.28);
        }
        .login-link {
          color: #14b47a; text-decoration: none; font-weight: 500; transition: opacity 0.2s;
        }
        .login-link:hover { opacity: 0.75; }

        /* Success state */
        .success-state {
          text-align: center; padding: 12px 0 4px;
          animation: cardIn 0.5s ease both;
        }
        .success-icon {
          width: 64px; height: 64px; border-radius: 50%;
          background: linear-gradient(135deg, #14b47a, #1de9b6);
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 20px; font-size: 28px;
          box-shadow: 0 0 40px rgba(20,180,120,0.4);
        }
        .success-title {
          font-family: 'Playfair Display', serif;
          font-size: 22px; color: #fff; margin-bottom: 8px;
        }
        .success-sub { font-size: 13.5px; color: rgba(255,255,255,0.35); }
      `}</style>

      <div className="reg-root">
        <div className="bg-mesh" />
        <div className="grid-lines" />
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />

        {/* Left panel */}
        <div className="reg-left">
          <div className="brand-tag">Join Us Today</div>
          <h1 className="left-headline">
            Start buying<br />smarter, <span>faster.</span>
          </h1>
          <p className="left-sub">
            Create your free buyer account in seconds and unlock access to thousands of verified products.
          </p>
          <div className="perks">
            {[
              { icon: '🔒', title: 'Secure Transactions', sub: 'End-to-end encrypted payments and data protection.' },
              { icon: '🚀', title: 'Instant Access', sub: 'Browse and buy from 12,000+ listed products immediately.' },
              { icon: '🎯', title: 'Personalised Deals', sub: 'Get offers tailored to your location and preferences.' },
            ].map((p, i) => (
              <div className="perk" key={i}>
                <div className="perk-icon">{p.icon}</div>
                <div className="perk-text">
                  <strong>{p.title}</strong>
                  {p.sub}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right panel */}
        <div className="reg-right">
          <div className="card">
            {message ? (
              <div className="success-state">
                <div className="success-icon">✓</div>
                <div className="success-title">You're all set!</div>
                <div className="success-sub">Account created. Redirecting you to login…</div>
              </div>
            ) : (
              <>
                <div className="card-logo">🛍️</div>
                <h2 className="card-title">Create account</h2>
                <p className="card-sub">Join as a buyer — it's free</p>

                {/* Progress */}
                <div className="progress-wrap">
                  <div className="progress-labels">
                    <span className={`progress-label ${step >= 1 ? 'active' : 'inactive'}`}>Personal Info</span>
                    <span className={`progress-label ${step >= 2 ? 'active' : 'inactive'}`}>Account Details</span>
                  </div>
                  <div className="progress-bar-bg">
                    <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
                  </div>
                </div>

                {error && (
                  <div className="alert-box alert-error">
                    <span>⚠</span> {error}
                  </div>
                )}

                {/* Step 1 */}
                {step === 1 && (
                  <div className="step-panel">
                    <div className="field-group">
                      {/* Full Name */}
                      <div className={`field-wrap${focused === 'name' ? ' is-focused' : ''}`}>
                        <label className="field-label">Full Name</label>
                        <div className="field-input-wrap">
                          <span className="field-icon">
                            <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                              <circle cx="12" cy="7" r="4"/><path d="M5 21a7 7 0 0114 0"/>
                            </svg>
                          </span>
                          <input className="field-input" type="text" name="name" placeholder="John Doe"
                            value={form.name} onChange={handleChange}
                            onFocus={() => setFocused('name')} onBlur={() => setFocused('')} required />
                        </div>
                      </div>

                      {/* Email */}
                      <div className={`field-wrap${focused === 'email' ? ' is-focused' : ''}`}>
                        <label className="field-label">Email Address</label>
                        <div className="field-input-wrap">
                          <span className="field-icon">
                            <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                              <rect x="2" y="4" width="20" height="16" rx="3"/><path d="M2 7l10 7 10-7"/>
                            </svg>
                          </span>
                          <input className="field-input" type="email" name="email" placeholder="you@example.com"
                            value={form.email} onChange={handleChange}
                            onFocus={() => setFocused('email')} onBlur={() => setFocused('')} required />
                        </div>
                      </div>
                    </div>

                    <button className="btn-primary" onClick={handleNext}>
                      Continue <span>→</span>
                    </button>
                  </div>
                )}

                {/* Step 2 */}
                {step === 2 && (
                  <div className="step-panel">
                    <div className="field-group">
                      {/* Phone + Location row */}
                      <div className="field-row">
                        <div className={`field-wrap${focused === 'phone' ? ' is-focused' : ''}`}>
                          <label className="field-label">Phone</label>
                          <div className="field-input-wrap">
                            <span className="field-icon">
                              <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                                <path d="M22 16.92v3a2 2 0 01-2.18 2A19.79 19.79 0 013.09 4.18 2 2 0 015.07 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L9.09 9.91a16 16 0 006.99 7l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 17z"/>
                              </svg>
                            </span>
                            <input className="field-input" type="tel" name="phone" placeholder="+91 9876…"
                              value={form.phone} onChange={handleChange}
                              onFocus={() => setFocused('phone')} onBlur={() => setFocused('')} required />
                          </div>
                        </div>

                        <div className={`field-wrap${focused === 'location' ? ' is-focused' : ''}`}>
                          <label className="field-label">City</label>
                          <div className="field-input-wrap">
                            <span className="field-icon">
                              <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/>
                              </svg>
                            </span>
                            <input className="field-input" type="text" name="location" placeholder="Bengaluru"
                              value={form.location} onChange={handleChange}
                              onFocus={() => setFocused('location')} onBlur={() => setFocused('')} required />
                          </div>
                        </div>
                      </div>

                      {/* Password */}
                      <div className={`field-wrap${focused === 'password' ? ' is-focused' : ''}`}>
                        <label className="field-label">Password</label>
                        <div className="field-input-wrap">
                          <span className="field-icon">
                            <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                              <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
                            </svg>
                          </span>
                          <input className="field-input" type={showPassword ? 'text' : 'password'}
                            name="password" placeholder="Min. 8 characters"
                            value={form.password} onChange={handleChange}
                            onFocus={() => setFocused('password')} onBlur={() => setFocused('')} required />
                          <button type="button" className="toggle-btn" onClick={() => setShowPassword(!showPassword)} tabIndex={-1}>
                            {showPassword ? (
                              <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                                <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
                                <line x1="1" y1="1" x2="23" y2="23"/>
                              </svg>
                            ) : (
                              <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                              </svg>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="btn-row">
                      <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
                        {loading ? <><div className="spinner" /> Creating account…</> : <>Create Account ✓</>}
                      </button>
                      <button className="btn-ghost" onClick={() => setStep(1)}>
                        ← Back
                      </button>
                    </div>
                  </div>
                )}

                <div className="divider">or</div>
                <div className="login-row">
                  Already have an account?{' '}
                  <Link to="/login" className="login-link">Sign in</Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}