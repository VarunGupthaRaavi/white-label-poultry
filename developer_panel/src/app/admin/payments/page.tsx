'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { paymentService, PROVIDER_EVALUATIONS } from '../../../lib/paymentService';
import { operationsService } from '../../../lib/operationsService';
import {
  TenantPaymentConfig,
  PaymentTransactionRecord,
  SellerSettlementRecord,
} from '../../../types/payment';
import {
  CreditCard,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  RotateCcw,
  IndianRupee,
  Lock,
  ShieldCheck,
  Building,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  Eye,
  X,
  FileText,
  TrendingUp,
  Wallet,
} from 'lucide-react';

export default function AdminPaymentsPage() {
  const { tenantId, user } = useAuth();
  const [activeTab, setActiveTab] = useState<'transactions' | 'config' | 'settlements' | 'refunds' | 'reconciliation'>('transactions');
  const [config, setConfig] = useState<TenantPaymentConfig>(() => paymentService.getPaymentConfig(tenantId));
  const [transactions, setTransactions] = useState<PaymentTransactionRecord[]>([]);
  const [settlements, setSettlements] = useState<SellerSettlementRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Selected Transaction for Inspection & Refund
  const [selectedTx, setSelectedTx] = useState<PaymentTransactionRecord | null>(null);
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
  const [refundAmount, setRefundAmount] = useState('');
  const [refundReason, setRefundReason] = useState('');
  const [isProcessingRefund, setIsProcessingRefund] = useState(false);
  const [refundConfirmChecked, setRefundConfirmChecked] = useState(false);

  // Settlement Processing Modal
  const [selectedSettlement, setSelectedSettlement] = useState<SellerSettlementRecord | null>(null);
  const [utrReference, setUtrReference] = useState('');

  const refreshAll = () => {
    setConfig(paymentService.getPaymentConfig(tenantId));
    setTransactions(paymentService.getTransactions(tenantId));
    setSettlements(paymentService.getSettlements(tenantId));
  };

  useEffect(() => {
    refreshAll();
  }, [tenantId]);

  // Financial Aggregates
  const totalVolumeInr = transactions
    .filter((t) => t.status === 'captured' || t.status === 'partially_refunded')
    .reduce((sum, t) => sum + t.amountInr, 0);

  const totalCommissionsInr = settlements
    .filter((s) => s.status === 'settled' || s.status === 'eligible' || s.status === 'unsettled')
    .reduce((sum, s) => sum + s.commissionAmountInr, 0);

  const totalSettledInr = settlements
    .filter((s) => s.status === 'settled')
    .reduce((sum, s) => sum + s.netPayableInr, 0);

  const pendingSettlementInr = settlements
    .filter((s) => s.status === 'eligible' || s.status === 'unsettled')
    .reduce((sum, s) => sum + s.netPayableInr, 0);

  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch =
      t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.providerPaymentId && t.providerPaymentId.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAdvanceEligibility = () => {
    const advanced = paymentService.checkAndAdvanceSettlementEligibility(tenantId);
    refreshAll();
    alert(`Evaluated order delivery states: ${advanced} settlement record(s) advanced to 'eligible'.`);
  };

  const handleOpenRefundModal = (tx: PaymentTransactionRecord) => {
    setSelectedTx(tx);
    const alreadyRefunded = tx.refunds.reduce((sum, r) => sum + r.amountInr, 0);
    const maxRefundable = tx.amountInr - alreadyRefunded;
    setRefundAmount(maxRefundable.toString());
    setRefundReason('Customer return / order cancellation compensation');
    setRefundConfirmChecked(false);
    setIsRefundModalOpen(true);
  };

  const handleProcessRefund = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTx || !refundConfirmChecked) return;
    setIsProcessingRefund(true);

    try {
      paymentService.initiateRefund(
        tenantId,
        selectedTx.orderId,
        parseFloat(refundAmount),
        refundReason,
        user?.uid || 'admin_vikram_01',
        user?.displayName || 'Vikramaditya Rao (Hub Admin)'
      );
      setIsRefundModalOpen(false);
      refreshAll();
      alert(`Refund of ₹${refundAmount} successfully processed and recorded in ledger.`);
    } catch (err: unknown) {
      alert((err as Error).message);
    } finally {
      setIsProcessingRefund(false);
    }
  };

  const handleProcessSettlement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSettlement || !utrReference.trim()) return;

    try {
      paymentService.processSettlementPayout(
        selectedSettlement.id,
        utrReference.trim(),
        user?.displayName || 'Vikramaditya Rao (Hub Admin)'
      );
      setSelectedSettlement(null);
      setUtrReference('');
      refreshAll();
      alert(`Settlement marked as settled with UTR reference: ${utrReference}.`);
    } catch (err: unknown) {
      alert((err as Error).message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-blue-400 font-semibold mb-1">
            <CreditCard className="w-4 h-4" />
            <span>Marketplace Financial Controller</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight">
            Payments, Gateways & Farmer Settlements
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Tenant-isolated payment ledger, verified webhook journal, and marketplace split settlements in ₹ INR.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={refreshAll}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 border border-slate-800 rounded-xl"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh Ledger</span>
          </button>
        </div>
      </div>

      {/* 4 Financial KPI Cards in ₹ INR */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl">
          <span className="text-xs font-semibold text-slate-400">Total Processed Payments</span>
          <p className="text-2xl font-extrabold text-slate-100 mt-2 font-mono">
            ₹{totalVolumeInr.toLocaleString('en-IN')}
          </p>
          <span className="text-[11px] text-emerald-400 font-medium">Verified gateway captures</span>
        </div>

        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl">
          <span className="text-xs font-semibold text-slate-400">Hub Platform Commissions</span>
          <p className="text-2xl font-extrabold text-blue-400 mt-2 font-mono">
            ₹{totalCommissionsInr.toLocaleString('en-IN')}
          </p>
          <span className="text-[11px] text-slate-400">Contractual fee snapshot</span>
        </div>

        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl">
          <span className="text-xs font-semibold text-slate-400">Settled Farmer Payouts</span>
          <p className="text-2xl font-extrabold text-emerald-400 mt-2 font-mono">
            ₹{totalSettledInr.toLocaleString('en-IN')}
          </p>
          <span className="text-[11px] text-slate-400">Disbursed via bank transfer</span>
        </div>

        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl">
          <span className="text-xs font-semibold text-slate-400">Pending Farmer Settlements</span>
          <p className="text-2xl font-extrabold text-amber-400 mt-2 font-mono">
            ₹{pendingSettlementInr.toLocaleString('en-IN')}
          </p>
          <span className="text-[11px] text-slate-400">Delivered / awaiting payout</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-800 text-xs font-bold gap-6">
        <button
          onClick={() => setActiveTab('transactions')}
          className={`pb-3 transition-colors relative ${
            activeTab === 'transactions' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Payment Transactions ({transactions.length})
        </button>
        <button
          onClick={() => setActiveTab('settlements')}
          className={`pb-3 transition-colors relative ${
            activeTab === 'settlements' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Marketplace Settlements ({settlements.length})
        </button>
        <button
          onClick={() => setActiveTab('config')}
          className={`pb-3 transition-colors relative ${
            activeTab === 'config' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Gateway Configuration & Architecture
        </button>
        <button
          onClick={() => setActiveTab('refunds')}
          className={`pb-3 transition-colors relative ${
            activeTab === 'refunds' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Refunds & Chargebacks
        </button>
      </div>

      {/* TAB 1: TRANSACTIONS TABLE */}
      {activeTab === 'transactions' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search transaction ID, order ID, customer, or payment reference..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none"
            >
              <option value="all">All Payment Statuses</option>
              <option value="captured">Captured (Paid)</option>
              <option value="refunded">Refunded</option>
              <option value="partially_refunded">Partially Refunded</option>
              <option value="failed">Failed</option>
              <option value="created">Created / Pending</option>
            </select>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4 font-semibold">Transaction ID</th>
                  <th className="py-3 px-4 font-semibold">Order Reference</th>
                  <th className="py-3 px-4 font-semibold">Customer</th>
                  <th className="py-3 px-4 font-semibold">Gateway Method</th>
                  <th className="py-3 px-4 font-semibold">Amount (₹ INR)</th>
                  <th className="py-3 px-4 font-semibold">Security Audit</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-100">{tx.id}</td>
                    <td className="py-3.5 px-4 text-blue-400 font-semibold">{tx.orderId}</td>
                    <td className="py-3.5 px-4 font-sans">
                      <div className="font-semibold text-slate-200">{tx.customerName}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{tx.customerEmail}</div>
                    </td>
                    <td className="py-3.5 px-4 uppercase font-sans font-bold text-[11px]">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {tx.paymentMethod}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-100">
                      ₹{tx.amountInr.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 font-sans">
                      {tx.signatureVerified ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>HMAC Verified</span>
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-500">Unverified</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-sans">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                          tx.status === 'captured'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : tx.status === 'refunded'
                            ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                            : tx.status === 'partially_refunded'
                            ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                            : tx.status === 'failed'
                            ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        }`}
                      >
                        {tx.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-sans space-x-1">
                      <button
                        onClick={() => setSelectedTx(tx)}
                        className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-all border border-blue-500/20"
                      >
                        Inspect
                      </button>
                      {(tx.status === 'captured' || tx.status === 'partially_refunded') && (
                        <button
                          onClick={() => handleOpenRefundModal(tx)}
                          className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-all border border-rose-500/20"
                        >
                          Refund
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: MARKETPLACE SETTLEMENTS */}
      {activeTab === 'settlements' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-slate-900 border border-slate-800 rounded-2xl">
            <div>
              <h2 className="text-sm font-bold text-slate-100">Farmer Settlement Eligibility Engine</h2>
              <p className="text-xs text-slate-400">
                Settlements are marked &lsquo;eligible&rsquo; only after order reaches terminal &lsquo;delivered&rsquo; status.
              </p>
            </div>
            <button
              onClick={handleAdvanceEligibility}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-all shadow-md shadow-emerald-500/20"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Evaluate Delivered Orders</span>
            </button>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4 font-semibold">Settlement ID</th>
                  <th className="py-3 px-4 font-semibold">Produce Order</th>
                  <th className="py-3 px-4 font-semibold">Fulfillment Farm</th>
                  <th className="py-3 px-4 font-semibold">Gross (₹)</th>
                  <th className="py-3 px-4 font-semibold">Commission</th>
                  <th className="py-3 px-4 font-semibold">Net Payable (₹)</th>
                  <th className="py-3 px-4 font-semibold">Settlement Status</th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {settlements.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-100">{s.id}</td>
                    <td className="py-3.5 px-4 text-blue-400 font-semibold">{s.orderId}</td>
                    <td className="py-3.5 px-4 font-sans text-slate-200">{s.sellerName}</td>
                    <td className="py-3.5 px-4 font-bold">₹{s.orderGrossInr}</td>
                    <td className="py-3.5 px-4 text-rose-400 font-bold">
                      -₹{s.commissionAmountInr} ({s.commissionRatePercent}%)
                    </td>
                    <td className="py-3.5 px-4 text-emerald-400 font-bold text-sm">
                      ₹{s.netPayableInr.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 font-sans">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                          s.status === 'settled'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : s.status === 'eligible'
                            ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                            : s.status === 'adjusted'
                            ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        }`}
                      >
                        {s.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-sans">
                      {s.status === 'eligible' || s.status === 'unsettled' ? (
                        <button
                          onClick={() => {
                            setSelectedSettlement(s);
                            setUtrReference(`NEFT-${Date.now()}`);
                          }}
                          className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20"
                        >
                          Disburse Payout
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-500 font-mono">
                          {s.utrReference || 'Settled'}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: GATEWAY CONFIGURATION & ARCHITECTURE */}
      {activeTab === 'config' && (
        <div className="space-y-6">
          {/* Provider Overview Card */}
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl">
                  <Building className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-100">
                    Active Gateway: {config.provider === 'razorpay' ? 'Razorpay Route (Marketplace)' : config.provider}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">
                    Environment: <span className="uppercase text-amber-400 font-bold">{config.environment}</span> • Status:{' '}
                    <span className="uppercase text-emerald-400 font-bold">{config.status}</span>
                  </p>
                </div>
              </div>
              <span className="text-[10px] uppercase font-mono font-bold px-2 py-1 rounded bg-slate-950 text-slate-400 border border-slate-800">
                TENANT SCOPED
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-mono">Public Client API Key</span>
                <p className="font-mono text-slate-200 font-semibold">{config.keyId || 'Not Configured'}</p>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-mono">API Secret Reference</span>
                <p className="font-mono text-slate-200 font-semibold">{config.maskedSecret}</p>
                <p className="text-[10px] text-slate-500">Vaulted in Secret Manager; never exposed to browser</p>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-mono">Signed Webhook URL</span>
                <p className="font-mono text-slate-300 truncate">{config.webhookUrl}</p>
                <p className="text-[10px] text-emerald-400">HMAC-SHA256 signature verification enabled</p>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-mono">Marketplace Split Model</span>
                <p className="font-mono text-blue-400 font-bold uppercase">{config.splitSettlementModel}</p>
                <p className="text-[10px] text-slate-500">RBI Nodal/Escrow marketplace compliance</p>
              </div>
            </div>
          </div>

          {/* Candidate Provider Evaluations */}
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-slate-200">Payment Gateway Vendor Evaluation Matrix</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {PROVIDER_EVALUATIONS.map((evalNote) => (
                <div
                  key={evalNote.provider}
                  className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-3 shadow-lg"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-sm text-slate-100">{evalNote.name}</h3>
                      <p className="text-[11px] text-slate-400">{evalNote.regulatoryStatus}</p>
                    </div>
                    <span className="text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      {evalNote.marketplaceCapability}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">{evalNote.recommendationNote}</p>

                  <div className="pt-2 border-t border-slate-800">
                    <span className="text-[10px] text-slate-500 font-semibold uppercase">Prerequisites:</span>
                    <ul className="text-[11px] text-slate-400 list-disc list-inside mt-1 space-y-0.5">
                      {evalNote.onboardingRequirements.map((req, i) => (
                        <li key={i}>{req}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: REFUNDS */}
      {activeTab === 'refunds' && (
        <div className="space-y-4">
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
            <h2 className="text-sm font-bold text-slate-100">Dispute & Refund Journal</h2>
            <p className="text-xs text-slate-400">
              Audit log of all full and partial refunds issued across marketplace orders with commission clawbacks.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4 font-semibold">Refund ID</th>
                  <th className="py-3 px-4 font-semibold">Order ID</th>
                  <th className="py-3 px-4 font-semibold">Customer</th>
                  <th className="py-3 px-4 font-semibold">Refund Amount</th>
                  <th className="py-3 px-4 font-semibold">Commission Reversed</th>
                  <th className="py-3 px-4 font-semibold">Authorized By</th>
                  <th className="py-3 px-4 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {transactions
                  .flatMap((t) => t.refunds.map((r) => ({ ...r, orderId: t.orderId, customerName: t.customerName })))
                  .map((ref) => (
                    <tr key={ref.refundId} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 font-bold text-purple-400">{ref.refundId}</td>
                      <td className="py-3 px-4 text-blue-400">{ref.orderId}</td>
                      <td className="py-3 px-4 font-sans text-slate-200">{ref.customerName}</td>
                      <td className="py-3 px-4 font-bold text-slate-100">₹{ref.amountInr}</td>
                      <td className="py-3 px-4 text-rose-400">-₹{ref.commissionReversedInr}</td>
                      <td className="py-3 px-4 font-sans text-slate-300">{ref.initiatedByName}</td>
                      <td className="py-3 px-4 text-slate-500 text-[11px]">
                        {new Date(ref.createdAt).toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Transaction Inspection Modal */}
      {selectedTx && !isRefundModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="flex items-start justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-base font-bold font-mono text-slate-100">{selectedTx.id}</span>
                <p className="text-xs text-slate-400">Order: {selectedTx.orderId}</p>
              </div>
              <button onClick={() => setSelectedTx(null)} className="p-1.5 text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase font-mono">Amount</span>
                <p className="text-base font-bold text-emerald-400 font-mono">₹{selectedTx.amountInr}</p>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase font-mono">Status</span>
                <p className="font-bold uppercase text-slate-200 font-mono">{selectedTx.status}</p>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase font-mono">Provider Payment ID</span>
                <p className="font-mono text-slate-300 text-[11px]">{selectedTx.providerPaymentId || 'Pending'}</p>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase font-mono">Idempotency Key</span>
                <p className="font-mono text-slate-300 text-[11px] truncate">{selectedTx.idempotencyKey}</p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setSelectedTx(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Authorized Refund Modal with Confirmation Step */}
      {isRefundModalOpen && selectedTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-base font-bold text-slate-100">Authorize Refund</h2>
              <button onClick={() => setIsRefundModalOpen(false)} className="p-1.5 text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleProcessRefund} className="space-y-4">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Refund Amount in INR (₹)</label>
                <input
                  type="number"
                  step="1"
                  required
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 font-mono font-bold text-sm focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Audit Reason</label>
                <input
                  type="text"
                  required
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl space-y-2">
                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    id="confirmRefund"
                    checked={refundConfirmChecked}
                    onChange={(e) => setRefundConfirmChecked(e.target.checked)}
                    className="mt-0.5 rounded border-slate-700 bg-slate-950"
                  />
                  <label htmlFor="confirmRefund" className="text-[11px] text-rose-300 font-medium">
                    I confirm this financial reversal. The customer will be credited via provider webhook, and the seller&apos;s settlement ledger will be adjusted proportionally.
                  </label>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsRefundModalOpen(false)}
                  className="px-3 py-1.5 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!refundConfirmChecked || isProcessingRefund}
                  className="px-4 py-2 font-bold text-slate-950 bg-rose-400 hover:bg-rose-300 disabled:opacity-50 rounded-xl transition-all shadow-md shadow-rose-500/20"
                >
                  {isProcessingRefund ? 'Executing Reversal...' : 'Authorize Refund'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Disburse Settlement Modal */}
      {selectedSettlement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-base font-bold text-slate-100">Disburse Farmer Payout</h2>
              <button onClick={() => setSelectedSettlement(null)} className="p-1.5 text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
              <p className="font-semibold text-slate-200">{selectedSettlement.sellerName}</p>
              <p className="font-mono text-emerald-400 font-bold text-base">
                Net Payable: ₹{selectedSettlement.netPayableInr.toLocaleString('en-IN')}
              </p>
              <p className="text-[11px] text-slate-500 font-mono">
                A/C: {selectedSettlement.bankDetailsSnapshot.accountNumber} ({selectedSettlement.bankDetailsSnapshot.ifscCode})
              </p>
            </div>

            <form onSubmit={handleProcessSettlement} className="space-y-4">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">
                  Bank UTR / IMPS / Gateway Transfer Reference
                </label>
                <input
                  type="text"
                  required
                  value={utrReference}
                  onChange={(e) => setUtrReference(e.target.value)}
                  placeholder="e.g. CMS20261025HDFC990011"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 font-mono font-bold focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedSettlement(null)}
                  className="px-3 py-1.5 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-all shadow-md shadow-emerald-500/20"
                >
                  Confirm Payout Journal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
