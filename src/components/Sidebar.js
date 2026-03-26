import { NavLink } from 'react-router-dom';

export default function Sidebar() {
  return (
    <div className="sidebar">
      <div className="p-4 text-center border-bottom">
        <h4 className="mb-0">Buyer Panel</h4>
      </div>
      <NavLink to="/" className="nav-link">🏠 Dashboard</NavLink>
      <NavLink to="/profile" className="nav-link">👤 Profile</NavLink>
      <NavLink to="/crops" className="nav-link">🌱 Browse Crops</NavLink>
      <NavLink to="/cart" className="nav-link">🛒 Cart</NavLink>
      <NavLink to="/orders" className="nav-link">📦 My Orders</NavLink>
      <NavLink to="/chat" className="nav-link">💬 Chat with Farmers</NavLink>
    </div>
  );
}