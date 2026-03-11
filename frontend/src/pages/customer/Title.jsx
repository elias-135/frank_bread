import { useNavigate } from 'react-router-dom'
import { useUser } from '../../context/UserContext'

export default function Title() {
  const navigate = useNavigate()
  const { user } = useUser()

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
      <img
        src="/logo.png"
        alt="frankBread"
        className="w-48 h-48 object-contain mb-12"
      />

      {user && (
        <p className="text-gray-500 text-sm mb-2">
          Hola, <span className="font-semibold text-gray-800">{user.name}</span>
        </p>
      )}

      <div className="w-full space-y-4">
        <button
          onClick={() => navigate(user ? '/menu' : '/login')}
          className="w-full py-4 rounded-xl text-white font-semibold text-lg active:scale-95 transition"
          style={{ backgroundColor: '#56463D' }}
        >
          Ver Stock
        </button>

        <button
          onClick={() => navigate(user ? '/track' : '/login')}
          className="w-full py-4 rounded-xl border-2 font-semibold text-lg active:scale-95 transition"
          style={{ borderColor: '#56463D', color: '#56463D' }}
        >
          {user ? 'Mis Órdenes' : 'Iniciar Sesión'}
        </button>
      </div>
    </div>
  )
}
