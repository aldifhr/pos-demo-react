import { useState } from 'react';

interface Props {
  total: number;
  onComplete: (payment: string, paid: number) => void;
  onCancel: () => void;
  dark: boolean;
}

export function Payment({ total, onComplete, onCancel, dark }: Props) {
  const [method, setMethod] = useState<'cash' | 'debit' | 'credit' | 'qris'>('cash');
  const [cashAmount, setCashAmount] = useState('');
  const [error, setError] = useState('');

  const paid = parseFloat(cashAmount) || 0;
  const change = Math.round((paid - total) * 100) / 100;

  const handleCashPay = () => {
    if (paid < total) { setError('Insufficient amount!'); return; }
    onComplete('Cash', paid);
  };

  const quickAmounts = [10, 20, 50, 100, 200, 500];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onCancel}>
      <div className={`rounded-xl shadow-2xl max-w-md w-full mx-4 overflow-hidden ${dark ? 'bg-slate-900' : 'bg-white'}`} onClick={e => e.stopPropagation()}>
        <div className="p-6">
          <h3 className={`text-lg font-bold mb-1 ${dark ? 'text-white' : 'text-slate-800'}`}>Payment</h3>
          <p className={`text-sm mb-4 ${dark ? 'text-slate-500' : 'text-slate-500'}`}>Total: <span className="font-bold text-emerald-500">${total.toFixed(2)}</span></p>

          <div className="grid grid-cols-4 gap-2 mb-4">
            {(['cash', 'debit', 'credit', 'qris'] as const).map(m => (
              <button key={m} onClick={() => setMethod(m)} className={`py-2 rounded-lg text-xs font-semibold border transition ${
                method === m ? 'bg-emerald-600 text-white border-emerald-600' : dark ? 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700' : 'bg-white text-slate-600 border-slate-300 hover:border-emerald-400'
              }`}>
                {m === 'cash' ? 'Cash' : m === 'debit' ? 'Debit' : m === 'credit' ? 'Credit' : 'QRIS'}
              </button>
            ))}
          </div>

          {method === 'cash' ? (
            <div className="space-y-3">
              <input type="number" value={cashAmount} onChange={e => { setCashAmount(e.target.value); setError(''); }}
                className={`w-full px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 ${dark ? 'bg-slate-800 text-white border-slate-700' : 'border border-slate-300'}`}
                placeholder="Enter amount" autoFocus />
              <div className="flex flex-wrap gap-2">
                {quickAmounts.map(a => (
                  <button key={a} onClick={() => { setCashAmount(String(a)); setError(''); }} className={`px-3 py-1.5 text-xs rounded-lg font-medium ${dark ? 'bg-slate-800 text-slate-400 hover:bg-slate-700' : 'bg-slate-100 hover:bg-slate-200'}`}>${a}</button>
                ))}
                <button onClick={() => { setCashAmount(String(Math.ceil(total))); setError(''); }} className="px-3 py-1.5 text-xs bg-emerald-500/10 text-emerald-500 rounded-lg hover:bg-emerald-500/20 font-medium">Exact</button>
              </div>
              {error && <p className="text-xs text-red-500">{error}</p>}
              {paid >= total && paid > 0 && (
                <div className={`rounded-lg p-3 flex justify-between items-center ${dark ? 'bg-slate-800' : 'bg-emerald-50'}`}>
                  <span className={`text-sm ${dark ? 'text-slate-400' : 'text-slate-600'}`}>Change:</span>
                  <span className="text-lg font-bold text-emerald-500">${change.toFixed(2)}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-6">
              <div className={`w-16 h-16 mx-auto rounded-xl flex items-center justify-center mb-3 ${dark ? 'bg-slate-800' : 'bg-slate-100'}`}>
                <span className="text-3xl">{method === 'qris' ? '📱' : '💳'}</span>
              </div>
              <p className={`text-sm ${dark ? 'text-slate-400' : 'text-slate-500'}`}>{method === 'qris' ? 'Scan QR code to pay' : `${method === 'debit' ? 'Debit' : 'Credit'} Card`}</p>
              <p className={`text-xs mt-1 ${dark ? 'text-slate-600' : 'text-slate-400'}`}>Simulated payment</p>
            </div>
          )}
        </div>

        <div className={`px-6 py-3 flex gap-2 ${dark ? 'bg-slate-800' : 'bg-slate-50'}`}>
          <button onClick={onCancel} className={`flex-1 py-2 rounded-lg text-sm ${dark ? 'bg-slate-700 text-slate-400 hover:bg-slate-600' : 'border border-slate-300 text-slate-600 hover:bg-white'}`}>Cancel</button>
          {method === 'cash' ? (
            <button onClick={handleCashPay} disabled={paid < total} className="flex-1 py-2 bg-emerald-600 text-white rounded-lg text-sm font-bold hover:bg-emerald-500 disabled:opacity-50">Complete Sale</button>
          ) : (
            <button onClick={() => onComplete(method === 'qris' ? 'QRIS' : method === 'debit' ? 'Debit Card' : 'Credit Card', total)} className="flex-1 py-2 bg-emerald-600 text-white rounded-lg text-sm font-bold hover:bg-emerald-500">Confirm</button>
          )}
        </div>
      </div>
    </div>
  );
}
