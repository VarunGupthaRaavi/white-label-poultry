'use client';

import React from 'react';
import {
  HeartPulse,
  Server,
  ShieldCheck,
  Database,
  Cloud,
  CheckCircle2,
  Cpu,
  Clock,
  Layers,
  Activity,
} from 'lucide-react';

export default function PlatformHealthPage() {
  const subsystems = [
    {
      name: 'Control Plane Firestore Instance',
      description: 'Authoritative registry for tenants, entitlements, branding, and audit ledgers',
      status: 'HEALTHY',
      latency: '24ms',
      icon: Database,
    },
    {
      name: 'Firebase Cloud Functions (Node 20+)',
      description: 'Serverless backend handlers for custom claim minting, tenant creation, and state transitions',
      status: 'HEALTHY',
      latency: '45ms',
      icon: Cpu,
    },
    {
      name: 'Firebase Authentication Gateway',
      description: 'Identity provider, custom JWT claim issuance, and session token revocation',
      status: 'HEALTHY',
      latency: '31ms',
      icon: ShieldCheck,
    },
    {
      name: 'Cloud Storage Bucket Scopes',
      description: 'Media plane object store for poultry farm product photos, certificates, and logos',
      status: 'HEALTHY',
      latency: '58ms',
      icon: Cloud,
    },
    {
      name: 'Security Rules Engine (RBAC)',
      description: 'Firestore and Cloud Storage declarative authorization & tenant isolation rules',
      status: 'ENFORCING',
      latency: '< 1ms',
      icon: ShieldCheck,
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="pb-2 border-b border-slate-800">
        <h1 className="text-2xl font-black tracking-tight text-slate-100 flex items-center gap-2">
          <HeartPulse className="w-6 h-6 text-emerald-400" />
          <span>Platform Health & Operational Telemetry</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Real-time status of Control Plane services, database clusters, authorization engines, and multi-tenant routing.
        </p>
      </div>

      {/* Global Status Banner */}
      <div className="p-6 bg-gradient-to-r from-emerald-950/40 to-slate-900 border border-emerald-800/60 rounded-3xl flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="relative flex w-3 h-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full w-3 h-3 bg-emerald-500"></span>
            </span>
            <h2 className="text-sm font-bold text-emerald-300">
              All Platform Subsystems Operational
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Control Plane SLA: 99.98% uptime across all regional endpoints.
          </p>
        </div>

        <div className="text-right">
          <span className="block text-[10px] uppercase font-mono text-slate-500">Global Response</span>
          <span className="text-lg font-black text-emerald-400 font-mono">32ms avg</span>
        </div>
      </div>

      {/* Subsystem Cards */}
      <div className="space-y-3">
        {subsystems.map((sub) => {
          const Icon = sub.icon;
          return (
            <div
              key={sub.name}
              className="p-5 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-slate-950 border border-slate-800 text-brand-400 rounded-xl">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-100">{sub.name}</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">{sub.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-6 text-xs">
                <div>
                  <span className="block text-[10px] text-slate-500 font-mono">Latency</span>
                  <span className="font-mono text-slate-200 font-semibold">{sub.latency}</span>
                </div>

                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{sub.status}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Deployment & Environment Architecture Specs */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-4">
        <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
          <Layers className="w-4 h-4 text-amber-400" />
          <span>Active Architecture Environment Specifications</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-1">
            <span className="block text-[10px] text-slate-500 uppercase font-mono">Isolation Model</span>
            <span className="font-bold text-slate-100">Project-Per-Tenant</span>
            <p className="text-[11px] text-slate-400 mt-1">Dedicated GCP project for each client Data Plane.</p>
          </div>

          <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-1">
            <span className="block text-[10px] text-slate-500 uppercase font-mono">Functions Runtime</span>
            <span className="font-bold text-slate-100">Node.js 20+ (TypeScript)</span>
            <p className="text-[11px] text-slate-400 mt-1">Managed Cloud Run v2 container execution.</p>
          </div>

          <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-1">
            <span className="block text-[10px] text-slate-500 uppercase font-mono">Device Attestation</span>
            <span className="font-bold text-slate-100">Firebase App Check</span>
            <p className="text-[11px] text-slate-400 mt-1">Play Integrity & DeviceCheck attestation tokens.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
