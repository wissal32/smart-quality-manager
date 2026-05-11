import api from './api'

export type ActionPayload = {
  title?: string
  description?: string | null
  priority?: 'low' | 'medium' | 'high'
  deadline?: string | null
  status?: 'todo' | 'in_progress' | 'done'
  assigned_to?: number
  created_by?: number
}

export async function listActions() {
  const { data } = await api.get('/actions')
  return data?.data ?? []
}

export async function getAction(id: number | string) {
  const { data } = await api.get(`/actions/${id}`)
  return data?.data
}

export async function createAction(payload: ActionPayload) {
  const { data } = await api.post('/actions', payload)
  return data?.data
}

export async function updateAction(id: number | string, payload: ActionPayload) {
  const { data } = await api.put(`/actions/${id}`, payload)
  return data?.data
}

export async function deleteAction(id: number | string) {
  const { data } = await api.delete(`/actions/${id}`)
  return data
}
