import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { AlertTriangle, CheckCircle2, Clock3, Plus } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuthStore } from '../store/authStore'
import { fr } from '../i18n/fr'
import ActionButton from '../components/ui/ActionButton'
import IncidentTable from '../components/incidents/IncidentTable'
import IncidentForm from '../components/incidents/IncidentForm'
import { createIncident, deleteIncident, listIncidents, updateIncident } from '../services/incidentService.ts'
import { listUsers } from '../services/userService'

const defaultFormValues = {
  title: '',
  description: '',
  category: '',
  severity: 'low',
  assigned_to: '',
  status: 'open',
}

function toUiStatus(status) {
  if (status === 'investigating') return 'in_progress'
  return status || 'open'
}

function toApiStatus(status) {
  if (status === 'in_progress') return 'investigating'
  return status
}

function toUiSeverity(severity) {
  if (severity === 'critical') return 'high'
  return severity || 'low'
}

function normalizeIncident(item) {
  return {
    ...item,
    status: toUiStatus(item.status),
    severity: toUiSeverity(item.severity),
    assigned_to: item.assigned_to ?? item.assignedTo?.id ?? null,
    assignedUserName: item.assignedTo?.name || '',
  }
}

function toApiPayload(values, userId, includeReporter) {
  const payload = {
    title: values.title,
    description: values.description,
    category: values.category,
    severity: values.severity,
    assigned_to: Number(values.assigned_to),
    status: toApiStatus(values.status),
  }

  if (includeReporter) {
    payload.reported_by = Number(userId)
  }

  return payload
}

