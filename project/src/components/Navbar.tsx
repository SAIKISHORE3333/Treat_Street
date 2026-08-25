import { ShoppingCart, Package, LayoutDashboard } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface NavbarProps {
  onNavigate: (path: string) => void;
  currentPath: string;
}

export default function Navbar({ onNavigate, currentPath }: NavbarProps) {
  const { totalItems, toggleCart } = useCart();
  const isAdmin = currentPath === '/admin';

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-[#1a3a5c] border-b border-[#0f2440] shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button
            onClick={() => onNavigate('/')}
            className="flex items-center gap-3 group"
          >
            <div className="w-8 h-8 bg-amber-400 rounded-lg flex items-center justify-center shrink-0">
              <Package size={16} className="text-[#1a3a5c]" />
            </div>
            <div className="leading-tight text-left">
              <div className="text-sm font-black text-white tracking-wide">TREAT STREET</div>
              <div className="text-[10px] text-amber-400 tracking-[0.15em] uppercase font-medium">Purchase Inventory</div>
            </div>
          </button>

          <div className="flex items-center gap-2">
            {isAdmin ? (
              <button
                onClick={() => onNavigate('/')}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <Package size={14} />
                <span>Storefront</span>
              </button>
            ) : (
              <>
                <button
                  onClick={() => onNavigate('/admin')}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  <LayoutDashboard size={14} />
                  <span className="hidden sm:inline">Admin</span>
                </button>
                <button
                  onClick={toggleCart}
                  className="relative flex items-center gap-1.5 px-3 py-1.5 text-sm font-bold bg-amber-400 text-[#1a3a5c] hover:bg-amber-300 rounded-lg transition-colors"
                >
                  <ShoppingCart size={14} />
                  <span>Cart</span>
                  {totalItems > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-white text-[#1a3a5c] text-xs font-black rounded-full flex items-center justify-center leading-none shadow">
                      {totalItems > 99 ? '99+' : totalItems}
                    </span>
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
