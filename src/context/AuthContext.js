import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/auth/profile', { withCredentials: true });
      if (res.data.success) setUser(res.data.user);
    } catch (err) {
      console.log("Not logged in");
    }
    setLoading(false);
  };

  const logout = async () => {
    await axios.post('http://localhost:5000/api/auth/logout', {}, { withCredentials: true });
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};