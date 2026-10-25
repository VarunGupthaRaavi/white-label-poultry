import {
  SellerRecord,
  AdminProductRecord,
  AdminOrderRecord,
  CustomerRecord,
  StaffAccountRecord,
  CouponRecord,
  ReviewRecord,
  TenantOperationalSettings,
  OrderLifecycleStatus,
  OrderTransitionEvent,
  SellerApplicationStatus,
} from '../types/operations';

// Initial preloaded mock data for Indian Poultry Tenants
const INITIAL_SELLERS: SellerRecord[] = [
  {
    id: 'seller_krishna_01',
    tenantId: 'apex-poultry-hub',
    name: 'Ramesh Krishna',
    farmName: 'Krishna Broiler & Layer Farms',
    contactEmail: 'ramesh@krishnafarms.in',
    contactPhone: '+91 98450 12345',
    farmAddress: 'Plot 42, Devanahalli Rural Agricultural Zone',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '562110',
    fssaiNumber: '10020042000123',
    farmCapacityBirds: 25000,
    status: 'approved',
    appliedAt: '2026-09-10T08:30:00Z',
    reviewedAt: '2026-09-12T11:00:00Z',
    reviewedBy: 'Vikramaditya Rao (Client Admin)',
    commissionRatePercent: 8.0,
    bankDetails: {
      accountNumber: '50100456789012',
      ifscCode: 'HDFC0001234',
      bankName: 'HDFC Bank',
      beneficiaryName: 'Krishna Broiler Farms Pvt Ltd',
    },
    documents: [
      {
        name: 'Veterinary_Health_Inspection_Pass_2026.pdf',
        type: 'veterinary_pass',
        fileUrl: 'https://storage.cloud.google.com/poultry-platform-kyc/krishna/vet_pass.pdf',
        verified: true,
      },
      {
        name: 'Biosecurity_Audit_ISO22000.pdf',
        type: 'biosecurity_audit',
        fileUrl: 'https://storage.cloud.google.com/poultry-platform-kyc/krishna/biosecurity.pdf',
        verified: true,
      },
      {
        name: 'FSSAI_Central_License_Certificate.pdf',
        type: 'fssai_cert',
        fileUrl: 'https://storage.cloud.google.com/poultry-platform-kyc/krishna/fssai.pdf',
        verified: true,
      },
    ],
  },
  {
    id: 'seller_venkat_02',
    tenantId: 'apex-poultry-hub',
    name: 'Venkatesh Murthy',
    farmName: 'Venkateshwara Free-Range Poultry',
    contactEmail: 'venkat@vfrpoultry.in',
    contactPhone: '+91 94480 98765',
    farmAddress: 'Survey No. 118, Nelamangala Taluk',
    city: 'Bengaluru Rural',
    state: 'Karnataka',
    pincode: '562123',
    fssaiNumber: '10020042000888',
    farmCapacityBirds: 15000,
    status: 'under_review',
    appliedAt: '2026-10-20T14:15:00Z',
    commissionRatePercent: 10.0,
    bankDetails: {
      accountNumber: '91201002345678',
      ifscCode: 'UTIB0000456',
      bankName: 'Axis Bank',
      beneficiaryName: 'Venkatesh Murthy',
    },
    documents: [
      {
        name: 'State_Vet_Certificate_Draft.pdf',
        type: 'veterinary_pass',
        fileUrl: 'https://storage.cloud.google.com/poultry-platform-kyc/venkat/vet_pass.pdf',
        verified: false,
      },
      {
        name: 'FSSAI_Application_Receipt.pdf',
        type: 'fssai_cert',
        fileUrl: 'https://storage.cloud.google.com/poultry-platform-kyc/venkat/fssai_ack.pdf',
        verified: false,
      },
    ],
  },
  {
    id: 'seller_godrej_03',
    tenantId: 'apex-poultry-hub',
    name: 'Suresh Patil',
    farmName: 'Godrej Agrovet Contract Partner',
    contactEmail: 'suresh.patil@agropartners.in',
    contactPhone: '+91 97410 55432',
    farmAddress: 'Kolar Agro Belt, Sector 3',
    city: 'Kolar',
    state: 'Karnataka',
    pincode: '563101',
    fssaiNumber: '10018042000999',
    farmCapacityBirds: 50000,
    status: 'approved',
    appliedAt: '2026-08-01T09:00:00Z',
    reviewedAt: '2026-08-05T15:30:00Z',
    reviewedBy: 'Vikramaditya Rao (Client Admin)',
    commissionRatePercent: 7.5,
    bankDetails: {
      accountNumber: '30998877665544',
      ifscCode: 'SBIN0004567',
      bankName: 'State Bank of India',
      beneficiaryName: 'Patil Poultry Enterprise',
    },
    documents: [
      {
        name: 'Integrated_Agrovet_Biosecurity_Cert.pdf',
        type: 'biosecurity_audit',
        fileUrl: 'https://storage.cloud.google.com/poultry-platform-kyc/godrej/biosecurity.pdf',
        verified: true,
      },
    ],
  },
  {
    id: 'seller_suspend_04',
    tenantId: 'apex-poultry-hub',
    name: 'Girish Gowda',
    farmName: 'Malnad Desi Birds Ltd',
    contactEmail: 'girish@malnadbirds.in',
    contactPhone: '+91 96110 33221',
    farmAddress: 'Shimoga Highway Road, Chikmagalur',
    city: 'Chikmagalur',
    state: 'Karnataka',
    pincode: '577101',
    fssaiNumber: '10019042000777',
    farmCapacityBirds: 8000,
    status: 'suspended',
    appliedAt: '2026-06-15T10:00:00Z',
    reviewedAt: '2026-06-18T12:00:00Z',
    reviewedBy: 'Vikramaditya Rao (Client Admin)',
    commissionRatePercent: 10.0,
    rejectionReason: 'Biosecurity non-compliance: failed avian influenza buffer quarantine inspection on 2026-10-01.',
    bankDetails: {
      accountNumber: '12340055667788',
      ifscCode: 'PUNB0001234',
      bankName: 'Punjab National Bank',
      beneficiaryName: 'Malnad Desi Birds Ltd',
    },
    documents: [],
  },
];

