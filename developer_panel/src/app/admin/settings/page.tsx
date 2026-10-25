'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { operationsService } from '../../../lib/operationsService';
import { TenantOperationalSettings } from '../../../types/operations';
import { Settings, Save, Check, IndianRupee, Clock, ShieldCheck } from 'lucide-react';

export default function AdminSettingsPage() {
  const { tenantId } = useAuth();
  const [settings, setSettings] = useState<TenantOperationalSettings>(() =>
    operationsService.getSettings(tenantId)
  );
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setSettings(operationsService.getSettings(tenantId));
  }, [tenantId]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    operationsService.updateSettings(tenantId, settings);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="pb-4 border-b border-slate-800">
        <h1 className="text-2xl font-bold text-slate-100 tracking-tight">Tenant Operational Settings</h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Configure business rules, delivery fees, order thresholds in Indian Rupees (₹), and biosecurity intervals.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* Section 1: Order & Delivery Thresholds */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4 shadow-xl">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-100">
            <IndianRupee className="w-4 h-4 text-emerald-400" />
            <span>Produce Checkout & Delivery Thresholds</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">
                Minimum Order Value (₹ INR)
              </label>
              <input
                type="number"
                required
                value={settings.minOrderAmount}
                onChange={(e) =>
                  setSettings({ ...settings, minOrderAmount: parseInt(e.target.value, 10) })
                }
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 font-mono font-bold focus:outline-none focus:border-blue-500"
              />
              <p className="text-[10px] text-slate-500 mt-1">Orders below this will be rejected at checkout</p>
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">
                Free Delivery Threshold (₹ INR)
              </label>
              <input
                type="number"
                required
                value={settings.freeDeliveryThreshold}
                onChange={(e) =>
                  setSettings({ ...settings, freeDeliveryThreshold: parseInt(e.target.value, 10) })
                }
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 font-mono font-bold focus:outline-none focus:border-blue-500"
              />
              <p className="text-[10px] text-slate-500 mt-1">Orders above this receive zero delivery charge</p>
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">
                Standard Delivery Fee (₹ INR)
              </label>
              <input
                type="number"
                required
                value={settings.standardDeliveryFee}
                onChange={(e) =>
                  setSettings({ ...settings, standardDeliveryFee: parseInt(e.target.value, 10) })
                }
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 font-mono font-bold focus:outline-none focus:border-blue-500"
              />
              <p className="text-[10px] text-slate-500 mt-1">Standard cold-chain delivery cost</p>
            </div>
          </div>
        </div>

        {/* Section 2: Fulfillment & Compliance Timing */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4 shadow-xl">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-100">
            <Clock className="w-4 h-4 text-blue-400" />
            <span>Fulfillment Timing & Biosecurity Compliance</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">
                Cancellation Grace Window (Minutes)
              </label>
              <input
                type="number"
                required
                value={settings.orderCancellationTimeoutMins}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    orderCancellationTimeoutMins: parseInt(e.target.value, 10),
                  })
                }
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 font-mono font-bold focus:outline-none focus:border-blue-500"
              />
              <p className="text-[10px] text-slate-500 mt-1">Customers can cancel before packaging begins</p>
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">
                Biosecurity Audit Interval (Days)
              </label>
              <input
                type="number"
                required
                value={settings.biosecurityAuditIntervalDays}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    biosecurityAuditIntervalDays: parseInt(e.target.value, 10),
                  })
                }
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 font-mono font-bold focus:outline-none focus:border-blue-500"
              />
              <p className="text-[10px] text-slate-500 mt-1">Mandatory farm inspection frequency</p>
            </div>
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Operating Hours</label>
            <input
              type="text"
              required
              value={settings.operatingHours}
              onChange={(e) => setSettings({ ...settings, operatingHours: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          {isSaved && (
            <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
              <Check className="w-4 h-4" />
              <span>Operational settings saved successfully!</span>
            </span>
          )}
          <button
            type="submit"
            className="flex items-center gap-1.5 px-6 py-2.5 text-xs font-bold text-slate-950 bg-blue-400 hover:bg-blue-300 rounded-xl transition-all shadow-md shadow-blue-500/20"
          >
            <Save className="w-4 h-4" />
            <span>Save Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
}
