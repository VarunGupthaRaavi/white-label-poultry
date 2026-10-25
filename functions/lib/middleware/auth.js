"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertAuthenticated = assertAuthenticated;
exports.assertPlatformDeveloper = assertPlatformDeveloper;
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
//# sourceMappingURL=auth.js.map