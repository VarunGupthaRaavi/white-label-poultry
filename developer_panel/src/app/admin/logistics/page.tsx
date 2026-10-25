'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { operationsService } from '../../../lib/operationsService';
import { AdminOrderRecord } from '../../../types/operations';
import {
  Truck,
  MapPin,
  Clock,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Phone,
  User,
  ShieldCheck,
  Send,
} from 'lucide-react';

export default function AdminLogisticsPage() {
  const { tenantId, user } = useAuth();
  const [orders, setOrders] = useState<AdminOrderRecord[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<AdminOrderRecord | null>(null);
  const [carrierNotes, setCarrierNotes] = useState('');
  const [carrierVehicle, setCarrierVehicle] = useState('KA-04-E-8899 (Chilled Van)');

  const refreshOrders = () => {
    const list = operationsService.getOrders(tenantId);
    // Filter to logistics relevant orders
    setOrders(list.filter((o) => ['ready_for_dispatch', 'out_for_delivery', 'delivered', 'failed_delivery'].includes(o.orderStatus)));
  };

  useEffect(() => {
    refreshOrders();
  }, [tenantId]);

  const handleDispatch = (orderId: string) => {
    try {
      operationsService.transitionOrderStatus(
        orderId,
        'out_for_delivery',
        user?.uid || 'staff_deepa_04',
        'client_admin',
        user?.displayName || 'Deepa Patel (Dispatch Officer)',
        `Assigned to vehicle ${carrierVehicle}. ${carrierNotes}`
      );
      setCarrierNotes('');
      refreshOrders();
      setSelectedOrder(null);
    } catch (e: unknown) {
      alert((e as Error).message);
    }
  };

  const handleMarkDelivered = (orderId: string) => {
    try {
      operationsService.transitionOrderStatus(
        orderId,
        'delivered',
        user?.uid || 'staff_deepa_04',
        'client_admin',
        user?.displayName || 'Deepa Patel (Dispatch Officer)',
        'OTP verified at doorstep handover by customer.'
      );
      refreshOrders();
      setSelectedOrder(null);
    } catch (e: unknown) {
      alert((e as Error).message);
    }
  };

  const handleMarkFailed = (orderId: string) => {
    const reason = prompt('Enter delivery failure reason:', 'Customer address locked / phone unreachable');
    if (!reason) return;
    try {
      operationsService.transitionOrderStatus(
        orderId,
        'failed_delivery',
        user?.uid || 'staff_deepa_04',
        'client_admin',
        user?.displayName || 'Deepa Patel (Dispatch Officer)',
        `Delivery attempt failed: ${reason}`
      );
      refreshOrders();
      setSelectedOrder(null);
    } catch (e: unknown) {
      alert((e as Error).message);
    }
  };

  const readyForDispatch = orders.filter((o) => o.orderStatus === 'ready_for_dispatch');
  const outForDelivery = orders.filter((o) => o.orderStatus === 'out_for_delivery');
  const completedOrFailed = orders.filter((o) => ['delivered', 'failed_delivery'].includes(o.orderStatus));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-purple-400 font-semibold mb-1">
            <Truck className="w-4 h-4" />
            <span>Cold-Chain Fleet Operations</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight">
            Logistics & Delivery Dispatch Board
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Monitor farm produce transit, temperature-controlled delivery vans, and doorstep handovers.
          </p>
        </div>
        <button
          onClick={refreshOrders}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 border border-slate-800 rounded-xl"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Fleet</span>
        </button>
      </div>

      {/* 3 Kanban-style Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Column 1: Ready for Dispatch */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-cyan-500/30">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
              <h2 className="text-sm font-bold text-slate-200">Ready at Hub ({readyForDispatch.length})</h2>
            </div>
            <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold">Staged</span>
          </div>

          <div className="space-y-3">
            {readyForDispatch.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500 bg-slate-900/40 border border-slate-800/80 rounded-2xl">
                No orders waiting for dispatch staging.
              </div>
            ) : (
              readyForDispatch.map((order) => (
                <div
                  key={order.id}
                  className="p-4 bg-slate-900 border border-slate-800 hover:border-cyan-500/40 rounded-2xl space-y-3 shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-slate-100">{order.id}</span>
                    <span className="text-xs font-bold text-blue-400">₹{order.totalAmount}</span>
                  </div>

                  <div className="text-xs space-y-1">
                    <p className="text-slate-300 font-semibold">{order.customerName}</p>
                    <p className="text-slate-400 flex items-center gap-1.5 text-[11px]">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      <span>{order.deliveryAddress.locality}, {order.deliveryAddress.city}</span>
                    </p>
                    <p className="text-[11px] text-slate-400">Farm: {order.sellerName}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-800 space-y-2">
                    <div className="flex items-center gap-2">
                      <select
                        value={carrierVehicle}
                        onChange={(e) => setCarrierVehicle(e.target.value)}
                        className="flex-1 px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-[11px] text-slate-200"
                      >
                        <option value="KA-04-E-8899 (Cold Van 1)">KA-04-E-8899 (Cold Van 1)</option>
                        <option value="KA-03-J-1234 (Mohan Courier)">KA-03-J-1234 (Mohan Courier)</option>
                        <option value="KA-51-M-4455 (Refrigerated Truck)">KA-51-M-4455 (Ref Truck)</option>
                      </select>
                    </div>

                    <button
                      onClick={() => handleDispatch(order.id)}
                      className="w-full py-1.5 px-3 text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-md shadow-cyan-500/20"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Dispatch to Carrier</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Column 2: Out for Delivery */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-purple-500/30">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-pulse"></span>
              <h2 className="text-sm font-bold text-slate-200">Out for Delivery ({outForDelivery.length})</h2>
            </div>
            <span className="text-[10px] font-mono text-purple-400 uppercase font-bold">In Transit</span>
          </div>

          <div className="space-y-3">
            {outForDelivery.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500 bg-slate-900/40 border border-slate-800/80 rounded-2xl">
                No orders currently in active transit.
              </div>
            ) : (
              outForDelivery.map((order) => (
                <div
                  key={order.id}
                  className="p-4 bg-slate-900 border border-slate-800 hover:border-purple-500/40 rounded-2xl space-y-3 shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-slate-100">{order.id}</span>
                    <span className="text-xs font-bold text-purple-400">₹{order.totalAmount}</span>
                  </div>

                  <div className="text-xs space-y-1">
                    <p className="text-slate-300 font-semibold">{order.customerName}</p>
                    <p className="text-slate-400 flex items-center gap-1.5 text-[11px]">
                      <Phone className="w-3.5 h-3.5 text-slate-500" />
                      <span className="font-mono">{order.customerPhone}</span>
                    </p>
                    <p className="text-slate-400 flex items-center gap-1.5 text-[11px]">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      <span>{order.deliveryAddress.streetAddress}</span>
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex items-center gap-2">
                    <button
                      onClick={() => handleMarkDelivered(order.id)}
                      className="flex-1 py-1.5 px-3 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-all flex items-center justify-center gap-1"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Delivered (OTP)</span>
                    </button>
                    <button
                      onClick={() => handleMarkFailed(order.id)}
                      className="py-1.5 px-3 text-xs font-semibold text-rose-400 hover:bg-rose-500/10 border border-rose-500/20 rounded-xl transition-all"
                    >
                      <span>Failed</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Column 3: Recently Delivered or Failed */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-500"></span>
              <h2 className="text-sm font-bold text-slate-200">Completed Deliveries ({completedOrFailed.length})</h2>
            </div>
            <span className="text-[10px] font-mono text-slate-500 uppercase font-bold">Terminal</span>
          </div>

          <div className="space-y-3">
            {completedOrFailed.map((order) => {
              const isDelivered = order.orderStatus === 'delivered';
              return (
                <div
                  key={order.id}
                  className="p-3 bg-slate-900/60 border border-slate-800/80 rounded-2xl flex items-center justify-between text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-200">{order.id}</span>
                      <span
                        className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                          isDelivered
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}
                      >
                        {order.orderStatus}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">{order.customerName}</p>
                  </div>
                  <span className="font-bold text-slate-300">₹{order.totalAmount}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
