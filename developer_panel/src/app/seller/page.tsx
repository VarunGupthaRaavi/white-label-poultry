'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { operationsService } from '../../lib/operationsService';
import { SellerRecord, AdminOrderRecord, AdminProductRecord } from '../../types/operations';
import {
  Tractor,
  ShoppingBag,
  Tag,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  PackageOpen,
} from 'lucide-react';
import Link from 'next/link';

export default function SellerDashboardPage() {
  const { tenantId, sellerId } = useAuth();
  const [seller, setSeller] = useState<SellerRecord | undefined>(() =>
    operationsService.getSellerById(sellerId || 'seller_krishna_01')
  );
  const [orders, setOrders] = useState<AdminOrderRecord[]>(() =>
    operationsService.getOrders(tenantId, sellerId)
  );
  const [products, setProducts] = useState<AdminProductRecord[]>(() =>
    operationsService.getProducts(tenantId, sellerId)
  );

  useEffect(() => {
    setSeller(operationsService.getSellerById(sellerId || 'seller_krishna_01'));
    setOrders(operationsService.getOrders(tenantId, sellerId));
    setProducts(operationsService.getProducts(tenantId, sellerId));
  }, [tenantId, sellerId]);

  const activeOrders = orders.filter(
    (o) => ['confirmed', 'preparing', 'ready_for_dispatch'].includes(o.orderStatus)
  );

  const completedOrders = orders.filter((o) => o.orderStatus === 'delivered');
  const grossSales = completedOrders.reduce((acc, o) => acc + o.totalAmount, 0);
  const commissionRate = seller?.commissionRatePercent || 8.0;
  const netEarnings = Math.round(grossSales * (1 - commissionRate / 100));

  const isApproved = seller?.status === 'approved';
  const isUnderReview = seller?.status === 'under_review' || seller?.status === 'submitted';
  const isSuspended = seller?.status === 'suspended';

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold mb-1">
            <Tractor className="w-4 h-4" />
            <span>Farm Producer Operations</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight">
            {seller?.farmName || 'Poultry Partner Farm'}
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Owner: <span className="text-slate-200">{seller?.name}</span> • FSSAI:{' '}
            <span className="font-mono text-slate-200">{seller?.fssaiNumber}</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/seller/products"
            className="px-3.5 py-2 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-xl transition-all border border-slate-700"
          >
            Update Live Bird Stock
          </Link>
          <Link
            href="/seller/orders"
            className="px-4 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-all shadow-md shadow-amber-500/20"
          >
            Fulfill Orders ({activeOrders.length})
          </Link>
        </div>
      </div>

      {/* Farm Status Banner */}
      {isUnderReview && (
        <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-amber-400 flex-shrink-0" />
            <div>
              <p className="text-xs font-bold text-slate-100">Farm KYC Verification Under Review</p>
              <p className="text-[11px] text-slate-400">
                Your veterinary passes and biosecurity audit certificates are being verified by the hub admin.
              </p>
            </div>
          </div>
          <Link
            href="/seller/application"
            className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1"
          >
            <span>View KYC</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {isSuspended && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
            <div>
              <p className="text-xs font-bold text-rose-300">Farm Operations Temporarily Suspended</p>
              <p className="text-[11px] text-slate-400">
                Reason: {seller?.rejectionReason || 'Compliance audit pending'}. Please contact hub administrator.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl">
          <span className="text-xs font-semibold text-slate-400">Incoming Orders</span>
          <p className="text-2xl font-extrabold text-amber-400 mt-2 font-mono">{activeOrders.length}</p>
          <span className="text-[11px] text-slate-400">Awaiting packing or dispatch</span>
        </div>

        {/* KPI 2 */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl">
          <span className="text-xs font-semibold text-slate-400">Active Live SKUs</span>
          <p className="text-2xl font-extrabold text-slate-100 mt-2 font-mono">
            {products.filter((p) => p.status === 'active').length}
          </p>
          <span className="text-[11px] text-slate-400">Approved catalog listings</span>
        </div>

        {/* KPI 3 */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl">
          <span className="text-xs font-semibold text-slate-400">Net Estimated Earnings</span>
          <p className="text-2xl font-extrabold text-emerald-400 mt-2 font-mono">
            ₹{netEarnings.toLocaleString('en-IN')}
          </p>
          <span className="text-[11px] text-slate-400">After {commissionRate}% hub commission</span>
        </div>

        {/* KPI 4 */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl">
          <span className="text-xs font-semibold text-slate-400">Farm Capacity</span>
          <p className="text-2xl font-extrabold text-purple-400 mt-2 font-mono">
            {seller?.farmCapacityBirds.toLocaleString('en-IN')}
          </p>
          <span className="text-[11px] text-slate-400">Certified flock capacity</span>
        </div>
      </div>

      {/* 2-Column: Orders awaiting preparation & Quick Stock Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-200">Orders Requiring Farm Action</h2>
            <Link
              href="/seller/orders"
              className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
            >
              <span>View all orders ({orders.length})</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-800/80">
            {activeOrders.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">
                No active orders requiring farm packaging at this moment.
              </div>
            ) : (
              activeOrders.map((o) => (
                <div key={o.id} className="p-4 flex items-center justify-between text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-100">{o.id}</span>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        {o.orderStatus.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <p className="text-slate-400">
                      {o.items.map((i) => `${i.title} (${i.quantity} ${i.unit})`).join(', ')}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-slate-100">₹{o.totalAmount}</span>
                    <p className="text-[10px] text-slate-500">
                      {new Date(o.placedAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Live Inventory Overview */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-200">Live Bird Stock Levels</h2>
            <Link
              href="/seller/products"
              className="text-xs text-amber-400 hover:text-amber-300 font-semibold"
            >
              Adjust
            </Link>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
            {products.map((p) => (
              <div key={p.id} className="flex items-center justify-between text-xs pb-2 border-b border-slate-800 last:border-0 last:pb-0">
                <div>
                  <p className="font-semibold text-slate-200">{p.title}</p>
                  <p className="text-[11px] text-blue-400 font-mono">₹{p.price} / {p.unit}</p>
                </div>
                <span className="font-mono font-bold text-slate-100">
                  {p.stockAvailable} {p.unit}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
