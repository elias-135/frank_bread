import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getUserOrders, cancelOrder } from '../../api/orders'
import { useUser } from '../../context/UserContext'
import ConfirmModal from '../../components/ConfirmModal'

const STATUS_LABELS = {
  pending: 'Pendiente',
  confirmed: 'Confirmado',
  out_for_delivery: 'En camino',
  completed: 'Completado',
  cancelled: 'Cancelado',
}

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  out_for_delivery: 'bg-purple-100 text-purple-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
}

const CANCELLABLE = new Set(['pending', 'confirmed'])

export default function TrackOrder() {
  const { user } = useUser()
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [cancellingId, setCancellingId] = useState(null)
  const [cancelError, setCancelError] = useState('')
  const [confirmOrder, setConfirmOrder] = useState(null)

  useEffect(() => {
    if (!user?.user_id) { setLoading(false); return }
    getUserOrders(user.user_id)
      .then((res) => setOrders(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [user])

  const handleCancel = async (order) => {
    setCancelError('')
    setCancellingId(order.order_id)
    try {
      const res = await cancelOrder(order.order_id, user.phone)
      setOrders((prev) => prev.map((o) => o.order_id === order.order_id ? res.data : o))
    } catch (err) {
      setCancelError(err.response?.data?.detail || 'No se pudo cancelar.')
    } finally {
      setCancellingId(null)
    }
  }

  return (
    <div className="font-sen min-h-screen bg-gray-50">
      {confirmOrder && (
        <ConfirmModal
          message={`¿Cancelar la orden #${confirmOrder.order_id}?`}
          confirmLabel="Sí, cancelar"
          danger
          onConfirm={() => { handleCancel(confirmOrder); setConfirmOrder(null) }}
          onCancel={() => setConfirmOrder(null)}
        />
      )}

      <header className="p-4 flex items-center gap-3">
        <button
          onClick={() => navigate('/menu')}
          className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center"
        >
          &larr;
        </button>
        <span className="text-lg font-semibold text-gray-800">Mis Órdenes</span>
      </header>

      <div className="px-4 pb-8 space-y-4">
        {loading && (
          <p className="text-center text-gray-400 mt-10">Cargando...</p>
        )}

        {!loading && orders.length === 0 && (
          <p className="text-center text-gray-400 mt-10">No tienes órdenes aún.</p>
        )}

        {orders.map((order) => (
          <div key={order.order_id} className="bg-white rounded-2xl shadow p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-bold text-gray-800">Orden #{order.order_id}</span>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[order.current_status]}`}>
                {STATUS_LABELS[order.current_status]}
              </span>
            </div>

            <p className="text-xs text-gray-400">
              {new Date(order.order_date).toLocaleString()}
            </p>

            <div className="divide-y">
              {order.order_items.map((item) => (
                <div key={item.order_item_id} className="py-2 flex justify-between text-sm">
                  <span className="text-gray-700">{item.quantity}x {item.product_name || `Producto #${item.product_id}`}</span>
                  <span className="text-gray-800 font-medium">${Number(item.subtotal).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-between font-bold text-base border-t pt-2">
              <span>Total</span>
              <span>${Number(order.total_amount).toFixed(2)}</span>
            </div>

            {CANCELLABLE.has(order.current_status) && (
              <button
                onClick={() => setConfirmOrder(order)}
                disabled={cancellingId === order.order_id}
                className="w-full py-3 rounded-xl border border-red-400 text-red-500 font-semibold active:scale-95 transition disabled:opacity-50"
              >
                {cancellingId === order.order_id ? 'Cancelando...' : 'Cancelar Orden'}
              </button>
            )}

            {cancelError && cancellingId === null && (
              <p className="text-red-500 text-sm text-center">{cancelError}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
