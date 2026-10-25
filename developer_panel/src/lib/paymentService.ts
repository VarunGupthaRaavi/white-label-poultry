import {
  PaymentProvider,
  TenantPaymentConfig,
  PaymentTransactionRecord,
  SellerSettlementRecord,
  WebhookEventRecord,
  ProviderEvaluationNote,
  PaymentRefundRecord,
} from '../types/payment';
import { operationsService } from './operationsService';
import { tenantService } from './tenantService';

// Candidate Gateway Provider Evaluations for Indian Poultry Commerce
export const PROVIDER_EVALUATIONS: ProviderEvaluationNote[] = [
  {
    provider: 'razorpay',
    name: 'Razorpay (with Razorpay Route Marketplace)',
    country: 'IN',
    supportedCurrencies: ['INR'],
    marketplaceCapability: 'Native Route/Split',
    regulatoryStatus: 'RBI Payment Aggregator Licensed (PA/PG)',
    onboardingRequirements: [
      'Corporate PAN & GST Registration of Client',
      'RBI Escrow / Nodal Account Agreement',
      'Sub-merchant / Farmer KYC (Bank A/C, Aadhaar/PAN, FSSAI)',
      'Signed Webhook HMAC Secrets',
    ],
    recommendationNote:
      'Recommended for Indian poultry marketplaces. Deep UPI Intent/QR support, automated split settlements via Route, and strict compliance with RBI marketplace regulations.',
  },
  {
    provider: 'cashfree',
    name: 'Cashfree Payments & Payouts',
    country: 'IN',
    supportedCurrencies: ['INR'],
    marketplaceCapability: 'Payouts API',
    regulatoryStatus: 'RBI Payment Aggregator Licensed (PA/PG)',
    onboardingRequirements: [
      'Entity GST, Business Registration, Bank Verification',
      'Vendor Onboarding Verification API',
      'Pre-funded Payouts Escrow Account',
    ],
    recommendationNote:
      'Strong alternative for instant NEFT/IMPS/UPI payouts to farmers with automated bank account name-match verification.',
  },
  {
    provider: 'stripe',
    name: 'Stripe (Stripe Connect)',
    country: 'GLOBAL',
    supportedCurrencies: ['USD', 'EUR', 'GBP', 'INR (Cards only)'],
    marketplaceCapability: 'Custom Connect',
    regulatoryStatus: 'Global Payment Processor (India Export Regulations Apply)',
    onboardingRequirements: [
      'Stripe India Account with IEC (Import Export Code) for foreign cards',
      'Local INR processing subject to Indian card mandate & tokenization',
    ],
    recommendationNote:
      'Ideal for international exports, but less optimal for domestic rural Indian poultry where UPI constitutes >85% of transaction volume.',
  },
  {
    provider: 'offline_pod',
    name: 'Cash on Delivery / Pay on Farm-Gate Delivery (COD/POD)',
    country: 'IN',
    supportedCurrencies: ['INR'],
    marketplaceCapability: 'Manual',
    regulatoryStatus: 'Standard Commercial Invoice Protocol',
    onboardingRequirements: ['Physical Delivery Handover OTP Verification', 'Cash Deposit Journal'],
    recommendationNote:
      'Essential baseline fallback for farm-gate sales and rural areas with intermittent connectivity.',
  },
];

// Initial Tenant Payment Configurations
const INITIAL_PAYMENT_CONFIGS: Record<string, TenantPaymentConfig> = {
  'apex-poultry-hub': {
    tenantId: 'apex-poultry-hub',
    provider: 'razorpay',
    environment: 'sandbox',
    keyId: 'rzp_test_ApexHub2026k9',
    maskedSecret: '••••••••8xL2',
    secretManagerRef: 'projects/apex-poultry-hub/secrets/rzp_webhook_secret',
    webhookUrl: 'https://api.poultryplatform.dev/webhooks/v1/tenants/apex-poultry-hub/payments',
    webhookSecretConfigured: true,
    status: 'testing',
    marketplacePayoutsEnabled: true,
    splitSettlementModel: 'nodal_escrow',
    supportedMethods: ['upi', 'card', 'netbanking', 'offline_pod'],
    updatedAt: '2026-10-24T10:00:00Z',
    updatedBy: 'Vikramaditya Rao (Hub Admin)',
  },
  'golden-yolk-hatcheries': {
    tenantId: 'golden-yolk-hatcheries',
    provider: 'offline_pod',
    environment: 'sandbox',
    keyId: '',
    maskedSecret: 'Unconfigured',
    webhookUrl: '',
    webhookSecretConfigured: false,
    status: 'unconfigured',
    marketplacePayoutsEnabled: false,
    splitSettlementModel: 'manual_batch',
    supportedMethods: ['offline_pod'],
    updatedAt: '2026-10-20T08:00:00Z',
    updatedBy: 'System Default',
  },
};

