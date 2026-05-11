import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import ActionButton from '../ui/ActionButton'

const baseSchema = z.object({
  title: z.string().trim().min(3, 'Title must be at least 3 characters long.'),
  description: z.string().trim().max(1000, 'Description is too long.').optional(),
  priority: z.enum(['low', 'medium', 'high']),
  assigned_to: z.coerce.number().int().positive('Assigned user is required.'),
  deadline: z.string().optional(),
  status: z.enum(['pending', 'in_progress', 'completed']),
})

function toErrorMap(zodError) {
  return zodError.issues.reduce((acc, issue) => {
    const key = issue.path[0]
    if (typeof key === 'string' && !acc[key]) {
      acc[key] = { message: issue.message }
    }
    return acc
  }, {})
}

export default function ActionForm({
  mode,
  initialValues,
  users,
  onSubmit,
  onCancel,
  isSubmitting,
}) {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm({
    defaultValues: initialValues,
  })

  useEffect(() => {
    reset(initialValues)
  }, [initialValues, reset])

  const submitHandler = (values) => {
    const parsed = baseSchema.safeParse(values)

    if (!parsed.success) {
      const errorMap = toErrorMap(parsed.error)
      Object.entries(errorMap).forEach(([field, error]) => {
        setError(field, error)
      })
      return
    }

    onSubmit(parsed.data)
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit(submitHandler)}>
      <div className="field">
        <label className="label" htmlFor="action-title">Title</label>
        <input id="action-title" className="input" {...register('title')} />
        {errors.title ? <p className="error-text">{errors.title.message}</p> : null}
      </div>

      <div className="field">
        <label className="label" htmlFor="action-description">Description</label>
        <textarea id="action-description" rows={4} className="textarea" {...register('description')} />
        {errors.description ? <p className="error-text">{errors.description.message}</p> : null}
      </div>

      <div className="users-grid">
        <div className="field">
          <label className="label" htmlFor="action-priority">Priority</label>
          <select id="action-priority" className="select" {...register('priority')}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          {errors.priority ? <p className="error-text">{errors.priority.message}</p> : null}
        </div>

        <div className="field">
          <label className="label" htmlFor="action-assigned-to">Assigned User</label>
          {users.length > 0 ? (
            <select id="action-assigned-to" className="select" {...register('assigned_to')}>
              <option value="">Select a user</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.email})
                </option>
              ))}
            </select>
          ) : (
            <input id="action-assigned-to" type="number" className="input" {...register('assigned_to')} />
          )}
          {errors.assigned_to ? <p className="error-text">{errors.assigned_to.message}</p> : null}
        </div>
      </div>

      <div className="users-grid">
        <div className="field">
          <label className="label" htmlFor="action-deadline">Deadline</label>
          <input id="action-deadline" type="date" className="input" {...register('deadline')} />
          {errors.deadline ? <p className="error-text">{errors.deadline.message}</p> : null}
        </div>

        <div className="field">
          <label className="label" htmlFor="action-status">Status</label>
          <select id="action-status" className="select" {...register('status')}>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          {errors.status ? <p className="error-text">{errors.status.message}</p> : null}
        </div>
      </div>

      <div className="button-row" style={{ justifyContent: 'flex-end' }}>
        <ActionButton type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </ActionButton>
        <ActionButton type="submit" variant="primary" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : mode === 'edit' ? 'Update Action' : 'Create Action'}
        </ActionButton>
      </div>
    </form>
  )
}
