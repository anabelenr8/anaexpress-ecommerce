import React, { createContext, useContext, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Handles initial login from localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const role = decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
        const displayName = decoded['displayName'];
        const username = decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'];
        setUser({ token, role, email: decoded.sub, username, name: displayName });

        // Set logout timer on app refresh
        const exp = decoded.exp * 1000;
        const now = Date.now();
        const timeLeft = exp - now;
        if (timeLeft > 0) {
          setTimeout(() => logout(), timeLeft);
        } else {
          logout(); // Token already expired
        }

      } catch (error) {
        console.error('Invalid token:', error);
        localStorage.removeItem('token');
      }
    }
  }, []);

  const login = (token) => {
    const decoded = jwtDecode(token);
    const role = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
    const username = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
    const displayName = decoded['displayName'];
    const email = decoded.sub;

    // Schedule logout based on token expiry
    const exp = decoded.exp * 1000;
    const now = Date.now();
    const timeLeft = exp - now;
    if (timeLeft > 0) {
      setTimeout(() => logout(), timeLeft);
    }

    setUser({
      token,
      username,
      email,
      name: displayName,
      role: role
    });
  };

  
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('shippingAddress');
    localStorage.removeItem('cart');
    localStorage.removeItem('role');
    // remove anything else you persist
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