const INITIAL_PRODUCTS: AdminProductRecord[] = [
  {
    id: 'prod_broiler_live',
    tenantId: 'apex-poultry-hub',
    sellerId: 'seller_krishna_01',
    sellerName: 'Krishna Broiler & Layer Farms',
    title: 'Live Broiler Chicken (Farm Weight)',
    category: 'live_birds',
    description: 'Antibiotic-free, farm raised Cobb 430 broiler birds. Average weight 1.8kg - 2.2kg per bird. Inspected daily by certified veterinarians.',
    price: 145, // ₹145/kg
    unit: 'kg',
    stockAvailable: 450,
    minOrderQuantity: 1,
    status: 'active',
    healthCertified: true,
    vaccinationDetails: 'Marek, ND-IB, IBD vaccinated. 7-day withdrawal period adhered to.',
    images: ['https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=600&q=80'],
    averageRating: 4.8,
    reviewCount: 34,
    createdAt: '2026-09-15T10:00:00Z',
    updatedAt: '2026-10-25T08:00:00Z',
  },
  {
    id: 'prod_country_chicken',
    tenantId: 'apex-poultry-hub',
    sellerId: 'seller_krishna_01',
    sellerName: 'Krishna Broiler & Layer Farms',
    title: 'Free-Range Country Chicken (Aseel / Natukodi)',
    category: 'country_chicken',
    description: 'Authentic free-range country chicken. Rich in natural flavor and lean protein, raised on open pastures with grain feeds.',
    price: 380, // ₹380/kg
    unit: 'kg',
    stockAvailable: 85,
    minOrderQuantity: 1,
    status: 'active',
    healthCertified: true,
    vaccinationDetails: 'Ranikhet disease vaccinated. 100% natural grazing diet.',
    images: ['https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&w=600&q=80'],
    averageRating: 4.9,
    reviewCount: 52,
    createdAt: '2026-09-16T12:00:00Z',
    updatedAt: '2026-10-24T14:30:00Z',
  },
  {
    id: 'prod_organic_brown_eggs',
    tenantId: 'apex-poultry-hub',
    sellerId: 'seller_godrej_03',
    sellerName: 'Godrej Agrovet Contract Partner',
    title: 'Organic Brown Farm Fresh Eggs (Pack of 30)',
    category: 'eggs',
    description: 'Nutrient-rich brown table eggs from free-range layer hens. High yolk index and fortified with natural Omega-3.',
    price: 240, // ₹240/pack
    unit: 'pack',
    stockAvailable: 120,
    minOrderQuantity: 1,
    status: 'active',
    healthCertified: true,
    vaccinationDetails: 'Flock vaccinated under standard NECC poultry guidelines.',
    images: ['https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=600&q=80'],
    averageRating: 4.7,
    reviewCount: 88,
    createdAt: '2026-09-18T09:00:00Z',
    updatedAt: '2026-10-25T07:15:00Z',
  },
  {
    id: 'prod_quail_eggs',
    tenantId: 'apex-poultry-hub',
    sellerId: 'seller_krishna_01',
    sellerName: 'Krishna Broiler & Layer Farms',
    title: 'Fresh Japanese Quail Eggs (Pack of 24)',
    category: 'eggs',
    description: 'Delicacy quail eggs with speckled shells, packed with choline, B-vitamins, and minerals. Farm harvested daily.',
    price: 180, // ₹180/pack
    unit: 'pack',
    stockAvailable: 60,
    minOrderQuantity: 1,
    status: 'active',
    healthCertified: true,
    images: ['https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&w=600&q=80'],
    averageRating: 4.6,
    reviewCount: 19,
    createdAt: '2026-09-22T11:00:00Z',
    updatedAt: '2026-10-23T16:00:00Z',
  },
  {
    id: 'prod_chicken_breast',
    tenantId: 'apex-poultry-hub',
    sellerId: 'seller_godrej_03',
    sellerName: 'Godrej Agrovet Contract Partner',
    title: 'Fresh Tender Chicken Breast (Boneless)',
    category: 'fresh_meat',
    description: 'Chilled vacuum-sealed skinless boneless breast fillets. Hygienically processed in FSSAI-compliant cold chain facility.',
    price: 320, // ₹320/kg
    unit: 'kg',
    stockAvailable: 95,
    minOrderQuantity: 1,
    status: 'active',
    healthCertified: true,
    images: ['https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=600&q=80'],
    averageRating: 4.9,
    reviewCount: 41,
    createdAt: '2026-09-25T15:00:00Z',
    updatedAt: '2026-10-25T06:00:00Z',
  },
  {
    id: 'prod_pending_kadaknath',
    tenantId: 'apex-poultry-hub',
    sellerId: 'seller_krishna_01',
    sellerName: 'Krishna Broiler & Layer Farms',
    title: 'GI-Tagged Kadaknath Black Meat Chicken (Live)',
    category: 'specialty_poultry',
    description: 'Rare Jhabua breed black meat chicken. Highly prized for high protein, low fat, and traditional medicinal value.',
    price: 850, // ₹850/kg
    unit: 'kg',
    stockAvailable: 25,
    minOrderQuantity: 1,
    status: 'pending_approval',
    healthCertified: true,
    vaccinationDetails: 'Complete endemic poultry immunization chart verified.',
    images: ['https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=600&q=80'],
    averageRating: 5.0,
    reviewCount: 0,
    createdAt: '2026-10-24T18:00:00Z',
    updatedAt: '2026-10-24T18:00:00Z',
  },
];

