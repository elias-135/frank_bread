import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { UserProvider, useUser } from './context/UserContext'
import { BakerProvider } from './context/BakerContext'
import Layout from './components/Layout'
import BakerLogin from './pages/baker/BakerLogin'
import Login from './pages/customer/Login'
import Title from './pages/customer/Title'
import Menu from './pages/customer/Menu'
import ProductDetail from './pages/customer/ProductDetail'
import AddedToCart from './pages/customer/AddedToCart'
import Cart from './pages/customer/Cart'
import Checkout from './pages/customer/Checkout'
import OrderConfirm from './pages/customer/OrderConfirm'
import TrackOrder from './pages/customer/TrackOrder'
import Dashboard from './pages/baker/Dashboard'
import ManageStock from './pages/baker/ManageStock'
import OrderManage from './pages/baker/OrderManage'

function ProtectedRoute({ children }) {
  const { user } = useUser()
  return user ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <BakerProvider>
      <UserProvider>
        <CartProvider>
          <div className="max-w-md mx-auto min-h-screen">
            <Layout>
              <Routes>
                {/* Customer */}
                <Route path="/" element={<Title />} />
                <Route path="/login" element={<Login />} />
                <Route path="/menu" element={<ProtectedRoute><Menu /></ProtectedRoute>} />
                <Route path="/product/:id" element={<ProtectedRoute><ProductDetail /></ProtectedRoute>} />
                <Route path="/added-to-cart" element={<ProtectedRoute><AddedToCart /></ProtectedRoute>} />
                <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
                <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                <Route path="/order-confirmed/:id" element={<ProtectedRoute><OrderConfirm /></ProtectedRoute>} />
                <Route path="/track" element={<ProtectedRoute><TrackOrder /></ProtectedRoute>} />

                {/* Baker */}
                <Route path="/baker/login" element={<BakerLogin />} />
                <Route path="/baker" element={<Dashboard />} />
                <Route path="/baker/stock" element={<ManageStock />} />
                <Route path="/baker/order/:id" element={<OrderManage />} />
              </Routes>
            </Layout>
          </div>
        </CartProvider>
      </UserProvider>
      </BakerProvider>
    </BrowserRouter>
  )
}
