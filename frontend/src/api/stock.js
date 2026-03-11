import client from './client'

export const getAvailableStock = () => client.get('/stock/available')

export const createStock = (data) => client.post('/stock/', data)

export const updateStock = (breadProductId, data) =>
  client.put(`/stock/${breadProductId}`, data)
