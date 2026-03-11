import { useParams, useLocation, useNavigate } from 'react-router-dom'

export default function OrderConfirm() {
  const { id } = useParams()
  const { state } = useLocation()
  const customerName = state?.customerName || ''
  const navigate = useNavigate()

  return (
    <div className="font-sen min-h-screen bg-white flex flex-col items-center px-6">
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        {/* Image placeholder */}
        <div className="w-40 h-40 bg-gray-300 rounded-2xl mb-6" />

        <h1 className="text-2xl font-bold text-gray-800 leading-snug">
          Orden Colocada{customerName ? `\n${customerName}` : ''}!
        </h1>

        <p className="text-gray-500 mt-4">
          El número de su orden es:
        </p>
        <p className="text-gray-800 font-bold text-lg">
          {id}
        </p>

        <p className="text-gray-400 mt-4 text-sm">
          Te avisaremos cuando esté en camino.
        </p>
      </div>

      <div className="w-full pb-8 space-y-3">
        <button
          onClick={() => navigate('/track')}
          className="w-full py-4 rounded-xl text-white font-semibold text-lg active:scale-95 transition"
          style={{ backgroundColor: '#56463D' }}
        >
          VER MIS ÓRDENES
        </button>
        <button
          onClick={() => navigate('/menu')}
          className="w-full py-4 rounded-xl border-2 font-semibold text-lg active:scale-95 transition"
          style={{ borderColor: '#56463D', color: '#56463D' }}
        >
          SEGUIR COMPRANDO
        </button>
      </div>
    </div>
  )
}
