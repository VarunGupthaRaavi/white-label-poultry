"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertAuthenticated = assertAuthenticated;
exports.assertPlatformDeveloper = assertPlatformDeveloper;
exports.assertClientAdminOrDeveloper = assertClientAdminOrDeveloper;
const https_1 = require("firebase-functions/v2/https");
function assertAuthenticated(request) {
    if (!request.auth) {
        throw new https_1.HttpsError('unauthenticated', 'Caller must be authenticated to invoke this operation.');
    }
    const token = request.auth.token;
    return {
        uid: request.auth.uid,
        email: token.email || '',
        role: token.role || 'customer',
        tenantId: token.tenantId,
    };
}
function assertPlatformDeveloper(request) {
    const user = assertAuthenticated(request);
    if (user.role !== 'developer' && user.role !== 'super_admin') {
        throw new https_1.HttpsError('permission-denied', 'Unauthorized. Operation requires platform developer privileges.');
    }
    return { uid: user.uid, email: user.email, role: user.role };
}
function assertClientAdminOrDeveloper(request, targetTenantId) {
    const user = assertAuthenticated(request);
    if (user.role === 'developer' || user.role === 'super_admin') {
        return { uid: user.uid, email: user.email, role: user.role, tenantId: user.tenantId };
    }
    if (user.role === 'client_admin') {
        if (targetTenantId && user.tenantId !== targetTenantId) {
            throw new https_1.HttpsError('permission-denied', 'Client admin can only manage their own tenant.');
        }
        return { uid: user.uid, email: user.email, role: user.role, tenantId: user.tenantId };
    }
    throw new https_1.HttpsError('permission-denied', 'Unauthorized. Requires client administrator or developer clearance.');
}
//# sourceMappingURL=auth.js.map