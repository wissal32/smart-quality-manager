import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import ActionButton from '../ui/ActionButton'

const incidentSchema = z.object({
  title: z.string().trim().min(3, 'Title must be at least 3 characters long.'),
  description: z.string().trim().min(5, 'Description must be at least 5 characters long.'),
  category: z.string().trim().min(2, 'Category is required.'),
  severity: z.enum(['low', 'medium', 'high']),
  assigned_to: z.coerce.number().int().positive('Assigned user is required.'),
  status: z.enum(['open', 'in_progress', 'resolved']),
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

export default function IncidentForm({ mode, initialValues, users, onSubmit, onCancel, isSubmitting }) {
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
    const parsed = incidentSchema.safeParse(values)

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
        <label className="label" htmlFor="incident-title">Title</label>
        <input id="incident-title" className="input" {...register('title')} />
        {errors.title ? <p className="error-text">{errors.title.message}</p> : null}
      </div>

      <div className="field">
        <label className="label" htmlFor="incident-description">Description</label>
        <textarea id="incident-description" rows={4} className="textarea" {...register('description')} />
        {errors.description ? <p className="error-text">{errors.description.message}</p> : null}
      </div>

      <div className="users-grid">
        <div className="field">
          <label className="label" htmlFor="incident-category">Category</label>
          <input id="incident-category" className="input" {...register('category')} />
          {errors.category ? <p className="error-text">{errors.category.message}</p> : null}
        </div>

        <div className="field">
          <label className="label" htmlFor="incident-severity">Severity</label>
          <select id="incident-severity" className="select" {...register('severity')}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          {errors.severity ? <p className="error-text">{errors.severity.message}</p> : null}
        </div>
      </div>

      <div className="users-grid">
        <div className="field">
          <label className="label" htmlFor="incident-assigned-to">Assigned User</label>
          {users.length > 0 ? (
            <select id="incident-assigned-to" className="select" {...register('assigned_to')}>
              <option value="">Select a user</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.email})
                </option>
              ))}
            </select>
          ) : (
            <input id="incident-assigned-to" type="number" className="input" {...register('assigned_to')} />
          )}
          {errors.assigned_to ? <p className="error-text">{errors.assigned_to.message}</p> : null}
        </div>

        <div className="field">
          <label className="label" htmlFor="incident-status">Status</label>
          <select id="incident-status" className="select" {...register('status')}>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
          {errors.status ? <p className="error-text">{errors.status.message}</p> : null}
        </div>
      </div>

      <div className="button-row" style={{ justifyContent: 'flex-end' }}>
        <ActionButton type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </ActionButton>
        <ActionButton type="submit" variant="primary" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : mode === 'edit' ? 'Update Incident' : 'Report Incident'}
        </ActionButton>
      </div>
    </form>
  )
}
