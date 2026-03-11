import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAllOrders } from '../../api/orders'

const STATUS_LABELS = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  out_for_delivery: 'Out for Delivery',
  completed: 'Completed',
  cancelled: 'Cancelled',
}

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  out_for_delivery: 'bg-purple-100 text-purple-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
}

const FILTERS = [null, 'pending', 'confirmed', 'out_for_delivery', 'completed', 'cancelled']

export default function Dashboard() {
  const [orders, setOrders] = useState([])
  const [filter, setFilter] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    setLoading(true)
    getAllOrders(filter)
      .then((res) => setOrders(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }, [filter])

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gray-900 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Baker Dashboard</h1>
        <button
          onClick={() => navigate('/baker/stock')}
          className="bg-gray-700 px-3 py-1 rounded-lg text-sm"
        >
          Manage Stock
        </button>
      </header>

      <div className="p-4 flex gap-2 overflow-x-auto">
        {FILTERS.map((f) => (
          <button
            key={f ?? 'all'}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
              filter === f
                ? 'bg-gray-900 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            {f ? STATUS_LABELS[f] : 'All'}
          </button>
        ))}
      </div>

      <div className="px-4 space-y-3 pb-4">
        {loading ? (
          <p className="text-center text-gray-500 mt-8">Loading orders...</p>
        ) : orders.length === 0 ? (
          <p className="text-center text-gray-500 mt-8">No orders found</p>
        ) : (
          orders.map((order) => (
            <div
              key={order.order_id}
              onClick={() => navigate(`/baker/order/${order.order_id}`)}
              className="bg-white rounded-xl shadow p-4 active:scale-[0.98] transition cursor-pointer"
            >
              <div className="flex justify-between items-center">
                <span className="font-bold">Order #{order.order_id}</span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[order.current_status]}`}
                >
                  {STATUS_LABELS[order.current_status]}
                </span>
              </div>
              <div className="flex justify-between mt-2 text-sm text-gray-500">
                <span>{order.order_items.length} items</span>
                <span className="font-semibold text-gray-700">
                  ${Number(order.total_amount).toFixed(2)}
                </span>
              </div>
              <div className="text-xs text-gray-400 mt-1">
                {new Date(order.order_date).toLocaleString()}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
