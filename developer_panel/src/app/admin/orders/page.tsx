'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { operationsService, VALID_ORDER_TRANSITIONS } from '../../../lib/operationsService';
import { AdminOrderRecord, OrderLifecycleStatus } from '../../../types/operations';
import {
  ShoppingBag,
  Search,
  Filter,
  CheckCircle,
  Clock,
  Truck,
  XCircle,
  AlertCircle,
  Eye,
  RefreshCw,
  X,
  User,
  MapPin,
  Calendar,
  FileText,
  RotateCcw,
} from 'lucide-react';

export default function AdminOrdersPage() {
  const { tenantId, user } = useAuth();
  const [orders, setOrders] = useState<AdminOrderRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<AdminOrderRecord | null>(null);
  const [transitionNotes, setTransitionNotes] = useState('');
  const [cancellationReason, setCancellationReason] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const refreshOrders = () => {
    const list = operationsService.getOrders(tenantId);
    setOrders(list);
    if (selectedOrder) {
      const updated = list.find((o) => o.id === selectedOrder.id);
      if (updated) setSelectedOrder(updated);
    }
  };

  useEffect(() => {
    refreshOrders();
  }, [tenantId]);

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerPhone.includes(searchQuery) ||
      o.sellerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || o.orderStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleTransition = (newStatus: OrderLifecycleStatus) => {
    if (!selectedOrder) return;
    setErrorMessage(null);
    try {
      const updated = operationsService.transitionOrderStatus(
        selectedOrder.id,
        newStatus,
        user?.uid || 'admin_vikram_01',
        'client_admin',
        user?.displayName || 'Vikramaditya Rao (Hub Admin)',
        transitionNotes || undefined,
        newStatus === 'cancelled' ? cancellationReason : undefined
      );
      setSelectedOrder(updated);
      setTransitionNotes('');
      setCancellationReason('');
      refreshOrders();
    } catch (err: unknown) {
      const e = err as Error;
      setErrorMessage(e.message || 'Transition failed');
    }
  };

  const getStatusBadge = (status: OrderLifecycleStatus) => {
    switch (status) {
      case 'pending':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'confirmed':
        return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
      case 'preparing':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'ready_for_dispatch':
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
      case 'out_for_delivery':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'delivered':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'cancelled':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      case 'failed_delivery':
        return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight">Order Lifecycle Management</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Cryptographically audited state machine transitions for farm produce fulfillment.
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

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Order ID, customer, phone, or farm..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400 hidden sm:block" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Statuses ({orders.length})</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="preparing">Preparing</option>
            <option value="ready_for_dispatch">Ready for Dispatch</option>
            <option value="out_for_delivery">Out for Delivery</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
            <option value="failed_delivery">Failed Delivery</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3 px-4 font-semibold">Order ID</th>
                <th className="py-3 px-4 font-semibold">Customer</th>
                <th className="py-3 px-4 font-semibold">Fulfillment Farm</th>
                <th className="py-3 px-4 font-semibold">Items & Qty</th>
                <th className="py-3 px-4 font-semibold">Total (₹ INR)</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold">Placed Time</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    No orders matching the specified filter criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  return (
                    <tr key={order.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-100">{order.id}</td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-200">{order.customerName}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{order.customerPhone}</div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-300">{order.sellerName}</td>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-slate-200">{order.items.length} items</span>
                        <div className="text-[10px] text-slate-500 truncate max-w-[150px]">
                          {order.items.map((i) => `${i.title} (${i.quantity} ${i.unit})`).join(', ')}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-100">
                        ₹{order.totalAmount.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${getStatusBadge(
                            order.orderStatus
                          )}`}
                        >
                          {order.orderStatus.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                        {new Date(order.placedAt).toLocaleString('en-IN', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setErrorMessage(null);
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border border-blue-500/20 transition-all"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Inspect</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail & State Transition Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-3xl my-8 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-800">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold font-mono text-slate-100">{selectedOrder.id}</span>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded border ${getStatusBadge(
                      selectedOrder.orderStatus
                    )}`}
                  >
                    {selectedOrder.orderStatus.replace(/_/g, ' ')}
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Placed on {new Date(selectedOrder.placedAt).toLocaleString('en-IN')}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Error Message Alert */}
            {errorMessage && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* State Transition Actions Toolbar */}
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200">Enforce Valid State Transition</span>
                <span className="text-[10px] text-slate-400 font-mono">
                  Allowed next states from [{selectedOrder.orderStatus}]:{' '}
                  {VALID_ORDER_TRANSITIONS[selectedOrder.orderStatus].join(', ') || 'None (Terminal)'}
                </span>
              </div>

              {VALID_ORDER_TRANSITIONS[selectedOrder.orderStatus].length > 0 ? (
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    {VALID_ORDER_TRANSITIONS[selectedOrder.orderStatus].map((nextState) => {
                      const isCancel = nextState === 'cancelled';
                      const isFail = nextState === 'failed_delivery';
                      return (
                        <button
                          key={nextState}
                          onClick={() => handleTransition(nextState)}
                          className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all shadow-sm ${
                            isCancel
                              ? 'bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/30'
                              : isFail
                              ? 'bg-orange-500/10 text-orange-400 hover:bg-orange-500/20 border border-orange-500/30'
                              : 'bg-blue-400 hover:bg-blue-300 text-slate-950'
                          }`}
                        >
                          Mark as {nextState.replace(/_/g, ' ')}
                        </button>
                      );
                    })}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="block text-[11px] text-slate-400 font-semibold mb-1">
                        Operational Audit Notes
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Verified cold-chain van seal..."
                        value={transitionNotes}
                        onChange={(e) => setTransitionNotes(e.target.value)}
                        className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 font-semibold mb-1">
                        Cancellation Reason (Required if cancelling)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Customer cancelled order..."
                        value={cancellationReason}
                        onChange={(e) => setCancellationReason(e.target.value)}
                        className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic">
                  This order has reached terminal status [{selectedOrder.orderStatus}]. No further transitions permitted.
                </p>
              )}
            </div>

            {/* Line Items Table */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-300">Produce Order Items</h3>
              <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-800/60">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="p-3 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-semibold text-slate-100">{item.title}</p>
                      <p className="text-[11px] text-slate-400">
                        {item.quantity} {item.unit} @ ₹{item.unitPrice} / {item.unit}
                      </p>
                    </div>
                    <span className="font-bold text-slate-100">
                      ₹{item.totalPrice.toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
                <div className="p-3 bg-slate-950/60 flex justify-between text-xs font-bold text-slate-200">
                  <span>Grand Total (incl. delivery):</span>
                  <span className="text-sm font-extrabold text-blue-400">
                    ₹{selectedOrder.totalAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>

            {/* Delivery Address & Customer */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-300">
                  <User className="w-4 h-4 text-blue-400" />
                  <span>Customer Details</span>
                </div>
                <p className="font-semibold text-slate-200">{selectedOrder.customerName}</p>
                <p className="text-slate-400 font-mono">{selectedOrder.customerPhone}</p>
                {selectedOrder.customerNotes && (
                  <p className="text-slate-400 italic">Note: &ldquo;{selectedOrder.customerNotes}&rdquo;</p>
                )}
              </div>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-300">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                  <span>Delivery Address</span>
                </div>
                <p className="text-slate-300">
                  {selectedOrder.deliveryAddress.streetAddress}, {selectedOrder.deliveryAddress.locality}
                </p>
                <p className="text-slate-400">
                  {selectedOrder.deliveryAddress.city}, {selectedOrder.deliveryAddress.state} -{' '}
                  <span className="font-mono">{selectedOrder.deliveryAddress.pincode}</span>
                </p>
              </div>
            </div>

            {/* Immutable Timeline History */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-300">Cryptographic Transition Timeline</h3>
              <div className="space-y-2">
                {selectedOrder.history.map((h, i) => (
                  <div
                    key={i}
                    className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-xl flex items-start gap-3 text-xs"
                  >
                    <div className="p-1.5 bg-slate-800 rounded-lg text-slate-300 mt-0.5">
                      <Clock className="w-3.5 h-3.5" />
                    </div>
                    <div className="space-y-0.5 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-200 uppercase font-mono text-[10px]">
                          [{h.status.replace(/_/g, ' ')}]
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {new Date(h.timestamp).toLocaleString('en-IN')}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Actor: <span className="text-slate-200 font-medium">{h.actorName}</span>{' '}
                        <span className="font-mono text-slate-500 uppercase">({h.actorRole})</span>
                      </p>
                      {h.notes && <p className="text-[11px] text-slate-400 italic">{h.notes}</p>}
                    </div>
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
