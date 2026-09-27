import Catalogo from '../home/Catalogo.jsx'

const herramientas1 = new URL('../img/Herramientas1.png', import.meta.url).href
const herramientas2 = new URL('../img/Herramientas2.png', import.meta.url).href
const herramientas3 = new URL('../img/Herramientas3.png', import.meta.url).href

export default function Herramientas() {
  const herramientas = [
    { name: 'Pico Óxido Radioactivo', price: 950, tag: 'Popular', image: herramientas1 },
    { name: 'Puerta Blindada Bunker', price: 2600, tag: 'Nuevo', image: herramientas2 },
    { name: 'Hacha Filo de Guerra', price: 1200, tag: null, image: herramientas3 },
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
