import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getBreadProducts } from '../../api/breadProducts'
import { getAvailableStock, createStock, updateStock } from '../../api/stock'

export default function ManageStock() {
  const [products, setProducts] = useState([])
  const [stockMap, setStockMap] = useState({})
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const loadData = async () => {
    try {
      const [productsRes, stockRes] = await Promise.all([
        getBreadProducts(),
        getAvailableStock(),
      ])

      setProducts(productsRes.data)

      const map = {}
      stockRes.data.forEach((s) => {
        map[s.bread_product_id] = s.quantity_available
      })
      setStockMap(map)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleStockUpdate = async (productId, quantity) => {
    try {
      if (stockMap[productId] !== undefined) {
        await updateStock(productId, { quantity_available: quantity })
      } else {
        await createStock({
          bread_product_id: productId,
          quantity_available: quantity,
        })
      }
      setStockMap((prev) => ({ ...prev, [productId]: quantity }))
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to update stock')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gray-900 text-white p-4">
        <button
          onClick={() => navigate('/baker')}
          className="text-gray-400 text-sm"
        >
          &larr; Back to Dashboard
        </button>
        <h1 className="text-xl font-bold">Manage Stock</h1>
      </header>

      <div className="p-4 space-y-3">
        {products.map((product) => (
          <div
            key={product.bread_product_id}
            className="bg-white rounded-xl shadow p-4"
          >
            <div className="flex justify-between items-center mb-2">
              <div>
                <h3 className="font-semibold">{product.bread_name}</h3>
                <p className="text-sm text-gray-500">{product.category}</p>
              </div>
              <span className="text-sm text-gray-400">
                Current: {stockMap[product.bread_product_id] ?? 0}
              </span>
            </div>
            <div className="flex gap-2">
              <input
                type="number"
                min="0"
                defaultValue={stockMap[product.bread_product_id] ?? 0}
                id={`stock-${product.bread_product_id}`}
                className="flex-1 p-2 rounded-lg border border-gray-300 focus:outline-none focus:border-gray-900"
              />
              <button
                onClick={() => {
                  const input = document.getElementById(
                    `stock-${product.bread_product_id}`
                  )
                  handleStockUpdate(
                    product.bread_product_id,
                    parseInt(input.value)
                  )
                }}
                className="bg-gray-900 text-white px-4 rounded-lg text-sm font-medium active:scale-95 transition"
              >
                Update
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
