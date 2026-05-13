import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { fr } from '../../i18n/fr'
import ActionButton from '../ui/ActionButton'

const incidentSchema = z.object({
  title: z.string().trim().min(3, fr.incidents.form.titleValidation),
  description: z.string().trim().min(5, fr.incidents.form.descriptionValidation),
  category: z.string().trim().min(2, fr.incidents.form.categoryValidation),
  location: z.string().trim().optional(),
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

export default function IncidentForm({ mode, initialValues, users, existingPhotos = [], onSubmit, onCancel, isSubmitting }) {
  const fileInputRef = useRef(null)
  const [selectedPhotos, setSelectedPhotos] = useState([])
  const [existingPhotosToRemove, setExistingPhotosToRemove] = useState([])
  
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
    setSelectedPhotos([])
    setExistingPhotosToRemove([])
  }, [initialValues, reset])

  const handlePhotoSelect = (e) => {
    const files = Array.from(e.target.files || [])
    setSelectedPhotos(prev => [...prev, ...files])
  }

  const removePhoto = (index) => {
    setSelectedPhotos(prev => prev.filter((_, i) => i !== index))
  }

  const removeExistingPhoto = (index) => {
    setExistingPhotosToRemove(prev => [...prev, index])
  }

  const submitHandler = (values) => {
    const parsed = incidentSchema.safeParse(values)

    if (!parsed.success) {
      const errorMap = toErrorMap(parsed.error)
      Object.entries(errorMap).forEach(([field, error]) => {
        setError(field, error)
      })
      return
    }

    // Create FormData to handle file uploads
    const formData = new FormData()
    Object.entries(parsed.data).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, value)
      }
    })

    // Append photo files
    selectedPhotos.forEach((photo, index) => {
      formData.append(`photos[${index}]`, photo)
    })

    onSubmit(formData)
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
          <label className="label" htmlFor="incident-location">Localisation du problème</label>
          <input id="incident-location" className="input" placeholder="Ex: Atelier 2, Côté gauche" {...register('location')} />
          {errors.location ? <p className="error-text">{errors.location.message}</p> : null}
        </div>
      </div>

      <div className="users-grid">
        <div className="field">
          <label className="label" htmlFor="incident-severity">{fr.incidents.form.severity}</label>
          <select id="incident-severity" className="select" {...register('severity')}>
            <option value="low">{fr.incidents.form.severityOptions.low}</option>
            <option value="medium">{fr.incidents.form.severityOptions.medium}</option>
            <option value="high">{fr.incidents.form.severityOptions.high}</option>
          </select>
          {errors.severity ? <p className="error-text">{errors.severity.message}</p> : null}
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
        <label className="label">Photos de l'incident</label>

        {existingPhotos.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: 8 }}>Photos existantes:</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: 8 }}>
              {existingPhotos.map((photo, idx) => (
                !existingPhotosToRemove.includes(idx) && (
                  <div
                    key={idx}
                    style={{
                      position: 'relative',
                      width: '100%',
                      aspectRatio: '1',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      background: '#f0f0f0',
                    }}
                  >
                    <img
                      src={photo.url}
                      alt={photo.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <button
                      type="button"
                      onClick={() => removeExistingPhoto(idx)}
                      style={{
                        position: 'absolute',
                        top: 4,
                        right: 4,
                        background: 'rgba(0,0,0,0.6)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '4px 8px',
                        cursor: 'pointer',
                        fontSize: '12px',
                      }}
                    >
                      ✕
                    </button>
                  </div>
                )
              ))}
            </div>
          </div>
        )}

        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: 8 }}>Ajouter des photos:</p>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handlePhotoSelect}
          className="input"
          style={{ display: 'none' }}
        />
        <ActionButton
          type="button"
          variant="ghost"
          onClick={() => fileInputRef.current?.click()}
        >
          + Ajouter des photos
        </ActionButton>
        
        {selectedPhotos.length > 0 && (
          <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: 8 }}>
            {selectedPhotos.map((photo, idx) => (
              <div
                key={idx}
                style={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '1',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  background: '#f0f0f0',
                }}
              >
                <img
                  src={URL.createObjectURL(photo)}
                  alt={`Preview ${idx}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <button
                  type="button"
                  onClick={() => removePhoto(idx)}
                  style={{
                    position: 'absolute',
                    top: 4,
                    right: 4,
                    background: 'rgba(0,0,0,0.6)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '4px 8px',
                    cursor: 'pointer',
                    fontSize: '12px',
                  }}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
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
