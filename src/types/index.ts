// Basic product information
export interface Product {
  id: number;
  name: string;
  description: string;
  basePrice: number;
  sku: string;
  status: 'active' | 'inactive' | 'draft';
  featured: boolean;
  images: string[];
  createdAt: Date;
  updatedAt: Date;
  variants?: ProductVariant[];
  categories?: Category[];
}

// Product variants for handmade items
export interface ProductVariant {
  id: number;
  productId: number;
  size: string | null;
  material: string | null;
  color: string | null;
  sku: string;
  price: number;
  stock: number;
  weight: number | null;
  images: string[];
  createdAt: Date;
  updatedAt: Date;
  product?: Product;
}

// Categories
export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  createdAt: Date;
}

// Inventory transaction tracking
export interface InventoryTransaction {
  id: number;
  variantId: number;
  transactionType: 'sale' | 'restock' | 'adjustment' | 'reservation';
  quantity: number;
  timestamp: Date;
  orderId: number | null;
  notes: string | null;
  variant?: ProductVariant;
}

// Shopping cart items (for order creation and webhook processing)
export interface CartItem {
  productId: string | number;
  variantId: string | null;
  quantity: number;
  price: number;
  name: string;
  variantName?: string | null;
  sku: string;
}

// Legacy cart item (kept for backward compatibility)
export interface LegacyCartItem {
  id: string; // Unique cart item ID
  variant: ProductVariant;
  quantity: number;
  product: Product;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

// Address interface
export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country?: string;
}

// Customer information
export interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  shippingAddress: Address;
  billingAddress?: Address;
}

// Order information
export interface Order {
  id: number;
  orderNumber: string;
  customerEmail: string;
  customerName: string;
  customerPhone: string | null;
  shippingAddress: Address;
  billingAddress: Address | null;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  stripePaymentIntentId: string | null;
  trackingNumber: string | null;
  carrier: string | null;
  estimatedDelivery: Date | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
  items?: OrderItem[];
}

// Order items
export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  variantId: number;
  productName: string;
  variantSku: string;
  price: number;
  quantity: number;
  total: number;
  product?: Product;
  variant?: ProductVariant;
}

// Conservation donation tracking
export interface ConservationDonation {
  id: number;
  orderId: number;
  amount: number;
  organization: string;
  region: string;
  status: 'pledged' | 'donated';
  donationDate: Date | null;
  receiptUrl: string | null;
  createdAt: Date;
  order?: Order;
}

// Admin user
export interface AdminUser {
  id: number;
  email: string;
  name: string;
  role: 'admin' | 'manager';
  lastLogin: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

// Form types for product creation/editing
export interface CreateProductData {
  name: string;
  description: string;
  basePrice: number;
  sku: string;
  status: 'active' | 'inactive' | 'draft';
  featured: boolean;
  images: string[];
  categoryIds: number[];
  variants: Omit<ProductVariant, 'id' | 'productId' | 'createdAt' | 'updatedAt' | 'product'>[];
}

export type UpdateProductData = Partial<CreateProductData>;

// Form types for orders
export interface CreateOrderData {
  customerInfo: CustomerInfo;
  items: CartItem[];
  shippingCost: number;
  tax: number;
}

// Search and filter types
export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  materials?: string[];
  sizes?: string[];
  inStock?: boolean;
  featured?: boolean;
  search?: string;
}

export interface PaginationOptions {
  page: number;
  limit: number;
  offset?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Cart operations
export interface AddToCartRequest {
  variantId: number;
  quantity: number;
}

export interface UpdateCartRequest {
  itemId: string;
  quantity: number;
}

// Product display types (combines product and variant info)
export interface ProductDisplay {
  product: Product;
  variant?: ProductVariant;
  displayPrice: number;
  displayStock: number;
  displayImages: string[];
}

// Low stock alert
export interface LowStockAlert {
  variantId: number;
  productName: string;
  variantSku: string;
  currentStock: number;
  threshold: number;
}

// Conservation organization info
export interface ConservationOrg {
  name: string;
  region: string;
  website: string;
  description: string;
  logo: string;
}

// Shipping calculation
export type ShippingCalculation = {
  weight: number;
  destination: Address;
  carrier: string;
  service: string;
  cost: number;
  estimatedDays: number;
};

// Payload CMS variant type (for type adapters)
export interface PayloadVariant {
  id?: string | null;
  variantName?: string | null;
  sku: string;
  price: number;
  stock: number;
  size?: ('small' | 'medium' | 'large') | null;
  color?: string | null;
  material?: string | null;
  images?: Array<{ url?: string | null } | string>;
}

// Error handling utility
export function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}