import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'

export default function ProductDetail() {
  const { state } = useLocation()
  const product = state?.product
  const navigate = useNavigate()
  const { addItem, items } = useCart()
  const [quantity, setQuantity] = useState(1)

  if (!product) {
    navigate('/menu')
    return null
  }

  const alreadyInCart = items.find((i) => i.bread_product_id === product.bread_product_id)?.quantity || 0
  const maxAvailable = (product.quantity_available || 0) - alreadyInCart

  const handleAddToCart = () => {
    if (quantity > maxAvailable) return
    for (let i = 0; i < quantity; i++) {
      addItem(product)
    }
    navigate('/added-to-cart', { state: { product, quantity } })
  }

  return (
    <div className="page-fade min-h-screen bg-parchment flex flex-col">
      {/* Back header */}
      <div className="px-5 py-4 flex items-center gap-3">
        <button
          onClick={() => navigate('/menu')}
          className="w-11 h-11 rounded-full bg-sand/40 flex items-center justify-center active:scale-95 transition"
          aria-label="Volver"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-espresso">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span className="font-display text-lg font-bold text-espresso">Detalles</span>
      </div>

      {/* Product image */}
      <div className="mx-5 h-52 bg-sand/30 rounded-2xl overflow-hidden border border-sand/40">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.bread_name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-6xl opacity-20">🍞</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="px-5 py-5 flex-1 space-y-3">
        <h1 className="font-display text-3xl font-bold text-espresso leading-tight">
          {product.bread_name || product.name}
        </h1>
        {product.description && (
          <p className="font-body text-base text-espresso/70 leading-relaxed">
            {product.description}
          </p>
        )}

        <div className="flex items-center gap-5 pt-1">
          <div className="flex items-center gap-1.5 font-mono text-sm text-espresso/50">
            <span>🚚</span>
            <span>Gratis</span>
          </div>
          <div className="flex items-center gap-1.5 font-mono text-sm text-espresso/50">
            <span>⏱</span>
            <span>~20 min</span>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-sand/50 bg-white px-5 py-5 space-y-4">
        <div className="flex justify-between items-center">
          <p className="font-display text-3xl font-bold text-espresso">
            ${(Number(product.base_price) * quantity).toFixed(2)}
          </p>

          <div className="flex items-center rounded-full bg-espresso px-1 py-1 gap-3">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-10 h-10 rounded-full bg-white/20 text-parchment font-bold flex items-center justify-center active:scale-95 transition"
            >
              −
            </button>
            <span className="text-parchment font-bold font-mono min-w-[20px] text-center">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(Math.min(quantity + 1, Math.max(maxAvailable, 1)))}
              disabled={quantity >= maxAvailable}
              className="w-10 h-10 rounded-full bg-white/20 text-parchment font-bold flex items-center justify-center active:scale-95 transition disabled:opacity-30"
            >
              +
            </button>
          </div>
        </div>

        <p className="font-mono text-xs text-espresso/40 text-right">
          {maxAvailable > 0 ? `${maxAvailable} disponibles` : 'Sin stock'}
          {alreadyInCart > 0 && ` · ${alreadyInCart} en carrito`}
        </p>

        <button
          onClick={handleAddToCart}
          disabled={maxAvailable <= 0}
          className="btn-tap w-full rounded-2xl bg-terracotta text-white font-display font-semibold text-lg tracking-wide active:scale-95 transition disabled:opacity-50 shadow-md"
        >
          {maxAvailable <= 0 ? 'Sin stock' : 'Agregar al carrito'}
        </button>
      </div>
    </div>
  )
}
