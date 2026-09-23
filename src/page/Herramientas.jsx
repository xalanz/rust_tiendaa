import Catalogo from '../home/Catalogo.jsx'

export default function Herramientas() {
  const herramientas = [
    { name: 'Pico Óxido Radioactivo', price: 950, tag: 'Popular' },
    { name: 'Puerta Blindada Bunker', price: 2600, tag: 'Nuevo' },
    { name: 'Hacha Filo de Guerra', price: 1200, tag: null },
  ]

  return (
    <Catalogo
      title="Base y herramientas"
      intro="Construcción y supervivencia"
      desc="Puertas, picos y hachas para levantar una base imposible de tomar."
      items={herramientas}
    />
  )
}
