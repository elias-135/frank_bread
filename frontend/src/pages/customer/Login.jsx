import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { getUserByPhone } from '../../api/users'
import { useUser } from '../../context/UserContext'

export default function Login() {
  const navigate = useNavigate()
  const { user, login } = useUser()

  if (user) return <Navigate to="/menu" replace />

  // Step 1: phone entry. Step 2: registration (new users only).
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
      // Existing user — log them straight in
      login(res.data)
      navigate('/menu')
    } catch (err) {
      if (err.response?.status === 404) {
        // New user — collect name + address
        setStep('register')
      } else {
        setError('Something went wrong. Try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleRegisterSubmit = (e) => {
    e.preventDefault()
    // Store locally; actual DB record is created on first order via placeGuestOrder
    login({ name: name.trim(), phone: phone.trim(), address: address.trim() })
    navigate('/menu')
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
      <img
        src="/logo.png"
        alt="frankBread"
        className="w-32 h-32 object-contain mb-10"
      />

      {step === 'phone' && (
        <form onSubmit={handlePhoneSubmit} className="w-full space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 tracking-wider mb-1">
              NÚMERO DE TELÉFONO
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1234567890"
              required
              className="w-full bg-gray-100 rounded-xl px-4 py-4 text-gray-800 outline-none"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading || !phone.trim()}
            className="w-full py-4 rounded-xl text-white font-semibold text-lg active:scale-95 transition disabled:opacity-50"
            style={{ backgroundColor: '#56463D' }}
          >
            {loading ? 'BUSCANDO...' : 'CONTINUAR'}
          </button>

          <button
            type="button"
            onClick={() => navigate('/')}
            className="w-full py-3 text-gray-500 text-sm"
          >
            Volver
          </button>
        </form>
      )}

      {step === 'register' && (
        <form onSubmit={handleRegisterSubmit} className="w-full space-y-4">
          <p className="text-sm text-gray-500 text-center">
            Primera vez? Ingresa tus datos.
          </p>

          <div>
            <label className="block text-xs font-semibold text-gray-500 tracking-wider mb-1">
              NOMBRE COMPLETO
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full bg-gray-100 rounded-xl px-4 py-4 text-gray-800 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 tracking-wider mb-1">
              DIRECCIÓN
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              className="w-full bg-gray-100 rounded-xl px-4 py-4 text-gray-800 outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={!name.trim() || !address.trim()}
            className="w-full py-4 rounded-xl text-white font-semibold text-lg active:scale-95 transition disabled:opacity-50"
            style={{ backgroundColor: '#56463D' }}
          >
            REGISTRAR Y CONTINUAR
          </button>

          <button
            type="button"
            onClick={() => setStep('phone')}
            className="w-full py-3 text-gray-500 text-sm"
          >
            Cambiar número
          </button>
        </form>
      )}
    </div>
  )
}
