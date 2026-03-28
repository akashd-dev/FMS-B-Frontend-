import { NavLink } from 'react-router-dom';

const links = [
  { to: '/',        icon: (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
      <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
    </svg>
  ), label: 'Dashboard' },
  { to: '/profile',  icon: (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <circle cx="12" cy="7" r="4"/><path d="M5 21a7 7 0 0114 0"/>
    </svg>
  ), label: 'Profile' },
  { to: '/crops',    icon: (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path d="M12 22V12M12 12C12 7 7 3 2 3s3 7 10 9M12 12c0-5 5-9 10-9s-3 7-10 9"/>
    </svg>
  ), label: 'Browse Crops' },
  { to: '/cart',     icon: (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
      <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>
    </svg>
  ), label: 'Cart', badge: 3 },
  { to: '/orders',   icon: (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
      <path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12"/>
    </svg>
  ), label: 'My Orders' },
  { to: '/inquiries',     icon: (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
    </svg>
  ), label: 'My Inquiries' },
];

export default function Sidebar() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&display=swap');

        .sidebar-root {
          position: fixed; top: 0; left: 0;
          width: 240px; height: 100vh;
          background: rgba(10,10,15,0.97);
          border-right: 1px solid rgba(255,255,255,0.06);
          display: flex; flex-direction: column;
          font-family: 'DM Sans', sans-serif;
          z-index: 200;
          padding-top: 0;
        }

        .sidebar-brand {
          height: 64px;
          display: flex; align-items: center; gap: 10px;
          padding: 0 20px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          flex-shrink: 0;
        }

        .s-brand-icon {
          width: 32px; height: 32px; border-radius: 9px;
          background: linear-gradient(135deg, #14b47a, #1de9b6);
          display: flex; align-items: center; justify-content: center;
          font-size: 15px;
          box-shadow: 0 0 14px rgba(20,180,120,0.35);
          flex-shrink: 0;
        }

        .s-brand-text { font-size: 15px; font-weight: 500; color: #fff; letter-spacing: -0.01em; }
        .s-brand-sub  { font-size: 10.5px; color: rgba(255,255,255,0.28); font-weight: 300; }

        .sidebar-section-label {
          font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase;
          color: rgba(255,255,255,0.2); font-weight: 500;
          padding: 20px 20px 8px;
        }

        .sidebar-nav { display: flex; flex-direction: column; gap: 2px; padding: 0 10px; flex: 1; }

        .sidebar-link {
          display: flex; align-items: center; gap: 12px;
          padding: 10px 12px; border-radius: 10px;
          font-size: 13.5px; font-weight: 400;
          color: rgba(255,255,255,0.38);
          text-decoration: none;
          transition: background 0.15s, color 0.15s;
          position: relative;
        }
        .sidebar-link:hover {
          background: rgba(255,255,255,0.04);
          color: rgba(255,255,255,0.7);
        }
        .sidebar-link.active {
          background: rgba(20,180,120,0.10);
          color: #1de9b6;
          border: none;
        }
        .sidebar-link.active .s-icon { color: #14b47a; }

        .s-icon { flex-shrink: 0; display: flex; transition: color 0.15s; }

        .s-badge {
          margin-left: auto;
          background: #14b47a; color: #fff;
          font-size: 10px; font-weight: 600;
          width: 18px; height: 18px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
        }

        .sidebar-bottom {
          padding: 16px 10px;
          border-top: 1px solid rgba(255,255,255,0.05);
        }

        .sidebar-version {
          font-size: 10.5px; color: rgba(255,255,255,0.15);
          text-align: center; padding: 4px;
        }
      `}</style>

      <div className="sidebar-root">
        <div className="sidebar-brand">
          <div className="s-brand-icon">🌾</div>
          <div>
            <div className="s-brand-text">KrishiConnect</div>
            <div className="s-brand-sub">Buyer Portal</div>
          </div>
        </div>

        <div className="sidebar-section-label">Navigation</div>

        <nav className="sidebar-nav">
          {links.map(({ to, icon, label, badge }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
            >
              <span className="s-icon">{icon}</span>
              {label}
              {badge && <span className="s-badge">{badge}</span>}
            </NavLink>
            
          ))}
  
        </nav>


        <div className="sidebar-bottom">
          <div className="sidebar-version">AgriManage v1.0 · Buyer</div>
        </div>
      </div>
    </>
  );
}