const INITIAL_ORDERS: AdminOrderRecord[] = [
  {
    id: 'ORD-2026-1001',
    tenantId: 'apex-poultry-hub',
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
        quantity: 2,
        totalPrice: 290,
      },
      {
        productId: 'prod_organic_brown_eggs',
        title: 'Organic Brown Farm Fresh Eggs (Pack of 30)',
        unitPrice: 240,
        unit: 'pack',
        quantity: 1,
        totalPrice: 240,
      },
    ],
    subtotal: 530,
    deliveryFee: 40,
    tax: 0,
    totalAmount: 570,
    orderStatus: 'delivered',
    paymentStatus: 'unpaid',
    deliveryAddress: {
      recipientName: 'Anand Verma',
      phone: '+91 98451 11223',
      streetAddress: 'Flat 402, Green Glen Layout, Bellandur',
      locality: 'Outer Ring Road',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560103',
    },
    placedAt: '2026-10-24T09:15:00Z',
    updatedAt: '2026-10-24T14:45:00Z',
    customerNotes: 'Please ring bell twice upon arrival at gate.',
    history: [
      {
        status: 'pending',
        timestamp: '2026-10-24T09:15:00Z',
        actorId: 'cust_anand_01',
        actorRole: 'customer',
        actorName: 'Anand Verma',
        notes: 'Order placed via Customer Flutter Mobile App (Cash / Payment on Delivery workflow).',
      },
      {
        status: 'confirmed',
        timestamp: '2026-10-24T09:30:00Z',
        actorId: 'admin_vikram_01',
        actorRole: 'client_admin',
        actorName: 'Vikramaditya Rao',
        notes: 'Order verified and confirmed with farm stock reservation.',
      },
      {
        status: 'preparing',
        timestamp: '2026-10-24T10:00:00Z',
        actorId: 'seller_krishna_01',
        actorRole: 'seller',
        actorName: 'Ramesh Krishna (Farm Manager)',
        notes: 'Live birds weighed and eggs packed into insulated crate.',
      },
      {
        status: 'ready_for_dispatch',
        timestamp: '2026-10-24T11:30:00Z',
        actorId: 'seller_krishna_01',
        actorRole: 'seller',
        actorName: 'Ramesh Krishna (Farm Manager)',
        notes: 'Crate sealed with tamper-proof security band #KBF-4902.',
      },
      {
        status: 'out_for_delivery',
        timestamp: '2026-10-24T12:45:00Z',
        actorId: 'staff_deepa_04',
        actorRole: 'client_admin',
        actorName: 'Deepa Patel (Dispatch Officer)',
        notes: 'Handed over to Cold-Chain Van KA-04-E-8899.',
      },
      {
        status: 'delivered',
        timestamp: '2026-10-24T14:45:00Z',
        actorId: 'staff_deepa_04',
        actorRole: 'client_admin',
        actorName: 'Deepa Patel (Dispatch Officer)',
        notes: 'Recipient Anand Verma acknowledged OTP handover.',
      },
    ],
  },
  {
    id: 'ORD-2026-1002',
    tenantId: 'apex-poultry-hub',
    sellerId: 'seller_krishna_01',
    sellerName: 'Krishna Broiler & Layer Farms',
    customerId: 'cust_priya_02',
    customerName: 'Priya Sundaram',
    customerPhone: '+91 97422 33445',
    items: [
      {
        productId: 'prod_country_chicken',
        title: 'Free-Range Country Chicken (Aseel / Natukodi)',
        unitPrice: 380,
        unit: 'kg',
        quantity: 2,
        totalPrice: 760,
      },
    ],
    subtotal: 760,
    deliveryFee: 0, // Free delivery threshold >= ₹499
    tax: 0,
    totalAmount: 760,
    orderStatus: 'preparing',
    paymentStatus: 'unpaid',
    deliveryAddress: {
      recipientName: 'Priya Sundaram',
      phone: '+91 97422 33445',
      streetAddress: '14, 5th Cross, Indiranagar 1st Stage',
      locality: 'Indiranagar',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560038',
    },
    placedAt: '2026-10-25T07:30:00Z',
    updatedAt: '2026-10-25T08:15:00Z',
    history: [
      {
        status: 'pending',
        timestamp: '2026-10-25T07:30:00Z',
        actorId: 'cust_priya_02',
        actorRole: 'customer',
        actorName: 'Priya Sundaram',
        notes: 'Placed via Flutter App.',
      },
      {
        status: 'confirmed',
        timestamp: '2026-10-25T07:45:00Z',
        actorId: 'admin_vikram_01',
        actorRole: 'client_admin',
        actorName: 'Vikramaditya Rao',
        notes: 'Stock allocated.',
      },
      {
        status: 'preparing',
        timestamp: '2026-10-25T08:15:00Z',
        actorId: 'seller_krishna_01',
        actorRole: 'seller',
        actorName: 'Ramesh Krishna',
        notes: 'Farm dressing and chilling in progress.',
      },
    ],
  },
  {
    id: 'ORD-2026-1003',
    tenantId: 'apex-poultry-hub',
    sellerId: 'seller_krishna_01',
    sellerName: 'Krishna Broiler & Layer Farms',
    customerId: 'cust_rajesh_03',
    customerName: 'Rajesh Khanna',
    customerPhone: '+91 98860 44556',
    items: [
      {
        productId: 'prod_broiler_live',
        title: 'Live Broiler Chicken (Farm Weight)',
        unitPrice: 145,
        unit: 'kg',
        quantity: 4,
        totalPrice: 580,
      },
    ],
    subtotal: 580,
    deliveryFee: 0,
    tax: 0,
    totalAmount: 580,
    orderStatus: 'ready_for_dispatch',
    paymentStatus: 'unpaid',
    deliveryAddress: {
      recipientName: 'Rajesh Khanna',
      phone: '+91 98860 44556',
      streetAddress: 'Villa 12, Palm Meadows, Whitefield',
      locality: 'Whitefield',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560066',
    },
    placedAt: '2026-10-25T06:45:00Z',
    updatedAt: '2026-10-25T08:30:00Z',
    history: [
      {
        status: 'pending',
        timestamp: '2026-10-25T06:45:00Z',
        actorId: 'cust_rajesh_03',
        actorRole: 'customer',
        actorName: 'Rajesh Khanna',
      },
      {
        status: 'confirmed',
        timestamp: '2026-10-25T07:00:00Z',
        actorId: 'admin_vikram_01',
        actorRole: 'client_admin',
        actorName: 'Vikramaditya Rao',
      },
      {
        status: 'preparing',
        timestamp: '2026-10-25T07:30:00Z',
        actorId: 'seller_krishna_01',
        actorRole: 'seller',
        actorName: 'Ramesh Krishna',
      },
      {
        status: 'ready_for_dispatch',
        timestamp: '2026-10-25T08:30:00Z',
        actorId: 'seller_krishna_01',
        actorRole: 'seller',
        actorName: 'Ramesh Krishna',
        notes: 'Ready at Hub Loading Bay 3.',
      },
    ],
  },
  {
    id: 'ORD-2026-1004',
    tenantId: 'apex-poultry-hub',
    sellerId: 'seller_godrej_03',
    sellerName: 'Godrej Agrovet Contract Partner',
    customerId: 'cust_sneha_04',
    customerName: 'Sneha Reddy',
    customerPhone: '+91 99000 66778',
    items: [
      {
        productId: 'prod_chicken_breast',
        title: 'Fresh Tender Chicken Breast (Boneless)',
        unitPrice: 320,
        unit: 'kg',
        quantity: 1,
        totalPrice: 320,
      },
    ],
    subtotal: 320,
    deliveryFee: 40,
    tax: 0,
    totalAmount: 360,
    orderStatus: 'out_for_delivery',
    paymentStatus: 'unpaid',
    deliveryAddress: {
      recipientName: 'Sneha Reddy',
      phone: '+91 99000 66778',
      streetAddress: '77, Koramangala 4th Block',
      locality: 'Koramangala',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560034',
    },
    placedAt: '2026-10-25T05:30:00Z',
    updatedAt: '2026-10-25T08:45:00Z',
    history: [
      {
        status: 'pending',
        timestamp: '2026-10-25T05:30:00Z',
        actorId: 'cust_sneha_04',
        actorRole: 'customer',
        actorName: 'Sneha Reddy',
      },
      {
        status: 'confirmed',
        timestamp: '2026-10-25T06:00:00Z',
        actorId: 'admin_vikram_01',
        actorRole: 'client_admin',
        actorName: 'Vikramaditya Rao',
      },
      {
        status: 'preparing',
        timestamp: '2026-10-25T06:30:00Z',
        actorId: 'seller_godrej_03',
        actorRole: 'seller',
        actorName: 'Suresh Patil',
      },
      {
        status: 'ready_for_dispatch',
        timestamp: '2026-10-25T07:45:00Z',
        actorId: 'seller_godrej_03',
        actorRole: 'seller',
        actorName: 'Suresh Patil',
      },
      {
        status: 'out_for_delivery',
        timestamp: '2026-10-25T08:45:00Z',
        actorId: 'staff_deepa_04',
        actorRole: 'client_admin',
        actorName: 'Deepa Patel (Dispatch Officer)',
        notes: 'Assigned to delivery courier Mohan (Bike #KA-03-J-1234).',
      },
    ],
  },
  {
    id: 'ORD-2026-1005',
    tenantId: 'apex-poultry-hub',
    sellerId: 'seller_krishna_01',
    sellerName: 'Krishna Broiler & Layer Farms',
    customerId: 'cust_vikram_05',
    customerName: 'Vikram Malhotra',
    customerPhone: '+91 99887 76655',
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
      recipientName: 'Vikram Malhotra',
      phone: '+91 99887 76655',
      streetAddress: 'Apartment 9B, Sobha Iris, Outer Ring Road',
      locality: 'Marathahalli',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560037',
    },
    placedAt: '2026-10-25T08:50:00Z',
    updatedAt: '2026-10-25T08:50:00Z',
    history: [
      {
        status: 'pending',
        timestamp: '2026-10-25T08:50:00Z',
        actorId: 'cust_vikram_05',
        actorRole: 'customer',
        actorName: 'Vikram Malhotra',
        notes: 'Awaiting client administrator order confirmation.',
      },
    ],
  },
  {
    id: 'ORD-2026-1006',
    tenantId: 'apex-poultry-hub',
    sellerId: 'seller_krishna_01',
    sellerName: 'Krishna Broiler & Layer Farms',
    customerId: 'cust_meera_06',
    customerName: 'Meera Nair',
    customerPhone: '+91 98453 99887',
    items: [
      {
        productId: 'prod_quail_eggs',
        title: 'Fresh Japanese Quail Eggs (Pack of 24)',
        unitPrice: 180,
        unit: 'pack',
        quantity: 2,
        totalPrice: 360,
      },
    ],
    subtotal: 360,
    deliveryFee: 40,
    tax: 0,
    totalAmount: 400,
    orderStatus: 'cancelled',
    paymentStatus: 'unpaid',
    deliveryAddress: {
      recipientName: 'Meera Nair',
      phone: '+91 98453 99887',
      streetAddress: '22, Brunton Road, Ashok Nagar',
      locality: 'Ashok Nagar',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560025',
    },
    placedAt: '2026-10-23T11:20:00Z',
    updatedAt: '2026-10-23T12:00:00Z',
    cancellationReason: 'Customer requested cancellation prior to packaging dispatch.',
    history: [
      {
        status: 'pending',
        timestamp: '2026-10-23T11:20:00Z',
        actorId: 'cust_meera_06',
        actorRole: 'customer',
        actorName: 'Meera Nair',
      },
      {
        status: 'cancelled',
        timestamp: '2026-10-23T12:00:00Z',
        actorId: 'admin_vikram_01',
        actorRole: 'client_admin',
        actorName: 'Vikramaditya Rao',
        notes: 'Cancelled per customer phone request. Inventory released back to seller stock.',
      },
    ],
  },
];

