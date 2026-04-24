import api from './api'

export type UserPayload = {
  name?: string
  email?: string
  password?: string
  role?: 'admin' | 'quality_manager' | 'it_referent' | 'employee'
  department?: string
}

export async function listUsers() {
  const { data } = await api.get('/users')
  return data.data
}

export async function createUser(payload: UserPayload) {
  const { data } = await api.post('/users', payload)
  return data.data
}

export async function updateUser(id: number | string, payload: UserPayload) {
  const { data } = await api.put(`/users/${id}`, payload)
  return data.data
}

export async function deleteUser(id: number | string) {
  const { data } = await api.delete(`/users/${id}`)
  return data
}