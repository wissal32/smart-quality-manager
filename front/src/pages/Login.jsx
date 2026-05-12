import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { LockKeyhole, LogIn, ShieldCheck } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { useAuthStore } from '../store/authStore'
import { fr } from '../i18n/fr'
import logo from '../assets/wii.svg'

const loginSchema = z.object({
  email: z.string().email(fr.login.validation.emailRequired),
  password: z.string().min(1, fr.login.validation.passwordRequired),
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
      toast.success(fr.login.messages.loginSuccess)
      navigate('/dashboard', { replace: true })
    } catch (error) {
      toast.error(error?.message || fr.login.messages.loginError)
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
            <div className="auth-logo">
              <img src={logo} alt="Smart Quality Manager Logo" className="auth-logo-img" />
            </div>
            <div>
              <div className="sidebar-title">{fr.app.title}</div>
              <div className="muted" style={{ fontSize: '0.9rem', marginTop: 2 }}>
                {fr.login.subtitle}
              </div>
            </div>
          </div>

          <div className="page-row" style={{ marginTop: 24 }}>
            <ShieldCheck size={20} color="#bae6fd" />
            <span className="muted">{fr.login.description}</span>
          </div>

          <h1 className="auth-title">{fr.login.signInTitle}</h1>
          <p className="auth-copy">
            {fr.login.signInDescription}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
          <label className="field">
            <span className="label">{fr.login.email}</span>
            <input className="input" type="email" placeholder={fr.login.emailPlaceholder} {...register('email')} />
            {errors.email && <span className="error-text">{errors.email.message}</span>}
          </label>

          <label className="field">
            <span className="label">{fr.login.password}</span>
            <div className="auth-lock">
              <LockKeyhole size={16} />
              <input className="input" type="password" placeholder={fr.login.passwordPlaceholder} {...register('password')} />
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
            {isSubmitting ? fr.login.signingIn : fr.login.login}
          </motion.button>
        </form>
      </motion.section>
    </div>
  )
}