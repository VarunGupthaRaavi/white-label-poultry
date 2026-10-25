import * as admin from 'firebase-admin';
import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { beforeUserCreated } from 'firebase-functions/v2/identity';
import { assertPlatformDeveloper, assertAuthenticated } from './middleware/auth';
import { logAuditEvent } from './services/audit';
import {
  TenantLifecycleState,
  TenantTier,
  TenantRecord,
  TenantBranding,
  TenantEntitlements,
  PlatformRole,
} from './types';

admin.initializeApp();
const db = admin.firestore();

// =============================================================================
// DEFAULT POULTRY VERTICAL CONFIGURATIONS
// =============================================================================

const DEFAULT_POULTRY_MODULES = {
  customer_catalogue: { state: 'enabled' as const, updatedAt: new Date().toISOString() },
  seller_management: { state: 'enabled' as const, updatedAt: new Date().toISOString() },
  inventory_management: { state: 'enabled' as const, updatedAt: new Date().toISOString() },
  order_processing: { state: 'enabled' as const, updatedAt: new Date().toISOString() },
  delivery_logistics: { state: 'enabled' as const, updatedAt: new Date().toISOString() },
  coupons_and_promotions: { state: 'enabled' as const, updatedAt: new Date().toISOString() },
  push_notifications: { state: 'enabled' as const, updatedAt: new Date().toISOString() },
  reviews_and_ratings: { state: 'enabled' as const, updatedAt: new Date().toISOString() },
  analytics_dashboard: { state: 'enabled' as const, updatedAt: new Date().toISOString() },
  advanced_reporting: { state: 'disabled' as const, updatedAt: new Date().toISOString() },
  marketplace_commissions: { state: 'disabled' as const, updatedAt: new Date().toISOString() },
  seller_settlements: { state: 'disabled' as const, updatedAt: new Date().toISOString() },
  loyalty_program: { state: 'disabled' as const, updatedAt: new Date().toISOString() },
  recurring_subscriptions: { state: 'disabled' as const, updatedAt: new Date().toISOString() },
  payment_integrations: { state: 'disabled' as const, updatedAt: new Date().toISOString() },
};

