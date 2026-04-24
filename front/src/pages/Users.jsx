import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Edit3, Plus, Trash2, Users as UsersIcon } from 'lucide-react'
import toast from 'react-hot-toast'
import { createUser, deleteUser, listUsers, updateUser } from '../services/userService'

const createSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['admin', 'quality_manager', 'it_referent', 'employee']),
  department: z.string().optional().or(z.literal('')),
})

const editSchema = createSchema.partial().extend({
  password: z.string().min(8, 'Password must be at least 8 characters').optional().or(z.literal('')),
})

const defaultValues = {
  name: '',
  email: '',
  password: '',
  role: 'employee',
  department: '',
}

export default function Users() {
  const queryClient = useQueryClient()
  const [editingUser, setEditingUser] = useState(null)

  const { data, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: listUsers,
  })

  const formSchema = useMemo(() => (editingUser ? editSchema : createSchema), [editingUser])

  const { register, handleSubmit, reset, setValue, setError, clearErrors, formState: { errors, isSubmitting } } = useForm({
    defaultValues,
  })

  const saveMutation = useMutation({
    mutationFn: async (payload) => {
      if (editingUser) {
        return updateUser(editingUser.id, payload)
      }

      return createUser(payload)
    },
    onSuccess: () => {
      toast.success(editingUser ? 'User updated' : 'User created')
      queryClient.invalidateQueries({ queryKey: ['users'] })
      setEditingUser(null)
      reset(defaultValues)
    },
    onError: (error) => {
      toast.error(error?.message || 'Unable to save user')
    },
  })

  const removeMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      toast.success('User deleted')
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
    onError: (error) => {
      toast.error(error?.message || 'Unable to delete user')
    },
  })

  const users = data || []

  const roleCounts = useMemo(
    () =>
      users.reduce((acc, user) => {
        acc[user.role] = (acc[user.role] || 0) + 1
        return acc
      }, {}),
    [users],
  )

  const onSubmit = async (values) => {
    clearErrors()

    const parsed = formSchema.safeParse(values)

    if (!parsed.success) {
      parsed.error.issues.forEach((issue) => {
        const field = issue.path[0]
        if (typeof field === 'string') {
          setError(field, { type: 'manual', message: issue.message })
        }
      })
      return
    }

    const payload = { ...parsed.data }

    if (!payload.password) {
      delete payload.password
    }

    if (!payload.department) {
      delete payload.department
    }

    saveMutation.mutate(payload)
  }

  const startEdit = (user) => {
    setEditingUser(user)
    setValue('name', user.name ?? '')
    setValue('email', user.email ?? '')
    setValue('password', '')
    setValue('role', user.role ?? 'employee')
    setValue('department', user.department ?? '')
  }

  const cancelEdit = () => {
    setEditingUser(null)
    reset(defaultValues)
  }

  return (
    <div className="page-grid">
      <section className="stats-grid">
        {Object.entries(roleCounts).map(([role, count]) => (
          <motion.article key={role} className="metric-card stat-card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="stat-icon" style={{ background: 'rgba(56,189,248,0.12)', color: '#38bdf8' }}>
              <UsersIcon size={18} />
            </div>
            <div>
              <div className="muted" style={{ fontSize: '0.9rem' }}>{role}</div>
              <div className="stat-value">{count}</div>
            </div>
          </motion.article>
        ))}
      </section>

      <section className="charts-grid">
        <motion.article className="panel-card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <div className="card-kicker">Admin management</div>
          <h2 className="page-title" style={{ marginTop: 8 }}>
            {editingUser ? 'Edit user' : 'Create user'}
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="auth-form" style={{ marginTop: 18 }}>
            <div className="users-grid">
              <label className="field">
                <span className="label">Name</span>
                <input className="input" {...register('name')} />
                {errors.name && <span className="error-text">{errors.name.message}</span>}
              </label>
              <label className="field">
                <span className="label">Email</span>
                <input className="input" type="email" {...register('email')} />
                {errors.email && <span className="error-text">{errors.email.message}</span>}
              </label>
              <label className="field">
                <span className="label">Password{editingUser ? ' (optional)' : ''}</span>
                <input className="input" type="password" {...register('password')} />
                {errors.password && <span className="error-text">{errors.password.message}</span>}
              </label>
              <label className="field">
                <span className="label">Role</span>
                <select className="select" {...register('role')}>
                  <option value="admin">Admin</option>
                  <option value="quality_manager">Quality Manager</option>
                  <option value="it_referent">IT Referent</option>
                  <option value="employee">Employee</option>
                </select>
              </label>
              <label className="field" style={{ gridColumn: '1 / -1' }}>
                <span className="label">Department</span>
                <input className="input" {...register('department')} />
              </label>
            </div>

            <div className="button-row" style={{ justifyContent: 'flex-end', flexWrap: 'wrap' }}>
              {editingUser && (
                <button type="button" className="btn btn-ghost" onClick={cancelEdit}>
                  Cancel
                </button>
              )}
              <button type="submit" className="btn btn-primary" disabled={isSubmitting || saveMutation.isPending}>
                <Plus size={16} />
                {editingUser ? 'Update user' : 'Create user'}
              </button>
            </div>
          </form>
        </motion.article>

        <motion.article className="panel-card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <div className="section-title">
            <div>
              <div className="card-kicker">Directory</div>
              <h2 className="page-title" style={{ marginTop: 8 }}>Users list</h2>
            </div>
          </div>

          <div className="table-wrap" style={{ marginTop: 18 }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Department</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan="5" className="muted">Loading users...</td>
                  </tr>
                ) : users.length ? (
                  users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td><span className="badge badge-success">{user.role}</span></td>
                      <td>{user.department || '-'}</td>
                      <td>
                        <div className="table-action-row">
                          <button type="button" className="btn btn-ghost" onClick={() => startEdit(user)}>
                            <Edit3 size={14} />
                          </button>
                          <button type="button" className="btn btn-danger" onClick={() => removeMutation.mutate(user.id)}>
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="muted">No users found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.article>
      </section>
    </div>
  )
}