export default function Incidents() {
  const queryClient = useQueryClient()
  const user = useAuthStore((state) => state.user)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [formMode, setFormMode] = useState('create')
  const [editingIncident, setEditingIncident] = useState(null)

  const { data: incidents = [], isLoading } = useQuery({
    queryKey: ['incidents'],
    queryFn: async () => {
      const data = await listIncidents()
      return data.map(normalizeIncident)
    },
  })

  const { data: usersFromApi = [] } = useQuery({
    queryKey: ['users', 'for-incidents'],
    queryFn: async () => {
      try {
        return await listUsers()
      } catch {
        return []
      }
    },
  })

  const users = useMemo(() => {
    const byId = new Map()

    usersFromApi.forEach((userItem) => {
      byId.set(userItem.id, userItem)
    })

    incidents.forEach((item) => {
      if (item.assignedTo?.id && !byId.has(item.assignedTo.id)) {
        byId.set(item.assignedTo.id, {
          id: item.assignedTo.id,
          name: item.assignedTo.name,
          email: item.assignedTo.email || '-',
        })
      }
    })

    return Array.from(byId.values())
  }, [incidents, usersFromApi])

  const filteredIncidents = useMemo(() => {
    return incidents.filter((item) => {
      const matchesSearch =
        search.trim().length === 0 ||
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        (item.description || '').toLowerCase().includes(search.toLowerCase())

      const matchesStatus = statusFilter === 'all' || item.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [incidents, search, statusFilter])

  const stats = useMemo(() => {
    const open = incidents.filter((item) => item.status === 'open').length
    const inProgress = incidents.filter((item) => item.status === 'in_progress').length
    const resolved = incidents.filter((item) => item.status === 'resolved').length

    return {
      total: incidents.length,
      open,
      inProgress,
      resolved,
    }
  }, [incidents])

  const createMutation = useMutation({
    mutationFn: (payload) => createIncident(payload),
    onSuccess: () => {
      toast.success(fr.incidents.messages.reportSuccess)
      queryClient.invalidateQueries({ queryKey: ['incidents'] })
      setIsFormOpen(false)
      setEditingIncident(null)
      setFormMode('create')
    },
    onError: (error) => {
      toast.error(error?.message || fr.incidents.messages.reportError)
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => updateIncident(id, payload),
    onSuccess: () => {
      toast.success(fr.incidents.messages.updateSuccess)
      queryClient.invalidateQueries({ queryKey: ['incidents'] })
      setIsFormOpen(false)
      setEditingIncident(null)
      setFormMode('create')
    },
    onError: (error) => {
      toast.error(error?.message || fr.incidents.messages.updateError)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteIncident(id),
    onSuccess: () => {
      toast.success(fr.incidents.messages.deleteSuccess)
      queryClient.invalidateQueries({ queryKey: ['incidents'] })
    },
    onError: (error) => {
      toast.error(error?.message || fr.incidents.messages.deleteError)
    },
  })

  const formInitialValues = useMemo(() => {
    if (!editingIncident) return defaultFormValues

    return {
      title: editingIncident.title || '',
      description: editingIncident.description || '',
      category: editingIncident.category || '',
      severity: toUiSeverity(editingIncident.severity),
      assigned_to: String(editingIncident.assigned_to || ''),
      status: editingIncident.status || 'open',
    }
  }, [editingIncident])

  const openCreateModal = () => {
    setFormMode('create')
    setEditingIncident(null)
    setIsFormOpen(true)
  }

  const openEditModal = (incident) => {
    setFormMode('edit')
    setEditingIncident(incident)
    setIsFormOpen(true)
  }

  const closeForm = () => {
    setIsFormOpen(false)
    setEditingIncident(null)
    setFormMode('create')
  }

  const handleDelete = (incident) => {
    const confirmed = window.confirm(fr.incidents.messages.deleteConfirm || `${fr.common.messages.confirmation} ${fr.common.messages.cannotUndo}`)
    if (!confirmed) return
    deleteMutation.mutate(incident.id)
  }

  const handleSubmitForm = (values) => {
    if (!user?.id) {
      toast.error('You must be authenticated to manage incidents.')
      return
    }

    if (formMode === 'create') {
      createMutation.mutate(toApiPayload(values, user.id, true))
      return
    }

    if (!editingIncident?.id) {
      toast.error('No incident selected for update.')
      return
    }

    updateMutation.mutate({
      id: editingIncident.id,
      payload: toApiPayload(values, user.id, false),
    })
  }

  return (
    <div className="page-grid">
      <motion.section className="page-card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="page-row" style={{ justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div>
            <p className="page-kicker">Risk Management</p>
            <h2 className="page-title" style={{ marginTop: 8 }}>Incident Management</h2>
            <p className="page-copy">Report, track, and resolve workplace incidents with full API synchronization.</p>
          </div>
          <ActionButton variant="primary" icon={Plus} onClick={openCreateModal}>
            Report Incident
          </ActionButton>
        </div>

        <div className="users-grid" style={{ marginTop: 16 }}>
          <div className="field">
            <label className="label" htmlFor="incident-search">Search</label>
            <input
              id="incident-search"
              className="input"
              placeholder="Search by title or description"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <div className="field">
            <label className="label" htmlFor="incident-status-filter">Status</label>
            <select
              id="incident-status-filter"
              className="select"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option value="all">All statuses</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>
      </motion.section>

      <section className="stats-grid">
        <motion.article className="metric-card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <p className="card-kicker">Open</p>
          <div className="panel-row" style={{ justifyContent: 'space-between', marginTop: 10 }}>
            <p className="stat-value" style={{ fontSize: '2.1rem' }}>{stats.open}</p>
            <div className="stat-icon" style={{ background: 'rgba(239, 68, 68, 0.18)', color: '#fca5a5' }}>
              <AlertTriangle size={22} />
            </div>
          </div>
        </motion.article>
        <motion.article className="metric-card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <p className="card-kicker">In Progress</p>
          <div className="panel-row" style={{ justifyContent: 'space-between', marginTop: 10 }}>
            <p className="stat-value" style={{ fontSize: '2.1rem' }}>{stats.inProgress}</p>
            <div className="stat-icon" style={{ background: 'rgba(59, 130, 246, 0.16)', color: '#93c5fd' }}>
              <Clock3 size={22} />
            </div>
          </div>
        </motion.article>
        <motion.article className="metric-card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <p className="card-kicker">Resolved</p>
          <div className="panel-row" style={{ justifyContent: 'space-between', marginTop: 10 }}>
            <p className="stat-value" style={{ fontSize: '2.1rem' }}>{stats.resolved}</p>
            <div className="stat-icon" style={{ background: 'rgba(34, 197, 94, 0.16)', color: '#86efac' }}>
              <CheckCircle2 size={22} />
            </div>
          </div>
        </motion.article>
      </section>

      <motion.section className="panel-card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ padding: 0, overflow: 'hidden' }}>
        <div className="panel-row" style={{ justifyContent: 'space-between', padding: 20, borderBottom: '1px solid var(--panel-border)' }}>
          <h3 style={{ color: 'var(--text-strong)' }}>Incidents</h3>
          <span className="muted">{filteredIncidents.length} visible items</span>
        </div>

        <IncidentTable
          incidents={filteredIncidents}
          isLoading={isLoading}
          onEdit={openEditModal}
          onDelete={handleDelete}
        />
      </motion.section>

      {isFormOpen ? (
        <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Incident form dialog">
          <motion.section className="modal-card" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
            <div className="panel-row" style={{ justifyContent: 'space-between' }}>
              <div>
                <p className="card-kicker">{formMode === 'edit' ? fr.incidents.form.editTitle : fr.incidents.form.reportTitle}</p>
                <h3 style={{ color: 'var(--text-strong)', marginTop: 6 }}>
                  {formMode === 'edit' ? fr.incidents.form.updateTitle : fr.incidents.form.reportNewTitle}
                </h3>
              </div>
              <ActionButton variant="ghost" onClick={closeForm}>
                {fr.common.buttons.close}
              </ActionButton>
            </div>

            <IncidentForm
              mode={formMode}
              initialValues={formInitialValues}
              users={users}
              isSubmitting={createMutation.isPending || updateMutation.isPending}
              onSubmit={handleSubmitForm}
              onCancel={closeForm}
            />
          </motion.section>
        </div>
      ) : null}

    </div>
  )
}
