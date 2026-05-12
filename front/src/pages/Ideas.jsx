import { useMemo, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Lightbulb, Plus, ThumbsUp } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuthStore } from '../store/authStore'
import { fr } from '../i18n/fr'
import ActionButton from '../components/ui/ActionButton'
import IdeaCard from '../components/ideas/IdeaCard'
import IdeaForm from '../components/ideas/IdeaForm'
import { createIdea, deleteIdea, listIdeas, updateIdea } from '../services/ideaService.ts'

const defaultFormValues = {
  title: '',
  description: '',
}

function normalizeIdea(item) {
  return {
    ...item,
    authorName: item.createdBy?.name || item.created_by?.name || '',
  }
}

export default function Ideas() {
  const queryClient = useQueryClient()
  const user = useAuthStore((state) => state.user)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [formMode, setFormMode] = useState('create')
  const [editingIdea, setEditingIdea] = useState(null)
  const [search, setSearch] = useState('')

  const { data: ideas = [], isLoading } = useQuery({
    queryKey: ['ideas'],
    queryFn: async () => {
      const data = await listIdeas()
      return data.map(normalizeIdea)
    },
  })

  const stats = useMemo(() => {
    const totalIdeas = ideas.length
    const totalVotes = ideas.reduce((acc, item) => acc + (item.votes || 0), 0)
    const mine = user?.id ? ideas.filter((item) => item.created_by === user.id).length : 0
    return { totalIdeas, totalVotes, mine }
  }, [ideas, user?.id])

  const filteredIdeas = useMemo(() => {
    return ideas.filter((item) => {
      if (!search.trim()) return true
      return (
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        (item.description || '').toLowerCase().includes(search.toLowerCase())
      )
    })
  }, [ideas, search])

  const createMutation = useMutation({
    mutationFn: (payload) => createIdea(payload),
    onSuccess: () => {
      toast.success(fr.ideas.messages.submitSuccess)
      queryClient.invalidateQueries({ queryKey: ['ideas'] })
      setIsFormOpen(false)
      setEditingIdea(null)
      setFormMode('create')
    },
    onError: (error) => {
      toast.error(error?.message || fr.ideas.messages.submitError)
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => updateIdea(id, payload),
    onSuccess: () => {
      toast.success(fr.ideas.messages.updateSuccess)
      queryClient.invalidateQueries({ queryKey: ['ideas'] })
      setIsFormOpen(false)
      setEditingIdea(null)
      setFormMode('create')
    },
    onError: (error) => {
      toast.error(error?.message || fr.ideas.messages.updateError)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteIdea(id),
    onSuccess: () => {
      toast.success(fr.ideas.messages.deleteSuccess)
      queryClient.invalidateQueries({ queryKey: ['ideas'] })
    },
    onError: (error) => {
      toast.error(error?.message || fr.ideas.messages.deleteError)
    },
  })

  const voteMutation = useMutation({
    mutationFn: ({ id, votes }) => updateIdea(id, { votes }),
    onMutate: async ({ id, votes }) => {
      await queryClient.cancelQueries({ queryKey: ['ideas'] })
      const previousIdeas = queryClient.getQueryData(['ideas'])

      queryClient.setQueryData(['ideas'], (current = []) =>
        current.map((item) => (item.id === id ? { ...item, votes } : item)),
      )

      return { previousIdeas }
    },
    onError: (error, _variables, context) => {
      if (context?.previousIdeas) {
        queryClient.setQueryData(['ideas'], context.previousIdeas)
      }
      toast.error(error?.message || fr.ideas.messages.updateVotesError)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['ideas'] })
    },
  })

  const formInitialValues = useMemo(() => {
    if (!editingIdea) return defaultFormValues

    return {
      title: editingIdea.title || '',
      description: editingIdea.description || '',
    }
  }, [editingIdea])

  const openCreateModal = () => {
    setFormMode('create')
    setEditingIdea(null)
    setIsFormOpen(true)
  }

  const openEditModal = (idea) => {
    setFormMode('edit')
    setEditingIdea(idea)
    setIsFormOpen(true)
  }

  const closeForm = () => {
    setIsFormOpen(false)
    setEditingIdea(null)
    setFormMode('create')
  }

  const handleDelete = (idea) => {
    const confirmed = window.confirm(fr.ideas.messages.deleteConfirm.replace('{title}', idea.title))
    if (!confirmed) return
    deleteMutation.mutate(idea.id)
  }

  const handleVote = (idea, increment) => {
    const nextVotes = Math.max(0, (idea.votes || 0) + increment)
    voteMutation.mutate({ id: idea.id, votes: nextVotes })
  }

  const handleSubmitForm = (values) => {
    if (!user?.id) {
      toast.error(fr.ideas.messages.notAuthenticated)
      return
    }

    if (formMode === 'create') {
      createMutation.mutate({
        title: values.title,
        description: values.description,
        status: 'pending',
        votes: 0,
        created_by: Number(user.id),
      })
      return
    }

    if (!editingIdea?.id) {
      toast.error(fr.ideas.messages.noSelection)
      return
    }

    updateMutation.mutate({
      id: editingIdea.id,
      payload: {
        title: values.title,
        description: values.description,
      },
    })
  }

  return (
    <div className="page-grid">
      <motion.section className="page-card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="page-row" style={{ justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div>
            <p className="page-kicker">{fr.ideas.title}</p>
            <h2 className="page-title" style={{ marginTop: 8 }}>{fr.ideas.subtitle}</h2>
            <p className="page-copy">{fr.ideas.description}</p>
          </div>
          <ActionButton variant="primary" icon={Plus} onClick={openCreateModal}>
            {fr.ideas.submitIdea}
          </ActionButton>
        </div>

        <div className="users-grid" style={{ marginTop: 16 }}>
          <div className="field">
            <label className="label" htmlFor="idea-search">Rechercher</label>
            <input
              id="idea-search"
              className="input"
              placeholder={fr.ideas.filters.search}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <div className="field">
            <label className="label">{fr.ideas.filters.visibleIdeas}</label>
            <div className="input" style={{ display: 'flex', alignItems: 'center' }}>
              {filteredIdeas.length}
            </div>
          </div>
        </div>
      </motion.section>

      <section className="stats-grid">
        <motion.article className="metric-card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <p className="card-kicker">{fr.ideas.stats.totalIdeas}</p>
          <div className="panel-row" style={{ justifyContent: 'space-between', marginTop: 10 }}>
            <p className="stat-value" style={{ fontSize: '2.1rem' }}>{stats.totalIdeas}</p>
            <div className="stat-icon" style={{ background: 'rgba(56, 189, 248, 0.16)', color: '#7dd3fc' }}>
              <Lightbulb size={22} />
            </div>
          </div>
        </motion.article>
        <motion.article className="metric-card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <p className="card-kicker">{fr.ideas.stats.myIdeas}</p>
          <div className="panel-row" style={{ justifyContent: 'space-between', marginTop: 10 }}>
            <p className="stat-value" style={{ fontSize: '2.1rem' }}>{stats.mine}</p>
            <div className="stat-icon" style={{ background: 'rgba(34, 197, 94, 0.16)', color: '#86efac' }}>
              <Lightbulb size={22} />
            </div>
          </div>
        </motion.article>
        <motion.article className="metric-card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <p className="card-kicker">{fr.ideas.stats.totalVotes}</p>
          <div className="panel-row" style={{ justifyContent: 'space-between', marginTop: 10 }}>
            <p className="stat-value" style={{ fontSize: '2.1rem' }}>{stats.totalVotes}</p>
            <div className="stat-icon" style={{ background: 'rgba(59, 130, 246, 0.16)', color: '#93c5fd' }}>
              <ThumbsUp size={22} />
            </div>
          </div>
        </motion.article>
      </section>

      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 18,
        }}
      >
        {isLoading ? (
          <article className="panel-card">
            <p className="muted">{fr.common.messages.loading}</p>
          </article>
        ) : filteredIdeas.length > 0 ? (
          filteredIdeas.map((idea) => (
            <IdeaCard
              key={idea.id}
              idea={idea}
              onEdit={openEditModal}
              onDelete={handleDelete}
              onVote={handleVote}
            />
          ))
        ) : (
          <article className="panel-card">
            <p className="muted">{fr.common.messages.noData}</p>
          </article>
        )}
      </section>

      {isFormOpen ? (
        <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Idea form dialog">
          <motion.section className="modal-card" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
            <div className="panel-row" style={{ justifyContent: 'space-between' }}>
              <div>
                <p className="card-kicker">{formMode === 'edit' ? fr.ideas.form.editTitle : fr.ideas.form.createTitle}</p>
                <h3 style={{ color: 'var(--text-strong)', marginTop: 6 }}>
                  {formMode === 'edit' ? fr.ideas.form.editTitle : fr.ideas.form.createTitle}
                </h3>
              </div>
              <ActionButton variant="ghost" onClick={closeForm}>
                {fr.common.buttons.close}
              </ActionButton>
            </div>

            <IdeaForm
              mode={formMode}
              initialValues={formInitialValues}
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
