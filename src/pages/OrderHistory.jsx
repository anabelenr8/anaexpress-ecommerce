import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { dataVersion } = useApp();

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/');
        return;
      }

      try {
        const response = await axios.get('https://localhost:7234/api/Order/user', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(response.data);
      } catch (err) {
        console.error('Failed to fetch orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate, dataVersion]);

  if (loading) {
    return <p className="text-center mt-5">Loading your orders...</p>;
  }

  return (
    <div className="container py-5">
      <h2 className="fw-bold mb-4"> Your Order History</h2>

      {orders.length === 0 ? (
        <p className="text-muted text-center">You have no orders yet.</p>
      ) : (
        <div className="list-group">
          {orders.map(order => (
            <div key={order.id} className="list-group-item list-group-item-action mb-3 shadow-sm">
              <h5 className="mb-1">Order #{order.id}</h5>
              <p className="mb-1"><strong>Status:</strong> {order.status}</p>
              <p className="mb-1"><strong>Order Date:</strong> {new Date(order.orderDate).toLocaleDateString()}</p>
              <p className="mb-1"><strong>Total Amount:</strong> ${order.totalAmount.toFixed(2)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
