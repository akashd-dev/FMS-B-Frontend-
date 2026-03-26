import { useState, useEffect, useContext } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { AuthContext } from '../context/AuthContext';

export default function Profile() {
  const { user } = useContext(AuthContext);
  const [message] = useState('Profile management coming soon (extend backend if needed)');

  return (
    <div className="d-flex">
      <Sidebar />
      <div style={{ marginLeft: '260px', width: '100%' }}>
        <Navbar />
        <div className="container mt-4">
          <div className="card p-5" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h3 className="text-success mb-4">👤 Buyer Profile</h3>
            <div className="mb-3">
              <strong>Name:</strong> {user?.name}
            </div>
            <div className="mb-3">
              <strong>Email:</strong> {user?.email}
            </div>
            <div className="mb-3">
              <strong>Phone:</strong> {user?.phone || 'Not provided'}
            </div>
            <div className="mb-3">
              <strong>Location:</strong> {user?.location}
            </div>
            <div className="alert alert-info mt-4">{message}</div>
          </div>
        </div>
      </div>
    </div>
  );
}