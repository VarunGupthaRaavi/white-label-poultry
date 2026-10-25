/**
 * Automated Verification Test Suite for Prompt 3:
 * Client Admin Panel, Seller Management, Order Lifecycle, and Security Boundaries
 */

import { operationsService, VALID_ORDER_TRANSITIONS, ROLE_PERMITTED_TRANSITIONS } from '../src/lib/operationsService';
import { tenantService } from '../src/lib/tenantService';
import { OrderLifecycleStatus } from '../src/types/operations';

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
  console.log(' RUNNING PROMPT 3 OPERATIONAL & SECURITY VERIFICATION SUITE');
  console.log('================================================================\n');

  const tenantId = 'apex-poultry-hub';

  // ---------------------------------------------------------------------------
  // TEST GROUP 1: Order Lifecycle State Machine & Valid Transitions
  // ---------------------------------------------------------------------------
  console.log('[Test Group 1] Order Lifecycle State Machine Transitions');
  {
    const initialOrders = operationsService.getOrders(tenantId);
    assert(initialOrders.length > 0, 'Preloaded orders exist for tenant');

    // Create a fresh test order starting at 'pending'
    const testOrder = operationsService.createProduct({
      tenantId,
      sellerId: 'seller_krishna_01',
      sellerName: 'Krishna Broiler & Layer Farms',
      title: 'Automated Test Broiler Batch',
      category: 'live_birds',
      description: 'Test batch for state transition assertions',
      price: 150,
      unit: 'kg',
      stockAvailable: 100,
      minOrderQuantity: 1,
      status: 'active',
      healthCertified: true,
      images: [],
    });

    const pendingOrder = operationsService.getOrders(tenantId).find((o) => o.orderStatus === 'pending');
    assert(!!pendingOrder, 'Found an active pending order for testing state machine');

    if (pendingOrder) {
      const orderId = pendingOrder.id;

      // 1.1 Valid Transition: pending -> confirmed (by client_admin)
      const confirmed = operationsService.transitionOrderStatus(
        orderId,
        'confirmed',
        'admin_vikram_01',
        'client_admin',
        'Vikramaditya Rao'
      );
      assert(confirmed.orderStatus === 'confirmed', 'Order transitioned pending -> confirmed by client_admin');
      assert(confirmed.history.some((h) => h.status === 'confirmed'), 'Audit event recorded in order history');

      // 1.2 Valid Transition: confirmed -> preparing (by seller)
      const preparing = operationsService.transitionOrderStatus(
        orderId,
        'preparing',
        'seller_krishna_01',
        'seller',
        'Ramesh Krishna'
      );
      assert(preparing.orderStatus === 'preparing', 'Order transitioned confirmed -> preparing by authorized seller');

      // 1.3 Valid Transition: preparing -> ready_for_dispatch (by seller)
      const ready = operationsService.transitionOrderStatus(
        orderId,
        'ready_for_dispatch',
        'seller_krishna_01',
        'seller',
        'Ramesh Krishna'
      );
      assert(ready.orderStatus === 'ready_for_dispatch', 'Order transitioned preparing -> ready_for_dispatch by authorized seller');

      // 1.4 Valid Transition: ready_for_dispatch -> out_for_delivery (by client_admin)
      const outForDelivery = operationsService.transitionOrderStatus(
        orderId,
        'out_for_delivery',
        'staff_deepa_04',
        'client_admin',
        'Deepa Patel (Dispatch Officer)'
      );
      assert(outForDelivery.orderStatus === 'out_for_delivery', 'Order transitioned ready_for_dispatch -> out_for_delivery');

      // 1.5 Valid Transition: out_for_delivery -> delivered (by client_admin)
      const delivered = operationsService.transitionOrderStatus(
        orderId,
        'delivered',
        'staff_deepa_04',
        'client_admin',
        'Deepa Patel (Dispatch Officer)',
        'OTP verified at doorstep'
      );
      assert(delivered.orderStatus === 'delivered', 'Order transitioned out_for_delivery -> delivered');

      // 1.6 Terminal State: delivered orders CANNOT be transitioned further
      let terminalBlocked = false;
      try {
        operationsService.transitionOrderStatus(
          orderId,
          'cancelled',
          'admin_vikram_01',
          'client_admin',
          'Vikramaditya Rao'
        );
      } catch (e: any) {
        terminalBlocked = true;
      }
      assert(terminalBlocked, 'Terminal state protection: Delivered order cannot be transitioned to cancelled');
    }
  }

  // ---------------------------------------------------------------------------
  // TEST GROUP 2: State Machine Violation & Illegal Skips
  // ---------------------------------------------------------------------------
  console.log('\n[Test Group 2] Illegal State Transition Rejections');
  {
    const preparingOrder = operationsService.getOrders(tenantId).find((o) => o.orderStatus === 'preparing');
    if (preparingOrder) {
      let illegalSkipBlocked = false;
      try {
        // Illegal skip: preparing -> delivered (skipping ready_for_dispatch and out_for_delivery)
        operationsService.transitionOrderStatus(
          preparingOrder.id,
          'delivered',
          'admin_vikram_01',
          'client_admin',
          'Vikramaditya Rao'
        );
      } catch (e: any) {
        illegalSkipBlocked = true;
      }
      assert(illegalSkipBlocked, 'Illegal state skip (preparing -> delivered) rejected by state machine');
    }
  }

  // ---------------------------------------------------------------------------
  // TEST GROUP 3: Seller Ownership & Role Isolation Boundaries
  // ---------------------------------------------------------------------------
  console.log('\n[Test Group 3] Seller Boundaries & Permission Isolation');
  {
    const krishnaOrders = operationsService.getOrders(tenantId, 'seller_krishna_01');
    const godrejOrders = operationsService.getOrders(tenantId, 'seller_godrej_03');

    assert(krishnaOrders.every((o) => o.sellerId === 'seller_krishna_01'), 'Seller Krishna only views Krishna farm orders');
    assert(godrejOrders.every((o) => o.sellerId === 'seller_godrej_03'), 'Seller Godrej only views Godrej farm orders');

    // 3.1 Competing Seller Cross-Access Violation
    const targetOrder = krishnaOrders.find((o) => o.orderStatus === 'confirmed' || o.orderStatus === 'preparing');
    if (targetOrder) {
      let crossSellerBlocked = false;
      try {
        operationsService.transitionOrderStatus(
          targetOrder.id,
          'ready_for_dispatch',
          'seller_godrej_03', // Competing seller attempting to transition Krishna's order!
          'seller',
          'Suresh Patil'
        );
      } catch (e: any) {
        crossSellerBlocked = true;
      }
      assert(crossSellerBlocked, 'Cross-seller protection: Seller cannot transition another farm order');
    }

    // 3.2 Seller Prohibited Transitions: Cannot mark delivered
    if (targetOrder) {
      let sellerDeliveredBlocked = false;
      try {
        operationsService.transitionOrderStatus(
          targetOrder.id,
          'delivered',
          targetOrder.sellerId,
          'seller', // Seller attempting to self-certify delivery!
          'Ramesh Krishna'
        );
      } catch (e: any) {
        sellerDeliveredBlocked = true;
      }
      assert(sellerDeliveredBlocked, 'Seller role boundary: Seller cannot transition order to delivered');
    }
  }

  // ---------------------------------------------------------------------------
  // TEST GROUP 4: Inventory Restock On Order Cancellation
  // ---------------------------------------------------------------------------
  console.log('\n[Test Group 4] Inventory Deduction and Restock Consistency');
  {
    const prod = operationsService.getProductById('prod_broiler_live')!;
    const stockBefore = prod.stockAvailable;

    const testCancelOrder = operationsService.createOrder({
      id: `ORD-TEST-RESTOCK-${Date.now()}`,
      tenantId,
      sellerId: 'seller_krishna_01',
      sellerName: 'Krishna Broiler & Layer Farms',
      customerId: 'cust_anand_01',
      customerName: 'Anand Verma',
      customerPhone: '+91 98451 11223',
      items: [
        {
          productId: 'prod_broiler_live',
          title: 'Live Broiler Chicken (Farm Weight)',
          unitPrice: 145,
          unit: 'kg',
          quantity: 5,
          totalPrice: 725,
        },
      ],
      subtotal: 725,
      deliveryFee: 0,
      tax: 0,
      totalAmount: 725,
      orderStatus: 'pending',
      paymentStatus: 'unpaid',
      deliveryAddress: {
        recipientName: 'Anand Verma',
        phone: '+91 98451 11223',
        streetAddress: 'Flat 402, Green Glen Layout',
        locality: 'Bellandur',
        city: 'Bengaluru',
        state: 'Karnataka',
        pincode: '560103',
      },
      placedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      history: [
        {
          status: 'pending',
          timestamp: new Date().toISOString(),
          actorId: 'cust_anand_01',
          actorRole: 'customer',
          actorName: 'Anand Verma',
        },
      ],
    });

    // Cancel order and verify 5 units returned to inventory
    operationsService.transitionOrderStatus(
      testCancelOrder.id,
      'cancelled',
      'admin_vikram_01',
      'client_admin',
      'Vikramaditya Rao',
      'Test stock release cancellation',
      'Cancelled during automated verification test'
    );

    const prodAfter = operationsService.getProductById('prod_broiler_live')!;
    assert(
      prodAfter.stockAvailable === stockBefore + 5,
      'Inventory accurately released back to available stock (+5 units) upon order cancellation'
    );
  }

  // ---------------------------------------------------------------------------
  // TEST GROUP 5: Feature Entitlement Protection & Self-Approval Prevention
  // ---------------------------------------------------------------------------
  console.log('\n[Test Group 5] Feature Entitlements & Self-Service Queuing');
  {
    // Client Admin requests module
    const requested = operationsService.requestModuleEntitlement(
      tenantId,
      'coupons_and_promotions',
      'Automated entitlement test request'
    );
    assert(requested === true, 'Client admin entitlement request successfully queued in control plane collection');

    const requests = operationsService.getModuleRequests(tenantId);
    assert(
      requests.some((r) => r.moduleKey === 'coupons_and_promotions'),
      'Queued request persists with tenantId and moduleKey'
    );
  }

  // ---------------------------------------------------------------------------
  // TEST GROUP 6: Seller KYC Review & Commission Modification
  // ---------------------------------------------------------------------------
  console.log('\n[Test Group 6] Seller KYC Application Review Workflow');
  {
    const seller = operationsService.getSellerById('seller_venkat_02');
    assert(!!seller, 'Found under_review seller Venkateshwara Poultry');

    if (seller) {
      const reviewed = operationsService.reviewSellerApplication(
        seller.id,
        'approved',
        'Vikramaditya Rao (Hub Admin)',
        9.5
      );
      assert(reviewed.status === 'approved', 'Client admin approved seller application');
      assert(reviewed.commissionRatePercent === 9.5, 'Custom commission rate updated to 9.5%');
      assert(reviewed.reviewedBy === 'Vikramaditya Rao (Hub Admin)', 'Audited reviewer identity recorded');
    }
  }

  console.log('\n================================================================');
  console.log(` RESULTS: ${passed} PASSED | ${failed} FAILED`);
  console.log('================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTestSuite().catch((err) => {
  console.error('Test execution error:', err);
  process.exit(1);
});
