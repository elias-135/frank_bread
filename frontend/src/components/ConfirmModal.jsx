export default function ConfirmModal({ message, onConfirm, onCancel, confirmLabel = 'Confirmar', danger = false }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50 px-4 pb-8">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 space-y-4">
        <p className="text-gray-800 font-semibold text-center text-base">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 rounded-xl border border-gray-300 text-gray-600 font-semibold"
          >
            Volver
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 py-3 rounded-xl text-white font-semibold active:scale-95 transition ${danger ? 'bg-red-500' : ''}`}
            style={!danger ? { backgroundColor: '#56463D' } : {}}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
