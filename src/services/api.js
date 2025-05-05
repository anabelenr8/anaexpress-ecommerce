// src/services/api.js
import axios from 'axios';

// const axiosInstance = axios.create({
//   baseURL: '/api',
//   headers: {
//     'Content-Type': 'application/json'
//   }
// });

const axiosInstance = axios.create({
  baseURL: 'https://localhost:7234/api',
  headers: {
    'Content-Type': 'application/json'
  }
});



// Add token dynamically to every request 🔐
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  console.log('🔑 Token used in request:', token);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// === API exports ===

export const getProducts = () => axiosInstance.get('/Product');
export const createProduct = (product) => axiosInstance.post('/Product', product);
export const updateProduct = (id, product) => axiosInstance.put(`/Product/${id}`, product);
export const deleteProduct = (id) => axiosInstance.delete(`/Product/${id}`);

export const getUsers = () => axiosInstance.get('/User');
export const deleteUser = (id) => axiosInstance.delete(`/User/${id}`);

export const getOrders = () => axiosInstance.get('/Order');
export const getOrderById = (id) => axiosInstance.get(`/Order/${id}`);
export const updateOrder = (id, data) => axiosInstance.put(`/Order/${id}`, data);

export const updateUserRole = (userId, newRole) => {
  const token = localStorage.getItem('token');
  return axios.put(
    `https://localhost:7234/api/User/${userId}/role`,
    JSON.stringify(newRole), // this becomes: "admin"
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );
};




