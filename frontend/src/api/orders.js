import client from './client'

export const placeGuestOrder = (data) => client.post('/orders/guest', data)

export const getOrder = (id) => client.get(`/orders/${id}`)

export const getUserOrders = (userId) => client.get(`/orders/user/${userId}`)

export const getAllOrders = (status) =>
  client.get('/orders/', { params: status ? { status } : {} })

export const updateOrderStatus = (id, data) =>
  client.put(`/orders/${id}/status`, data)

export const cancelOrder = (id, phone) =>
  client.post(`/orders/${id}/cancel`, { phone })
