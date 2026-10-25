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
  createdAt: FirebaseFirestore.Timestamp | string;
  updatedAt: FirebaseFirestore.Timestamp | string;
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
  updatedAt: FirebaseFirestore.Timestamp | string;
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
  updatedAt: FirebaseFirestore.Timestamp | string;
}

export interface AuditEvent {
  id: string;
  timestamp: FirebaseFirestore.Timestamp | string;
  actorUid: string;
  actorEmail: string;
  actorRole: string;
  tenantId?: string | null;
  action: string;
  outcome: 'SUCCESS' | 'FAILURE' | 'REJECTED';
  ipAddress?: string;
  userAgent?: string;
  details: Record<string, unknown>;
}

export type PlatformRole = 
  | 'developer' 
  | 'super_admin' 
  | 'client_admin' 
  | 'seller' 
  | 'customer' 
  | 'staff';
