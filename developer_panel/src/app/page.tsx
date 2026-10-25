'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { tenantService } from '../lib/tenantService';
import { TenantRecord, AuditEvent } from '../types';
import { LifecycleBadge } from '../components/LifecycleBadge';
import {
  Building2,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  Plus,
  ScrollText,
  Activity,
  Layers,
  ChevronRight,
} from 'lucide-react';

export default function DashboardPage() {
  const [tenants, setTenants] = useState<TenantRecord[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [loadedTenants, loadedLogs] = await Promise.all([
          tenantService.getTenants(),
          tenantService.getAuditLogs(),
        ]);
        setTenants(loadedTenants);
        setAuditLogs(loadedLogs);
      } catch (err) {
        console.error('Failed to load dashboard data', err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const counts = {
    total: tenants.length,
    active: tenants.filter((t) => t.lifecycleState === 'active').length,
    provisioning: tenants.filter((t) => t.lifecycleState === 'provisioning').length,
    draft: tenants.filter((t) => t.lifecycleState === 'draft').length,
    suspended: tenants.filter((t) => t.lifecycleState === 'suspended').length,
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-100">
            Control Plane Overview
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Global multi-tenant directory, infrastructure lifecycle, and poultry commerce deployments.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/clients/new"
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-950 bg-brand-400 hover:bg-brand-300 rounded-xl transition-all shadow-md shadow-brand-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Onboard New Tenant</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Total Clients</span>
            <Building2 className="w-4 h-4 text-slate-500" />
          </div>
          <div className="mt-3 text-2xl font-black text-slate-100 font-mono">
            {counts.total}
          </div>
          <p className="mt-1 text-[11px] text-slate-500">Registered commercial partners</p>
          <div className="absolute top-0 right-0 w-24 h-24 bg-brand-500/5 rounded-full blur-xl pointer-events-none" />
        </div>

        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl relative overflow-hidden">
          <div className="flex items-center justify-between text-emerald-400 text-xs font-medium">
            <span>Active Tenants</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-3 text-2xl font-black text-emerald-400 font-mono">
            {counts.active}
          </div>
          <p className="mt-1 text-[11px] text-slate-500">Live operational marketplaces</p>
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl pointer-events-none" />
        </div>

        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl relative overflow-hidden">
          <div className="flex items-center justify-between text-amber-400 text-xs font-medium">
            <span>Provisioning</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-3 text-2xl font-black text-amber-400 font-mono">
            {counts.provisioning}
          </div>
          <p className="mt-1 text-[11px] text-slate-500">In deployment setup pipeline</p>
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-xl pointer-events-none" />
        </div>

        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl relative overflow-hidden">
          <div className="flex items-center justify-between text-rose-400 text-xs font-medium">
            <span>Suspended</span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="mt-3 text-2xl font-black text-rose-400 font-mono">
            {counts.suspended}
          </div>
          <p className="mt-1 text-[11px] text-slate-500">Access paused / audit hold</p>
          <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-full blur-xl pointer-events-none" />
        </div>
      </div>

      {/* Main Grid: Tenants Table & Recent Audit Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Client Registry Highlights */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Layers className="w-4 h-4 text-brand-400" />
              <span>Active Commercial Tenants</span>
            </h2>
            <Link
              href="/clients"
              className="text-xs font-semibold text-brand-400 hover:text-brand-300 flex items-center gap-1"
            >
              <span>View all clients</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="divide-y divide-slate-800/80">
              {tenants.map((tenant) => (
                <Link
                  key={tenant.id}
                  href={`/clients/${tenant.id}`}
                  className="p-4 flex items-center justify-between hover:bg-slate-850/60 transition-colors group block"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5">
                      <h3 className="text-xs font-bold text-slate-100 group-hover:text-brand-400 transition-colors">
                        {tenant.name}
                      </h3>
                      <LifecycleBadge state={tenant.lifecycleState} />
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono">
                      <span>id: {tenant.id}</span>
                      <span>•</span>
                      <span>tier: {tenant.tier}</span>
                      <span>•</span>
                      <span className="text-slate-500">gcp: {tenant.firebaseProjectId}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-slate-400 group-hover:text-slate-200">
                    <span className="text-[11px] font-medium hidden sm:inline">Configure</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Platform Audit Trail Stream */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <ScrollText className="w-4 h-4 text-amber-400" />
              <span>Recent Platform Audit Events</span>
            </h2>
            <Link
              href="/audit-logs"
              className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1"
            >
              <span>Explorer</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-xl">
            <div className="space-y-3">
              {auditLogs.slice(0, 5).map((log) => (
                <div
                  key={log.id}
                  className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-xl space-y-1.5"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-mono font-bold text-brand-400">
                      {log.action}
                    </span>
                    <span className="text-slate-500 text-[10px]">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 font-medium truncate">
                    {log.tenantId ? `Tenant: ${log.tenantId}` : 'Platform Scope'}
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                    <span>actor: {log.actorEmail.split('@')[0]}</span>
                    <span className="text-emerald-400 font-semibold">{log.outcome}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
