import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { LockKeyhole, LogIn, ShieldCheck } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { useAuthStore } from '../store/authStore'

const loginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
})

export default function Login() {
  const navigate = useNavigate()
  const login = useAuthStore((state) => state.login)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  })

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true })
    }
  }, [isAuthenticated, navigate])

  const onSubmit = async (values) => {
    clearErrors()

    const parsed = loginSchema.safeParse(values)

    if (!parsed.success) {
      parsed.error.issues.forEach((issue) => {
        const field = issue.path[0]
        if (typeof field === 'string') {
          setError(field, { type: 'manual', message: issue.message })
        }
      })
      return
    }

    try {
      await login(parsed.data.email, parsed.data.password)
      toast.success('Login successful')
      navigate('/dashboard', { replace: true })
    } catch (error) {
      toast.error(error?.message || 'Unable to login')
    }
  }

  return (
    <div className="auth-page">
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="auth-card"
      >
        <div className="auth-top">
          <div className="brand-row">
            <div className="auth-logo">SQM</div>
            <div>
              <div className="sidebar-title">Smart Quality Manager</div>
              <div className="muted" style={{ fontSize: '0.9rem', marginTop: 2 }}>
                Sanctum-protected quality dashboard
              </div>
            </div>
          </div>

          <div className="page-row" style={{ marginTop: 24 }}>
            <ShieldCheck size={20} color="#bae6fd" />
            <span className="muted">Secure access for quality management teams</span>
          </div>

          <h1 className="auth-title">Sign in to continue</h1>
          <p className="auth-copy">
            Use your Laravel Sanctum account to access the Smart Quality Manager workspace.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
          <label className="field">
            <span className="label">Email</span>
            <input className="input" type="email" placeholder="sara@test.com" {...register('email')} />
            {errors.email && <span className="error-text">{errors.email.message}</span>}
          </label>

          <label className="field">
            <span className="label">Password</span>
            <div className="auth-lock">
              <LockKeyhole size={16} />
              <input className="input" type="password" placeholder="••••••••" {...register('password')} />
            </div>
            {errors.password && <span className="error-text">{errors.password.message}</span>}
          </label>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="submit"
            className="btn btn-primary login-button"
            disabled={isSubmitting}
          >
            <LogIn size={16} />
            {isSubmitting ? 'Signing in...' : 'Login'}
          </motion.button>
        </form>
      </motion.section>
    </div>
  )
}