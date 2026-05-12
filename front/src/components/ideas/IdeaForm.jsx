import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { fr } from '../../i18n/fr'
import ActionButton from '../ui/ActionButton'

const ideaSchema = z.object({
  title: z.string().trim().min(3, fr.ideas.form.titleValidation),
  description: z.string().trim().min(5, fr.ideas.form.descriptionValidation),
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

export default function IdeaForm({ mode, initialValues, onSubmit, onCancel, isSubmitting }) {
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
    const parsed = ideaSchema.safeParse(values)

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
        <label className="label" htmlFor="idea-title">{fr.ideas.form.title}</label>
        <input id="idea-title" className="input" {...register('title')} />
        {errors.title ? <p className="error-text">{errors.title.message}</p> : null}
      </div>

      <div className="field">
        <label className="label" htmlFor="idea-description">{fr.ideas.form.description}</label>
        <textarea id="idea-description" rows={5} className="textarea" {...register('description')} />
        {errors.description ? <p className="error-text">{errors.description.message}</p> : null}
      </div>

      <div className="button-row" style={{ justifyContent: 'flex-end' }}>
        <ActionButton type="button" variant="ghost" onClick={onCancel}>
          {fr.ideas.form.cancel}
        </ActionButton>
        <ActionButton type="submit" variant="primary" disabled={isSubmitting}>
          {isSubmitting ? fr.ideas.form.saving : mode === 'edit' ? fr.ideas.form.updateButton : fr.ideas.form.submitButton}
        </ActionButton>
      </div>
    </form>
  )
}
