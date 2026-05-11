import api from './api'

export interface Zone {
  id: number
  name: string
  description?: string
}

export async function listZones(): Promise<Zone[]> {
  try {
    const { data } = await api.get('/zones')
    return data?.data ?? []
  } catch {
    return []
  }
}

export async function getZone(id: number | string): Promise<Zone | null> {
  try {
    const { data } = await api.get(`/zones/${id}`)
    return data?.data
  } catch {
    return null
  }
}
