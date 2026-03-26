import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const [hover, setHover] = useState(false);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&display=swap');

        .navbar-root {
          position: sticky; top: 0; z-index: 100;
          height: 64px;
          background: rgba(10,10,15,0.85);
          border-bottom: 1px solid rgba(255,255,255,0.06);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          display: flex; align-items: center;
          padding: 0 28px;
          font-family: 'DM Sans', sans-serif;
          gap: 16px;
        }

        .navbar-brand {
          display: flex; align-items: center; gap: 10px;
          font-family: 'DM Sans', sans-serif;
          font-size: 17px; font-weight: 500; color: #fff;
          letter-spacing: -0.01em;
        }

        .brand-icon {
          width: 32px; height: 32px; border-radius: 9px;
          background: linear-gradient(135deg, #14b47a, #1de9b6);
          display: flex; align-items: center; justify-content: center;
          font-size: 15px;
          box-shadow: 0 0 14px rgba(20,180,120,0.35);
        }

        .brand-sub {
          font-size: 11px; color: rgba(255,255,255,0.3);
          font-weight: 300; letter-spacing: 0.04em;
          margin-top: 1px;
        }

        .navbar-spacer { flex: 1; }

        .navbar-badge {
          display: flex; align-items: center; gap: 6px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 100px; padding: 5px 14px 5px 8px;
          font-size: 13px; color: rgba(255,255,255,0.55);
        }

        .avatar {
          width: 26px; height: 26px; border-radius: 50%;
          background: linear-gradient(135deg, #14b47a, #0e9464);
          display: flex; align-items: center; justify-content: center;
          font-size: 11px; font-weight: 600; color: #fff;
          flex-shrink: 0;
        }

        .logout-btn {
          display: flex; align-items: center; gap: 7px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 9px; padding: 7px 14px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px; color: rgba(255,255,255,0.45);
          cursor: pointer; transition: all 0.2s;
        }
        .logout-btn:hover {
          background: rgba(255,80,80,0.08);
          border-color: rgba(255,80,80,0.2);
          color: #ff6b6b;
        }
      `}</style>

      <nav className="navbar-root">
        <div className="navbar-brand">
          <div className="brand-icon">🌾</div>
          <div>
            <div>KrishiConnect</div>
            <div className="brand-sub">Buyer Portal</div>
          </div>
        </div>

        <div className="navbar-spacer" />

        <div className="navbar-badge">
          <div className="avatar">{user?.name?.[0]?.toUpperCase() || 'B'}</div>
          {user?.name}
        </div>

        <button className="logout-btn" onClick={logout}>
          <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>
          </svg>
          Logout
        </button>
      </nav>
    </>
  );
}