import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const token = JSON.parse(userInfo).token;
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('userInfo');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile'),
};

// Products API
export const productsAPI = {
  getProducts: (params = {}) => api.get('/products', { params }),
  getProduct: (id) => api.get(`/products/${id}`),
  getFeaturedProducts: () => api.get('/products/featured/top'),
  createProduct: (productData) => api.post('/products', productData),
  updateProduct: (id, productData) => api.put(`/products/${id}`, productData),
  deleteProduct: (id) => api.delete(`/products/${id}`),
};

// Cart API
export const cartAPI = {
  getCart: () => api.get('/cart'),
  addToCart: (cartData) => api.post('/cart', cartData),
  updateCartItem: (itemId, data) => api.put(`/cart/${itemId}`, data),
  removeFromCart: (itemId) => api.delete(`/cart/${itemId}`),
};

// Orders API
export const ordersAPI = {
  createOrder: (orderData) => api.post('/orders', orderData),
  getOrder: (id) => api.get(`/orders/${id}`),
  getMyOrders: () => api.get('/orders/user/myorders'),
  getAllOrders: () => api.get('/orders'),
  updateOrderToPaid: (id, paymentResult) => api.put(`/orders/${id}/pay`, paymentResult),
};

// Payment API
export const paymentAPI = {
  createOrder: (orderData) => api.post('/payment/create-order', orderData),
  verifyPayment: (paymentData) => api.post('/payment/verify-payment', paymentData),
};

// Health check
export const healthAPI = {
  check: () => api.get('/health'),
};