const INITIAL_CUSTOMERS: CustomerRecord[] = [
  {
    id: 'cust_anand_01',
    tenantId: 'apex-poultry-hub',
    name: 'Anand Verma',
    email: 'anand.verma@gmail.com',
    phone: '+91 98451 11223',
    city: 'Bengaluru',
    totalOrders: 4,
    totalSpend: 2350,
    status: 'active',
    registeredAt: '2026-08-12T14:00:00Z',
  },
  {
    id: 'cust_priya_02',
    tenantId: 'apex-poultry-hub',
    name: 'Priya Sundaram',
    email: 'priya.sundaram@outlook.com',
    phone: '+91 97422 33445',
    city: 'Bengaluru',
    totalOrders: 2,
    totalSpend: 1180,
    status: 'active',
    registeredAt: '2026-09-02T10:30:00Z',
  },
  {
    id: 'cust_rajesh_03',
    tenantId: 'apex-poultry-hub',
    name: 'Rajesh Khanna',
    email: 'rajesh.k@rediffmail.com',
    phone: '+91 98860 44556',
    city: 'Bengaluru',
    totalOrders: 6,
    totalSpend: 4120,
    status: 'active',
    registeredAt: '2026-07-20T16:45:00Z',
  },
  {
    id: 'cust_sneha_04',
    tenantId: 'apex-poultry-hub',
    name: 'Sneha Reddy',
    email: 'sneha.reddy@yahoo.in',
    phone: '+91 99000 66778',
    city: 'Bengaluru',
    totalOrders: 1,
    totalSpend: 360,
    status: 'active',
    registeredAt: '2026-10-18T11:10:00Z',
  },
];

