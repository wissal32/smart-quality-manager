import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { fr } from '../../i18n/fr'
import ActionButton from '../ui/ActionButton'
import AuditScoreDisplay from './AuditScoreDisplay'
import AuditPhotoUploader from './AuditPhotoUploader'

const auditSchema = z.object({
  zone_id: z.coerce.number().int().positive(fr.audits5s.form.zoneValidation),
  tri: z.coerce.number().int().min(0).max(5, fr.validation.scoreInvalid),
  ranger: z.coerce.number().int().min(0).max(5, fr.validation.scoreInvalid),
  nettoyer: z.coerce.number().int().min(0).max(5, fr.validation.scoreInvalid),
  standardiser: z.coerce.number().int().min(0).max(5, fr.validation.scoreInvalid),
  maintenir: z.coerce.number().int().min(0).max(5, fr.validation.scoreInvalid),
  photos_before: z.any().optional(),
  photos_after: z.any().optional(),
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

export default function AuditForm({ mode, initialValues, zones, onSubmit, onCancel, isSubmitting }) {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    watch,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: initialValues,
  })

  const tri = watch('tri')
  const ranger = watch('ranger')
  const nettoyer = watch('nettoyer')
  const standardiser = watch('standardiser')
  const maintenir = watch('maintenir')

  useEffect(() => {
    reset(initialValues)
  }, [initialValues, reset])

  const submitHandler = (values) => {
    const parsed = auditSchema.safeParse(values)

    if (!parsed.success) {
      const errorMap = toErrorMap(parsed.error)
      Object.entries(errorMap).forEach(([field, error]) => {
        setError(field, error)
      })
      return
    }

    // Prepare FormData for photo upload
    const formData = new FormData()

    // Add numeric fields as-is (frontend stores as numbers)
    formData.append('zone_id', String(values.zone_id))
    formData.append('tri', String(values.tri))
    formData.append('ranger', String(values.ranger))
    formData.append('nettoyer', String(values.nettoyer))
    formData.append('standardiser', String(values.standardiser))
    formData.append('maintenir', String(values.maintenir))

    // Calculate total score
    const totalScore = Number(values.tri) + Number(values.ranger) + Number(values.nettoyer) + Number(values.standardiser) + Number(values.maintenir)
    formData.append('score', String(totalScore))

    // Add photos if they exist - use standard FormData array format
    if (Array.isArray(values.photos_before) && values.photos_before.length > 0) {
      values.photos_before.forEach((photo) => {
        if (photo.file) {
          formData.append('photos_before[]', photo.file)
        } else if (typeof photo === 'string') {
          formData.append('photos_before[]', photo)
        }
      })
    }

    if (Array.isArray(values.photos_after) && values.photos_after.length > 0) {
      values.photos_after.forEach((photo) => {
        if (photo.file) {
          formData.append('photos_after[]', photo.file)
        } else if (typeof photo === 'string') {
          formData.append('photos_after[]', photo)
        }
      })
    }

    onSubmit(formData)
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit(submitHandler)}>
      <div className="field">
        <label className="label" htmlFor="audit-zone-id">
          {fr.audits5s.form.zone}
        </label>
        {zones.length > 0 ? (
          <select id="audit-zone-id" className="select" {...register('zone_id')}>
            <option value="">{fr.audits5s.form.selectZone}</option>
            {zones.map((zone) => (
              <option key={zone.id} value={zone.id}>
                {zone.name}
              </option>
            ))}
          </select>
        ) : (
          <input id="audit-zone-id" type="number" className="input" {...register('zone_id')} />
        )}
        {errors.zone_id ? <p className="error-text">{errors.zone_id.message}</p> : null}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px' }}>
        <div className="field">
          <label className="label" htmlFor="audit-tri">
            {fr.audits5s.form.tri}
          </label>
          <input
            id="audit-tri"
            type="number"
            min="0"
            max="5"
            className="input"
            {...register('tri')}
            placeholder="0"
          />
          {errors.tri ? <p className="error-text">{errors.tri.message}</p> : null}
        </div>

        <div className="field">
          <label className="label" htmlFor="audit-ranger">
            {fr.audits5s.form.ranger}
          </label>
          <input
            id="audit-ranger"
            type="number"
            min="0"
            max="5"
            className="input"
            {...register('ranger')}
            placeholder="0"
          />
          {errors.ranger ? <p className="error-text">{errors.ranger.message}</p> : null}
        </div>

        <div className="field">
          <label className="label" htmlFor="audit-nettoyer">
            {fr.audits5s.form.nettoyer}
          </label>
          <input
            id="audit-nettoyer"
            type="number"
            min="0"
            max="5"
            className="input"
            {...register('nettoyer')}
            placeholder="0"
          />
          {errors.nettoyer ? <p className="error-text">{errors.nettoyer.message}</p> : null}
        </div>

        <div className="field">
          <label className="label" htmlFor="audit-standardiser">
            {fr.audits5s.form.standardiser}
          </label>
          <input
            id="audit-standardiser"
            type="number"
            min="0"
            max="5"
            className="input"
            {...register('standardiser')}
            placeholder="0"
          />
          {errors.standardiser ? <p className="error-text">{errors.standardiser.message}</p> : null}
        </div>

        <div className="field">
          <label className="label" htmlFor="audit-maintenir">
            {fr.audits5s.form.maintenir}
          </label>
          <input
            id="audit-maintenir"
            type="number"
            min="0"
            max="5"
            className="input"
            {...register('maintenir')}
            placeholder="0"
          />
          {errors.maintenir ? <p className="error-text">{errors.maintenir.message}</p> : null}
        </div>
      </div>

      <AuditScoreDisplay
        tri={tri}
        ranger={ranger}
        nettoyer={nettoyer}
        standardiser={standardiser}
        maintenir={maintenir}
      />

      <div className="field">
        <label className="label">{fr.audits5s.form.photoBefore || 'Photos Avant'}</label>
        <Controller
          name="photos_before"
          control={control}
          defaultValue={[]}
          render={({ field }) => (
            <AuditPhotoUploader
              label=""
              value={field.value}
              onChange={field.onChange}
              disabled={isSubmitting}
            />
          )}
        />
      </div>

      <div className="field">
        <label className="label">{fr.audits5s.form.photoAfter || 'Photos Après'}</label>
        <Controller
          name="photos_after"
          control={control}
          defaultValue={[]}
          render={({ field }) => (
            <AuditPhotoUploader
              label=""
              value={field.value}
              onChange={field.onChange}
              disabled={isSubmitting}
            />
          )}
        />
      </div>

      <div className="button-row" style={{ justifyContent: 'flex-end' }}>
        <ActionButton type="button" variant="ghost" onClick={onCancel}>
          {fr.audits5s.form.cancel}
        </ActionButton>
        <ActionButton type="submit" variant="primary" disabled={isSubmitting}>
          {isSubmitting ? fr.audits5s.form.saving || fr.common.messages.saving : mode === 'edit' ? fr.audits5s.form.updateButton : fr.audits5s.form.createButton}
        </ActionButton>
      </div>
    </form>
  )
}
