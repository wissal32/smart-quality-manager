import { Pencil, ThumbsDown, ThumbsUp, Trash2, User } from 'lucide-react'
import { fr } from '../../i18n/fr'
import ActionButton from '../ui/ActionButton'

export default function IdeaCard({ idea, onEdit, onDelete, onVote }) {
  const createdAtLabel = idea.created_at
    ? new Date(idea.created_at).toLocaleDateString()
    : '-'

  return (
    <article className="panel-card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div className="panel-row" style={{ justifyContent: 'space-between' }}>
        <span className="badge badge-info">{fr.ideas.card.votes}: {idea.votes || 0}</span>
        <span className="muted" style={{ fontSize: '0.85rem' }}>{createdAtLabel}</span>
      </div>

      <div>
        <h3 style={{ color: 'var(--text-strong)' }}>{idea.title}</h3>
        <p className="muted" style={{ marginTop: 8 }}>{idea.description || fr.ideas.card.noDescription}</p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            background: 'rgba(148, 163, 184, 0.22)',
            display: 'grid',
            placeItems: 'center',
          }}
        >
          <User size={14} />
        </div>
        <p className="muted" style={{ fontSize: '0.9rem' }}>
          {idea.authorName || `${fr.ideas.card.user} #${idea.created_by}`}
        </p>
      </div>

      <div className="panel-row" style={{ justifyContent: 'space-between', marginTop: 'auto' }}>
        <div className="panel-row" style={{ gap: 8 }}>
          <ActionButton variant="ghost" icon={ThumbsUp} onClick={() => onVote(idea, 1)}>
            {fr.ideas.card.upvote}
          </ActionButton>
          <ActionButton variant="ghost" icon={ThumbsDown} onClick={() => onVote(idea, -1)}>
            {fr.ideas.card.downvote}
          </ActionButton>
        </div>

        <div className="panel-row" style={{ gap: 8 }}>
          <ActionButton variant="ghost" icon={Pencil} onClick={() => onEdit(idea)}>
            {fr.common.buttons.edit}
          </ActionButton>
          <ActionButton variant="danger" icon={Trash2} onClick={() => onDelete(idea)}>
            {fr.common.buttons.delete}
          </ActionButton>
        </div>
      </div>
    </article>
  )
}
