import Catalogo from '../home/Catalogo.jsx'

export default function Ropa() {
  const ropa = [
    { name: 'Campera Chatarrero del Desierto', price: 1800, tag: 'Nuevo' },
    { name: 'Máscara Cráneo de Zorro', price: 1350, tag: null },
    { name: 'Casco Minero Reforzado', price: 990, tag: 'Popular' },
  ]

  return (
    <Catalogo
      title="Ropa y armaduras"
      intro="Equipamiento del superviviente"
      desc="Camperas, cascos y máscaras para resistir y destacar en la isla."
      items={ropa}
    />
  )
}
