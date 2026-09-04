import { useState } from 'react';

interface Props {
  onLogin: (email: string, password: string) => boolean;
  dark: boolean;
  setDark: (v: boolean) => void;
}

export function Login({ onLogin, dark, setDark }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onLogin(email, password)) {
      setError('Invalid email or password');
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center transition-colors duration-200 ${dark ? 'bg-slate-950' : 'bg-slate-100'}`}>
      <div className={`rounded-xl shadow-sm p-8 max-w-sm w-full transition-colors duration-200 ${dark ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200'}`}>
        <div className="flex justify-between items-start mb-6">
          <div className="text-center flex-1">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 ${dark ? 'bg-emerald-600/20' : 'bg-emerald-100'}`}>
              <span className="text-2xl">🛒</span>
            </div>
            <h1 className={`text-xl font-bold ${dark ? 'text-white' : 'text-slate-800'}`}>POS System</h1>
            <p className={`text-sm mt-1 ${dark ? 'text-slate-500' : 'text-slate-500'}`}>Sale Demo</p>
          </div>
          <button onClick={() => setDark(!dark)} className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${dark ? 'bg-slate-800 hover:bg-slate-700 text-yellow-500' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'}`}>
            {dark ? '☀️' : '🌙'}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={`block text-xs font-medium mb-1.5 ${dark ? 'text-slate-400' : 'text-slate-700'}`}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              className={`w-full px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 ${dark ? 'bg-slate-800 text-white border-slate-700' : 'border border-slate-300'}`}
              placeholder="Enter email" required />
          </div>
          <div>
            <label className={`block text-xs font-medium mb-1.5 ${dark ? 'text-slate-400' : 'text-slate-700'}`}>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              className={`w-full px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 ${dark ? 'bg-slate-800 text-white border-slate-700' : 'border border-slate-300'}`}
              placeholder="Enter password" required />
          </div>
          {error && <p className="text-xs text-red-500 bg-red-500/10 px-3 py-2 rounded-lg">{error}</p>}
          <button type="submit" className="w-full py-2.5 bg-emerald-600 text-white rounded-lg text-sm font-bold hover:bg-emerald-500 transition">Login</button>
        </form>

        <div className={`mt-4 p-3 rounded-lg text-center ${dark ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
          <p className={`text-xs mb-1 ${dark ? 'text-slate-500' : 'text-slate-500'}`}>Demo Credentials</p>
          <p className={`text-xs font-medium ${dark ? 'text-slate-400' : 'text-slate-600'}`}>Email: test@admin.com</p>
          <p className={`text-xs font-medium ${dark ? 'text-slate-400' : 'text-slate-600'}`}>Password: admin</p>
        </div>
      </div>
    </div>
  );
}
