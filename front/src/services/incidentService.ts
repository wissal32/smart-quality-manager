import api from './api'

export type IncidentPayload = {
  title?: string
  description?: string | null
  category?: string
  severity?: 'low' | 'medium' | 'high' | 'critical'
  assigned_to?: number | null
  status?: 'open' | 'investigating' | 'resolved'
  reported_by?: number
}

export async function listIncidents() {
  const { data } = await api.get('/incidents')
  return data?.data ?? []
}

export async function getIncident(id: number | string) {
  const { data } = await api.get(`/incidents/${id}`)
  return data?.data
}

export async function createIncident(payload: IncidentPayload) {
  const { data } = await api.post('/incidents', payload)
  return data?.data
}

export async function updateIncident(id: number | string, payload: IncidentPayload) {
  const { data } = await api.put(`/incidents/${id}`, payload)
  return data?.data
}

export async function deleteIncident(id: number | string) {
  const { data } = await api.delete(`/incidents/${id}`)
  return data
}
