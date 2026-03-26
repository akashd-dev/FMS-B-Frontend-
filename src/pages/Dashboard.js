import { useContext } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { AuthContext } from '../context/AuthContext';

const stats = [
  {
    icon: (
      <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24">
        <path d="M12 22V12M12 12C12 7 7 3 2 3s3 7 10 9M12 12c0-5 5-9 10-9s-3 7-10 9"/>
      </svg>
    ),
    label: 'Available Crops',
    value: '248',
    delta: '+12 today',
    accent: '#14b47a',
    bg: 'rgba(20,180,120,0.08)',
    border: 'rgba(20,180,120,0.15)',
  },
  {
    icon: (
      <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24">
        <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
        <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>
      </svg>
    ),
    label: 'Items in Cart',
    value: '3',
    delta: 'Ready to checkout',
    accent: '#f5a623',
    bg: 'rgba(245,166,35,0.08)',
    border: 'rgba(245,166,35,0.15)',
  },
  {
    icon: (
      <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24">
        <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
        <path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12"/>
      </svg>
    ),
    label: 'Total Orders',
    value: '12',
    delta: '2 in transit',
    accent: '#14b47a',
    bg: 'rgba(20,180,120,0.08)',
    border: 'rgba(20,180,120,0.15)',
  },
  {
    icon: (
      <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
      </svg>
    ),
    label: 'Unread Messages',
    value: '5',
    delta: 'From farmers',
    accent: '#7c6af7',
    bg: 'rgba(124,106,247,0.08)',
    border: 'rgba(124,106,247,0.15)',
  },
];

const recentOrders = [
  { id: '#ORD-001', crop: 'Wheat', qty: '50 kg', farmer: 'Rajesh Kumar', status: 'Delivered',  statusColor: '#14b47a' },
  { id: '#ORD-002', crop: 'Rice',  qty: '30 kg', farmer: 'Priya Sharma', status: 'In Transit', statusColor: '#f5a623' },
  { id: '#ORD-003', crop: 'Corn',  qty: '20 kg', farmer: 'Amit Singh',   status: 'Pending',    statusColor: '#7c6af7' },
];

