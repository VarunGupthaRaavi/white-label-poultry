import * as admin from 'firebase-admin';
import { AuditEvent } from '../types';

export async function logAuditEvent(
  db: FirebaseFirestore.Firestore,
  event: Omit<AuditEvent, 'id' | 'timestamp'>
): Promise<string> {
  const collection = db.collection('control_plane/v1/audit_logs');
  const docRef = collection.doc();
  
  // Sanitize details to guarantee secrets, credentials, or keys are never logged
  const sanitizedDetails = { ...event.details };
  for (const key of Object.keys(sanitizedDetails)) {
    const lowerKey = key.toLowerCase();
    if (
      lowerKey.includes('password') ||
      lowerKey.includes('secret') ||
      lowerKey.includes('token') ||
      lowerKey.includes('credential') ||
      lowerKey.includes('apikey')
    ) {
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
