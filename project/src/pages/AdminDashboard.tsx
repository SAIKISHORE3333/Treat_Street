import { useState, useEffect } from 'react';
import { ClipboardList, Package, LayoutDashboard, LogOut } from 'lucide-react';
import OrderLog from '../components/admin/OrderLog';
import InventoryManager from '../components/admin/InventoryManager';
import AdminLogin from '../components/admin/AdminLogin';
import { SESSION_KEY } from '../config/admin';

type Tab = 'orders' | 'inventory';

const TABS: { id: Tab; label: string; icon: typeof ClipboardList }[] = [
  { id: 'orders', label: 'Order Log', icon: ClipboardList },
  { id: 'inventory', label: 'Inventory Manager', icon: Package },
];

export default function AdminDashboard() {
  const [authed, setAuthed] = useState(true); // Temporarily bypassed passcode
  const [activeTab, setActiveTab] = useState<Tab>('orders');

  useEffect(() => {
    if (authed) sessionStorage.setItem(SESSION_KEY, 'true');
  }, [authed]);

  if (!authed) {
    return <AdminLogin onSuccess={() => setAuthed(true)} />;
  }

  return (
    <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden">
      {/* ALIA background watermark */}
      <div
        aria-hidden
        className="fixed inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
        style={{ zIndex: 0, top: '4rem' }}
      >
        <span
          className="font-black text-slate-900 tracking-[0.5em]"
          style={{
            fontSize: 'clamp(8rem, 28vw, 24rem)',
            opacity: 0.035,
            transform: 'rotate(-12deg)',
            userSelect: 'none',
            letterSpacing: '0.4em',
          }}
        >
          ALIA
        </span>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-[#1a3a5c] rounded-xl flex items-center justify-center shadow-md">
              <LayoutDashboard size={20} className="text-amber-400" />
            </div>
            <div>
              <p className="text-xs font-bold tracking-[0.2em] text-amber-600 uppercase">Treat Street</p>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">PURCHASE INVENTORY</h1>
              <p className="text-xs text-slate-400 tracking-wider mt-0.5">ALIA Admin Dashboard</p>
            </div>
          </div>

          <button
            onClick={() => { sessionStorage.removeItem(SESSION_KEY); setAuthed(false); }}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-500 hover:text-red-600 hover:bg-red-50 border border-slate-200 rounded-lg transition-colors"
          >
            <LogOut size={13} />
            Lock Dashboard
          </button>
        </div>

        <div className="flex gap-1 p-1 bg-slate-100 rounded-xl w-fit mb-8">
          {TABS.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all duration-150 ${
                  activeTab === tab.id
                    ? 'bg-white text-[#1a3a5c] shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <Icon size={15} />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div>
          {activeTab === 'orders' && <OrderLog />}
          {activeTab === 'inventory' && <InventoryManager />}
        </div>
      </div>
    </div>
  );
}