export default function Dashboard() {
  const { user } = useContext(AuthContext);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@300;400;500&display=swap');

        .dash-root {
          display: flex; min-height: 100vh;
          background: #0a0a0f;
          font-family: 'DM Sans', sans-serif;
        }

        /* Background */
        .dash-bg {
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background:
            radial-gradient(ellipse 70% 50% at 70% 10%, rgba(20,180,120,0.09) 0%, transparent 60%),
            radial-gradient(ellipse 50% 60% at 20% 80%, rgba(16,100,220,0.07) 0%, transparent 60%);
        }

        .dash-grid {
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background-image:
            linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
          background-size: 60px 60px;
        }

        /* Main content */
        .dash-main {
          margin-left: 240px;
          flex: 1; display: flex; flex-direction: column;
          position: relative; z-index: 1; min-height: 100vh;
        }

        .dash-body {
          padding: 36px 36px 48px;
          flex: 1;
        }

        /* Page header */
        .page-header { margin-bottom: 36px; }

        .page-eyebrow {
          font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase;
          color: #14b47a; font-weight: 500; margin-bottom: 8px;
          display: flex; align-items: center; gap: 6px;
        }
        .page-eyebrow::before {
          content: ''; width: 6px; height: 6px; border-radius: 50%;
          background: #14b47a; animation: blink 2s infinite;
        }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }

        .page-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(24px, 3vw, 34px);
          font-weight: 700; color: #fff;
          letter-spacing: -0.02em; margin-bottom: 6px;
        }

        .page-title span {
          background: linear-gradient(135deg, #14b47a, #1de9b6);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }

        .page-sub {
          font-size: 14px; color: rgba(255,255,255,0.32); font-weight: 300;
        }

        /* Stats grid */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
          gap: 16px; margin-bottom: 36px;
        }

        .stat-card {
          background: rgba(255,255,255,0.03);
          border-radius: 16px; padding: 22px 22px 18px;
          border: 1px solid rgba(255,255,255,0.07);
          transition: transform 0.2s, box-shadow 0.2s;
          animation: fadeUp 0.5s ease both;
        }
        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(0,0,0,0.3);
        }
        .stat-card:nth-child(2) { animation-delay: 0.05s; }
        .stat-card:nth-child(3) { animation-delay: 0.10s; }
        .stat-card:nth-child(4) { animation-delay: 0.15s; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .stat-icon-wrap {
          width: 44px; height: 44px; border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 16px;
        }

        .stat-value {
          font-family: 'Playfair Display', serif;
          font-size: 32px; font-weight: 700; color: #fff;
          line-height: 1; margin-bottom: 4px;
        }

        .stat-label {
          font-size: 12.5px; color: rgba(255,255,255,0.35);
          margin-bottom: 10px; font-weight: 400;
        }

        .stat-delta {
          font-size: 11.5px; font-weight: 500;
          display: flex; align-items: center; gap: 4px;
        }

        /* Content row */
        .content-row {
          display: grid;
          grid-template-columns: 1fr 320px;
          gap: 20px;
          animation: fadeUp 0.5s 0.2s ease both;
        }

        @media (max-width: 1100px) { .content-row { grid-template-columns: 1fr; } }

        /* Panel */
        .panel {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px; overflow: hidden;
        }

        .panel-header {
          padding: 18px 22px; border-bottom: 1px solid rgba(255,255,255,0.06);
          display: flex; align-items: center; justify-content: space-between;
        }

        .panel-title {
          font-size: 13.5px; font-weight: 500; color: rgba(255,255,255,0.7);
          display: flex; align-items: center; gap: 8px;
        }

        .panel-action {
          font-size: 12px; color: #14b47a; text-decoration: none;
          transition: opacity 0.2s;
        }
        .panel-action:hover { opacity: 0.7; }

        /* Orders table */
        .orders-table { width: 100%; border-collapse: collapse; }

        .orders-table th {
          padding: 10px 22px; text-align: left;
          font-size: 10.5px; letter-spacing: 0.08em; text-transform: uppercase;
          color: rgba(255,255,255,0.2); font-weight: 500;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }

        .orders-table td {
          padding: 14px 22px; font-size: 13.5px;
          color: rgba(255,255,255,0.55);
          border-bottom: 1px solid rgba(255,255,255,0.04);
        }

        .orders-table tr:last-child td { border-bottom: none; }
        .orders-table tr:hover td { background: rgba(255,255,255,0.02); }

        .td-primary { color: rgba(255,255,255,0.8) !important; font-weight: 500; }

        .status-pill {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 3px 10px; border-radius: 100px;
          font-size: 11.5px; font-weight: 500;
        }
        .status-dot { width: 5px; height: 5px; border-radius: 50%; }

        /* Quick actions */
        .quick-actions { display: flex; flex-direction: column; gap: 6px; padding: 14px; }

        .qa-btn {
          display: flex; align-items: center; gap: 12px;
          padding: 12px 14px; border-radius: 11px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          color: rgba(255,255,255,0.5); font-size: 13.5px;
          text-decoration: none; transition: all 0.18s;
          font-family: 'DM Sans', sans-serif; cursor: pointer;
        }
        .qa-btn:hover {
          background: rgba(20,180,120,0.07);
          border-color: rgba(20,180,120,0.2);
          color: rgba(255,255,255,0.8);
        }

        .qa-icon {
          width: 34px; height: 34px; border-radius: 9px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }

        .qa-label { font-weight: 400; }
        .qa-arrow { margin-left: auto; color: rgba(255,255,255,0.15); font-size: 14px; }
      `}</style>

      <div className="dash-root">
        <div className="dash-bg" />
        <div className="dash-grid" />

        <Sidebar />

        <div className="dash-main">
          <Navbar />

          <div className="dash-body">
            {/* Page header */}
            <div className="page-header">
              <div className="page-eyebrow">Overview</div>
              <h1 className="page-title">
                Welcome, <span>{user?.name?.split(' ')[0] || 'Buyer'}</span> 👋
              </h1>
              <p className="page-sub">Find fresh crops from local farmers and manage your purchases.</p>
            </div>

            {/* Stats */}
            <div className="stats-grid">
              {stats.map((s, i) => (
                <div className="stat-card" key={i}>
                  <div className="stat-icon-wrap" style={{ background: s.bg, border: `1px solid ${s.border}` }}>
                    <span style={{ color: s.accent }}>{s.icon}</span>
                  </div>
                  <div className="stat-value">{s.value}</div>
                  <div className="stat-label">{s.label}</div>
                  <div className="stat-delta" style={{ color: s.accent }}>
                    <span>↑</span> {s.delta}
                  </div>
                </div>
              ))}
            </div>

            {/* Content row */}
            <div className="content-row">
              {/* Recent orders */}
              <div className="panel">
                <div className="panel-header">
                  <span className="panel-title">
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
                    </svg>
                    Recent Orders
                  </span>
                  <a href="/orders" className="panel-action">View all →</a>
                </div>
                <table className="orders-table">
                  <thead>
                    <tr>
                      <th>Order</th>
                      <th>Crop</th>
                      <th>Farmer</th>
                      <th>Qty</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((o) => (
                      <tr key={o.id}>
                        <td className="td-primary">{o.id}</td>
                        <td>{o.crop}</td>
                        <td>{o.farmer}</td>
                        <td>{o.qty}</td>
                        <td>
                          <span className="status-pill" style={{
                            background: `${o.statusColor}15`,
                            color: o.statusColor,
                            border: `1px solid ${o.statusColor}30`,
                          }}>
                            <span className="status-dot" style={{ background: o.statusColor }} />
                            {o.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Quick actions */}
              <div className="panel">
                <div className="panel-header">
                  <span className="panel-title">
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                    </svg>
                    Quick Actions
                  </span>
                </div>
                <div className="quick-actions">
                  {[
                    { icon: '🌱', label: 'Browse Crops', href: '/crops',   bg: 'rgba(20,180,120,0.10)' },
                    { icon: '🛒', label: 'View Cart',    href: '/cart',    bg: 'rgba(245,166,35,0.10)' },
                    { icon: '💬', label: 'Chat Farmers', href: '/chat',    bg: 'rgba(124,106,247,0.10)' },
                    { icon: '👤', label: 'My Profile',   href: '/profile', bg: 'rgba(255,255,255,0.06)' },
                  ].map((a) => (
                    <a key={a.href} href={a.href} className="qa-btn">
                      <div className="qa-icon" style={{ background: a.bg }}>{a.icon}</div>
                      <span className="qa-label">{a.label}</span>
                      <span className="qa-arrow">→</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}