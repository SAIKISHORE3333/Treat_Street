import { X, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface CartDrawerProps {
  onCheckout: () => void;
}

export default function CartDrawer({ onCheckout }: CartDrawerProps) {
  const { isOpen, closeCart, items, updateQuantity, removeItem, totalCost } = useCart();

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
          onClick={closeCart}
        />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
          <div>
            <h2 className="text-base font-bold text-slate-900">Shopping Cart</h2>
            <p className="text-xs text-slate-500">{items.length} {items.length === 1 ? 'item' : 'items'}</p>
          </div>
          <button
            onClick={closeCart}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-slate-400 px-6">
              <ShoppingBag size={40} className="text-slate-200" />
              <p className="text-sm font-medium">Your cart is empty</p>
              <p className="text-xs text-center">Browse the storefront and add items to get started.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {items.map(item => (
                <div key={item.product.id} className="flex gap-3 px-5 py-3.5">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 leading-snug line-clamp-2">
                      {item.product.name}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">{item.product.supplier?.name}</p>
                    {item.product.package_size && (
                      <p className="text-xs text-slate-400">{item.product.package_size}</p>
                    )}
                    <p className="text-xs font-semibold text-blue-700 mt-1">
                      £{(item.product.price * item.quantity).toFixed(2)}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <button
                      onClick={() => removeItem(item.product.id)}
                      className="text-slate-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                    <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="w-7 h-7 flex items-center justify-center text-slate-500 hover:bg-slate-100 text-sm"
                      >
                        −
                      </button>
                      <span className="w-7 text-center text-xs font-bold text-slate-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="w-7 h-7 flex items-center justify-center text-slate-500 hover:bg-slate-100 text-sm"
                      >
                        +
                      </button>
                    </div>
                    <p className="text-xs text-slate-400">£{item.product.price.toFixed(2)} ea</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-slate-200 px-5 py-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600 font-medium">Total</span>
              <span className="text-xl font-bold text-slate-900">£{totalCost.toFixed(2)}</span>
            </div>
            <button
              onClick={() => { closeCart(); onCheckout(); }}
              className="w-full flex items-center justify-center gap-2 py-3 bg-blue-800 text-white font-semibold rounded-xl hover:bg-blue-900 transition-colors text-sm"
            >
              Proceed to Checkout
              <ArrowRight size={15} />
            </button>
          </div>
        )}
      </div>
    </>
  );
}
