import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { useUser } from '../../context/UserContext'
import { placeGuestOrder } from '../../api/orders'
import ConfirmModal from '../../components/ConfirmModal'

export default function Checkout() {
  const navigate = useNavigate()
  const { items, totalAmount, clearCart } = useCart()
  const { user, login, logout } = useUser()
  const [submitting, setSubmitting] = useState(false)
  const [address, setAddress] = useState(user?.address || '')
  const [editingAddress, setEditingAddress] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  if (!user) {
    return (
      <div className="page-fade min-h-screen bg-parchment flex flex-col items-center justify-center px-5 gap-4">
        <p className="font-body text-espresso/70 text-center">Debes iniciar sesión para continuar.</p>
        <button
          onClick={() => navigate('/login')}
          className="btn-tap w-full rounded-2xl bg-terracotta text-white font-display font-semibold text-lg active:scale-95 transition"
        >
          Iniciar sesión
        </button>
      </div>
    )
  }

  const handlePlaceOrder = async () => {
    if (items.length === 0) return
    setSubmitting(true)
    try {
      const orderData = {
        name: user.name,
        phone: user.phone,
        address: address,
        items: items.map((i) => ({
          product_id: i.product_id,
          quantity: i.quantity,
        })),
      }
      const res = await placeGuestOrder(orderData)
      login({ ...user, user_id: res.data.user_id })
      clearCart()
      navigate(`/order-confirmed/${res.data.order_id}`, {
        state: { customerName: user.name },
      })
    } catch (err) {
      console.error(err)
      const detail = err.response?.data?.detail
      alert(detail || 'Error al colocar la orden. Intenta de nuevo.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="page-fade min-h-screen bg-parchment flex flex-col">
      {showConfirm && (
        <ConfirmModal
          message="¿Confirmar y colocar la orden?"
          confirmLabel="Sí, ordenar"
          onConfirm={() => { setShowConfirm(false); handlePlaceOrder() }}
          onCancel={() => setShowConfirm(false)}
        />
      )}

      {/* Header */}
      <div className="px-5 py-4 flex items-center gap-3 border-b border-sand/40">
        <button
          onClick={() => navigate('/cart')}
          className="w-11 h-11 rounded-full bg-sand/40 flex items-center justify-center active:scale-95 transition"
          aria-label="Volver"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-espresso">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span className="font-display text-xl font-bold text-espresso">Confirmar Pedido</span>
      </div>

      {/* Body */}
      <div className="flex-1 px-5 py-5 space-y-4">
        {/* User info */}
        <div className="bg-white rounded-2xl p-5 space-y-4 border border-sand/30 shadow-sm">
          <div className="flex justify-between items-center">
            <span className="font-mono text-xs text-espresso/50 tracking-widest uppercase">Tus datos</span>
            <button
              onClick={() => { logout(); navigate('/login') }}
              className="font-mono text-xs text-terracotta"
            >
              Cambiar
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <p className="font-mono text-xs text-espresso/40 uppercase">Nombre</p>
              <p className="font-body text-espresso font-medium mt-0.5">{user.name}</p>
            </div>
            <div>
              <p className="font-mono text-xs text-espresso/40 uppercase">Teléfono</p>
              <p className="font-body text-espresso font-medium mt-0.5">{user.phone}</p>
            </div>
            <div>
              <div className="flex justify-between items-center">
                <p className="font-mono text-xs text-espresso/40 uppercase">Dirección</p>
                <button
                  onClick={() => {
                    if (editingAddress) login({ ...user, address })
                    setEditingAddress(!editingAddress)
                  }}
                  className="font-mono text-xs text-terracotta"
                >
                  {editingAddress ? 'Guardar' : 'Editar'}
                </button>
              </div>
              {editingAddress ? (
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full mt-1 bg-parchment border border-sand rounded-lg px-3 py-2 font-body text-espresso text-base outline-none focus:border-terracotta transition"
                />
              ) : (
                <p className="font-body text-espresso font-medium mt-0.5">{address}</p>
              )}
            </div>
          </div>
        </div>

        {/* Order items */}
        <div className="bg-white rounded-2xl border border-sand/30 shadow-sm overflow-hidden">
          {items.map((item, idx) => (
            <div
              key={item.product_id}
              className={`px-5 py-3 flex justify-between items-center text-base ${idx > 0 ? 'border-t border-sand/30' : ''}`}
            >
              <span className="font-body text-espresso">{item.quantity}× {item.name}</span>
              <span className="font-display font-bold text-terracotta">
                ${(item.base_price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-sand/40 bg-white px-5 py-5 space-y-4">
        <div className="flex justify-between items-center">
          <span className="font-body text-espresso/60">Total</span>
          <span className="font-display text-3xl font-bold text-espresso">${totalAmount.toFixed(2)}</span>
        </div>

        <button
          onClick={() => setShowConfirm(true)}
          disabled={submitting || items.length === 0}
          className="btn-tap w-full rounded-2xl bg-terracotta text-white font-display font-semibold text-lg tracking-wide active:scale-95 transition disabled:opacity-50 shadow-md"
        >
          {submitting ? 'Procesando...' : 'Colocar Órden'}
        </button>
      </div>
    </div>
  )
}
