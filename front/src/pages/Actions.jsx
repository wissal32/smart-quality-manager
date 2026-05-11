import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { CheckCircle2, Clock3, ListChecks, Plus } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuthStore } from '../store/authStore'
import { createAction, deleteAction, listActions, updateAction } from '../services/actionService.ts'
import { listUsers } from '../services/userService'
import ActionButton from '../components/ui/ActionButton'
import ActionTable from '../components/actions/ActionTable'
import ActionForm from '../components/actions/ActionForm'

const defaultFormValues = {
  title: '',
  description: '',
  priority: 'medium',
  assigned_to: '',
  deadline: '',
  status: 'pending',
}

const statusLabels = {
  pending: 'Pending',
  in_progress: 'In Progress',
  completed: 'Completed',
}

function toUiStatus(status) {
  if (status === 'todo') return 'pending'
  if (status === 'done') return 'completed'
  return 'in_progress'
}

function toApiStatus(status) {
  if (status === 'pending') return 'todo'
  if (status === 'completed') return 'done'
  return 'in_progress'
}

function normalizeAction(action) {
  const uiStatus = toUiStatus(action.status)
  return {
    ...action,
    status: uiStatus,
    statusLabel: statusLabels[uiStatus],
    assignedToName: action.assignedTo?.name || '',
  }
}

function toApiPayload(values, userId, includeCreator) {
  const payload = {
    title: values.title,
    description: values.description || null,
    priority: values.priority,
    deadline: values.deadline || null,
    status: toApiStatus(values.status),
    assigned_to: Number(values.assigned_to),
  }

  if (includeCreator) {
    payload.created_by = Number(userId)
  }

  return payload
}

