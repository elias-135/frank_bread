import { useLocation, useNavigate } from 'react-router-dom'

export default function AddedToCart() {
  const { state } = useLocation()
  const { product, quantity } = state || {}
  const navigate = useNavigate()

  if (!product) {
    navigate('/menu')
    return null
  }

  const total = Number(product.base_price) * quantity

  return (
    <div className="page-fade min-h-screen bg-parchment flex flex-col items-center px-5">
      <div className="flex-1 flex flex-col items-center justify-center text-center space-y-5 py-10">
        {/* Product image */}
        <div className="w-44 h-44 bg-sand/30 rounded-2xl overflow-hidden border border-sand/40">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.bread_name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-5xl">🍞</span>
            </div>
          )}
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-center gap-2">
            <span className="text-2xl">✓</span>
            <h2 className="font-display text-2xl font-bold text-espresso">
              {product.bread_name || product.name}
            </h2>
          </div>
          <p className="font-body italic text-espresso/60">agregado al carrito</p>
        </div>

        <p className="font-display text-3xl font-bold text-terracotta">
          ${total.toFixed(0)}
        </p>
      </div>

      <div className="w-full pb-10 space-y-3">
        <button
          onClick={() => navigate('/menu')}
          className="btn-tap w-full rounded-2xl bg-espresso text-parchment font-display font-semibold text-lg tracking-wide active:scale-95 transition"
        >
          Seguir comprando
        </button>

        <button
          onClick={() => navigate('/cart')}
          className="btn-tap w-full rounded-2xl border-2 border-espresso text-espresso font-display font-semibold text-lg tracking-wide active:scale-95 transition"
        >
          Ver carrito
        </button>
      </div>
    </div>
  )
}
