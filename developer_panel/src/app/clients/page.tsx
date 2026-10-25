'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { tenantService } from '../../lib/tenantService';
import { TenantRecord, TenantLifecycleState, TenantTier } from '../../types';
import { LifecycleBadge } from '../../components/LifecycleBadge';
import { ConfirmationModal } from '../../components/ConfirmationModal';
import {
  Building2,
  Search,
  Filter,
  Plus,
  ArrowRight,
  MoreVertical,
  SlidersHorizontal,
  CheckCircle,
  PauseCircle,
  PlayCircle,
  XCircle,
} from 'lucide-react';

export default function ClientsPage() {
  const [tenants, setTenants] = useState<TenantRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState<string>('all');
  const [selectedTier, setSelectedTier] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  // Modal state for quick lifecycle changes
  const [targetTenant, setTargetTenant] = useState<TenantRecord | null>(null);
  const [nextState, setNextState] = useState<TenantLifecycleState | null>(null);

  const loadTenants = async () => {
    try {
      setIsLoading(true);
      const data = await tenantService.getTenants();
      setTenants(data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTenants();
  }, []);

  const filteredTenants = tenants.filter((tenant) => {
    const matchesSearch =
      tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tenant.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tenant.contactEmail.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesState = selectedState === 'all' || tenant.lifecycleState === selectedState;
    const matchesTier = selectedTier === 'all' || tenant.tier === selectedTier;

    return matchesSearch && matchesState && matchesTier;
  });

  const handleConfirmStateChange = async (reason?: string) => {
    if (!targetTenant || !nextState) return;
    try {
      await tenantService.updateLifecycle(targetTenant.id, nextState, reason);
      await loadTenants();
    } finally {
      setTargetTenant(null);
      setNextState(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-100 flex items-center gap-2">
            <Building2 className="w-6 h-6 text-brand-400" />
            <span>Commercial Tenants Directory</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage onboarding status, lifecycle transitions, feature sets, and white-label branding.
          </p>
        </div>

        <Link
          href="/clients/new"
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-950 bg-brand-400 hover:bg-brand-300 rounded-xl transition-all shadow-md shadow-brand-500/20 w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Onboard New Client</span>
        </Link>
      </div>

      {/* Search and Filters Bar */}
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col md:flex-row gap-4 justify-between items-center">
        {/* Search Input */}
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by tenant name, ID slug, or email..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="px-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="all">All States</option>
              <option value="active">Active Only</option>
              <option value="provisioning">Provisioning Only</option>
              <option value="draft">Draft Only</option>
              <option value="suspended">Suspended Only</option>
              <option value="terminated">Terminated Only</option>
            </select>
          </div>

          <select
            value={selectedTier}
            onChange={(e) => setSelectedTier(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="all">All Tiers</option>
            <option value="starter">Starter</option>
            <option value="growth">Growth</option>
            <option value="enterprise">Enterprise</option>
          </select>
        </div>
      </div>

      {/* Tenants Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        {filteredTenants.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            No tenants match your search and filter criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="py-3 px-4">Client / Tenant ID</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Tier</th>
                  <th className="py-3 px-4">Firebase Project</th>
                  <th className="py-3 px-4">Updated</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-xs">
                {filteredTenants.map((tenant) => (
                  <tr
                    key={tenant.id}
                    className="hover:bg-slate-850/50 transition-colors group"
                  >
                    <td className="py-3.5 px-4">
                      <Link
                        href={`/clients/${tenant.id}`}
                        className="font-bold text-slate-100 group-hover:text-brand-400 transition-colors block"
                      >
                        {tenant.name}
                      </Link>
                      <span className="text-[11px] font-mono text-slate-500">
                        {tenant.id}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <LifecycleBadge state={tenant.lifecycleState} />
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="capitalize font-semibold text-slate-300">
                        {tenant.tier}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400">
                      {tenant.firebaseProjectId}
                    </td>

                    <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                      {new Date(tenant.updatedAt).toLocaleDateString()}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Quick state triggers */}
                        {tenant.lifecycleState === 'provisioning' && (
                          <button
                            onClick={() => {
                              setTargetTenant(tenant);
                              setNextState('active');
                            }}
                            title="Activate Tenant"
                            className="p-1.5 hover:bg-emerald-500/10 text-emerald-400 rounded-lg transition-colors"
                          >
                            <PlayCircle className="w-4 h-4" />
                          </button>
                        )}

                        {tenant.lifecycleState === 'active' && (
                          <button
                            onClick={() => {
                              setTargetTenant(tenant);
                              setNextState('suspended');
                            }}
                            title="Suspend Tenant"
                            className="p-1.5 hover:bg-rose-500/10 text-rose-400 rounded-lg transition-colors"
                          >
                            <PauseCircle className="w-4 h-4" />
                          </button>
                        )}

                        {tenant.lifecycleState === 'suspended' && (
                          <button
                            onClick={() => {
                              setTargetTenant(tenant);
                              setNextState('active');
                            }}
                            title="Reactivate Tenant"
                            className="p-1.5 hover:bg-emerald-500/10 text-emerald-400 rounded-lg transition-colors"
                          >
                            <PlayCircle className="w-4 h-4" />
                          </button>
                        )}

                        <Link
                          href={`/clients/${tenant.id}`}
                          className="px-3 py-1 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors flex items-center gap-1"
                        >
                          <span>Manage</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {targetTenant && nextState && (
        <ConfirmationModal
          isOpen={true}
          title={`Transition "${targetTenant.name}" to ${nextState.toUpperCase()}`}
          message={
            nextState === 'suspended'
              ? 'Suspending this tenant will immediately pause API mutations, customer checkout, and seller payouts. This action will be recorded in the platform audit trail.'
              : `Confirm state transition from ${targetTenant.lifecycleState} to ${nextState}.`
          }
          confirmLabel={`Confirm ${nextState.toUpperCase()}`}
          isDestructive={nextState === 'suspended' || nextState === 'terminated'}
          requireReason={true}
          onConfirm={handleConfirmStateChange}
          onCancel={() => {
            setTargetTenant(null);
            setNextState(null);
          }}
        />
      )}
    </div>
  );
}
