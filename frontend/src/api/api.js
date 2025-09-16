import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

console.log('🔗 API Configuration loaded - Base URL:', API_URL);

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  withCredentials: true, // Enable CORS credentials
});

// Request interceptor to add token and logging
api.interceptors.request.use(
  (config) => {
    console.log('📤 API Request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      fullURL: `${config.baseURL}${config.url}`,
      params: config.params,
      data: config.data
    });

    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      try {
        const { token } = JSON.parse(userInfo);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error('❌ Error parsing userInfo:', error);
        localStorage.removeItem('userInfo');
      }
    }
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling and logging
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', {
      status: response.status,
      url: response.config.url,
      method: response.config.method?.toUpperCase(),
      success: response.data?.success,
      dataType: typeof response.data,
      hasData: !!response.data?.data
    });
    return response;
  },
  (error) => {
    console.error('❌ API Error Details:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      method: error.config?.method?.toUpperCase(),
      responseData: error.response?.data
    });

    if (error.response?.status === 401) {
      console.log('🔐 Unauthorized - clearing user info and redirecting to login');
      localStorage.removeItem('userInfo');
      window.location.href = '/login';
    }

    // Network error handling
    if (!error.response && error.request) {
      console.error('🌐 Network Error - Backend server might be down');
      console.error('Check if backend is running on:', API_URL.replace('/api', ''));
    }

    return Promise.reject(error);
  }
);

export default api;

// Auth API
export const authAPI = {
  login: (credentials) => {
    console.log('🔐 authAPI.login called for:', credentials.email);
    return api.post('/auth/login', credentials);
  },
  register: (userData) => {
    console.log('📝 authAPI.register called for:', userData.email);
    return api.post('/auth/register', userData);
  },
  getProfile: () => {
    console.log('👤 authAPI.getProfile called');
    return api.get('/auth/profile');
  }
};

// Products API
export const productsAPI = {
  getProducts: (params = {}) => {
    console.log('📦 productsAPI.getProducts called with params:', params);
    return api.get('/products', { params });
  },
  getProduct: (id) => {
    console.log('🔍 productsAPI.getProduct called for ID:', id);
    if (!id) {
      console.error('❌ getProduct called with empty ID');
      return Promise.reject(new Error('Product ID is required'));
    }
    return api.get(`/products/${id}`);
  },
  getFeaturedProducts: () => {
    console.log('⭐ productsAPI.getFeaturedProducts called');
    return api.get('/products/featured/top');
  },
  createProduct: (productData) => {
    console.log('➕ productsAPI.createProduct called');
    return api.post('/products', productData);
  },
  updateProduct: (id, productData) => {
    console.log('✏️ productsAPI.updateProduct called for ID:', id);
    return api.put(`/products/${id}`, productData);
  },
  deleteProduct: (id) => {
    console.log('🗑️ productsAPI.deleteProduct called for ID:', id);
    return api.delete(`/products/${id}`);
  }
};

// Cart API
export const cartAPI = {
  getCart: () => {
    console.log('🛒 cartAPI.getCart called');
    return api.get('/cart');
  },
  addToCart: (cartData) => {
    console.log('➕ cartAPI.addToCart called');
    return api.post('/cart', cartData);
  },
  updateCartItem: (itemId, data) => {
    console.log('✏️ cartAPI.updateCartItem called for item:', itemId);
    return api.put(`/cart/${itemId}`, data);
  },
  removeFromCart: (itemId) => {
    console.log('🗑️ cartAPI.removeFromCart called for item:', itemId);
    return api.delete(`/cart/${itemId}`);
  }
};

// Orders API
export const ordersAPI = {
  createOrder: (orderData) => {
    console.log('📋 ordersAPI.createOrder called with items:', orderData.orderItems?.length);
    return api.post('/orders', orderData);
  },
  getOrder: (id) => {
    console.log('📋 ordersAPI.getOrder called for ID:', id);
    return api.get(`/orders/${id}`);
  },
  getMyOrders: () => {
    console.log('📋 ordersAPI.getMyOrders called');
    return api.get('/orders/user/myorders');
  },
  getAllOrders: () => {
    console.log('📋 ordersAPI.getAllOrders called (admin)');
    return api.get('/orders');
  },
  updateOrderToPaid: (id, paymentResult) => {
    console.log('💳 ordersAPI.updateOrderToPaid called for order:', id);
    return api.put(`/orders/${id}/pay`, paymentResult);
  }
};

// Payment API
export const paymentAPI = {
  createOrder: (orderData) => {
    console.log('💳 paymentAPI.createOrder called');
    return api.post('/payment/create-order', orderData);
  },
  verifyPayment: (paymentData) => {
    console.log('✅ paymentAPI.verifyPayment called');
    return api.post('/payment/verify-payment', paymentData);
  }
};

// Health check
export const healthAPI = {
  check: () => {
    console.log('❤️ healthAPI.check called');
    return api.get('/health');
  }
};

// Debug helper function
export const debugAPI = {
  testConnection: async () => {
    console.log('🔧 Testing API connection...');
    try {
      const health = await healthAPI.check();
      console.log('✅ Backend connection successful:', health.data);
      return { success: true, data: health.data };
    } catch (error) {
      console.error('❌ Backend connection failed:', error);
      return { success: false, error: error.message };
    }
  },
  
  testProducts: async () => {
    console.log('🔧 Testing products API...');
    try {
      const products = await productsAPI.getProducts();
      console.log('✅ Products API successful:', products.data);
      return { success: true, data: products.data };
    } catch (error) {
      console.error('❌ Products API failed:', error);
      return { success: false, error: error.message };
    }
  },
  
  testSingleProduct: async (id = '1') => {
    console.log('🔧 Testing single product API for ID:', id);
    try {
      const product = await productsAPI.getProduct(id);
      console.log('✅ Single product API successful:', product.data);
      return { success: true, data: product.data };
    } catch (error) {
      console.error('❌ Single product API failed:', error);
      return { success: false, error: error.message };
    }
  }
};
