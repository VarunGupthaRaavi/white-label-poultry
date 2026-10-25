export type SellerApplicationStatus = 
  | 'submitted' 
  | 'under_review' 
  | 'approved' 
  | 'rejected' 
  | 'suspended';

export interface SellerRecord {
  id: string;
  tenantId: string;
  name: string;
  farmName: string;
  contactEmail: string;
  contactPhone: string;
  farmAddress: string;
  city: string;
  state: string;
  pincode: string;
  fssaiNumber: string;
  farmCapacityBirds: number;
  status: SellerApplicationStatus;
  appliedAt: string;
  reviewedAt?: string | null;
  reviewedBy?: string | null;
  commissionRatePercent: number;
  bankDetails: {
    accountNumber: string;
    ifscCode: string;
    bankName: string;
    beneficiaryName: string;
  };
  documents: {
    name: string;
    type: 'veterinary_pass' | 'biosecurity_audit' | 'fssai_cert' | 'pan_card';
    fileUrl: string;
    verified: boolean;
  }[];
  rejectionReason?: string;
}

export type OrderLifecycleStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'ready_for_dispatch'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'failed_delivery';

export interface OrderTransitionEvent {
  status: OrderLifecycleStatus;
  timestamp: string;
  actorId: string;
  actorRole: 'customer' | 'seller' | 'client_admin' | 'platform_developer';
  actorName: string;
  notes?: string;
}

export interface OrderLineItem {
  productId: string;
  title: string;
  unitPrice: number; // In INR (₹)
  unit: string;
  quantity: number;
  totalPrice: number;
}

export interface AdminOrderRecord {
  id: string;
  tenantId: string;
  sellerId: string;
  sellerName: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  items: OrderLineItem[];
  subtotal: number;
  deliveryFee: number;
  tax: number;
  totalAmount: number;
  orderStatus: OrderLifecycleStatus;
  paymentStatus: 'pending' | 'unpaid' | 'settled' | 'refunded';
  deliveryAddress: {
    recipientName: string;
    phone: string;
    streetAddress: string;
    locality: string;
    city: string;
    state: string;
    pincode: string;
  };
  placedAt: string;
  updatedAt: string;
  history: OrderTransitionEvent[];
  customerNotes?: string;
  cancellationReason?: string;
  refundRequested?: boolean;
}

export interface AdminProductRecord {
  id: string;
  tenantId: string;
  sellerId: string;
  sellerName: string;
  title: string;
  category: string;
  description: string;
  price: number; // In INR (₹)
  unit: string;
  stockAvailable: number;
  minOrderQuantity: number;
  status: 'active' | 'pending_approval' | 'rejected' | 'out_of_stock';
  healthCertified: boolean;
  vaccinationDetails?: string;
  images: string[];
  averageRating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerRecord {
  id: string;
  tenantId: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  totalOrders: number;
  totalSpend: number; // In INR (₹)
  status: 'active' | 'blocked';
  registeredAt: string;
}

export interface StaffAccountRecord {
  id: string;
  tenantId: string;
  name: string;
  email: string;
  role: 'client_admin' | 'operations_manager' | 'catalog_moderator' | 'dispatch_officer';
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface CouponRecord {
  id: string;
  tenantId: string;
  code: string;
  discountType: 'percentage' | 'flat_amount';
  discountValue: number;
  minOrderAmount: number; // In INR (₹)
  maxDiscountAmount: number; // In INR (₹)
  validUntil: string;
  usageLimit: number;
  usedCount: number;
  status: 'active' | 'expired' | 'disabled';
}

export interface ReviewRecord {
  id: string;
  tenantId: string;
  productId: string;
  productTitle: string;
  customerId: string;
  customerName: string;
  rating: number;
  comment: string;
  status: 'published' | 'flagged' | 'rejected';
  createdAt: string;
}

export interface TenantOperationalSettings {
  minOrderAmount: number;
  freeDeliveryThreshold: number;
  standardDeliveryFee: number;
  supportHelpline: string;
  supportEmail: string;
  operatingHours: string;
  orderCancellationTimeoutMins: number;
  biosecurityAuditIntervalDays: number;
}
