'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { operationsService } from '../../../lib/operationsService';
import { AdminOrderRecord, OrderLifecycleStatus } from '../../../types/operations';
import {
  ShoppingBag,
  Clock,
  CheckCircle,
  Truck,
  AlertTriangle,
  Lock,
  RefreshCw,
  Eye,
  MapPin,
  Calendar,
  X,
  Phone,
} from 'lucide-react';

export default function SellerOrdersPage() {
  const { tenantId, sellerId, user } = useAuth();
  const [orders, setOrders] = useState<AdminOrderRecord[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<AdminOrderRecord | null>(null);
  const [packagingNotes, setPackagingNotes] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const refreshOrders = () => {
    const list = operationsService.getOrders(tenantId, sellerId);
    setOrders(list);
    if (selectedOrder) {
      const updated = list.find((o) => o.id === selectedOrder.id);
      if (updated) setSelectedOrder(updated);
    }
  };

  useEffect(() => {
    refreshOrders();
  }, [tenantId, sellerId]);

  // Permitted transitions for seller role:
  // confirmed -> preparing
  // preparing -> ready_for_dispatch
  const handleSellerTransition = (newStatus: OrderLifecycleStatus) => {
    if (!selectedOrder) return;
    setErrorMessage(null);

    // Enforce role barrier: sellers can ONLY transition to 'preparing' or 'ready_for_dispatch'
    if (newStatus !== 'preparing' && newStatus !== 'ready_for_dispatch') {
      setErrorMessage('Security Violation: Sellers are only permitted to advance packaging states.');
      return;
    }

    try {
      const updated = operationsService.transitionOrderStatus(
        selectedOrder.id,
        newStatus,
        sellerId || 'seller_krishna_01',
        'seller',
        user?.displayName || 'Ramesh Krishna (Farm Manager)',
        packagingNotes || `Produce packaging advanced to ${newStatus}`
      );
      setSelectedOrder(updated);
      setPackagingNotes('');
      refreshOrders();
    } catch (err: unknown) {
      const e = err as Error;
      setErrorMessage(e.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight">Incoming Farm Produce Orders</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Strictly isolated to farm <span className="font-mono text-slate-200">{sellerId}</span>. Permitted state transitions enforced.
          </p>
        </div>
        <button
          onClick={refreshOrders}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 border border-slate-800 rounded-xl"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh</span>
        </button>
      </div>

      {/* RBAC Boundary Notification */}
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-slate-200">Permitted Seller Transitions:</span>
            <span className="text-slate-400 ml-1.5">
              [confirmed &rarr; preparing &rarr; ready_for_dispatch]. Dispatch & delivery are hub-managed.
            </span>
          </div>
        </div>
        <span className="font-mono text-[10px] text-slate-500">
          Policy: seller_boundary.enforce_fulfillment_subset()
        </span>
      </div>

      {/* Orders Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950/80 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
            <tr>
              <th className="py-3 px-4 font-semibold">Order ID</th>
              <th className="py-3 px-4 font-semibold">Ordered Items</th>
              <th className="py-3 px-4 font-semibold">Order Value (₹ INR)</th>
              <th className="py-3 px-4 font-semibold">Fulfilment Status</th>
              <th className="py-3 px-4 font-semibold">Placed Date</th>
              <th className="py-3 px-4 font-semibold text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-500">
                  No orders currently allocated to your farm.
                </td>
              </tr>
            ) : (
              orders.map((o) => (
                <tr key={o.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-100">{o.id}</td>
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-slate-200">
                      {o.items.map((i) => `${i.title} (${i.quantity} ${i.unit})`).join(', ')}
                    </span>
                    {o.customerNotes && (
                      <p className="text-[11px] text-amber-400 italic">Note: &ldquo;{o.customerNotes}&rdquo;</p>
                    )}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-100 font-mono">
                    ₹{o.totalAmount.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border bg-amber-500/10 text-amber-400 border-amber-500/20">
                      {o.orderStatus.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                    {new Date(o.placedAt).toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => {
                        setSelectedOrder(o);
                        setErrorMessage(null);
                      }}
                      className="inline-flex items-center gap-1 px-3 py-1 text-xs font-bold rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 transition-all shadow-sm"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Fulfill</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Fulfillment Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl my-8 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
            <div className="flex items-start justify-between pb-4 border-b border-slate-800">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold font-mono text-slate-100">{selectedOrder.id}</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border bg-amber-500/10 text-amber-400 border-amber-500/20">
                    {selectedOrder.orderStatus.replace(/_/g, ' ')}
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Total Order Value: <span className="font-bold text-slate-200">₹{selectedOrder.totalAmount}</span>
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {errorMessage && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Farm Produce Item Breakdown */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-300">Produce Packing Checklist</span>
              <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-800/60 text-xs">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="p-3 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-100">{item.title}</p>
                      <p className="text-[11px] text-slate-400">
                        {item.quantity} {item.unit} @ ₹{item.unitPrice} / {item.unit}
                      </p>
                    </div>
                    <span className="font-mono font-bold text-slate-100">
                      ₹{item.totalPrice.toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Packaging Notes Input */}
            <div>
              <label className="block text-[11px] text-slate-400 font-semibold mb-1">
                Farm Packaging Notes (e.g. Weighing scale slip # / crate barcode)
              </label>
              <input
                type="text"
                value={packagingNotes}
                onChange={(e) => setPackagingNotes(e.target.value)}
                placeholder="e.g. Cobb 430 live birds weighed 2.1kg, tagged in green crate"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Permitted Transition Actions */}
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
              <span className="text-xs font-bold text-slate-200">Permitted Packaging Actions</span>

              <div className="flex flex-wrap items-center gap-2">
                {selectedOrder.orderStatus === 'confirmed' && (
                  <button
                    onClick={() => handleSellerTransition('preparing')}
                    className="px-4 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-all shadow-md shadow-amber-500/20"
                  >
                    Start Packaging / Dressing (Move to Preparing)
                  </button>
                )}

                {selectedOrder.orderStatus === 'preparing' && (
                  <button
                    onClick={() => handleSellerTransition('ready_for_dispatch')}
                    className="px-4 py-2 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-all shadow-md shadow-emerald-500/20"
                  >
                    Mark Ready at Hub Loading Bay (Ready for Dispatch)
                  </button>
                )}

                {['ready_for_dispatch', 'out_for_delivery', 'delivered'].includes(
                  selectedOrder.orderStatus
                ) && (
                  <p className="text-xs text-slate-500 italic">
                    Produce packaging is complete. Fleet van transfer and customer handover are managed by the hub logistics officer.
                  </p>
                )}
              </div>
            </div>

            {/* Audit History */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-400">Order Timeline</span>
              <div className="space-y-1 text-[11px] text-slate-400 font-mono">
                {selectedOrder.history.map((h, i) => (
                  <div key={i} className="p-2 bg-slate-950 rounded-lg flex items-center justify-between">
                    <span>
                      [{h.status}] by {h.actorName} ({h.actorRole})
                    </span>
                    <span className="text-slate-600">{new Date(h.timestamp).toLocaleTimeString('en-IN')}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
