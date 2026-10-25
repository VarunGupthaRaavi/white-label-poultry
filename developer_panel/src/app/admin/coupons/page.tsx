'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { operationsService } from '../../../lib/operationsService';
import { tenantService } from '../../../lib/tenantService';
import { CouponRecord } from '../../../types/operations';
import {
  TicketPercent,
  Plus,
  Lock,
  Sparkles,
  CheckCircle,
  Calendar,
  X,
  IndianRupee,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';
import Link from 'next/link';

export default function AdminCouponsPage() {
  const { tenantId, user } = useAuth();
  const [coupons, setCoupons] = useState<CouponRecord[]>([]);
  const [isEnabled, setIsEnabled] = useState(true);
  const [isRequested, setIsRequested] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'flat_amount'>('percentage');
  const [discountValue, setDiscountValue] = useState('10');
  const [minOrderAmount, setMinOrderAmount] = useState('499');
  const [maxDiscountAmount, setMaxDiscountAmount] = useState('100');
  const [validUntil, setValidUntil] = useState('2026-12-31');
  const [usageLimit, setUsageLimit] = useState('500');

  const refreshData = async () => {
    const ent = await tenantService.getEntitlements(tenantId);
    const mod = ent?.modules?.['coupons_and_promotions'];
    const enabled = mod ? mod.state === 'enabled' : false;
    setIsEnabled(enabled);

    const reqs = operationsService.getModuleRequests(tenantId);
    setIsRequested(reqs.some((r) => r.moduleKey === 'coupons_and_promotions'));

    if (enabled) {
      setCoupons(operationsService.getCoupons(tenantId));
    }
  };

  useEffect(() => {
    refreshData();
  }, [tenantId]);

  const handleRequestEntitlement = () => {
    operationsService.requestModuleEntitlement(
      tenantId,
      'coupons_and_promotions',
      'Client admin requested promotional campaigns activation'
    );
    setIsRequested(true);
    alert('Entitlement request submitted to Developer Control Plane for review.');
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    operationsService.createCoupon({
      tenantId,
      code: code.toUpperCase().trim(),
      discountType,
      discountValue: parseFloat(discountValue),
      minOrderAmount: parseFloat(minOrderAmount),
      maxDiscountAmount: parseFloat(maxDiscountAmount),
      validUntil: new Date(validUntil).toISOString(),
      usageLimit: parseInt(usageLimit, 10),
      status: 'active',
    });
    setCode('');
    setIsModalOpen(false);
    setCoupons(operationsService.getCoupons(tenantId));
  };

  if (!isEnabled) {
    return (
      <div className="space-y-6">
        <div className="pb-4 border-b border-slate-800">
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight">Coupons & Promotions</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Discount vouchers and seasonal poultry promotional codes.
          </p>
        </div>

        <div className="p-8 bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl mx-auto text-center space-y-4 shadow-xl">
          <div className="p-4 bg-amber-500/10 text-amber-400 rounded-2xl w-fit mx-auto border border-amber-500/20">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-bold text-slate-100">
            Module Not Entitled: `coupons_and_promotions`
          </h2>
          <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
            The promotional coupons engine is currently not enabled for tenant{' '}
            <span className="font-mono text-slate-200">{tenantId}</span> under the platform entitlement policy.
          </p>

          <div className="pt-2">
            {isRequested ? (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 text-amber-400 rounded-xl text-xs font-semibold">
                <CheckCircle className="w-4 h-4" />
                <span>Entitlement Request Pending Developer Review</span>
              </div>
            ) : (
              <button
                onClick={handleRequestEntitlement}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl shadow-md transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>Request Module from Developer Control Plane</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight">Coupons & Promotions</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure discount codes and order threshold vouchers in Indian Rupees (₹).
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-950 bg-blue-400 hover:bg-blue-300 rounded-xl transition-all shadow-md shadow-blue-500/20"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Promo Code</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {coupons.map((c) => (
          <div key={c.id} className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4 shadow-lg">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-base font-extrabold font-mono text-blue-400 tracking-wider">
                  {c.code}
                </span>
                <p className="text-xs text-slate-400 mt-0.5">
                  {c.discountType === 'percentage'
                    ? `${c.discountValue}% off up to ₹${c.maxDiscountAmount}`
                    : `Flat ₹${c.discountValue} off`}
                </p>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {c.status}
              </span>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-1 text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">Min Order:</span>
                <span className="font-mono font-bold text-slate-200">₹{c.minOrderAmount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Redeemed:</span>
                <span className="font-mono">
                  {c.usedCount} / {c.usageLimit}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Valid Until:</span>
                <span className="font-mono text-[11px]">
                  {new Date(c.validUntil).toLocaleDateString('en-IN')}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-base font-bold text-slate-100">Create Promotional Coupon</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateCoupon} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Coupon Code (Uppercase)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. POULTRY20"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 font-mono font-bold uppercase focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Type</label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="flat_amount">Flat Amount (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Discount Value</label>
                  <input
                    type="number"
                    required
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Min Order (₹ INR)</label>
                  <input
                    type="number"
                    required
                    value={minOrderAmount}
                    onChange={(e) => setMinOrderAmount(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Max Discount (₹ INR)</label>
                  <input
                    type="number"
                    required
                    value={maxDiscountAmount}
                    onChange={(e) => setMaxDiscountAmount(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold text-slate-950 bg-blue-400 hover:bg-blue-300 rounded-xl"
                >
                  Create Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
