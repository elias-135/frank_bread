import { useParams, useLocation, useNavigate } from 'react-router-dom'

export default function OrderConfirm() {
  const { id } = useParams()
  const { state } = useLocation()
  const customerName = state?.customerName || ''
  const navigate = useNavigate()

  return (
    <div className="page-fade min-h-screen bg-parchment flex flex-col items-center px-5">
      <div className="flex-1 flex flex-col items-center justify-center text-center space-y-5 py-10">
        {/* Checkmark circle */}
        <div className="w-24 h-24 rounded-full bg-terracotta/10 border-2 border-terracotta flex items-center justify-center">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-10 h-10 text-terracotta">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <div className="space-y-2">
          <h1 className="font-display text-3xl font-bold text-espresso leading-tight">
            {customerName ? `¡Gracias, ${customerName}!` : '¡Orden colocada!'}
          </h1>
          <p className="font-body italic text-espresso/60 text-base">
            Tu pan está en camino.
          </p>
        </div>

        <div className="bg-white border border-sand/40 rounded-2xl px-8 py-5 space-y-1 shadow-sm">
          <p className="font-mono text-xs text-espresso/40 uppercase tracking-widest">Número de orden</p>
          <p className="font-display text-4xl font-bold text-terracotta">#{id}</p>
        </div>

        <p className="font-body text-espresso/50 text-sm">
          Te avisaremos cuando esté en camino.
        </p>
      </div>

      <div className="w-full pb-10 space-y-3">
        <button
          onClick={() => navigate('/track')}
          className="btn-tap w-full rounded-2xl bg-espresso text-parchment font-display font-semibold text-lg tracking-wide active:scale-95 transition"
        >
          Ver mis órdenes
        </button>
        <button
          onClick={() => navigate('/menu')}
          className="btn-tap w-full rounded-2xl border-2 border-espresso text-espresso font-display font-semibold text-lg tracking-wide active:scale-95 transition"
        >
          Seguir comprando
        </button>
      </div>
    </div>
  )
}
