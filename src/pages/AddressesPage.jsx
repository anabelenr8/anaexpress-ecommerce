import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useApp } from '../context/AppContext'; 

// Scoped axios instance with interceptor
const axiosInstance = axios.create({
  baseURL: 'https://localhost:7234/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const AddressPage = () => {
  const [addresses, setAddresses] = useState([]);
  const [form, setForm] = useState({
    fullName: '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    isDefault: false
  });

  const { dataVersion, refreshData } = useApp();

  useEffect(() => {
    fetchAddresses();
  }, [dataVersion]);

  const fetchAddresses = async () => {
    try {
      const response = await axiosInstance.get('/Address');
      const data = response.data;
      if (Array.isArray(data)) {
        setAddresses(data);
      } else {
        console.warn("Unexpected response:", data);
        setAddresses([]);
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
      setAddresses([]);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prevForm => ({
      ...prevForm,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post('/Address', form);

      if (form.isDefault) {
        const defaultRes = await axiosInstance.get('/Address/default');
        localStorage.setItem('shippingAddress', defaultRes.data.street);
      }
      refreshData();

      setForm({
        fullName: '',
        street: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
        isDefault: false
      });
      refreshData();
    } catch (error) {
      console.error('Error adding address:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/Address/${id}`);
      refreshData();
    } catch (error) {
      console.error('Error deleting address:', error);
    }
  };

  const handleSetDefault = async (id) => {
    try {
      await axiosInstance.post(`/Address/default/${id}`);

      const res = await axiosInstance.get('/Address/default');
      localStorage.setItem('shippingAddress', res.data.street);
      refreshData();

      alert('✅ Default address updated!');
    } catch (error) {
      console.error('Error setting default address:', error);
      alert('❌ Failed to set default address.');
    }
  };

  return (
    <div className="container py-5">
      <h2 className="fw-bold mb-4">Your Addresses</h2>

      <form onSubmit={handleSubmit} className="mb-4">
        {['fullName', 'street', 'city', 'state', 'postalCode', 'country'].map(field => (
          <div className="mb-3" key={field}>
            <label className="form-label">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
            <input
              type="text"
              className="form-control"
              name={field}
              value={form[field]}
              onChange={handleChange}
              required
            />
          </div>
        ))}
        <div className="form-check mb-3">
          <input
            className="form-check-input"
            type="checkbox"
            name="isDefault"
            checked={form.isDefault}
            onChange={handleChange}
          />
          <label className="form-check-label">Set as default address</label>
        </div>
        <button type="submit" className="btn btn-primary">Add Address</button>
      </form>

      {addresses.length === 0 ? (
        <p className="text-muted">No addresses found.</p>
      ) : (
        <div className="list-group">
          {addresses.map(address => (
            <div key={address.id} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <strong>{address.fullName}</strong><br />
                {address.street}, {address.city}, {address.state}, {address.postalCode}, {address.country}<br />
                {address.isDefault && <span className="badge bg-success me-2">Default</span>}
              </div>
              <div>
                {!address.isDefault && (
                  <button onClick={() => handleSetDefault(address.id)} className="btn btn-sm btn-outline-success me-2">
                    Set as Default
                  </button>
                )}
                <button onClick={() => handleDelete(address.id)} className="btn btn-sm btn-outline-danger">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddressPage;

