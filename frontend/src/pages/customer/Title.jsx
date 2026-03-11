import { useNavigate } from 'react-router-dom'
import { useUser } from '../../context/UserContext'

export default function Title() {
  const navigate = useNavigate()
  const { user } = useUser()

  return (
    <div className="page-fade">
      {/* Hero */}
      <section className="grain-hero relative min-h-[60vh] bg-espresso flex flex-col items-center justify-center px-5 text-center overflow-hidden">
        <div className="relative z-10 space-y-4">
          <img
            src="/logo.png"
            alt="frankBread"
            className="w-28 h-28 object-contain mx-auto rounded-full border-2 border-sand/30"
          />
          <h1 className="font-display text-4xl font-bold text-parchment leading-tight">
            frankBread
          </h1>
          <p className="font-body italic text-sand text-lg">
            Panadería artesanal de barrio
          </p>
        </div>
      </section>

      {/* Welcome / CTA */}
      <section className="px-5 py-10 space-y-6 bg-parchment">
        {user && (
          <p className="font-body text-espresso/70 text-base text-center">
            Bienvenido de vuelta,{' '}
            <span className="font-semibold text-espresso">{user.name}</span> 👋
          </p>
        )}

        <div className="space-y-3">
          <button
            onClick={() => navigate(user ? '/menu' : '/login')}
            className="btn-tap w-full rounded-2xl bg-terracotta text-white font-display font-semibold text-xl tracking-wide active:scale-95 transition shadow-md"
          >
            Ver el Menú
          </button>

          <button
            onClick={() => navigate(user ? '/track' : '/login')}
            className="btn-tap w-full rounded-2xl border-2 border-espresso text-espresso font-display font-semibold text-xl tracking-wide active:scale-95 transition"
          >
            {user ? 'Mis Órdenes' : 'Iniciar Sesión'}
          </button>
        </div>
      </section>

      {/* About teaser */}
      <section className="bg-sand/30 px-5 py-10 space-y-3 border-t border-sand">
        <h2 className="font-display text-2xl font-bold text-espresso">Horneado cada mañana</h2>
        <p className="font-body text-espresso/80 text-base leading-relaxed">
          Pan de masa madre, marraquetas crujientes, y especiales de temporada.
          Todo hecho a mano, sin apuros, con harina local.
        </p>
      </section>

      {/* Seasonal callout */}
      <section
        className="px-5 py-10 space-y-3 cursor-pointer active:opacity-90"
        onClick={() => navigate('/menu')}
      >
        <div className="rounded-2xl bg-blueberry px-6 py-8 text-center space-y-2">
          <p className="font-mono text-xs text-white/60 tracking-widest uppercase">Especial de temporada</p>
          <h3 className="font-display text-2xl font-bold text-white italic">Pan de Arándanos</h3>
          <p className="font-body text-white/80 text-sm">
            Masa madre con arándanos frescos. Disponible mientras dure.
          </p>
          <span className="inline-block mt-2 px-4 py-2 rounded-full bg-white/15 text-white font-mono text-xs tracking-wide">
            Ver en menú →
          </span>
        </div>
      </section>
    </div>
  )
}