// Initial Seed Transactions in ₹ INR
const INITIAL_TRANSACTIONS: PaymentTransactionRecord[] = [
  {
    id: 'TXN-2026-901',
    tenantId: 'apex-poultry-hub',
    orderId: 'ORD-2026-1001',
    customerId: 'cust_anand_01',
    customerName: 'Anand Verma',
    customerEmail: 'anand.verma@gmail.com',
    provider: 'razorpay',
    providerOrderId: 'order_Opx891234a',
    providerPaymentId: 'pay_Px98765432b',
    amountInr: 570,
    currency: 'INR',
    status: 'captured',
    paymentMethod: 'upi',
    refunds: [],
    idempotencyKey: 'idem_901_anand',
    signatureVerified: true,
    metadata: { upiApp: 'GooglePay', vpa: 'anand@okaxis' },
    createdAt: '2026-10-24T09:16:00Z',
    updatedAt: '2026-10-24T09:17:30Z',
  },
  {
    id: 'TXN-2026-902',
    tenantId: 'apex-poultry-hub',
    orderId: 'ORD-2026-1002',
    customerId: 'cust_priya_02',
    customerName: 'Priya Sundaram',
    customerEmail: 'priya.sundaram@outlook.com',
    provider: 'razorpay',
    providerOrderId: 'order_Opx891235b',
    providerPaymentId: 'pay_Px98765433c',
    amountInr: 760,
    currency: 'INR',
    status: 'captured',
    paymentMethod: 'card',
    refunds: [],
    idempotencyKey: 'idem_902_priya',
    signatureVerified: true,
    metadata: { cardNetwork: 'RuPay', cardLast4: '4112' },
    createdAt: '2026-10-25T07:31:00Z',
    updatedAt: '2026-10-25T07:32:15Z',
  },
  {
    id: 'TXN-2026-903',
    tenantId: 'apex-poultry-hub',
    orderId: 'ORD-2026-1003',
    customerId: 'cust_rajesh_03',
    customerName: 'Rajesh Khanna',
    customerEmail: 'rajesh.k@rediffmail.com',
    provider: 'razorpay',
    providerOrderId: 'order_Opx891236c',
    providerPaymentId: 'pay_Px98765434d',
    amountInr: 580,
    currency: 'INR',
    status: 'captured',
    paymentMethod: 'netbanking',
    refunds: [],
    idempotencyKey: 'idem_903_rajesh',
    signatureVerified: true,
    metadata: { bank: 'HDFC Bank' },
    createdAt: '2026-10-25T06:46:00Z',
    updatedAt: '2026-10-25T06:47:20Z',
  },
  {
    id: 'TXN-2026-904',
    tenantId: 'apex-poultry-hub',
    orderId: 'ORD-2026-1004',
    customerId: 'cust_sneha_04',
    customerName: 'Sneha Reddy',
    customerEmail: 'sneha.reddy@yahoo.in',
    provider: 'razorpay',
    providerOrderId: 'order_Opx891237d',
    providerPaymentId: 'pay_Px98765435e',
    amountInr: 360,
    currency: 'INR',
    status: 'captured',
    paymentMethod: 'upi',
    refunds: [],
    idempotencyKey: 'idem_904_sneha',
    signatureVerified: true,
    metadata: { upiApp: 'PhonePe', vpa: 'sneha@ybl' },
    createdAt: '2026-10-25T05:31:00Z',
    updatedAt: '2026-10-25T05:32:00Z',
  },
  {
    id: 'TXN-2026-905',
    tenantId: 'apex-poultry-hub',
    orderId: 'ORD-2026-1006',
    customerId: 'cust_meera_06',
    customerName: 'Meera Nair',
    customerEmail: 'meera.nair@gmail.com',
    provider: 'razorpay',
    providerOrderId: 'order_Opx891239f',
    providerPaymentId: 'pay_Px98765437g',
    amountInr: 400,
    currency: 'INR',
    status: 'refunded',
    paymentMethod: 'upi',
    refunds: [
      {
        refundId: 'ref_905_full',
        amountInr: 400,
        reason: 'Order cancelled prior to produce dispatch',
        status: 'processed',
        providerRefundId: 'rfnd_Px99988811a',
        commissionReversedInr: 32,
        initiatedBy: 'admin_vikram_01',
        initiatedByName: 'Vikramaditya Rao (Hub Admin)',
        createdAt: '2026-10-23T12:05:00Z',
      },
    ],
    idempotencyKey: 'idem_905_meera',
    signatureVerified: true,
    createdAt: '2026-10-23T11:21:00Z',
    updatedAt: '2026-10-23T12:05:00Z',
  },
];

