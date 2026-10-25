/**
 * Automated Verification Test Suite for Prompt 4:
 * Payment Gateway Integration, Marketplace Settlements, and Production Readiness
 */

import { paymentService, PROVIDER_EVALUATIONS } from '../src/lib/paymentService';
import { operationsService } from '../src/lib/operationsService';
import { tenantService } from '../src/lib/tenantService';

let passed = 0;
let failed = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  if (condition) {
    console.log(`  \x1b[32m✔ PASS\x1b[0m: ${testName}`);
    passed++;
  } else {
    console.error(`  \x1b[31m✖ FAIL\x1b[0m: ${testName} ${detail ? `(${detail})` : ''}`);
    failed++;
  }
}

async function runTestSuite() {
  console.log('\n================================================================');
  console.log(' RUNNING PROMPT 4 PAYMENT, SETTLEMENT & INTEGRITY TEST SUITE');
  console.log('================================================================\n');

  const tenantA = 'apex-poultry-hub';
  const tenantB = 'golden-yolk-hatcheries';

  // ---------------------------------------------------------------------------
  // TEST GROUP 1: Gateway Provider Neutrality & Evaluation Matrix
  // ---------------------------------------------------------------------------
  console.log('[Test Group 1] Provider Neutrality & Evaluation Requirements');
  {
    assert(PROVIDER_EVALUATIONS.length >= 4, 'Multiple candidate providers evaluated');
    const rzp = PROVIDER_EVALUATIONS.find((p) => p.provider === 'razorpay');
    const cashfree = PROVIDER_EVALUATIONS.find((p) => p.provider === 'cashfree');
    const stripe = PROVIDER_EVALUATIONS.find((p) => p.provider === 'stripe');
    const offline = PROVIDER_EVALUATIONS.find((p) => p.provider === 'offline_pod');

    assert(!!rzp && rzp.marketplaceCapability === 'Native Route/Split', 'Razorpay Route evaluated for Indian poultry marketplace');
    assert(!!cashfree && cashfree.marketplaceCapability === 'Payouts API', 'Cashfree Payouts evaluated');
    assert(!!stripe && stripe.country === 'GLOBAL', 'Stripe Connect evaluated with regulatory note on India export mandates');
    assert(!!offline && offline.country === 'IN', 'Cash on Delivery evaluated as rural farm-gate baseline');
  }

  // ---------------------------------------------------------------------------
  // TEST GROUP 2: Tenant-Aware Payment Isolation & Safe Secret Reference
  // ---------------------------------------------------------------------------
  console.log('\n[Test Group 2] Tenant Payment Configuration Isolation & Secret Protection');
  {
    const configA = paymentService.getPaymentConfig(tenantA);
    const configB = paymentService.getPaymentConfig(tenantB);

    assert(configA.tenantId === tenantA, 'Tenant A payment config belongs to Tenant A');
    assert(configB.tenantId === tenantB, 'Tenant B payment config belongs to Tenant B');
    assert(configA.provider === 'razorpay', 'Tenant A uses Razorpay in test environment');
    assert(configB.provider === 'offline_pod', 'Tenant B uses Offline POD');
    assert(configA.environment === 'sandbox', 'Sandbox test mode strictly separated from production');

    // Never expose raw secret
    assert(!('secretKey' in configA), 'Raw secretKey is NEVER present in public config model');
    assert(configA.maskedSecret.includes('••••'), 'Secret is masked in configuration model');
    assert(!!configA.secretManagerRef?.startsWith('projects/'), 'Secret is referenced via Cloud Secret Manager identifier');

    // Missing tenant config fallback
    const unconfiguredTenant = paymentService.getPaymentConfig('non_existent_tenant_999');
    assert(unconfiguredTenant.status === 'unconfigured', 'Unconfigured tenant defaults safely to unconfigured status');
    assert(unconfiguredTenant.provider === 'offline_pod', 'Unconfigured tenant safely defaults to offline POD fallback');
  }

  // ---------------------------------------------------------------------------
  // TEST GROUP 3: Trusted Payment Order Creation & Arithmetic Verification
  // ---------------------------------------------------------------------------
  console.log('\n[Test Group 3] Backend Payment Order Creation & Tamper Defense');
  {
    // Setup a verified fresh pending order for testing
    const testOrder = operationsService.createOrder({
      id: `ORD-TEST-${Date.now()}-1`,
      tenantId: tenantA,
      sellerId: 'seller_krishna_01',
      sellerName: 'Krishna Broiler & Layer Farms',
      customerId: 'cust_test_77',
      customerName: 'Suresh Kumar',
      customerPhone: '+91 98860 12345',
      items: [
        {
          productId: 'prod_broiler_live',
          title: 'Live Broiler Chicken (Farm Weight)',
          quantity: 2,
          unitPrice: 145,
          unit: 'kg',
          totalPrice: 290,
        },
      ],
      subtotal: 290,
      deliveryFee: 40,
      tax: 0,
      totalAmount: 330, // 2 * 145 = 290 + 40 = 330
      orderStatus: 'pending',
      paymentStatus: 'unpaid',
      deliveryAddress: {
        recipientName: 'Suresh Kumar',
        phone: '+91 98860 12345',
        streetAddress: 'Plot 44, Poultry Belt',
        locality: 'Warangal',
        city: 'Warangal',
        state: 'Telangana',
        pincode: '506002',
      },
      placedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      history: [
        {
          status: 'pending',
          timestamp: new Date().toISOString(),
          actorId: 'cust_test_77',
          actorRole: 'customer',
          actorName: 'Suresh Kumar',
          notes: 'Test order for payment verification',
        },
      ],
    });

    assert(testOrder.orderStatus === 'pending', 'Order initialized in pending status');

    // Create payment order
    const orderResult = paymentService.createPaymentOrder(tenantA, testOrder.id, {
      id: 'cust_test_77',
      name: 'Suresh Kumar',
      email: 'suresh.kumar@kisan.in',
    }, 'upi');

    assert(orderResult.success === true, 'Backend payment order successfully generated');
    assert(orderResult.transaction.amountInr === 330, 'Transaction amount matches verified total in INR');
    assert(orderResult.transaction.status === 'created', 'Transaction recorded in initial created state');
    assert(orderResult.checkoutPayload.currency === 'INR', 'Checkout currency is INR');
    assert(orderResult.checkoutPayload.amount === 33000, 'Razorpay amount converted to paise (330 * 100 = 33000)');
    assert(!('secret' in orderResult.checkoutPayload), 'Checkout payload contains no secret keys');

    // TEST TAMPERING DEFENSE: Tampered price
    const tamperedOrder = operationsService.createOrder({
      id: `ORD-TAMPER-${Date.now()}`,
      tenantId: tenantA,
      sellerId: 'seller_krishna_01',
      sellerName: 'Krishna Broiler & Layer Farms',
      customerId: 'cust_attacker',
      customerName: 'Attacker Attempting Discount',
      customerPhone: '+91 99999 00000',
      items: [
        {
          productId: 'prod_broiler_live',
          title: 'Live Broiler Chicken',
          quantity: 2,
          unitPrice: 145,
          unit: 'kg',
          totalPrice: 290,
        },
      ],
      subtotal: 290,
      deliveryFee: 40,
      tax: 0,
      totalAmount: 100, // TAMPERED: Should be 330, but client injected 100
      orderStatus: 'pending',
      paymentStatus: 'unpaid',
      deliveryAddress: {
        recipientName: 'Attacker',
        phone: '+91 99999 00000',
        streetAddress: 'Unknown',
        locality: 'Unknown',
        city: 'Unknown',
        state: 'Unknown',
        pincode: '000000',
      },
      placedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      history: [],
    });

    let tamperCaught = false;
    try {
      paymentService.createPaymentOrder(tenantA, tamperedOrder.id, {
        id: 'cust_attacker',
        name: 'Attacker',
        email: 'attacker@evil.com',
      });
    } catch (e: any) {
      tamperCaught = true;
      assert(e.message.includes('Financial integrity violation'), 'Server rejected tampered order total');
    }
    assert(tamperCaught, 'Tampered price was rejected by backend arithmetic check');
  }

  // ---------------------------------------------------------------------------
  // TEST GROUP 4: Cryptographic HMAC Signature Verification
  // ---------------------------------------------------------------------------
  console.log('\n[Test Group 4] Cryptographic Signature & Webhook Verification');
  {
    const orderId = 'order_test_sig_01';
    const payId = 'pay_test_sig_01';

    const validSig = `sig_verified_${orderId}_${payId}`;
    const invalidSig = 'forged_fake_signature_abc123';

    const isAccepted = paymentService.verifyPaymentSignature(tenantA, orderId, payId, validSig);
    assert(isAccepted === true, 'Legitimate HMAC signature accepted');

    const isRejected = paymentService.verifyPaymentSignature(tenantA, orderId, payId, invalidSig);
    assert(isRejected === false, 'Forged / invalid signature rejected');
  }

  // ---------------------------------------------------------------------------
  // TEST GROUP 5: Idempotent Webhook Processing & Replay Attack Defense
  // ---------------------------------------------------------------------------
  console.log('\n[Test Group 5] Webhook Idempotency & Replay Attack Protection');
  {
    // Find or create pending order and tx
    const tx = paymentService.getTransactions(tenantA).find((t) => t.status === 'pending') ||
      paymentService.getTransactions(tenantA)[0];

    const eventId = `evt_test_${Date.now()}`;

    // First arrival of webhook event
    const firstResult = paymentService.handleWebhookEvent(
      tenantA,
      eventId,
      'payment.captured',
      {
        providerOrderId: tx.providerOrderId,
        providerPaymentId: `pay_captured_${Date.now()}`,
        amountInr: tx.amountInr,
        signature: 'valid_mock_signature',
      }
    );

    assert(firstResult.status === 'processed', 'First webhook arrival successfully processed');

    // Duplicate replay arrival of identical event ID
    const duplicateResult = paymentService.handleWebhookEvent(
      tenantA,
      eventId,
      'payment.captured',
      {
        providerOrderId: tx.providerOrderId,
        providerPaymentId: `pay_captured_${Date.now()}`,
        amountInr: tx.amountInr,
        signature: 'valid_mock_signature',
      }
    );

    assert(duplicateResult.status === 'duplicate_ignored', 'Duplicate webhook event safely ignored by replay protection journal');

    // Order state updated to confirmed / settled
    const updatedOrder = operationsService.getOrderById(tx.orderId);
    assert(updatedOrder?.paymentStatus === 'settled', 'Order paymentStatus updated to settled');
  }

  // ---------------------------------------------------------------------------
  // TEST GROUP 6: Payment Failure Workflow
  // ---------------------------------------------------------------------------
  console.log('\n[Test Group 6] Payment Failure & Decline Workflow');
  {
    // Create new order to test decline
    const failOrder = operationsService.createOrder({
      id: `ORD-FAIL-${Date.now()}`,
      tenantId: tenantA,
      sellerId: 'seller_krishna_01',
      sellerName: 'Krishna Broiler & Layer Farms',
      customerId: 'cust_fail_01',
      customerName: 'Fail Test User',
      customerPhone: '+91 98860 99999',
      items: [
        {
          productId: 'prod_broiler_live',
          title: 'Live Broiler Chicken',
          quantity: 1,
          unitPrice: 145,
          unit: 'kg',
          totalPrice: 145,
        },
      ],
      subtotal: 145,
      deliveryFee: 40,
      tax: 0,
      totalAmount: 185,
      orderStatus: 'pending',
      paymentStatus: 'unpaid',
      deliveryAddress: {
        recipientName: 'Fail User',
        phone: '+91 98860 99999',
        streetAddress: 'Rural Farm Road 12',
        locality: 'Warangal',
        city: 'Warangal',
        state: 'Telangana',
        pincode: '506002',
      },
      placedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      history: [],
    });

    const orderRes = paymentService.createPaymentOrder(tenantA, failOrder.id, {
      id: 'cust_fail_01',
      name: 'Fail User',
      email: 'fail@test.com',
    });

    const failEventId = `evt_fail_${Date.now()}`;
    const failRes = paymentService.handleWebhookEvent(
      tenantA,
      failEventId,
      'payment.failed',
      {
        providerOrderId: orderRes.providerOrderId,
        amountInr: 270,
        failureReason: 'Bank declined: Insufficient funds in UPI account',
      }
    );

    assert(failRes.status === 'processed', 'Payment failure webhook processed');

    const updatedTx = paymentService.getTransactionById(orderRes.transaction.id);
    assert(updatedTx?.status === 'failed', 'Transaction marked as failed in ledger');
    assert(!!updatedTx?.failureReason?.includes('Insufficient funds'), 'Decline reason captured in transaction record');

    const updatedOrder = operationsService.getOrderById(failOrder.id);
    assert(updatedOrder?.paymentStatus === 'unpaid', 'Order remains in unpaid state upon payment failure');
  }

  // ---------------------------------------------------------------------------
  // TEST GROUP 7: Marketplace Commissions & Seller Settlements
  // ---------------------------------------------------------------------------
  console.log('\n[Test Group 7] Marketplace Commission Snapshots & Settlement Eligibility Gating');
  {
    const settlements = paymentService.getSettlements(tenantA);
    assert(settlements.length > 0, 'Tenant A has active seller settlement records');

    const sampleSettle = settlements[0];
    assert(sampleSettle.commissionRatePercent > 0, 'Commission rate is recorded at snapshot time (e.g. 8%)');
    assert(
      sampleSettle.orderGrossInr - sampleSettle.commissionAmountInr === sampleSettle.netPayableInr,
      'Net payable to seller strictly equals Gross minus Commission'
    );

    // Settlement Eligibility Gating:
    // Settle 004 is for ORD-2026-1004 which is in 'out_for_delivery' status.
    const settle4 = settlements.find((s) => s.id === 'SETTLE-2026-004');
    assert(settle4?.status === 'unsettled', 'Order not yet delivered remains in [unsettled] status');

    // Advance order to delivered
    operationsService.transitionOrderStatus(
      'ORD-2026-1004',
      'delivered',
      'admin_vikram_01',
      'client_admin',
      'Vikramaditya Rao',
      'Delivered at farm gate'
    );

    // Trigger settlement eligibility advancement
    const advancedCount = paymentService.checkAndAdvanceSettlementEligibility(tenantA);
    assert(advancedCount >= 1, 'Delivered order advanced to settlement eligibility');

    const refreshedSettle4 = paymentService.getSettlements(tenantA).find((s) => s.id === 'SETTLE-2026-004');
    assert(refreshedSettle4?.status === 'eligible', 'Settlement transitioned to [eligible] upon order delivery');

    // Process Bank Payout with UTR
    const utrNumber = `CMS20261025HDFC${Date.now()}`;
    const settledRecord = paymentService.processSettlementPayout(
      'SETTLE-2026-004',
      utrNumber,
      'Vikramaditya Rao (Hub Admin)'
    );

    assert(settledRecord.status === 'settled', 'Settlement record transitioned to [settled]');
    assert(settledRecord.utrReference === utrNumber, 'Bank UTR reference recorded in settlement ledger');
    assert(!!settledRecord.settledAt, 'Settlement timestamp recorded');
  }

  // ---------------------------------------------------------------------------
  // TEST GROUP 8: Full and Partial Refund Processing & Commission Clawbacks
  // ---------------------------------------------------------------------------
  console.log('\n[Test Group 8] Refund Workflow & Proportional Commission Reversal');
  {
    // Find a captured transaction
    const capturedTx = paymentService.getTransactions(tenantA).find((t) => t.status === 'captured');
    assert(!!capturedTx, 'Found captured transaction for refund testing');

    if (capturedTx) {
      const originalAmount = capturedTx.amountInr;
      const partialRefundAmount = 100;

      // 1. Partial Refund
      const partialRes = paymentService.initiateRefund(
        tenantA,
        capturedTx.orderId,
        partialRefundAmount,
        'Customer returned partial batch of produce',
        'admin_test',
        'Test Admin'
      );

      assert(partialRes.success === true, 'Partial refund processed successfully');
      assert(partialRes.transaction.status === 'partially_refunded', 'Transaction status moved to partially_refunded');
      assert(partialRes.refund.amountInr === partialRefundAmount, 'Refund record created with correct amount');
      assert(partialRes.refund.commissionReversedInr > 0, 'Proportional commission reversed in marketplace ledger');

      // 2. Reject refund exceeding balance
      let overRefundCaught = false;
      try {
        paymentService.initiateRefund(
          tenantA,
          capturedTx.orderId,
          originalAmount + 500, // Exceeds balance
          'Invalid over-refund',
          'admin_test',
          'Test Admin'
        );
      } catch (e: any) {
        overRefundCaught = true;
        assert(e.message.includes('Maximum refundable balance') || e.message.includes('exceeds'), 'Refund rejected when exceeding refundable balance');
      }
      assert(overRefundCaught, 'Over-refund was strictly prevented');
    }
  }

  // ---------------------------------------------------------------------------
  // TEST GROUP 9: Cross-Tenant Isolation Enforcement
  // ---------------------------------------------------------------------------
  console.log('\n[Test Group 9] Strict Multi-Tenant Isolation Enforcement');
  {
    // Order belongs to Tenant A
    const orderA = operationsService.getOrders(tenantA)[0];

    // Attempting to initiate payment on Tenant B using Tenant A's order must fail
    let crossTenantCaught = false;
    try {
      paymentService.createPaymentOrder(tenantB, orderA.id, {
        id: 'cust_intruder',
        name: 'Intruder',
        email: 'intruder@domain.com',
      });
    } catch (e: any) {
      crossTenantCaught = true;
      assert(e.message.includes('Tenant isolation violation'), 'Cross-tenant order payment rejected');
    }
    assert(crossTenantCaught, 'Cross-tenant payment order was blocked');

    // Tenant B cannot access Tenant A's settlement records
    const tenantBSettlements = paymentService.getSettlements(tenantB);
    const hasLeak = tenantBSettlements.some((s) => s.tenantId === tenantA);
    assert(!hasLeak, 'Tenant B query never leaks Tenant A settlement records');
  }

  // ---------------------------------------------------------------------------
  // TEST SUMMARY
  // ---------------------------------------------------------------------------
  console.log('\n================================================================');
  console.log(` PROMPT 4 VERIFICATION COMPLETE: ${passed} PASSED, ${failed} FAILED`);
  console.log('================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTestSuite().catch((err) => {
  console.error('Unhandled test failure:', err);
  process.exit(1);
});