const INITIAL_STAFF: StaffAccountRecord[] = [
  {
    id: 'admin_vikram_01',
    tenantId: 'apex-poultry-hub',
    name: 'Vikramaditya Rao',
    email: 'vikram.admin@apex-poultry.in',
    role: 'client_admin',
    status: 'active',
    createdAt: '2026-08-01T08:00:00Z',
  },
  {
    id: 'staff_manoj_02',
    tenantId: 'apex-poultry-hub',
    name: 'Manoj Kumar',
    email: 'manoj.ops@apex-poultry.in',
    role: 'operations_manager',
    status: 'active',
    createdAt: '2026-08-15T09:00:00Z',
  },
  {
    id: 'staff_sunita_03',
    tenantId: 'apex-poultry-hub',
    name: 'Sunita Sharma',
    email: 'sunita.catalog@apex-poultry.in',
    role: 'catalog_moderator',
    status: 'active',
    createdAt: '2026-09-01T10:00:00Z',
  },
  {
    id: 'staff_deepa_04',
    tenantId: 'apex-poultry-hub',
    name: 'Deepa Patel',
    email: 'deepa.dispatch@apex-poultry.in',
    role: 'dispatch_officer',
    status: 'active',
    createdAt: '2026-09-10T11:00:00Z',
  },
];

const INITIAL_COUPONS: CouponRecord[] = [
  {
    id: 'coup_desi20',
    tenantId: 'apex-poultry-hub',
    code: 'DESI20',
    discountType: 'percentage',
    discountValue: 20,
    minOrderAmount: 500,
    maxDiscountAmount: 150,
    validUntil: '2026-12-31T23:59:59Z',
    usageLimit: 500,
    usedCount: 78,
    status: 'active',
  },
  {
    id: 'coup_freeship',
    tenantId: 'apex-poultry-hub',
    code: 'FREESHIP',
    discountType: 'flat_amount',
    discountValue: 40,
    minOrderAmount: 399,
    maxDiscountAmount: 40,
    validUntil: '2026-11-30T23:59:59Z',
    usageLimit: 1000,
    usedCount: 245,
    status: 'active',
  },
];

