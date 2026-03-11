import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getOrder, updateOrderStatus } from '../../api/orders'

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

const NEXT_ACTIONS = {
  pending: [
    { status: 'confirmed', label: 'Confirm Order', color: 'bg-blue-600' },
    { status: 'cancelled', label: 'Cancel Order', color: 'bg-red-600' },
  ],
  confirmed: [
    { status: 'out_for_delivery', label: 'Send for Delivery', color: 'bg-purple-600' },
    { status: 'cancelled', label: 'Cancel Order', color: 'bg-red-600' },
  ],
  out_for_delivery: [
    { status: 'completed', label: 'Mark Completed', color: 'bg-green-600' },
  ],
  completed: [],
  cancelled: [],
}

export default function OrderManage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  const loadOrder = () => {
    getOrder(id)
      .then((res) => setOrder(res.data))
      .catch(() => navigate('/baker'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadOrder()
  }, [id])

  const handleStatusUpdate = async (newStatus) => {
    setUpdating(true)
    try {
      const res = await updateOrderStatus(id, {
        status: newStatus,
        changed_by: 'baker',
      })
      setOrder(res.data)
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to update status')
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Loading order...</p>
      </div>
    )
  }

  if (!order) return null

  const actions = NEXT_ACTIONS[order.current_status] || []

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gray-900 text-white p-4">
        <button
          onClick={() => navigate('/baker')}
          className="text-gray-400 text-sm"
        >
          &larr; Back to Dashboard
        </button>
        <h1 className="text-xl font-bold">Order #{order.order_id}</h1>
      </header>

      <div className="p-4 space-y-4">
        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm text-gray-500">Status</span>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${STATUS_COLORS[order.current_status]}`}
            >
              {STATUS_LABELS[order.current_status]}
            </span>
          </div>
          <div className="text-sm text-gray-500">
            Placed: {new Date(order.order_date).toLocaleString()}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="font-semibold mb-3">Items</h2>
          <div className="divide-y">
            {order.order_items.map((item) => (
              <div
                key={item.order_item_id}
                className="py-2 flex justify-between"
              >
                <span>
                  {item.quantity}x Item #{item.bread_product_id}
                </span>
                <span className="font-medium">
                  ${Number(item.subtotal).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
          <div className="flex justify-between font-bold text-lg border-t pt-3 mt-2">
            <span>Total</span>
            <span>${Number(order.total_amount).toFixed(2)}</span>
          </div>
        </div>

        {actions.length > 0 && (
          <div className="space-y-2">
            {actions.map((action) => (
              <button
                key={action.status}
                onClick={() => handleStatusUpdate(action.status)}
                disabled={updating}
                className={`w-full ${action.color} text-white py-3 rounded-xl font-semibold active:scale-95 transition disabled:opacity-50`}
              >
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
