import client from './client'

export const authAPI = {
  register: (data) => client.post('/auth/register', data),
  login: (data) => client.post('/auth/login', data),
  getProfile: () => client.get('/auth/profile'),
  updateProfile: (data) => client.put('/auth/profile', data),
}

export const restaurantAPI = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v !== undefined && v !== '' && v !== 'All')
    ).toString()
    return client.get(`/restaurants${query ? `?${query}` : ''}`)
  },
  getById: (id) => client.get(`/restaurants/${id}`),
  getFoods: (id) => client.get(`/restaurants/${id}/foods`),
  getCuisines: () => client.get('/cuisines'),
  getFoodsAll: (params = {}) => {
    const query = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v !== undefined && v !== '')
    ).toString()
    return client.get(`/foods${query ? `?${query}` : ''}`)
  },
  getFoodById: (id) => client.get(`/foods/${id}`),
}

export const couponAPI = {
  getAll: () => client.get('/coupons'),
  validate: (code, subtotal) => client.post('/coupons/validate', { code, subtotal }),
}

export const cartAPI = {
  get: () => client.get('/cart'),
  add: (data) => client.post('/cart', data),
  updateItem: (itemId, data) => client.put(`/cart/items/${itemId}`, data),
  removeItem: (itemId) => client.delete(`/cart/items/${itemId}`),
  clear: () => client.delete('/cart'),
  applyCoupon: (code) => client.post('/cart/coupon', { code }),
  removeCoupon: () => client.delete('/cart/coupon'),
}

export const orderAPI = {
  create: (data) => client.post('/orders', data),
  getMyOrders: () => client.get('/orders'),
  getById: (id) => client.get(`/orders/${id}`),
  getByOrderId: (orderId) => client.get(`/orders/orderId/${orderId}`),
  track: (orderId) => client.get(`/orders/track/${orderId}`),
  cancel: (id) => client.delete(`/orders/${id}`),
}

export const aiAPI = {
  chat: (message, history = []) => client.post('/ai/chat', { message, history }),
}

export const adminAPI = {
  dashboard: () => client.get('/admin/dashboard'),
  orders: (params = {}) => client.get(`/admin/orders?${new URLSearchParams(params).toString()}`),
  updateOrderStatus: (id, status) => client.put(`/admin/orders/${id}/status`, { status }),
  customers: () => client.get('/admin/customers'),
  createRestaurant: (data) => client.post('/admin/restaurants', data),
  updateRestaurant: (id, data) => client.put(`/admin/restaurants/${id}`, data),
  deleteRestaurant: (id) => client.delete(`/admin/restaurants/${id}`),
  createFood: (data) => client.post('/admin/foods', data),
  updateFood: (id, data) => client.put(`/admin/foods/${id}`, data),
  deleteFood: (id) => client.delete(`/admin/foods/${id}`),
}
