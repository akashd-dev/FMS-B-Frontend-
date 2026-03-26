import { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    location: '',
    role: 'buyer'
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', form);

      if (res.data.success) {
        setMessage(res.data.message || 'Registration successful! Redirecting to login...');
        setForm({ name: '', email: '', phone: '', password: '', location: '', role: 'buyer' });
        
        setTimeout(() => {
          window.location.href = '/login';
        }, 1800);
      }
    } catch (err) {
      console.error("Registration Error Details:", err);   // Check browser console (F12)

      if (err.code === 'ERR_NETWORK') {
        setError("❌ Network Error: Backend server is not running. Please start the backend first.");
      } else {
        setError(err.response?.data?.message || "Registration failed. Please check console (F12) for details.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
      <div className="card p-5 shadow" style={{ maxWidth: '480px', width: '100%' }}>
        <h2 className="text-center text-success mb-4">🛍️ Buyer Registration</h2>

        {message && <div className="alert alert-success text-center">{message}</div>}
        {error && <div className="alert alert-danger text-center">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Full Name</label>
            <input type="text" name="name" className="form-control" value={form.name} onChange={handleChange} required />
          </div>

          <div className="mb-3">
            <label className="form-label">Email Address</label>
            <input type="email" name="email" className="form-control" value={form.email} onChange={handleChange} required />
          </div>

          <div className="mb-3">
            <label className="form-label">Phone Number</label>
            <input type="tel" name="phone" className="form-control" value={form.phone} onChange={handleChange} required />
          </div>

          <div className="mb-3">
            <label className="form-label">Location (City)</label>
            <input type="text" name="location" className="form-control" value={form.location} onChange={handleChange} required />
          </div>

          <div className="mb-4">
            <label className="form-label">Password</label>
            <input type="password" name="password" className="form-control" value={form.password} onChange={handleChange} required />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary w-100 py-3 mb-3"
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register as Buyer'}
          </button>

          <div className="text-center">
            Already have an account?{' '}
            <Link to="/login" className="text-success fw-bold">Login here</Link>
          </div>
        </form>
      </div>
    </div>
  );
}