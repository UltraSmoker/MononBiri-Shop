export interface SmokeProfile {
  sweetness: number; // 1-100
  smokeDensity: number; // 1-100
  aroma: number; // 1-100
  kick: number; // 1-100
}

export type BidiCategory =
  | 'modern_filter'
  | 'traditional_tendu'
  | 'special_edition';

export interface BidiProduct {
  id: string;
  name: string;
  englishName: string;
  tagline: string;
  description?: string;
  flavor: string;
  category: BidiCategory;
  categoryLabel: string;
  isModern: boolean;
  filterType: string;
  price: number;
  originalPrice?: number;
  currency?: 'BDT' | 'USD';
  priceDisplay?: string;
  originalPriceDisplay?: string;
  stickCount: number;
  packSize: string;
  packaging: string;
  intensity: string;
  tobaccoOrigin: string;
  rating: number;
  reviewCount: number;
  soldCount?: string;
  discountPercentage?: number;
  strength: 1 | 2 | 3 | 4 | 5;
  images: string[];
  imageCaptions: string[];
  effects: string[];
  funnyTrivia: string;
  secretIngredient: string;
  rollMasterStory: string;
  smokeProfile: SmokeProfile;
  smokeColor: string; // Hex hue for virtual smoke simulator
  badge?: string;
  isPopular?: boolean;
  isExtreme?: boolean;
  isHistoric?: boolean;
  stockStatus: 'ইন-স্টক (তাজা পাতা)' | 'সীমিত প্রিমিয়াম ব্যাচ' | 'অ্যান্টিক ভল্ট রিজার্ভ';
}

export interface LuckyVoucher {
  id: string;
  code: string;
  title: string;
  discountAmount: number;
  description: string;
  expiry: string;
  type: 'discount' | 'free_shipping' | 'free_pack';
}

export interface NewsUpdateNotice {
  source: string;
  time: string;
  headline: string;
  text: string;
}

export interface UserReview {
  id: string;
  bidiId: string;
  bidiName: string;
  userName: string;
  userRole: string;
  location: string;
  rating: number;
  date: string;
  comment: string;
  funnyEffectWitnessed: string;
  helpfulCount: number;
  avatarSeed: string;
  verifiedPurchase?: boolean;
  verifiedBadge?: string;
  isAlien?: boolean;
  alienNote?: string;
  newsUpdate?: NewsUpdateNotice;
}

export interface CartItem {
  product: BidiProduct;
  quantity: number;
}

export interface DeliveryOption {
  id: string;
  name: string;
  subtitle: string;
  estimatedTime: string;
  price: number;
  humorousNote: string;
}

export type PaymentGatewayType = 'bkash' | 'nagad' | 'rocket' | 'cod';

export interface OrderDetails {
  orderId: string;
  customerName: string;
  phone: string;
  district: string;
  fullAddress: string;
  specialInstructions: string;
  stealthWrapperType: string;
  items: CartItem[];
  subtotal: number;
  discountAmount: number;
  appliedVoucherCode?: string;
  deliveryOption: DeliveryOption;
  totalAmount: number;
  paymentMethod: PaymentGatewayType;
  transactionId?: string;
  orderTime: string;
  estimatedArrival: string;
  statusStep: number; // 1 to 4
  status: string;
}

export interface CuringStage {
  day: string;
  title: string;
  subtitle: string;
  moisture: string;
  aromaIndex: string;
  chlorophyllDrop: string;
  detail: string;
  craftsmanNote: string;
}

export interface DealershipInquiry {
  businessName: string;
  ownerName: string;
  district: string;
  phone: string;
  currentShopType: string;
  estimatedMonthlyCartons: number;
  notes: string;
}
