import { useState, useEffect, useMemo } from 'react';
import { Search, SlidersHorizontal, X, Loader2, AlertCircle, ChevronDown } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Product, Supplier } from '../types';
import ItemCard from '../components/ItemCard';

export default function Storefront() {
  const [products, setProducts] = useState<Product[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    async function load() {
      setLoading(true);
      const [{ data: prods, error: pe }, { data: sups, error: se }] = await Promise.all([
        supabase
          .from('products')
          .select('*, supplier:suppliers(id,name,created_at)')
          .eq('active', true)
          .order('name'),
        supabase.from('suppliers').select('*').order('name'),
      ]);
      if (pe || se) setError((pe ?? se)!.message);
      else {
        setProducts((prods as Product[]) ?? []);
        setSuppliers((sups as Supplier[]) ?? []);
      }
      setLoading(false);
    }
    load();
  }, []);

  const categories = useMemo(
    () => [...new Set(products.map(p => p.category))].sort(),
    [products]
  );

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return products.filter(p => {
      if (selectedSupplier && p.supplier_id !== selectedSupplier) return false;
      if (selectedCategory && p.category !== selectedCategory) return false;
      if (q && !p.name.toLowerCase().includes(q) && !(p.supplier?.name ?? '').toLowerCase().includes(q)) return false;
      return true;
    });
  }, [products, search, selectedSupplier, selectedCategory]);

  const hasFilters = search || selectedSupplier || selectedCategory;

  function clearFilters() {
    setSearch('');
    setSelectedSupplier('');
    setSelectedCategory('');
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3 text-slate-400">
          <Loader2 size={32} className="text-blue-600 animate-spin" />
          <p className="text-sm font-medium">Loading catalogue...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3 text-center px-6">
          <AlertCircle size={32} className="text-red-500" />
          <p className="text-sm font-medium text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <p className="text-xs font-bold tracking-[0.2em] text-amber-600 uppercase mb-1">Treat Street</p>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">PURCHASE INVENTORY</h1>
        <p className="text-sm text-slate-500 mt-1">{products.length} items across {suppliers.length} supplier{suppliers.length !== 1 ? 's' : ''}</p>
      </div>

      <div className="sticky top-16 z-30 bg-slate-50 py-3 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 border-b border-slate-200 mb-6">
        <div className="flex flex-col sm:flex-row gap-2 max-w-7xl mx-auto">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by item name or supplier..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700">
                <X size={14} />
              </button>
            )}
          </div>

          <div className="relative">
            <select
              value={selectedSupplier}
              onChange={e => setSelectedSupplier(e.target.value)}
              className="w-full sm:w-48 appearance-none pl-3 pr-8 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm text-slate-700"
            >
              <option value="">All Suppliers</option>
              {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="w-full sm:w-52 appearance-none pl-3 pr-8 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm text-slate-700"
            >
              <option value="">All Categories</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          {hasFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1.5 px-3 py-2.5 text-sm text-slate-600 hover:text-slate-900 hover:bg-white border border-slate-200 rounded-xl transition-colors shadow-sm shrink-0"
            >
              <SlidersHorizontal size={14} />
              Clear
            </button>
          )}
        </div>

        {hasFilters && (
          <p className="text-xs text-slate-500 mt-2 max-w-7xl mx-auto">
            Showing <strong>{filtered.length}</strong> of {products.length} items
          </p>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-20 text-slate-400">
          <Search size={36} className="text-slate-200" />
          <p className="text-sm font-medium">No items match your filters</p>
          <button onClick={clearFilters} className="text-xs text-blue-600 hover:underline">Clear all filters</button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filtered.map(product => (
            <ItemCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
