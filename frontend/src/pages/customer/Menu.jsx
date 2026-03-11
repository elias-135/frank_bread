import { useEffect, useState } from 'react'
import { getAvailableStock } from '../../api/stock'
import ProductCard from '../../components/ProductCard'

export default function Menu() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAvailableStock()
      .then((res) => setProducts(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="font-body text-espresso/50 italic text-lg">Cargando el horno...</p>
      </div>
    )
  }

  return (
    <div className="page-fade px-5 py-8 space-y-6">
      <div className="space-y-1">
        <h1 className="font-display text-3xl font-bold text-espresso">Menú de hoy</h1>
        <p className="font-body text-espresso/60 italic text-sm">Horneado fresco cada mañana</p>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-16 space-y-2">
          <p className="font-display text-xl text-espresso/50 italic">No hay pan disponible ahora.</p>
          <p className="font-body text-sm text-espresso/40">Vuelve mañana temprano.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {products.map((product) => (
            <ProductCard key={product.product_id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
