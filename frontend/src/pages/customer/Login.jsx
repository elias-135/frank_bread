import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { getUserByPhone } from '../../api/users'
import { useUser } from '../../context/UserContext'

export default function Login() {
  const navigate = useNavigate()
  const { user, login } = useUser()

  if (user) return <Navigate to="/menu" replace />

  const [step, setStep] = useState('phone')
  const [phone, setPhone] = useState('')
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handlePhoneSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await getUserByPhone(phone.trim())
      login(res.data)
      navigate('/menu')
    } catch (err) {
      if (err.response?.status === 404) {
        setStep('register')
      } else {
        setError('Algo salió mal. Intenta de nuevo.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleRegisterSubmit = (e) => {
    e.preventDefault()
    login({ name: name.trim(), phone: phone.trim(), address: address.trim() })
    navigate('/menu')
  }

  return (
    <div className="min-h-screen bg-espresso flex flex-col items-center justify-center px-5 page-fade">
      {/* Grain overlay */}
      <div className="grain-hero absolute inset-0 pointer-events-none" />

      <div className="relative w-full max-w-sm space-y-8">
        {/* Logo + title */}
        <div className="text-center space-y-3">
          <img
            src="/logo.png"
            alt="frankBread"
            className="w-24 h-24 object-contain mx-auto rounded-full border-2 border-sand/30"
          />
          <h1 className="font-display text-3xl font-bold text-parchment">frankBread</h1>
          <p className="font-body text-sand text-sm italic">Panadería artesanal</p>
        </div>

        {step === 'phone' && (
          <form onSubmit={handlePhoneSubmit} className="space-y-4">
            <div>
              <label className="block font-mono text-xs text-sand/70 tracking-widest mb-2 uppercase">
                Número de teléfono
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1234567890"
                required
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-4 text-parchment placeholder-sand/40 font-body text-base outline-none focus:border-terracotta transition"
              />
            </div>

            {error && (
              <p className="text-red-400 font-body text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading || !phone.trim()}
              className="btn-tap w-full rounded-xl bg-terracotta text-white font-display font-semibold text-lg tracking-wide active:scale-95 transition disabled:opacity-50"
            >
              {loading ? 'Buscando...' : 'Continuar'}
            </button>

            <button
              type="button"
              onClick={() => navigate('/')}
              className="btn-tap w-full font-body text-sand/60 text-sm"
            >
              Volver
            </button>
          </form>
        )}

        {step === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <p className="font-body text-sand text-center text-sm italic">
              Primera vez por aquí — ingresa tus datos.
            </p>

            <div>
              <label className="block font-mono text-xs text-sand/70 tracking-widest mb-2 uppercase">
                Nombre completo
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-4 text-parchment placeholder-sand/40 font-body text-base outline-none focus:border-terracotta transition"
              />
            </div>

            <div>
              <label className="block font-mono text-xs text-sand/70 tracking-widest mb-2 uppercase">
                Dirección
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-4 text-parchment placeholder-sand/40 font-body text-base outline-none focus:border-terracotta transition"
              />
            </div>

            <button
              type="submit"
              disabled={!name.trim() || !address.trim()}
              className="btn-tap w-full rounded-xl bg-terracotta text-white font-display font-semibold text-lg tracking-wide active:scale-95 transition disabled:opacity-50"
            >
              Registrar y continuar
            </button>

            <button
              type="button"
              onClick={() => setStep('phone')}
              className="btn-tap w-full font-body text-sand/60 text-sm"
            >
              Cambiar número
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
