import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { AuthContext } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useContext(AuthContext);

  const [stats, setStats] = useState({
    availableCrops: 0,
    itemsInCart: 0,
    totalOrders: 0,
    unreadMessages: 0
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError('');

      // 1. Get total available crops
      const cropsRes = await axios.get('http://localhost:5000/api/crops/all', { withCredentials: true });
      const availableCrops = cropsRes.data.crops?.length || 0;

      // 2. Get cart count from localStorage
      const savedCart = localStorage.getItem('buyerCart');
      const cartItems = savedCart ? JSON.parse(savedCart).length : 0;

      // 3. Get total orders placed by buyer
      const ordersRes = await axios.get('http://localhost:5000/api/orders/my', { withCredentials: true });
      const totalOrders = ordersRes.data.orders?.length || 0;

      // 4. For now, unread messages = 0 (you can extend later with real message count)
      const unreadMessages = 0;

      setStats({
        availableCrops,
        itemsInCart: cartItems,
        totalOrders,
        unreadMessages
      });

    } catch (err) {
      console.error("Dashboard stats error:", err);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  // Recent orders (real data from API)
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    const fetchRecentOrders = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/orders/my', { withCredentials: true });
        // Take latest 3 orders
        setRecentOrders(res.data.orders?.slice(0, 3) || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchRecentOrders();
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@300;400;500&display=swap');

        .dash-root {
          display: flex; min-height: 100vh;
          background: #0a0a0f;
          font-family: 'DM Sans', sans-serif;
        }

        .dash-bg {
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background: radial-gradient(ellipse 70% 50% at 70% 10%, rgba(20,180,120,0.09) 0%, transparent 60%),
                      radial-gradient(ellipse 50% 60% at 20% 80%, rgba(16,100,220,0.07) 0%, transparent 60%);
        }

        .dash-grid {
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background-image: linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
          background-size: 60px 60px;
        }

        .dash-main {
          margin-left: 240px;
          flex: 1; display: flex; flex-direction: column;
          position: relative; z-index: 1;
        }

        .dash-body {
          padding: 36px 36px 48px;
          flex: 1;
        }

        .page-eyebrow {
          font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase;
          color: #14b47a; font-weight: 500; margin-bottom: 8px;
        }

        .page-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(24px, 3vw, 34px);
          font-weight: 700; color: #fff;
          letter-spacing: -0.02em; margin-bottom: 6px;
        }

        .page-title span {
          background: linear-gradient(135deg, #14b47a, #1de9b6);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }

        .page-sub {
          font-size: 14px; color: rgba(255,255,255,0.32); font-weight: 300;
        }

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
        }
        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(0,0,0,0.3);
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
          margin-bottom: 10px;
        }

        .stat-delta {
          font-size: 11.5px; font-weight: 500;
          display: flex; align-items: center; gap: 4px;
        }
      `}</style>

      <div className="dash-root">
        <div className="dash-bg" />
        <div className="dash-grid" />

        <Sidebar />

        <div className="dash-main">
          <Navbar />

          <div className="dash-body">
            <div className="page-header">
              <div className="page-eyebrow">Overview</div>
              <h1 className="page-title">
                Welcome, <span>{user?.name?.split(' ')[0] || 'Buyer'}</span> 👋
              </h1>
              <p className="page-sub">Find fresh crops from local farmers and manage your purchases.</p>
            </div>

            {/* Real Stats */}
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-success" role="status"></div>
                <p className="mt-3 text-light">Loading your dashboard...</p>
              </div>
            ) : (
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon-wrap" style={{ background: 'rgba(20,180,120,0.08)', border: '1px solid rgba(20,180,120,0.15)' }}>
                    <span style={{ color: '#14b47a' }}>🌱</span>
                  </div>
                  <div className="stat-value">{stats.availableCrops}</div>
                  <div className="stat-label">Available Crops</div>
                  <div className="stat-delta" style={{ color: '#14b47a' }}>
                    Fresh from farmers
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon-wrap" style={{ background: 'rgba(245,166,35,0.08)', border: '1px solid rgba(245,166,35,0.15)' }}>
                    <span style={{ color: '#f5a623' }}>🛒</span>
                  </div>
                  <div className="stat-value">{stats.itemsInCart}</div>
                  <div className="stat-label">Items in Cart</div>
                  <div className="stat-delta" style={{ color: '#f5a623' }}>
                    Ready to checkout
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon-wrap" style={{ background: 'rgba(20,180,120,0.08)', border: '1px solid rgba(20,180,120,0.15)' }}>
                    <span style={{ color: '#14b47a' }}>📦</span>
                  </div>
                  <div className="stat-value">{stats.totalOrders}</div>
                  <div className="stat-label">Total Orders</div>
                  <div className="stat-delta" style={{ color: '#14b47a' }}>
                    Placed by you
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon-wrap" style={{ background: 'rgba(124,106,247,0.08)', border: '1px solid rgba(124,106,247,0.15)' }}>
                    <span style={{ color: '#7c6af7' }}>💬</span>
                  </div>
                  <div className="stat-value">{stats.unreadMessages}</div>
                  <div className="stat-label">Unread Messages</div>
                  <div className="stat-delta" style={{ color: '#7c6af7' }}>
                    From farmers
                  </div>
                </div>
              </div>
            )}

            {/* Recent Orders Section */}
            <div className="mt-5">
              <h5 className="text-light mb-3">Recent Orders</h5>
              {recentOrders.length === 0 ? (
                <p className="text-muted">No orders placed yet.</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-dark table-hover">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Crop</th>
                        <th>Farmer</th>
                        <th>Quantity</th>
                        <th>Total</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map((order) => (
                        <tr key={order._id}>
                          <td>#{order._id.slice(-6)}</td>
                          <td>{order.cropId?.name || 'Crop'}</td>
                          <td>{order.farmerId?.name || 'Farmer'}</td>
                          <td>{order.quantity} kg</td>
                          <td>₹{order.totalPrice}</td>
                          <td>
                            <span className={`badge ${order.status === 'pending' ? 'bg-warning' : 'bg-success'}`}>
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}