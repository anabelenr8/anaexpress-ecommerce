import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AddressContext = createContext();

export const AddressProvider = ({ children }) => {
  const [shippingAddress, setShippingAddress] = useState('Your Address');

  const fetchDefaultAddress = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await axios.get('https://localhost:7234/api/Address/default', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const address = response.data;
      const formattedAddress = `${address.street}, ${address.city}, ${address.state}, ${address.postalCode}, ${address.country}`;
      setShippingAddress(formattedAddress);
      localStorage.setItem('shippingAddress', formattedAddress);
    } catch (error) {
      console.error('Error fetching default address:', error);
    }
  };

  useEffect(() => {
    const fetchDefaultAddress = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const response = await axios.get('/api/Address/default', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const address = response.data;
        const formattedAddress = `${address.street}, ${address.city}, ${address.state}, ${address.postalCode}, ${address.country}`;
        setShippingAddress(formattedAddress);
        localStorage.setItem('shippingAddress', formattedAddress);
      } catch (error) {
        console.error('Error fetching default address:', error);
      }
    };

    fetchDefaultAddress();
  }, []);

  return (
    <AddressContext.Provider value={{ shippingAddress, setShippingAddress, fetchDefaultAddress }}>
      {children}
    </AddressContext.Provider>
  );
};

export const useAddress = () => useContext(AddressContext);
