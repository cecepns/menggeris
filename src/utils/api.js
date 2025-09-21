import axios from 'axios';

// const BASE_URL = 'http://localhost:5000/api';
const BASE_URL = 'https://api-inventory.isavralabel.com/menggeris/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// API Endpoints
export const endpoints = {
  // Auth
  login: '/auth/login',
  
  // Categories
  categories: '/categories',
  createCategory: '/categories',
  updateCategory: (id) => `/categories/${id}`,
  deleteCategory: (id) => `/categories/${id}`,
  
  // Products
  products: '/products',
  createProduct: '/products',
  updateProduct: (id) => `/products/${id}`,
  deleteProduct: (id) => `/products/${id}`,
  productDetail: (id) => `/products/${id}`,
  
  // Settings
  settings: '/settings',
  updateSettings: '/settings',
  
  // Upload
  upload: '/upload',
};

// API Functions
export const authAPI = {
  login: (credentials) => api.post(endpoints.login, credentials),
};

export const categoryAPI = {
  getAll: () => api.get(endpoints.categories),
  create: (data) => api.post(endpoints.createCategory, data),
  update: (id, data) => api.put(endpoints.updateCategory(id), data),
  delete: (id) => api.delete(endpoints.deleteCategory(id)),
};

export const productAPI = {
  getAll: (page = 1, category = '', search = '') => 
    api.get(`${endpoints.products}?page=${page}&category=${category}&search=${search}`),
  getById: (id) => api.get(endpoints.productDetail(id)),
  create: (data) => api.post(endpoints.createProduct, data),
  update: (id, data) => api.put(endpoints.updateProduct(id), data),
  delete: (id) => api.delete(endpoints.deleteProduct(id)),
};

export const settingsAPI = {
  get: () => api.get(endpoints.settings),
  update: (data) => api.put(endpoints.updateSettings, data),
};

export const uploadAPI = {
  upload: (formData) => api.post(endpoints.upload, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
};

export default api;