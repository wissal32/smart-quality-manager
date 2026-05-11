import axios from 'axios'

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  headers: {
    Accept: 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  // Handle FormData - let axios set the correct Content-Type automatically
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type']
  } else if (!config.headers['Content-Type']) {
    config.headers['Content-Type'] = 'application/json'
  }

  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem('auth_token')
    }

    return Promise.reject({
      status: error?.response?.status,
      message:
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        'Something went wrong with the API request.',
      errors: error?.response?.data?.errors,
      originalError: error,
    })
  },
)

export default api