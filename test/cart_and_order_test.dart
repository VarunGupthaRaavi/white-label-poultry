import 'package:flutter_test/flutter_test.dart';
import 'package:poulty_farm/domain/models/product.dart';
import 'package:poulty_farm/domain/models/address.dart';
import 'package:poulty_farm/domain/models/order.dart';
import 'package:poulty_farm/domain/repositories/i_cart_repository.dart';
import 'package:poulty_farm/data/in_memory_cart_repository.dart';
import 'package:poulty_farm/data/in_memory_order_repository.dart';
import 'package:poulty_farm/state/cart_provider.dart';
import 'package:poulty_farm/state/order_provider.dart';

void main() {
  const sellerAProduct = Product(
    id: 'prod_broiler_01',
    title: 'Commercial Broiler Chicken (Live / Whole)',
    category: 'Broiler Chicken',
    description: 'Cobb 500 broiler bird',
    price: 145.0, // ₹ 145 per kg
    unit: 'kg',
    stockAvailable: 100,
    minOrderQuantity: 2,
    sellerId: 'seller_krishna_01',
    sellerName: 'Krishna Poultry Farms & Hatcheries',
    sellerCity: 'Hosur, Tamil Nadu',
    images: ['https://example.com/broiler.jpg'],
  );

  const sellerAProduct2 = Product(
    id: 'prod_eggs_02',
    title: 'Farm Fresh White Table Eggs (Tray of 30)',
    category: 'Eggs',
    description: '30 table eggs tray',
    price: 195.0, // ₹ 195 per tray
    unit: 'tray (30 eggs)',
    stockAvailable: 50,
    minOrderQuantity: 1,
    sellerId: 'seller_krishna_01',
    sellerName: 'Krishna Poultry Farms & Hatcheries',
    sellerCity: 'Hosur, Tamil Nadu',
    images: ['https://example.com/eggs.jpg'],
  );

  const sellerBProduct = Product(
    id: 'prod_cuts_03',
    title: 'Prime Curry Cut Chicken (Skinless)',
    category: 'Chicken Meat and Cuts',
    description: 'Vacuum packed curry cut',
    price: 130.0, // ₹ 130 per pack
    unit: '500g pack',
    stockAvailable: 30,
    minOrderQuantity: 1,
    sellerId: 'seller_venkateshwara_02',
    sellerName: 'Venkateshwara Fresh Meats',
    sellerCity: 'Bengaluru, Karnataka',
    images: ['https://example.com/meat.jpg'],
  );

  const outOfStockProduct = Product(
    id: 'prod_incubator_04',
    title: 'Digital Automatic Egg Incubator',
    category: 'Hatchery Equipment',
    description: 'Incubator 528 eggs',
    price: 14500.0,
    unit: 'unit',
    stockAvailable: 0,
    minOrderQuantity: 1,
    sellerId: 'seller_krishna_01',
    sellerName: 'Krishna Poultry Farms & Hatcheries',
    sellerCity: 'Hosur, Tamil Nadu',
    images: ['https://example.com/incubator.jpg'],
    isAvailable: false,
  );

  const testAddress = DeliveryAddress(
    id: 'addr_test',
    recipientName: 'Suresh Kumar',
    phone: '+91-98765-43210',
    streetAddress: 'Plot 42, Farm Road',
    locality: 'Yelahanka',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560064',
    isDefault: true,
  );

  group('Cart Calculations & Single-Seller Rules', () {
    late InMemoryCartRepository cartRepo;
    late CartProvider cartProvider;

    setUp(() {
      cartRepo = InMemoryCartRepository();
      cartProvider = CartProvider(cartRepo);
    });

    test(
      'Calculates subtotal, delivery fee, GST tax, and total in Indian Rupees',
      () {
        // Add 2 kg Broiler Chicken @ ₹ 145/kg = ₹ 290
        cartProvider.addToCart(sellerAProduct, quantity: 2);
        expect(cartProvider.subtotal, 290.0);

        // Subtotal < ₹ 500 should incur ₹ 50 delivery fee
        expect(cartProvider.deliveryFee, 50.0);

        // GST at 5% on ₹ 290 = ₹ 14.50
        expect(cartProvider.tax, 14.50);

        // Total = 290 + 50 + 14.50 = 354.50
        expect(cartProvider.totalAmount, 354.50);

        // Add 2 trays of eggs @ ₹ 195/tray = ₹ 390 -> Subtotal = 290 + 390 = ₹ 680
        cartProvider.addToCart(sellerAProduct2, quantity: 2);
        expect(cartProvider.subtotal, 680.0);

        // Subtotal >= ₹ 500 qualifies for FREE delivery (₹ 0)
        expect(cartProvider.deliveryFee, 0.0);

        // GST 5% on ₹ 680 = ₹ 34.00
        expect(cartProvider.tax, 34.00);

        // Grand Total = 680 + 0 + 34 = 714.00
        expect(cartProvider.totalAmount, 714.00);
      },
    );

    test('Enforces single-seller constraint by detecting conflicts', () {
      cartProvider.addToCart(sellerAProduct, quantity: 2);
      expect(cartProvider.currentSellerId, 'seller_krishna_01');

      // Attempting to check conflict for seller B product returns true
      expect(cartProvider.causesSellerConflict(sellerBProduct), isTrue);

      // Attempting to add seller B directly throws SellerConflictException
      expect(
        () => cartProvider.addToCart(sellerBProduct, quantity: 1),
        throwsA(isA<SellerConflictException>()),
      );

      // User confirmed replacement clears previous items and starts new single-seller cart
      cartProvider.replaceCartWith(sellerBProduct, quantity: 1);
      expect(cartProvider.currentSellerId, 'seller_venkateshwara_02');
      expect(cartProvider.items.length, 1);
      expect(cartProvider.items.first.product.id, 'prod_cuts_03');
    });

    test('Enforces minimum order quantity when decrementing', () {
      // Broiler minOrderQuantity is 2
      cartProvider.addToCart(sellerAProduct, quantity: 3);
      expect(cartProvider.items.first.quantity, 3);

      cartProvider.decrementQuantity(sellerAProduct.id);
      expect(cartProvider.items.first.quantity, 2);

      // Decrementing below minOrderQuantity removes the item from cart
      cartProvider.decrementQuantity(sellerAProduct.id);
      expect(cartProvider.items.isEmpty, isTrue);
    });
  });

  group('Order Validation & Payment-Pending State', () {
    late InMemoryOrderRepository orderRepo;
    late OrderProvider orderProvider;

    setUp(() {
      orderRepo = InMemoryOrderRepository();
      orderProvider = OrderProvider(orderRepo);
    });

    test('Rejects order creation for empty cart', () async {
      final order = await orderProvider.placeOrder(
        tenantId: 'apex_poultry',
        customerId: 'cust_01',
        customerName: 'Suresh Kumar',
        cartItems: [],
        deliveryAddress: testAddress,
      );

      expect(order, isNull);
      expect(orderProvider.errorMessage, contains('empty cart'));
    });

    test('Rejects order creation for out of stock products', () async {
      final cartRepo = InMemoryCartRepository();
      final cart = CartProvider(cartRepo);
      // Force add out of stock product for testing
      cartRepo.addItem(outOfStockProduct, 1);

      final order = await orderProvider.placeOrder(
        tenantId: 'apex_poultry',
        customerId: 'cust_01',
        customerName: 'Suresh Kumar',
        cartItems: cart.items,
        deliveryAddress: testAddress,
      );

      expect(order, isNull);
      expect(orderProvider.errorMessage, contains('unavailable'));
    });

    test(
      'Rejects order creation if quantity is less than minimum order quantity',
      () async {
        final cartRepo = InMemoryCartRepository();
        // SellerA minOrderQuantity is 2, force 1 item
        cartRepo.addItem(sellerAProduct, 1);

        final order = await orderProvider.placeOrder(
          tenantId: 'apex_poultry',
          customerId: 'cust_01',
          customerName: 'Suresh Kumar',
          cartItems: cartRepo.getItems(),
          deliveryAddress: testAddress,
        );

        expect(order, isNull);
        expect(orderProvider.errorMessage, contains('Minimum order quantity'));
      },
    );

    test(
      'Creates valid order in PaymentStatus.pending with historical snapshots',
      () async {
        final cartRepo = InMemoryCartRepository();
        cartRepo.addItem(sellerAProduct, 2); // 2 * 145 = 290
        cartRepo.addItem(sellerAProduct2, 1); // 1 * 195 = 195 -> Subtotal = 485

        final order = await orderProvider.placeOrder(
          tenantId: 'apex_poultry',
          customerId: 'cust_01',
          customerName: 'Suresh Kumar',
          cartItems: cartRepo.getItems(),
          deliveryAddress: testAddress,
          customerNotes: 'Please call before arrival',
        );

        expect(order, isNotNull);
        expect(
          order!.paymentStatus,
          PaymentStatus.pending,
        ); // Explicit unpaid / pending workflow
        expect(order.orderStatus, OrderStatus.placed);
        expect(order.tenantId, 'apex_poultry');
        expect(order.sellerId, 'seller_krishna_01');
        expect(order.subtotal, 485.0);
        expect(order.deliveryFee, 50.0); // Subtotal < 500
        expect(order.tax, 24.25); // 5% GST
        expect(order.totalAmount, 559.25);

        // Verify item snapshots preserve historical price and title
        expect(order.items.length, 2);
        expect(order.items[0].unitPrice, 145.0);
        expect(order.items[0].title, sellerAProduct.title);
        expect(order.items[1].unitPrice, 195.0);
        expect(order.items[1].title, sellerAProduct2.title);
      },
    );
  });
}