const INITIAL_REVIEWS: ReviewRecord[] = [
  {
    id: 'rev_01',
    tenantId: 'apex-poultry-hub',
    productId: 'prod_broiler_live',
    productTitle: 'Live Broiler Chicken (Farm Weight)',
    customerId: 'cust_anand_01',
    customerName: 'Anand Verma',
    rating: 5,
    comment: 'Extremely fresh and healthy birds! Delivered with proper vet documentation tag. Highly recommended.',
    status: 'published',
    createdAt: '2026-10-24T16:00:00Z',
  },
  {
    id: 'rev_02',
    tenantId: 'apex-poultry-hub',
    productId: 'prod_country_chicken',
    productTitle: 'Free-Range Country Chicken (Aseel / Natukodi)',
    customerId: 'cust_priya_02',
    customerName: 'Priya Sundaram',
    rating: 5,
    comment: 'Authentic Natukodi taste. Perfect for Sunday family biryani.',
    status: 'published',
    createdAt: '2026-10-22T19:30:00Z',
  },
  {
    id: 'rev_03',
    tenantId: 'apex-poultry-hub',
    productId: 'prod_organic_brown_eggs',
    productTitle: 'Organic Brown Farm Fresh Eggs (Pack of 30)',
    customerId: 'cust_rajesh_03',
    customerName: 'Rajesh Khanna',
    rating: 4,
    comment: 'Eggs are large and fresh. Outer paper carton was slightly crinkled during transit, but no broken eggs.',
    status: 'published',
    createdAt: '2026-10-20T12:00:00Z',
  },
  {
    id: 'rev_04',
    tenantId: 'apex-poultry-hub',
    productId: 'prod_broiler_live',
    productTitle: 'Live Broiler Chicken (Farm Weight)',
    customerId: 'cust_sneha_04',
    customerName: 'Sneha Reddy',
    rating: 2,
    comment: 'Delivery van arrived 45 minutes late during peak evening traffic.',
    status: 'flagged',
    createdAt: '2026-10-19T20:15:00Z',
  },
];

const INITIAL_SETTINGS: Record<string, TenantOperationalSettings> = {
  'apex-poultry-hub': {
    minOrderAmount: 199,
    freeDeliveryThreshold: 499,
    standardDeliveryFee: 40,
    supportHelpline: '+91 80 4000 8899',
    supportEmail: 'support@apex-poultry.in',
    operatingHours: '06:00 AM - 09:00 PM IST (Mon - Sun)',
    orderCancellationTimeoutMins: 30,
    biosecurityAuditIntervalDays: 60,
  },
  'golden-yolk-hatcheries': {
    minOrderAmount: 250,
    freeDeliveryThreshold: 600,
    standardDeliveryFee: 50,
    supportHelpline: '+91 80 5000 1122',
    supportEmail: 'care@goldenyolk.in',
    operatingHours: '07:00 AM - 08:00 PM IST (Mon - Sat)',
    orderCancellationTimeoutMins: 20,
    biosecurityAuditIntervalDays: 45,
  },
};

// Valid transitions state machine
export const VALID_ORDER_TRANSITIONS: Record<OrderLifecycleStatus, OrderLifecycleStatus[]> = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['preparing', 'cancelled'],
  preparing: ['ready_for_dispatch', 'cancelled'],
  ready_for_dispatch: ['out_for_delivery', 'cancelled'],
  out_for_delivery: ['delivered', 'failed_delivery'],
  delivered: [], // Terminal
  cancelled: [], // Terminal
  failed_delivery: ['ready_for_dispatch', 'cancelled'], // Can retry dispatch or cancel
};

// Permitted transitions by role
export const ROLE_PERMITTED_TRANSITIONS: Record<string, OrderLifecycleStatus[]> = {
  // Sellers can ONLY move orders through farm packaging phases
  seller: ['preparing', 'ready_for_dispatch'],
  // Dispatch officers can transition delivery dispatch
  dispatch_officer: ['out_for_delivery', 'delivered', 'failed_delivery'],
  // Client Admins and Platform Developers can transition all valid states
  client_admin: ['confirmed', 'preparing', 'ready_for_dispatch', 'out_for_delivery', 'delivered', 'cancelled', 'failed_delivery'],
  platform_developer: ['confirmed', 'preparing', 'ready_for_dispatch', 'out_for_delivery', 'delivered', 'cancelled', 'failed_delivery'],
};

class OperationsService {
  private sellers: SellerRecord[] = [];
  private products: AdminProductRecord[] = [];
  private orders: AdminOrderRecord[] = [];
  private customers: CustomerRecord[] = [];
  private staff: StaffAccountRecord[] = [];
  private coupons: CouponRecord[] = [];
  private reviews: ReviewRecord[] = [];
  private settings: Record<string, TenantOperationalSettings> = {};
  private moduleRequests: { tenantId: string; moduleKey: string; requestedAt: string; notes?: string }[] = [];

  constructor() {
    this.init();
  }

