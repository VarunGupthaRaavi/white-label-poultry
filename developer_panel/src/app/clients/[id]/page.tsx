'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { tenantService } from '../../../lib/tenantService';
import {
  TenantRecord,
  TenantBranding,
  TenantEntitlements,
  DeploymentMetadata,
  TenantLifecycleState,
} from '../../../types';
import { LifecycleBadge } from '../../../components/LifecycleBadge';
import { ConfirmationModal } from '../../../components/ConfirmationModal';
import { BrandingEditor } from '../../../components/BrandingEditor';
import { EntitlementMatrix } from '../../../components/EntitlementMatrix';
import { DeploymentChecklist } from '../../../components/DeploymentChecklist';
import {
  Building2,
  ArrowLeft,
  Palette,
  ShieldCheck,
  Server,
  PlayCircle,
  PauseCircle,
  XCircle,
  Globe,
  Mail,
  Phone,
  Info,
  Calendar,
  Layers,
} from 'lucide-react';

export default function TenantDetailPage() {
  const params = useParams();
  const router = useRouter();
  const tenantId = params.id as string;

  const [tenant, setTenant] = useState<TenantRecord | null>(null);
  const [branding, setBranding] = useState<TenantBranding | null>(null);
  const [entitlements, setEntitlements] = useState<TenantEntitlements | null>(null);
  const [deployment, setDeployment] = useState<DeploymentMetadata | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'branding' | 'entitlements' | 'deployment'>('overview');
  const [isLoading, setIsLoading] = useState(true);

  // Modal state
  const [nextState, setNextState] = useState<TenantLifecycleState | null>(null);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [t, b, e, d] = await Promise.all([
        tenantService.getTenant(tenantId),
        tenantService.getBranding(tenantId),
        tenantService.getEntitlements(tenantId),
        tenantService.getDeployment(tenantId),
      ]);
      setTenant(t);
      setBranding(b);
      setEntitlements(e);
      setDeployment(d);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [tenantId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 rounded-full border-2 border-brand-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!tenant) {
    return (
      <div className="p-8 bg-slate-900 border border-slate-800 rounded-3xl text-center max-w-md mx-auto space-y-4">
        <h3 className="text-lg font-bold text-slate-100">Tenant Not Found</h3>
        <p className="text-xs text-slate-400">
          No tenant was found matching identifier "{tenantId}".
        </p>
        <Link
          href="/clients"
          className="inline-block px-4 py-2 text-xs font-semibold rounded-xl bg-slate-800 text-slate-200"
        >
          Return to Directory
        </Link>
      </div>
    );
  }

  const handleConfirmStateChange = async (reason?: string) => {
    if (!nextState) return;
    try {
      await tenantService.updateLifecycle(tenant.id, nextState, reason);
      await loadData();
    } finally {
      setNextState(null);
    }
  };

  const handleSaveBranding = async (updated: Partial<TenantBranding>) => {
    await tenantService.updateBranding(tenant.id, updated);
    await loadData();
  };

  const handleSaveEntitlements = async (modules: Record<string, { state: any; reason?: string }>) => {
    await tenantService.updateEntitlements(tenant.id, modules);
    await loadData();
  };

  const handleUpdateChecklist = async (key: keyof DeploymentMetadata['provisioningChecklist'], status: boolean) => {
    await tenantService.updateDeploymentChecklist(tenant.id, key, status);
    await loadData();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top back navigation */}
      <div>
        <Link
          href="/clients"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Tenant Directory</span>
        </Link>
      </div>

      {/* Tenant Header Banner */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-4 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-black text-slate-100 tracking-tight">
                {tenant.name}
              </h1>
              <LifecycleBadge state={tenant.lifecycleState} />
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 font-mono">
              <span className="text-slate-300 font-semibold">id: {tenant.id}</span>
              <span>•</span>
              <span className="capitalize text-brand-400 font-sans font-semibold">Tier: {tenant.tier}</span>
              <span>•</span>
              <span>GCP Project: {tenant.firebaseProjectId}</span>
            </div>
          </div>

          {/* Lifecycle Action Buttons */}
          <div className="flex items-center gap-2">
            {tenant.lifecycleState !== 'active' && tenant.lifecycleState !== 'terminated' && (
              <button
                onClick={() => setNextState('active')}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-all shadow-md shadow-emerald-500/20"
              >
                <PlayCircle className="w-4 h-4" />
                <span>Activate Client</span>
              </button>
            )}

            {tenant.lifecycleState === 'active' && (
              <button
                onClick={() => setNextState('suspended')}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-xl transition-all shadow-md shadow-rose-600/20"
              >
                <PauseCircle className="w-4 h-4" />
                <span>Suspend Client</span>
              </button>
            )}

            {tenant.lifecycleState !== 'terminated' && (
              <button
                onClick={() => setNextState('terminated')}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-400 hover:text-rose-400 bg-slate-800/80 hover:bg-rose-950/40 rounded-xl transition-colors border border-slate-700/60"
              >
                <XCircle className="w-4 h-4" />
                <span>Terminate</span>
              </button>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 pt-4 border-t border-slate-800 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
              activeTab === 'overview'
                ? 'bg-slate-800 text-slate-100 border border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Overview & Details</span>
          </button>

          <button
            onClick={() => setActiveTab('branding')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
              activeTab === 'branding'
                ? 'bg-slate-800 text-brand-400 border border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>Branding & Terminology</span>
          </button>

          <button
            onClick={() => setActiveTab('entitlements')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
              activeTab === 'entitlements'
                ? 'bg-slate-800 text-amber-400 border border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Feature Entitlements</span>
          </button>

          <button
            onClick={() => setActiveTab('deployment')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
              activeTab === 'deployment'
                ? 'bg-slate-800 text-blue-400 border border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Server className="w-4 h-4" />
            <span>Deployment Checklist</span>
          </button>
        </div>
      </div>

      {/* Tab Panels */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-4">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Info className="w-4 h-4 text-brand-400" />
              <span>Commercial Registration Details</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between py-2 border-b border-slate-800/80">
                <span className="text-slate-400">Business Name</span>
                <span className="font-semibold text-slate-100">{tenant.name}</span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-slate-800/80">
                <span className="text-slate-400">Tenant Identifier</span>
                <span className="font-mono text-slate-200">{tenant.id}</span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-slate-800/80">
                <span className="text-slate-400">Vertical</span>
                <span className="font-mono text-emerald-400">{tenant.businessVertical}</span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-slate-800/80">
                <span className="text-slate-400">Contact Email</span>
                <span className="font-mono text-slate-300 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-500" />
                  {tenant.contactEmail}
                </span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-slate-800/80">
                <span className="text-slate-400">Contact Phone</span>
                <span className="font-mono text-slate-300 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                  {tenant.contactPhone}
                </span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-slate-800/80">
                <span className="text-slate-400">Custom Domain</span>
                <span className="font-mono text-slate-300 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-slate-500" />
                  {tenant.customDomain || 'None configured'}
                </span>
              </div>
            </div>
          </div>

          <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-4">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Server className="w-4 h-4 text-amber-400" />
              <span>Infrastructure & Data Plane Scoping</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between py-2 border-b border-slate-800/80">
                <span className="text-slate-400">Deployment Isolation</span>
                <span className="font-mono font-bold text-slate-200">
                  {tenant.deploymentMode === 'dedicated_project' ? 'Dedicated GCP Project' : 'Logical Namespace'}
                </span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-slate-800/80">
                <span className="text-slate-400">Firebase Data Project</span>
                <span className="font-mono text-brand-400">{tenant.firebaseProjectId}</span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-slate-800/80">
                <span className="text-slate-400">Schema Version</span>
                <span className="font-mono text-slate-200">v{tenant.version}</span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-slate-800/80">
                <span className="text-slate-400">Created At</span>
                <span className="font-mono text-slate-400">
                  {new Date(tenant.createdAt).toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-slate-800/80">
                <span className="text-slate-400">Last Configuration Update</span>
                <span className="font-mono text-slate-400">
                  {new Date(tenant.updatedAt).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'branding' && branding && (
        <BrandingEditor initialBranding={branding} onSave={handleSaveBranding} />
      )}

      {activeTab === 'entitlements' && entitlements && (
        <EntitlementMatrix initialEntitlements={entitlements} onSave={handleSaveEntitlements} />
      )}

      {activeTab === 'deployment' && deployment && (
        <DeploymentChecklist deployment={deployment} onUpdateChecklist={handleUpdateChecklist} />
      )}

      {/* Confirmation Modal */}
      {nextState && (
        <ConfirmationModal
          isOpen={true}
          title={`Transition "${tenant.name}" to ${nextState.toUpperCase()}`}
          message={
            nextState === 'suspended'
              ? 'Suspending this tenant will halt customer order submissions, seller inventory edits, and API mutations. This is recorded in the platform audit log.'
              : nextState === 'terminated'
              ? 'Terminating this tenant will permanently revoke client access. This action requires authorization approval.'
              : `Confirm state transition from ${tenant.lifecycleState} to ${nextState}.`
          }
          confirmLabel={`Confirm ${nextState.toUpperCase()}`}
          isDestructive={nextState === 'suspended' || nextState === 'terminated'}
          requireReason={true}
          onConfirm={handleConfirmStateChange}
          onCancel={() => setNextState(null)}
        />
      )}
    </div>
  );
}
