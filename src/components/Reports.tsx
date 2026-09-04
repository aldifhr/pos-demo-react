import { useState } from 'react';
import type { SaleRecord } from '../App';

interface Props {
  sales: SaleRecord[];
  dark: boolean;
  onClose: () => void;
}

export function Reports({ sales, dark, onClose }: Props) {
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [selectedSale, setSelectedSale] = useState<SaleRecord | null>(null);

  const filteredSales = sales.filter(s => {
    const saleDate = s.date.slice(0, 10);
    if (dateFrom && saleDate < dateFrom) return false;
    if (dateTo && saleDate > dateTo) return false;
    return true;
  });

  const today = new Date().toISOString().slice(0, 10);
  const todaySales = sales.filter(s => s.date.startsWith(today));
  const todayRevenue = todaySales.reduce((sum, s) => sum + s.total, 0);
  const totalRevenue = filteredSales.reduce((sum, s) => sum + s.total, 0);

  const paymentBreakdown = filteredSales.reduce((acc, s) => {
    acc[s.payment] = (acc[s.payment] || 0) + s.total;
    return acc;
  }, {} as Record<string, number>);

  const topProducts = filteredSales.flatMap(s => s.items).reduce((acc, item) => {
    acc[item.name] = (acc[item.name] || 0) + item.qty;
    return acc;
  }, {} as Record<string, number>);

  const sortedTopProducts = Object.entries(topProducts).sort(([, a], [, b]) => b - a).slice(0, 5);

  const exportCSV = () => {
    const rows = [['Receipt', 'Date', 'Items', 'Payment', 'Subtotal', 'Tax', 'Total']];
    filteredSales.forEach(s => {
      rows.push([
        `#${s.id}`,
        new Date(s.date).toLocaleString(),
        s.items.map(i => `${i.name} x${i.qty}`).join('; '),
        s.payment,
        s.subtotal.toFixed(2),
        s.tax.toFixed(2),
        s.total.toFixed(2),
      ]);
    });
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sales_${dateFrom || 'all'}_${dateTo || 'all'}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className={`text-lg font-bold ${dark ? 'text-white' : 'text-slate-800'}`}>Reports & Transactions</h2>
        <div className="flex gap-2">
          <input
            type="date"
            value={dateFrom}
            onChange={e => setDateFrom(e.target.value)}
            className={`px-3 py-1.5 text-xs rounded-lg ${dark ? 'bg-slate-800 text-white border-slate-700' : 'border border-slate-300'}`}
          />
          <input
            type="date"
            value={dateTo}
            onChange={e => setDateTo(e.target.value)}
            className={`px-3 py-1.5 text-xs rounded-lg ${dark ? 'bg-slate-800 text-white border-slate-700' : 'border border-slate-300'}`}
          />
          <button
            onClick={exportCSV}
            className="px-3 py-1.5 text-xs bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 font-medium"
          >Export CSV</button>
          <button onClick={onClose} className={`px-4 py-2 text-sm rounded-lg ${dark ? 'bg-slate-800 text-slate-400 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>← Back</button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: "Today's Revenue", value: `$${todayRevenue.toFixed(2)}`, color: 'text-emerald-500' },
          { label: "Today's Transactions", value: todaySales.length.toString(), color: 'text-blue-500' },
          { label: "Total Revenue", value: `$${totalRevenue.toFixed(2)}`, color: dark ? 'text-white' : 'text-slate-800' },
          { label: "Total Transactions", value: filteredSales.length.toString(), color: dark ? 'text-white' : 'text-slate-800' },
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
          <span className={`text-xs ${dark ? 'text-slate-500' : 'text-slate-500'}`}>{filteredSales.length} total</span>
        </div>
        {filteredSales.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-500">No transactions yet</div>
        ) : (
          <table className="w-full text-sm">
            <thead className={dark ? 'bg-slate-800' : 'bg-slate-50'}>
              <tr>
                {['Receipt', 'Date', 'Items', 'Payment', 'Total', ''].map(h => (
                  <th key={h} className={`px-4 py-2.5 text-xs font-medium uppercase ${h === 'Total' || h === '' ? 'text-right' : 'text-left'} ${dark ? 'text-slate-500' : 'text-slate-500'}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className={`divide-y ${dark ? 'divide-slate-800' : 'divide-slate-100'}`}>
              {filteredSales.map(sale => (
                <tr key={sale.id} className={`${dark ? 'hover:bg-slate-800' : 'hover:bg-slate-50'} cursor-pointer`} onClick={() => setSelectedSale(sale)}>
                  <td className={`px-4 py-3 font-mono text-xs ${dark ? 'text-slate-400' : 'text-slate-600'}`}>#{sale.id}</td>
                  <td className={`px-4 py-3 text-xs ${dark ? 'text-slate-400' : 'text-slate-600'}`}>{new Date(sale.date).toLocaleString()}</td>
                  <td className={`px-4 py-3 text-xs ${dark ? 'text-slate-400' : 'text-slate-600'}`}>{sale.items.map(i => `${i.name} ×${i.qty}`).join(', ')}</td>
                  <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded ${dark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100'}`}>{sale.payment}</span></td>
                  <td className="px-4 py-3 text-right font-mono font-semibold">${sale.total.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right">
                    <button className="text-xs text-emerald-500 hover:underline">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {selectedSale && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setSelectedSale(null)}>
          <div className={`rounded-xl shadow-2xl max-w-md w-full mx-4 overflow-hidden ${dark ? 'bg-slate-900' : 'bg-white'}`} onClick={e => e.stopPropagation()}>
            <div className="p-6">
              <h3 className={`text-lg font-bold mb-4 ${dark ? 'text-white' : 'text-slate-800'}`}>Receipt #{selectedSale.id}</h3>
              <p className={`text-xs mb-4 ${dark ? 'text-slate-500' : 'text-slate-500'}`}>{new Date(selectedSale.date).toLocaleString()}</p>
              <div className="space-y-2 mb-4">
                {selectedSale.items.map((item, i) => (
                  <div key={i} className="flex justify-between">
                    <span className={`text-sm ${dark ? 'text-slate-400' : 'text-slate-600'}`}>{item.name} ×{item.qty}</span>
                    <span className="text-sm font-mono">${(item.price * item.qty).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className={`border-t pt-3 space-y-1 ${dark ? 'border-slate-800' : 'border-slate-200'}`}>
                <div className="flex justify-between">
                  <span className={`text-sm ${dark ? 'text-slate-400' : 'text-slate-600'}`}>Subtotal</span>
                  <span className="text-sm font-mono">${selectedSale.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className={`text-sm ${dark ? 'text-slate-400' : 'text-slate-600'}`}>Tax</span>
                  <span className="text-sm font-mono">${selectedSale.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span className={`text-sm ${dark ? 'text-white' : 'text-slate-800'}`}>Total</span>
                  <span className="text-sm font-mono text-emerald-500">${selectedSale.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className={`text-sm ${dark ? 'text-slate-400' : 'text-slate-600'}`}>Paid</span>
                  <span className="text-sm font-mono">${selectedSale.paid.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className={`text-sm ${dark ? 'text-slate-400' : 'text-slate-600'}`}>Change</span>
                  <span className="text-sm font-mono">${selectedSale.change.toFixed(2)}</span>
                </div>
              </div>
            </div>
            <div className={`px-6 py-3 ${dark ? 'bg-slate-800' : 'bg-slate-50'}`}>
              <button onClick={() => setSelectedSale(null)} className={`w-full py-2 rounded-lg text-sm ${dark ? 'bg-slate-700 text-slate-400 hover:bg-slate-600' : 'border border-slate-300 text-slate-600 hover:bg-white'}`}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