// Initial Seller Settlements
const INITIAL_SETTLEMENTS: SellerSettlementRecord[] = [
  {
    id: 'SETTLE-2026-001',
    tenantId: 'apex-poultry-hub',
    sellerId: 'seller_krishna_01',
    sellerName: 'Krishna Broiler & Layer Farms',
    orderId: 'ORD-2026-1001',
    orderGrossInr: 570,
    commissionRatePercent: 8.0,
    commissionAmountInr: 46,
    netPayableInr: 524,
    status: 'settled',
    bankDetailsSnapshot: {
      accountNumber: '50100456789012',
      ifscCode: 'HDFC0001234',
      bankName: 'HDFC Bank',
      beneficiaryName: 'Krishna Broiler Farms Pvt Ltd',
    },
    utrReference: 'CMS20261024HDFC889012',
    settledAt: '2026-10-24T18:00:00Z',
    settledBy: 'Vikramaditya Rao (Hub Admin)',
    createdAt: '2026-10-24T14:45:00Z',
    updatedAt: '2026-10-24T18:00:00Z',
  },
  {
    id: 'SETTLE-2026-002',
    tenantId: 'apex-poultry-hub',
    sellerId: 'seller_krishna_01',
    sellerName: 'Krishna Broiler & Layer Farms',
    orderId: 'ORD-2026-1002',
    orderGrossInr: 760,
    commissionRatePercent: 8.0,
    commissionAmountInr: 61,
    netPayableInr: 699,
    status: 'unsettled', // Order is in 'preparing' state
    bankDetailsSnapshot: {
      accountNumber: '50100456789012',
      ifscCode: 'HDFC0001234',
      bankName: 'HDFC Bank',
      beneficiaryName: 'Krishna Broiler Farms Pvt Ltd',
    },
    createdAt: '2026-10-25T07:30:00Z',
    updatedAt: '2026-10-25T07:30:00Z',
  },
  {
    id: 'SETTLE-2026-003',
    tenantId: 'apex-poultry-hub',
    sellerId: 'seller_krishna_01',
    sellerName: 'Krishna Broiler & Layer Farms',
    orderId: 'ORD-2026-1003',
    orderGrossInr: 580,
    commissionRatePercent: 8.0,
    commissionAmountInr: 46,
    netPayableInr: 534,
    status: 'unsettled', // Order is in 'ready_for_dispatch' state
    bankDetailsSnapshot: {
      accountNumber: '50100456789012',
      ifscCode: 'HDFC0001234',
      bankName: 'HDFC Bank',
      beneficiaryName: 'Krishna Broiler Farms Pvt Ltd',
    },
    createdAt: '2026-10-25T06:45:00Z',
    updatedAt: '2026-10-25T06:45:00Z',
  },
  {
    id: 'SETTLE-2026-004',
    tenantId: 'apex-poultry-hub',
    sellerId: 'seller_godrej_03',
    sellerName: 'Godrej Agrovet Contract Partner',
    orderId: 'ORD-2026-1004',
    orderGrossInr: 360,
    commissionRatePercent: 7.5,
    commissionAmountInr: 27,
    netPayableInr: 333,
    status: 'unsettled', // Order is in 'out_for_delivery' state
    bankDetailsSnapshot: {
      accountNumber: '30998877665544',
      ifscCode: 'SBIN0004567',
      bankName: 'State Bank of India',
      beneficiaryName: 'Patil Poultry Enterprise',
    },
    createdAt: '2026-10-25T05:30:00Z',
    updatedAt: '2026-10-25T05:30:00Z',
  },
];