function getDefaultBranding(tenantId: string, displayName: string): TenantBranding {
  return {
    tenantId,
    displayName,
    logoUrl: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=300&auto=format&fit=crop&q=80',
    iconUrl: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=128&auto=format&fit=crop&q=80',
    splashImageUrl: null,
    colors: {
      primary: '#10B981',       // Emerald Farm Green
      secondary: '#F59E0B',     // Harvest Amber
      surface: '#0F172A',       // Slate dark surface
      textOnPrimary: '#FFFFFF', // High contrast white
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
    supportEmail: `support@${tenantId}.poultryhub.com`,
    supportPhone: '+1-800-555-0199',
    privacyPolicyUrl: 'https://poultryhub.com/privacy',
    termsOfServiceUrl: 'https://poultryhub.com/terms',
    defaultCurrency: 'USD',
    defaultLocale: 'en_US',
    updatedAt: new Date().toISOString(),
  };
}

// =============================================================================
// CALLABLE FUNCTIONS: TENANT MANAGEMENT
// =============================================================================

export const createTenant = onCall<{
  id: string;
  name: string;
  contactEmail: string;
  contactPhone: string;
  tier: TenantTier;
  firebaseProjectId: string;
  customDomain?: string;
}>(async (request) => {
  const actor = assertPlatformDeveloper(request);
  const data = request.data;

  // Validate tenant slug
  const idRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  if (!data.id || !idRegex.test(data.id) || data.id.length < 3 || data.id.length > 32) {
    throw new HttpsError('invalid-argument', 'Tenant ID must be 3-32 characters of lowercase alphanumeric characters and hyphens.');
  }

  if (!data.name || data.name.trim().length < 2) {
    throw new HttpsError('invalid-argument', 'Business name is required.');
  }

  const tenantRef = db.doc(`control_plane/v1/tenants/${data.id}`);
  const existing = await tenantRef.get();
  if (existing.exists) {
    throw new HttpsError('already-exists', `Tenant with ID "${data.id}" already exists.`);
  }

  const now = admin.firestore.FieldValue.serverTimestamp();

  const tenantRecord: Omit<TenantRecord, 'createdAt' | 'updatedAt'> & {
    createdAt: FirebaseFirestore.FieldValue;
    updatedAt: FirebaseFirestore.FieldValue;
  } = {
    id: data.id,
    name: data.name.trim(),
    contactEmail: data.contactEmail,
    contactPhone: data.contactPhone,
    lifecycleState: 'draft',
    tier: data.tier || 'starter',
    businessVertical: 'poultry_farm',
    deploymentMode: 'dedicated_project',
    firebaseProjectId: data.firebaseProjectId || `client-${data.id}`,
    customDomain: data.customDomain || null,
    createdAt: now,
    updatedAt: now,
    version: 1,
  };

  // Write tenant document
  await tenantRef.set(tenantRecord);

  // Write default branding
  const brandingRef = db.doc(`control_plane/v1/branding/${data.id}`);
  await brandingRef.set(getDefaultBranding(data.id, data.name));

  // Write default entitlements
  const entitlementsRef = db.doc(`control_plane/v1/entitlements/${data.id}`);
  const entitlements: TenantEntitlements = {
    tenantId: data.id,
    version: 1,
    modules: DEFAULT_POULTRY_MODULES,
    updatedAt: new Date().toISOString(),
  };
  await entitlementsRef.set(entitlements);

  // Write deployment checklist
  const deploymentRef = db.doc(`control_plane/v1/deployments/${data.id}`);
  await deploymentRef.set({
    tenantId: data.id,
    firebaseProjectId: data.firebaseProjectId || `client-${data.id}`,
    androidPackageName: `com.whitelabel.poultry.${data.id.replace(/-/g, '_')}`,
    iosBundleId: `com.whitelabel.poultry.${data.id}`,
    provisioningChecklist: {
      gcp_project_created: false,
      firestore_initialized: false,
      auth_providers_configured: false,
      storage_bucket_created: false,
      security_rules_deployed: false,
      dns_records_verified: false,
    },
    updatedAt: now,
  });

  await logAuditEvent(db, {
    actorUid: actor.uid,
    actorEmail: actor.email,
    actorRole: actor.role,
    tenantId: data.id,
    action: 'TENANT_CREATED',
    outcome: 'SUCCESS',
    details: { tenantId: data.id, name: data.name, tier: data.tier },
  });

  return { success: true, tenantId: data.id, message: `Tenant "${data.name}" initialized in draft state.` };
});

export const updateTenantLifecycle = onCall<{
  tenantId: string;
  nextState: TenantLifecycleState;
  reason?: string;
}>(async (request) => {
  const actor = assertPlatformDeveloper(request);
  const { tenantId, nextState, reason } = request.data;

  const validStates: TenantLifecycleState[] = ['draft', 'provisioning', 'active', 'suspended', 'terminated'];
  if (!validStates.includes(nextState)) {
    throw new HttpsError('invalid-argument', `Invalid state: ${nextState}`);
  }

  const tenantRef = db.doc(`control_plane/v1/tenants/${tenantId}`);
  const doc = await tenantRef.get();
  if (!doc.exists) {
    throw new HttpsError('not-found', `Tenant ${tenantId} not found.`);
  }

  const current = doc.data() as TenantRecord;
  const previousState = current.lifecycleState;

  await tenantRef.update({
    lifecycleState: nextState,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    version: admin.firestore.FieldValue.increment(1),
  });

  await logAuditEvent(db, {
    actorUid: actor.uid,
    actorEmail: actor.email,
    actorRole: actor.role,
    tenantId,
    action: 'LIFECYCLE_STATE_CHANGED',
    outcome: 'SUCCESS',
    details: { tenantId, previousState, nextState, reason: reason || 'Platform developer update' },
  });

  return { success: true, tenantId, previousState, nextState };
});

export const updateTenantEntitlements = onCall<{
  tenantId: string;
  modules: Record<string, { state: string; reason?: string }>;
}>(async (request) => {
  const actor = assertPlatformDeveloper(request);
  const { tenantId, modules } = request.data;

  const entitlementsRef = db.doc(`control_plane/v1/entitlements/${tenantId}`);
  const existing = await entitlementsRef.get();
  const currentData = existing.exists ? (existing.data() as TenantEntitlements) : { modules: {} };

  const updatedModules = { ...currentData.modules };
  for (const [key, val] of Object.entries(modules)) {
    updatedModules[key] = {
      ...(updatedModules[key] || {}),
      state: val.state as any,
      updatedAt: new Date().toISOString(),
      reason: val.reason || 'Admin update',
    };
  }

  await entitlementsRef.set({
    tenantId,
    version: admin.firestore.FieldValue.increment(1),
    modules: updatedModules,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  }, { merge: true });

  await logAuditEvent(db, {
    actorUid: actor.uid,
    actorEmail: actor.email,
    actorRole: actor.role,
    tenantId,
    action: 'ENTITLEMENTS_UPDATED',
    outcome: 'SUCCESS',
    details: { tenantId, modifiedModules: Object.keys(modules) },
  });

  return { success: true, tenantId };
});

export const updateTenantBranding = onCall<{
  tenantId: string;
  branding: Partial<TenantBranding>;
}>(async (request) => {
  const actor = assertPlatformDeveloper(request);
  const { tenantId, branding } = request.data;

  // Validate hex colors if present
  const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  if (branding.colors) {
    if (branding.colors.primary && !hexColorRegex.test(branding.colors.primary)) {
      throw new HttpsError('invalid-argument', 'Primary color must be a valid hex color code.');
    }
    if (branding.colors.secondary && !hexColorRegex.test(branding.colors.secondary)) {
      throw new HttpsError('invalid-argument', 'Secondary color must be a valid hex color code.');
    }
  }

  const brandingRef = db.doc(`control_plane/v1/branding/${tenantId}`);
  await brandingRef.set({
    ...branding,
    tenantId,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  }, { merge: true });

  await logAuditEvent(db, {
    actorUid: actor.uid,
    actorEmail: actor.email,
    actorRole: actor.role,
    tenantId,
    action: 'BRANDING_SAVED',
    outcome: 'SUCCESS',
    details: { tenantId, updatedFields: Object.keys(branding) },
  });

  return { success: true, tenantId };
});

export const assignUserRole = onCall<{
  targetUid: string;
  role: PlatformRole;
  tenantId: string;
}>(async (request) => {
  const actor = assertAuthenticated(request);
  const { targetUid, role, tenantId } = request.data;

  // Only Platform Developers can assign 'developer', 'super_admin' or cross-tenant roles
  if (role === 'developer' || role === 'super_admin') {
    if (actor.role !== 'developer' && actor.role !== 'super_admin') {
      throw new HttpsError('permission-denied', 'Only platform developers can assign developer roles.');
    }
  } else if (actor.role !== 'developer' && actor.role !== 'super_admin') {
    // Client admin can only assign roles within their own tenant
    if (actor.role !== 'client_admin' || actor.tenantId !== tenantId) {
      throw new HttpsError('permission-denied', 'Client admin can only assign roles within their own tenant.');
    }
  }

  // Set Firebase Auth Custom Claims
  await admin.auth().setCustomUserClaims(targetUid, {
    role,
    tenantId,
  });

  // Force token refresh on next request
  await admin.auth().revokeRefreshTokens(targetUid);

  // Update profile in Firestore
  const userRef = db.doc(`tenants/${tenantId}/users/${targetUid}`);
  await userRef.set({
    uid: targetUid,
    role,
    tenantId,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  }, { merge: true });

  await logAuditEvent(db, {
    actorUid: actor.uid,
    actorEmail: actor.email,
    actorRole: actor.role || 'unknown',
    tenantId,
    action: 'USER_ROLE_ASSIGNED',
    outcome: 'SUCCESS',
    details: { targetUid, role, tenantId },
  });

  return { success: true, targetUid, role, tenantId };
});

export const getPlatformOverview = onCall(async (request) => {
  assertPlatformDeveloper(request);

  const tenantsSnap = await db.collection('control_plane/v1/tenants').get();
  const tenants = tenantsSnap.docs.map((d) => d.data() as TenantRecord);

  const statusCounts = {
    draft: 0,
    provisioning: 0,
    active: 0,
    suspended: 0,
    terminated: 0,
  };

  tenants.forEach((t) => {
    if (t.lifecycleState in statusCounts) {
      statusCounts[t.lifecycleState]++;
    }
  });

  return {
    totalTenants: tenants.length,
    statusCounts,
    health: {
      controlPlaneDb: 'HEALTHY',
      cloudFunctions: 'HEALTHY',
      authService: 'HEALTHY',
      timestamp: new Date().toISOString(),
    },
  };
});

// Auth trigger: Ensure newly registered users have customer role by default
export const onUserCreated = beforeUserCreated((event) => {
  return {
    customClaims: {
      role: 'customer',
      tenantId: 'default',
    },
  };
});
