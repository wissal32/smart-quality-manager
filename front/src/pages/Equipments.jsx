import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Edit3, Plus, Trash2, Wrench } from 'lucide-react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { z } from 'zod'
import { fr } from '../i18n/fr'
import api from '../services/api'
import { getStatusBadgeClass } from '../utils/stats'

const equipmentSchema = z.object({
  name: z.string().min(1, fr.equipments.form.nameValidation),
  type: z.string().min(1, fr.equipments.form.typeValidation),
  serial_number: z.string().min(1, fr.equipments.form.serialNumberValidation),
  status: z.enum(['working', 'broken', 'maintenance']),
  qr_code: z.string().optional().or(z.literal('')),
  last_maintenance: z.string().optional().or(z.literal('')),
})

const defaultValues = {
  name: '',
  type: '',
  serial_number: '',
  status: 'working',
  qr_code: '',
  last_maintenance: '',
}

export default function Equipments() {
  const queryClient = useQueryClient()
  const [editingEquipment, setEditingEquipment] = useState(null)

  const { data, isLoading } = useQuery({
    queryKey: ['equipments'],
    queryFn: async () => {
      const { data } = await api.get('/equipments')
      return data.data
    },
  })

  const { register, handleSubmit, reset, setValue, setError, clearErrors, formState: { errors, isSubmitting } } = useForm({
    defaultValues,
  })

  const stats = useMemo(() => {
    const total = data?.length || 0
    const working = data?.filter((item) => item.status === 'working').length || 0
    return { total, working }
  }, [data])

  const mutation = useMutation({
    mutationFn: async (payload) => {
      if (editingEquipment) {
        const { data } = await api.put(`/equipments/${editingEquipment.id}`, payload)
        return data.data
      }

      const { data } = await api.post('/equipments', payload)
      return data.data
    },
    onSuccess: () => {
      toast.success(editingEquipment ? fr.equipments.messages.equipmentUpdated : fr.equipments.messages.equipmentCreated)
      queryClient.invalidateQueries({ queryKey: ['equipments'] })
      setEditingEquipment(null)
      reset(defaultValues)
    },
    onError: (error) => {
      toast.error(error?.message || fr.equipments.messages.unableToSave)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await api.delete(`/equipments/${id}`)
    },
    onSuccess: () => {
      toast.success(fr.equipments.messages.deleteSuccess)
      queryClient.invalidateQueries({ queryKey: ['equipments'] })
    },
    onError: (error) => {
      toast.error(error?.message || fr.equipments.messages.unableToDelete)
    },
  })

  const onSubmit = async (values) => {
    clearErrors()

    const parsed = equipmentSchema.safeParse(values)

    if (!parsed.success) {
      parsed.error.issues.forEach((issue) => {
        const field = issue.path[0]
        if (typeof field === 'string') {
          setError(field, { type: 'manual', message: issue.message })
        }
      })
      return
    }

    mutation.mutate(parsed.data)
  }

  const startEdit = (equipment) => {
    setEditingEquipment(equipment)
    setValue('name', equipment.name ?? '')
    setValue('type', equipment.type ?? '')
    setValue('serial_number', equipment.serial_number ?? '')
    setValue('status', equipment.status ?? 'working')
    setValue('qr_code', equipment.qr_code ?? '')
    setValue('last_maintenance', equipment.last_maintenance ?? '')
  }

  const cancelEdit = () => {
    setEditingEquipment(null)
    reset(defaultValues)
  }

  return (
    <div className="page-grid">
      <section className="stats-grid">
        <motion.article className="metric-card stat-card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <div className="stat-icon" style={{ background: 'rgba(56, 189, 248, 0.12)', color: '#38bdf8' }}>
            <Wrench size={18} />
          </div>
          <div>
            <div className="muted" style={{ fontSize: '0.9rem' }}>
              Total equipments
            </div>
            <div className="stat-value">{isLoading ? '...' : stats.total}</div>
          </div>
        </motion.article>

        <motion.article className="metric-card stat-card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <div className="stat-icon" style={{ background: 'rgba(34, 197, 94, 0.12)', color: '#22c55e' }}>
            <Wrench size={18} />
          </div>
          <div>
            <div className="muted" style={{ fontSize: '0.9rem' }}>
              Working units
            </div>
            <div className="stat-value">{isLoading ? '...' : stats.working}</div>
          </div>
        </motion.article>
      </section>

      <section className="charts-grid">
        <motion.article className="panel-card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <div className="section-title">
            <div>
              <div className="card-kicker">Equipment form</div>
              <h2 className="page-title" style={{ marginTop: 8 }}>
                {editingEquipment ? 'Edit equipment' : 'Add equipment'}
              </h2>
            </div>
            <Wrench size={20} color="#38bdf8" />
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="auth-form" style={{ marginTop: 18 }}>
            <div className="equipment-grid">
              <label className="field">
                <span className="label">Name</span>
                <input className="input" {...register('name')} />
                {errors.name && <span className="error-text">{errors.name.message}</span>}
              </label>
              <label className="field">
                <span className="label">Type</span>
                <input className="input" {...register('type')} />
                {errors.type && <span className="error-text">{errors.type.message}</span>}
              </label>
              <label className="field">
                <span className="label">Serial number</span>
                <input className="input" {...register('serial_number')} />
                {errors.serial_number && <span className="error-text">{errors.serial_number.message}</span>}
              </label>
              <label className="field">
                <span className="label">Status</span>
                <select className="select" {...register('status')}>
                  <option value="working">Working</option>
                  <option value="broken">Broken</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </label>
              <label className="field">
                <span className="label">QR code</span>
                <input className="input" {...register('qr_code')} />
              </label>
              <label className="field">
                <span className="label">Last maintenance</span>
                <input className="input" type="date" {...register('last_maintenance')} />
              </label>
            </div>

            <div className="button-row" style={{ justifyContent: 'flex-end', flexWrap: 'wrap' }}>
              {editingEquipment && (
                <button type="button" className="btn btn-ghost" onClick={cancelEdit}>
                  Cancel
                </button>
              )}
              <button type="submit" className="btn btn-primary" disabled={isSubmitting || mutation.isPending}>
                <Plus size={16} />
                {editingEquipment ? 'Update equipment' : 'Create equipment'}
              </button>
            </div>
          </form>
        </motion.article>

        <motion.article className="panel-card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <div className="section-title">
            <div>
              <div className="card-kicker">Inventory</div>
              <h2 className="page-title" style={{ marginTop: 8 }}>
                Equipment list
              </h2>
            </div>
          </div>

          <div className="table-wrap" style={{ marginTop: 18 }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Serial</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan="5" className="muted">Loading equipments...</td>
                  </tr>
                ) : data?.length ? (
                  data.map((equipment) => (
                    <tr key={equipment.id}>
                      <td>{equipment.name}</td>
                      <td>{equipment.type}</td>
                      <td>{equipment.serial_number}</td>
                      <td>
                        <span className={getStatusBadgeClass(equipment.status)}>{equipment.status}</span>
                      </td>
                      <td>
                        <div className="table-action-row">
                          <button type="button" className="btn btn-ghost" onClick={() => startEdit(equipment)}>
                            <Edit3 size={14} />
                          </button>
                          <button type="button" className="btn btn-danger" onClick={() => deleteMutation.mutate(equipment.id)}>
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="muted">No equipments found.</td>
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