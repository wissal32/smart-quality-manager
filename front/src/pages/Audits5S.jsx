import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Award, Plus, Eye } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuthStore } from '../store/authStore'
import ActionButton from '../components/ui/ActionButton'
import AuditTable from '../components/audits/AuditTable'
import AuditForm from '../components/audits/AuditForm'
import { createAudit, deleteAudit, listAudits, updateAudit } from '../services/auditService'
import { listZones } from '../services/zonesService'
import { listUsers } from '../services/userService'

const defaultFormValues = {
  zone_id: '',
  tri: '',
  ranger: '',
  nettoyer: '',
  standardiser: '',
  maintenir: '',
  photos_before: [],
  photos_after: [],
}

// Helper function to safely parse and get photos as array
function getSafePhotos(photos) {
  if (Array.isArray(photos)) {
    return photos
  }
  if (typeof photos === 'string' && photos) {
    try {
      const parsed = JSON.parse(photos)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  }
  return []
}

function normalizeAudit(item) {
  // Parse JSON strings for photos if needed
  let photosBefore = []
  let photosAfter = []

  if (typeof item.photos_before === 'string' && item.photos_before) {
    try {
      photosBefore = JSON.parse(item.photos_before)
    } catch {
      photosBefore = []
    }
  } else if (Array.isArray(item.photos_before)) {
    photosBefore = item.photos_before
  }

  if (typeof item.photos_after === 'string' && item.photos_after) {
    try {
      photosAfter = JSON.parse(item.photos_after)
    } catch {
      photosAfter = []
    }
  } else if (Array.isArray(item.photos_after)) {
    photosAfter = item.photos_after
  }

  return {
    ...item,
    photos_before: photosBefore,
    photos_after: photosAfter,
    zone: item.zone || { id: item.zone_id, name: `Zone #${item.zone_id}` },
    createdBy: item.createdBy || { id: item.created_by, name: `User #${item.created_by}` },
  }
}

export default function Audits5S() {
  const queryClient = useQueryClient()
  const user = useAuthStore((state) => state.user)
  const [search, setSearch] = useState('')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [formMode, setFormMode] = useState('create')
  const [editingAudit, setEditingAudit] = useState(null)
  const [viewingAudit, setViewingAudit] = useState(null)

  const { data: audits = [], isLoading } = useQuery({
    queryKey: ['audits'],
    queryFn: async () => {
      const data = await listAudits()
      return data.map(normalizeAudit)
    },
  })

  const { data: zonesFromApi = [] } = useQuery({
    queryKey: ['zones', 'for-audits'],
    queryFn: async () => {
      try {
        return await listZones()
      } catch {
        return []
      }
    },
  })

  const { data: usersFromApi = [] } = useQuery({
    queryKey: ['users', 'for-audits'],
    queryFn: async () => {
      try {
        return await listUsers()
      } catch {
        return []
      }
    },
  })

  const zones = useMemo(() => {
    const byId = new Map()
    zonesFromApi.forEach((zone) => {
      byId.set(zone.id, zone)
    })
    audits.forEach((item) => {
      if (item.zone?.id && !byId.has(item.zone.id)) {
        byId.set(item.zone.id, item.zone)
      }
    })
    return Array.from(byId.values())
  }, [audits, zonesFromApi])

  const filteredAudits = useMemo(() => {
    return audits.filter((item) => {
      const zoneName = item.zone?.name || `Zone #${item.zone_id}`
      const creatorName = item.createdBy?.name || `User #${item.created_by}`
      const matchesSearch =
        search.trim().length === 0 ||
        zoneName.toLowerCase().includes(search.toLowerCase()) ||
        creatorName.toLowerCase().includes(search.toLowerCase())
      return matchesSearch
    })
  }, [audits, search])

  const stats = useMemo(() => {
    const totalAudits = audits.length
    const averageScore = audits.length > 0
      ? (audits.reduce((sum, a) => sum + (Number(a.score) || 0), 0) / audits.length).toFixed(1)
      : 0

    return {
      total: totalAudits,
      averageScore,
    }
  }, [audits])

  const createMutation = useMutation({
    mutationFn: (payload) => createAudit(payload),
    onSuccess: () => {
      toast.success('Audit created successfully.')
      queryClient.invalidateQueries({ queryKey: ['audits'] })
      setIsFormOpen(false)
      setEditingAudit(null)
      setFormMode('create')
    },
    onError: (error) => {
      const errorMsg = error?.response?.data?.message || error?.message || 'Failed to create audit.'
      toast.error(errorMsg)
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => updateAudit(id, payload),
    onSuccess: () => {
      toast.success('Audit updated successfully.')
      queryClient.invalidateQueries({ queryKey: ['audits'] })
      setIsFormOpen(false)
      setEditingAudit(null)
      setFormMode('create')
    },
    onError: (error) => {
      const errorMsg = error?.response?.data?.message || error?.message || 'Failed to update audit.'
      toast.error(errorMsg)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteAudit(id),
    onSuccess: () => {
      toast.success('Audit deleted successfully.')
      queryClient.invalidateQueries({ queryKey: ['audits'] })
    },
    onError: (error) => {
      const errorMsg = error?.response?.data?.message || error?.message || 'Failed to delete audit.'
      toast.error(errorMsg)
    },
  })

  const formInitialValues = useMemo(() => {
    if (!editingAudit) return defaultFormValues

    return {
      zone_id: editingAudit.zone_id ? String(editingAudit.zone_id) : '',
      tri: String(editingAudit.tri || ''),
      ranger: String(editingAudit.ranger || ''),
      nettoyer: String(editingAudit.nettoyer || ''),
      standardiser: String(editingAudit.standardiser || ''),
      maintenir: String(editingAudit.maintenir || ''),
      photos_before: editingAudit.photos_before || [],
      photos_after: editingAudit.photos_after || [],
    }
  }, [editingAudit])

  const openCreateModal = () => {
    setFormMode('create')
    setEditingAudit(null)
    setIsFormOpen(true)
  }

  const openEditModal = (audit) => {
    setFormMode('edit')
    setEditingAudit(audit)
    setIsFormOpen(true)
  }

  const openViewModal = (audit) => {
    setViewingAudit(audit)
  }

  const closeForm = () => {
    setIsFormOpen(false)
    setEditingAudit(null)
    setFormMode('create')
  }

  const closeViewModal = () => {
    setViewingAudit(null)
  }

  const handleDelete = (audit) => {
    const zoneName = audit.zone?.name || `Zone #${audit.zone_id}`
    const confirmed = window.confirm(`Delete audit for "${zoneName}"? This action cannot be undone.`)
    if (!confirmed) return
    deleteMutation.mutate(audit.id)
  }

  const handleSubmitForm = (formData) => {
    if (!user?.id) {
      toast.error('You must be authenticated to manage audits.')
      return
    }

    // Ensure created_by is set
    if (typeof formData.entries === 'function') {
      formData.append('created_by', String(user.id))
    } else {
      formData.created_by = user.id
    }

    if (formMode === 'create') {
      createMutation.mutate(formData)
      return
    }

    if (!editingAudit?.id) {
      toast.error('No audit selected for update.')
      return
    }

    updateMutation.mutate({
      id: editingAudit.id,
      payload: formData,
    })
  }

  return (
    <div className="page-grid">
      <motion.section className="page-card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="page-row" style={{ justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div>
            <p className="page-kicker">Quality Management</p>
            <h2 className="page-title" style={{ marginTop: 8 }}>
              5S Audits
            </h2>
            <p className="page-copy">
              Evaluate workplace organization using the 5S methodology with automatic score calculation.
            </p>
          </div>
          <ActionButton variant="primary" icon={Plus} onClick={openCreateModal}>
            Create Audit
          </ActionButton>
        </div>

        <div className="field" style={{ marginTop: 16 }}>
          <label className="label" htmlFor="audit-search">
            Search
          </label>
          <input
            id="audit-search"
            className="input"
            placeholder="Search by zone or creator"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
      </motion.section>

      <section className="stats-grid">
        <motion.article className="metric-card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <p className="card-kicker">Total Audits</p>
          <div className="panel-row" style={{ justifyContent: 'space-between', marginTop: 10 }}>
            <p className="stat-value" style={{ fontSize: '2.1rem' }}>
              {stats.total}
            </p>
            <div className="stat-icon" style={{ background: 'rgba(56, 189, 248, 0.16)', color: '#93c5fd' }}>
              <Award size={22} />
            </div>
          </div>
        </motion.article>
        <motion.article className="metric-card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <p className="card-kicker">Average Score</p>
          <div className="panel-row" style={{ justifyContent: 'space-between', marginTop: 10 }}>
            <p className="stat-value" style={{ fontSize: '2.1rem' }}>
              {stats.averageScore}
            </p>
            <div className="stat-icon" style={{ background: 'rgba(34, 197, 94, 0.16)', color: '#86efac' }}>
              <Award size={22} />
            </div>
          </div>
        </motion.article>
      </section>

      <motion.section className="panel-card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ padding: 0, overflow: 'hidden' }}>
        <div className="panel-row" style={{ justifyContent: 'space-between', padding: 20, borderBottom: '1px solid var(--panel-border)' }}>
          <h3 style={{ color: 'var(--text-strong)' }}>Audits</h3>
          <span className="muted">{filteredAudits.length} visible items</span>
        </div>

        <AuditTable
          audits={filteredAudits}
          isLoading={isLoading}
          onView={openViewModal}
          onEdit={openEditModal}
          onDelete={handleDelete}
        />
      </motion.section>

      {isFormOpen ? (
        <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Audit form dialog">
          <motion.section className="modal-card" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
            <div className="panel-row" style={{ justifyContent: 'space-between' }}>
              <div>
                <p className="card-kicker">{formMode === 'edit' ? 'Edit Audit' : 'Create Audit'}</p>
                <h3 style={{ color: 'var(--text-strong)', marginTop: 6 }}>
                  {formMode === 'edit' ? 'Update audit details' : 'Create a new 5S audit'}
                </h3>
              </div>
              <ActionButton variant="ghost" onClick={closeForm}>
                Close
              </ActionButton>
            </div>

            <AuditForm
              mode={formMode}
              initialValues={formInitialValues}
              zones={zones}
              isSubmitting={createMutation.isPending || updateMutation.isPending}
              onSubmit={handleSubmitForm}
              onCancel={closeForm}
            />
          </motion.section>
        </div>
      ) : null}

      {viewingAudit ? (
        <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Audit details dialog" onClick={closeViewModal}>
          <motion.section className="modal-card" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} onClick={(e) => e.stopPropagation()}>
            <div className="panel-row" style={{ justifyContent: 'space-between' }}>
              <div>
                <p className="card-kicker">Audit Details</p>
                <h3 style={{ color: 'var(--text-strong)', marginTop: 6 }}>
                  {viewingAudit.zone?.name || `Zone #${viewingAudit.zone_id}`}
                </h3>
              </div>
              <ActionButton variant="ghost" onClick={closeViewModal}>
                Close
              </ActionButton>
            </div>

            <div style={{ marginTop: 24 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
                <div>
                  <p className="muted" style={{ fontSize: '0.85rem', marginBottom: 8 }}>Zone</p>
                  <p style={{ fontWeight: 700, color: 'var(--text-strong)' }}>
                    {viewingAudit.zone?.name || `Zone #${viewingAudit.zone_id}`}
                  </p>
                </div>
                <div>
                  <p className="muted" style={{ fontSize: '0.85rem', marginBottom: 8 }}>Created By</p>
                  <p style={{ fontWeight: 700, color: 'var(--text-strong)' }}>
                    {viewingAudit.createdBy?.name || `User #${viewingAudit.created_by}`}
                  </p>
                </div>
                <div>
                  <p className="muted" style={{ fontSize: '0.85rem', marginBottom: 8 }}>Total Score</p>
                  <p style={{ fontWeight: 900, color: 'var(--text-strong)', fontSize: '1.4rem' }}>
                    {viewingAudit.score ? `${viewingAudit.score} / 25` : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="muted" style={{ fontSize: '0.85rem', marginBottom: 8 }}>Created Date</p>
                  <p style={{ fontWeight: 700, color: 'var(--text-strong)' }}>
                    {viewingAudit.created_at ? new Date(viewingAudit.created_at).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--panel-border)', paddingTop: 24 }}>
                <h4 style={{ fontWeight: 700, color: 'var(--text-strong)', marginBottom: 16 }}>5S Scores</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: 16 }}>
                  <div style={{ textAlign: 'center', padding: '12px', background: 'rgba(56, 189, 248, 0.05)', borderRadius: '8px' }}>
                    <p className="muted" style={{ fontSize: '0.8rem', marginBottom: 6 }}>Tri (Sort)</p>
                    <p style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--primary)' }}>
                      {viewingAudit.tri || '-'}
                    </p>
                  </div>
                  <div style={{ textAlign: 'center', padding: '12px', background: 'rgba(56, 189, 248, 0.05)', borderRadius: '8px' }}>
                    <p className="muted" style={{ fontSize: '0.8rem', marginBottom: 6 }}>Ranger (Order)</p>
                    <p style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--primary)' }}>
                      {viewingAudit.ranger || '-'}
                    </p>
                  </div>
                  <div style={{ textAlign: 'center', padding: '12px', background: 'rgba(56, 189, 248, 0.05)', borderRadius: '8px' }}>
                    <p className="muted" style={{ fontSize: '0.8rem', marginBottom: 6 }}>Nettoyer (Shine)</p>
                    <p style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--primary)' }}>
                      {viewingAudit.nettoyer || '-'}
                    </p>
                  </div>
                  <div style={{ textAlign: 'center', padding: '12px', background: 'rgba(56, 189, 248, 0.05)', borderRadius: '8px' }}>
                    <p className="muted" style={{ fontSize: '0.8rem', marginBottom: 6 }}>Standardiser</p>
                    <p style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--primary)' }}>
                      {viewingAudit.standardiser || '-'}
                    </p>
                  </div>
                  <div style={{ textAlign: 'center', padding: '12px', background: 'rgba(56, 189, 248, 0.05)', borderRadius: '8px' }}>
                    <p className="muted" style={{ fontSize: '0.8rem', marginBottom: 6 }}>Maintenir (Sustain)</p>
                    <p style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--primary)' }}>
                      {viewingAudit.maintenir || '-'}
                    </p>
                  </div>
                </div>
              </div>

              {(() => {
                const photosBefore = getSafePhotos(viewingAudit.photos_before)
                const photosAfter = getSafePhotos(viewingAudit.photos_after)
                
                return (photosBefore.length > 0 || photosAfter.length > 0) ? (
                  <div style={{ borderTop: '1px solid var(--panel-border)', paddingTop: 24, marginTop: 24 }}>
                    {photosBefore.length > 0 && (
                      <div style={{ marginBottom: 24 }}>
                        <h4 style={{ fontWeight: 700, color: 'var(--text-strong)', marginBottom: 12 }}>Photos Before</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 12 }}>
                          {photosBefore.map((photo, idx) => (
                            <img
                              key={idx}
                              src={photo}
                              alt={`Before ${idx}`}
                              style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '8px' }}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {photosAfter.length > 0 && (
                      <div>
                        <h4 style={{ fontWeight: 700, color: 'var(--text-strong)', marginBottom: 12 }}>Photos After</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 12 }}>
                          {photosAfter.map((photo, idx) => (
                            <img
                              key={idx}
                              src={photo}
                              alt={`After ${idx}`}
                              style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '8px' }}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : null
              })()}
            </div>
          </motion.section>
        </div>
      ) : null}
    </div>
  )
}
