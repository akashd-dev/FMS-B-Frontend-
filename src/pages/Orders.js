import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

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

  return (
    <div className="d-flex">
      <Sidebar />
      <div style={{ marginLeft: '260px', width: '100%' }}>
        <Navbar />
        <div className="container mt-4">
          <h3 className="mb-4">📦 My Order History</h3>

          {loading ? <p>Loading...</p> : orders.length === 0 ? (
            <div className="alert alert-info">No orders placed yet.</div>
          ) : (
            orders.map((order) => (
              <div className="card mb-3 p-4" key={order._id}>
                <div className="d-flex justify-content-between">
                  <div>
                    <h5>{order.cropId?.name}</h5>
                    <p>Farmer: {order.farmerId?.name}</p>
                    <p>Quantity: {order.quantity} kg</p>
                  </div>
                  <div className="text-end">
                    <div className={`badge ${order.status === 'pending' ? 'bg-warning' : 'bg-success'}`}>
                      {order.status.toUpperCase()}
                    </div>
                    <p className="mt-2 mb-0 text-success">₹{order.totalPrice}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}