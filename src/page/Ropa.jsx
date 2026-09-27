import Catalogo from '../home/Catalogo.jsx'

const ropa1 = new URL('../img/ropa1.png', import.meta.url).href
const ropa2 = new URL('../img/reopa2.png', import.meta.url).href
const ropa3 = new URL('../img/ropa3.png', import.meta.url).href

export default function Ropa() {
  const ropa = [
    { name: 'Campera Chatarrero del Desierto', price: 1800, tag: 'Nuevo', image: ropa1 },
    { name: 'Máscara Cráneo de Zorro', price: 1350, tag: null, image: ropa2 },
    { name: 'Casco Minero Reforzado', price: 990, tag: 'Popular', image: ropa3 },
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
