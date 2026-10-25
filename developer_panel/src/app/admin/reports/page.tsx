'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { operationsService } from '../../../lib/operationsService';
import {
  BarChart3,
  TrendingUp,
  ShoppingBag,
  Users,
  Calendar,
  Download,
  IndianRupee,
} from 'lucide-react';

export default function AdminReportsPage() {
  const { tenantId } = useAuth();
  const [orders, setOrders] = useState(() => operationsService.getOrders(tenantId));
  const [products, setProducts] = useState(() => operationsService.getProducts(tenantId));
  const [sellers, setSellers] = useState(() => operationsService.getSellers(tenantId));

  useEffect(() => {
    setOrders(operationsService.getOrders(tenantId));
    setProducts(operationsService.getProducts(tenantId));
    setSellers(operationsService.getSellers(tenantId));
  }, [tenantId]);

  // Aggregate Calculations
  const validOrders = orders.filter((o) => o.orderStatus !== 'cancelled');
  const grossSales = validOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalItemsSold = validOrders.reduce(
    (sum, o) => sum + o.items.reduce((iSum, i) => iSum + i.quantity, 0),
    0
  );
  const avgOrderValue = validOrders.length > 0 ? Math.round(grossSales / validOrders.length) : 0;

  // Breakdown by Category
  const categorySales: Record<string, { count: number; revenue: number }> = {};
  for (const o of validOrders) {
    for (const item of o.items) {
      const prod = products.find((p) => p.id === item.productId);
      const cat = prod?.category || 'uncategorized';
      if (!categorySales[cat]) {
        categorySales[cat] = { count: 0, revenue: 0 };
      }
      categorySales[cat].count += item.quantity;
      categorySales[cat].revenue += item.totalPrice;
    }
  }

  // Breakdown by Farm Seller
  const sellerSales: Record<string, { orders: number; revenue: number }> = {};
  for (const o of validOrders) {
    if (!sellerSales[o.sellerName]) {
      sellerSales[o.sellerName] = { orders: 0, revenue: 0 };
    }
    sellerSales[o.sellerName].orders += 1;
    sellerSales[o.sellerName].revenue += o.totalAmount;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight">Sales & Order Reports</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Verified aggregate analytics calculated directly from backend order journals in Indian Rupees (₹).
          </p>
        </div>
      </div>

      {/* Top Aggregates */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl">
          <span className="text-xs text-slate-400 font-semibold">Gross Realized Sales</span>
          <p className="text-2xl font-extrabold text-slate-100 mt-1 font-mono">
            ₹{grossSales.toLocaleString('en-IN')}
          </p>
          <span className="text-[11px] text-emerald-400 font-medium">Excludes cancelled orders</span>
        </div>
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl">
          <span className="text-xs text-slate-400 font-semibold">Average Order Value (AOV)</span>
          <p className="text-2xl font-extrabold text-blue-400 mt-1 font-mono">
            ₹{avgOrderValue.toLocaleString('en-IN')}
          </p>
          <span className="text-[11px] text-slate-400">Across {validOrders.length} fulfilled orders</span>
        </div>
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl">
          <span className="text-xs text-slate-400 font-semibold">Total Produce Volume</span>
          <p className="text-2xl font-extrabold text-purple-400 mt-1 font-mono">
            {totalItemsSold} <span className="text-xs text-slate-400 font-normal">units / kg</span>
          </p>
          <span className="text-[11px] text-slate-400">Farm harvest dispatch volume</span>
        </div>
      </div>

      {/* 2-Column Breakdown: Category vs Farm Sellers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
          <h2 className="text-sm font-bold text-slate-200">Revenue by Produce Category</h2>
          <div className="space-y-3">
            {Object.entries(categorySales).map(([cat, data]) => {
              const pct = grossSales > 0 ? Math.round((data.revenue / grossSales) * 100) : 0;
              return (
                <div key={cat} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-300 uppercase font-mono">
                      {cat.replace(/_/g, ' ')}
                    </span>
                    <span className="font-mono text-slate-100 font-bold">
                      ₹{data.revenue.toLocaleString('en-IN')} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-500 h-full rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Farm Seller Contribution */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
          <h2 className="text-sm font-bold text-slate-200">Sales by Fulfillment Farm</h2>
          <div className="space-y-3">
            {Object.entries(sellerSales).map(([sellerName, data]) => (
              <div
                key={sellerName}
                className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs"
              >
                <div>
                  <p className="font-bold text-slate-100">{sellerName}</p>
                  <p className="text-slate-500 text-[11px]">{data.orders} order(s) fulfilled</p>
                </div>
                <span className="font-mono font-bold text-emerald-400">
                  ₹{data.revenue.toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
