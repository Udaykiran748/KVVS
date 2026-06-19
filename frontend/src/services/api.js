import axios from 'axios';

// Create central Axios instance (handled via proxy in vite.config.js during dev)
const API = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request Interceptor: Attach JWT Token automatically if stored
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('quantum_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Global 401 session expiry handles
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn('Session expired. Logging out.');
      localStorage.removeItem('quantum_token');
      localStorage.removeItem('quantum_user');
    }
    return Promise.reject(error);
  }
);

// --- REST API Endpoint Integrations ---

export const authAPI = {
  signup: (userData) => API.post('/auth/register', userData),
  login: (credentials) => API.post('/auth/login', credentials),
  forgotPassword: (data) => API.post('/auth/forgot-password', data),
  adminLogin: (credentials) => API.post('/auth/admin/login', credentials),
  adminForgotPassword: (data) => API.post('/auth/admin/forgot-password', data),
  getMe: () => API.get('/auth/me')
};

export const productsAPI = {
  getAll: () => API.get('/products'),
  getById: (id) => API.get(`/products/${id}`),
  create: (formData) => API.post('/products', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id, formData) => API.put(`/products/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete: (id) => API.delete(`/products/${id}`)
};

export const eventAPI = {
  getActive: () => API.get('/events'),
  update: (id, data) => API.put(`/events/${id}`, data)
};

export const bookingsAPI = {
  initiate: (bookingData) => API.post('/payments/initiate', bookingData),
  verify: (paymentDetails) => API.post('/payments/verify', paymentDetails),
  getHistory: () => API.get('/bookings/history'),
  search: (query) => API.post('/bookings/search', { query })
};

export const adminAPI = {
  // Dashboard
  getAnalytics: () => API.get('/admin/analytics'),
  getRegistrations: () => API.get('/admin/booking-generators'),
  validatePass: (passId) => API.post('/admin/validate-pass', { pass_id: passId }),

  // Users
  getAllUsers: () => API.get('/admin/users'),
  updateUser: (id, data) => API.put(`/admin/users/${id}`, data),
  deleteUser: (id) => API.delete(`/admin/users/${id}`),

  // Payments
  getAllPayments: () => API.get('/admin/payments'),
  updatePaymentStatus: (id, data) => API.put(`/admin/payments/${id}/status`, data),

  // Registrations
  cancelRegistration: (id) => API.put(`/admin/booking-generators/${id}/cancel`),
  updateRegistration: (id, data) => API.put(`/admin/booking-generators/${id}`, data),

  // Products (admin-scoped)
  getAllProducts: () => API.get('/admin/products'),
  createProduct: (formData) => API.post('/admin/products', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  updateProduct: (id, formData) => API.put(`/admin/products/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  deleteProduct: (id) => API.delete(`/admin/products/${id}`)
};

export default API;
