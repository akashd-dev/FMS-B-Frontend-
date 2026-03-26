import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const STATUS_CONFIG = {
  pending:   { color: '#f5a623', bg: 'rgba(245,166,35,.10)',  border: 'rgba(245,166,35,.25)',  label: 'Pending' },
  confirmed: { color: '#7c6af7', bg: 'rgba(124,106,247,.10)', border: 'rgba(124,106,247,.25)', label: 'Confirmed' },
  shipped:   { color: '#1de9b6', bg: 'rgba(29,233,182,.10)',  border: 'rgba(29,233,182,.25)',  label: 'Shipped' },
  delivered: { color: '#14b47a', bg: 'rgba(20,180,120,.10)',  border: 'rgba(20,180,120,.25)',  label: 'Delivered' },
  cancelled: { color: '#ff6b6b', bg: 'rgba(255,107,107,.10)', border: 'rgba(255,107,107,.25)', label: 'Cancelled' },
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/orders/my', { withCredentials: true });
      setOrders(res.data.orders || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);
  const totalSpent = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@300;400;500&display=swap');
        .orders-root { display:flex; min-height:100vh; background:#0a0a0f; font-family:'DM Sans',sans-serif; }
        .orders-bg { position:fixed; inset:0; z-index:0; pointer-events:none;
          background: radial-gradient(ellipse 60% 50% at 70% 0%, rgba(20,180,120,0.09) 0%, transparent 60%),
                      radial-gradient(ellipse 50% 50% at 20% 90%, rgba(124,106,247,0.07) 0%, transparent 60%); }
        .orders-grid-bg { position:fixed; inset:0; z-index:0; pointer-events:none;
          background-image: linear-gradient(rgba(255,255,255,0.02) 1px,transparent 1px),
                            linear-gradient(90deg,rgba(255,255,255,0.02) 1px,transparent 1px);
          background-size:60px 60px; }
        .orders-main { margin-left:240px; flex:1; display:flex; flex-direction:column; position:relative; z-index:1; }
        .orders-body { padding:36px; flex:1; }
        .page-eyebrow { font-size:11px; letter-spacing:.12em; text-transform:uppercase; color:#14b47a;
          font-weight:500; margin-bottom:8px; display:flex; align-items:center; gap:6px; }
        .page-eyebrow::before { content:''; width:6px; height:6px; border-radius:50%; background:#14b47a; animation:blink 2s infinite; }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:.3} }
        .page-title { font-family:'Playfair Display',serif; font-size:clamp(22px,3vw,32px); font-weight:700;
          color:#fff; letter-spacing:-.02em; margin-bottom:6px; }
        .page-title span { background:linear-gradient(135deg,#14b47a,#1de9b6); -webkit-background-clip:text;
          -webkit-text-fill-color:transparent; background-clip:text; }
        .page-sub { font-size:13.5px; color:rgba(255,255,255,.3); font-weight:300; margin-bottom:28px; }

        /* Summary row */
        .summary-row { display:flex; gap:14px; margin-bottom:24px; flex-wrap:wrap; }
        .summary-pill { background:rgba(255,255,255,.03); border:1px solid rgba(255,255,255,.07);
          border-radius:12px; padding:14px 20px; display:flex; align-items:center; gap:10px; flex:1; min-width:140px; }
        .summary-icon { width:36px; height:36px; border-radius:9px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
        .summary-val { font-family:'Playfair Display',serif; font-size:22px; font-weight:700; color:#fff; line-height:1; }
        .summary-lbl { font-size:11px; color:rgba(255,255,255,.28); margin-top:2px; }

        /* Filter tabs */
        .filter-tabs { display:flex; gap:6px; margin-bottom:22px; flex-wrap:wrap; }
        .ftab { background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.07); border-radius:9px;
          padding:7px 16px; font-family:'DM Sans',sans-serif; font-size:12.5px; color:rgba(255,255,255,.38);
          cursor:pointer; transition:all .15s; }
        .ftab:hover { background:rgba(255,255,255,.07); color:rgba(255,255,255,.65); }
        .ftab.active { background:rgba(20,180,120,.1); border-color:rgba(20,180,120,.3); color:#1de9b6; }

        /* Orders list */
        .orders-list { display:flex; flex-direction:column; gap:12px; }

        .order-card { background:rgba(255,255,255,.03); border:1px solid rgba(255,255,255,.07); border-radius:16px;
          padding:20px 22px; display:flex; align-items:center; gap:20px; flex-wrap:wrap;
          transition:transform .2s,box-shadow .2s; animation:fadeUp .4s ease both; }
        .order-card:hover { transform:translateY(-2px); box-shadow:0 8px 30px rgba(0,0,0,.3); }
        @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }

        .order-icon { width:46px; height:46px; border-radius:12px; background:rgba(20,180,120,.08);
          border:1px solid rgba(20,180,120,.15); display:flex; align-items:center; justify-content:center;
          font-size:20px; flex-shrink:0; }
        .order-info { flex:1; min-width:120px; }
        .order-crop { font-size:15px; font-weight:500; color:rgba(255,255,255,.8); margin-bottom:4px; }
        .order-meta { font-size:12.5px; color:rgba(255,255,255,.3); display:flex; gap:14px; flex-wrap:wrap; }
        .order-meta span { display:flex; align-items:center; gap:5px; }
        .order-right { display:flex; flex-direction:column; align-items:flex-end; gap:8px; }
        .order-price { font-family:'Playfair Display',serif; font-size:20px; font-weight:700; color:#14b47a; }
        .status-pill { display:inline-flex; align-items:center; gap:5px; padding:4px 12px;
          border-radius:100px; font-size:11.5px; font-weight:500; }
        .status-dot { width:5px; height:5px; border-radius:50%; }
        .order-id { font-size:10.5px; color:rgba(255,255,255,.18); margin-top:2px; }

        /* Empty */
        .empty-state { display:flex; flex-direction:column; align-items:center; justify-content:center;
          padding:80px 20px; gap:14px; }
        .empty-icon { font-size:48px; opacity:.25; }
        .empty-text { font-size:14px; color:rgba(255,255,255,.2); }

        /* Skeleton */
        .skeleton { background:rgba(255,255,255,.04); border-radius:16px; height:84px; animation:pulse 1.4s ease infinite; }
        @keyframes pulse { 0%,100%{opacity:.4} 50%{opacity:.7} }
      `}</style>

      <div className="orders-root">
        <div className="orders-bg" />
        <div className="orders-grid-bg" />
        <Sidebar />
        <div className="orders-main">
          <Navbar />
          <div className="orders-body">
            <div className="page-eyebrow">History</div>
            <h1 className="page-title">My <span>Orders</span></h1>
            <p className="page-sub">Track all your crop purchases in one place.</p>

            {/* Summary */}
            <div className="summary-row">
              {[
                { icon: '📦', val: orders.length,                    lbl: 'Total Orders',   bg: 'rgba(20,180,120,.08)',   border: 'rgba(20,180,120,.2)',   color: '#14b47a' },
                { icon: '✅', val: orders.filter(o=>o.status==='delivered').length, lbl: 'Delivered', bg: 'rgba(20,180,120,.08)', border: 'rgba(20,180,120,.2)', color: '#14b47a' },
                { icon: '🚚', val: orders.filter(o=>o.status==='shipped').length,   lbl: 'In Transit', bg: 'rgba(29,233,182,.08)', border: 'rgba(29,233,182,.2)', color: '#1de9b6' },
                { icon: '₹',  val: `₹${totalSpent.toFixed(0)}`,       lbl: 'Total Spent',    bg: 'rgba(245,166,35,.08)',   border: 'rgba(245,166,35,.2)',   color: '#f5a623' },
              ].map((s, i) => (
                <div className="summary-pill" key={i}>
                  <div className="summary-icon" style={{ background: s.bg, border: `1px solid ${s.border}` }}>
                    <span style={{ color: s.color, fontSize: 16 }}>{s.icon}</span>
                  </div>
                  <div>
                    <div className="summary-val">{s.val}</div>
                    <div className="summary-lbl">{s.lbl}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Filter tabs */}
            <div className="filter-tabs">
              {['all', 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map(s => (
                <button key={s} className={`ftab${filter === s ? ' active' : ''}`} onClick={() => setFilter(s)}>
                  {s === 'all' ? 'All Orders' : STATUS_CONFIG[s]?.label || s}
                </button>
              ))}
            </div>

            {/* List */}
            <div className="orders-list">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => <div key={i} className="skeleton" />)
              ) : filtered.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📦</div>
                  <div className="empty-text">{filter === 'all' ? 'No orders placed yet.' : `No ${filter} orders.`}</div>
                </div>
              ) : filtered.map((order, idx) => {
                const sc = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
                return (
                  <div className="order-card" key={order._id} style={{ animationDelay: `${idx * 0.05}s` }}>
                    <div className="order-icon">🌿</div>
                    <div className="order-info">
                      <div className="order-crop">{order.cropId?.name || 'Crop'}</div>
                      <div className="order-meta">
                        <span>
                          <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
                          </svg>
                          {order.farmerId?.name || 'Farmer'}
                        </span>
                        <span>
                          <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z"/>
                          </svg>
                          {order.quantity} kg
                        </span>
                      </div>
                    </div>
                    <div className="order-right">
                      <div className="order-price">₹{order.totalPrice}</div>
                      <span className="status-pill" style={{ background: sc.bg, border: `1px solid ${sc.border}`, color: sc.color }}>
                        <span className="status-dot" style={{ background: sc.color }} />
                        {sc.label}
                      </span>
                      <div className="order-id">#{order._id?.slice(-8).toUpperCase()}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}