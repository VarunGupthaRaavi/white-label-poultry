'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { operationsService } from '../../../lib/operationsService';
import { tenantService } from '../../../lib/tenantService';
import { ReviewRecord } from '../../../types/operations';
import {
  MessageSquare,
  Star,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Lock,
  Sparkles,
} from 'lucide-react';

export default function AdminReviewsPage() {
  const { tenantId } = useAuth();
  const [reviews, setReviews] = useState<ReviewRecord[]>([]);
  const [isEnabled, setIsEnabled] = useState(true);
  const [isRequested, setIsRequested] = useState(false);

  const refreshData = async () => {
    const ent = await tenantService.getEntitlements(tenantId);
    const mod = ent?.modules?.['reviews_and_ratings'];
    const enabled = mod ? mod.state === 'enabled' : false;
    setIsEnabled(enabled);

    const reqs = operationsService.getModuleRequests(tenantId);
    setIsRequested(reqs.some((r) => r.moduleKey === 'reviews_and_ratings'));

    if (enabled) {
      setReviews(operationsService.getReviews(tenantId));
    }
  };

  useEffect(() => {
    refreshData();
  }, [tenantId]);

  const handleModerate = (id: string, status: 'published' | 'flagged' | 'rejected') => {
    operationsService.moderateReview(id, status);
    setReviews(operationsService.getReviews(tenantId));
  };

  const handleRequestEntitlement = () => {
    operationsService.requestModuleEntitlement(
      tenantId,
      'reviews_and_ratings',
      'Client admin requested customer reviews and ratings moderation activation'
    );
    setIsRequested(true);
    alert('Entitlement request submitted to Developer Control Plane.');
  };

  if (!isEnabled) {
    return (
      <div className="space-y-6">
        <div className="pb-4 border-b border-slate-800">
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight">Review Moderation</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Customer product feedback and farm rating moderation.
          </p>
        </div>

        <div className="p-8 bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl mx-auto text-center space-y-4 shadow-xl">
          <div className="p-4 bg-amber-500/10 text-amber-400 rounded-2xl w-fit mx-auto border border-amber-500/20">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-bold text-slate-100">
            Module Not Entitled: `reviews_and_ratings`
          </h2>
          <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
            Customer reviews and ratings moderation is not enabled for tenant{' '}
            <span className="font-mono text-slate-200">{tenantId}</span>.
          </p>

          <div className="pt-2">
            {isRequested ? (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 text-amber-400 rounded-xl text-xs font-semibold">
                <CheckCircle className="w-4 h-4" />
                <span>Entitlement Request Pending Developer Review</span>
              </div>
            ) : (
              <button
                onClick={handleRequestEntitlement}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl shadow-md transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>Request Module from Developer Control Plane</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-800">
        <h1 className="text-2xl font-bold text-slate-100 tracking-tight">Review Moderation Queue</h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Moderate verified customer feedback, flag inappropriate content, and publish authentic ratings.
        </p>
      </div>

      <div className="space-y-3">
        {reviews.map((r) => (
          <div
            key={r.id}
            className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-3 shadow-lg"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-slate-100">{r.customerName}</span>
                  <span className="text-xs text-slate-400">on</span>
                  <span className="text-xs font-semibold text-blue-400">{r.productTitle}</span>
                </div>
                <div className="flex items-center gap-1 mt-1 text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < r.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-700'
                      }`}
                    />
                  ))}
                  <span className="text-xs font-mono font-bold text-slate-300 ml-1.5">{r.rating}/5</span>
                </div>
              </div>

              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                  r.status === 'published'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    : r.status === 'flagged'
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                }`}
              >
                {r.status}
              </span>
            </div>

            <p className="text-xs text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800">
              &ldquo;{r.comment}&rdquo;
            </p>

            <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800">
              <span className="text-slate-500 font-mono text-[11px]">
                {new Date(r.createdAt).toLocaleString('en-IN')}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleModerate(r.id, 'published')}
                  className="px-3 py-1 text-xs font-semibold text-emerald-400 hover:bg-emerald-500/10 border border-emerald-500/20 rounded-lg transition-all"
                >
                  Publish
                </button>
                <button
                  onClick={() => handleModerate(r.id, 'flagged')}
                  className="px-3 py-1 text-xs font-semibold text-amber-400 hover:bg-amber-500/10 border border-amber-500/20 rounded-lg transition-all"
                >
                  Flag
                </button>
                <button
                  onClick={() => handleModerate(r.id, 'rejected')}
                  className="px-3 py-1 text-xs font-semibold text-rose-400 hover:bg-rose-500/10 border border-rose-500/20 rounded-lg transition-all"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
