import api from './api'

export type AuditPayload = {
  zone_id?: number | string
  tri?: number
  ranger?: number
  nettoyer?: number
  standardiser?: number
  maintenir?: number
  score?: number
  photos_before?: string[] | null
  photos_after?: string[] | null
  created_by?: number
}

export interface Audit extends AuditPayload {
  id: number
  created_at: string
  zone?: { id: number; name: string }
  createdBy?: { id: number; name: string }
}

export async function listAudits(): Promise<Audit[]> {
  const { data } = await api.get('/five-s-audits')
  return data?.data ?? []
}

export async function getAudit(id: number | string): Promise<Audit> {
  const { data } = await api.get(`/five-s-audits/${id}`)
  return data?.data
}

export async function createAudit(payload: AuditPayload) {
  const { data } = await api.post('/five-s-audits', payload)
  return data?.data
}

export async function updateAudit(id: number | string, payload: AuditPayload) {
  const { data } = await api.put(`/five-s-audits/${id}`, payload)
  return data?.data
}

export async function deleteAudit(id: number | string) {
  const { data } = await api.delete(`/five-s-audits/${id}`)
  return data
}
