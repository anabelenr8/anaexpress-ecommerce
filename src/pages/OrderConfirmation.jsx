import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  if (!state) {
    // No state => user came here manually
    navigate('/');
    return null;
  }

  const { orderId, amount, paymentMethod } = state;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🎉 Thank You for Your Purchase!</h1>
      <p style={styles.info}>Order ID: <strong>{orderId}</strong></p>
      <p style={styles.info}>Amount Paid: <strong>${amount.toFixed(2)}</strong></p>
      <p style={styles.info}>Payment Method: <strong>{paymentMethod}</strong></p>
      <button style={styles.button} onClick={() => navigate('/')}>
        Go Back to Home
      </button>
    </div>
  );
};

const styles = {
  container: { padding: '40px', textAlign: 'center' },
  title: { fontSize: '2.5rem', marginBottom: '20px' },
  info: { fontSize: '1.2rem', margin: '10px 0' },
  button: {
    marginTop: '30px',
    padding: '10px 20px',
    backgroundColor: '#28a745',
    color: 'white',
    fontSize: '16px',
    borderRadius: '5px',
    border: 'none',
    cursor: 'pointer',
  },
};

export default OrderConfirmation;
