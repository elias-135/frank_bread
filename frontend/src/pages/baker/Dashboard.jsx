import { useEffect, useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { getAllOrders } from '../../api/orders'
import { useBaker } from '../../context/BakerContext'

const STATUS_LABELS = {
  pending:          'Pendiente',
  confirmed:        'Confirmado',
  out_for_delivery: 'En camino',
  completed:        'Completado',
  cancelled:        'Cancelado',
}

const STATUS_STYLES = {
  pending:          'bg-amber-100 text-amber-800',
  confirmed:        'bg-blue-100 text-blue-800',
  out_for_delivery: 'bg-blueberry/20 text-blueberry',
  completed:        'bg-green-100 text-green-800',
  cancelled:        'bg-red-100 text-red-600',
}

const FILTERS = [null, 'pending', 'confirmed', 'out_for_delivery', 'completed', 'cancelled']
const FILTER_LABELS = { null: 'Todas', ...STATUS_LABELS }

export default function Dashboard() {
  const { authenticated, logout } = useBaker()
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [filter, setFilter] = useState(null)
  const [loading, setLoading] = useState(true)

  if (!authenticated) return <Navigate to="/baker/login" replace />

  useEffect(() => {
    setLoading(true)
    getAllOrders(filter)
      .then((res) => setOrders(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }, [filter])

  return (
    <div className="min-h-screen bg-parchment page-fade">
      {/* Header */}
      <header className="bg-espresso text-parchment px-5 py-4 flex justify-between items-center sticky top-0 z-10">
        <div>
          <p className="font-mono text-xs text-sand/50 uppercase tracking-widest">Admin</p>
          <h1 className="font-display text-xl font-bold">Órdenes</h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/baker/stock')}
            className="font-mono text-xs text-sand/70 bg-white/10 px-3 py-2 rounded-xl active:opacity-75 transition"
          >
            Stock
          </button>
          <button
            onClick={() => { logout(); navigate('/baker/login') }}
            className="font-mono text-xs text-sand/50 active:opacity-75 transition"
          >
            Salir
          </button>
        </div>
      </header>

      {/* Filter pills */}
      <div className="px-5 py-4 flex gap-2 overflow-x-auto scrollbar-none">
        {FILTERS.map((f) => (
          <button
            key={f ?? 'all'}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full font-mono text-xs whitespace-nowrap transition active:scale-95 ${
              filter === f
                ? 'bg-espresso text-parchment'
                : 'bg-sand/40 text-espresso'
            }`}
          >
            {FILTER_LABELS[f] ?? FILTER_LABELS['null']}
          </button>
        ))}
      </div>

      {/* Orders list */}
      <div className="px-5 pb-8 space-y-3">
        {loading ? (
          <p className="text-center font-body italic text-espresso/40 mt-10">Cargando órdenes...</p>
        ) : orders.length === 0 ? (
          <p className="text-center font-body italic text-espresso/40 mt-10">No hay órdenes.</p>
        ) : (
          orders.map((order) => (
            <div
              key={order.order_id}
              onClick={() => navigate(`/baker/order/${order.order_id}`)}
              className="bg-white rounded-2xl border border-sand/30 shadow-sm p-4 active:scale-[0.98] transition cursor-pointer space-y-2"
            >
              <div className="flex justify-between items-center">
                <span className="font-display font-bold text-espresso text-lg">
                  Orden #{order.order_id}
                </span>
                <span className={`px-3 py-1 rounded-full font-mono text-xs font-semibold ${STATUS_STYLES[order.current_status] || 'bg-gray-100 text-gray-600'}`}>
                  {STATUS_LABELS[order.current_status] || order.current_status}
                </span>
              </div>

              {/* Item names */}
              <div className="space-y-0.5">
                {order.order_items?.map((item) => (
                  <p key={item.order_item_id} className="font-body text-sm text-espresso/70">
                    {item.quantity}× {item.product_name || `Producto #${item.bread_product_id}`}
                  </p>
                ))}
              </div>

              <div className="flex justify-between items-center pt-1">
                <span className="font-mono text-xs text-espresso/30">
                  {order.order_items?.length ?? 0} {order.order_items?.length === 1 ? 'producto' : 'productos'}
                </span>
                <span className="font-display font-bold text-terracotta text-lg">
                  ${Number(order.total_amount).toFixed(2)}
                </span>
              </div>

              <p className="font-mono text-xs text-espresso/30">
                {new Date(order.order_date).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
