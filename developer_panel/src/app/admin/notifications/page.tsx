'use client';

import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Bell, Send, CheckCircle, Users, Tractor, Smartphone } from 'lucide-react';

export default function AdminNotificationsPage() {
  const { tenantId } = useAuth();
  const [targetAudience, setTargetAudience] = useState<'all' | 'customers' | 'sellers'>('all');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [broadcastLog, setBroadcastLog] = useState([
    {
      id: 'ntf_01',
      title: 'Fresh Kadaknath Batch Arrived at Hub',
      message: 'Limited stock of live Kadaknath chicken now available for pre-booking.',
      target: 'customers',
      sentAt: '2026-10-24 10:30 AM',
    },
    {
      id: 'ntf_02',
      title: 'Mandatory Avian Biosecurity Audit Reminder',
      message: 'All partner farms must submit updated veterinary passes before October 31st.',
      target: 'sellers',
      sentAt: '2026-10-22 09:00 AM',
    },
  ]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    setBroadcastLog([
      {
        id: `ntf_${Date.now()}`,
        title,
        message,
        target: targetAudience,
        sentAt: 'Just now',
      },
      ...broadcastLog,
    ]);
    setTitle('');
    setMessage('');
    alert('Push notification broadcast queued for distribution.');
  };

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-800">
        <h1 className="text-2xl font-bold text-slate-100 tracking-tight">Notification & Alert Broadcasts</h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Send push broadcasts and operational notices to Flutter mobile app users and farmer portals.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Compose Form */}
        <div className="md:col-span-1 p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4 shadow-xl">
          <h2 className="text-sm font-bold text-slate-200">Broadcast Notice</h2>
          <form onSubmit={handleSend} className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Target Audience</label>
              <select
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none"
              >
                <option value="all">All Stakeholders (Customers + Sellers)</option>
                <option value="customers">Customers (Flutter Mobile Client)</option>
                <option value="sellers">Sellers (Farmer Portals)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Notification Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Weekend Poultry Harvest Flash Sale"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Message Body</label>
              <textarea
                rows={3}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Message payload for notification pop-up..."
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 text-xs font-bold text-slate-950 bg-blue-400 hover:bg-blue-300 rounded-xl transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Broadcast Alert</span>
            </button>
          </form>
        </div>

        {/* History Stream */}
        <div className="md:col-span-2 space-y-3">
          <h2 className="text-sm font-bold text-slate-200">Broadcast History</h2>
          <div className="space-y-3">
            {broadcastLog.map((b) => (
              <div
                key={b.id}
                className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-2 shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-100">{b.title}</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      {b.target}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-mono">{b.sentAt}</span>
                </div>
                <p className="text-xs text-slate-300">{b.message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
