import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaSignOutAlt, FaLock, FaBox, FaAddressCard, FaCreditCard, FaHeadset, FaUser } from 'react-icons/fa';

const Account = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const features = [
    { title: 'Your Profile', icon: <FaUser />, desc: 'Update your profile info.', path: '/account/profile' },
    { title: 'Your Orders', icon: <FaBox />, desc: 'Track, return or cancel an order.', path: '/orders' },
    { title: 'Login & Security', icon: <FaLock />, desc: 'Update your email or password.', path: '/account/security' },
    { title: 'Your Addresses', icon: <FaAddressCard />, desc: 'Manage your delivery addresses.', path: '/account/addresses' },
    { title: 'Your Payments', icon: <FaCreditCard />, desc: 'Manage your saved cards or accounts.', path: '/account/payments' },
    { title: 'Customer Support', icon: <FaHeadset />, desc: 'Get help with your orders and account.', path: '/support' },
  ];

  const handleCardClick = (path) => {
    navigate(path);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Your Account</h2>

      <div style={styles.grid}>
        {features.map((item, index) => (
          <div 
            key={index} 
            style={{ ...styles.card, cursor: 'pointer' }} 
            onClick={() => handleCardClick(item.path)}
          >
            <div style={styles.icon}>{item.icon}</div>
            <h3 style={styles.cardTitle}>{item.title}</h3>
            <p style={styles.cardDesc}>{item.desc}</p>
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <button onClick={handleLogout} style={styles.logoutBtn}>
          <FaSignOutAlt style={{ marginRight: '8px' }} /> Logout
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '3rem 2rem',
    maxWidth: '1100px',
    margin: '0 auto',
  },
  heading: {
    textAlign: 'center',
    fontSize: '2rem',
    marginBottom: '2rem',
    fontWeight: '600',
    color: '#222',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '1.5rem',
  },
  card: {
    backgroundColor: '#fff',
    border: '1px solid #eee',
    borderRadius: '10px',
    padding: '1.5rem',
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
    textAlign: 'center',
    transition: 'transform 0.2s ease',
  },
  icon: {
    fontSize: '1.8rem',
    marginBottom: '1rem',
    color: '#007bff',
  },
  cardTitle: {
    fontSize: '1.2rem',
    fontWeight: '600',
    marginBottom: '0.5rem',
  },
  cardDesc: {
    fontSize: '0.95rem',
    color: '#555',
  },
  logoutBtn: {
    backgroundColor: '#dc3545',
    color: '#fff',
    padding: '0.75rem 1.5rem',
    border: 'none',
    borderRadius: '6px',
    fontSize: '1rem',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
  },
};

export default Account;
