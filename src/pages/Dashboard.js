import { useContext } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { AuthContext } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useContext(AuthContext);

  return (
    <div className="d-flex">
      <Sidebar />
      <div style={{ marginLeft: '260px', width: '100%' }}>
        <Navbar />
        <div className="container mt-4">
          <h2 className="fade-in">Welcome, {user?.name} 👋</h2>
          <p className="text-muted">Find fresh crops from local farmers and manage your purchases.</p>

          <div className="row mt-4 g-4">
            <div className="col-md-4">
              <div className="card p-4 text-center">
                <h5>🌱 Available Crops</h5>
                <h3 className="text-success">248</h3>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card p-4 text-center">
                <h5>🛒 Items in Cart</h5>
                <h3 className="text-warning">3</h3>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card p-4 text-center">
                <h5>📦 Total Orders</h5>
                <h3 className="text-success">12</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}