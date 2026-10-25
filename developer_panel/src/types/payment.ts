export type PaymentProvider = 'razorpay' | 'cashfree' | 'stripe' | 'offline_pod';

export type PaymentEnvironment = 'sandbox' | 'production';

export type PaymentGatewayStatus = 'unconfigured' | 'configured' | 'testing' | 'active' | 'suspended';

export interface TenantPaymentConfig {
  tenantId: string;
  provider: PaymentProvider;
  environment: PaymentEnvironment;
  keyId: string; // Public API Key / Client ID (e.g., rzp_test_...)
  maskedSecret: string; // Sanitized display: e.g. "••••••••9abc"
  secretKeyReference?: string; // Secret Manager key identifier (never raw secret)
  secretManagerRef?: string; // Secret Manager URI identifier
  webhookUrl: string;
  webhookSecretConfigured: boolean;
  status: PaymentGatewayStatus;
  marketplacePayoutsEnabled: boolean;
  splitSettlementModel: 'direct_submerchant' | 'nodal_escrow' | 'manual_batch';
  supportedMethods: ('upi' | 'card' | 'netbanking' | 'wallet' | 'offline_pod')[];
  updatedAt: string;
  updatedBy: string;
}

export type PaymentTransactionStatus = 
  | 'created' 
  | 'pending'
  | 'authorized' 
  | 'captured' 
  | 'failed' 
  | 'refunded' 
  | 'partially_refunded';

export interface PaymentRefundRecord {
  refundId: string;
  amountInr: number;
  reason: string;
  status: 'pending' | 'processed' | 'failed';
  providerRefundId?: string;
  commissionReversedInr: number;
  initiatedBy: string;
  initiatedByName: string;
  createdAt: string;
}

export interface PaymentTransactionRecord {
  id: string;
  tenantId: string;
  orderId: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  provider: PaymentProvider;
  providerOrderId: string;
  providerPaymentId?: string;
  amountInr: number;
  currency: 'INR';
  status: PaymentTransactionStatus;
  paymentMethod?: 'upi' | 'card' | 'netbanking' | 'wallet' | 'offline_pod';
  failureReason?: string;
  refunds: PaymentRefundRecord[];
  idempotencyKey: string;
  signatureVerified: boolean;
  metadata?: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

export type SettlementStatus = 'unsettled' | 'eligible' | 'processing' | 'settled' | 'adjusted';

export interface SellerSettlementRecord {
  id: string;
  tenantId: string;
  sellerId: string;
  sellerName: string;
  orderId: string;
  orderGrossInr: number;
  commissionRatePercent: number;
  commissionAmountInr: number;
  netPayableInr: number;
  status: SettlementStatus;
  bankDetailsSnapshot: {
    accountNumber: string;
    ifscCode: string;
    bankName: string;
    beneficiaryName: string;
  };
  utrReference?: string; // Bank UTR or gateway transfer ID
  settledAt?: string;
  settledBy?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WebhookEventRecord {
  id: string; // Provider Event ID (e.g. evt_M4vX123)
  tenantId: string;
  provider: PaymentProvider;
  eventType: string; // e.g. payment.captured, payment.failed
  payloadHash: string;
  processedAt: string;
  status: 'processed' | 'duplicate_ignored' | 'failed';
}

export interface ProviderEvaluationNote {
  provider: PaymentProvider;
  name: string;
  country: 'IN' | 'GLOBAL';
  supportedCurrencies: string[];
  marketplaceCapability: 'Native Route/Split' | 'Payouts API' | 'Custom Connect' | 'Manual';
  regulatoryStatus: string;
  onboardingRequirements: string[];
  recommendationNote: string;
}
