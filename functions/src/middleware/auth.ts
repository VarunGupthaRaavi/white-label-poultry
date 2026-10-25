import { HttpsError, CallableRequest } from 'firebase-functions/v2/https';

export function assertAuthenticated(request: CallableRequest<unknown>): { uid: string; email: string; role?: string; tenantId?: string } {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'Caller must be authenticated to invoke this operation.');
  }

  const token = request.auth.token;
  return {
    uid: request.auth.uid,
    email: token.email || '',
    role: (token.role as string) || 'customer',
    tenantId: token.tenantId as string | undefined,
  };
}

export function assertPlatformDeveloper(request: CallableRequest<unknown>): { uid: string; email: string; role: string } {
  const user = assertAuthenticated(request);
  if (user.role !== 'developer' && user.role !== 'super_admin') {
    throw new HttpsError('permission-denied', 'Unauthorized. Operation requires platform developer privileges.');
  }
  return { uid: user.uid, email: user.email, role: user.role };
}

export function assertClientAdminOrDeveloper(
  request: CallableRequest<unknown>,
  targetTenantId?: string
): { uid: string; email: string; role: string; tenantId?: string } {
  const user = assertAuthenticated(request);
  if (user.role === 'developer' || user.role === 'super_admin') {
    return { uid: user.uid, email: user.email, role: user.role, tenantId: user.tenantId };
  }
  if (user.role === 'client_admin') {
    if (targetTenantId && user.tenantId !== targetTenantId) {
      throw new HttpsError('permission-denied', 'Client admin can only manage their own tenant.');
    }
    return { uid: user.uid, email: user.email, role: user.role, tenantId: user.tenantId };
  }
  throw new HttpsError('permission-denied', 'Unauthorized. Requires client administrator or developer clearance.');
}
