import Catalogo from '../home/Catalogo.jsx'
import { useCatalog } from '../useCatalog.js'

export default function Ropa({ onAddToCart }) {
  const { items, loading, error } = useCatalog('ropa')

  if (loading) return <p style={{ padding: '2rem', textAlign: 'center' }}>Cargando catálogo...</p>
  if (error) return <p style={{ padding: '2rem', textAlign: 'center' }}>No se pudo cargar el catálogo ({error}).</p>

  return (
    <Catalogo
      title="Ropa y armaduras"
      intro="Equipamiento del superviviente"
      desc="Camperas, cascos y máscaras para resistir y destacar en la isla."
      items={items}
      onAddToCart={onAddToCart}
    />
  )
}
