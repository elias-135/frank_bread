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
    <div className="font-sen min-h-screen bg-white flex flex-col items-center px-6">
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <div className="w-48 h-48 bg-gray-300 rounded-2xl overflow-hidden mb-4">
          {product.image_url && (
            <img
              src={product.image_url}
              alt={product.bread_name}
              className="w-full h-full object-cover"
            />
          )}
        </div>

        <h2 className="text-xl font-bold text-gray-800">
          {product.bread_name} Agregado!
        </h2>
        <p className="text-lg text-gray-500 mt-2">
          ${total.toFixed(0)}
        </p>
      </div>

      <div className="w-full pb-8 space-y-4">
        <button
          onClick={() => navigate('/menu')}
          className="w-full py-4 rounded-xl text-white font-semibold text-lg active:scale-95 transition"
          style={{ backgroundColor: '#56463D' }}
        >
          SEGUIR COMPRANDO
        </button>

        <button
          onClick={() => navigate('/cart')}
          className="w-full py-4 rounded-xl text-white font-semibold text-lg active:scale-95 transition flex items-center justify-center gap-2"
          style={{ backgroundColor: '#56463D' }}
        >
          VER CARRITO
          <span>&#128188;</span>
        </button>
      </div>
    </div>
  )
}
