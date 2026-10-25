import {
  TenantRecord,
  TenantBranding,
  TenantEntitlements,
  DeploymentMetadata,
  AuditEvent,
  TenantLifecycleState,
  TenantTier,
} from '../types';
import {
  INITIAL_TENANTS,
  INITIAL_BRANDING,
  INITIAL_ENTITLEMENTS,
  INITIAL_DEPLOYMENTS,
  INITIAL_AUDIT_LOGS,
} from './mockData';

const STORAGE_KEYS = {
  TENANTS: 'poultry_cp_tenants',
  BRANDING: 'poultry_cp_branding',
  ENTITLEMENTS: 'poultry_cp_entitlements',
  DEPLOYMENTS: 'poultry_cp_deployments',
  AUDIT_LOGS: 'poultry_cp_audit_logs',
};

function getStored<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function setStored<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn('Failed to persist to localStorage', err);
  }
}

export const tenantService = {
  async getTenants(): Promise<TenantRecord[]> {
    return getStored<TenantRecord[]>(STORAGE_KEYS.TENANTS, INITIAL_TENANTS);
  },

  async getTenant(id: string): Promise<TenantRecord | null> {
    const tenants = await this.getTenants();
    return tenants.find((t) => t.id === id) || null;
  },

  async getBranding(tenantId: string): Promise<TenantBranding | null> {
    const all = getStored<Record<string, TenantBranding>>(STORAGE_KEYS.BRANDING, INITIAL_BRANDING);
    return all[tenantId] || null;
  },

  async getEntitlements(tenantId: string): Promise<TenantEntitlements | null> {
    const all = getStored<Record<string, TenantEntitlements>>(STORAGE_KEYS.ENTITLEMENTS, INITIAL_ENTITLEMENTS);
    return all[tenantId] || null;
  },

  async getDeployment(tenantId: string): Promise<DeploymentMetadata | null> {
    const all = getStored<Record<string, DeploymentMetadata>>(STORAGE_KEYS.DEPLOYMENTS, INITIAL_DEPLOYMENTS);
    return all[tenantId] || null;
  },

  async getAuditLogs(): Promise<AuditEvent[]> {
    return getStored<AuditEvent[]>(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
  },

  async createTenant(payload: {
    id: string;
    name: string;
    contactEmail: string;
    contactPhone: string;
    tier: TenantTier;
    firebaseProjectId: string;
    customDomain?: string;
  }, actorEmail: string = 'lead.developer@platform.dev'): Promise<TenantRecord> {
    const tenants = await this.getTenants();
    const existing = tenants.find((t) => t.id === payload.id);
    if (existing) {
      throw new Error(`Tenant with identifier "${payload.id}" already exists.`);
    }

    const now = new Date().toISOString();
    const newTenant: TenantRecord = {
      id: payload.id,
      name: payload.name.trim(),
      contactEmail: payload.contactEmail,
      contactPhone: payload.contactPhone,
      lifecycleState: 'draft',
      tier: payload.tier,
      businessVertical: 'poultry_farm',
      deploymentMode: 'dedicated_project',
      firebaseProjectId: payload.firebaseProjectId || `client-${payload.id}`,
      customDomain: payload.customDomain || null,
      createdAt: now,
      updatedAt: now,
      version: 1,
    };

    tenants.unshift(newTenant);
    setStored(STORAGE_KEYS.TENANTS, tenants);

    // Initial branding
    const brandings = getStored<Record<string, TenantBranding>>(STORAGE_KEYS.BRANDING, INITIAL_BRANDING);
    brandings[payload.id] = {
      tenantId: payload.id,
      displayName: payload.name,
      logoUrl: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=300&auto=format&fit=crop&q=80',
      iconUrl: null,
      splashImageUrl: null,
      colors: {
        primary: '#10B981',
        secondary: '#F59E0B',
        surface: '#0F172A',
        textOnPrimary: '#FFFFFF',
      },
      typography: {
        fontFamily: 'Inter',
        headingFont: 'Outfit',
      },
      terminology: {
        itemUnit: 'Bird',
        sellerLabel: 'Farmer / Breeder',
        categoryLabel: 'Flock Category',
      },
      supportEmail: payload.contactEmail,
      supportPhone: payload.contactPhone,
      privacyPolicyUrl: 'https://poultryhub.com/privacy',
      termsOfServiceUrl: 'https://poultryhub.com/terms',
      defaultCurrency: 'USD',
      defaultLocale: 'en_US',
      updatedAt: now,
    };
    setStored(STORAGE_KEYS.BRANDING, brandings);

    // Initial Entitlements
    const entitlements = getStored<Record<string, TenantEntitlements>>(STORAGE_KEYS.ENTITLEMENTS, INITIAL_ENTITLEMENTS);
    entitlements[payload.id] = {
      tenantId: payload.id,
      version: 1,
      modules: {
        customer_catalogue: { state: 'enabled', updatedAt: now },
        seller_management: { state: 'enabled', updatedAt: now, limits: { maxSellers: 50 } },
        inventory_management: { state: 'enabled', updatedAt: now },
        order_processing: { state: 'enabled', updatedAt: now },
        delivery_logistics: { state: 'enabled', updatedAt: now },
        coupons_and_promotions: { state: 'disabled', updatedAt: now },
        push_notifications: { state: 'enabled', updatedAt: now },
        reviews_and_ratings: { state: 'enabled', updatedAt: now },
        analytics_dashboard: { state: 'disabled', updatedAt: now },
        advanced_reporting: { state: 'disabled', updatedAt: now },
        marketplace_commissions: { state: 'disabled', updatedAt: now },
        seller_settlements: { state: 'disabled', updatedAt: now },
        loyalty_program: { state: 'disabled', updatedAt: now },
        recurring_subscriptions: { state: 'disabled', updatedAt: now },
        payment_integrations: { state: 'disabled', updatedAt: now },
      },
      updatedAt: now,
    };
    setStored(STORAGE_KEYS.ENTITLEMENTS, entitlements);

    // Initial Deployment Checklist
    const deployments = getStored<Record<string, DeploymentMetadata>>(STORAGE_KEYS.DEPLOYMENTS, INITIAL_DEPLOYMENTS);
    deployments[payload.id] = {
      tenantId: payload.id,
      firebaseProjectId: payload.firebaseProjectId || `client-${payload.id}`,
      androidPackageName: `com.whitelabel.poultry.${payload.id.replace(/-/g, '_')}`,
      iosBundleId: `com.whitelabel.poultry.${payload.id}`,
      storageBucketUri: `gs://${payload.firebaseProjectId || `client-${payload.id}`}.appspot.com`,
      fcmTopicName: `tenant_${payload.id.replace(/-/g, '_')}_broadcast`,
      provisioningChecklist: {
        gcp_project_created: false,
        firestore_initialized: false,
        auth_providers_configured: false,
        storage_bucket_created: false,
        security_rules_deployed: false,
        app_ids_registered: false,
        dns_records_verified: false,
      },
      updatedAt: now,
    };
    setStored(STORAGE_KEYS.DEPLOYMENTS, deployments);

    // Audit log
    await this.logAudit({
      actorUid: 'dev_current_user',
      actorEmail,
      actorRole: 'developer',
      tenantId: payload.id,
      action: 'TENANT_CREATED',
      outcome: 'SUCCESS',
      details: { tenantId: payload.id, name: payload.name, tier: payload.tier },
    });

    return newTenant;
  },

  async updateLifecycle(
    tenantId: string, 
    nextState: TenantLifecycleState, 
    reason: string = 'Platform admin lifecycle transition',
    actorEmail: string = 'lead.developer@platform.dev'
  ): Promise<TenantRecord> {
    const tenants = await this.getTenants();
    const index = tenants.findIndex((t) => t.id === tenantId);
    if (index === -1) {
      throw new Error(`Tenant ${tenantId} not found.`);
    }

    const previousState = tenants[index].lifecycleState;
    tenants[index] = {
      ...tenants[index],
      lifecycleState: nextState,
      updatedAt: new Date().toISOString(),
      version: tenants[index].version + 1,
    };

    setStored(STORAGE_KEYS.TENANTS, tenants);

    await this.logAudit({
      actorUid: 'dev_current_user',
      actorEmail,
      actorRole: 'developer',
      tenantId,
      action: 'LIFECYCLE_STATE_CHANGED',
      outcome: 'SUCCESS',
      details: { previousState, nextState, reason },
    });

    return tenants[index];
  },

  async updateBranding(
    tenantId: string,
    branding: Partial<TenantBranding>,
    actorEmail: string = 'lead.developer@platform.dev'
  ): Promise<TenantBranding> {
    const all = getStored<Record<string, TenantBranding>>(STORAGE_KEYS.BRANDING, INITIAL_BRANDING);
    const existing = all[tenantId] || { tenantId } as TenantBranding;

    const updated: TenantBranding = {
      ...existing,
      ...branding,
      tenantId,
      updatedAt: new Date().toISOString(),
    };

    all[tenantId] = updated;
    setStored(STORAGE_KEYS.BRANDING, all);

    await this.logAudit({
      actorUid: 'dev_current_user',
      actorEmail,
      actorRole: 'developer',
      tenantId,
      action: 'BRANDING_SAVED',
      outcome: 'SUCCESS',
      details: { updatedFields: Object.keys(branding) },
    });

    return updated;
  },

  async updateEntitlements(
    tenantId: string,
    modules: Record<string, { state: any; reason?: string }>,
    actorEmail: string = 'lead.developer@platform.dev'
  ): Promise<TenantEntitlements> {
    const all = getStored<Record<string, TenantEntitlements>>(STORAGE_KEYS.ENTITLEMENTS, INITIAL_ENTITLEMENTS);
    const existing = all[tenantId] || { tenantId, version: 1, modules: {} } as TenantEntitlements;

    const updatedModules = { ...existing.modules };
    for (const [key, val] of Object.entries(modules)) {
      updatedModules[key] = {
        ...(updatedModules[key] || {}),
        state: val.state,
        updatedAt: new Date().toISOString(),
        reason: val.reason || 'Admin entitlement update',
      };
    }

    const updated: TenantEntitlements = {
      ...existing,
      version: existing.version + 1,
      modules: updatedModules,
      updatedAt: new Date().toISOString(),
    };

    all[tenantId] = updated;
    setStored(STORAGE_KEYS.ENTITLEMENTS, all);

    await this.logAudit({
      actorUid: 'dev_current_user',
      actorEmail,
      actorRole: 'developer',
      tenantId,
      action: 'ENTITLEMENTS_UPDATED',
      outcome: 'SUCCESS',
      details: { modifiedCount: Object.keys(modules).length, modules: Object.keys(modules) },
    });

    return updated;
  },

  async updateDeploymentChecklist(
    tenantId: string,
    checklistKey: keyof DeploymentMetadata['provisioningChecklist'],
    status: boolean,
    actorEmail: string = 'lead.developer@platform.dev'
  ): Promise<DeploymentMetadata> {
    const all = getStored<Record<string, DeploymentMetadata>>(STORAGE_KEYS.DEPLOYMENTS, INITIAL_DEPLOYMENTS);
    const existing = all[tenantId];
    if (!existing) {
      throw new Error(`Deployment record for ${tenantId} not found.`);
    }

    existing.provisioningChecklist[checklistKey] = status;
    existing.updatedAt = new Date().toISOString();

    all[tenantId] = existing;
    setStored(STORAGE_KEYS.DEPLOYMENTS, all);

    await this.logAudit({
      actorUid: 'dev_current_user',
      actorEmail,
      actorRole: 'developer',
      tenantId,
      action: 'DEPLOYMENT_CHECKLIST_UPDATED',
      outcome: 'SUCCESS',
      details: { checklistItem: checklistKey, verified: status },
    });

    return existing;
  },

  async logAudit(event: Omit<AuditEvent, 'id' | 'timestamp'>): Promise<void> {
    const logs = await this.getAuditLogs();
    const newEvent: AuditEvent = {
      ...event,
      id: `aud_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString(),
    };
    logs.unshift(newEvent);
    setStored(STORAGE_KEYS.AUDIT_LOGS, logs);
  },
};
