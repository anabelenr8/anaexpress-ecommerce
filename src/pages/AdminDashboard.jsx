import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductManager from '../components/Admin/ProductManager';
import UserManager from '../components/Admin/UserManager';
import OrderManager from '../components/Admin/OrderManager';
import { useApp } from '../context/AppContext';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('products');
  const { refreshData } = useApp();

  useEffect(() => {
    refreshData(); // Trigger initial data sync
  }, []);


  return (
    <div className="container py-5">
      
      {/* 👇 Here we make the button layout like user dashboard */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0">Dashboard / Products</h2>

        {localStorage.getItem('role') === 'Admin' && (
          <button
            className="btn btn-warning fw-semibold shadow-sm"
            style={{
              padding: '8px 20px',
              fontSize: '0.95rem',
              borderRadius: '8px'
            }}
            onClick={() => navigate('/dashboard')}
          >
            Go to User Dashboard
          </button>
        )}
      </div>

      <div className="btn-group mb-4" role="group">
        <button
          className={`btn btn-outline-primary ${activeTab === "products" ? "active" : ""}`}
          onClick={() => setActiveTab("products")}
        >
          Manage Products
        </button>
        <button
          className={`btn btn-outline-secondary ${activeTab === "users" ? "active" : ""}`}
          onClick={() => setActiveTab("users")}
        >
          Manage Users
        </button>
        <button
          className={`btn btn-outline-success ${activeTab === "orders" ? "active" : ""}`}
          onClick={() => setActiveTab("orders")}
        >
          View Orders
        </button>
      </div>

      {activeTab === "products" && <ProductManager />}
      {activeTab === "users" && <UserManager />}
      {activeTab === "orders" && <OrderManager />}
    </div>
  );
};

export default AdminDashboard;
