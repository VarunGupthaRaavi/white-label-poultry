export type TenantLifecycleState = 
  | 'draft' 
  | 'provisioning' 
  | 'active' 
  | 'suspended' 
  | 'terminated';

export type TenantTier = 'starter' | 'growth' | 'enterprise';

export interface TenantRecord {
  id: string;
  name: string;
  contactEmail: string;
  contactPhone: string;
  lifecycleState: TenantLifecycleState;
  tier: TenantTier;
  businessVertical: string;
  deploymentMode: 'dedicated_project' | 'shared_namespace';
  firebaseProjectId: string;
  customDomain?: string | null;
  createdAt: string;
  updatedAt: string;
  version: number;
}

export interface TenantBranding {
  tenantId: string;
  displayName: string;
  logoUrl: string;
  iconUrl?: string | null;
  splashImageUrl?: string | null;
  colors: {
    primary: string;
    secondary: string;
    surface: string;
    textOnPrimary: string;
  };
  typography: {
    fontFamily: string;
    headingFont?: string;
  };
  terminology: {
    itemUnit: string;
    sellerLabel: string;
    categoryLabel: string;
  };
  supportEmail: string;
  supportPhone: string;
  privacyPolicyUrl: string;
  termsOfServiceUrl: string;
  defaultCurrency: string;
  defaultLocale: string;
  updatedAt: string;
}

export type EntitlementState = 
  | 'enabled' 
  | 'disabled' 
  | 'requested' 
  | 'approved' 
  | 'suspended';

export interface ModuleEntitlement {
  state: EntitlementState;
  limits?: {
    maxSellers?: number;
    maxProducts?: number;
    maxMonthlyOrders?: number;
  };
  updatedAt: string;
  reason?: string;
}

export interface TenantEntitlements {
  tenantId: string;
  version: number;
  modules: Record<string, ModuleEntitlement>;
  updatedAt: string;
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  actorUid: string;
  actorEmail: string;
  actorRole: string;
  tenantId?: string | null;
  action: string;
  outcome: 'SUCCESS' | 'FAILURE' | 'REJECTED';
  ipAddress?: string;
  userAgent?: string;
  details: Record<string, any>;
}

export interface DeploymentMetadata {
  tenantId: string;
  firebaseProjectId: string;
  androidPackageName: string;
  iosBundleId: string;
  storageBucketUri: string;
  fcmTopicName: string;
  provisioningChecklist: {
    gcp_project_created: boolean;
    firestore_initialized: boolean;
    auth_providers_configured: boolean;
    storage_bucket_created: boolean;
    security_rules_deployed: boolean;
    app_ids_registered: boolean;
    dns_records_verified: boolean;
  };
  updatedAt: string;
}

export interface PlatformHealth {
  status: 'OPERATIONAL' | 'DEGRADED' | 'OUTAGE';
  uptimeSeconds: number;
  components: {
    name: string;
    status: 'HEALTHY' | 'DEGRADED' | 'UNAVAILABLE';
    latencyMs: number;
  }[];
  timestamp: string;
}
