import Catalogo from '../home/Catalogo.jsx'

const armas1 = new URL('../img/armas1.png', import.meta.url).href
const armas2 = new URL('../img/armas2.png', import.meta.url).href
const armas3 = new URL('../img/armas3.png', import.meta.url).href

export default function Armas() {
  const armas = [
    { name: 'AK47 | Chatarra Forjada', price: 4200, tag: 'Nuevo', image: armas1 },
    { name: 'MP5A4 | Protocolo Nocturno', price: 3100, tag: 'Últimas 3', image: armas2 },
    { name: 'Bolt Action | Francotirador Óxido', price: 5400, tag: null, image: armas3 },
  ]

  return (
    <Catalogo
      title="Armas"
      intro="Arsenal de Rust"
      desc="Rifles, pistolas y escopetas para dominar cada enfrentamiento."
      items={armas}
    />
  )
}
