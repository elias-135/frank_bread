import { useState } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import { useCart } from '../context/CartContext'

function Navbar() {
  const [open, setOpen] = useState(false)
  const { user, logout } = useUser()
  const { items } = useCart()
  const navigate = useNavigate()
  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0)

  const navLinks = [
    { to: '/', label: 'Inicio' },
    { to: '/menu', label: 'Menú' },
    { to: '/track', label: 'Mis Órdenes' },
  ]

  return (
    <header className="sticky top-0 z-40 bg-espresso text-parchment shadow-md">
      <div className="flex items-center justify-between px-5 py-3">
        {/* Logo */}
        <button
          onClick={() => { navigate('/'); setOpen(false) }}
          className="flex items-center gap-2 active:opacity-75"
        >
          <img src="/logo.png" alt="frankBread" className="w-8 h-8 object-contain rounded-full" />
          <span className="font-display text-xl font-bold tracking-wide">frankBread</span>
        </button>

        <div className="flex items-center gap-3">
          {/* Cart button */}
          {user && (
            <button
              onClick={() => navigate('/cart')}
              className="relative w-11 h-11 flex items-center justify-center text-parchment"
              aria-label="Carrito"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 10a4 4 0 01-8 0"/>
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-terracotta text-white text-xs font-bold flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          )}

          {/* Hamburger */}
          <button
            onClick={() => setOpen(!open)}
            className="w-11 h-11 flex flex-col items-center justify-center gap-1.5"
            aria-label="Menú"
          >
            <span className={`block w-6 h-0.5 bg-parchment transition-all duration-200 ${open ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-6 h-0.5 bg-parchment transition-all duration-200 ${open ? 'opacity-0' : ''}`} />
            <span className={`block w-6 h-0.5 bg-parchment transition-all duration-200 ${open ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </div>

      {/* Slide-down menu */}
      {open && (
        <nav className="border-t border-white/10 px-5 py-4 space-y-1 bg-espresso">
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `block py-3 px-4 rounded-xl font-body text-base font-medium transition active:opacity-75 ${
                  isActive
                    ? 'bg-terracotta text-white'
                    : 'text-parchment hover:bg-white/10'
                }`
              }
            >
              {label}
            </NavLink>
          ))}

          {user ? (
            <button
              onClick={() => { logout(); navigate('/login'); setOpen(false) }}
              className="w-full text-left py-3 px-4 rounded-xl font-body text-base font-medium text-sand active:opacity-75"
            >
              Cambiar usuario
            </button>
          ) : (
            <NavLink
              to="/login"
              onClick={() => setOpen(false)}
              className="block py-3 px-4 rounded-xl font-body text-base font-medium text-parchment hover:bg-white/10 active:opacity-75"
            >
              Iniciar sesión
            </NavLink>
          )}
        </nav>
      )}
    </header>
  )
}

function Footer() {
  return (
    <footer className="bg-espresso text-sand px-5 py-8 mt-auto">
      <div className="text-center space-y-2">
        <p className="font-display text-lg text-parchment">frankBread</p>
        <p className="font-body text-sm">Panadería artesanal • Hecho con amor</p>
        <p className="font-mono text-xs text-sand/60 mt-3">Lun–Sáb 7:00 – 14:00</p>
      </div>
    </footer>
  )
}

export default function Layout({ children }) {
  const location = useLocation()
  // Baker routes get no layout chrome
  const isBaker = location.pathname.startsWith('/baker')
  const isLogin = location.pathname === '/login' || location.pathname === '/baker/login'

  if (isBaker || isLogin) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen flex flex-col bg-parchment">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  )
}
