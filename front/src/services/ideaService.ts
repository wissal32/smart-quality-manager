import api from './api'

export type IdeaPayload = {
  title?: string
  description?: string | null
  status?: 'pending' | 'approved' | 'rejected'
  votes?: number
  created_by?: number
}

export async function listIdeas() {
  const { data } = await api.get('/ideas')
  return data?.data ?? []
}

export async function getIdea(id: number | string) {
  const { data } = await api.get(`/ideas/${id}`)
  return data?.data
}

export async function createIdea(payload: IdeaPayload) {
  const { data } = await api.post('/ideas', payload)
  return data?.data
}

export async function updateIdea(id: number | string, payload: IdeaPayload) {
  const { data } = await api.put(`/ideas/${id}`, payload)
  return data?.data
}

export async function deleteIdea(id: number | string) {
  const { data } = await api.delete(`/ideas/${id}`)
  return data
}
