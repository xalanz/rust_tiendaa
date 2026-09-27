export function TarjetaEstadistica() {
  return (
    <div className="hero-stat" aria-label="Más de 300 skins disponibles">
      <span className="corner-mark corner-top-left" />
      <span className="corner-mark corner-top-right" />
      <span className="corner-mark corner-bottom-left" />
      <span className="corner-mark corner-bottom-right" />
      <strong>+300</strong>
      <span>skins disponibles ahora</span>
    </div>
  )
}

export function TarjetaProducto({ product }) {
  return (
    <article className="product-card">
      <div className="product-art">
        {product.tag && <span className="product-tag">{product.tag}</span>}
        {product.image ? (
          <img className="product-image" src={product.image} alt={product.name} />
        ) : (
          <span className="product-symbol" aria-hidden="true" />
        )}
      </div>
      <div className="product-info">
        <h3>{product.name}</h3>
        <div className="product-footer">
          <span className="price">${product.price.toLocaleString('es-AR')}</span>
          <button className="add-button" type="button">Agregar</button>
        </div>
      </div>
    </article>
  )
}
