import { useState, useCallback, useEffect } from 'react';
import { ProductGrid } from './components/ProductGrid';
import { ProductModal } from './components/ProductModal';
import { Cart } from './components/Cart';
import { Receipt } from './components/Receipt';
import { Payment } from './components/Payment';
import { Reports } from './components/Reports';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Login } from './components/Login';

export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  image: string;
  category: string;
}

export interface CartItem extends Product {
  qty: number;
}

export interface SaleRecord {
  id: number;
  date: string;
  items: { name: string; qty: number; price: number }[];
  subtotal: number;
  tax: number;
  total: number;
  payment: string;
  paid: number;
  change: number;
}

const TAX_RATE = 0.10;

const DATA_VERSION = 2;

const DEFAULT_PRODUCTS: Product[] = [
  { id: 1, name: 'Americano', price: 3.50, stock: 50, image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=300&h=300&fit=crop', category: 'Coffee' },
  { id: 2, name: 'Cappuccino', price: 4.75, stock: 40, image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=300&h=300&fit=crop', category: 'Coffee' },
  { id: 3, name: 'Latte', price: 5.00, stock: 35, image: 'https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?w=300&h=300&fit=crop', category: 'Coffee' },
  { id: 4, name: 'Espresso', price: 2.50, stock: 60, image: 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=300&h=300&fit=crop', category: 'Coffee' },
  { id: 5, name: 'Croissant', price: 3.75, stock: 25, image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=300&h=300&fit=crop', category: 'Bakery' },
  { id: 6, name: 'Muffin', price: 3.25, stock: 30, image: 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=300&h=300&fit=crop', category: 'Bakery' },
  { id: 7, name: 'Bagel', price: 2.99, stock: 20, image: 'https://images.unsplash.com/photo-1551106652-a5bcf4b29ab6?w=300&h=300&fit=crop', category: 'Bakery' },
  { id: 8, name: 'Sandwich', price: 7.99, stock: 15, image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=300&h=300&fit=crop', category: 'Food' },
  { id: 9, name: 'Salad Bowl', price: 9.50, stock: 12, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&h=300&fit=crop', category: 'Food' },
  { id: 10, name: 'Soup', price: 5.99, stock: 18, image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=300&h=300&fit=crop', category: 'Food' },
  { id: 11, name: 'Water', price: 1.99, stock: 100, image: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=300&h=300&fit=crop', category: 'Drinks' },
  { id: 12, name: 'Orange Juice', price: 4.49, stock: 25, image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=300&h=300&fit=crop', category: 'Drinks' },
];

const ADMIN_EMAIL = 'test@admin.com';
const ADMIN_PASSWORD = 'admin';

export default function App() {
  const [user, setUser] = useState<{ email: string } | null>(() => {
    const saved = localStorage.getItem('pos_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [dark, setDark] = useLocalStorage<boolean>('pos_dark', false);

  const handleLogin = useCallback((email: string, password: string) => {
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const userData = { email };
      localStorage.setItem('pos_user', JSON.stringify(userData));
      setUser(userData);
      return true;
    }
    return false;
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('pos_user');
    setUser(null);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  if (!user) {
    return <Login onLogin={handleLogin} dark={dark} setDark={setDark} />;
  }

  return <POSScreen email={user.email} onLogout={handleLogout} dark={dark} setDark={setDark} />;
}

function POSScreen({ email, onLogout, dark, setDark }: { email: string; onLogout: () => void; dark: boolean; setDark: (v: boolean) => void }) {
  const [products, setProducts] = useLocalStorage<Product[]>('pos_products', DEFAULT_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [receiptNum, setReceiptNum] = useLocalStorage<number>('pos_receipt_num', 1000);
  const [sales, setSales] = useLocalStorage<SaleRecord[]>('pos_sales', []);
  const [showReceipt, setShowReceipt] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState<'sale' | 'reports'>('sale');
  const [lastSale, setLastSale] = useState<SaleRecord | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const storedVersion = Number(localStorage.getItem('pos_version') || '0');
    if (storedVersion < DATA_VERSION || !products.some(p => p.image)) {
      localStorage.removeItem('pos_products');
      localStorage.removeItem('pos_receipt_num');
      localStorage.removeItem('pos_sales');
      localStorage.setItem('pos_version', String(DATA_VERSION));
      window.location.reload();
    }
  }, [products]);

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];
  const filteredProducts = products.filter(p => {
    const matchCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const addToCart = useCallback((productId: number) => {
    setProducts(prev => prev.map(p =>
      p.id === productId && p.stock > 0 ? { ...p, stock: p.stock - 1 } : p
    ));
    setCart(prev => {
      const existing = prev.find(c => c.id === productId);
      if (existing) {
        return prev.map(c => c.id === productId ? { ...c, qty: c.qty + 1 } : c);
      }
      const product = products.find(p => p.id === productId);
      if (!product) return prev;
      return [...prev, { ...product, qty: 1 }];
    });
  }, [products, setProducts]);

  const changeQty = useCallback((productId: number, delta: number) => {
    setProducts(prev => prev.map(p =>
      p.id === productId ? { ...p, stock: p.stock - delta } : p
    ));
    setCart(prev => {
      const updated = prev.map(c =>
        c.id === productId ? { ...c, qty: c.qty + delta } : c
      ).filter(c => c.qty > 0);
      return updated;
    });
  }, [setProducts]);

  const clearCart = useCallback(() => setCart([]), []);

  const openPayment = useCallback(() => {
    if (cart.length === 0) return;
    setShowPayment(true);
  }, [cart]);

  const handlePaymentComplete = useCallback((payment: string, paid: number) => {
    const subtotal = cart.reduce((s, c) => s + c.price * c.qty, 0);
    const tax = Math.round(subtotal * TAX_RATE * 100) / 100;
    const total = subtotal + tax;
    const change = Math.round((paid - total) * 100) / 100;
    const currentReceiptNum = receiptNum + 1;

    const saleRecord: SaleRecord = {
      id: currentReceiptNum,
      date: new Date().toISOString(),
      items: cart.map(c => ({ name: c.name, qty: c.qty, price: c.price })),
      subtotal, tax, total, payment, paid, change,
    };

    setSales(prev => [saleRecord, ...prev]);
    setReceiptNum(currentReceiptNum);
    setLastSale(saleRecord);
    setShowPayment(false);
    setShowReceipt(true);
    setCart([]);
  }, [cart, receiptNum, setReceiptNum, setSales]);

  const cancelPayment = useCallback(() => setShowPayment(false), []);
  const closeReceipt = useCallback(() => setShowReceipt(false), []);

  const handleSaveProduct = useCallback((product: Product) => {
    setProducts(prev => {
      const exists = prev.find(p => p.id === product.id);
      if (exists) {
        return prev.map(p => p.id === product.id ? product : p);
      }
      return [...prev, product];
    });
    setShowProductModal(false);
    setEditingProduct(null);
  }, [setProducts]);

  const handleDeleteProduct = useCallback((id: number) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  }, [setProducts]);

  const handleEditProduct = useCallback((product: Product) => {
    setEditingProduct(product);
    setShowProductModal(true);
  }, []);

  const handleAddProduct = useCallback(() => {
    setEditingProduct(null);
    setShowProductModal(true);
  }, []);

  const resetAll = useCallback(() => {
    if (!confirm('Reset all data?')) return;
    localStorage.removeItem('pos_products');
    localStorage.removeItem('pos_receipt_num');
    localStorage.removeItem('pos_sales');
    localStorage.removeItem('pos_version');
    window.location.reload();
  }, []);

  const cartCount = cart.reduce((s, c) => s + c.qty, 0);
  const subtotal = cart.reduce((s, c) => s + c.price * c.qty, 0);
  const tax = Math.round(subtotal * TAX_RATE * 100) / 100;
  const total = subtotal + tax;

  return (
    <div className={`min-h-screen flex transition-colors duration-200 ${dark ? 'bg-slate-950' : 'bg-slate-100'}`}>
      {/* Sidebar */}
      <aside className={`w-64 flex flex-col border-r transition-colors duration-200 ${dark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
        <div className={`p-5 border-b ${dark ? 'border-slate-800' : 'border-slate-200'}`}>
          <h1 className={`text-xl font-bold ${dark ? 'text-white' : 'text-slate-800'}`}>POS System</h1>
          <p className={`text-xs ${dark ? 'text-slate-500' : 'text-slate-500'}`}>Sale Demo</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <button
            onClick={() => setActiveTab('sale')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'sale'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                : dark ? 'text-slate-400 hover:bg-slate-800 hover:text-white' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <span>🛒</span> Sale
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'reports'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                : dark ? 'text-slate-400 hover:bg-slate-800 hover:text-white' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <span>📊</span> Reports
          </button>
        </nav>

        <div className={`p-4 border-t ${dark ? 'border-slate-800' : 'border-slate-200'}`}>
          <div className="flex items-center justify-between mb-3">
            <span className={`text-xs ${dark ? 'text-slate-500' : 'text-slate-500'}`}>{email}</span>
            <button
              onClick={() => setDark(!dark)}
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                dark ? 'bg-slate-800 hover:bg-slate-700 text-yellow-500' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
              title="Toggle dark mode"
            >
              {dark ? '☀️' : '🌙'}
            </button>
          </div>
          <div className="flex gap-2">
            <button onClick={resetAll} className="flex-1 py-2 text-xs bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition">Reset</button>
            <button onClick={onLogout} className={`flex-1 py-2 text-xs rounded-lg transition ${dark ? 'bg-slate-800 text-slate-400 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>Logout</button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {activeTab === 'sale' ? (
          <>
            <header className={`px-6 py-4 border-b flex justify-between items-center transition-colors duration-200 ${dark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
              <div className="flex items-center gap-4">
                <h2 className={`text-sm font-semibold uppercase ${dark ? 'text-slate-500' : 'text-slate-500'}`}>Products</h2>
                <div className="flex gap-1">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-all ${
                        selectedCategory === cat
                          ? 'bg-emerald-600 text-white'
                          : dark ? 'bg-slate-800 text-slate-400 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className={`px-3 py-1.5 text-xs rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 ${dark ? 'bg-slate-800 text-white border-slate-700' : 'border border-slate-300'}`}
                />
                <button
                  onClick={handleAddProduct}
                  className="px-3 py-1.5 text-xs bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 font-medium"
                >+ Add</button>
              </div>
              <div className="text-right">
                <div className={`text-sm font-bold ${dark ? 'text-white' : 'text-slate-700'}`}>Receipt #{receiptNum}</div>
                <div className={`text-xs ${dark ? 'text-slate-500' : 'text-slate-500'}`}>{new Date().toLocaleTimeString()}</div>
              </div>
            </header>

            <div className="flex-1 flex overflow-hidden">
              <div className="flex-1 p-6 overflow-y-auto">
                <ProductGrid
                  products={filteredProducts}
                  onAdd={addToCart}
                  onEdit={handleEditProduct}
                  onDelete={handleDeleteProduct}
                  dark={dark}
                  search={searchQuery}
                />
              </div>

              <div className={`w-96 border-l p-4 overflow-y-auto transition-colors duration-200 ${dark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                <Cart
                  items={cart}
                  subtotal={subtotal}
                  tax={tax}
                  total={total}
                  cartCount={cartCount}
                  onChangeQty={changeQty}
                  onClear={clearCart}
                  onPay={openPayment}
                  dark={dark}
                />
              </div>
            </div>
          </>
        ) : (
          <Reports sales={sales} dark={dark} onClose={() => setActiveTab('sale')} />
        )}
      </div>

      {showPayment && (
        <Payment total={total} onComplete={handlePaymentComplete} onCancel={cancelPayment} dark={dark} />
      )}

      {showReceipt && lastSale && (
        <Receipt receiptNum={receiptNum} sale={lastSale} onClose={closeReceipt} dark={dark} />
      )}

      {showProductModal && (
        <ProductModal
          product={editingProduct}
          onSave={handleSaveProduct}
          onClose={() => { setShowProductModal(false); setEditingProduct(null); }}
          dark={dark}
        />
      )}
    </div>
  );
}
