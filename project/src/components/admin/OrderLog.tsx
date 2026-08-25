import { useState, useEffect, useCallback } from 'react';
import { Clock, User, Building2, ExternalLink, Loader2, SendHorizonal, CheckCircle, AlertCircle, MapPin, ChevronDown, Lock } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Order, OrderStatus } from '../../types';

const STATUS_STYLES: Record<OrderStatus, string> = {
  Pending: 'bg-amber-50 text-amber-700 border-amber-200',
  Ordered: 'bg-blue-50 text-blue-700 border-blue-200',
  Fulfilled: 'bg-green-50 text-green-700 border-green-200',
};

type SendState = 'idle' | 'sending' | 'sent' | 'error';

interface SendResult {
  supplier: string;
  status: string;
  error?: string;
}

export default function OrderLog() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [sendState, setSendState] = useState<Record<string, SendState>>({});
  const [sendResults, setSendResults] = useState<Record<string, SendResult[]>>({});

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error: err } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .order('created_at', { ascending: false });

    if (err) setError(err.message);
    else setOrders((data as Order[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  // Only Ordered → Fulfilled is permitted via the dropdown.
  // Pending → Ordered is BLOCKED here — it only happens via Approve & Send PO.
  async function updateStatus(orderId: string, status: OrderStatus) {
  setUpdatingId(orderId);
  const { error: err } = await supabase.from('orders').update({ status }).eq('id', orderId);
  
  if (!err) {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    
    // If the order is updated to 'Ordered', automatically trigger the email system!
    if (status === 'Ordered') {
      approveSendPO(orderId);
    }
  }
  
  setUpdatingId(null);
}

  async function approveSendPO(orderId: string) {
    setSendState(s => ({ ...s, [orderId]: 'sending' }));
    try {
      const resp = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-purchase-order`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ order_id: orderId }),
        }
      );
      const json = await resp.json();
      if (!resp.ok || !json.success) throw new Error(json.error ?? 'Send failed');

      setSendResults(s => ({ ...s, [orderId]: json.results }));
      setSendState(s => ({ ...s, [orderId]: 'sent' }));
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'Ordered' } : o));
    } catch {
      setSendState(s => ({ ...s, [orderId]: 'error' }));
    }
  }

  function renderStatusControl(order: Order) {
    const state = sendState[order.id] ?? 'idle';

    if (order.status === 'Pending') {
      // Locked — no dropdown. Only the Approve & Send PO button moves this to Ordered.
      return (
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border bg-amber-50 text-amber-700 border-amber-200">
          <Lock size={10} />
          Pending
        </div>
      );
    }

    if (order.status === 'Fulfilled') {
      // Locked — fulfilled orders cannot be changed.
      return (
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border bg-green-50 text-green-700 border-green-200">
          <CheckCircle size={10} />
          Fulfilled
        </div>
      );
    }

    // Ordered status — only Fulfilled is available as next step.
    return (
      <div className="relative">
        <select
          value={order.status}
          onChange={e => updateStatus(order.id, e.target.value as OrderStatus)}
          disabled={updatingId === order.id}
          className={`appearance-none pr-6 pl-2.5 py-1 rounded-full text-xs font-semibold border cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#1a3a5c] transition-opacity ${STATUS_STYLES[order.status]} ${updatingId === order.id ? 'opacity-50' : ''}`}
        >
          <option value="Ordered">Ordered</option>
          <option value="Fulfilled">Fulfilled</option>
        </select>
        <ChevronDown size={12} className="absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={28} className="text-[#1a3a5c] animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-sm text-red-600 font-medium">{error}</p>
        <button onClick={fetchOrders} className="mt-2 text-sm text-[#1a3a5c] hover:underline">Retry</button>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* ALIA watermark */}
      <div aria-hidden className="absolute inset-0 flex items-start justify-end pointer-events-none select-none overflow-hidden" style={{ zIndex: 0 }}>
        <span className="font-black text-slate-900 tracking-[0.5em] mt-8 mr-4" style={{ fontSize: 'clamp(4rem, 14vw, 11rem)', opacity: 0.04, transform: 'rotate(-8deg)', userSelect: 'none' }}>
          ALIA
        </span>
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-slate-500">{orders.length} order{orders.length !== 1 ? 's' : ''} total</p>
            <p className="text-xs text-amber-600 mt-0.5 flex items-center gap-1">
              <Lock size={10} />
              Pending orders can only advance to Ordered via the Approve &amp; Send PO flow
            </p>
          </div>
          <button onClick={fetchOrders} className="text-xs text-[#1a3a5c] hover:underline font-semibold">Refresh</button>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <p className="text-sm font-medium">No orders yet</p>
            <p className="text-xs mt-1">Submitted orders will appear here.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map(order => {
              const state = sendState[order.id] ?? 'idle';
              const results = sendResults[order.id];
              return (
                <div key={order.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                  <div className="px-5 py-4 flex flex-wrap items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <div className="flex items-center gap-1.5">
                          <User size={13} className="text-slate-400" />
                          <span className="text-sm font-bold text-slate-900">{order.staff_name}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Building2 size={13} className="text-slate-400" />
                          <span className="text-sm text-slate-600">{order.department}</span>
                        </div>
                        {order.branch_name && (
                          <div className="flex items-center gap-1.5">
                            <MapPin size={13} className="text-amber-500" />
                            <span className="text-sm font-medium text-amber-700">{order.branch_name}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 mt-1">
                        <Clock size={12} className="text-slate-400" />
                        <span className="text-xs text-slate-400">
                          {new Date(order.created_at).toLocaleDateString('en-GB', {
                            day: 'numeric', month: 'short', year: 'numeric',
                            hour: '2-digit', minute: '2-digit',
                          })}
                        </span>
                      </div>
                      {order.notes && (
                        <p className="text-xs text-slate-500 mt-1 italic">&ldquo;{order.notes}&rdquo;</p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
                      <span className="text-base font-bold text-slate-900">£{Number(order.total_cost).toFixed(2)}</span>

                      {renderStatusControl(order)}

                      {order.status === 'Pending' && (
                        <button
                          onClick={() => approveSendPO(order.id)}
                          disabled={state === 'sending'}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            state === 'sent'
                              ? 'bg-green-100 text-green-700 border border-green-200'
                              : state === 'error'
                              ? 'bg-red-100 text-red-700 border border-red-200'
                              : 'bg-[#1a3a5c] text-white hover:bg-[#0f2440]'
                          } disabled:opacity-60`}
                        >
                          {state === 'sending' ? <Loader2 size={12} className="animate-spin" /> :
                           state === 'sent' ? <CheckCircle size={12} /> :
                           state === 'error' ? <AlertCircle size={12} /> :
                           <SendHorizonal size={12} />}
                          {state === 'sending' ? 'Sending...' :
                           state === 'sent' ? 'PO Sent' :
                           state === 'error' ? 'Retry' :
                           'Approve & Send PO'}
                        </button>
                      )}

                      <button
                        onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
                        className="text-xs text-[#1a3a5c] hover:text-blue-900 flex items-center gap-0.5 font-semibold"
                      >
                        <ExternalLink size={12} />
                        {expandedId === order.id ? 'Hide' : 'Details'}
                      </button>
                    </div>
                  </div>

                  {/* Send results banner */}
                  {results && results.length > 0 && (
                    <div className="border-t border-slate-100 bg-blue-50 px-5 py-2.5 flex flex-wrap gap-3">
                      {results.map(r => (
                        <span key={r.supplier} className={`text-xs font-medium px-2 py-1 rounded-full border ${r.status === 'sent' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                          {r.supplier}: {r.status === 'sent' ? 'Email sent' : r.error ?? 'Skipped'}
                        </span>
                      ))}
                    </div>
                  )}

                  {expandedId === order.id && order.order_items && (
                    <div className="border-t border-slate-100 bg-slate-50 px-5 py-3">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Items Ordered</p>
                      <div className="space-y-1.5">
                        {order.order_items.map(item => (
                          <div key={item.id} className="flex items-center justify-between text-sm">
                            <div>
                              <span className="font-semibold text-slate-900">{item.quantity}× </span>
                              <span className="text-slate-700">{item.product_name}</span>
                              <span className="text-slate-400 text-xs ml-1.5">({item.supplier_name})</span>
                            </div>
                            <span className="font-bold text-slate-800">£{(item.unit_price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
