import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { fr } from '../../i18n/fr'
import ActionButton from '../ui/ActionButton'

const incidentSchema = z.object({
  title: z.string().trim().min(3, fr.incidents.form.titleValidation),
  description: z.string().trim().min(5, fr.incidents.form.descriptionValidation),
  category: z.string().trim().min(2, fr.incidents.form.categoryValidation),
  severity: z.enum(['low', 'medium', 'high']),
  assigned_to: z.coerce.number().int().positive(fr.actions.form.assignedUserValidation),
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
        <label className="label" htmlFor="incident-title">{fr.incidents.form.title}</label>
        <input id="incident-title" className="input" {...register('title')} />
        {errors.title ? <p className="error-text">{errors.title.message}</p> : null}
      </div>

      <div className="field">
        <label className="label" htmlFor="incident-description">{fr.incidents.form.description}</label>
        <textarea id="incident-description" rows={4} className="textarea" {...register('description')} />
        {errors.description ? <p className="error-text">{errors.description.message}</p> : null}
      </div>

      <div className="users-grid">
        <div className="field">
          <label className="label" htmlFor="incident-category">{fr.incidents.form.category}</label>
          <input id="incident-category" className="input" {...register('category')} />
          {errors.category ? <p className="error-text">{errors.category.message}</p> : null}
        </div>

        <div className="field">
          <label className="label" htmlFor="incident-severity">{fr.incidents.form.severity}</label>
          <select id="incident-severity" className="select" {...register('severity')}>
            <option value="low">{fr.incidents.form.severityOptions.low}</option>
            <option value="medium">{fr.incidents.form.severityOptions.medium}</option>
            <option value="high">{fr.incidents.form.severityOptions.high}</option>
          </select>
          {errors.severity ? <p className="error-text">{errors.severity.message}</p> : null}
        </div>
      </div>

      <div className="users-grid">
        <div className="field">
          <label className="label" htmlFor="incident-assigned-to">{fr.incidents.form.assignedUser}</label>
          {users.length > 0 ? (
            <select id="incident-assigned-to" className="select" {...register('assigned_to')}>
              <option value="">{fr.incidents.form.selectUser}</option>
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
          <label className="label" htmlFor="incident-status">{fr.incidents.form.status}</label>
          <select id="incident-status" className="select" {...register('status')}>
            <option value="open">{fr.incidents.form.statusOptions.open}</option>
            <option value="in_progress">{fr.incidents.form.statusOptions.inProgress}</option>
            <option value="resolved">{fr.incidents.form.statusOptions.resolved}</option>
          </select>
          {errors.status ? <p className="error-text">{errors.status.message}</p> : null}
        </div>
      </div>

      <div className="button-row" style={{ justifyContent: 'flex-end' }}>
        <ActionButton type="button" variant="ghost" onClick={onCancel}>
          {fr.incidents.form.cancel}
        </ActionButton>
        <ActionButton type="submit" variant="primary" disabled={isSubmitting}>
          {isSubmitting ? fr.incidents.form.saving : mode === 'edit' ? fr.incidents.form.updateButton : fr.incidents.form.reportButton}
        </ActionButton>
      </div>
    </form>
  )
}
