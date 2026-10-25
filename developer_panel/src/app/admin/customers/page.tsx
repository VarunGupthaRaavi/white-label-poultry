'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { operationsService } from '../../../lib/operationsService';
import { CustomerRecord } from '../../../types/operations';
import { Users, Search, ShoppingBag, IndianRupee, ShieldCheck } from 'lucide-react';

export default function AdminCustomersPage() {
  const { tenantId } = useAuth();
  const [customers, setCustomers] = useState<CustomerRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setCustomers(operationsService.getCustomers(tenantId));
  }, [tenantId]);

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery)
  );

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-800">
        <h1 className="text-2xl font-bold text-slate-100 tracking-tight">Customer Registry</h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Privacy-isolated customer directory for tenant <span className="font-mono text-slate-200">{tenantId}</span>.
        </p>
      </div>

      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search by customer name, phone, or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
        />
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950/80 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
            <tr>
              <th className="py-3 px-4 font-semibold">Customer</th>
              <th className="py-3 px-4 font-semibold">Contact</th>
              <th className="py-3 px-4 font-semibold">City</th>
              <th className="py-3 px-4 font-semibold">Total Orders</th>
              <th className="py-3 px-4 font-semibold">Total Spend (₹ INR)</th>
              <th className="py-3 px-4 font-semibold">Registered</th>
              <th className="py-3 px-4 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filtered.map((c) => (
              <tr key={c.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="py-3.5 px-4 font-semibold text-slate-100">{c.name}</td>
                <td className="py-3.5 px-4 font-mono text-slate-400">
                  <div>{c.email}</div>
                  <div className="text-[11px] text-slate-500">{c.phone}</div>
                </td>
                <td className="py-3.5 px-4 text-slate-300">{c.city}</td>
                <td className="py-3.5 px-4 font-mono font-bold text-slate-200">{c.totalOrders}</td>
                <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">
                  ₹{c.totalSpend.toLocaleString('en-IN')}
                </td>
                <td className="py-3.5 px-4 font-mono text-slate-400 text-[11px]">
                  {new Date(c.registeredAt).toLocaleDateString('en-IN')}
                </td>
                <td className="py-3.5 px-4">
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {c.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
