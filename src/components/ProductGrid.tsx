import type { Product } from '../App';

interface Props {
  products: Product[];
  onAdd: (id: number) => void;
  dark: boolean;
}

export function ProductGrid({ products, onAdd, dark }: Props) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {products.map(p => (
        <button
          key={p.id}
          onClick={() => onAdd(p.id)}
          disabled={p.stock <= 0}
          className={`group relative rounded-2xl overflow-hidden text-left transition-all duration-200 hover:shadow-xl hover:-translate-y-1 ${
            p.stock <= 0 ? 'opacity-50 cursor-not-allowed' : ''
          } ${
            dark ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200 shadow-sm'
          }`}
        >
          {/* Image */}
          <div className="relative h-36 overflow-hidden bg-gradient-to-br from-emerald-100 to-teal-50">
            <img
              src={p.image}
              alt={p.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              onError={e => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
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

          {/* Content */}
          <div className="p-4">
            <h3 className={`font-semibold text-sm mb-1 ${dark ? 'text-white' : 'text-slate-800'}`}>{p.name}</h3>
            <div className="flex justify-between items-center">
              <span className="font-mono font-bold text-emerald-500 text-lg">${p.price.toFixed(2)}</span>
              <span className={`text-xs ${dark ? 'text-slate-500' : 'text-slate-500'}`}>Stock: {p.stock}</span>
            </div>
          </div>

          {/* Add overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="bg-emerald-600 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg">+ Add to Cart</span>
          </div>
        </button>
      ))}
    </div>
  );
}
