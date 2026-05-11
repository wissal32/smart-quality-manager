import api from './api'
import { listActions } from './actionService'
import { listIncidents } from './incidentService'
import { listIdeas } from './ideaService'
import { listAudits } from './auditService'

export interface DashboardStats {
  totalActions: number
  openIncidents: number
  totalIdeas: number
  totalEquipments: number
  averageScore: number
  actionsByStatus: {
    todo: number
    in_progress: number
    done: number
  }
  incidentsBySeverity: {
    low: number
    medium: number
    high: number
  }
  recentActions: any[]
  recentIncidents: any[]
  recentIdeas: any[]
}

export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    // Fetch all data in parallel
    const [actions, incidents, ideas, audits, equipmentsResponse] = await Promise.all([
      listActions(),
      listIncidents(),
      listIdeas(),
      listAudits(),
      api.get('/equipments').then((res) => res.data?.data ?? []),
    ])

    // Calculate action status distribution
    const actionsByStatus = {
      todo: actions.filter((a: any) => a.status === 'todo').length,
      in_progress: actions.filter((a: any) => a.status === 'in_progress').length,
      done: actions.filter((a: any) => a.status === 'done').length,
    }

    // Calculate incident severity distribution
    const incidentsBySeverity = {
      low: incidents.filter((i: any) => i.severity === 'low').length,
      medium: incidents.filter((i: any) => i.severity === 'medium').length,
      high: incidents.filter((i: any) => i.severity === 'high' || i.severity === 'critical').length,
    }

    // Calculate average 5S score
    const averageScore =
      audits.length > 0
        ? audits.reduce((sum: number, a: any) => sum + (Number(a.score) || 0), 0) / audits.length
        : 0

    // Get recent items (sorted by created_at, most recent first)
    const recentActions = actions
      .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5)

    const recentIncidents = incidents
      .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5)

    const recentIdeas = ideas
      .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5)

    return {
      totalActions: actions.length,
      openIncidents: incidents.filter((i: any) => i.status === 'open').length,
      totalIdeas: ideas.length,
      totalEquipments: equipmentsResponse.length,
      averageScore,
      actionsByStatus,
      incidentsBySeverity,
      recentActions,
      recentIncidents,
      recentIdeas,
    }
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    throw error
  }
}