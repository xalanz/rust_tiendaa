import Catalogo from '../home/Catalogo.jsx'

export default function Armas() {
  const armas = [
    { name: 'AK47 | Chatarra Forjada', price: 4200, tag: 'Nuevo' },
    { name: 'MP5A4 | Protocolo Nocturno', price: 3100, tag: 'Últimas 3' },
    { name: 'Bolt Action | Francotirador Óxido', price: 5400, tag: null },
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
