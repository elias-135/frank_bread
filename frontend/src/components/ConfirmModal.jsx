export default function ConfirmModal({ message, onConfirm, onCancel, confirmLabel = 'Confirmar', danger = false }) {
  return (
    <div className="fixed inset-0 bg-espresso/60 flex items-end justify-center z-50 px-5 pb-8">
      <div className="bg-parchment rounded-2xl w-full max-w-md p-6 space-y-5 shadow-2xl border border-sand/40">
        <p className="font-display text-espresso font-semibold text-center text-lg leading-snug">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="btn-tap flex-1 rounded-xl border-2 border-sand text-espresso font-body font-semibold active:scale-95 transition"
          >
            Volver
          </button>
          <button
            onClick={onConfirm}
            className={`btn-tap flex-1 rounded-xl text-white font-display font-semibold active:scale-95 transition ${
              danger ? 'bg-red-500' : 'bg-terracotta'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
