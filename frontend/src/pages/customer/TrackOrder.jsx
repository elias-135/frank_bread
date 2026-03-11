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

const STATUS_STYLES = {
  pending:          'bg-amber-100 text-amber-800',
  confirmed:        'bg-blue-100 text-blue-800',
  out_for_delivery: 'bg-blueberry/20 text-blueberry',
  completed:        'bg-green-100 text-green-800',
  cancelled:        'bg-red-100 text-red-600',
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
    <div className="page-fade min-h-screen bg-parchment">
      {confirmOrder && (
        <ConfirmModal
          message={`¿Cancelar la orden #${confirmOrder.order_id}?`}
          confirmLabel="Sí, cancelar"
          danger
          onConfirm={() => { handleCancel(confirmOrder); setConfirmOrder(null) }}
          onCancel={() => setConfirmOrder(null)}
        />
      )}

      <div className="px-5 py-8 space-y-5">
        <div className="space-y-1">
          <h1 className="font-display text-3xl font-bold text-espresso">Mis Órdenes</h1>
          <p className="font-body italic text-espresso/50 text-sm">Historial y seguimiento</p>
        </div>

        {loading && (
          <p className="text-center font-body italic text-espresso/40 mt-10">Cargando...</p>
        )}

        {!loading && orders.length === 0 && (
          <div className="text-center py-16 space-y-3">
            <p className="font-display text-xl text-espresso/40 italic">No tienes órdenes aún.</p>
            <button
              onClick={() => navigate('/menu')}
              className="btn-tap px-6 rounded-2xl bg-terracotta text-white font-display font-semibold text-base active:scale-95 transition"
            >
              Ver menú
            </button>
          </div>
        )}

        {orders.map((order) => (
          <div key={order.order_id} className="bg-white rounded-2xl border border-sand/30 shadow-sm overflow-hidden">
            {/* Order header */}
            <div className="px-5 py-4 flex justify-between items-center border-b border-sand/20">
              <span className="font-display font-bold text-espresso text-lg">Orden #{order.order_id}</span>
              <span className={`px-3 py-1 rounded-full font-mono text-xs font-semibold ${STATUS_STYLES[order.current_status] || 'bg-gray-100 text-gray-600'}`}>
                {STATUS_LABELS[order.current_status] || order.current_status}
              </span>
            </div>

            {/* Date */}
            <p className="px-5 pt-3 font-mono text-xs text-espresso/40">
              {new Date(order.order_date).toLocaleString()}
            </p>

            {/* Items */}
            <div className="px-5 py-3">
              {order.order_items.map((item, idx) => (
                <div
                  key={item.order_item_id}
                  className={`py-2.5 flex justify-between items-center text-sm ${idx > 0 ? 'border-t border-sand/20' : ''}`}
                >
                  <span className="font-body text-espresso">{item.quantity}× {item.product_name || `Producto #${item.product_id}`}</span>
                  <span className="font-display font-bold text-espresso">${Number(item.subtotal).toFixed(2)}</span>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="px-5 py-3 border-t border-sand/30 flex justify-between items-center">
              <span className="font-body text-espresso/60 text-sm">Total</span>
              <span className="font-display font-bold text-lg text-terracotta">${Number(order.total_amount).toFixed(2)}</span>
            </div>

            {/* Cancel button */}
            {CANCELLABLE.has(order.current_status) && (
              <div className="px-5 pb-5">
                <button
                  onClick={() => setConfirmOrder(order)}
                  disabled={cancellingId === order.order_id}
                  className="btn-tap w-full rounded-xl border border-red-300 text-red-500 font-body font-semibold active:scale-95 transition disabled:opacity-50"
                >
                  {cancellingId === order.order_id ? 'Cancelando...' : 'Cancelar Orden'}
                </button>
              </div>
            )}

            {cancelError && cancellingId === null && (
              <p className="px-5 pb-4 font-body text-red-500 text-sm text-center">{cancelError}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
