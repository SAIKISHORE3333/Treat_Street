import { useState } from 'react';
import { ShoppingCart, Tag, Package2 } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

interface ItemCardProps {
  product: Product;
}

const CATEGORY_COLORS: Record<string, string> = {
  'Baking & Confectionery': 'bg-amber-50 text-amber-700 border-amber-200',
  'Cleaning & Hygiene': 'bg-sky-50 text-sky-700 border-sky-200',
  'Condiments & Sauces': 'bg-red-50 text-red-700 border-red-200',
  'Drinks & Beverages': 'bg-blue-50 text-blue-700 border-blue-200',
  'Dairy & Alternatives': 'bg-green-50 text-green-700 border-green-200',
  'Frozen & Prepared': 'bg-indigo-50 text-indigo-700 border-indigo-200',
  'Bakery & Bread': 'bg-orange-50 text-orange-700 border-orange-200',
  'Packaging & Equipment': 'bg-slate-50 text-slate-700 border-slate-200',
};

export default function ItemCard({ product }: ItemCardProps) {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const { addItem, openCart } = useCart();

  const badgeClass = CATEGORY_COLORS[product.category] ?? 'bg-slate-50 text-slate-700 border-slate-200';

  function handleAdd() {
    addItem(product, qty);
    setAdded(true);
    openCart();
    setTimeout(() => setAdded(false), 1800);
    setQty(1);
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col overflow-hidden group">
      <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-5 flex items-center justify-center h-20 border-b border-slate-100">
        <Package2 size={28} className="text-slate-300 group-hover:text-slate-400 transition-colors" />
      </div>

      <div className="flex-1 p-4 flex flex-col gap-3">
        <div>
          <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border ${badgeClass}`}>
            <Tag size={10} />
            {product.category}
          </span>
        </div>

        <div className="flex-1">
          <h3 className="text-sm font-semibold text-slate-900 leading-snug line-clamp-2 mb-1">
            {product.name}
          </h3>
          <p className="text-xs text-slate-500">{product.supplier?.name ?? 'Unknown Supplier'}</p>
          {product.package_size && (
            <p className="text-xs text-slate-400 mt-0.5">{product.package_size}</p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-slate-900">
            £{product.price.toFixed(2)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
            <button
              onClick={() => setQty(q => Math.max(1, q - 1))}
              className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors text-sm font-medium"
            >
              −
            </button>
            <span className="w-8 text-center text-sm font-semibold text-slate-900">{qty}</span>
            <button
              onClick={() => setQty(q => q + 1)}
              className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors text-sm font-medium"
            >
              +
            </button>
          </div>

          <button
            onClick={handleAdd}
            className={`flex-1 flex items-center justify-center gap-1.5 h-8 rounded-lg text-xs font-semibold transition-all duration-200 ${
              added
                ? 'bg-green-600 text-white'
                : 'bg-blue-800 text-white hover:bg-blue-900'
            }`}
          >
            <ShoppingCart size={12} />
            {added ? 'Added!' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}
