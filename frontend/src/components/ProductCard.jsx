import { useNavigate } from 'react-router-dom'

export default function ProductCard({ product }) {
  const navigate = useNavigate()

  return (
    <div
      onClick={() => navigate(`/product/${product.product_id}`, { state: { product } })}
      className="bg-white rounded-2xl shadow-sm overflow-hidden active:scale-[0.98] transition cursor-pointer border border-sand/40"
    >
      {/* Image */}
      <div className="w-full h-44 bg-sand/30 rounded-t-2xl overflow-hidden">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-4xl opacity-30">🍞</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="px-4 py-4">
        <div className="flex justify-between items-start gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-display font-bold text-xl text-espresso leading-tight">
              {product.name}
            </h3>
            {product.description && (
              <p className="font-body text-sm text-espresso/60 mt-1 leading-snug line-clamp-2">
                {product.description}
              </p>
            )}
          </div>
          <p className="font-display text-xl font-bold text-terracotta whitespace-nowrap">
            ${Number(product.base_price).toFixed(1)}
          </p>
        </div>

        <div className="flex items-center justify-between mt-3">
          <p className="font-mono text-xs text-espresso/40">
            {product.quantity_available} disponibles
          </p>
          <span className="font-mono text-xs text-terracotta/80 bg-terracotta/10 px-2 py-0.5 rounded-full">
            Ver →
          </span>
        </div>
      </div>
    </div>
  )
}
