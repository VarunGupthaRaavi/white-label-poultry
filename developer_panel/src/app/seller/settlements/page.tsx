'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { operationsService } from '../../../lib/operationsService';
import { SellerRecord, AdminOrderRecord } from '../../../types/operations';
import {
  WalletCards,
  IndianRupee,
  Clock,
  CheckCircle2,
  Lock,
  Building,
  AlertCircle,
} from 'lucide-react';

export default function SellerSettlementsPage() {
  const { tenantId, sellerId } = useAuth();
  const [seller, setSeller] = useState<SellerRecord | undefined>(() =>
    operationsService.getSellerById(sellerId || 'seller_krishna_01')
  );
  const [orders, setOrders] = useState<AdminOrderRecord[]>(() =>
    operationsService.getOrders(tenantId, sellerId)
  );

  useEffect(() => {
    setSeller(operationsService.getSellerById(sellerId || 'seller_krishna_01'));
    setOrders(operationsService.getOrders(tenantId, sellerId));
  }, [tenantId, sellerId]);

  const deliveredOrders = orders.filter((o) => o.orderStatus === 'delivered');
  const grossSales = deliveredOrders.reduce((acc, o) => acc + o.totalAmount, 0);
  const commissionRate = seller?.commissionRatePercent || 8.0;
  const commissionDeducted = Math.round(grossSales * (commissionRate / 100));
  const netPayable = grossSales - commissionDeducted;

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="pb-4 border-b border-slate-800">
        <h1 className="text-2xl font-bold text-slate-100 tracking-tight">Earnings & Offline Settlements</h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Sales reconciliation, platform commission breakdown in Indian Rupees (₹), and bank transfer journals.
        </p>
      </div>

      {/* Immutability Notice */}
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 text-blue-400 rounded-xl">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-slate-200">Financial Ledger Is Read-Only</span>
            <p className="text-slate-400 text-[11px]">
              Sellers cannot alter commission rates, overwrite payout records, or modify transaction figures.
            </p>
          </div>
        </div>
        <span className="font-mono text-[10px] text-slate-500">
          Policy: seller_boundary.cannot_edit_payment_records()
        </span>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl">
          <span className="text-xs font-semibold text-slate-400">Delivered Produce Gross</span>
          <p className="text-2xl font-extrabold text-slate-100 mt-1 font-mono">
            ₹{grossSales.toLocaleString('en-IN')}
          </p>
          <span className="text-[11px] text-slate-500">{deliveredOrders.length} fulfilled order(s)</span>
        </div>

        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl">
          <span className="text-xs font-semibold text-slate-400">Hub Commission ({commissionRate}%)</span>
          <p className="text-2xl font-extrabold text-rose-400 mt-1 font-mono">
            -₹{commissionDeducted.toLocaleString('en-IN')}
          </p>
          <span className="text-[11px] text-slate-500">Platform operational charge</span>
        </div>

        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl">
          <span className="text-xs font-semibold text-slate-400">Net Payable Settlement</span>
          <p className="text-2xl font-extrabold text-emerald-400 mt-1 font-mono">
            ₹{netPayable.toLocaleString('en-IN')}
          </p>
          <span className="text-[11px] text-emerald-400 font-medium">Pending weekly NEFT payout</span>
        </div>
      </div>

      {/* Bank Account Verification */}
      {seller?.bankDetails && (
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl text-xs space-y-2">
          <div className="flex items-center gap-2 font-bold text-slate-200">
            <Building className="w-4 h-4 text-amber-400" />
            <span>Designated Beneficiary Bank Account</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-slate-300">
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-mono">Bank</span>
              <p className="font-semibold">{seller.bankDetails.bankName}</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-mono">Beneficiary</span>
              <p className="font-semibold">{seller.bankDetails.beneficiaryName}</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-mono">Account #</span>
              <p className="font-mono font-semibold">{seller.bankDetails.accountNumber}</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-mono">IFSC</span>
              <p className="font-mono font-semibold">{seller.bankDetails.ifscCode}</p>
            </div>
          </div>
        </div>
      )}

      {/* Order Settlement Breakdown Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950/80 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
            <tr>
              <th className="py-3 px-4 font-semibold">Order ID</th>
              <th className="py-3 px-4 font-semibold">Customer</th>
              <th className="py-3 px-4 font-semibold">Delivered At</th>
              <th className="py-3 px-4 font-semibold">Order Total</th>
              <th className="py-3 px-4 font-semibold">Net Payout (₹)</th>
              <th className="py-3 px-4 font-semibold">Settlement Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono">
            {deliveredOrders.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-10 text-center text-slate-500 font-sans">
                  No delivered orders eligible for settlement yet.
                </td>
              </tr>
            ) : (
              deliveredOrders.map((o) => {
                const net = Math.round(o.totalAmount * (1 - commissionRate / 100));
                return (
                  <tr key={o.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-100">{o.id}</td>
                    <td className="py-3 px-4 font-sans text-slate-300">{o.customerName}</td>
                    <td className="py-3 px-4 text-slate-400 text-[11px]">
                      {new Date(o.updatedAt).toLocaleDateString('en-IN')}
                    </td>
                    <td className="py-3 px-4 text-slate-300 font-bold">₹{o.totalAmount}</td>
                    <td className="py-3 px-4 text-emerald-400 font-bold">₹{net}</td>
                    <td className="py-3 px-4">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-sans">
                        Settlement Pending
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
