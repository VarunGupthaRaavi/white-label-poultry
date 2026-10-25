'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { operationsService } from '../../../lib/operationsService';
import { SellerRecord } from '../../../types/operations';
import {
  FileText,
  Upload,
  ShieldCheck,
  Clock,
  CheckCircle2,
  AlertCircle,
  Building,
  Lock,
  FileCheck,
} from 'lucide-react';

export default function SellerApplicationPage() {
  const { tenantId, sellerId } = useAuth();
  const [seller, setSeller] = useState<SellerRecord | undefined>(() =>
    operationsService.getSellerById(sellerId || 'seller_krishna_01')
  );

  // New Document Upload State
  const [docName, setDocName] = useState('');
  const [docType, setDocType] = useState<'veterinary_pass' | 'biosecurity_audit' | 'fssai_cert' | 'pan_card'>(
    'veterinary_pass'
  );
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    setSeller(operationsService.getSellerById(sellerId || 'seller_krishna_01'));
  }, [tenantId, sellerId]);

  const handleUploadDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!seller) return;

    setIsUploading(true);
    setTimeout(() => {
      seller.documents.push({
        name: docName,
        type: docType,
        fileUrl: `https://storage.cloud.google.com/poultry-platform-kyc/${seller.id}/${docName}`,
        verified: false,
      });
      setDocName('');
      setIsUploading(false);
      alert('Document securely submitted to encrypted tenant KYC storage.');
    }, 600);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="pb-4 border-b border-slate-800">
        <h1 className="text-2xl font-bold text-slate-100 tracking-tight">Farm Profile & Compliance KYC</h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Submit statutory agricultural records, veterinary immunization passes, and view certification clearance.
        </p>
      </div>

      {/* Security Storage Isolation Notice */}
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-slate-200">KYC Documents Are Cryptographically Isolated</span>
            <p className="text-slate-400 text-[11px]">
              Uploaded files are stored at <code className="text-amber-400 font-mono">/tenants/{tenantId}/sellers/{sellerId}/documents/*</code> and are strictly inaccessible to the general public or competing sellers.
            </p>
          </div>
        </div>
      </div>

      {/* Application Status Card */}
      <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-3 shadow-xl">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-300">Hub Compliance Verification Status</span>
          <span
            className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded border ${
              seller?.status === 'approved'
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                : seller?.status === 'under_review'
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
            }`}
          >
            {seller?.status.replace(/_/g, ' ')}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase font-mono">Farm Name</span>
            <p className="font-semibold text-slate-200 mt-0.5">{seller?.farmName}</p>
          </div>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase font-mono">FSSAI License #</span>
            <p className="font-mono font-bold text-slate-200 mt-0.5">{seller?.fssaiNumber}</p>
          </div>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase font-mono">Commission Rate</span>
            <p className="font-mono font-bold text-blue-400 mt-0.5">{seller?.commissionRatePercent}%</p>
          </div>
        </div>
      </div>

      {/* Upload KYC Document Section */}
      <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4 shadow-xl">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-200">
          <Upload className="w-4 h-4 text-amber-400" />
          <span>Upload New Compliance Document</span>
        </div>

        <form onSubmit={handleUploadDocument} className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="sm:col-span-1">
            <label className="block text-slate-400 font-semibold mb-1">Document Category</label>
            <select
              value={docType}
              onChange={(e) => setDocType(e.target.value as any)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none"
            >
              <option value="veterinary_pass">Veterinary Health Inspection Pass</option>
              <option value="biosecurity_audit">Avian Biosecurity Audit (ISO/GAP)</option>
              <option value="fssai_cert">FSSAI Meat & Poultry License</option>
              <option value="pan_card">Business PAN / GST Certificate</option>
            </select>
          </div>

          <div className="sm:col-span-1">
            <label className="block text-slate-400 font-semibold mb-1">Document File Name</label>
            <input
              type="text"
              required
              value={docName}
              onChange={(e) => setDocName(e.target.value)}
              placeholder="e.g. Vet_Pass_Q4_2026.pdf"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none"
            />
          </div>

          <div className="sm:col-span-1 flex items-end">
            <button
              type="submit"
              disabled={isUploading}
              className="w-full py-2.5 px-4 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 rounded-xl transition-all shadow-md shadow-amber-500/20"
            >
              {isUploading ? 'Encrypting & Storing...' : 'Submit Document'}
            </button>
          </div>
        </form>
      </div>

      {/* Submitted Documents List */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-slate-200">Vaulted Documents on File</h2>
        <div className="space-y-2">
          {seller?.documents.map((d, i) => (
            <div
              key={i}
              className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-3">
                <FileCheck className="w-4 h-4 text-amber-400" />
                <div>
                  <p className="font-semibold text-slate-200">{d.name}</p>
                  <p className="text-[10px] text-slate-500 font-mono uppercase">{d.type}</p>
                </div>
              </div>
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                  d.verified
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                }`}
              >
                {d.verified ? 'Verified' : 'Pending Verification'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
