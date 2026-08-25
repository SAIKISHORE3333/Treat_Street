import { useState, useEffect, useCallback, FormEvent } from 'react';
import { Plus, Pencil, Trash2, Check, X, Loader2, AlertCircle, Search, Mail, Building2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Product, Supplier } from '../../types';

const CATEGORIES = [
  'Baking & Confectionery',
  'Cleaning & Hygiene',
  'Condiments & Sauces',
  'Drinks & Beverages',
  'Dairy & Alternatives',
  'Frozen & Prepared',
  'Bakery & Bread',
  'Packaging & Equipment',
  'Uncategorized',
];

type SubTab = 'products' | 'suppliers';

interface ProductEditState {
  name: string;
  supplier_id: string;
  category: string;
  package_size: string;
  price: string;
  active: boolean;
}

interface SupplierEditState {
  name: string;
  email: string;
}

function emptyProductEdit(suppliers: Supplier[]): ProductEditState {
  return { name: '', supplier_id: suppliers[0]?.id ?? '', category: CATEGORIES[0], package_size: '', price: '', active: true };
}

export default function InventoryManager() {
  const [subTab, setSubTab] = useState<SubTab>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [saving, setSaving] = useState(false);

  // Product edit state
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [productEditState, setProductEditState] = useState<ProductEditState | null>(null);
  const [addProductState, setAddProductState] = useState<ProductEditState | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Supplier edit state
  const [editingSupplierId, setEditingSupplierId] = useState<string | null>(null);
  const [supplierEditState, setSupplierEditState] = useState<SupplierEditState | null>(null);
  const [addSupplierState, setAddSupplierState] = useState<SupplierEditState | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    const [{ data: prods, error: pe }, { data: sups, error: se }] = await Promise.all([
      supabase.from('products').select('*, supplier:suppliers(id,name,email,created_at)').order('name'),
      supabase.from('suppliers').select('*').order('name'),
    ]);
    if (pe || se) setError((pe ?? se)!.message);
    else {
      setProducts((prods as Product[]) ?? []);
      setSuppliers((sups as Supplier[]) ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.supplier?.name ?? '').toLowerCase().includes(search.toLowerCase())
  );

  // ─── Product actions ──────────────────────────────────────────────────────

  function startEditProduct(product: Product) {
    setEditingProductId(product.id);
    setProductEditState({
      name: product.name,
      supplier_id: product.supplier_id ?? '',
      category: product.category,
      package_size: product.package_size ?? '',
      price: String(product.price),
      active: product.active,
    });
  }

  async function saveProduct(productId: string) {
    if (!productEditState) return;
    setSaving(true);
    const price = parseFloat(productEditState.price);
    if (isNaN(price) || price < 0) { setSaving(false); return; }
    const { error: err } = await supabase.from('products').update({
      name: productEditState.name.trim(),
      supplier_id: productEditState.supplier_id || null,
      category: productEditState.category,
      package_size: productEditState.package_size.trim() || null,
      price,
      active: productEditState.active,
    }).eq('id', productId);
    if (!err) { await fetchData(); setEditingProductId(null); setProductEditState(null); }
    setSaving(false);
  }

  async function deleteProduct(productId: string) {
    const { error: err } = await supabase.from('products').delete().eq('id', productId);
    if (!err) setProducts(prev => prev.filter(p => p.id !== productId));
    setDeleteConfirm(null);
  }

  async function addProduct(e: FormEvent) {
    e.preventDefault();
    if (!addProductState) return;
    setSaving(true);
    const price = parseFloat(addProductState.price);
    if (isNaN(price) || price < 0) { setSaving(false); return; }
    const { error: err } = await supabase.from('products').insert({
      name: addProductState.name.trim(),
      supplier_id: addProductState.supplier_id || null,
      category: addProductState.category,
      package_size: addProductState.package_size.trim() || null,
      price,
      active: addProductState.active,
    });
    if (!err) { await fetchData(); setAddProductState(null); }
    setSaving(false);
  }

  // ─── Supplier actions ─────────────────────────────────────────────────────

  async function saveSupplier(supplierId: string) {
    if (!supplierEditState) return;
    setSaving(true);
    const { error: err } = await supabase.from('suppliers').update({
      name: supplierEditState.name.trim(),
      email: supplierEditState.email.trim() || null,
    }).eq('id', supplierId);
    if (!err) { await fetchData(); setEditingSupplierId(null); setSupplierEditState(null); }
    setSaving(false);
  }

  async function addSupplier(e: FormEvent) {
    e.preventDefault();
    if (!addSupplierState) return;
    setSaving(true);
    const { error: err } = await supabase.from('suppliers').insert({
      name: addSupplierState.name.trim(),
      email: addSupplierState.email.trim() || null,
    });
    if (!err) { await fetchData(); setAddSupplierState(null); }
    setSaving(false);
  }

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 size={28} className="text-[#1a3a5c] animate-spin" /></div>;
  if (error) return (
    <div className="p-6 text-center">
      <AlertCircle size={24} className="text-red-500 mx-auto mb-2" />
      <p className="text-sm text-red-600">{error}</p>
      <button onClick={fetchData} className="mt-2 text-sm text-[#1a3a5c] hover:underline">Retry</button>
    </div>
  );

  return (
    <div className="space-y-5">
      {/* Sub-tab toggle */}
      <div className="flex gap-1 p-1 bg-slate-100 rounded-xl w-fit">
        <button onClick={() => setSubTab('products')} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${subTab === 'products' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
          Products <span className="text-slate-400">({products.length})</span>
        </button>
        <button onClick={() => setSubTab('suppliers')} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${subTab === 'suppliers' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
          <Mail size={12} />
          Suppliers & Emails <span className="text-slate-400">({suppliers.length})</span>
        </button>
      </div>

      {/* ─── Suppliers sub-tab ─── */}
      {subTab === 'suppliers' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500">Manage supplier contact emails. These are used by the ALIA engine when sending automated Purchase Orders.</p>
            <button
              onClick={() => setAddSupplierState({ name: '', email: '' })}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1a3a5c] text-white text-xs font-bold rounded-lg hover:bg-[#0f2440] transition-colors shrink-0 ml-4"
            >
              <Plus size={13} />
              Add Supplier
            </button>
          </div>

          {addSupplierState && (
            <form onSubmit={addSupplier} className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-3">
              <p className="text-xs font-bold text-amber-800">New Supplier</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input required value={addSupplierState.name} onChange={e => setAddSupplierState(s => s ? { ...s, name: e.target.value } : s)} placeholder="Supplier name *" className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a3a5c] bg-white" />
                <input type="email" value={addSupplierState.email} onChange={e => setAddSupplierState(s => s ? { ...s, email: e.target.value } : s)} placeholder="orders@supplier.com" className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a3a5c] bg-white" />
              </div>
              <div className="flex gap-2 justify-end">
                <button type="button" onClick={() => setAddSupplierState(null)} className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                <button type="submit" disabled={saving} className="px-4 py-1.5 text-xs font-bold bg-[#1a3a5c] text-white rounded-lg hover:bg-[#0f2440] disabled:opacity-50 flex items-center gap-1.5">
                  {saving ? <Loader2 size={12} className="animate-spin" /> : <Plus size={12} />}
                  Add
                </button>
              </div>
            </form>
          )}

          <div className="overflow-hidden rounded-xl border border-slate-200 shadow-sm">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-[#1a3a5c]">
                  <th className="text-left px-4 py-3 text-xs font-bold text-slate-200 uppercase tracking-wide">Supplier Name</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-slate-200 uppercase tracking-wide">
                    <div className="flex items-center gap-1.5"><Mail size={12} />PO Email Address</div>
                  </th>
                  <th className="px-4 py-3 text-xs font-bold text-slate-200 uppercase tracking-wide text-center">Products</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {suppliers.map(supplier => {
                  const productCount = products.filter(p => p.supplier_id === supplier.id).length;
                  return (
                    <tr key={supplier.id} className="hover:bg-slate-50 transition-colors">
                      {editingSupplierId === supplier.id && supplierEditState ? (
                        <>
                          <td className="px-4 py-2">
                            <input value={supplierEditState.name} onChange={e => setSupplierEditState(s => s ? { ...s, name: e.target.value } : s)} className="w-full px-2 py-1.5 text-sm border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]" />
                          </td>
                          <td className="px-4 py-2">
                            <input type="email" value={supplierEditState.email} onChange={e => setSupplierEditState(s => s ? { ...s, email: e.target.value } : s)} placeholder="orders@supplier.com" className="w-full px-2 py-1.5 text-sm border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]" />
                          </td>
                          <td className="px-4 py-2 text-center text-slate-400 text-xs">{productCount}</td>
                          <td className="px-4 py-2">
                            <div className="flex items-center gap-1 justify-end">
                              <button onClick={() => saveSupplier(supplier.id)} disabled={saving} className="w-7 h-7 flex items-center justify-center bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50">
                                {saving ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
                              </button>
                              <button onClick={() => { setEditingSupplierId(null); setSupplierEditState(null); }} className="w-7 h-7 flex items-center justify-center bg-slate-200 text-slate-600 rounded-lg hover:bg-slate-300">
                                <X size={12} />
                              </button>
                            </div>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-lg bg-[#1a3a5c] flex items-center justify-center shrink-0">
                                <Building2 size={13} className="text-amber-400" />
                              </div>
                              <span className="font-semibold text-slate-900">{supplier.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            {supplier.email ? (
                              <span className="flex items-center gap-1.5 text-sm text-slate-700">
                                <Mail size={13} className="text-green-500 shrink-0" />
                                {supplier.email}
                              </span>
                            ) : (
                              <span className="flex items-center gap-1.5 text-xs text-amber-600 bg-amber-50 border border-amber-200 px-2 py-1 rounded-full w-fit">
                                <AlertCircle size={11} />
                                No email set — POs will be skipped
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-center text-slate-500 text-sm font-medium">{productCount}</td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => { setEditingSupplierId(supplier.id); setSupplierEditState({ name: supplier.name, email: supplier.email ?? '' }); }}
                              className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-[#1a3a5c] hover:bg-blue-50 rounded-lg transition-colors ml-auto"
                            >
                              <Pencil size={13} />
                            </button>
                          </td>
                        </>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── Products sub-tab ─── */}
      {subTab === 'products' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <div className="relative flex-1 max-w-xs">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-8 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]" />
            </div>
            <button onClick={() => setAddProductState(emptyProductEdit(suppliers))} className="flex items-center gap-1.5 px-4 py-2 bg-[#1a3a5c] text-white text-sm font-bold rounded-lg hover:bg-[#0f2440] transition-colors shrink-0">
              <Plus size={15} />
              Add New Item
            </button>
          </div>

          {addProductState && (
            <form onSubmit={addProduct} className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-3">
              <p className="text-sm font-bold text-[#1a3a5c] mb-1">New Item</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input required value={addProductState.name} onChange={e => setAddProductState(s => s ? { ...s, name: e.target.value } : s)} placeholder="Item name *" className="col-span-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a3a5c] bg-white" />
                <select required value={addProductState.supplier_id} onChange={e => setAddProductState(s => s ? { ...s, supplier_id: e.target.value } : s)} className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a3a5c] bg-white">
                  {suppliers.map(sup => <option key={sup.id} value={sup.id}>{sup.name}</option>)}
                </select>
                <select value={addProductState.category} onChange={e => setAddProductState(s => s ? { ...s, category: e.target.value } : s)} className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a3a5c] bg-white">
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <input value={addProductState.package_size} onChange={e => setAddProductState(s => s ? { ...s, package_size: e.target.value } : s)} placeholder="Package size (e.g. 6 x 1ltr)" className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a3a5c] bg-white" />
                <input required type="number" step="0.01" min="0" value={addProductState.price} onChange={e => setAddProductState(s => s ? { ...s, price: e.target.value } : s)} placeholder="Price (£) *" className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a3a5c] bg-white" />
              </div>
              <div className="flex gap-2 justify-end">
                <button type="button" onClick={() => setAddProductState(null)} className="px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                <button type="submit" disabled={saving} className="px-4 py-1.5 text-sm font-bold bg-[#1a3a5c] text-white rounded-lg hover:bg-[#0f2440] disabled:opacity-50 flex items-center gap-1.5">
                  {saving ? <Loader2 size={13} className="animate-spin" /> : <Plus size={13} />}
                  Add Item
                </button>
              </div>
            </form>
          )}

          <p className="text-xs text-slate-400">{filteredProducts.length} of {products.length} items</p>

          <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-[#1a3a5c]">
                  <th className="text-left px-4 py-3 text-xs font-bold text-slate-200 uppercase tracking-wide">Item</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-slate-200 uppercase tracking-wide hidden md:table-cell">Supplier</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-slate-200 uppercase tracking-wide hidden lg:table-cell">Category</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-slate-200 uppercase tracking-wide hidden lg:table-cell">Pack</th>
                  <th className="text-right px-4 py-3 text-xs font-bold text-slate-200 uppercase tracking-wide">Price</th>
                  <th className="text-center px-4 py-3 text-xs font-bold text-slate-200 uppercase tracking-wide hidden sm:table-cell">Active</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredProducts.map(product => (
                  <tr key={product.id} className={`hover:bg-slate-50 transition-colors ${!product.active ? 'opacity-50' : ''}`}>
                    {editingProductId === product.id && productEditState ? (
                      <>
                        <td className="px-4 py-2" colSpan={6}>
                          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                            <input value={productEditState.name} onChange={e => setProductEditState(s => s ? { ...s, name: e.target.value } : s)} className="col-span-2 sm:col-span-3 lg:col-span-1 px-2 py-1.5 text-sm border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]" />
                            <select value={productEditState.supplier_id} onChange={e => setProductEditState(s => s ? { ...s, supplier_id: e.target.value } : s)} className="px-2 py-1.5 text-sm border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]">
                              {suppliers.map(sup => <option key={sup.id} value={sup.id}>{sup.name}</option>)}
                            </select>
                            <select value={productEditState.category} onChange={e => setProductEditState(s => s ? { ...s, category: e.target.value } : s)} className="px-2 py-1.5 text-sm border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]">
                              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                            <input value={productEditState.package_size} onChange={e => setProductEditState(s => s ? { ...s, package_size: e.target.value } : s)} placeholder="Package size" className="px-2 py-1.5 text-sm border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]" />
                            <input type="number" step="0.01" min="0" value={productEditState.price} onChange={e => setProductEditState(s => s ? { ...s, price: e.target.value } : s)} className="px-2 py-1.5 text-sm border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]" />
                          </div>
                          <label className="flex items-center gap-2 mt-2 text-xs text-slate-600 cursor-pointer select-none">
                            <input type="checkbox" checked={productEditState.active} onChange={e => setProductEditState(s => s ? { ...s, active: e.target.checked } : s)} className="rounded" />
                            Active (visible in storefront)
                          </label>
                        </td>
                        <td className="px-4 py-2">
                          <div className="flex items-center gap-1 justify-end">
                            <button onClick={() => saveProduct(product.id)} disabled={saving} className="w-7 h-7 flex items-center justify-center bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50">
                              {saving ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
                            </button>
                            <button onClick={() => { setEditingProductId(null); setProductEditState(null); }} className="w-7 h-7 flex items-center justify-center bg-slate-200 text-slate-600 rounded-lg hover:bg-slate-300">
                              <X size={13} />
                            </button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-4 py-3">
                          <div className="font-medium text-slate-900 leading-snug max-w-xs">{product.name}</div>
                          <div className="text-xs text-slate-400 md:hidden">{product.supplier?.name}</div>
                        </td>
                        <td className="px-4 py-3 text-slate-600 hidden md:table-cell">{product.supplier?.name ?? '—'}</td>
                        <td className="px-4 py-3 text-slate-500 text-xs hidden lg:table-cell">{product.category}</td>
                        <td className="px-4 py-3 text-slate-400 text-xs hidden lg:table-cell">{product.package_size ?? '—'}</td>
                        <td className="px-4 py-3 text-right font-bold text-slate-900">£{Number(product.price).toFixed(2)}</td>
                        <td className="px-4 py-3 text-center hidden sm:table-cell">
                          <span className={`inline-block w-2 h-2 rounded-full ${product.active ? 'bg-green-500' : 'bg-slate-300'}`} />
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1 justify-end">
                            <button onClick={() => startEditProduct(product)} className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-[#1a3a5c] hover:bg-blue-50 rounded-lg transition-colors">
                              <Pencil size={13} />
                            </button>
                            {deleteConfirm === product.id ? (
                              <>
                                <button onClick={() => deleteProduct(product.id)} className="px-2 py-1 text-xs font-bold text-white bg-red-600 rounded-lg hover:bg-red-700">Delete</button>
                                <button onClick={() => setDeleteConfirm(null)} className="px-2 py-1 text-xs text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200">Cancel</button>
                              </>
                            ) : (
                              <button onClick={() => setDeleteConfirm(product.id)} className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                <Trash2 size={13} />
                              </button>
                            )}
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