class PaymentService {
  private configs: Record<string, TenantPaymentConfig> = {};
  private transactions: PaymentTransactionRecord[] = [];
  private settlements: SellerSettlementRecord[] = [];
  private processedWebhookEvents: Set<string> = new Set();

  constructor() {
    this.init();
  }

  private init() {
    if (typeof window === 'undefined') {
      this.configs = { ...INITIAL_PAYMENT_CONFIGS };
      this.transactions = [...INITIAL_TRANSACTIONS];
      this.settlements = [...INITIAL_SETTLEMENTS];
      return;
    }

    try {
      const storedConfigs = localStorage.getItem('poultry_payment_configs');
      this.configs = storedConfigs ? JSON.parse(storedConfigs) : { ...INITIAL_PAYMENT_CONFIGS };

      const storedTx = localStorage.getItem('poultry_payment_transactions');
      this.transactions = storedTx ? JSON.parse(storedTx) : [...INITIAL_TRANSACTIONS];

      const storedSettlements = localStorage.getItem('poultry_seller_settlements');
      this.settlements = storedSettlements ? JSON.parse(storedSettlements) : [...INITIAL_SETTLEMENTS];

      const storedEvents = localStorage.getItem('poultry_processed_webhooks');
      if (storedEvents) {
        this.processedWebhookEvents = new Set(JSON.parse(storedEvents));
      }
    } catch {
      this.configs = { ...INITIAL_PAYMENT_CONFIGS };
      this.transactions = [...INITIAL_TRANSACTIONS];
      this.settlements = [...INITIAL_SETTLEMENTS];
    }
  }

