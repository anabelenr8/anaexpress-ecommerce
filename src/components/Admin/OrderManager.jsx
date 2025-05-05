import React, { useEffect, useState } from 'react';
import { getOrders, updateOrder } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import ActionButton from '../common/ActionButton';
import TableWrapper from '../common/TableWrapper';
import { useApp } from '../../context/AppContext'; 

const OrderManager = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  const { refreshData, dataVersion } = useApp();

  useEffect(() => {
    fetchOrders();
  }, [dataVersion]);

  const fetchOrders = () => {
    getOrders()
      .then(res => setOrders(res.data))
      .catch((err) => {
        console.error('Failed to fetch orders:', err);
        alert('Failed to fetch orders.');
      });
  };

  const handleMarkComplete = (order) => {
    const updatedOrder = { ...order, status: 'Completed' };
    updateOrder(order.id, updatedOrder)
      .then(() => {
        alert('Order marked as completed');
        refreshData();
      })
      .catch(() => alert('Failed to update order.'));
  };

  const handleArchive = (order) => {
    console.log(`Archived order ${order.id}`);
    alert('Order archived (mock)');
  };

  return (
    <TableWrapper
      title="Manage Orders"
      headers={['Order ID', 'User', 'Status', 'Actions']}
    >
      {orders.map(order => (
        <tr key={order.id}>
          <td>{order.id}</td>
          <td>{order.userId}</td>
          <td>{order.status || 'Pending'}</td>
          <td className="text-end">
            <ActionButton
              variant="info"
              className="me-2"
              onClick={() => navigate(`/admin/orders/${order.id}`)}
            >
              View Details
            </ActionButton>
            {order.status !== 'Completed' ? (
              <ActionButton
                variant="success"
                onClick={() => handleMarkComplete(order)}
              >
                Mark as Completed
              </ActionButton>
            ) : (
              <ActionButton
                variant="secondary"
                onClick={() => handleArchive(order)}
              >
                Archive
              </ActionButton>
            )}
          </td>
        </tr>
      ))}
    </TableWrapper>
  );
}
  

export default OrderManager;

