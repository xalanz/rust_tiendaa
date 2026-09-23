import CajaTexto from './CajaTexto.jsx'
import { TarjetaEstadistica } from './TarjetasInfo.jsx'

function Novedades() {
  return (
    <section className="updates-section">
      <div className="container">
        <div className="section-heading">
          <span className="eyebrow">Noticias de Rust</span>
          <h2>Lo nuevo del juego</h2>
          <p>Información rápida para preparar tu próxima aventura en la isla.</p>
        </div>
        <div className="updates-grid">
          <article className="update-card">
            <span className="update-number">01</span>
            <h3>Nuevas skins de temporada</h3>
            <p>Revisa las novedades visuales para armas, ropa y herramientas que llegan a la tienda.</p>
          </article>
          <article className="update-card">
            <span className="update-number">02</span>
            <h3>Prepará tu base</h3>
            <p>Mejorá tus defensas y renová tus puertas antes de volver a explorar el mapa.</p>
          </article>
          <article className="update-card">
            <span className="update-number">03</span>
            <h3>Actualización de la isla</h3>
            <p>Mantenete atento a los cambios, eventos y objetos que aparecen en cada wipe.</p>
          </article>
        </div>
      </div>
    </section>
  )
}

function Contacto() {
  return (
    <section className="contact-section" id="contacto">
      <div className="container contact-panel">
        <div>
          <h2>¿Tenés dudas sobre un trade?</h2>
          <p>Escribinos por Discord o Steam y te confirmamos disponibilidad y precio en minutos.</p>
        </div>
        <a className="button button-primary" href="https://discord.com" target="_blank" rel="noreferrer">
          Contactar por Discord
        </a>
      </div>
    </section>
  )
}

export default function Principal() {
  return (
    <main>
      <section className="hero-section" id="inicio">
        <div className="container hero-grid">
          <CajaTexto />
          <TarjetaEstadistica />
        </div>
      </section>
      <Novedades />
      <Contacto />
    </main>
  )
}