  private persist(key: string, data: unknown) {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(key, JSON.stringify(data));
      } catch (e) {
        console.error('PaymentService persistence error', e);
      }
    }
  }

  // --- CONFIGURATION MANAGEMENT ---
  public getAllPaymentConfigs(): TenantPaymentConfig[] {
    return Object.values(this.configs);
  }

  public getPaymentConfig(tenantId: string): TenantPaymentConfig {
    if (!this.configs[tenantId]) {
      this.configs[tenantId] = {
        tenantId,
        provider: 'offline_pod',
        environment: 'sandbox',
        keyId: '',
        maskedSecret: 'Unconfigured',
        webhookUrl: '',
        webhookSecretConfigured: false,
        status: 'unconfigured',
        marketplacePayoutsEnabled: false,
        splitSettlementModel: 'manual_batch',
        supportedMethods: ['offline_pod'],
        updatedAt: new Date().toISOString(),
        updatedBy: 'System Default',
      };
      this.persist('poultry_payment_configs', this.configs);
    }
    return { ...this.configs[tenantId] };
  }

  public updatePaymentConfig(
    tenantId: string,
    updates: Partial<TenantPaymentConfig>,
    updatedBy: string
  ): TenantPaymentConfig {
    const current = this.getPaymentConfig(tenantId);
    const updated: TenantPaymentConfig = {
      ...current,
      ...updates,
      tenantId, // Prevent modifying tenantId
      updatedAt: new Date().toISOString(),
      updatedBy,
    };

    this.configs[tenantId] = updated;
    this.persist('poultry_payment_configs', this.configs);
    return { ...updated };
  }

  // --- PAYMENT ORDER CREATION ---
  public createPaymentOrder(
    tenantId: string,
    orderId: string,
    customerInfo: { id: string; name: string; email: string },
    paymentMethod: 'upi' | 'card' | 'netbanking' | 'wallet' | 'offline_pod' = 'upi'
  ): { success: boolean; transaction: PaymentTransactionRecord; providerOrderId: string; checkoutPayload: Record<string, unknown> } {
    const config = this.getPaymentConfig(tenantId);
    const order = operationsService.getOrderById(orderId);

    if (!order) {
      throw new Error(`Order ${orderId} does not exist.`);
    }

    if (order.tenantId !== tenantId) {
      throw new Error(`Tenant isolation violation: Order does not belong to tenant ${tenantId}.`);
    }

    if (order.orderStatus !== 'pending') {
      throw new Error(`Cannot initiate checkout for order in status [${order.orderStatus}].`);
    }

    // Strict Backend Arithmetic Verification (Prevents client tampering of price/totals)
    const verifiedSubtotal = order.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    const verifiedTotal = verifiedSubtotal + order.deliveryFee;

    if (verifiedTotal !== order.totalAmount) {
      throw new Error(
        `Financial integrity violation: Stored order total (₹${order.totalAmount}) differs from verified item calculations (₹${verifiedTotal}).`
      );
    }

    // Check inventory availability before issuing gateway order
    for (const item of order.items) {
      const prod = operationsService.getProductById(item.productId);
      if (!prod || prod.stockAvailable < item.quantity) {
        throw new Error(
          `Inventory shortfall: Product "${item.title}" has insufficient stock (${prod?.stockAvailable || 0} available, ${item.quantity} requested).`
        );
      }
    }

    const txId = `TXN-${Date.now()}`;
    const providerOrderId = config.provider === 'razorpay'
      ? `order_${Math.random().toString(36).substring(2, 12)}`
      : `cf_order_${Math.random().toString(36).substring(2, 12)}`;

    const transaction: PaymentTransactionRecord = {
      id: txId,
      tenantId,
      orderId,
      customerId: customerInfo.id,
      customerName: customerInfo.name,
      customerEmail: customerInfo.email,
      provider: config.provider,
      providerOrderId,
      amountInr: order.totalAmount,
      currency: 'INR',
      status: 'created',
      paymentMethod,
      refunds: [],
      idempotencyKey: `idem_${txId}_${orderId}`,
      signatureVerified: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.transactions.unshift(transaction);
    this.persist('poultry_payment_transactions', this.transactions);

    // Snapshot Commission for the Seller
    const seller = operationsService.getSellerById(order.sellerId);
    const commissionRate = seller?.commissionRatePercent || 8.0;
    const commissionAmount = Math.round(order.totalAmount * (commissionRate / 100));
    const netPayable = order.totalAmount - commissionAmount;

    const existingSettlementIdx = this.settlements.findIndex((s) => s.orderId === orderId);
    const settlementRecord: SellerSettlementRecord = {
      id: `SETTLE-${Date.now()}`,
      tenantId,
      sellerId: order.sellerId,
      sellerName: order.sellerName,
      orderId,
      orderGrossInr: order.totalAmount,
      commissionRatePercent: commissionRate,
      commissionAmountInr: commissionAmount,
      netPayableInr: netPayable,
      status: 'unsettled',
      bankDetailsSnapshot: seller?.bankDetails || {
        accountNumber: 'N/A',
        ifscCode: 'N/A',
        bankName: 'Unassigned',
        beneficiaryName: order.sellerName,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (existingSettlementIdx >= 0) {
      this.settlements[existingSettlementIdx] = settlementRecord;
    } else {
      this.settlements.unshift(settlementRecord);
    }
    this.persist('poultry_seller_settlements', this.settlements);

    // Provider-specific checkout payload (Sanitized for client consumption, NO secret keys!)
    const checkoutPayload = {
      key: config.keyId,
      order_id: providerOrderId,
      amount: order.totalAmount * 100, // In Paise for Razorpay
      currency: 'INR',
      name: `Apex Poultry Marketplace - ${tenantId}`,
      description: `Payment for Order ${orderId}`,
      prefill: {
        name: customerInfo.name,
        email: customerInfo.email,
      },
      theme: { color: '#2563EB' },
    };

    return {
      success: true,
      transaction,
      providerOrderId,
      checkoutPayload,
    };
  }

  // --- CRYPTOGRAPHIC SIGNATURE & WEBHOOK VERIFICATION ---
  public verifyPaymentSignature(
    tenantId: string,
    providerOrderId: string,
    providerPaymentId: string,
    signature: string
  ): boolean {
    const config = this.getPaymentConfig(tenantId);
    if (!config.webhookSecretConfigured && config.provider !== 'offline_pod') {
      return false;
    }

    // Expected signature calculation logic (HMAC SHA-256 simulation)
    // In production, calculated via: crypto.createHmac('sha256', secret).update(order_id + '|' + payment_id).digest('hex')
    const expectedPrefix = `sig_verified_${providerOrderId}_${providerPaymentId}`;
    return signature.startsWith(expectedPrefix) || signature === 'valid_mock_signature';
  }

  // --- IDEMPOTENT WEBHOOK HANDLER WITH REPLAY PROTECTION ---
  public handleWebhookEvent(
    tenantId: string,
    eventId: string,
    eventType: 'payment.captured' | 'payment.failed' | 'order.paid',
    payload: {
      providerOrderId: string;
      providerPaymentId?: string;
      amountInr: number;
      signature?: string;
      failureReason?: string;
    }
  ): { status: 'processed' | 'duplicate_ignored' | 'invalid_signature' | 'not_found' } {
    // 1. Replay Attack & Duplicate Protection Check
    if (this.processedWebhookEvents.has(eventId)) {
      return { status: 'duplicate_ignored' };
    }

    // 2. Validate Signature if present
    if (payload.signature && payload.providerPaymentId) {
      const isValid = this.verifyPaymentSignature(
        tenantId,
        payload.providerOrderId,
        payload.providerPaymentId,
        payload.signature
      );
      if (!isValid) {
        return { status: 'invalid_signature' };
      }
    }

    // 3. Find Transaction Record
    const tx = this.transactions.find((t) => t.providerOrderId === payload.providerOrderId);
    if (!tx) {
      return { status: 'not_found' };
    }

    if (eventType === 'payment.captured' || eventType === 'order.paid') {
      tx.status = 'captured';
      tx.providerPaymentId = payload.providerPaymentId || `pay_${Date.now()}`;
      tx.signatureVerified = true;
      tx.updatedAt = new Date().toISOString();

      // Update Order Status
      const order = operationsService.getOrderById(tx.orderId);
      if (order) {
        order.paymentStatus = 'settled'; // Marks payment settled
        if (order.orderStatus === 'pending') {
          // Transition order to confirmed upon verified payment receipt
          try {
            operationsService.transitionOrderStatus(
              order.id,
              'confirmed',
              'system_webhook',
              'platform_developer',
              'Razorpay Webhook Processor',
              `Payment verified via webhook ${eventId}. Payment ID: ${tx.providerPaymentId}`
            );
          } catch {
            // Already confirmed or advanced
          }
        }
      }
    } else if (eventType === 'payment.failed') {
      tx.status = 'failed';
      tx.failureReason = payload.failureReason || 'Payment declined by bank';
      tx.updatedAt = new Date().toISOString();

      const order = operationsService.getOrderById(tx.orderId);
      if (order) {
        order.paymentStatus = 'unpaid';
      }
    }

    // Record Event in Idempotency Set
    this.processedWebhookEvents.add(eventId);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(
          'poultry_processed_webhooks',
          JSON.stringify(Array.from(this.processedWebhookEvents))
        );
      } catch {}
    }

    this.persist('poultry_payment_transactions', this.transactions);
    return { status: 'processed' };
  }

  // --- REFUND WORKFLOW ---
  public initiateRefund(
    tenantId: string,
    orderId: string,
    amountInr: number,
    reason: string,
    actorId: string,
    actorName: string
  ): { success: boolean; refund: PaymentRefundRecord; transaction: PaymentTransactionRecord } {
    const tx = this.transactions.find((t) => t.orderId === orderId && t.tenantId === tenantId);
    if (!tx) {
      throw new Error(`Transaction for order ${orderId} not found.`);
    }

    if (tx.status !== 'captured' && tx.status !== 'partially_refunded') {
      throw new Error(`Cannot refund transaction in [${tx.status}] status. Only captured payments can be refunded.`);
    }

    const alreadyRefundedInr = tx.refunds.reduce((sum, r) => sum + r.amountInr, 0);
    const maxRefundable = tx.amountInr - alreadyRefundedInr;

    if (amountInr <= 0 || amountInr > maxRefundable) {
      throw new Error(
        `Invalid refund amount ₹${amountInr}. Maximum refundable balance is ₹${maxRefundable}.`
      );
    }

    // Proportionally reverse commission snapshot
    const settlement = this.settlements.find((s) => s.orderId === orderId);
    const commissionRate = settlement?.commissionRatePercent || 8.0;
    const commissionReversed = Math.round(amountInr * (commissionRate / 100));

    const refundRecord: PaymentRefundRecord = {
      refundId: `ref_${Date.now()}`,
      amountInr,
      reason,
      status: 'processed',
      providerRefundId: `rfnd_${Math.random().toString(36).substring(2, 10)}`,
      commissionReversedInr: commissionReversed,
      initiatedBy: actorId,
      initiatedByName: actorName,
      createdAt: new Date().toISOString(),
    };

    tx.refunds.push(refundRecord);
    const newTotalRefunded = alreadyRefundedInr + amountInr;
    tx.status = newTotalRefunded === tx.amountInr ? 'refunded' : 'partially_refunded';
    tx.updatedAt = new Date().toISOString();

    // Adjust Seller Settlement
    if (settlement) {
      settlement.orderGrossInr = Math.max(0, settlement.orderGrossInr - amountInr);
      settlement.commissionAmountInr = Math.max(0, settlement.commissionAmountInr - commissionReversed);
      settlement.netPayableInr = settlement.orderGrossInr - settlement.commissionAmountInr;
      settlement.status = 'adjusted';
      settlement.updatedAt = new Date().toISOString();
      this.persist('poultry_seller_settlements', this.settlements);
    }

    // Update Order payment status
    const order = operationsService.getOrderById(orderId);
    if (order) {
      order.paymentStatus = tx.status === 'refunded' ? 'refunded' : 'settled';
      order.updatedAt = new Date().toISOString();
    }

    this.persist('poultry_payment_transactions', this.transactions);
    return { success: true, refund: refundRecord, transaction: tx };
  }

  // --- SETTLEMENT ACTIONS ---
  public getSettlements(tenantId: string, sellerId?: string): SellerSettlementRecord[] {
    return this.settlements.filter((s) => {
      const matchTenant = s.tenantId === tenantId;
      if (sellerId) return matchTenant && s.sellerId === sellerId;
      return matchTenant;
    });
  }

  public checkAndAdvanceSettlementEligibility(tenantId: string): number {
    let eligibleCount = 0;
    for (const settle of this.settlements) {
      if (settle.tenantId === tenantId && settle.status === 'unsettled') {
        const order = operationsService.getOrderById(settle.orderId);
        // An order is strictly eligible for settlement ONLY when it reaches terminal 'delivered' state
        if (order && order.orderStatus === 'delivered') {
          settle.status = 'eligible';
          settle.updatedAt = new Date().toISOString();
          eligibleCount++;
        }
      }
    }
    if (eligibleCount > 0) {
      this.persist('poultry_seller_settlements', this.settlements);
    }
    return eligibleCount;
  }

  public processSettlementPayout(
    settlementId: string,
    utrReference: string,
    settledBy: string
  ): SellerSettlementRecord {
    const settle = this.settlements.find((s) => s.id === settlementId);
    if (!settle) {
      throw new Error(`Settlement ${settlementId} not found.`);
    }

    if (settle.status !== 'eligible' && settle.status !== 'unsettled') {
      throw new Error(`Cannot settle record with status [${settle.status}].`);
    }

    settle.status = 'settled';
    settle.utrReference = utrReference;
    settle.settledAt = new Date().toISOString();
    settle.settledBy = settledBy;
    settle.updatedAt = new Date().toISOString();

    this.persist('poultry_seller_settlements', this.settlements);
    return { ...settle };
  }

  // --- QUERY ACCESSORS ---
  public getTransactions(tenantId: string): PaymentTransactionRecord[] {
    return this.transactions.filter((t) => t.tenantId === tenantId);
  }

  public getTransactionById(id: string): PaymentTransactionRecord | undefined {
    return this.transactions.find((t) => t.id === id);
  }
}

export const paymentService = new PaymentService();
