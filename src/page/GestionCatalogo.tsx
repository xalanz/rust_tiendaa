// src/page/GestionCatalogo.tsx — administración del catálogo (Admin: CRUD, Operador: solo lectura)
import { useState, type FormEvent } from 'react';
import { useRoles } from '../useRoles';
import { useJsonApi, useLoad } from '../useJsonApi';
import { money } from '../format';
import type { Product } from '../types';

const CATEGORIES = ['armas', 'ropa', 'herramientas'];
// Las imágenes viven en el frontend (src/img); un producto nuevo con otra imagen
// requiere agregarla en useCatalog.js.
const IMAGE_KEYS = [
  'armas1', 'armas2', 'armas3',
  'ropa1', 'ropa2', 'ropa3',
  'herramientas1', 'herramientas2', 'herramientas3',
];
const LOW_STOCK = 3;

type FormState = {
  name: string;
  category: string;
  price: string;
  stock: string;
  tag: string;
  imageKey: string;
};

const emptyForm: FormState = { name: '', category: 'armas', price: '', stock: '', tag: '', imageKey: '' };

export default function GestionCatalogo() {
  const { has } = useRoles();
  const canEdit = has('Admin');
  const request = useJsonApi();
  const { data, loading, error, reload } = useLoad<{ items: Product[] }>('/catalog');

  const [editing, setEditing] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [formError, setFormError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setFormError(null);
    setShowForm(true);
  };

  const openEdit = (p: Product) => {
    setEditing(p);
    setForm({
      name: p.name,
      category: p.category,
      price: String(p.price),
      stock: String(p.stock),
      tag: p.tag ?? '',
      imageKey: p.imageKey ?? '',
    });
    setFormError(null);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditing(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const price = Number(form.price);
    const stock = Number(form.stock);
    if (!form.name.trim()) return setFormError('El nombre es obligatorio');
    if (form.price === '' || !Number.isFinite(price) || price < 0) {
      return setFormError('El precio debe ser un número mayor o igual a 0');
    }
    if (form.stock === '' || !Number.isInteger(stock) || stock < 0) {
      return setFormError('El stock debe ser un entero mayor o igual a 0');
    }

    setSaving(true);
    try {
      if (editing) {
        await request(`/catalog/${encodeURIComponent(editing.productId)}`, {
          method: 'PUT',
          body: JSON.stringify({
            name: form.name.trim(),
            category: form.category,
            price,
            stock,
            tag: form.tag.trim() || null, // null borra la etiqueta
            imageKey: form.imageKey,
          }),
        });
      } else {
        await request('/catalog', {
          method: 'POST',
          body: JSON.stringify({
            name: form.name.trim(),
            category: form.category,
            price,
            stock,
            ...(form.tag.trim() ? { tag: form.tag.trim() } : {}),
            ...(form.imageKey ? { imageKey: form.imageKey } : {}),
          }),
        });
      }
      closeForm();
      reload();
    } catch (err) {
      setFormError((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const adjustStock = async (p: Product, delta: number) => {
    setBusyId(p.productId);
    setActionError(null);
    try {
      await request(`/catalog/${encodeURIComponent(p.productId)}`, {
        method: 'PUT',
        body: JSON.stringify({ stock: Math.max(0, p.stock + delta) }),
      });
      reload();
    } catch (err) {
      setActionError((err as Error).message);
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (p: Product) => {
    if (!window.confirm(`¿Eliminar "${p.name}"? Esta acción no se puede deshacer.`)) return;
    setBusyId(p.productId);
    setActionError(null);
    try {
      await request(`/catalog/${encodeURIComponent(p.productId)}`, { method: 'DELETE' });
      reload();
    } catch (err) {
      setActionError((err as Error).message);
    } finally {
      setBusyId(null);
    }
  };

  const set = (field: keyof FormState) => (e: { target: { value: string } }) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const products = data?.items ?? [];

  return (
    <section>
      <div className="orders-toolbar">
        <div>
          <h1 className="page-title">Catálogo de productos</h1>
          <p className="page-subtitle">
            {canEdit ? 'Crea, edita y controla el stock.' : 'Vista de solo lectura del catálogo y su stock.'}
          </p>
        </div>
        {canEdit && (
          <button type="button" className="orders-button" onClick={openCreate}>
            + Nuevo producto
          </button>
        )}
      </div>

      {canEdit && showForm && (
        <form className="panel form-panel" onSubmit={handleSubmit}>
          <h2>{editing ? 'Editar producto' : 'Nuevo producto'}</h2>
          <div className="form-grid">
            <label className="field">
              Nombre
              <input value={form.name} onChange={set('name')} maxLength={100} required />
            </label>
            <label className="field">
              Categoría
              <select value={form.category} onChange={set('category')}>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </label>
            <label className="field">
              Precio
              <input type="number" min="0" step="1" value={form.price} onChange={set('price')} required />
            </label>
            <label className="field">
              Stock
              <input type="number" min="0" step="1" value={form.stock} onChange={set('stock')} required />
            </label>
            <label className="field">
              Etiqueta (opcional)
              <input value={form.tag} onChange={set('tag')} maxLength={30} placeholder="Nuevo, Popular..." />
            </label>
            <label className="field">
              Imagen
              <select value={form.imageKey} onChange={set('imageKey')}>
                <option value="">(sin imagen)</option>
                {IMAGE_KEYS.map((k) => (
                  <option key={k} value={k}>{k}</option>
                ))}
              </select>
            </label>
          </div>
          {formError && <p className="orders-error">{formError}</p>}
          <div className="form-actions">
            <button type="submit" className="orders-button" disabled={saving}>
              {saving ? 'Guardando...' : 'Guardar'}
            </button>
            <button type="button" className="orders-button danger" onClick={closeForm} disabled={saving}>
              Cancelar
            </button>
          </div>
        </form>
      )}

      {error && <p className="orders-error">{error}</p>}
      {actionError && <p className="orders-error">{actionError}</p>}
      {loading && !data && <p className="orders-empty">Cargando catálogo...</p>}
      {!loading && data && products.length === 0 && <p className="orders-empty">No hay productos.</p>}

      {products.length > 0 && (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Stock</th>
                {canEdit && <th>Acciones</th>}
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.productId}>
                  <td>
                    {p.name}
                    {p.tag && <span className="tag-chip">{p.tag}</span>}
                  </td>
                  <td>{p.category}</td>
                  <td>{money(p.price)}</td>
                  <td>
                    <div className="stock-cell">
                      {canEdit && (
                        <button
                          type="button"
                          className="qty-mini"
                          disabled={busyId === p.productId || p.stock === 0}
                          onClick={() => adjustStock(p, -1)}
                          aria-label={`Restar una unidad de ${p.name}`}
                        >
                          −
                        </button>
                      )}
                      <span className={p.stock <= LOW_STOCK ? 'low-stock' : ''}>{p.stock}</span>
                      {canEdit && (
                        <button
                          type="button"
                          className="qty-mini"
                          disabled={busyId === p.productId}
                          onClick={() => adjustStock(p, 1)}
                          aria-label={`Sumar una unidad de ${p.name}`}
                        >
                          +
                        </button>
                      )}
                      {p.stock <= LOW_STOCK && <span className="low-stock-note">stock bajo</span>}
                    </div>
                  </td>
                  {canEdit && (
                    <td>
                      <div className="order-actions">
                        <button type="button" className="orders-button" onClick={() => openEdit(p)} disabled={busyId === p.productId}>
                          Editar
                        </button>
                        <button type="button" className="orders-button danger" onClick={() => remove(p)} disabled={busyId === p.productId}>
                          Eliminar
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
