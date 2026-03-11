import client from './client'

export const getBreadProducts = () => client.get('/bread-products/')

export const getBreadProduct = (id) => client.get(`/bread-products/${id}`)
