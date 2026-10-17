// src/api/axios.js
import axios from 'axios';

// Ek instance banaya backend URL ke sath
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials:true // Yahan apne backend ka actual path/port rakhein
});

// Ye interceptor automatic har request ke sath token bhejne ka kaam karega
api.interceptors.request.use((config) => {
  // Local storage se token nikal rahe hain
  const token = localStorage.getItem('token'); 
  
  if (token) {
    // Agar token mila, toh usko headers me daal do
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;