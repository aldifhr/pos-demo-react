import { useState, useEffect } from 'react';
import type { Product } from '../App';

interface Props {
  product: Product | null;
  onSave: (product: Product) => void;
  onClose: () => void;
  dark: boolean;
}

export function ProductModal({ product, onSave, onClose, dark }: Props) {
  const [form, setForm] = useState<Omit<Product, 'id'>>({
    name: '', price: 0, stock: 0, image: '', category: '',
  });

  useEffect(() => {
    if (product) {
      setForm({ name: product.name, price: product.price, stock: product.stock, image: product.image, category: product.category });
    }
  }, [product]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || form.price <= 0) return;
    onSave({
      id: product?.id ?? Date.now(),
      name: form.name,
      price: form.price,
      stock: form.stock,
      image: form.image || 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=300&h=300&fit=crop',
      category: form.category || 'General',
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className={`rounded-xl shadow-2xl max-w-md w-full mx-4 overflow-hidden ${dark ? 'bg-slate-900' : 'bg-white'}`} onClick={e => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            <h3 className={`text-lg font-bold ${dark ? 'text-white' : 'text-slate-800'}`}>
              {product ? 'Edit Product' : 'Add Product'}
            </h3>
            <input
              type="text"
              placeholder="Product name"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              className={`w-full px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 ${dark ? 'bg-slate-800 text-white border-slate-700' : 'border border-slate-300'}`}
              required
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                placeholder="Price"
                value={form.price || ''}
                onChange={e => setForm(f => ({ ...f, price: parseFloat(e.target.value) || 0 }))}
                className={`w-full px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 ${dark ? 'bg-slate-800 text-white border-slate-700' : 'border border-slate-300'}`}
                min="0" step="0.01" required
              />
              <input
                type="number"
                placeholder="Stock"
                value={form.stock || ''}
                onChange={e => setForm(f => ({ ...f, stock: parseInt(e.target.value) || 0 }))}
                className={`w-full px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 ${dark ? 'bg-slate-800 text-white border-slate-700' : 'border border-slate-300'}`}
                min="0" required
              />
            </div>
            <input
              type="text"
              placeholder="Category"
              value={form.category}
              onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
              className={`w-full px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 ${dark ? 'bg-slate-800 text-white border-slate-700' : 'border border-slate-300'}`}
            />
            <input
              type="url"
              placeholder="Image URL (optional)"
              value={form.image}
              onChange={e => setForm(f => ({ ...f, image: e.target.value }))}
              className={`w-full px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 ${dark ? 'bg-slate-800 text-white border-slate-700' : 'border border-slate-300'}`}
            />
          </div>
          <div className={`px-6 py-3 flex gap-2 ${dark ? 'bg-slate-800' : 'bg-slate-50'}`}>
            <button type="button" onClick={onClose} className={`flex-1 py-2 rounded-lg text-sm ${dark ? 'bg-slate-700 text-slate-400 hover:bg-slate-600' : 'border border-slate-300 text-slate-600 hover:bg-white'}`}>Cancel</button>
            <button type="submit" className="flex-1 py-2 bg-emerald-600 text-white rounded-lg text-sm font-bold hover:bg-emerald-500">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}
