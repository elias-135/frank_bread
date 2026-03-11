import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'

export default function Cart() {
  const { items, updateQuantity, removeItem, totalAmount } = useCart()
  const navigate = useNavigate()
  const [editing, setEditing] = useState(false)

  if (items.length === 0) {
    return (
      <div className="font-sen min-h-screen bg-[#1a1a2e] flex flex-col items-center justify-center px-6">
        <p className="text-gray-400 text-lg">Tu carrito esta vacio</p>
        <button
          onClick={() => navigate('/menu')}
          className="mt-6 w-full py-4 rounded-xl text-white font-semibold text-lg active:scale-95 transition"
          style={{ backgroundColor: '#56463D' }}
        >
          VER MENU
        </button>
      </div>
    )
  }

  return (
    <div className="font-sen min-h-screen bg-[#1a1a2e] flex flex-col">
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/menu')}
            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white"
          >
            &larr;
          </button>
          <span className="text-white text-lg font-semibold">Stock</span>
        </div>
        <button
          onClick={() => setEditing(!editing)}
          className="text-amber-400 font-semibold text-sm"
        >
          {editing ? 'LISTO' : 'EDITAR ITEMS'}
        </button>
      </div>

      {/* Cart Items */}
      <div className="flex-1 px-4 space-y-4 overflow-y-auto pb-4">
        {items.map((item) => (
          <div key={item.product_id}>
            {/* Row: Image | Name+Price | Remove */}
            <div className="flex  gap-3">
              <div className="w-24 h-24 bg-gray-700 rounded-xl flex-shrink-0 overflow-hidden">
                {item.image_url && (
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-white font-semibold text-lg leading-tight">
                  {item.name}
                </h3>
                <p className="text-white font-bold text-lg mt-1">
                  ${(Number(item.base_price) * item.quantity).toFixed(0)}
                </p>
              </div>

              {editing && (
                <button
                  onClick={() => removeItem(item.product_id)}
                  className="w-8 h-8 rounded-full bg-red-500 text-white font-bold flex items-center justify-center flex-shrink-0"
                >
                  &times;
                </button>
              )}
            </div>

            {/* Quantity Picker — aligned right, same width as row above */}
            <div className="flex justify-end mt-2">
              <div className="flex items-center gap-3 bg-white/10 rounded-full px-2 py-1">
                <button
                  onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                  className="w-7 h-7 rounded-full bg-white/20 text-white font-bold flex items-center justify-center"
                >
                  -
                </button>
                <span className="text-white font-bold min-w-[20px] text-center">
                  {item.quantity}
                </span>
                <button
                  onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                  disabled={item.quantity >= (item.quantity_available || Infinity)}
                  className="w-7 h-7 rounded-full bg-white/20 text-white font-bold flex items-center justify-center disabled:opacity-30"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom — Total + Continue */}
      <div className="p-4 space-y-4">
        <p className="text-white text-2xl font-bold text-center">
          Total: ${totalAmount.toFixed(0)}
        </p>

        <button
          onClick={() => navigate('/checkout')}
          className="w-full py-4 rounded-xl text-white font-semibold text-lg active:scale-95 transition"
          style={{ backgroundColor: '#56463D' }}
        >
          CONTINUAR
        </button>
      </div>
    </div>
  )
}
