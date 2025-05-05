// pages/admin/OrderDetails.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`https://localhost:7234/api/Order/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrder(response.data);
      } catch (error) {
        console.error('Error fetching order:', error);
      }
    };
    fetchOrder();
  }, [id]);

  if (!order) return <p>Loading...</p>;

  return (
    <div className="container py-4">
      <h2>Order #{order.id}</h2>
      <p><strong>Status:</strong> {order.status}</p>
      <p><strong>Shipping:</strong> {order.shippingAddress}</p>
      <p><strong>Billing:</strong> {order.billingAddress}</p>
      <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
      <p><strong>Total:</strong> ${order.totalAmount.toFixed(2)}</p>

      <h4>Items</h4>
      <ul className="list-group">
        {order.items.map((item, index) => (
          <li key={index} className="list-group-item">
            Product ID: {item.productId} | Qty: {item.quantity} | Price: ${item.price}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrderDetails;
