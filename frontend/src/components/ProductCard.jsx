import { useNavigate } from 'react-router-dom'

export default function ProductCard({ product }) {
  const navigate = useNavigate()

  return (
    <div
      onClick={() => navigate(`/product/${product.product_id}`, { state: { product } })}
      className="font-sen bg-white rounded-2xl shadow overflow-hidden active:scale-[0.98] transition cursor-pointer"
    >
      <div className="w-full h-40 bg-gray-300 rounded-t-2xl">
        {product.image_url && (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        )}
      </div>

      <div className="p-4">
        <h3 className="font-bold text-xl text-gray-800">
          {product.name}
        </h3>
        <div className="flex justify-between items-end mt-1">
          <p className="text-sm text-gray-400 leading-snug max-w-[65%]">
            {product.description}
          </p>
          <p className="text-xl font-bold text-gray-800">
            ${Number(product.base_price).toFixed(1)}
          </p>
        </div>
        <p className="text-xs text-gray-400 mt-1">
          {product.quantity_available} disponibles
        </p>
      </div>
    </div>
  )
}
