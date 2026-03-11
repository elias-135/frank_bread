import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { useBaker } from '../../context/BakerContext'

export default function BakerLogin() {
  const { authenticated, login } = useBaker()
  const navigate = useNavigate()
  const [pin, setPin] = useState('')
  const [error, setError] = useState(false)

  if (authenticated) return <Navigate to="/baker" replace />

  const handleSubmit = (e) => {
    e.preventDefault()
    const ok = login(pin)
    if (ok) {
      navigate('/baker')
    } else {
      setError(true)
      setPin('')
    }
  }

  const handlePinPress = (digit) => {
    if (pin.length < 6) {
      setError(false)
      setPin((p) => p + digit)
    }
  }

  const handleDelete = () => {
    setError(false)
    setPin((p) => p.slice(0, -1))
  }

  // Auto-submit when pin reaches expected length
  const handlePinChange = (newPin) => {
    setPin(newPin)
    // try submitting automatically once 4 digits entered
    if (newPin.length === 4) {
      const ok = login(newPin)
      if (ok) {
        navigate('/baker')
      } else {
        setError(true)
        setTimeout(() => setPin(''), 500)
      }
    }
  }

  const pressDigit = (d) => {
    if (pin.length >= 4) return
    setError(false)
    handlePinChange(pin + d)
  }

  const DIGITS = ['1','2','3','4','5','6','7','8','9','','0','⌫']

  return (
    <div className="min-h-screen bg-espresso flex flex-col items-center justify-center px-5 page-fade">
      <div className="grain-hero absolute inset-0 pointer-events-none" />

      <div className="relative w-full max-w-xs space-y-8 text-center">
        <div className="space-y-2">
          <p className="font-mono text-sand/50 text-xs tracking-widest uppercase">Acceso administrador</p>
          <h1 className="font-display text-3xl font-bold text-parchment">frankBread</h1>
        </div>

        {/* PIN dots */}
        <div className="flex justify-center gap-4">
          {[0,1,2,3].map((i) => (
            <div
              key={i}
              className={`w-4 h-4 rounded-full border-2 transition-all duration-150 ${
                i < pin.length
                  ? error ? 'bg-red-400 border-red-400' : 'bg-terracotta border-terracotta'
                  : 'border-sand/40 bg-transparent'
              }`}
            />
          ))}
        </div>

        {error && (
          <p className="font-mono text-xs text-red-400">PIN incorrecto</p>
        )}

        {/* Numpad */}
        <div className="grid grid-cols-3 gap-3">
          {DIGITS.map((d, idx) => {
            if (d === '') return <div key={idx} />
            const isDelete = d === '⌫'
            return (
              <button
                key={idx}
                type="button"
                onClick={() => isDelete ? (setError(false), setPin((p) => p.slice(0,-1))) : pressDigit(d)}
                className={`h-14 rounded-2xl font-display text-xl font-semibold active:scale-95 transition ${
                  isDelete
                    ? 'bg-white/5 text-sand/60'
                    : 'bg-white/10 text-parchment active:bg-white/20'
                }`}
              >
                {d}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
