import type { CartItem } from '../App';

interface Props {
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  cartCount: number;
  onChangeQty: (id: number, delta: number) => void;
  onClear: () => void;
  onPay: () => void;
  dark: boolean;
}

export function Cart({ items, subtotal, tax, total, cartCount, onChangeQty, onClear, onPay, dark }: Props) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className={`text-sm font-semibold uppercase ${dark ? 'text-slate-500' : 'text-slate-500'}`}>Current Sale</h2>
        <span className={`text-xs px-2.5 py-1 rounded-full ${dark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-600'}`}>{cartCount} items</span>
      </div>

      <div className="flex-1 space-y-2 mb-4 overflow-y-auto">
        {items.length === 0 ? (
          <p className={`text-sm text-center py-8 ${dark ? 'text-slate-600' : 'text-slate-400'}`}>Cart is empty</p>
        ) : (
          items.map(c => (
            <div key={c.id} className={`flex items-center justify-between rounded-lg p-3 ${dark ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
              <div className="flex items-center gap-3">
                <img src={c.image} alt={c.name} className="w-10 h-10 rounded-lg object-cover" />
                <div>
                  <div className={`text-sm font-medium ${dark ? 'text-white' : 'text-slate-700'}`}>{c.name}</div>
                  <div className={`text-xs font-mono ${dark ? 'text-slate-500' : 'text-slate-500'}`}>${c.price.toFixed(2)} each</div>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button onClick={() => onChangeQty(c.id, -1)} className={`w-7 h-7 rounded text-sm font-bold ${dark ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'}`}>-</button>
                <span className={`w-8 text-center font-mono text-sm font-semibold ${dark ? 'text-white' : ''}`}>{c.qty}</span>
                <button onClick={() => onChangeQty(c.id, 1)} className={`w-7 h-7 rounded text-sm font-bold ${dark ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'}`}>+</button>
              </div>
              <div className={`w-20 text-right font-mono font-semibold ${dark ? 'text-white' : 'text-slate-700'}`}>${(c.price * c.qty).toFixed(2)}</div>
            </div>
          ))
        )}
      </div>

      <div className={`border-t pt-3 space-y-1.5 text-sm ${dark ? 'border-slate-800' : 'border-slate-200'}`}>
        <div className={`flex justify-between ${dark ? 'text-slate-400' : 'text-slate-600'}`}><span>Subtotal</span><span className="font-mono">{subtotal.toFixed(2)}</span></div>
        <div className={`flex justify-between ${dark ? 'text-slate-400' : 'text-slate-600'}`}><span>Tax (10%)</span><span className="font-mono">{tax.toFixed(2)}</span></div>
        <div className={`flex justify-between text-lg font-bold pt-2 border-t ${dark ? 'text-white border-slate-800' : 'text-slate-800 border-slate-100'}`}>
          <span>Total</span><span className="font-mono text-emerald-500">{total.toFixed(2)}</span>
        </div>
      </div>

      <div className="flex gap-2 mt-4">
        <button onClick={onClear} className={`flex-1 py-2.5 rounded-lg text-sm font-medium ${dark ? 'bg-slate-800 text-slate-400 hover:bg-slate-700' : 'border border-slate-300 text-slate-600 hover:bg-slate-50'}`}>Clear</button>
        <button onClick={onPay} className="flex-1 py-2.5 bg-emerald-600 text-white rounded-lg text-sm font-bold hover:bg-emerald-500 transition">Complete Sale</button>
      </div>
    </div>
  );
}
