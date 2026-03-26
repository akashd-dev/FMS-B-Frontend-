import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark">
      <div className="container-fluid">
        <span className="navbar-brand fw-bold fs-4">🌾 AgriManage - Buyer</span>
        <div className="d-flex align-items-center gap-3">
          <span className="text-white">Welcome, {user?.name}</span>
          <button className="btn btn-light btn-sm" onClick={logout}>Logout</button>
        </div>
      </div>
    </nav>
  );
}