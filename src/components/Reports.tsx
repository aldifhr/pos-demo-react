import type { SaleRecord } from '../App';

interface Props {
  sales: SaleRecord[];
  onClose: () => void;
  dark: boolean;
}

export function Reports({ sales, onClose, dark }: Props) {
  const today = new Date().toISOString().slice(0, 10);
  const todaySales = sales.filter(s => s.date.startsWith(today));
  const todayRevenue = todaySales.reduce((sum, s) => sum + s.total, 0);
  const totalRevenue = sales.reduce((sum, s) => sum + s.total, 0);

  const paymentBreakdown = sales.reduce((acc, s) => {
    acc[s.payment] = (acc[s.payment] || 0) + s.total;
    return acc;
  }, {} as Record<string, number>);

  const topProducts = sales.flatMap(s => s.items).reduce((acc, item) => {
    acc[item.name] = (acc[item.name] || 0) + item.qty;
    return acc;
  }, {} as Record<string, number>);

  const sortedTopProducts = Object.entries(topProducts).sort(([, a], [, b]) => b - a).slice(0, 5);

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className={`text-lg font-bold ${dark ? 'text-white' : 'text-slate-800'}`}>Reports & Transactions</h2>
        <button onClick={onClose} className={`px-4 py-2 text-sm rounded-lg ${dark ? 'bg-slate-800 text-slate-400 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>← Back</button>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: "Today's Revenue", value: `$${todayRevenue.toFixed(2)}`, color: 'text-emerald-500' },
          { label: "Today's Transactions", value: todaySales.length.toString(), color: 'text-blue-500' },
          { label: "Total Revenue", value: `$${totalRevenue.toFixed(2)}`, color: dark ? 'text-white' : 'text-slate-800' },
          { label: "Total Transactions", value: sales.length.toString(), color: dark ? 'text-white' : 'text-slate-800' },
        ].map(stat => (
          <div key={stat.label} className={`rounded-xl p-4 border transition-colors ${dark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <div className={`text-xs mb-1 ${dark ? 'text-slate-500' : 'text-slate-500'}`}>{stat.label}</div>
            <div className={`text-xl font-bold ${stat.color}`}>{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className={`rounded-xl p-5 border ${dark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
          <h3 className={`text-sm font-semibold mb-3 ${dark ? 'text-white' : 'text-slate-700'}`}>By Payment Method</h3>
          {Object.keys(paymentBreakdown).length === 0 ? <p className="text-sm text-slate-500">No data</p> : (
            <div className="space-y-2">
              {Object.entries(paymentBreakdown).map(([method, amount]) => (
                <div key={method} className="flex justify-between">
                  <span className={`text-sm ${dark ? 'text-slate-400' : 'text-slate-600'}`}>{method}</span>
                  <span className="text-sm font-mono font-semibold">${amount.toFixed(2)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className={`rounded-xl p-5 border ${dark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
          <h3 className={`text-sm font-semibold mb-3 ${dark ? 'text-white' : 'text-slate-700'}`}>Top Products</h3>
          {sortedTopProducts.length === 0 ? <p className="text-sm text-slate-500">No data</p> : (
            <div className="space-y-2">
              {sortedTopProducts.map(([name, qty]) => (
                <div key={name} className="flex justify-between">
                  <span className={`text-sm ${dark ? 'text-slate-400' : 'text-slate-600'}`}>{name}</span>
                  <span className="text-sm font-mono font-semibold">{qty} sold</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className={`rounded-xl border overflow-hidden ${dark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
        <div className={`px-5 py-3 border-b flex justify-between ${dark ? 'border-slate-800' : 'border-slate-200'}`}>
          <h3 className={`text-sm font-semibold ${dark ? 'text-white' : 'text-slate-700'}`}>Transaction History</h3>
          <span className={`text-xs ${dark ? 'text-slate-500' : 'text-slate-500'}`}>{sales.length} total</span>
        </div>
        {sales.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-500">No transactions yet</div>
        ) : (
          <table className="w-full text-sm">
            <thead className={dark ? 'bg-slate-800' : 'bg-slate-50'}>
              <tr>
                {['Receipt', 'Date', 'Items', 'Payment', 'Total'].map(h => (
                  <th key={h} className={`px-4 py-2.5 text-xs font-medium uppercase ${h === 'Total' ? 'text-right' : 'text-left'} ${dark ? 'text-slate-500' : 'text-slate-500'}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className={`divide-y ${dark ? 'divide-slate-800' : 'divide-slate-100'}`}>
              {sales.map(sale => (
                <tr key={sale.id} className={dark ? 'hover:bg-slate-800' : 'hover:bg-slate-50'}>
                  <td className={`px-4 py-3 font-mono text-xs ${dark ? 'text-slate-400' : 'text-slate-600'}`}>#{sale.id}</td>
                  <td className={`px-4 py-3 text-xs ${dark ? 'text-slate-400' : 'text-slate-600'}`}>{new Date(sale.date).toLocaleString()}</td>
                  <td className={`px-4 py-3 text-xs ${dark ? 'text-slate-400' : 'text-slate-600'}`}>{sale.items.map(i => `${i.name} ×${i.qty}`).join(', ')}</td>
                  <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded ${dark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100'}`}>{sale.payment}</span></td>
                  <td className="px-4 py-3 text-right font-mono font-semibold">${sale.total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
