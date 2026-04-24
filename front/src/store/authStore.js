import { create } from 'zustand'
import { getCurrentUser, login as loginRequest, logout as logoutRequest } from '../services/authService'

const token = localStorage.getItem('auth_token')

export const useAuthStore = create((set, get) => ({
  user: null,
  token,
  isAuthenticated: Boolean(token),
  isHydrating: Boolean(token),
  isLoading: false,

  login: async (email, password) => {
    set({ isLoading: true })

    try {
      const data = await loginRequest(email, password)
      set({
        user: data.user,
        token: data.token,
        isAuthenticated: true,
        isHydrating: false,
        isLoading: false,
      })
      return data
    } catch (error) {
      set({ isLoading: false })
      throw error
    }
  },

  logout: async () => {
    try {
      await logoutRequest()
    } finally {
      localStorage.removeItem('auth_token')
      set({ user: null, token: null, isAuthenticated: false, isHydrating: false, isLoading: false })
    }
  },

  fetchUser: async () => {
    const currentToken = localStorage.getItem('auth_token')

    if (!currentToken) {
      set({ user: null, token: null, isAuthenticated: false, isHydrating: false })
      return null
    }

    try {
      const user = await getCurrentUser()
      set({ user, token: currentToken, isAuthenticated: true, isHydrating: false })
      return user
    } catch (error) {
      localStorage.removeItem('auth_token')
      set({ user: null, token: null, isAuthenticated: false, isHydrating: false })
      throw error
    }
  },
}))