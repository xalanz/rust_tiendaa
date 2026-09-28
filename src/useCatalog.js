// src/useCatalog.js
import { useEffect, useState } from 'react'

// La API guarda solo un "imageKey"; aquí se traduce a la imagen local.
// Las rutas deben ser literales para que Vite las procese al compilar.
const images = {
  armas1: new URL('./img/armas1.png', import.meta.url).href,
  armas2: new URL('./img/armas2.png', import.meta.url).href,
  armas3: new URL('./img/armas3.png', import.meta.url).href,
  ropa1: new URL('./img/ropa1.png', import.meta.url).href,
  ropa2: new URL('./img/reopa2.png', import.meta.url).href,
  ropa3: new URL('./img/ropa3.png', import.meta.url).href,
  herramientas1: new URL('./img/Herramientas1.png', import.meta.url).href,
  herramientas2: new URL('./img/Herramientas2.png', import.meta.url).href,
  herramientas3: new URL('./img/Herramientas3.png', import.meta.url).href,
}

// Adapta el producto de la API a lo que espera TarjetaProducto.
function toCardItem(product) {
  return {
    id: product.productId,
    name: product.name,
    price: product.price,
    tag: product.tag ?? null,
    stock: product.stock,
    image: images[product.imageKey] ?? null,
  }
}

export function useCatalog(category) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    // GET /catalog es público: no necesita token.
    fetch(`${import.meta.env.VITE_API_URL}/catalog?category=${category}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Error ${res.status}`)
        return res.json()
      })
      .then((data) => {
        if (!cancelled) setItems(data.items.map(toCardItem))
      })
      .catch((err) => {
        if (!cancelled) setError(err.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [category])

  return { items, loading, error }
}
