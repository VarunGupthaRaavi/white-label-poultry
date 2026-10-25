'use client';

import React, { useState } from 'react';
import { TenantBranding } from '../types';
import { Check, RefreshCw, Palette, ExternalLink, Sparkles, Smartphone } from 'lucide-react';

interface Props {
  initialBranding: TenantBranding;
  onSave: (branding: Partial<TenantBranding>) => Promise<void>;
}

export function BrandingEditor({ initialBranding, onSave }: Props) {
  const [branding, setBranding] = useState<TenantBranding>(initialBranding);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleColorChange = (key: keyof TenantBranding['colors'], value: string) => {
    setBranding((prev) => ({
      ...prev,
      colors: {
        ...prev.colors,
        [key]: value,
      },
    }));
  };

  const handleTerminologyChange = (key: keyof TenantBranding['terminology'], value: string) => {
    setBranding((prev) => ({
      ...prev,
      terminology: {
        ...prev.terminology,
        [key]: value,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSavedSuccess(false);

    try {
      // Validate hex colors
      const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
      if (!hexRegex.test(branding.colors.primary) || !hexRegex.test(branding.colors.secondary)) {
        throw new Error('Colors must be valid hex values (e.g., #10B981).');
      }

      await onSave(branding);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to save branding.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Editor Form */}
      <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-6">
        {error && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs font-semibold">
            {error}
          </div>
        )}

        {savedSuccess && (
          <div className="flex items-center gap-2 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-semibold">
            <Check className="w-4 h-4" />
            <span>Branding tokens updated and published to mobile config plane!</span>
          </div>
        )}

        {/* Identity & Display */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
          <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Palette className="w-4 h-4 text-brand-400" />
            <span>Visual Identity & Typography</span>
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Display Name (App Title)
              </label>
              <input
                type="text"
                value={branding.displayName}
                onChange={(e) => setBranding({ ...branding, displayName: e.target.value })}
                required
                className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Primary Font Family
              </label>
              <select
                value={branding.typography.fontFamily}
                onChange={(e) =>
                  setBranding({
                    ...branding,
                    typography: { ...branding.typography, fontFamily: e.target.value },
                  })
                }
                className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="Inter">Inter (Clean Modern UI)</option>
                <option value="Poppins">Poppins (Friendly Geometric)</option>
                <option value="Outfit">Outfit (High-End Tech)</option>
                <option value="Roboto">Roboto (Enterprise Standard)</option>
              </select>
            </div>
          </div>

          {/* Color Tokens */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Theme Color Tokens
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <span className="block text-[11px] text-slate-400 mb-1">Primary Accent</span>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={branding.colors.primary}
                    onChange={(e) => handleColorChange('primary', e.target.value)}
                    className="w-8 h-8 rounded border border-slate-700 bg-transparent cursor-pointer"
                  />
                  <input
                    type="text"
                    value={branding.colors.primary}
                    onChange={(e) => handleColorChange('primary', e.target.value)}
                    className="w-full px-2 py-1 text-xs font-mono bg-slate-950 border border-slate-800 rounded text-slate-200"
                  />
                </div>
              </div>

              <div>
                <span className="block text-[11px] text-slate-400 mb-1">Secondary Accent</span>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={branding.colors.secondary}
                    onChange={(e) => handleColorChange('secondary', e.target.value)}
                    className="w-8 h-8 rounded border border-slate-700 bg-transparent cursor-pointer"
                  />
                  <input
                    type="text"
                    value={branding.colors.secondary}
                    onChange={(e) => handleColorChange('secondary', e.target.value)}
                    className="w-full px-2 py-1 text-xs font-mono bg-slate-950 border border-slate-800 rounded text-slate-200"
                  />
                </div>
              </div>

              <div>
                <span className="block text-[11px] text-slate-400 mb-1">Surface Dark</span>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={branding.colors.surface}
                    onChange={(e) => handleColorChange('surface', e.target.value)}
                    className="w-8 h-8 rounded border border-slate-700 bg-transparent cursor-pointer"
                  />
                  <input
                    type="text"
                    value={branding.colors.surface}
                    onChange={(e) => handleColorChange('surface', e.target.value)}
                    className="w-full px-2 py-1 text-xs font-mono bg-slate-950 border border-slate-800 rounded text-slate-200"
                  />
                </div>
              </div>

              <div>
                <span className="block text-[11px] text-slate-400 mb-1">Contrast Text</span>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={branding.colors.textOnPrimary}
                    onChange={(e) => handleColorChange('textOnPrimary', e.target.value)}
                    className="w-8 h-8 rounded border border-slate-700 bg-transparent cursor-pointer"
                  />
                  <input
                    type="text"
                    value={branding.colors.textOnPrimary}
                    onChange={(e) => handleColorChange('textOnPrimary', e.target.value)}
                    className="w-full px-2 py-1 text-xs font-mono bg-slate-950 border border-slate-800 rounded text-slate-200"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Media URLs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Logo Image URL (SVG or High-Res PNG)
              </label>
              <input
                type="url"
                value={branding.logoUrl}
                onChange={(e) => setBranding({ ...branding, logoUrl: e.target.value })}
                required
                className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                App Icon URL (Square 512x512)
              </label>
              <input
                type="url"
                value={branding.iconUrl || ''}
                onChange={(e) => setBranding({ ...branding, iconUrl: e.target.value || null })}
                placeholder="Optional square icon"
                className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>
        </div>

        {/* Vertical Terminology Overrides */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
          <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Poultry Vertical Terminology</span>
          </h4>
          <p className="text-xs text-slate-400">
            Tailor labels across the mobile app and checkout screens to match regional farm jargon.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Unit of Livestock
              </label>
              <input
                type="text"
                value={branding.terminology.itemUnit}
                onChange={(e) => handleTerminologyChange('itemUnit', e.target.value)}
                placeholder="e.g. Bird, Chick, Crate, Flock"
                className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Seller Designation
              </label>
              <input
                type="text"
                value={branding.terminology.sellerLabel}
                onChange={(e) => handleTerminologyChange('sellerLabel', e.target.value)}
                placeholder="e.g. Farmer, Breeder, Hatchery"
                className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Category Section
              </label>
              <input
                type="text"
                value={branding.terminology.categoryLabel}
                onChange={(e) => handleTerminologyChange('categoryLabel', e.target.value)}
                placeholder="e.g. Flock Category, Livestock"
                className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>
        </div>

        {/* Locale & Legal */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
          <h4 className="text-sm font-bold text-slate-100">Regional Locale, Currency & Support</h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Default Currency Code
              </label>
              <select
                value={branding.defaultCurrency}
                onChange={(e) => setBranding({ ...branding, defaultCurrency: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="USD">USD ($)</option>
                <option value="KES">KES (KSh)</option>
                <option value="INR">INR (₹)</option>
                <option value="EUR">EUR (€)</option>
                <option value="NGN">NGN (₦)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Support Email
              </label>
              <input
                type="email"
                value={branding.supportEmail}
                onChange={(e) => setBranding({ ...branding, supportEmail: e.target.value })}
                required
                className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Privacy Policy URL
              </label>
              <input
                type="url"
                value={branding.privacyPolicyUrl}
                onChange={(e) => setBranding({ ...branding, privacyPolicyUrl: e.target.value })}
                required
                className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Terms of Service URL
              </label>
              <input
                type="url"
                value={branding.termsOfServiceUrl}
                onChange={(e) => setBranding({ ...branding, termsOfServiceUrl: e.target.value })}
                required
                className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-slate-950 bg-brand-400 hover:bg-brand-300 rounded-xl transition-all shadow-md shadow-brand-500/20 disabled:opacity-50"
          >
            {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            <span>Save & Distribute Branding</span>
          </button>
        </div>
      </form>

      {/* Live Preview Device Frame */}
      <div className="lg:col-span-5">
        <div className="sticky top-24 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-brand-400" />
              Live Flutter Theme Simulator
            </span>
            <span className="text-[10px] text-slate-500">Real-time Preview</span>
          </div>

          <div
            className="rounded-[2.5rem] p-3 shadow-2xl border-4 border-slate-800 max-w-[340px] mx-auto transition-all"
            style={{ backgroundColor: branding.colors.surface }}
          >
            {/* Phone Screen Mock */}
            <div className="rounded-[2rem] overflow-hidden border border-slate-800 bg-slate-950">
              {/* Status bar */}
              <div className="flex justify-between items-center px-6 pt-3 text-[10px] text-slate-400">
                <span>9:41</span>
                <div className="flex items-center gap-1">
                  <span>5G</span>
                  <div className="w-4 h-2 rounded-sm border border-slate-400" />
                </div>
              </div>

              {/* Dynamic Header */}
              <div
                className="p-5 mt-2 transition-colors"
                style={{
                  background: `linear-gradient(135deg, ${branding.colors.primary} 0%, ${branding.colors.secondary} 100%)`,
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3
                      className="font-black text-sm tracking-tight"
                      style={{ color: branding.colors.textOnPrimary }}
                    >
                      {branding.displayName}
                    </h3>
                    <p className="text-[10px] opacity-90" style={{ color: branding.colors.textOnPrimary }}>
                      Verified {branding.terminology.sellerLabel} Network
                    </p>
                  </div>
                  <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center font-bold text-xs text-white">
                    {branding.displayName.charAt(0)}
                  </div>
                </div>
              </div>

              {/* Mock Content */}
              <div className="p-4 space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-200">
                      Featured {branding.terminology.categoryLabel}
                    </span>
                    <span className="text-[10px]" style={{ color: branding.colors.primary }}>
                      View all
                    </span>
                  </div>

                  {/* Sample Poultry Product Card */}
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                    <div className="h-28 rounded-lg overflow-hidden relative bg-slate-800">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=500&auto=format&fit=crop&q=80"
                        alt="Poultry batch"
                        className="w-full h-full object-cover"
                      />
                      <span
                        className="absolute top-2 right-2 px-2 py-0.5 text-[9px] font-bold rounded-full uppercase"
                        style={{
                          backgroundColor: branding.colors.primary,
                          color: branding.colors.textOnPrimary,
                        }}
                      >
                        Vaccinated
                      </span>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-slate-100">
                        Cobb 500 Broiler Flock
                      </h4>
                      <p className="text-[10px] text-slate-400">
                        Origin: Sunshine Valley Breeder
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <div>
                        <span className="text-xs font-black text-slate-100">
                          {branding.defaultCurrency} 4.50
                        </span>
                        <span className="text-[9px] text-slate-500">
                          {' '}/ {branding.terminology.itemUnit}
                        </span>
                      </div>

                      <button
                        type="button"
                        className="px-2.5 py-1 text-[10px] font-bold rounded-lg transition-transform active:scale-95"
                        style={{
                          backgroundColor: branding.colors.primary,
                          color: branding.colors.textOnPrimary,
                        }}
                      >
                        Reserve
                      </button>
                    </div>
                  </div>
                </div>

                {/* Footer preview */}
                <div className="pt-2 text-center text-[9px] text-slate-500">
                  <span>Support: {branding.supportEmail}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
