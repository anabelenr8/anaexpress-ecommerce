import React from 'react';
import { NavLink } from 'react-router-dom';
import '../../styles/Navbar.css';
import { useAddress } from '../../context/AddressContext';

const Navbar = () => {
  const { shippingAddress } = useAddress();
  const role = localStorage.getItem('role');
  const userEmail = localStorage.getItem('email');
  const dashboardPath = role === 'Admin' ? '/admin' : '/dashboard';


  return (
    <nav className="navbar">
      <div className="navbar-left">
        🚀 <span className="brand-name">AnaExpress</span>
      </div>

      <div className="navbar-center">
        <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Home</NavLink>
        
        <NavLink to={dashboardPath} className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
          {role === 'Admin' ? 'Admin Panel' : 'Dashboard'}
        </NavLink>

        {/* Only show to non-admin users */}
        {role !== 'Admin' && (
          <>
            <NavLink to="/cart" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Cart</NavLink>
            <NavLink to="/orders" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>My Orders</NavLink>
          </>
        )}

        <NavLink to="/account" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Account</NavLink>
      </div>

      <div className="navbar-right">
        <div className="delivery-info">
          Deliver to <strong>{userEmail?.split('@')[0]}</strong>:{" "}
          {shippingAddress.includes(',') ? shippingAddress.split(', ').slice(2, 4).join(', ') : shippingAddress}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
