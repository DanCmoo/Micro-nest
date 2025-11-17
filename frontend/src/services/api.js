import axios from 'axios';

const API_BASE_URL = 'http://localhost:4000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Products API
export const productService = {
  getAllProducts: () => api.get('/products'),
  getProduct: (id) => api.get(`/products/${id}`),
  createProduct: (product) => api.post('/products', product),
  updateProduct: (id, product) => api.put(`/products/${id}`, product),
  deleteProduct: (id) => api.delete(`/products/${id}`),
  decrementStock: (id, quantity) => api.post(`/products/${id}/decrement-stock`, { quantity }),
};

// Cart API
export const cartService = {
  getCart: (userId) => api.get(`/cart/${userId}`),
  addToCart: (userId, productId, quantity) => 
    api.post('/cart/add', { userId, productId, quantity }),
  removeFromCart: (userId, cartItemId) => 
    api.delete(`/cart/${userId}/item/${cartItemId}`),
  clearCart: (userId) => api.delete(`/cart/${userId}`),
  getAllCarts: () => api.get('/cart'),
};

export default api;
