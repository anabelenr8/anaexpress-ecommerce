// pages/PaymentsPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useApp } from '../context/AppContext';

const PaymentsPage = () => {
  const [methods, setMethods] = useState([]);
  const [form, setForm] = useState({
    cardHolderName: '',
    last4Digits: '',
    expirationDate: '',
    cardType: ''
  });

  const { dataVersion, refreshData } = useApp();

  useEffect(() => {
    const fetchMethods = async () => {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://localhost:7234/api/PaymentMethod', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMethods(response.data);
    };
    fetchMethods();
  }, [dataVersion]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    await axios.post("https://localhost:7234/api/PaymentMethod", form, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setForm({
      cardHolderName: '',
      last4Digits: '',
      expirationDate: '',
      cardType: ''
    });

    alert("Payment method added!");
    refreshData();
  };

  const handleSetDefault = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(`https://localhost:7234/api/PaymentMethod/default/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Default payment method updated!');
      refreshData();
    } catch (err) {
      console.error('Error setting default payment method:', err);
      alert('Failed to set default payment method.');
    }
  };

  return (
    <div className="container py-5">
      <h2 className="fw-bold mb-4">Your Saved Payment Methods</h2>

      {methods.map((method) => (
        <div key={method.id} className="card p-3 mb-3">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h5 className="mb-1">
                {method.cardType} ending in {method.last4Digits}
              </h5>
              <p className="mb-1">Expires: {method.expirationDate}</p>
              <p className="mb-0">Card Holder: {method.cardHolderName}</p>
            </div>
            <div className="text-end">
              {method.isDefault ? (
                <span className="badge bg-success">Default</span>
              ) : (
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => handleSetDefault(method.id)}
                >
                  Set as Default
                </button>
              )}
            </div>
          </div>
        </div>
      ))}

      <hr />
      <h4>Add New Payment Method</h4>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Card Holder Name"
          className="form-control mb-2"
          value={form.cardHolderName}
          onChange={(e) => setForm({ ...form, cardHolderName: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Last 4 Digits"
          maxLength="4"
          className="form-control mb-2"
          value={form.last4Digits}
          onChange={(e) => setForm({ ...form, last4Digits: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Expiration Date (MM/YY)"
          className="form-control mb-2"
          value={form.expirationDate}
          onChange={(e) => setForm({ ...form, expirationDate: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Card Type (Visa, Mastercard)"
          className="form-control mb-2"
          value={form.cardType}
          onChange={(e) => setForm({ ...form, cardType: e.target.value })}
          required
        />
        <button className="btn btn-primary w-100" type="submit">
          Save Card
        </button>
      </form>
    </div>
  );
};

export default PaymentsPage;