  private init() {
    if (typeof window === 'undefined') {
      this.sellers = [...INITIAL_SELLERS];
      this.products = [...INITIAL_PRODUCTS];
      this.orders = [...INITIAL_ORDERS];
      this.customers = [...INITIAL_CUSTOMERS];
      this.staff = [...INITIAL_STAFF];
      this.coupons = [...INITIAL_COUPONS];
      this.reviews = [...INITIAL_REVIEWS];
      this.settings = { ...INITIAL_SETTINGS };
      return;
    }

    try {
      const storedSellers = localStorage.getItem('poultry_ops_sellers');
      this.sellers = storedSellers ? JSON.parse(storedSellers) : [...INITIAL_SELLERS];

      const storedProducts = localStorage.getItem('poultry_ops_products');
      this.products = storedProducts ? JSON.parse(storedProducts) : [...INITIAL_PRODUCTS];

      const storedOrders = localStorage.getItem('poultry_ops_orders');
      this.orders = storedOrders ? JSON.parse(storedOrders) : [...INITIAL_ORDERS];

      const storedCustomers = localStorage.getItem('poultry_ops_customers');
      this.customers = storedCustomers ? JSON.parse(storedCustomers) : [...INITIAL_CUSTOMERS];

      const storedStaff = localStorage.getItem('poultry_ops_staff');
      this.staff = storedStaff ? JSON.parse(storedStaff) : [...INITIAL_STAFF];

      const storedCoupons = localStorage.getItem('poultry_ops_coupons');
      this.coupons = storedCoupons ? JSON.parse(storedCoupons) : [...INITIAL_COUPONS];

      const storedReviews = localStorage.getItem('poultry_ops_reviews');
      this.reviews = storedReviews ? JSON.parse(storedReviews) : [...INITIAL_REVIEWS];

      const storedSettings = localStorage.getItem('poultry_ops_settings');
      this.settings = storedSettings ? JSON.parse(storedSettings) : { ...INITIAL_SETTINGS };

      const storedRequests = localStorage.getItem('poultry_ops_module_requests');
      this.moduleRequests = storedRequests ? JSON.parse(storedRequests) : [];
    } catch {
      this.sellers = [...INITIAL_SELLERS];
      this.products = [...INITIAL_PRODUCTS];
      this.orders = [...INITIAL_ORDERS];
      this.customers = [...INITIAL_CUSTOMERS];
      this.staff = [...INITIAL_STAFF];
      this.coupons = [...INITIAL_COUPONS];
      this.reviews = [...INITIAL_REVIEWS];
      this.settings = { ...INITIAL_SETTINGS };
    }
  }

