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
    <div className="font-sen min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="p-4 flex items-center gap-3">
        <button
          onClick={() => navigate('/menu')}
          className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center"
        >
          <span className="text-lg">&larr;</span>
        </button>
        <span className="text-lg font-semibold">Detalles</span>
      </div>

      {/* Product Image */}
      <div className="mx-4 h-48 bg-gray-300 rounded-2xl overflow-hidden">
        {product.image_url && (
          <img
            src={product.image_url}
            alt={product.bread_name}
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Product Info */}
      <div className="p-4 flex-1">
        <h1 className="text-2xl font-bold text-gray-800">
          {product.bread_name}
        </h1>
        <p className="text-sm text-gray-400 mt-2 leading-relaxed">
          {product.description}
        </p>

        <div className="flex items-center gap-6 mt-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <span>&#128666;</span>
            <span>Free</span>
          </div>
          <div className="flex items-center gap-1">
            <span>&#128336;</span>
            <span>20 min</span>
          </div>
        </div>
      </div>

      {/* Bottom Bar — Price + Quantity + Add to Cart */}
      <div className="border-t bg-gray-50 p-4 space-y-4">
        <div className="flex justify-between items-center">
          <p className="text-2xl font-bold text-gray-800">
            ${(Number(product.base_price) * quantity).toFixed(2)}
          </p>

          <div
            className="flex items-center rounded-full px-1 py-1 gap-3"
            style={{ backgroundColor: '#56463D' }}
          >
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-8 h-8 rounded-full bg-white/20 text-white font-bold flex items-center justify-center"
            >
              -
            </button>
            <span className="text-white font-bold min-w-[20px] text-center">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(Math.min(quantity + 1, Math.max(maxAvailable, 1)))}
              disabled={quantity >= maxAvailable}
              className="w-8 h-8 rounded-full bg-white/20 text-white font-bold flex items-center justify-center disabled:opacity-30"
            >
              +
            </button>
          </div>
        </div>

        <p className="text-xs text-gray-400 text-right">
          {maxAvailable > 0 ? `${maxAvailable} disponibles` : 'Sin stock'}
          {alreadyInCart > 0 && ` (${alreadyInCart} en carrito)`}
        </p>

        <button
          onClick={handleAddToCart}
          disabled={maxAvailable <= 0}
          className="w-full py-4 rounded-xl text-white font-semibold text-lg active:scale-95 transition disabled:opacity-50"
          style={{ backgroundColor: '#56463D' }}
        >
          {maxAvailable <= 0 ? 'SIN STOCK' : 'AGREGAR AL CARRITO'}
        </button>
      </div>
    </div>
  )
}
