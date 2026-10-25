"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.onUserCreated = exports.getPlatformOverview = exports.assignUserRole = exports.updateTenantBranding = exports.updateTenantEntitlements = exports.updateTenantLifecycle = exports.createTenant = void 0;
const admin = __importStar(require("firebase-admin"));
const https_1 = require("firebase-functions/v2/https");
const identity_1 = require("firebase-functions/v2/identity");
const auth_1 = require("./middleware/auth");
const audit_1 = require("./services/audit");
admin.initializeApp();
const db = admin.firestore();
// =============================================================================
// DEFAULT POULTRY VERTICAL CONFIGURATIONS
// =============================================================================
const DEFAULT_POULTRY_MODULES = {
    customer_catalogue: { state: 'enabled', updatedAt: new Date().toISOString() },
    seller_management: { state: 'enabled', updatedAt: new Date().toISOString() },
    inventory_management: { state: 'enabled', updatedAt: new Date().toISOString() },
    order_processing: { state: 'enabled', updatedAt: new Date().toISOString() },
    delivery_logistics: { state: 'enabled', updatedAt: new Date().toISOString() },
    coupons_and_promotions: { state: 'enabled', updatedAt: new Date().toISOString() },
    push_notifications: { state: 'enabled', updatedAt: new Date().toISOString() },
    reviews_and_ratings: { state: 'enabled', updatedAt: new Date().toISOString() },
    analytics_dashboard: { state: 'enabled', updatedAt: new Date().toISOString() },
    advanced_reporting: { state: 'disabled', updatedAt: new Date().toISOString() },
    marketplace_commissions: { state: 'disabled', updatedAt: new Date().toISOString() },
    seller_settlements: { state: 'disabled', updatedAt: new Date().toISOString() },
    loyalty_program: { state: 'disabled', updatedAt: new Date().toISOString() },
    recurring_subscriptions: { state: 'disabled', updatedAt: new Date().toISOString() },
    payment_integrations: { state: 'disabled', updatedAt: new Date().toISOString() },
};
function getDefaultBranding(tenantId, displayName) {
    return {
        tenantId,
        displayName,
        logoUrl: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=300&auto=format&fit=crop&q=80',
        iconUrl: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=128&auto=format&fit=crop&q=80',
        splashImageUrl: null,
        colors: {
            primary: '#10B981', // Emerald Farm Green
            secondary: '#F59E0B', // Harvest Amber
            surface: '#0F172A', // Slate dark surface
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
exports.createTenant = (0, https_1.onCall)(async (request) => {
    const actor = (0, auth_1.assertPlatformDeveloper)(request);
    const data = request.data;
    // Validate tenant slug
    const idRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    if (!data.id || !idRegex.test(data.id) || data.id.length < 3 || data.id.length > 32) {
        throw new https_1.HttpsError('invalid-argument', 'Tenant ID must be 3-32 characters of lowercase alphanumeric characters and hyphens.');
    }
    if (!data.name || data.name.trim().length < 2) {
        throw new https_1.HttpsError('invalid-argument', 'Business name is required.');
    }
    const tenantRef = db.doc(`control_plane/v1/tenants/${data.id}`);
    const existing = await tenantRef.get();
    if (existing.exists) {
        throw new https_1.HttpsError('already-exists', `Tenant with ID "${data.id}" already exists.`);
    }
    const now = admin.firestore.FieldValue.serverTimestamp();
    const tenantRecord = {
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
    const entitlements = {
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
    await (0, audit_1.logAuditEvent)(db, {
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
exports.updateTenantLifecycle = (0, https_1.onCall)(async (request) => {
    const actor = (0, auth_1.assertPlatformDeveloper)(request);
    const { tenantId, nextState, reason } = request.data;
    const validStates = ['draft', 'provisioning', 'active', 'suspended', 'terminated'];
    if (!validStates.includes(nextState)) {
        throw new https_1.HttpsError('invalid-argument', `Invalid state: ${nextState}`);
    }
    const tenantRef = db.doc(`control_plane/v1/tenants/${tenantId}`);
    const doc = await tenantRef.get();
    if (!doc.exists) {
        throw new https_1.HttpsError('not-found', `Tenant ${tenantId} not found.`);
    }
    const current = doc.data();
    const previousState = current.lifecycleState;
    await tenantRef.update({
        lifecycleState: nextState,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        version: admin.firestore.FieldValue.increment(1),
    });
    await (0, audit_1.logAuditEvent)(db, {
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
exports.updateTenantEntitlements = (0, https_1.onCall)(async (request) => {
    const actor = (0, auth_1.assertPlatformDeveloper)(request);
    const { tenantId, modules } = request.data;
    const entitlementsRef = db.doc(`control_plane/v1/entitlements/${tenantId}`);
    const existing = await entitlementsRef.get();
    const currentData = existing.exists ? existing.data() : { modules: {} };
    const updatedModules = { ...currentData.modules };
    for (const [key, val] of Object.entries(modules)) {
        updatedModules[key] = {
            ...(updatedModules[key] || {}),
            state: val.state,
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
    await (0, audit_1.logAuditEvent)(db, {
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
exports.updateTenantBranding = (0, https_1.onCall)(async (request) => {
    const actor = (0, auth_1.assertPlatformDeveloper)(request);
    const { tenantId, branding } = request.data;
    // Validate hex colors if present
    const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    if (branding.colors) {
        if (branding.colors.primary && !hexColorRegex.test(branding.colors.primary)) {
            throw new https_1.HttpsError('invalid-argument', 'Primary color must be a valid hex color code.');
        }
        if (branding.colors.secondary && !hexColorRegex.test(branding.colors.secondary)) {
            throw new https_1.HttpsError('invalid-argument', 'Secondary color must be a valid hex color code.');
        }
    }
    const brandingRef = db.doc(`control_plane/v1/branding/${tenantId}`);
    await brandingRef.set({
        ...branding,
        tenantId,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });
    await (0, audit_1.logAuditEvent)(db, {
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
exports.assignUserRole = (0, https_1.onCall)(async (request) => {
    const actor = (0, auth_1.assertAuthenticated)(request);
    const { targetUid, role, tenantId } = request.data;
    // Only Platform Developers can assign 'developer', 'super_admin' or cross-tenant roles
    if (role === 'developer' || role === 'super_admin') {
        if (actor.role !== 'developer' && actor.role !== 'super_admin') {
            throw new https_1.HttpsError('permission-denied', 'Only platform developers can assign developer roles.');
        }
    }
    else if (actor.role !== 'developer' && actor.role !== 'super_admin') {
        // Client admin can only assign roles within their own tenant
        if (actor.role !== 'client_admin' || actor.tenantId !== tenantId) {
            throw new https_1.HttpsError('permission-denied', 'Client admin can only assign roles within their own tenant.');
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
    await (0, audit_1.logAuditEvent)(db, {
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
exports.getPlatformOverview = (0, https_1.onCall)(async (request) => {
    (0, auth_1.assertPlatformDeveloper)(request);
    const tenantsSnap = await db.collection('control_plane/v1/tenants').get();
    const tenants = tenantsSnap.docs.map((d) => d.data());
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
exports.onUserCreated = (0, identity_1.beforeUserCreated)((event) => {
    return {
        customClaims: {
            role: 'customer',
            tenantId: 'default',
        },
    };
});
//# sourceMappingURL=index.js.map