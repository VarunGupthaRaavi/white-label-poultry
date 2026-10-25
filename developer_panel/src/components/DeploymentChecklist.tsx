'use client';

import React, { useState } from 'react';
import { DeploymentMetadata } from '../types';
import { CheckCircle2, Circle, Copy, Check, Server, Shield, Globe, Terminal, FileCode } from 'lucide-react';

interface Props {
  deployment: DeploymentMetadata;
  onUpdateChecklist: (key: keyof DeploymentMetadata['provisioningChecklist'], status: boolean) => Promise<void>;
}

export function DeploymentChecklist({ deployment, onUpdateChecklist }: Props) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const checklistItems: {
    key: keyof DeploymentMetadata['provisioningChecklist'];
    title: string;
    description: string;
    icon: any;
  }[] = [
    {
      key: 'gcp_project_created',
      title: 'Dedicated Google Cloud / Firebase Project',
      description: `Project initialized: ${deployment.firebaseProjectId}`,
      icon: Server,
    },
    {
      key: 'firestore_initialized',
      title: 'Cloud Firestore in Native Mode',
      description: 'Native mode instance created in target client region',
      icon: FileCode,
    },
    {
      key: 'auth_providers_configured',
      title: 'Firebase Authentication Methods',
      description: 'Email/Password, Phone OTP, and custom claims token minting enabled',
      icon: Shield,
    },
    {
      key: 'storage_bucket_created',
      title: 'Cloud Storage Bucket Scoped',
      description: `Target bucket: ${deployment.storageBucketUri}`,
      icon: Server,
    },
    {
      key: 'security_rules_deployed',
      title: 'Firestore & Storage Security Rules Deployed',
      description: 'Role-based access control and tenant isolation rules active',
      icon: Shield,
    },
    {
      key: 'app_ids_registered',
      title: 'Native Mobile App IDs Registered',
      description: `Android: ${deployment.androidPackageName} | iOS: ${deployment.iosBundleId}`,
      icon: Terminal,
    },
    {
      key: 'dns_records_verified',
      title: 'Custom Domain & SSL Provisioned',
      description: 'DNS CNAME records and SSL certificates verified',
      icon: Globe,
    },
  ];

  const completedCount = Object.values(deployment.provisioningChecklist).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / checklistItems.length) * 100);

  return (
    <div className="space-y-6">
      {/* Progress Card */}
      <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-slate-100">
              Deployment & Provisioning Readiness
            </h4>
            <p className="text-xs text-slate-400">
              {completedCount} of {checklistItems.length} setup requirements verified
            </p>
          </div>
          <span className="text-lg font-black text-brand-400 font-mono">
            {progressPercent}%
          </span>
        </div>

        <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-brand-500 to-amber-500 transition-all duration-500 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Infrastructure Metadata */}
      <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
          Target Environment Reference Identifiers
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
            <div>
              <span className="block text-[10px] text-slate-500 uppercase font-mono">Firebase Project ID</span>
              <span className="text-slate-200 font-mono font-semibold">{deployment.firebaseProjectId}</span>
            </div>
            <button
              onClick={() => copyToClipboard(deployment.firebaseProjectId, 'proj')}
              className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-slate-200"
            >
              {copiedKey === 'proj' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
            <div>
              <span className="block text-[10px] text-slate-500 uppercase font-mono">Storage Bucket URI</span>
              <span className="text-slate-200 font-mono font-semibold">{deployment.storageBucketUri}</span>
            </div>
            <button
              onClick={() => copyToClipboard(deployment.storageBucketUri, 'bucket')}
              className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-slate-200"
            >
              {copiedKey === 'bucket' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
            <div>
              <span className="block text-[10px] text-slate-500 uppercase font-mono">Android Package Name</span>
              <span className="text-slate-200 font-mono font-semibold">{deployment.androidPackageName}</span>
            </div>
            <button
              onClick={() => copyToClipboard(deployment.androidPackageName, 'android')}
              className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-slate-200"
            >
              {copiedKey === 'android' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
            <div>
              <span className="block text-[10px] text-slate-500 uppercase font-mono">iOS Bundle Identifier</span>
              <span className="text-slate-200 font-mono font-semibold">{deployment.iosBundleId}</span>
            </div>
            <button
              onClick={() => copyToClipboard(deployment.iosBundleId, 'ios')}
              className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-slate-200"
            >
              {copiedKey === 'ios' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Checklist items */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Manual Verification Checklist
          </span>
        </div>

        <div className="divide-y divide-slate-800/80">
          {checklistItems.map((item) => {
            const isChecked = deployment.provisioningChecklist[item.key];
            const Icon = item.icon;

            return (
              <div
                key={item.key}
                onClick={() => onUpdateChecklist(item.key, !isChecked)}
                className="p-4 flex items-center justify-between gap-4 hover:bg-slate-850/50 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-lg ${
                      isChecked
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className={`text-xs font-bold ${isChecked ? 'text-slate-100' : 'text-slate-300'}`}>
                      {item.title}
                    </h5>
                    <p className="text-[11px] text-slate-500 font-mono">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div>
                  {isChecked ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-600 hover:text-slate-400" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
