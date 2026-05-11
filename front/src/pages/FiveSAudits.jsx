import { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Camera, Image as ImageIcon } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import api from '../services/api'
import { useAuthStore } from '../store/authStore'
import ActionButton from '../components/ui/ActionButton'

const STEPS = [
  { id: 'tri', label: 'Seiri (Trier)', title: '1. Seiri : Trier l\'utile de l\'inutile' },
  { id: 'ranger', label: 'Seiton (Ranger)', title: '2. Seiton : Ranger de façon rationnelle' },
  { id: 'nettoyer', label: 'Seiso (Nettoyer)', title: '3. Seiso : Nettoyer le poste de travail' },
  { id: 'standardiser', label: 'Seiketsu (Stand.)', title: '4. Seiketsu : Standardiser les règles' },
  { id: 'maintenir', label: 'Shitsuke (Main.)', title: '5. Shitsuke : Maintenir la rigueur' },
]

export default function FiveSAudits() {
  const { user } = useAuthStore()
  const [currentStep, setCurrentStep] = useState(0)
  
  // Local state for scores per step item
  const [scores, setScores] = useState({
    tri: { 1: null, 2: null },
    ranger: { 1: null, 2: null },      
    nettoyer: { 1: null, 2: null },
    standardiser: { 1: null, 2: null },
    maintenir: { 1: null, 2: null },
  })

  const { register, handleSubmit, formState: { isSubmitting } } = useForm({
    defaultValues: { zone_id: '1', date: new Date().toISOString().split('T')[0] }
  })

  const mutation = useMutation({
    mutationFn: async (payload) => {
      // Aggregate scores
      let totalScore = 0
      let maxPossible = 0
      Object.keys(scores).forEach(step => {
        Object.keys(scores[step]).forEach(item => {
          if (scores[step][item]) {
            totalScore += scores[step][item]
            maxPossible += 5
          }
        })
      })

      // We determine the boolean value based on if the average score for that step is >= 3
      const getStepPassed = (step) => {
        const vals = Object.values(scores[step]).filter(v => v !== null)
        if (vals.length === 0) return true // Default true
        const avg = vals.reduce((a, b) => a + b, 0) / vals.length
        return avg >= 3
      }

      const finalPayload = {
        zone_id: payload.zone_id,
        tri: getStepPassed('tri'),
        ranger: getStepPassed('ranger'),
        nettoyer: getStepPassed('nettoyer'),
        standardiser: getStepPassed('standardiser'),
        maintenir: getStepPassed('maintenir'),
        score: maxPossible ? Math.round((totalScore / maxPossible) * 100) : 100, // percentage
        created_by: user?.id,
      }

      const { data } = await api.post('/five-s-audits', finalPayload)
      return data
    },
    onSuccess: () => {
      toast.success('Audit 5S enregistré avec succès')
      setCurrentStep(0)
      setScores({
        tri: { 1: null, 2: null },
        ranger: { 1: null, 2: null },
        nettoyer: { 1: null, 2: null },
        standardiser: { 1: null, 2: null },
        maintenir: { 1: null, 2: null },
      })
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Erreur lors de la création')
    }
  })

  const handleScoreChange = (stepId, itemId, value) => {
    setScores(prev => ({
      ...prev,
      [stepId]: {
        ...prev[stepId],
        [itemId]: value
      }
    }))
  }

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1))
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0))

  const activeStepData = STEPS[currentStep]

  const ScoreButtons = ({ stepId, itemId }) => {
    const currentScore = scores[stepId][itemId]
    return (
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '16px', marginBottom: '16px' }}>
        <span className="muted" style={{ fontSize: '0.85rem', fontWeight: '700', marginRight: '8px' }}>SCORE :</span>
        {[1, 2, 3, 4, 5].map(val => (
          <button
            key={val}
            type="button"
            onClick={() => handleScoreChange(stepId, itemId, val)}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              border: currentScore === val ? '2px solid var(--primary)' : '1px solid var(--panel-border)',
              background: currentScore === val ? 'rgba(56, 189, 248, 0.12)' : 'transparent',
              color: currentScore === val ? 'var(--text-strong)' : 'var(--muted)',
              fontWeight: currentScore === val ? '700' : '400',
              cursor: 'pointer',
            }}
          >
            {val}
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className="page-grid">
      <div className="section-title">
        <div>
          <h2 className="page-title">Nouvel Audit 5S</h2>
        </div>
      </div>

      <form onSubmit={handleSubmit((d) => mutation.mutate(d))}>
        <motion.article className="panel-card" style={{ marginBottom: '24px' }} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--text-strong)' }}>Configuration de l'audit</h3>
              <p className="muted" style={{ fontSize: '0.9rem', marginTop: '4px' }}>Sélectionnez l'emplacement et définissez le contexte de l'inspection.</p>
            </div>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <label className="field" style={{ minWidth: '220px' }}>
                <span className="label">Zone de travail</span>
                <select className="select" {...register('zone_id')}>
                  <option value="1">Atelier de production A</option>
                  <option value="2">Entrepôt logistique B</option>
                  <option value="3">Zone de maintenance</option>
                </select>
              </label>
              <label className="field" style={{ minWidth: '180px' }}>
                <span className="label">Date</span>
                <input type="date" className="input" {...register('date')} />
              </label>
            </div>
          </div>
        </motion.article>

        <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '16px', marginBottom: '16px' }}>
          {STEPS.map((step, idx) => (
            <button
              key={step.id}
              type="button"
              onClick={() => setCurrentStep(idx)}
              style={{
                flex: 1,
                minWidth: '140px',
                padding: '16px',
                borderRadius: '16px',
                border: currentStep === idx ? '2px solid var(--primary)' : '1px solid var(--panel-border)',
                background: currentStep === idx ? 'rgba(56, 189, 248, 0.05)' : 'rgba(15, 23, 42, 0.4)',
                color: currentStep === idx ? 'var(--text-strong)' : 'var(--muted)',
                textAlign: 'left',
                cursor: 'pointer'
              }}
            >
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Étape {idx + 1}</div>
              <div style={{ fontWeight: '700', fontSize: '1rem' }}>{step.label}</div>
            </button>
          ))}
        </div>

        <motion.article className="panel-card" key={currentStep} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary)', color: '#04111d', display: 'grid', placeItems: 'center', fontWeight: '900', fontSize: '1.2rem' }}>
                {currentStep + 1}
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: '700', color: 'var(--text-strong)' }}>{activeStepData.title}</h3>
            </div>
            <div style={{ background: 'rgba(56, 189, 248, 0.12)', color: 'var(--primary)', padding: '6px 12px', borderRadius: '99px', fontSize: '0.85rem', fontWeight: '700' }}>
              En cours
            </div>
          </div>

          <div style={{ display: 'grid', gap: '40px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '32px' }}>
              <div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-strong)', marginBottom: '8px' }}>1.1 Point de contrôle A</h4>
                <p className="muted" style={{ fontSize: '0.9rem' }}>Vérifiez les éléments spécifiques relatifs à ce point de contrôle selon les standards établis.</p>
                <ScoreButtons stepId={activeStepData.id} itemId={1} />
                <textarea className="textarea" rows="3" placeholder="Observations ou écarts constatés..."></textarea>
              </div>
              <div>
                <h4 style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--muted)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Preuves photo (Avant/Après)</h4>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <div style={{ flex: 1, border: '1px dashed var(--panel-border)', borderRadius: '12px', height: '120px', display: 'grid', placeItems: 'center', cursor: 'pointer' }}>
                    <div style={{ textAlign: 'center', color: 'var(--muted)' }}><Camera size={24} style={{ margin: '0 auto 8px' }} /><span style={{ fontSize: '0.8rem' }}>AVANT</span></div>
                  </div>
                  <div style={{ flex: 1, border: '1px dashed var(--panel-border)', borderRadius: '12px', height: '120px', display: 'grid', placeItems: 'center', cursor: 'pointer' }}>
                    <div style={{ textAlign: 'center', color: 'var(--muted)' }}><ImageIcon size={24} style={{ margin: '0 auto 8px' }} /><span style={{ fontSize: '0.8rem' }}>APRÈS</span></div>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '32px', borderTop: '1px solid var(--panel-border)', paddingTop: '40px' }}>
              <div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-strong)', marginBottom: '8px' }}>1.2 Point de contrôle B</h4>
                <p className="muted" style={{ fontSize: '0.9rem' }}>Vérifiez les éléments spécifiques relatifs à ce point de contrôle selon les standards établis.</p>
                <ScoreButtons stepId={activeStepData.id} itemId={2} />
                <textarea className="textarea" rows="3" placeholder="Observations..."></textarea>
              </div>
              <div>
                <h4 style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--muted)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Preuves photo</h4>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <div style={{ flex: 1, border: '1px dashed var(--panel-border)', borderRadius: '12px', height: '120px', display: 'grid', placeItems: 'center', cursor: 'pointer' }}>
                    <div style={{ textAlign: 'center', color: 'var(--muted)' }}><Camera size={24} style={{ margin: '0 auto 8px' }} /><span style={{ fontSize: '0.8rem' }}>AVANT</span></div>
                  </div>
                  <div style={{ flex: 1, border: '1px dashed var(--panel-border)', borderRadius: '12px', height: '120px', display: 'grid', placeItems: 'center', cursor: 'pointer' }}>
                    <div style={{ textAlign: 'center', color: 'var(--muted)' }}><ImageIcon size={24} style={{ margin: '0 auto 8px' }} /><span style={{ fontSize: '0.8rem' }}>APRÈS</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="button-row" style={{ justifyContent: 'space-between', borderTop: '1px solid var(--panel-border)', paddingTop: '24px', marginTop: '40px' }}>
            <ActionButton type="button" variant="ghost" onClick={prevStep} disabled={currentStep === 0}>
              Retour
            </ActionButton>
            
            {currentStep < STEPS.length - 1 ? (
              <ActionButton type="button" variant="primary" onClick={nextStep}>
                Étape Suivante
              </ActionButton>
            ) : (
              <ActionButton type="submit" variant="primary" disabled={isSubmitting || mutation.isPending}>
                Terminer l'audit
              </ActionButton>
            )}
          </div>
        </motion.article>
      </form>
    </div>
  )
}
