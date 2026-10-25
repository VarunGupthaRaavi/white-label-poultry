'use client';

import React from 'react';
import { TenantLifecycleState } from '../types';

interface Props {
  state: TenantLifecycleState;
  className?: string;
}

export function LifecycleBadge({ state, className = '' }: Props) {
  const configs: Record<TenantLifecycleState, { bg: string; text: string; dot: string; label: string }> = {
    draft: {
      bg: 'bg-blue-950/60 border-blue-800/60',
      text: 'text-blue-300',
      dot: 'bg-blue-400',
      label: 'Draft',
    },
    provisioning: {
      bg: 'bg-amber-950/60 border-amber-800/60',
      text: 'text-amber-300',
      dot: 'bg-amber-400 animate-pulse',
      label: 'Provisioning',
    },
    active: {
      bg: 'bg-emerald-950/60 border-emerald-800/60',
      text: 'text-emerald-300',
      dot: 'bg-emerald-400',
      label: 'Active',
    },
    suspended: {
      bg: 'bg-rose-950/60 border-rose-800/60',
      text: 'text-rose-300',
      dot: 'bg-rose-400',
      label: 'Suspended',
    },
    terminated: {
      bg: 'bg-gray-900 border-gray-700',
      text: 'text-gray-400',
      dot: 'bg-gray-500',
      label: 'Terminated',
    },
  };

  const config = configs[state] || configs.draft;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${config.bg} ${config.text} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}
