'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { operationsService } from '../../../lib/operationsService';
import { AdminProductRecord } from '../../../types/operations';
import {
  PackageOpen,
  Search,
  AlertTriangle,
  RefreshCw,
  Plus,
  Minus,
  CheckCircle,
  TrendingDown,
  Layers,
} from 'lucide-react';

export default function AdminInventoryPage() {
  const { tenantId } = useAuth();
  const [products, setProducts] = useState<AdminProductRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [adjustmentLogs, setAdjustmentLogs] = useState<
    { id: string; title: string; delta: number; newStock: number; reason: string; timestamp: string }[]
  >([]);

  const refreshProducts = () => {
    setProducts(operationsService.getProducts(tenantId));
  };

  useEffect(() => {
    refreshProducts();
  }, [tenantId]);

  const handleAdjustStock = (product: AdminProductRecord, delta: number) => {
    const newStock = Math.max(0, product.stockAvailable + delta);
    const reason = prompt(
      `Stock adjustment for "${product.title}": Enter batch intake or wastage reason`,
      delta > 0 ? 'Fresh farm harvest intake' : 'Defect / breakage write-off'
    );
    if (!reason) return;

    operationsService.updateProductPriceAndStock(product.id, product.price, newStock);
    setAdjustmentLogs((prev) => [
      {
        id: `adj_${Date.now()}`,
        title: product.title,
        delta,
        newStock,
        reason,
        timestamp: new Date().toLocaleTimeString('en-IN'),
      },
      ...prev.slice(0, 9),
    ]);
    refreshProducts();
  };

  const filteredProducts = products.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.sellerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-blue-400 font-semibold mb-1">
            <PackageOpen className="w-4 h-4" />
            <span>Farm Stock & Bird Batch Tracker</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight">
            Inventory & Bird Batch Control
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Monitor live flock weights, egg crates, buffer thresholds, and audit stock intake transactions.
          </p>
        </div>
        <button
          onClick={refreshProducts}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 border border-slate-800 rounded-xl"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Stock</span>
        </button>
      </div>

      {/* Low Stock Warning Banner */}
      {products.some((p) => p.stockAvailable < 40) && (
        <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />
            <div>
              <p className="text-xs font-bold text-slate-100">Low Produce Stock Warning</p>
              <p className="text-[11px] text-slate-400">
                Certain live bird batches or egg crates are approaching zero. Re-order from partner farms.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Filter live bird batches or farm names..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Inventory Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.map((p) => {
          const isLow = p.stockAvailable < 40;
          return (
            <div
              key={p.id}
              className={`p-5 bg-slate-900 border rounded-2xl space-y-4 shadow-lg transition-all ${
                isLow ? 'border-amber-500/30' : 'border-slate-800'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-sm text-slate-100">{p.title}</h3>
                  <p className="text-[11px] text-slate-400">Farm: {p.sellerName}</p>
                </div>
                <span
                  className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${
                    isLow
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  }`}
                >
                  {isLow ? 'Low Stock' : 'Optimal'}
                </span>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-mono">Current Stock</p>
                  <p className="text-xl font-extrabold text-slate-100 font-mono">
                    {p.stockAvailable} <span className="text-xs font-normal text-slate-400">{p.unit}</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-slate-400 uppercase font-mono">Rate</p>
                  <p className="text-sm font-bold text-blue-400 font-mono">₹{p.price} / {p.unit}</p>
                </div>
              </div>

              {/* Quick Adjustment Controls */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
                <span className="text-[11px] text-slate-400 font-semibold">Adjust Batch:</span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleAdjustStock(p, -10)}
                    className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-bold"
                    title="Subtract 10 units"
                  >
                    -10
                  </button>
                  <button
                    onClick={() => handleAdjustStock(p, -1)}
                    className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-bold"
                    title="Subtract 1 unit"
                  >
                    -1
                  </button>
                  <button
                    onClick={() => handleAdjustStock(p, 5)}
                    className="p-1.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg text-xs font-bold"
                    title="Add 5 units"
                  >
                    +5
                  </button>
                  <button
                    onClick={() => handleAdjustStock(p, 50)}
                    className="p-1.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg text-xs font-bold"
                    title="Add 50 units (New batch intake)"
                  >
                    +50
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Adjustment Log */}
      {adjustmentLogs.length > 0 && (
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
          <h3 className="text-xs font-bold text-slate-300">Live Session Stock Adjustment Audit</h3>
          <div className="space-y-1.5 text-xs font-mono">
            {adjustmentLogs.map((log) => (
              <div key={log.id} className="p-2 bg-slate-950 rounded-xl flex items-center justify-between text-slate-300">
                <span>
                  {log.timestamp} • <span className="font-semibold text-slate-100">{log.title}</span>: adjusted{' '}
                  <span className={log.delta > 0 ? 'text-emerald-400' : 'text-rose-400'}>
                    {log.delta > 0 ? `+${log.delta}` : log.delta}
                  </span>{' '}
                  (New: {log.newStock})
                </span>
                <span className="text-slate-500 text-[11px] truncate max-w-[200px]">{log.reason}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
