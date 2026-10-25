'use client';

import React, { useState } from 'react';
import { TenantEntitlements, EntitlementState } from '../types';
import { STANDARD_MODULE_KEYS } from '../lib/mockData';
import { Check, ShieldCheck, ShieldAlert, Sparkles, RefreshCw, Info } from 'lucide-react';

interface Props {
  initialEntitlements: TenantEntitlements;
  onSave: (modules: Record<string, { state: EntitlementState; reason?: string }>) => Promise<void>;
}

export function EntitlementMatrix({ initialEntitlements, onSave }: Props) {
  const [modules, setModules] = useState(initialEntitlements.modules);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStateChange = (key: string, state: EntitlementState) => {
    setModules((prev) => ({
      ...prev,
      [key]: {
        ...(prev[key] || {}),
        state,
        updatedAt: new Date().toISOString(),
      },
    }));
  };

  const applyPreset = (preset: 'starter' | 'growth' | 'enterprise') => {
    const updated = { ...modules };
    STANDARD_MODULE_KEYS.forEach((m) => {
      let state: EntitlementState = 'disabled';
      if (preset === 'starter') {
        if (['customer_catalogue', 'seller_management', 'inventory_management', 'order_processing', 'push_notifications', 'reviews_and_ratings'].includes(m.key)) {
          state = 'enabled';
        }
      } else if (preset === 'growth') {
        if (!['advanced_reporting', 'marketplace_commissions', 'seller_settlements', 'recurring_subscriptions', 'payment_integrations'].includes(m.key)) {
          state = 'enabled';
        }
      } else if (preset === 'enterprise') {
        if (m.key !== 'payment_integrations') {
          state = 'enabled';
        }
      }
      updated[m.key] = {
        ...(updated[m.key] || {}),
        state,
        updatedAt: new Date().toISOString(),
        reason: `Applied ${preset.toUpperCase()} preset`,
      };
    });
    setModules(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSavedSuccess(false);

    try {
      await onSave(modules);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to update feature entitlements.');
    } finally {
      setIsSaving(false);
    }
  };

  const stateColors: Record<EntitlementState, { bg: string; text: string }> = {
    enabled: { bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', text: 'Enabled' },
    disabled: { bg: 'bg-slate-800 text-slate-400 border-slate-700', text: 'Disabled' },
    requested: { bg: 'bg-blue-500/10 text-blue-400 border-blue-500/20', text: 'Requested' },
    approved: { bg: 'bg-amber-500/10 text-amber-400 border-amber-500/20', text: 'Approved' },
    suspended: { bg: 'bg-rose-500/10 text-rose-400 border-rose-500/20', text: 'Suspended' },
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Security Callout */}
      <div className="flex items-start gap-3 p-4 bg-blue-950/40 border border-blue-800/60 rounded-2xl text-xs text-blue-200">
        <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-blue-100">
            Defense-in-Depth Entitlement Policy
          </p>
          <p className="text-blue-300/90 leading-relaxed">
            Feature entitlements control module visibility in the customer mobile and web applications.
            In accordance with platform security standards, feature flags are NOT treated as security controls.
            Firestore Security Rules and Cloud Functions enforce tenant privilege boundaries independently.
          </p>
        </div>
      </div>

      {/* Preset Buttons */}
      <div className="flex items-center justify-between p-4 bg-slate-900 border border-slate-800 rounded-2xl">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Tier Presets
          </h4>
          <p className="text-[11px] text-slate-400">
            Quickly align entitlements with contractual client subscription tier.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => applyPreset('starter')}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
          >
            Starter Tier
          </button>
          <button
            type="button"
            onClick={() => applyPreset('growth')}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
          >
            Growth Tier
          </button>
          <button
            type="button"
            onClick={() => applyPreset('enterprise')}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-brand-500/20 border border-brand-500/40 hover:bg-brand-500/30 text-brand-300 transition-colors"
          >
            Enterprise Tier
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs font-semibold">
          {error}
        </div>
      )}

      {savedSuccess && (
        <div className="flex items-center gap-2 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-semibold">
          <Check className="w-4 h-4" />
          <span>Entitlement matrix version {initialEntitlements.version + 1} synchronized to Control Plane!</span>
        </div>
      )}

      {/* Modules Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Platform Capabilities Matrix ({STANDARD_MODULE_KEYS.length} Modules)
          </span>
          <span className="text-xs text-slate-400 font-mono">
            Revision v{initialEntitlements.version}
          </span>
        </div>

        <div className="divide-y divide-slate-800/80">
          {STANDARD_MODULE_KEYS.map((item) => {
            const current = modules[item.key] || { state: 'disabled' as EntitlementState };
            return (
              <div
                key={item.key}
                className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-850/40 transition-colors"
              >
                <div className="space-y-1 max-w-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-100">{item.name}</span>
                    <span className="text-[10px] font-mono text-slate-500">[{item.key}]</span>
                  </div>
                  <p className="text-[11px] text-slate-400">{item.description}</p>
                  {current.reason && (
                    <p className="text-[10px] text-slate-500 italic">
                      Audit note: {current.reason}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <select
                    value={current.state}
                    onChange={(e) => handleStateChange(item.key, e.target.value as EntitlementState)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg border focus:outline-none focus:ring-2 focus:ring-brand-500 ${
                      stateColors[current.state]?.bg || 'bg-slate-950 text-slate-300 border-slate-800'
                    }`}
                  >
                    <option value="enabled" className="bg-slate-900 text-emerald-400">
                      Enabled
                    </option>
                    <option value="disabled" className="bg-slate-900 text-slate-400">
                      Disabled
                    </option>
                    <option value="requested" className="bg-slate-900 text-blue-400">
                      Requested
                    </option>
                    <option value="approved" className="bg-slate-900 text-amber-400">
                      Approved
                    </option>
                    <option value="suspended" className="bg-slate-900 text-rose-400">
                      Suspended
                    </option>
                  </select>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="submit"
          disabled={isSaving}
          className="flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-slate-950 bg-brand-400 hover:bg-brand-300 rounded-xl transition-all shadow-md shadow-brand-500/20 disabled:opacity-50"
        >
          {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
          <span>Commit Entitlement Revision</span>
        </button>
      </div>
    </form>
  );
}
