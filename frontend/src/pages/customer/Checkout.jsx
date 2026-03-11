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
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 gap-4">
        <p className="text-gray-600 text-center">Debes iniciar sesión para continuar.</p>
        <button
          onClick={() => navigate('/login')}
          className="w-full py-4 rounded-xl text-white font-semibold text-lg active:scale-95 transition"
          style={{ backgroundColor: '#56463D' }}
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
    <div className="font-sen min-h-screen bg-gray-50 flex flex-col">
      {showConfirm && (
        <ConfirmModal
          message="¿Confirmar y colocar la orden?"
          confirmLabel="Sí, ordenar"
          onConfirm={() => { setShowConfirm(false); handlePlaceOrder() }}
          onCancel={() => setShowConfirm(false)}
        />
      )}
      {/* Header */}
      <div className="p-4 flex items-center gap-3">
        <button
          onClick={() => navigate('/cart')}
          className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center"
        >
          <span className="text-lg">&lsaquo;</span>
        </button>
        <span className="text-lg font-semibold text-gray-800">Confirmar Pedido</span>
      </div>

      {/* User info summary */}
      <div className="flex-1 px-6 space-y-4">
        <div className="bg-white rounded-xl p-4 space-y-3 shadow-sm">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-gray-500 tracking-wider">TUS DATOS</span>
            <button
              onClick={() => { logout(); navigate('/login') }}
              className="text-xs text-amber-700 underline"
            >
              Cambiar
            </button>
          </div>

          <div>
            <p className="text-xs text-gray-400">Nombre</p>
            <p className="text-gray-800 font-medium">{user.name}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Teléfono</p>
            <p className="text-gray-800 font-medium">{user.phone}</p>
          </div>
          <div>
            <div className="flex justify-between items-center">
              <p className="text-xs text-gray-400">Dirección</p>
              <button
                onClick={() => {
                  if (editingAddress) login({ ...user, address })
                  setEditingAddress(!editingAddress)
                }}
                className="text-xs text-amber-700 underline"
              >
                {editingAddress ? 'Guardar' : 'Editar'}
              </button>
            </div>
            {editingAddress ? (
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full mt-1 bg-gray-100 rounded-lg px-3 py-2 text-gray-800 outline-none text-sm"
              />
            ) : (
              <p className="text-gray-800 font-medium">{address}</p>
            )}
          </div>
        </div>

        {/* Order items summary */}
        <div className="bg-white rounded-xl p-4 shadow-sm divide-y">
          {items.map((item) => (
            <div key={item.product_id} className="py-2 flex justify-between text-sm">
              <span className="text-gray-700">{item.quantity}x {item.name}</span>
              <span className="text-amber-700 font-medium">
                ${(item.base_price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom — Total + Place Order */}
      <div className="p-6 space-y-4">
        <p className="text-gray-800 text-2xl font-bold text-center">
          Total: ${totalAmount.toFixed(2)}
        </p>

        <button
          onClick={() => setShowConfirm(true)}
          disabled={submitting || items.length === 0}
          className="w-full py-4 rounded-xl text-white font-semibold text-lg active:scale-95 transition disabled:opacity-50"
          style={{ backgroundColor: '#56463D' }}
        >
          {submitting ? 'PROCESANDO...' : 'COLOCAR ÓRDEN'}
        </button>
      </div>
    </div>
  )
}