  private persist(key: string, data: unknown) {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(key, JSON.stringify(data));
      } catch (e) {
        console.error('OperationsService persist error', e);
      }
    }
  }

  // --- SELLERS ---
  public getSellers(tenantId: string): SellerRecord[] {
    return this.sellers.filter((s) => s.tenantId === tenantId);
  }

  public getSellerById(id: string): SellerRecord | undefined {
    return this.sellers.find((s) => s.id === id);
  }

  public reviewSellerApplication(
    sellerId: string,
    status: SellerApplicationStatus,
    reviewerName: string,
    commissionRatePercent?: number,
    rejectionReason?: string
  ): SellerRecord {
    const seller = this.sellers.find((s) => s.id === sellerId);
    if (!seller) throw new Error(`Seller with id ${sellerId} not found`);

    seller.status = status;
    seller.reviewedAt = new Date().toISOString();
    seller.reviewedBy = reviewerName;
    if (commissionRatePercent !== undefined) {
      seller.commissionRatePercent = commissionRatePercent;
    }
    if (rejectionReason) {
      seller.rejectionReason = rejectionReason;
    }

    this.persist('poultry_ops_sellers', this.sellers);
    return { ...seller };
  }

  public submitSellerApplication(app: Omit<SellerRecord, 'id' | 'status' | 'appliedAt' | 'commissionRatePercent'>): SellerRecord {
    const newSeller: SellerRecord = {
      ...app,
      id: `seller_${Date.now()}`,
      status: 'submitted',
      appliedAt: new Date().toISOString(),
      commissionRatePercent: 8.0,
      documents: app.documents || [],
    };
    this.sellers.unshift(newSeller);
    this.persist('poultry_ops_sellers', this.sellers);
    return { ...newSeller };
  }

  // --- PRODUCTS & INVENTORY ---
  public getProducts(tenantId: string, sellerId?: string): AdminProductRecord[] {
    return this.products.filter((p) => {
      const matchTenant = p.tenantId === tenantId;
      if (sellerId) return matchTenant && p.sellerId === sellerId;
      return matchTenant;
    });
  }

  public getProductById(id: string): AdminProductRecord | undefined {
    return this.products.find((p) => p.id === id);
  }

  public createProduct(product: Omit<AdminProductRecord, 'id' | 'createdAt' | 'updatedAt' | 'averageRating' | 'reviewCount'>): AdminProductRecord {
    const newProduct: AdminProductRecord = {
      ...product,
      id: `prod_${Date.now()}`,
      averageRating: 5.0,
      reviewCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.products.unshift(newProduct);
    this.persist('poultry_ops_products', this.products);
    return { ...newProduct };
  }

  public updateProductPriceAndStock(productId: string, price: number, stockAvailable: number): AdminProductRecord {
    const product = this.products.find((p) => p.id === productId);
    if (!product) throw new Error(`Product ${productId} not found`);

    product.price = price;
    product.stockAvailable = stockAvailable;
    product.updatedAt = new Date().toISOString();
    if (stockAvailable === 0 && product.status === 'active') {
      product.status = 'out_of_stock';
    } else if (stockAvailable > 0 && product.status === 'out_of_stock') {
      product.status = 'active';
    }

    this.persist('poultry_ops_products', this.products);
    return { ...product };
  }

  public moderateProduct(productId: string, status: 'active' | 'rejected' | 'pending_approval'): AdminProductRecord {
    const product = this.products.find((p) => p.id === productId);
    if (!product) throw new Error(`Product ${productId} not found`);

    product.status = status;
    product.updatedAt = new Date().toISOString();
    this.persist('poultry_ops_products', this.products);
    return { ...product };
  }

  // --- ORDERS & STATE MACHINE ---
  public getOrders(tenantId: string, sellerId?: string): AdminOrderRecord[] {
    return this.orders.filter((o) => {
      const matchTenant = o.tenantId === tenantId;
      if (sellerId) return matchTenant && o.sellerId === sellerId;
      return matchTenant;
    });
  }

  public getOrderById(id: string): AdminOrderRecord | undefined {
    return this.orders.find((o) => o.id === id);
  }

  public createOrder(order: AdminOrderRecord): AdminOrderRecord {
    this.orders.unshift(order);
    this.persist('poultry_ops_orders', this.orders);
    return order;
  }

  public transitionOrderStatus(
    orderId: string,
    newStatus: OrderLifecycleStatus,
    actorId: string,
    actorRole: 'customer' | 'seller' | 'client_admin' | 'platform_developer',
    actorName: string,
    notes?: string,
    cancellationReason?: string
  ): AdminOrderRecord {
    const order = this.orders.find((o) => o.id === orderId);
    if (!order) throw new Error(`Order ${orderId} not found`);

    const currentStatus = order.orderStatus;

    // 1. Validate if transition is allowable from current state
    const allowedNext = VALID_ORDER_TRANSITIONS[currentStatus];
    if (!allowedNext.includes(newStatus)) {
      throw new Error(`Invalid state transition: Cannot move order from [${currentStatus}] to [${newStatus}]`);
    }

    // 2. Validate actor permissions
    const permittedForRole = ROLE_PERMITTED_TRANSITIONS[actorRole] || [];
    if (!permittedForRole.includes(newStatus)) {
      throw new Error(`Permission Denied: Actor with role [${actorRole}] cannot transition order to [${newStatus}]`);
    }

    // 3. For seller role, verify that seller owns this order
    if (actorRole === 'seller' && order.sellerId !== actorId) {
      throw new Error(`Security Violation: Seller ${actorId} does not own order ${orderId}`);
    }

    // 4. Record Transition Event
    const event: OrderTransitionEvent = {
      status: newStatus,
      timestamp: new Date().toISOString(),
      actorId,
      actorRole,
      actorName,
      notes: notes || `Order transitioned to ${newStatus}`,
    };

    order.orderStatus = newStatus;
    order.updatedAt = new Date().toISOString();
    order.history.push(event);

    if (newStatus === 'cancelled') {
      order.cancellationReason = cancellationReason || notes || 'Order cancelled';
      // Release inventory back to products!
      for (const item of order.items) {
        const prod = this.products.find((p) => p.id === item.productId);
        if (prod) {
          prod.stockAvailable += item.quantity;
          if (prod.status === 'out_of_stock' && prod.stockAvailable > 0) {
            prod.status = 'active';
          }
        }
      }
      this.persist('poultry_ops_products', this.products);
    }

    this.persist('poultry_ops_orders', this.orders);
    return { ...order };
  }

  // --- CUSTOMERS ---
  public getCustomers(tenantId: string): CustomerRecord[] {
    return this.customers.filter((c) => c.tenantId === tenantId);
  }

  // --- STAFF ---
  public getStaff(tenantId: string): StaffAccountRecord[] {
    return this.staff.filter((s) => s.tenantId === tenantId);
  }

  public createStaffAccount(account: Omit<StaffAccountRecord, 'id' | 'createdAt'>): StaffAccountRecord {
    const newStaff: StaffAccountRecord = {
      ...account,
      id: `staff_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.staff.push(newStaff);
    this.persist('poultry_ops_staff', this.staff);
    return { ...newStaff };
  }

  // --- COUPONS ---
  public getCoupons(tenantId: string): CouponRecord[] {
    return this.coupons.filter((c) => c.tenantId === tenantId);
  }

  public createCoupon(coupon: Omit<CouponRecord, 'id' | 'usedCount'>): CouponRecord {
    const newCoupon: CouponRecord = {
      ...coupon,
      id: `coup_${Date.now()}`,
      usedCount: 0,
    };
    this.coupons.push(newCoupon);
    this.persist('poultry_ops_coupons', this.coupons);
    return { ...newCoupon };
  }

  // --- REVIEWS ---
  public getReviews(tenantId: string): ReviewRecord[] {
    return this.reviews.filter((r) => r.tenantId === tenantId);
  }

  public moderateReview(reviewId: string, status: 'published' | 'flagged' | 'rejected'): ReviewRecord {
    const review = this.reviews.find((r) => r.id === reviewId);
    if (!review) throw new Error(`Review ${reviewId} not found`);

    review.status = status;
    this.persist('poultry_ops_reviews', this.reviews);
    return { ...review };
  }

  // --- OPERATIONAL SETTINGS ---
  public getSettings(tenantId: string): TenantOperationalSettings {
    return (
      this.settings[tenantId] || {
        minOrderAmount: 199,
        freeDeliveryThreshold: 499,
        standardDeliveryFee: 40,
        supportHelpline: '+91 80 4000 8899',
        supportEmail: 'support@apex-poultry.in',
        operatingHours: '06:00 AM - 09:00 PM IST',
        orderCancellationTimeoutMins: 30,
        biosecurityAuditIntervalDays: 60,
      }
    );
  }

  public updateSettings(tenantId: string, newSettings: TenantOperationalSettings): TenantOperationalSettings {
    this.settings[tenantId] = { ...newSettings };
    this.persist('poultry_ops_settings', this.settings);
    return { ...this.settings[tenantId] };
  }

  // --- MODULE ENTITLEMENT REQUESTS ---
  public requestModuleEntitlement(tenantId: string, moduleKey: string, notes?: string) {
    this.moduleRequests.push({
      tenantId,
      moduleKey,
      requestedAt: new Date().toISOString(),
      notes,
    });
    this.persist('poultry_ops_module_requests', this.moduleRequests);
    return true;
  }

  public getModuleRequests(tenantId?: string) {
    if (tenantId) {
      return this.moduleRequests.filter((r) => r.tenantId === tenantId);
    }
    return this.moduleRequests;
  }
}

export const operationsService = new OperationsService();
