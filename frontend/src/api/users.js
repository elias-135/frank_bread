import client from './client'

export const getUserByPhone = (phone) =>
  client.get('/users/by-phone', { params: { phone } })
