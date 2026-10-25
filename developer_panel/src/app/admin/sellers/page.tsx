'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { operationsService } from '../../../lib/operationsService';
import { SellerRecord, SellerApplicationStatus } from '../../../types/operations';
import {
  Users,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  ShieldAlert,
  FileText,
  Building,
  RefreshCw,
  Eye,
  X,
  Lock,
  Percent,
  Check,
} from 'lucide-react';

export default function AdminSellersPage() {
  const { tenantId, user } = useAuth();
  const [sellers, setSellers] = useState<SellerRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedSeller, setSelectedSeller] = useState<SellerRecord | null>(null);

  // Review Modal state
  const [commissionRate, setCommissionRate] = useState('8.0');
  const [rejectionReason, setRejectionReason] = useState('');

  const refreshSellers = () => {
    const list = operationsService.getSellers(tenantId);
    setSellers(list);
    if (selectedSeller) {
      const updated = list.find((s) => s.id === selectedSeller.id);
      if (updated) setSelectedSeller(updated);
    }
  };

  useEffect(() => {
    refreshSellers();
  }, [tenantId]);

  const handleReviewAction = (status: SellerApplicationStatus) => {
    if (!selectedSeller) return;
    const rate = parseFloat(commissionRate);

    operationsService.reviewSellerApplication(
      selectedSeller.id,
      status,
      user?.displayName || 'Vikramaditya Rao (Hub Admin)',
      rate,
      status === 'rejected' || status === 'suspended' ? rejectionReason : undefined
    );

    refreshSellers();
    setSelectedSeller(null);
  };

  const filteredSellers = sellers.filter((s) => {
    const matchesSearch =
      s.farmName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.fssaiNumber.includes(searchQuery) ||
      s.city.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: SellerApplicationStatus) => {
    switch (status) {
      case 'submitted':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'under_review':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'approved':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'rejected':
        return 'bg-slate-800 text-slate-400 border-slate-700';
      case 'suspended':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight">
            Seller & Farm Verification Management
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Audit partner poultry farms, verify biosecurity compliance, set commissions, and approve onboarding.
          </p>
        </div>
        <button
          onClick={refreshSellers}
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
            placeholder="Search farm name, owner, FSSAI number, or city..."
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
          <option value="all">All Sellers ({sellers.length})</option>
          <option value="submitted">Submitted</option>
          <option value="under_review">Under Review</option>
          <option value="approved">Approved</option>
          <option value="suspended">Suspended</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Sellers Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3 px-4 font-semibold">Farm & Owner</th>
                <th className="py-3 px-4 font-semibold">Location</th>
                <th className="py-3 px-4 font-semibold">FSSAI License</th>
                <th className="py-3 px-4 font-semibold">Flock Capacity</th>
                <th className="py-3 px-4 font-semibold">Commission</th>
                <th className="py-3 px-4 font-semibold">KYC Docs</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredSellers.map((seller) => (
                <tr key={seller.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-100">{seller.farmName}</div>
                    <div className="text-[11px] text-slate-400">
                      {seller.name} • <span className="font-mono text-slate-500">{seller.contactPhone}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-slate-200">{seller.city}</span>,{' '}
                    <span className="text-slate-400">{seller.state}</span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-300">{seller.fssaiNumber}</td>
                  <td className="py-3.5 px-4 font-mono text-slate-200">
                    {seller.farmCapacityBirds.toLocaleString('en-IN')} birds
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-blue-400">
                    {seller.commissionRatePercent}%
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-[11px] font-semibold text-slate-300">
                      {seller.documents.length} attached
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${getStatusBadge(
                        seller.status
                      )}`}
                    >
                      {seller.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => {
                        setSelectedSeller(seller);
                        setCommissionRate(seller.commissionRatePercent.toString());
                        setRejectionReason(seller.rejectionReason || '');
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border border-blue-500/20 transition-all"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Review KYC</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Seller Review & KYC Inspection Modal */}
      {selectedSeller && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl my-8 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
            <div className="flex items-start justify-between pb-4 border-b border-slate-800">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-slate-100">{selectedSeller.farmName}</h2>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${getStatusBadge(
                      selectedSeller.status
                    )}`}
                  >
                    {selectedSeller.status.replace(/_/g, ' ')}
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Application ID: <span className="font-mono">{selectedSeller.id}</span> • Applied{' '}
                  {new Date(selectedSeller.appliedAt).toLocaleDateString('en-IN')}
                </p>
              </div>
              <button
                onClick={() => setSelectedSeller(null)}
                className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Farm & Statutory Details */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-mono">Owner / Manager</span>
                <p className="font-semibold text-slate-200">{selectedSeller.name}</p>
                <p className="text-slate-400">{selectedSeller.contactEmail}</p>
                <p className="text-slate-400 font-mono">{selectedSeller.contactPhone}</p>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-mono">Flock Facility</span>
                <p className="font-semibold text-slate-200">
                  {selectedSeller.farmCapacityBirds.toLocaleString('en-IN')} Birds Capacity
                </p>
                <p className="text-slate-400">FSSAI: {selectedSeller.fssaiNumber}</p>
                <p className="text-slate-400">
                  {selectedSeller.city}, {selectedSeller.state} ({selectedSeller.pincode})
                </p>
              </div>
            </div>

            {/* Bank Payout Credentials */}
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-1">
              <span className="text-[10px] text-slate-500 uppercase font-mono">Settlement Account</span>
              <div className="flex flex-wrap items-center justify-between text-slate-300">
                <span>Beneficiary: {selectedSeller.bankDetails.beneficiaryName}</span>
                <span className="font-mono">A/C: {selectedSeller.bankDetails.accountNumber}</span>
                <span className="font-mono">IFSC: {selectedSeller.bankDetails.ifscCode}</span>
                <span>Bank: {selectedSeller.bankDetails.bankName}</span>
              </div>
            </div>

            {/* KYC Documents Preview */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-300">Uploaded Veterinary & Biosecurity Passports</span>
              <div className="space-y-2">
                {selectedSeller.documents.length === 0 ? (
                  <p className="text-xs text-slate-500 italic p-3 bg-slate-950 rounded-xl border border-slate-800">
                    No documents uploaded yet.
                  </p>
                ) : (
                  selectedSeller.documents.map((doc, i) => (
                    <div
                      key={i}
                      className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <FileText className="w-4 h-4 text-blue-400" />
                        <div>
                          <p className="font-semibold text-slate-200">{doc.name}</p>
                          <p className="text-[10px] text-slate-500 font-mono uppercase">{doc.type}</p>
                        </div>
                      </div>
                      <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        <span>Verified Digital Hash</span>
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Review Decision Controls */}
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200">Compliance & Entitlement Decision</span>
                <div className="flex items-center gap-2 text-xs">
                  <label className="text-slate-400 font-semibold">Commission Rate (%):</label>
                  <input
                    type="number"
                    step="0.5"
                    value={commissionRate}
                    onChange={(e) => setCommissionRate(e.target.value)}
                    className="w-20 px-2 py-1 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 font-mono font-bold text-right"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 font-semibold mb-1">
                  Rejection / Suspension Audit Reason (if applicable)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Inadequate avian influenza quarantine distance..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500"
                />
              </div>

              <div className="pt-2 flex flex-wrap items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => handleReviewAction('rejected')}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 rounded-xl"
                >
                  Reject Application
                </button>
                <button
                  type="button"
                  onClick={() => handleReviewAction('suspended')}
                  className="px-3 py-1.5 text-xs font-semibold text-rose-400 hover:bg-rose-500/10 border border-rose-500/20 rounded-xl"
                >
                  Suspend Seller
                </button>
                <button
                  type="button"
                  onClick={() => handleReviewAction('approved')}
                  className="px-5 py-1.5 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-all shadow-md shadow-emerald-500/20"
                >
                  Approve & Activate Farm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
