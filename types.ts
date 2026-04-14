// Fix: Created this file to define all application types and resolve module import errors.

export interface Review {
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Answer {
  sellerId: string;
  text: string;
  date: string;
}

export interface Question {
  id: string;
  userId: string;
  userName: string;
  text: string;
  date: string;
  answer?: Answer;
}

export interface ProductCategory {
    main: string;
    sub: string;
    type?: string;
    gender?: 'Men' | 'Women' | 'Unisex';
    ageGroup?: 'Adult' | 'Kids';
}

export interface Product {
  id: number;
  name: string;
  category: string; // Keep for backward compatibility/simpler filtering
  categories: ProductCategory;
  price: number;
  originalPrice?: number;
  brand: string;
  description: string;
  imageUrl: string;
  images?: string[];
  rating: number;
  reviews: Review[];
  stock: number;
  sellerId?: string;
  specifications?: Record<string, string>;
  status: 'pending' | 'approved' | 'rejected';
  questions?: Question[];
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface PayoutInfo {
    bankName: string;
    accountHolder: string;
    accountNumber: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'seller' | 'admin';
  addresses: Address[];
  wishlist: number[];
  balance: number;
  sellerStatus?: 'pending' | 'approved' | 'rejected';
  payoutInfo?: PayoutInfo;
}

export interface SellerEarning {
    sellerId: string;
    amount: number;
}

export interface Order {
  id: string;
  date: string;
  userId: string;
  items: CartItem[];
  shippingAddress: Address;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Out for Delivery' | 'Delivered' | 'Cancelled' | 'Returned';
  paymentMethod: 'Card' | 'UPI' | 'COD' | 'Balance';
  paymentStatus: 'Paid' | 'Unpaid' | 'Refunded';
  subtotal: number;
  shippingFee: number;
  tax: number;
  platformFee: number;
  total: number;
  sellerEarnings: SellerEarning[];
  adminEarnings: number;
  trackingNumber?: string;
}

export interface Brand {
    name: string;
    logoUrl: string;
    link: string;
}

export interface Promotion {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  link: string;
}

export interface Settings {
    taxPercentage: number;
    shippingFee: number;
    platformFeePercentage: number;
    platformPayoutInfo?: PayoutInfo;
}

export interface PayoutRequest {
    id: string;
    sellerId: string;
    amount: number;
    requestDate: string;
    processedDate?: string;
    status: 'pending' | 'completed' | 'rejected';
}

export interface Transaction {
    id: string;
    userId: string;
    date: string;
    type: 'Earning' | 'Payout' | 'Purchase' | 'Refund' | 'Deposit';
    description: string;
    amount: number;
    orderId?: string;
}

export interface PlatformTransaction {
    id: string;
    date: string;
    type: 'Fee' | 'Withdrawal';
    description: string;
    amount: number;
    orderId?: string;
}

export interface TaxLedgerEntry {
    id: string;
    orderId: string;
    date: string;
    taxAmount: number;
    status: 'collected' | 'remitted';
}

export interface ReturnRequest {
    id: string;
    orderId: string;
    userId: string;
    reason: string;
    requestDate: string;
    status: 'pending' | 'approved' | 'rejected';
}