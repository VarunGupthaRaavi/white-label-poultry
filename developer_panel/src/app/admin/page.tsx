'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { operationsService } from '../../lib/operationsService';
import {
  ShoppingBag,
  TrendingUp,
  Users,
  AlertTriangle,
  ArrowUpRight,
  Clock,
  CheckCircle,
  Truck,
  Plus,
  ArrowRight,
  Store,
} from 'lucide-react';
import Link from 'next/link';

export default function AdminOverviewPage() {
  const { tenantId } = useAuth();
  const [orders, setOrders] = useState(() => operationsService.getOrders(tenantId));
  const [products, setProducts] = useState(() => operationsService.getProducts(tenantId));
  const [sellers, setSellers] = useState(() => operationsService.getSellers(tenantId));

  useEffect(() => {
    setOrders(operationsService.getOrders(tenantId));
    setProducts(operationsService.getProducts(tenantId));
    setSellers(operationsService.getSellers(tenantId));
  }, [tenantId]);

  // Aggregates
  const totalSalesInr = orders
    .filter((o) => o.orderStatus !== 'cancelled')
    .reduce((acc, o) => acc + o.totalAmount, 0);

  const activeOrdersCount = orders.filter(
    (o) => o.orderStatus !== 'delivered' && o.orderStatus !== 'cancelled'
  ).length;

  const pendingSellersCount = sellers.filter(
    (s) => s.status === 'submitted' || s.status === 'under_review'
  ).length;

  const lowStockProducts = products.filter((p) => p.stockAvailable < 50);

  return (
    <div className="space-y-6">
      {/* Top Welcome & Actions Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-blue-400 font-semibold mb-1">
            <Store className="w-4 h-4" />
            <span>Tenant Operations Hub</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight">
            Client Administration Dashboard
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time poultry marketplace metrics for{' '}
            <span className="font-mono text-slate-200">{tenantId}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-xl transition-all border border-slate-700"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Product</span>
          </Link>
          <Link
            href="/admin/orders"
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-950 bg-blue-400 hover:bg-blue-300 rounded-xl transition-all shadow-md shadow-blue-500/20"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Manage Orders</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Gross Sales */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total Revenue</span>
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-extrabold text-slate-100">
              ₹{totalSalesInr.toLocaleString('en-IN')}
            </span>
            <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>Calculated across active orders</span>
            </p>
          </div>
        </div>

        {/* KPI 2: Active Orders */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Active Orders</span>
            <div className="p-2 bg-blue-500/10 text-blue-400 rounded-xl">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-extrabold text-slate-100">{activeOrdersCount}</span>
            <p className="text-[11px] text-slate-400 mt-1">In preparation / dispatch</p>
          </div>
        </div>

        {/* KPI 3: Pending KYC Reviews */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Pending Seller KYC</span>
            <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-extrabold text-amber-400">{pendingSellersCount}</span>
            <p className="text-[11px] text-slate-400 mt-1">
              {pendingSellersCount > 0 ? 'Requires vet audit review' : 'All sellers verified'}
            </p>
          </div>
        </div>

        {/* KPI 4: Low Stock Batches */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Low Stock Batches</span>
            <div className="p-2 bg-rose-500/10 text-rose-400 rounded-xl">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-extrabold text-rose-400">{lowStockProducts.length}</span>
            <p className="text-[11px] text-slate-400 mt-1">Stock level &lt; 50 units/kg</p>
          </div>
        </div>
      </div>

      {/* 2-Column Section: Live Order Flow & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Recent Orders (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-200">Recent Marketplace Orders</h2>
            <Link
              href="/admin/orders"
              className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1"
            >
              <span>View all ({orders.length})</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-800/80">
            {orders.slice(0, 5).map((order) => {
              const statusColor =
                order.orderStatus === 'delivered'
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  : order.orderStatus === 'cancelled'
                  ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                  : order.orderStatus === 'out_for_delivery'
                  ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                  : order.orderStatus === 'ready_for_dispatch'
                  ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                  : order.orderStatus === 'preparing'
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  : 'bg-blue-500/10 text-blue-400 border-blue-500/20';

              return (
                <div key={order.id} className="p-4 hover:bg-slate-800/40 transition-colors flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-100">{order.id}</span>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${statusColor}`}>
                        {order.orderStatus.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">
                      {order.customerName} • {order.items.length} item(s) • Farm: {order.sellerName}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-slate-100">
                      ₹{order.totalAmount.toLocaleString('en-IN')}
                    </span>
                    <p className="text-[10px] text-slate-500 font-mono">
                      {new Date(order.placedAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Alerts & Pending Actions */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-slate-200">Pending Actions</h2>

          <div className="space-y-3">
            {/* Seller KYC Alert */}
            {pendingSellersCount > 0 && (
              <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-amber-400 text-xs font-bold">
                  <Clock className="w-4 h-4" />
                  <span>{pendingSellersCount} Seller Application(s) Awaiting Review</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Poultry farms have submitted veterinary passes and FSSAI certificates awaiting compliance sign-off.
                </p>
                <Link
                  href="/admin/sellers"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300"
                >
                  <span>Review KYC documents</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            )}

            {/* Low Stock Alert */}
            {lowStockProducts.length > 0 && (
              <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-rose-400 text-xs font-bold">
                  <AlertTriangle className="w-4 h-4" />
                  <span>{lowStockProducts.length} Product(s) Below Buffer Stock</span>
                </div>
                <div className="space-y-1 text-[11px] text-slate-400">
                  {lowStockProducts.slice(0, 3).map((p) => (
                    <div key={p.id} className="flex justify-between">
                      <span className="truncate max-w-[160px]">{p.title}</span>
                      <span className="font-mono text-rose-400 font-bold">
                        {p.stockAvailable} {p.unit}
                      </span>
                    </div>
                  ))}
                </div>
                <Link
                  href="/admin/inventory"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-400 hover:text-rose-300 pt-1"
                >
                  <span>Adjust inventory batches</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            )}

            {/* Quick Links Card */}
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
              <span className="text-xs font-bold text-slate-300">Quick Links</span>
              <div className="space-y-1 text-xs">
                <Link
                  href="/admin/logistics"
                  className="flex items-center justify-between p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-purple-400" />
                    <span>Logistics Dispatch Board</span>
                  </span>
                  <ArrowRight className="w-3 h-3 text-slate-600" />
                </Link>
                <Link
                  href="/admin/branding"
                  className="flex items-center justify-between p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Store className="w-4 h-4 text-blue-400" />
                    <span>Branding & App Theme</span>
                  </span>
                  <ArrowRight className="w-3 h-3 text-slate-600" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