export default function Actions() {
  const queryClient = useQueryClient()
  const user = useAuthStore((state) => state.user)

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [assigneeFilter, setAssigneeFilter] = useState('all')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [formMode, setFormMode] = useState('create')
  const [editingAction, setEditingAction] = useState(null)

  const { data: actions = [], isLoading } = useQuery({
    queryKey: ['actions'],
    queryFn: async () => {
      const data = await listActions()
      return data.map(normalizeAction)
    },
  })

  const { data: usersFromApi = [] } = useQuery({
    queryKey: ['users', 'for-actions'],
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

    usersFromApi.forEach((item) => {
      byId.set(item.id, item)
    })

    actions.forEach((item) => {
      if (item.assignedTo?.id && !byId.has(item.assignedTo.id)) {
        byId.set(item.assignedTo.id, {
          id: item.assignedTo.id,
          name: item.assignedTo.name,
          email: item.assignedTo.email || '-',
        })
      }
    })

    return Array.from(byId.values())
  }, [actions, usersFromApi])

  const stats = useMemo(() => {
    const total = actions.length
    const completed = actions.filter((item) => item.status === 'completed').length
    const inProgress = actions.filter((item) => item.status === 'in_progress').length
    const pending = actions.filter((item) => item.status === 'pending').length
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0

    return {
      total,
      completed,
      inProgress,
      pending,
      completionRate,
    }
  }, [actions])

  const filteredActions = useMemo(() => {
    return actions.filter((item) => {
      const matchesSearch =
        search.trim().length === 0 ||
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        (item.description || '').toLowerCase().includes(search.toLowerCase())

      const matchesStatus = statusFilter === 'all' || item.status === statusFilter
      const matchesAssignee = assigneeFilter === 'all' || String(item.assigned_to) === assigneeFilter

      return matchesSearch && matchesStatus && matchesAssignee
    })
  }, [actions, assigneeFilter, search, statusFilter])

  const createMutation = useMutation({
    mutationFn: (payload) => createAction(payload),
    onSuccess: () => {
      toast.success('Action created successfully.')
      queryClient.invalidateQueries({ queryKey: ['actions'] })
      setIsFormOpen(false)
      setEditingAction(null)
      setFormMode('create')
    },
    onError: (error) => {
      toast.error(error?.message || 'Failed to create action.')
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => updateAction(id, payload),
    onSuccess: () => {
      toast.success('Action updated successfully.')
      queryClient.invalidateQueries({ queryKey: ['actions'] })
      setIsFormOpen(false)
      setEditingAction(null)
      setFormMode('create')
    },
    onError: (error) => {
      toast.error(error?.message || 'Failed to update action.')
    },
  })

  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => updateAction(id, { status: toApiStatus(status) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['actions'] })
    },
    onError: (error) => {
      toast.error(error?.message || 'Failed to update status.')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteAction(id),
    onSuccess: () => {
      toast.success('Action deleted successfully.')
      queryClient.invalidateQueries({ queryKey: ['actions'] })
    },
    onError: (error) => {
      toast.error(error?.message || 'Failed to delete action.')
    },
  })

  const formInitialValues = useMemo(() => {
    if (!editingAction) return defaultFormValues

    return {
      title: editingAction.title || '',
      description: editingAction.description || '',
      priority: editingAction.priority || 'medium',
      assigned_to: String(editingAction.assigned_to || ''),
      deadline: editingAction.deadline ? String(editingAction.deadline).slice(0, 10) : '',
      status: editingAction.status || 'pending',
    }
  }, [editingAction])

  const openCreateModal = () => {
    setFormMode('create')
    setEditingAction(null)
    setIsFormOpen(true)
  }

  const openEditModal = (action) => {
    setFormMode('edit')
    setEditingAction(action)
    setIsFormOpen(true)
  }

  const closeForm = () => {
    setIsFormOpen(false)
    setEditingAction(null)
    setFormMode('create')
  }

  const handleDelete = (action) => {
    const confirmed = window.confirm(`Delete action "${action.title}"? This cannot be undone.`)
    if (!confirmed) return
    deleteMutation.mutate(action.id)
  }

  const handleStatusChange = (action, nextStatus) => {
    if (nextStatus === action.status) return
    statusMutation.mutate({ id: action.id, status: nextStatus })
  }

  const handleSubmitForm = (values) => {
    if (!user?.id) {
      toast.error('You must be authenticated to manage actions.')
      return
    }

    if (formMode === 'create') {
      createMutation.mutate(toApiPayload(values, user.id, true))
      return
    }

    if (!editingAction?.id) {
      toast.error('No action selected for update.')
      return
    }

    updateMutation.mutate({
      id: editingAction.id,
      payload: toApiPayload(values, user.id, false),
    })
  }

  return (
    <div className="page-grid">
      <motion.section className="page-card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="page-row" style={{ justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div>
            <p className="page-kicker">Quality Execution</p>
            <h2 className="page-title" style={{ marginTop: 8 }}>Actions Management</h2>
            <p className="page-copy">Create, monitor, and close corrective actions connected to Laravel API data.</p>
          </div>
          <ActionButton variant="primary" icon={Plus} onClick={openCreateModal}>
            New Action
          </ActionButton>
        </div>

        <div className="feature-row" style={{ marginTop: 18 }}>
          {[
            { value: 'all', label: 'All' },
            { value: 'pending', label: 'Pending' },
            { value: 'in_progress', label: 'In Progress' },
            { value: 'completed', label: 'Completed' },
          ].map((item) => (
            <button
              key={item.value}
              type="button"
              className={`btn ${statusFilter === item.value ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setStatusFilter(item.value)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="users-grid" style={{ marginTop: 16 }}>
          <div className="field">
            <label className="label" htmlFor="search-actions">Search</label>
            <input
              id="search-actions"
              className="input"
              placeholder="Search by title or description"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <div className="field">
            <label className="label" htmlFor="assignee-filter">Assigned User</label>
            <select
              id="assignee-filter"
              className="select"
              value={assigneeFilter}
              onChange={(event) => setAssigneeFilter(event.target.value)}
            >
              <option value="all">All users</option>
              {users.map((item) => (
                <option key={item.id} value={String(item.id)}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </motion.section>

      <section className="stats-grid">
        <motion.article className="metric-card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <p className="card-kicker">Total</p>
          <div className="panel-row" style={{ justifyContent: 'space-between', marginTop: 10 }}>
            <p className="stat-value" style={{ fontSize: '2.1rem' }}>{stats.total}</p>
            <div className="stat-icon" style={{ background: 'rgba(56, 189, 248, 0.16)', color: '#7dd3fc' }}>
              <ListChecks size={22} />
            </div>
          </div>
        </motion.article>
        <motion.article className="metric-card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <p className="card-kicker">In Progress</p>
          <div className="panel-row" style={{ justifyContent: 'space-between', marginTop: 10 }}>
            <p className="stat-value" style={{ fontSize: '2.1rem' }}>{stats.inProgress + stats.pending}</p>
            <div className="stat-icon" style={{ background: 'rgba(59, 130, 246, 0.16)', color: '#93c5fd' }}>
              <Clock3 size={22} />
            </div>
          </div>
        </motion.article>
        <motion.article className="metric-card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <p className="card-kicker">Completion</p>
          <div className="panel-row" style={{ justifyContent: 'space-between', marginTop: 10 }}>
            <p className="stat-value" style={{ fontSize: '2.1rem' }}>{stats.completionRate}%</p>
            <div className="stat-icon" style={{ background: 'rgba(34, 197, 94, 0.16)', color: '#86efac' }}>
              <CheckCircle2 size={22} />
            </div>
          </div>
        </motion.article>
      </section>

      <motion.section className="panel-card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ padding: 0, overflow: 'hidden' }}>
        <div className="panel-row" style={{ justifyContent: 'space-between', padding: 20, borderBottom: '1px solid var(--panel-border)' }}>
          <h3 style={{ color: 'var(--text-strong)' }}>Action List</h3>
          <span className="muted">{filteredActions.length} visible items</span>
        </div>
        <ActionTable
          actions={filteredActions}
          isLoading={isLoading}
          onEdit={openEditModal}
          onDelete={handleDelete}
          onStatusChange={handleStatusChange}
        />
      </motion.section>

      {isFormOpen ? (
        <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Action form dialog">
          <motion.section className="modal-card" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
            <div className="panel-row" style={{ justifyContent: 'space-between' }}>
              <div>
                <p className="card-kicker">{formMode === 'edit' ? 'Edit Action' : 'Create Action'}</p>
                <h3 style={{ color: 'var(--text-strong)', marginTop: 6 }}>
                  {formMode === 'edit' ? 'Update selected action' : 'Add a new corrective action'}
                </h3>
              </div>
              <ActionButton variant="ghost" onClick={closeForm}>
                Close
              </ActionButton>
            </div>
            <ActionForm
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
