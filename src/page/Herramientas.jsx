import Catalogo from '../home/Catalogo.jsx'
import { useCatalog } from '../useCatalog.js'

export default function Herramientas({ onAddToCart }) {
  const { items, loading, error } = useCatalog('herramientas')

  if (loading) return <p style={{ padding: '2rem', textAlign: 'center' }}>Cargando catálogo...</p>
  if (error) return <p style={{ padding: '2rem', textAlign: 'center' }}>No se pudo cargar el catálogo ({error}).</p>

  return (
    <Catalogo
      title="Base y herramientas"
      intro="Construcción y supervivencia"
      desc="Puertas, picos y hachas para levantar una base imposible de tomar."
      items={items}
      onAddToCart={onAddToCart}
    />
  )
}
