import { TarjetaProducto } from './TarjetasInfo.jsx'

export default function Catalogo({ title, desc, intro, items, onAddToCart }) {
  return (
    <section className="category-section catalog-page">
      <div className="container">
        <div className="section-heading">
          <span className="eyebrow">{intro}</span>
          <h1>{title}</h1>
          <p>{desc}</p>
        </div>
        <div className="product-grid">
          {items.map((product) => (
            <TarjetaProducto
              key={product.name}
              product={product}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
