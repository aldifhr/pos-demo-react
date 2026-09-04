import type { SaleRecord } from '../App';

interface Props {
  receiptNum: number;
  sale: SaleRecord;
  onClose: () => void;
  dark: boolean;
}

export function Receipt({ receiptNum, sale, onClose, dark }: Props) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className={`rounded-xl shadow-2xl max-w-sm w-full mx-4 overflow-hidden ${dark ? 'bg-slate-900' : 'bg-white'}`} onClick={e => e.stopPropagation()}>
        <div className="p-6 text-sm font-mono">
          <div className={`text-center border-b border-dashed pb-3 mb-3 ${dark ? 'border-slate-700' : 'border-slate-300'}`}>
            <h3 className={`font-bold text-base ${dark ? 'text-white' : ''}`}>POS SYSTEM</h3>
            <p className={`text-xs ${dark ? 'text-slate-500' : 'text-slate-500'}`}>123 Business Street</p>
            <p className={`text-xs ${dark ? 'text-slate-500' : 'text-slate-500'}`}>{new Date().toLocaleString()}</p>
            <p className={`text-xs mt-1 font-bold ${dark ? 'text-emerald-500' : 'text-slate-600'}`}>Receipt #{receiptNum}</p>
          </div>
          <div className="space-y-1 mb-3">
            {sale.items.map((c, i) => (
              <div key={i} className={`flex justify-between text-xs ${dark ? 'text-slate-400' : ''}`}>
                <span>{c.name} × {c.qty}</span>
                <span>${(c.price * c.qty).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className={`border-t border-dashed pt-2 space-y-1 ${dark ? 'border-slate-700' : 'border-slate-300'}`}>
            <div className={`flex justify-between text-xs ${dark ? 'text-slate-500' : ''}`}><span>Subtotal</span><span>${sale.subtotal.toFixed(2)}</span></div>
            <div className={`flex justify-between text-xs ${dark ? 'text-slate-500' : ''}`}><span>Tax 10%</span><span>${sale.tax.toFixed(2)}</span></div>
            <div className={`flex justify-between font-bold text-base ${dark ? 'text-white' : ''}`}><span>TOTAL</span><span>${sale.total.toFixed(2)}</span></div>
            <div className={`border-t pt-1 mt-2 ${dark ? 'border-slate-800' : 'border-slate-200'}`}>
              <div className={`flex justify-between text-xs ${dark ? 'text-slate-500' : ''}`}><span>Payment</span><span>{sale.payment}</span></div>
              <div className={`flex justify-between text-xs ${dark ? 'text-slate-500' : ''}`}><span>Paid</span><span>${sale.paid.toFixed(2)}</span></div>
              {sale.change > 0 && <div className="flex justify-between text-xs font-bold text-emerald-500"><span>Change</span><span>${sale.change.toFixed(2)}</span></div>}
            </div>
          </div>
          <p className={`text-center text-xs mt-4 ${dark ? 'text-slate-600' : 'text-slate-400'}`}>Thank you for your purchase!</p>
        </div>
        <div className={`px-6 py-3 flex gap-2 ${dark ? 'bg-slate-800' : 'bg-slate-50'}`}>
          <button onClick={onClose} className={`flex-1 py-2 rounded-lg text-sm ${dark ? 'bg-slate-700 text-slate-400 hover:bg-slate-600' : 'border border-slate-300 text-slate-600 hover:bg-white'}`}>Close</button>
          <button onClick={() => window.print()} className={`flex-1 py-2 rounded-lg text-sm ${dark ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-slate-800 text-white hover:bg-slate-700'}`}>Print</button>
        </div>
      </div>
    </div>
  );
}
