'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { operationsService } from '../../../lib/operationsService';
import { StaffAccountRecord } from '../../../types/operations';
import { UserCheck, Plus, ShieldCheck, Mail, X } from 'lucide-react';

export default function AdminStaffPage() {
  const { tenantId } = useAuth();
  const [staff, setStaff] = useState<StaffAccountRecord[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'client_admin' | 'operations_manager' | 'catalog_moderator' | 'dispatch_officer'>('operations_manager');

  const refreshStaff = () => {
    setStaff(operationsService.getStaff(tenantId));
  };

  useEffect(() => {
    refreshStaff();
  }, [tenantId]);

  const handleCreateStaff = (e: React.FormEvent) => {
    e.preventDefault();
    operationsService.createStaffAccount({
      tenantId,
      name,
      email,
      role,
      status: 'active',
    });
    setName('');
    setEmail('');
    setIsModalOpen(false);
    refreshStaff();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight">Staff Accounts & Role Assignment</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage granular operational permissions for tenant dispatch officers, catalog moderators, and managers.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-950 bg-blue-400 hover:bg-blue-300 rounded-xl transition-all shadow-md shadow-blue-500/20"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Staff Member</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {staff.map((s) => (
          <div key={s.id} className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-3 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="p-2.5 bg-blue-500/10 text-blue-400 rounded-xl">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {s.status}
              </span>
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-100">{s.name}</h3>
              <p className="text-xs text-slate-400 font-mono mt-0.5">{s.email}</p>
            </div>
            <div className="pt-2 border-t border-slate-800">
              <span className="text-[10px] uppercase font-mono text-slate-500">Assigned RBAC Role</span>
              <p className="text-xs font-semibold text-blue-400 uppercase font-mono">
                {s.role.replace(/_/g, ' ')}
              </p>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-base font-bold text-slate-100">Provision Staff Account</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateStaff} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ramesh Patel"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. ramesh.ops@tenant.in"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Operational Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none"
                >
                  <option value="operations_manager">Operations Manager</option>
                  <option value="catalog_moderator">Catalog Moderator</option>
                  <option value="dispatch_officer">Dispatch Officer</option>
                  <option value="client_admin">Client Administrator</option>
                </select>
              </div>
              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold text-slate-950 bg-blue-400 hover:bg-blue-300 rounded-xl"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
