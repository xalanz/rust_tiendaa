import Catalogo from '../home/Catalogo.jsx'
import { useCatalog } from '../useCatalog.js'

export default function Armas({ onAddToCart }) {
  const { items, loading, error } = useCatalog('armas')

  if (loading) return <p style={{ padding: '2rem', textAlign: 'center' }}>Cargando catálogo...</p>
  if (error) return <p style={{ padding: '2rem', textAlign: 'center' }}>No se pudo cargar el catálogo ({error}).</p>

  return (
    <Catalogo
      title="Armas"
      intro="Arsenal de Rust"
      desc="Rifles, pistolas y escopetas para dominar cada enfrentamiento."
      items={items}
      onAddToCart={onAddToCart}
    />
  )
}
