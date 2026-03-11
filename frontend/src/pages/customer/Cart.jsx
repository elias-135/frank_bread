import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'

export default function Cart() {
  const { items, updateQuantity, removeItem, totalAmount } = useCart()
  const navigate = useNavigate()
  const [editing, setEditing] = useState(false)

  if (items.length === 0) {
    return (
      <div className="page-fade min-h-screen bg-parchment flex flex-col items-center justify-center px-5 space-y-6">
        <p className="font-display text-2xl text-espresso/50 italic">Tu carrito está vacío</p>
        <button
          onClick={() => navigate('/menu')}
          className="btn-tap w-full rounded-2xl bg-terracotta text-white font-display font-semibold text-lg tracking-wide active:scale-95 transition"
        >
          Ver Menú
        </button>
      </div>
    )
  }

  return (
    <div className="page-fade min-h-screen bg-parchment flex flex-col">
      {/* Header */}
      <div className="px-5 py-4 flex items-center justify-between border-b border-sand/40">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/menu')}
            className="w-11 h-11 rounded-full bg-sand/40 flex items-center justify-center active:scale-95 transition"
            aria-label="Volver"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-espresso">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="font-display text-xl font-bold text-espresso">Mi Carrito</span>
        </div>
        <button
          onClick={() => setEditing(!editing)}
          className="font-mono text-sm text-terracotta py-2 px-3"
        >
          {editing ? 'Listo' : 'Editar'}
        </button>
      </div>

      {/* Items */}
      <div className="flex-1 px-5 py-4 space-y-5 overflow-y-auto">
        {items.map((item) => (
          <div key={item.product_id} className="bg-white rounded-2xl p-4 shadow-sm border border-sand/30 space-y-3">
            <div className="flex gap-3">
              <div className="w-20 h-20 bg-sand/30 rounded-xl flex-shrink-0 overflow-hidden">
                {item.image_url ? (
                  <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl">🍞</div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-display font-bold text-lg text-espresso leading-tight">
                  {item.name}
                </h3>
                <p className="font-display text-lg font-bold text-terracotta mt-1">
                  ${(Number(item.base_price) * item.quantity).toFixed(0)}
                </p>
              </div>

              {editing && (
                <button
                  onClick={() => removeItem(item.product_id)}
                  className="w-9 h-9 rounded-full bg-red-100 text-red-500 font-bold flex items-center justify-center flex-shrink-0 active:scale-95 transition"
                >
                  ×
                </button>
              )}
            </div>

            {/* Quantity picker */}
            <div className="flex justify-end">
              <div className="flex items-center gap-3 bg-espresso/10 rounded-full px-2 py-1">
                <button
                  onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                  className="w-9 h-9 rounded-full bg-espresso/20 text-espresso font-bold flex items-center justify-center active:scale-95 transition"
                >
                  −
                </button>
                <span className="font-mono font-bold text-espresso min-w-[20px] text-center">
                  {item.quantity}
                </span>
                <button
                  onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                  disabled={item.quantity >= (item.quantity_available || Infinity)}
                  className="w-9 h-9 rounded-full bg-espresso/20 text-espresso font-bold flex items-center justify-center active:scale-95 transition disabled:opacity-30"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom */}
      <div className="border-t border-sand/40 bg-white px-5 py-5 space-y-4">
        <div className="flex justify-between items-center">
          <span className="font-body text-espresso/60">Total</span>
          <span className="font-display text-3xl font-bold text-espresso">${totalAmount.toFixed(0)}</span>
        </div>

        <button
          onClick={() => navigate('/checkout')}
          className="btn-tap w-full rounded-2xl bg-terracotta text-white font-display font-semibold text-lg tracking-wide active:scale-95 transition shadow-md"
        >
          Continuar al pago
        </button>
      </div>
    </div>
  )
}
