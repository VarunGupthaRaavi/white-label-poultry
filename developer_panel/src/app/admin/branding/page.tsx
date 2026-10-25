'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { tenantService } from '../../../lib/tenantService';
import { TenantBranding, TenantRecord } from '../../../types';
import { Palette, Lock, ShieldCheck, Check, Save, Store, Sparkles } from 'lucide-react';

export default function AdminBrandingPage() {
  const { tenantId } = useAuth();
  const [tenant, setTenant] = useState<TenantRecord | null>(null);
  const [branding, setBranding] = useState<TenantBranding | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  // Form fields
  const [appName, setAppName] = useState('');
  const [tagline, setTagline] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#2563EB');
  const [accentColor, setAccentColor] = useState('#F59E0B');
  const [supportEmail, setSupportEmail] = useState('');
  const [supportPhone, setSupportPhone] = useState('');

  useEffect(() => {
    async function load() {
      const t = await tenantService.getTenant(tenantId);
      setTenant(t);
      const b = await tenantService.getBranding(tenantId);
      if (b) {
        setBranding(b);
        setAppName(b.displayName);
        setTagline((b as any).tagline || '');
        setLogoUrl(b.logoUrl || '');
        setPrimaryColor(b.colors.primary);
        setAccentColor(b.colors.secondary);
        setSupportEmail(b.supportEmail);
        setSupportPhone(b.supportPhone);
      }
    }
    load();
  }, [tenantId]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!branding) return;

    const updated: TenantBranding = {
      ...branding,
      displayName: appName,
      logoUrl,
      colors: {
        ...branding.colors,
        primary: primaryColor,
        secondary: accentColor,
      },
      supportEmail,
      supportPhone,
      updatedAt: new Date().toISOString(),
    };

    await tenantService.updateBranding(tenantId, updated);
    setBranding(updated);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-800">
        <h1 className="text-2xl font-bold text-slate-100 tracking-tight">Business Profile & Branding Settings</h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Configure client brand identity and Flutter theme tokens. Protected tenant identity remains locked by control plane.
        </p>
      </div>

      {/* Cryptographic Boundary Banner */}
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-100 flex items-center gap-2">
              <span>Tenant Identity:</span>
              <span className="font-mono text-blue-400">{tenantId}</span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                LOCKED IDENTITY
              </span>
            </p>
            <p className="text-[11px] text-slate-400">
              Assigned Tier: <span className="text-slate-300 font-semibold uppercase">{tenant?.tier || 'standard'}</span> • Status: <span className="text-emerald-400 font-semibold uppercase">{tenant?.lifecycleState || 'active'}</span>
            </p>
          </div>
        </div>
        <span className="text-[10px] text-slate-500 font-mono hidden sm:block">
          Policy: tenant_admin.cannot_modify_tenant_id()
        </span>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
        {/* Left Column: Business Profile */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4 shadow-xl">
          <h2 className="text-sm font-bold text-slate-200">Business Details</h2>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Marketplace Application Name</label>
            <input
              type="text"
              required
              value={appName}
              onChange={(e) => setAppName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Tagline</label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Logo URL</label>
            <input
              type="text"
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 font-mono text-[11px] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Support Helpline</label>
              <input
                type="text"
                value={supportPhone}
                onChange={(e) => setSupportPhone(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 font-mono focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Support Email</label>
              <input
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 font-mono focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Theme Tokens */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4 shadow-xl">
          <h2 className="text-sm font-bold text-slate-200">Flutter Mobile & Web Colors</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Primary Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-9 h-9 rounded-lg border border-slate-800 bg-transparent cursor-pointer"
                />
                <input
                  type="text"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 font-mono text-[11px]"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Accent Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="w-9 h-9 rounded-lg border border-slate-800 bg-transparent cursor-pointer"
                />
                <input
                  type="text"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 font-mono text-[11px]"
                />
              </div>
            </div>
          </div>

          {/* Theme Preview Card */}
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
            <span className="text-[10px] text-slate-500 uppercase font-mono">Live Mobile Theme Preview</span>
            <div
              className="p-4 rounded-xl flex items-center justify-between text-white"
              style={{ backgroundColor: primaryColor }}
            >
              <div>
                <p className="font-bold text-sm">{appName || 'Poultry App'}</p>
                <p className="text-[10px] opacity-80">{tagline || 'Farm Fresh Produce'}</p>
              </div>
              <button
                type="button"
                className="px-3 py-1 rounded-lg text-xs font-bold text-slate-950"
                style={{ backgroundColor: accentColor }}
              >
                Order
              </button>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3">
            {isSaved && (
              <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                <Check className="w-4 h-4" />
                <span>Branding tokens saved!</span>
              </span>
            )}
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold text-slate-950 bg-blue-400 hover:bg-blue-300 rounded-xl transition-all shadow-md shadow-blue-500/20"
            >
              <Save className="w-4 h-4" />
              <span>Save Branding</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
