import { useState, FormEvent } from 'react';
import { Lock, Eye, EyeOff, ShieldAlert } from 'lucide-react';
import { ADMIN_PASSWORD, SESSION_KEY } from '../../config/admin';

interface AdminLoginProps {
  onSuccess: () => void;
}

export default function AdminLogin({ onSuccess }: AdminLoginProps) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [shaking, setShaking] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, 'true');
      onSuccess();
    } else {
      setError('Access Denied — Invalid Passcode');
      setShaking(true);
      setPassword('');
      setTimeout(() => setShaking(false), 600);
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 bg-slate-50">
      {/* ALIA background watermark */}
      <div
        aria-hidden
        className="fixed inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
        style={{ zIndex: 0 }}
      >
        <span
          className="font-black text-slate-900 tracking-[0.5em]"
          style={{ fontSize: 'clamp(6rem, 25vw, 22rem)', opacity: 0.03, transform: 'rotate(-12deg)', userSelect: 'none' }}
        >
          ALIA
        </span>
      </div>

      <div className="relative z-10 w-full max-w-sm">
        {/* Brand header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#1a3a5c] shadow-lg mb-4">
            <Lock size={22} className="text-amber-400" />
          </div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">TREAT STREET</h1>
          <p className="text-xs text-slate-400 tracking-[0.2em] uppercase mt-0.5">Purchase Inventory — ALIA Engine</p>
        </div>

        <div className={`bg-white rounded-2xl shadow-xl border border-slate-200 p-7 transition-all duration-150 ${shaking ? 'animate-shake' : ''}`}>
          <div className="mb-5">
            <h2 className="text-base font-bold text-slate-900">Admin Access</h2>
            <p className="text-xs text-slate-400 mt-0.5">Enter your secure passcode to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Access Key</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(''); }}
                  placeholder="Enter admin passcode"
                  autoFocus
                  className="w-full pr-10 pl-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a3a5c] transition-shadow bg-slate-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 px-3 py-2.5 bg-red-50 border border-red-200 rounded-xl">
                <ShieldAlert size={14} className="text-red-500 shrink-0" />
                <p className="text-xs font-semibold text-red-700">{error}</p>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 bg-[#1a3a5c] text-white font-bold rounded-xl hover:bg-[#0f2440] transition-colors text-sm tracking-wide"
            >
              Unlock Dashboard
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-slate-400 mt-4">
          Powered by <span className="font-bold tracking-widest text-slate-500">ALIA</span> &bull; Treat Street Inventory Engine
        </p>
      </div>

      <style>{`
        @keyframes shake {
          0%,100%{transform:translateX(0)}
          20%{transform:translateX(-8px)}
          40%{transform:translateX(8px)}
          60%{transform:translateX(-6px)}
          80%{transform:translateX(6px)}
        }
        .animate-shake { animation: shake 0.5s ease-in-out; }
      `}</style>
    </div>
  );
}
