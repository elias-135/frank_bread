import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAvailableStock } from '../../api/stock'
import { useCart } from '../../context/CartContext'
import { useUser } from '../../context/UserContext'
import ProductCard from '../../components/ProductCard'

export default function Menu() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const { items } = useCart()
  const { logout } = useUser()
  const navigate = useNavigate()

  useEffect(() => {
    getAvailableStock()
      .then((res) => setProducts(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Loading menu...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="p-4 flex justify-between items-center">
        <div className="flex flex-col gap-1">
          <button
            onClick={() => navigate('/track')}
            className="text-xs font-semibold underline"
            style={{ color: '#56463D' }}
          >
            Mis Órdenes
          </button>
          <button
            onClick={() => { logout(); navigate('/login') }}
            className="text-xs text-gray-400 underline text-left"
          >
            Cambiar usuario
          </button>
        </div>
        <button
          onClick={() => navigate('/cart')}
          className="relative w-10 h-10 flex items-center justify-center"
        >
          <img
            src="/cart-icon.png"
            alt="Cart"
            className="w-8 h-8 object-contain"
            onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }}
          />
          <span
            className="w-8 h-8 items-center justify-center text-xl hidden"
          >
            &#128722;
          </span>
          {cartCount > 0 && (
            <span
              className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-white text-xs font-bold flex items-center justify-center"
              style={{ backgroundColor: '#56463D' }}
            >
              {cartCount}
            </span>
          )}
        </button>
      </header>

      <div className="p-4 space-y-3">
        {products.length === 0 ? (
          <p className="text-center text-gray-500 mt-8">
            No bread available right now
          </p>
        ) : (
          products.map((product) => (
            <ProductCard key={product.product_id} product={product} />
          ))
        )}
      </div>

    </div>
  )
}
