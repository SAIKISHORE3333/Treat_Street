import { useState, FormEvent } from 'react';
import { X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useCart } from '../context/CartContext';

interface CheckoutModalProps {
  onClose: () => void;
}

type Step = 'form' | 'loading' | 'success' | 'error';

export default function CheckoutModal({ onClose }: CheckoutModalProps) {
  const { items, totalCost, clearCart } = useCart();
  const [step, setStep] = useState<Step>('form');
  const [errorMsg, setErrorMsg] = useState('');

  const [staffName, setStaffName] = useState('');
  const [department, setDepartment] = useState('');
  const [branchName, setBranchName] = useState('');
  const [notes, setNotes] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (items.length === 0) return;

    setStep('loading');
    try {
      const { data: order, error: orderErr } = await supabase
        .from('orders')
        .insert({
          staff_name: staffName.trim(),
          department: department.trim(),
          branch_name: branchName.trim() || null,
          notes: notes.trim() || null,
          total_cost: totalCost,
        })
        .select('id')
        .single();

      if (orderErr || !order) throw orderErr ?? new Error('Failed to create order');

      const lineItems = items.map(item => ({
        order_id: order.id,
        product_id: item.product.id,
        product_name: item.product.name,
        supplier_name: item.product.supplier?.name ?? 'Unknown',
        category: item.product.category,
        quantity: item.quantity,
        unit_price: item.product.price,
      }));

      const { error: itemsErr } = await supabase.from('order_items').insert(lineItems);
      if (itemsErr) throw itemsErr;

      clearCart();
      setStep('success');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'An unexpected error occurred.');
      setStep('error');
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-[#1a3a5c]">
          <div>
            <h2 className="text-sm font-black text-white tracking-wide">
              {step === 'success' ? 'Order Submitted' : step === 'error' ? 'Submission Failed' : 'CHECKOUT'}
            </h2>
            <p className="text-xs text-amber-400 tracking-widest">TREAT STREET PURCHASE INVENTORY</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="p-6">
          {step === 'form' && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="bg-slate-50 rounded-xl p-4 space-y-1.5">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Order Summary</p>
                <div className="max-h-36 overflow-y-auto space-y-1">
                  {items.map(item => (
                    <div key={item.product.id} className="flex justify-between text-sm">
                      <span className="text-slate-700 truncate flex-1 pr-2">{item.quantity}× {item.product.name}</span>
                      <span className="text-slate-900 font-semibold shrink-0">£{(item.product.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-slate-200 pt-1.5 flex justify-between">
                  <span className="text-sm font-bold text-slate-900">Total</span>
                  <span className="text-sm font-bold text-[#1a3a5c]">£{totalCost.toFixed(2)}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Staff Name *</label>
                <input type="text" required value={staffName} onChange={e => setStaffName(e.target.value)} placeholder="Your full name" className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3a5c] transition-shadow" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Department / Section *</label>
                <input type="text" required value={department} onChange={e => setDepartment(e.target.value)} placeholder="e.g. Kitchen, Bar, Front of House" className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3a5c] transition-shadow" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Branch / Location <span className="text-slate-400 font-normal">(optional)</span></label>
                <input type="text" value={branchName} onChange={e => setBranchName(e.target.value)} placeholder="e.g. Manchester City Centre" className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3a5c] transition-shadow" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Order Notes <span className="text-slate-400 font-normal">(optional)</span></label>
                <textarea rows={2} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Any special instructions..." className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3a5c] transition-shadow resize-none" />
              </div>

              <button type="submit" className="w-full py-3 bg-[#1a3a5c] text-white font-bold rounded-xl hover:bg-[#0f2440] transition-colors text-sm tracking-wide">
                Submit Order
              </button>
            </form>
          )}

          {step === 'loading' && (
            <div className="flex flex-col items-center gap-4 py-8">
              <Loader2 size={36} className="text-[#1a3a5c] animate-spin" />
              <p className="text-sm text-slate-600 font-medium">Submitting your order...</p>
            </div>
          )}

          {step === 'success' && (
            <div className="flex flex-col items-center gap-4 py-6 text-center">
              <CheckCircle size={48} className="text-green-500" />
              <div>
                <p className="text-base font-bold text-slate-900">Order Submitted Successfully!</p>
                <p className="text-sm text-slate-500 mt-1">Your order is now <span className="font-semibold text-amber-600">Pending</span> review by the Head of Operations.</p>
              </div>
              <button onClick={onClose} className="px-6 py-2.5 bg-[#1a3a5c] text-white font-bold rounded-xl hover:bg-[#0f2440] transition-colors text-sm">Done</button>
            </div>
          )}

          {step === 'error' && (
            <div className="flex flex-col items-center gap-4 py-6 text-center">
              <AlertCircle size={48} className="text-red-500" />
              <div>
                <p className="text-base font-bold text-slate-900">Something went wrong</p>
                <p className="text-sm text-slate-500 mt-1">{errorMsg}</p>
              </div>
              <button onClick={() => setStep('form')} className="px-6 py-2.5 bg-[#1a3a5c] text-white font-bold rounded-xl hover:bg-[#0f2440] transition-colors text-sm">Try Again</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
