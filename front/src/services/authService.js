import api from './api'

export async function login(email, password) {
  const { data } = await api.post('/login', { email, password })
  localStorage.setItem('auth_token', data.token)
  return data
}

export async function logout() {
  const { data } = await api.post('/logout')
  localStorage.removeItem('auth_token')
  return data
}

export async function getCurrentUser() {
  const { data } = await api.get('/me')
  return data.user
}