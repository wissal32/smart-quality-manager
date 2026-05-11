import { Pencil, ThumbsDown, ThumbsUp, Trash2, User } from 'lucide-react'
import ActionButton from '../ui/ActionButton'

export default function IdeaCard({ idea, onEdit, onDelete, onVote }) {
  const createdAtLabel = idea.created_at
    ? new Date(idea.created_at).toLocaleDateString()
    : '-'

  return (
    <article className="panel-card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div className="panel-row" style={{ justifyContent: 'space-between' }}>
        <span className="badge badge-info">Votes: {idea.votes || 0}</span>
        <span className="muted" style={{ fontSize: '0.85rem' }}>{createdAtLabel}</span>
      </div>

      <div>
        <h3 style={{ color: 'var(--text-strong)' }}>{idea.title}</h3>
        <p className="muted" style={{ marginTop: 8 }}>{idea.description || 'No description'}</p>
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
          {idea.authorName || `User #${idea.created_by}`}
        </p>
      </div>

      <div className="panel-row" style={{ justifyContent: 'space-between', marginTop: 'auto' }}>
        <div className="panel-row" style={{ gap: 8 }}>
          <ActionButton variant="ghost" icon={ThumbsUp} onClick={() => onVote(idea, 1)}>
            Upvote
          </ActionButton>
          <ActionButton variant="ghost" icon={ThumbsDown} onClick={() => onVote(idea, -1)}>
            Downvote
          </ActionButton>
        </div>

        <div className="panel-row" style={{ gap: 8 }}>
          <ActionButton variant="ghost" icon={Pencil} onClick={() => onEdit(idea)}>
            Edit
          </ActionButton>
          <ActionButton variant="danger" icon={Trash2} onClick={() => onDelete(idea)}>
            Delete
          </ActionButton>
        </div>
      </div>
    </article>
  )
}
