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
exports.logAuditEvent = logAuditEvent;
const admin = __importStar(require("firebase-admin"));
async function logAuditEvent(db, event) {
    const collection = db.collection('control_plane/v1/audit_logs');
    const docRef = collection.doc();
    // Sanitize details to guarantee secrets, credentials, or keys are never logged
    const sanitizedDetails = { ...event.details };
    for (const key of Object.keys(sanitizedDetails)) {
        const lowerKey = key.toLowerCase();
        if (lowerKey.includes('password') ||
            lowerKey.includes('secret') ||
            lowerKey.includes('token') ||
            lowerKey.includes('credential') ||
            lowerKey.includes('apikey')) {
            sanitizedDetails[key] = '[REDACTED]';
        }
    }
    const payload = {
        ...event,
        id: docRef.id,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        details: sanitizedDetails,
    };
    await docRef.set(payload);
    return docRef.id;
}
//# sourceMappingURL=audit.js.map