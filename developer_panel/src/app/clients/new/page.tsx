'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { tenantService } from '../../../lib/tenantService';
import { TenantTier } from '../../../types';
import {
  Building2,
  ArrowLeft,
  Check,
  RefreshCw,
  Server,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';

export default function OnboardClientPage() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [id, setId] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [tier, setTier] = useState<TenantTier>('growth');
  const [firebaseProjectId, setFirebaseProjectId] = useState('');
  const [customDomain, setCustomDomain] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-generate slug and default Firebase project ID from business name
  const handleNameChange = (val: string) => {
    setName(val);
    const slug = val
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');
    setId(slug);
    setFirebaseProjectId(slug ? `client-${slug}` : '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
      if (!slugRegex.test(id) || id.length < 3 || id.length > 32) {
        throw new Error(
          'Tenant ID must be 3-32 characters of lowercase alphanumeric characters and hyphens.'
        );
      }

      await tenantService.createTenant({
        id,
        name,
        contactEmail,
        contactPhone,
        tier,
        firebaseProjectId: firebaseProjectId || `client-${id}`,
        customDomain: customDomain ? customDomain.trim() : undefined,
      });

      router.push(`/clients/${id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to onboard tenant.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      {/* Back button */}
      <div>
        <Link
          href="/clients"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Tenant Directory</span>
        </Link>
      </div>

      <div className="pb-2 border-b border-slate-800">
        <h1 className="text-2xl font-black tracking-tight text-slate-100 flex items-center gap-2">
          <Building2 className="w-6 h-6 text-brand-400" />
          <span>Onboard New White-Label Client</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Registers the commercial entity in the Control Plane and initializes default branding, poultry terminology, and entitlement vectors.
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-400 text-xs font-semibold">
          <ShieldAlert className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Business Info */}
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Business Entity Information</span>
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Legal Business / Marketplace Name <span className="text-brand-400">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Greenfield Valley Poultry Hatcheries"
                required
                className="w-full px-3.5 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Tenant Identifier Slug <span className="text-brand-400">*</span>
                </label>
                <input
                  type="text"
                  value={id}
                  onChange={(e) => setId(e.target.value.toLowerCase())}
                  placeholder="e.g. greenfield-poultry"
                  required
                  className="w-full px-3.5 py-2 text-xs font-mono bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
                <span className="block text-[10px] text-slate-500 mt-1">
                  Immutable identifier used in routing, config resolution, and scoping.
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Subscription Tier <span className="text-brand-400">*</span>
                </label>
                <select
                  value={tier}
                  onChange={(e) => setTier(e.target.value as TenantTier)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="starter">Starter (Standard Poultry Marketplace)</option>
                  <option value="growth">Growth (Includes Logistics & Discounts)</option>
                  <option value="enterprise">Enterprise (Unlimited Sellers, Custom SLA)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Primary Contact Email <span className="text-brand-400">*</span>
                </label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="operations@greenfieldpoultry.com"
                  required
                  className="w-full px-3.5 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Support Phone Number <span className="text-brand-400">*</span>
                </label>
                <input
                  type="tel"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="+1-555-0199"
                  required
                  className="w-full px-3.5 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Cloud & Infrastructure Scoping */}
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Server className="w-4 h-4 text-brand-400" />
            <span>Dedicated Cloud Environment (Tenant Data Plane)</span>
          </h3>
          <p className="text-xs text-slate-400">
            In accordance with platform tenant isolation architecture, production clients run in dedicated GCP/Firebase projects.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Target Firebase Project ID
              </label>
              <input
                type="text"
                value={firebaseProjectId}
                onChange={(e) => setFirebaseProjectId(e.target.value)}
                placeholder="client-greenfield-poultry"
                className="w-full px-3.5 py-2 text-xs font-mono bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Optional Custom Domain
              </label>
              <input
                type="text"
                value={customDomain}
                onChange={(e) => setCustomDomain(e.target.value)}
                placeholder="market.greenfieldpoultry.com"
                className="w-full px-3.5 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link
            href="/clients"
            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-slate-950 bg-brand-400 hover:bg-brand-300 rounded-xl transition-all shadow-md shadow-brand-500/20 disabled:opacity-50"
          >
            {isSubmitting ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Check className="w-4 h-4" />
            )}
            <span>Provision Client Tenant</span>
          </button>
        </div>
      </form>
    </div>
  );
}
