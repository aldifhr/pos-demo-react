import { useState } from 'react';
import type { Product } from '../App';

interface Props {
  products: Product[];
  onAdd: (id: number) => void;
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
  dark: boolean;
  search: string;
}

export function ProductGrid({ products, onAdd, onEdit, onDelete, dark, search }: Props) {
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {filtered.map(p => (
        <div
          key={p.id}
          className={`group relative rounded-2xl overflow-hidden transition-all duration-200 hover:shadow-xl hover:-translate-y-1 ${
            p.stock <= 0 ? 'opacity-50' : ''
          } ${
            dark ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200 shadow-sm'
          }`}
        >
          <button
            onClick={() => p.stock > 0 && onAdd(p.id)}
            disabled={p.stock <= 0}
            className="w-full text-left"
          >
            <div className="relative h-36 overflow-hidden bg-gradient-to-br from-emerald-100 to-teal-50">
              <img
                src={p.image}
                alt={p.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              {p.stock <= 0 && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <span className="text-white font-bold text-sm bg-red-600 px-3 py-1 rounded-full">Out of Stock</span>
                </div>
              )}
              <span className={`absolute top-2 right-2 text-xs font-medium px-2 py-1 rounded-full ${
                dark ? 'bg-slate-900/80 text-slate-300' : 'bg-white/90 text-slate-700'
              }`}>
                {p.category}
              </span>
            </div>
            <div className="p-4">
              <h3 className={`font-semibold text-sm mb-1 ${dark ? 'text-white' : 'text-slate-800'}`}>{p.name}</h3>
              <div className="flex justify-between items-center">
                <span className="font-mono font-bold text-emerald-500 text-lg">${p.price.toFixed(2)}</span>
                <span className={`text-xs ${dark ? 'text-slate-500' : 'text-slate-500'}`}>Stock: {p.stock}</span>
              </div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="bg-emerald-600 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg">+ Add to Cart</span>
            </div>
          </button>
          <div className="absolute top-2 left-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => { e.stopPropagation(); onEdit(p); }}
              className="w-7 h-7 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center hover:bg-blue-600 shadow"
              title="Edit"
            >✏️</button>
            {confirmDelete === p.id ? (
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(p.id); setConfirmDelete(null); }}
                className="w-7 h-7 rounded-full bg-red-600 text-white text-xs flex items-center justify-center hover:bg-red-700 shadow animate-pulse"
                title="Confirm delete"
              >✓</button>
            ) : (
              <button
                onClick={(e) => { e.stopPropagation(); setConfirmDelete(p.id); }}
                className="w-7 h-7 rounded-full bg-red-500 text-white text-xs flex items-center justify-center hover:bg-red-600 shadow"
                title="Delete"
              >🗑️</button>
            )}
          </div>
        </div>
      ))}
      {filtered.length === 0 && (
        <div className={`col-span-full text-center py-12 ${dark ? 'text-slate-500' : 'text-slate-400'}`}>
          <p className="text-4xl mb-2">🔍</p>
          <p>No products found</p>
        </div>
      )}
    </div>
  );
}
