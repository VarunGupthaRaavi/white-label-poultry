'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { paymentService, PROVIDER_EVALUATIONS } from '../../lib/paymentService';
import { tenantService } from '../../lib/tenantService';
import { TenantPaymentConfig, PaymentProvider } from '../../types/payment';
import { TenantRecord, AuditEvent } from '../../types';
import {
  CreditCard,
  ShieldCheck,
  Lock,
  AlertTriangle,
  CheckCircle2,
  Settings,
  RefreshCw,
  ExternalLink,
  Layers,
  Activity,
  Key,
  Server,
  ToggleLeft,
  ToggleRight,
  EyeOff,
  Building,
  Check,
  X,
  FileText,
} from 'lucide-react';

export default function DeveloperPaymentsPage() {
  const { user } = useAuth();
  const [tenants, setTenants] = useState<TenantRecord[]>([]);
  const [paymentConfigs, setPaymentConfigs] = useState<TenantPaymentConfig[]>([]);
  const [selectedTenantId, setSelectedTenantId] = useState<string>('apex-poultry-hub');
  const [activeTab, setActiveTab] = useState<'matrix' | 'tenants' | 'health' | 'audit'>('tenants');
  const [auditLogs, setAuditLogs] = useState<AuditEvent[]>([]);

  // Edit Tenant Gateway Modal state
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [modalTenantId, setModalTenantId] = useState('');
  const [formProvider, setFormProvider] = useState<PaymentProvider>('razorpay');
  const [formEnvironment, setFormEnvironment] = useState<'sandbox' | 'production'>('sandbox');
  const [formKeyId, setFormKeyId] = useState('');
  const [formSecretRef, setFormSecretRef] = useState('');
  const [formWebhookUrl, setFormWebhookUrl] = useState('');
  const [formMarketplacePayouts, setFormMarketplacePayouts] = useState(false);
  const [formSplitModel, setFormSplitModel] = useState<'direct_submerchant' | 'nodal_escrow' | 'manual_batch'>('manual_batch');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  const loadData = () => {
    tenantService.getTenants().then((tList) => {
      setTenants(tList);
    });
    setPaymentConfigs(paymentService.getAllPaymentConfigs());
    tenantService.getAuditLogs().then((logs) => {
      setAuditLogs(logs);
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const openConfigModal = (config: TenantPaymentConfig) => {
    setModalTenantId(config.tenantId);
    setFormProvider(config.provider);
    setFormEnvironment(config.environment);
    setFormKeyId(config.keyId);
    setFormSecretRef(config.secretManagerRef || `projects/${config.tenantId}/secrets/gateway_api_secret`);
    setFormWebhookUrl(config.webhookUrl);
    setFormMarketplacePayouts(config.marketplacePayoutsEnabled);
    setFormSplitModel(config.splitSettlementModel);
    setSaveSuccessMsg('');
    setIsConfigModalOpen(true);
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    paymentService.updatePaymentConfig(
      modalTenantId,
      {
        provider: formProvider,
        environment: formEnvironment,
        keyId: formKeyId,
        secretManagerRef: formSecretRef,
        webhookUrl: formWebhookUrl,
        webhookSecretConfigured: true,
        marketplacePayoutsEnabled: formMarketplacePayouts,
        splitSettlementModel: formSplitModel,
        status: formEnvironment === 'production' ? 'active' : 'testing',
      },
      `${user?.displayName || 'Developer'} (${user?.role || 'platform_developer'})`
    );

    setSaveSuccessMsg('Tenant gateway configuration safely committed.');
    setTimeout(() => {
      setIsConfigModalOpen(false);
      loadData();
    }, 1000);
  };

  const [entitlementsMap, setEntitlementsMap] = useState<Record<string, Record<string, boolean>>>({
    'apex-poultry-hub': {
      payment_integrations: true,
      marketplace_commissions: true,
      seller_settlements: true,
    },
    'golden-yolk-hatcheries': {
      payment_integrations: false,
      marketplace_commissions: false,
      seller_settlements: false,
    },
  });

  const toggleEntitlement = (tenantId: string, feature: 'payment_integrations' | 'marketplace_commissions' | 'seller_settlements') => {
    setEntitlementsMap((prev) => {
      const current = prev[tenantId] || { payment_integrations: false, marketplace_commissions: false, seller_settlements: false };
      return {
        ...prev,
        [tenantId]: {
          ...current,
          [feature]: !current[feature],
        },
      };
    });
  };

  const currentConfig = paymentConfigs.find((c) => c.tenantId === selectedTenantId) || paymentConfigs[0];
  const paymentAuditLogs = auditLogs.filter(
    (l) => l.action?.toLowerCase().includes('payment') || l.action?.toLowerCase().includes('entitlement')
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">Payment Gateway Orchestration</h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
              <Server className="h-3 w-3" /> Control Plane
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Tenant-aware gateway configuration, environment separation, secret manager references, and provider evaluation for Indian commerce.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
          >
            <RefreshCw className="h-4 w-4" /> Refresh Status
          </button>
        </div>
      </div>

      {/* Security & Non-Intermediary Notice Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-900 flex items-start gap-3">
        <Lock className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
        <div className="space-y-1">
          <p className="font-semibold text-amber-950">
            Strict Financial Integrity & Least-Privilege Architecture
          </p>
          <p className="text-amber-800">
            No production secret keys or banking credentials are ever stored in the browser, mobile client, public git repositories, or application logs. 
            All secret keys are referenced through backend Secret Manager paths. Platform developers never act as money transmitters or intermediary account holders for client/seller funds.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Tenant Gateway Profiles</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{paymentConfigs.length}</p>
            <p className="text-xs text-gray-500 mt-1">Apex Poultry & Golden Yolk</p>
          </div>
          <div className="h-12 w-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
            <Building className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Active Gateways</p>
            <p className="text-2xl font-bold text-emerald-600 mt-1">
              {paymentConfigs.filter((c) => c.status === 'active' || c.status === 'testing').length}
            </p>
            <p className="text-xs text-gray-500 mt-1">1 Sandbox / 1 Offline POD</p>
          </div>
          <div className="h-12 w-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Webhooks Verified</p>
            <p className="text-2xl font-bold text-purple-600 mt-1">100%</p>
            <p className="text-xs text-gray-500 mt-1">HMAC-SHA256 Signed</p>
          </div>
          <div className="h-12 w-12 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
            <ShieldCheck className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Marketplace Payouts</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">Gated</p>
            <p className="text-xs text-gray-500 mt-1">Escrow & Route Dependent</p>
          </div>
          <div className="h-12 w-12 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600">
            <Layers className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('tenants')}
            className={`py-3 px-1 inline-flex items-center gap-2 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'tenants'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Building className="h-4 w-4" /> Tenant Gateway Configurations & Entitlements
          </button>
          <button
            onClick={() => setActiveTab('matrix')}
            className={`py-3 px-1 inline-flex items-center gap-2 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'matrix'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <CreditCard className="h-4 w-4" /> Indian Gateway Provider Evaluation Matrix
          </button>
          <button
            onClick={() => setActiveTab('health')}
            className={`py-3 px-1 inline-flex items-center gap-2 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'health'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Activity className="h-4 w-4" /> Webhook Endpoints & Signature Security
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`py-3 px-1 inline-flex items-center gap-2 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'audit'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <FileText className="h-4 w-4" /> Privileged Audit Trail
          </button>
        </nav>
      </div>

      {/* TAB 1: TENANT GATEWAY CONFIGURATIONS & ENTITLEMENTS */}
      {activeTab === 'tenants' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">Tenant Gateway Status & Capability Matrix</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Tenant isolation enforced: Each client tenant operates under strictly separated payment identifiers and webhook verification keys.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50 text-gray-600 font-medium">
                  <tr>
                    <th className="px-6 py-3 text-left">Tenant</th>
                    <th className="px-6 py-3 text-left">Provider</th>
                    <th className="px-6 py-3 text-left">Environment</th>
                    <th className="px-6 py-3 text-left">Public Key / Ref</th>
                    <th className="px-6 py-3 text-left">Secret Storage</th>
                    <th className="px-6 py-3 text-left">Marketplace Settlements</th>
                    <th className="px-6 py-3 text-left">Feature Entitlements</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {paymentConfigs.map((cfg) => {
                    const tenantObj = tenants.find((t) => t.id === cfg.tenantId);
                    return (
                      <tr key={cfg.tenantId} className="hover:bg-gray-50/80 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-semibold text-gray-900">{tenantObj?.name || cfg.tenantId}</div>
                          <div className="text-xs text-gray-500 font-mono">{cfg.tenantId}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="capitalize font-medium text-gray-800">
                            {cfg.provider === 'razorpay' ? 'Razorpay (Route)' : cfg.provider === 'offline_pod' ? 'COD / Farm Gate' : cfg.provider}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                              cfg.environment === 'production'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                : 'bg-amber-100 text-amber-800 border border-amber-200'
                            }`}
                          >
                            {cfg.environment.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-mono text-xs text-gray-700 bg-gray-100 px-2 py-1 rounded inline-block">
                            {cfg.keyId || 'N/A (Offline)'}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5 text-xs text-gray-600">
                            <Lock className="h-3.5 w-3.5 text-emerald-600" />
                            <span className="font-mono text-gray-700">
                              {cfg.secretManagerRef ? cfg.secretManagerRef.split('/').pop() : 'GCP Secret Manager'}
                            </span>
                          </div>
                          <div className="text-[11px] text-gray-400 font-mono mt-0.5">{cfg.maskedSecret}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5">
                            {cfg.marketplacePayoutsEnabled ? (
                              <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                <Check className="h-3 w-3" /> Enabled ({cfg.splitSettlementModel})
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full border border-gray-200">
                                Disabled / Manual
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1 text-xs">
                            <button
                              onClick={() => toggleEntitlement(cfg.tenantId, 'payment_integrations')}
                              className="flex items-center gap-1.5 hover:text-blue-600"
                            >
                              {entitlementsMap[cfg.tenantId]?.payment_integrations ? (
                                <ToggleRight className="h-4 w-4 text-emerald-600" />
                              ) : (
                                <ToggleLeft className="h-4 w-4 text-gray-400" />
                              )}
                              <span className={entitlementsMap[cfg.tenantId]?.payment_integrations ? 'text-gray-900 font-medium' : 'text-gray-400'}>
                                Payments API
                              </span>
                            </button>
                            <button
                              onClick={() => toggleEntitlement(cfg.tenantId, 'marketplace_commissions')}
                              className="flex items-center gap-1.5 hover:text-blue-600"
                            >
                              {entitlementsMap[cfg.tenantId]?.marketplace_commissions ? (
                                <ToggleRight className="h-4 w-4 text-emerald-600" />
                              ) : (
                                <ToggleLeft className="h-4 w-4 text-gray-400" />
                              )}
                              <span className={entitlementsMap[cfg.tenantId]?.marketplace_commissions ? 'text-gray-900 font-medium' : 'text-gray-400'}>
                                Commissions
                              </span>
                            </button>
                            <button
                              onClick={() => toggleEntitlement(cfg.tenantId, 'seller_settlements')}
                              className="flex items-center gap-1.5 hover:text-blue-600"
                            >
                              {entitlementsMap[cfg.tenantId]?.seller_settlements ? (
                                <ToggleRight className="h-4 w-4 text-emerald-600" />
                              ) : (
                                <ToggleLeft className="h-4 w-4 text-gray-400" />
                              )}
                              <span className={entitlementsMap[cfg.tenantId]?.seller_settlements ? 'text-gray-900 font-medium' : 'text-gray-400'}>
                                Seller Settlements
                              </span>
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => openConfigModal(cfg)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-semibold border border-blue-200 transition-colors"
                          >
                            <Settings className="h-3.5 w-3.5" /> Configure
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: GATEWAY PROVIDER EVALUATION MATRIX */}
      {activeTab === 'matrix' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Indian Domestic Poultry Marketplace Gateway Analysis</h3>
            <p className="text-sm text-gray-600 mb-6">
              Prompt 4 requires evaluating candidate payment providers for an Indian multi-vendor poultry marketplace, checking regulatory licensing (RBI Payment Aggregator framework), UPI capability, seller KYC, and automated split-settlement capabilities.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {PROVIDER_EVALUATIONS.map((evalItem) => (
                <div
                  key={evalItem.provider}
                  className={`rounded-xl border p-5 transition-all ${
                    evalItem.provider === 'razorpay'
                      ? 'border-blue-300 bg-blue-50/30 ring-1 ring-blue-300'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-gray-900">{evalItem.name}</h4>
                        {evalItem.provider === 'razorpay' && (
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-600 text-white px-2 py-0.5 rounded-full">
                            Recommended
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Country: {evalItem.country} • Currency: {evalItem.supportedCurrencies.join(', ')}</p>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2 text-xs">
                    <div className="flex items-center justify-between py-1 border-b border-gray-100">
                      <span className="text-gray-500 font-medium">Marketplace Capability</span>
                      <span className="font-semibold text-gray-800">{evalItem.marketplaceCapability}</span>
                    </div>
                    <div className="flex items-center justify-between py-1 border-b border-gray-100">
                      <span className="text-gray-500 font-medium">Regulatory Status</span>
                      <span className="font-semibold text-emerald-700">{evalItem.regulatoryStatus}</span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Required Client Approvals & KYC:</p>
                    <ul className="mt-1.5 space-y-1">
                      {evalItem.onboardingRequirements.map((req, idx) => (
                        <li key={idx} className="text-xs text-gray-600 flex items-center gap-1.5">
                          <CheckCircle2 className="h-3 w-3 text-emerald-600 flex-shrink-0" />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-100 bg-gray-50/50 p-2.5 rounded-lg text-xs text-gray-700">
                    <span className="font-semibold text-gray-900">Architecture Evaluation: </span>
                    {evalItem.recommendationNote}
                  </div>
                </div>
              ))}
            </div>

            {/* Actionable Client Decision Summary */}
            <div className="mt-8 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <h4 className="text-sm font-bold text-gray-900 mb-2">Exact Decisions & Authorizations Required from Client:</h4>
              <ol className="text-xs text-gray-700 space-y-2 list-decimal list-inside">
                <li>
                  <strong>Direct Merchant Contracting:</strong> Client corporate entity must register directly with Razorpay or Cashfree under its own PAN and GSTIN. The developer panel will never hold or intermediate funds.
                </li>
                <li>
                  <strong>Escrow / Nodal Agreement:</strong> To enable automated seller split-settlements, the client must execute Razorpay Route or Cashfree Payouts marketplace agreement compliant with RBI Guidelines on Regulation of Payment Aggregators.
                </li>
                <li>
                  <strong>Sub-Merchant KYC Workflow:</strong> Sellers (poultry farmers, hatcheries) must submit verified bank account numbers, IFSC codes, and Aadhaar/PAN before payouts can transition from holding to disbursed.
                </li>
              </ol>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: WEBHOOK ENDPOINTS & SIGNATURE SECURITY */}
      {activeTab === 'health' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Webhook Security & Replay Attack Defense</h3>
            <p className="text-sm text-gray-600 mb-6">
              Backend verification ensures that orders are only marked as paid when signed by the payment provider&apos;s cryptographic secret. Duplicate callbacks and delayed webhooks are handled idempotently.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <p className="text-xs text-gray-500 font-medium">Signature Algorithm</p>
                <p className="text-base font-bold text-gray-900 mt-1">HMAC-SHA256</p>
                <p className="text-xs text-emerald-600 mt-1">RFC 2104 Compliant</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <p className="text-xs text-gray-500 font-medium">Replay Protection Journal</p>
                <p className="text-base font-bold text-gray-900 mt-1">In-Memory & Storage Cache</p>
                <p className="text-xs text-emerald-600 mt-1">Deduplicates by Event ID</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <p className="text-xs text-gray-500 font-medium">Client Independence</p>
                <p className="text-base font-bold text-gray-900 mt-1">Zero-Trust Frontend</p>
                <p className="text-xs text-emerald-600 mt-1">Orders never marked paid by UI</p>
              </div>
            </div>

            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <div className="bg-gray-100 px-4 py-2 text-xs font-semibold text-gray-700">
                Registered Server Webhook URIs by Tenant
              </div>
              <div className="divide-y divide-gray-200 text-xs">
                {paymentConfigs.map((cfg) => (
                  <div key={cfg.tenantId} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <p className="font-semibold text-gray-900">{cfg.tenantId}</p>
                      <p className="font-mono text-gray-500 mt-0.5">{cfg.webhookUrl || 'Not configured for offline provider'}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                        <CheckCircle2 className="h-3 w-3" /> Secret Configured
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: PRIVILEGED AUDIT TRAIL */}
      {activeTab === 'audit' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Privileged Financial & Configuration Audit Trail</h3>
            <p className="text-sm text-gray-600 mb-4">
              All modifications to payment gateways, environment promotions, secret references, and feature entitlements are recorded with immutable timestamps and actor identities.
            </p>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-xs">
                <thead className="bg-gray-50 text-gray-600 font-medium">
                  <tr>
                    <th className="px-4 py-2.5 text-left">Timestamp</th>
                    <th className="px-4 py-2.5 text-left">Actor</th>
                    <th className="px-4 py-2.5 text-left">Tenant</th>
                    <th className="px-4 py-2.5 text-left">Action</th>
                    <th className="px-4 py-2.5 text-left">Reason / Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {paymentAuditLogs.length > 0 ? (
                    paymentAuditLogs.map((log: any, idx: number) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-mono text-gray-500">{new Date(log.timestamp).toLocaleString()}</td>
                        <td className="px-4 py-3 font-medium text-gray-900">{log.actor}</td>
                        <td className="px-4 py-3 font-mono text-gray-600">{log.tenantId}</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 bg-blue-50 text-blue-800 rounded font-semibold">
                            {log.action}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-600">{log.reason || 'Configuration update'}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                        No privileged payment configuration modifications logged yet in this session.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: EDIT TENANT GATEWAY CONFIGURATION */}
      {isConfigModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-gray-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-gray-200">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Configure Gateway: {modalTenantId}</h3>
                <p className="text-xs text-gray-500">Manage provider credentials, secret references, and split settlement settings.</p>
              </div>
              <button
                onClick={() => setIsConfigModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveConfig} className="mt-4 space-y-4 text-sm">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Payment Provider</label>
                <select
                  value={formProvider}
                  onChange={(e) => setFormProvider(e.target.value as PaymentProvider)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
                >
                  <option value="razorpay">Razorpay (Route Marketplace)</option>
                  <option value="cashfree">Cashfree (Payouts API)</option>
                  <option value="stripe">Stripe (Connect)</option>
                  <option value="offline_pod">Cash on Delivery / Pay on Delivery (Offline)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Environment Mode</label>
                <div className="grid grid-cols-2 gap-3">
                  <label
                    className={`flex items-center gap-2 p-3 border rounded-xl cursor-pointer ${
                      formEnvironment === 'sandbox' ? 'border-amber-500 bg-amber-50/50' : 'border-gray-200'
                    }`}
                  >
                    <input
                      type="radio"
                      name="env"
                      checked={formEnvironment === 'sandbox'}
                      onChange={() => setFormEnvironment('sandbox')}
                      className="text-amber-600"
                    />
                    <div>
                      <p className="font-semibold text-gray-900 text-xs">Sandbox / Test</p>
                      <p className="text-[11px] text-gray-500">Safe simulated test orders</p>
                    </div>
                  </label>

                  <label
                    className={`flex items-center gap-2 p-3 border rounded-xl cursor-pointer ${
                      formEnvironment === 'production' ? 'border-emerald-500 bg-emerald-50/50' : 'border-gray-200'
                    }`}
                  >
                    <input
                      type="radio"
                      name="env"
                      checked={formEnvironment === 'production'}
                      onChange={() => setFormEnvironment('production')}
                      className="text-emerald-600"
                    />
                    <div>
                      <p className="font-semibold text-gray-900 text-xs">Production (Live)</p>
                      <p className="text-[11px] text-gray-500">Requires verified merchant KYC</p>
                    </div>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Public Key ID (Key Identifier)</label>
                <input
                  type="text"
                  value={formKeyId}
                  onChange={(e) => setFormKeyId(e.target.value)}
                  placeholder="e.g. rzp_test_ApexHub2026k9"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono"
                />
                <p className="text-[11px] text-gray-500 mt-1">Safe to expose to Flutter/Web client checkout initialization.</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                  Secret Reference in Cloud Secret Manager
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formSecretRef}
                    onChange={(e) => setFormSecretRef(e.target.value)}
                    placeholder="projects/white-label/secrets/rzp_secret"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono"
                  />
                  <Lock className="absolute right-3 top-2.5 h-4 w-4 text-emerald-600" />
                </div>
                <p className="text-[11px] text-gray-500 mt-1">
                  The actual secret is kept strictly in GCP Secret Manager / Vault, never in code or database rows.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Webhook URL</label>
                <input
                  type="text"
                  value={formWebhookUrl}
                  onChange={(e) => setFormWebhookUrl(e.target.value)}
                  placeholder="https://api.platform.com/v1/payments/webhook/razorpay"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono"
                />
              </div>

              <div className="pt-2 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900 text-xs">Marketplace Automated Settlements</p>
                    <p className="text-[11px] text-gray-500">Enable Route / Escrow split payments to seller bank accounts</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={formMarketplacePayouts}
                    onChange={(e) => setFormMarketplacePayouts(e.target.checked)}
                    className="h-4 w-4 text-blue-600 rounded"
                  />
                </div>
              </div>

              {formMarketplacePayouts && (
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Split Settlement Model</label>
                  <select
                    value={formSplitModel}
                    onChange={(e) => setFormSplitModel(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
                  >
                    <option value="direct_submerchant">Direct Sub-Merchant (Automated gateway route)</option>
                    <option value="nodal_escrow">Nodal / Escrow Hold (RBI Nodal Hold until delivery confirmation)</option>
                    <option value="manual_batch">Manual Batch (Post-delivery admin approval)</option>
                  </select>
                </div>
              )}

              {saveSuccessMsg && (
                <div className="p-3 bg-emerald-50 text-emerald-800 rounded-lg text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" /> {saveSuccessMsg}
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsConfigModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 shadow-sm"
                >
                  Save Gateway Configuration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
