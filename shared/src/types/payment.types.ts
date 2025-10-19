// Payment System Type Definitions
// Digital Allowance & Wallet Types

export interface Wallet {
  id: string;
  userId: string;
  balance: number;
  totalEarned: number;
  totalSpent: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
}

export interface Allowance {
  id: string;
  parentId: string;
  childId: string;
  weeklyAmount: number;
  pointsBonusRate: number; // e.g., 0.01 = $0.01 per point
  paymentMethod: 'stripe' | 'paypal' | 'mock';
  paymentMethodId?: string;
  nextPayoutDate?: string;
  active: boolean;
  autoApproveRedemptions: boolean;
  maxRedemptionPerWeek?: number;
  createdAt: string;
  updatedAt: string;
}

export type TransactionType = 
  | 'allowance_deposit'
  | 'points_redemption'
  | 'purchase'
  | 'refund'
  | 'bonus'
  | 'withdrawal';

export type TransactionStatus = 
  | 'pending'
  | 'completed'
  | 'failed'
  | 'cancelled'
  | 'refunded';

export interface Transaction {
  id: string;
  userId: string;
  transactionType: TransactionType;
  amount: number;
  pointsInvolved?: number;
  status: TransactionStatus;
  description?: string;
  metadata?: Record<string, any>;
  referenceId?: string;
  createdAt: string;
}

export type RedemptionStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';

export interface RedemptionRequest {
  id: string;
  childId: string;
  parentId: string;
  allowanceId: string;
  pointsAmount: number;
  dollarAmount: number;
  status: RedemptionStatus;
  requestMessage?: string;
  parentResponse?: string;
  createdAt: string;
  processedAt?: string;
}

export type ShopItemType = 
  | 'story_theme'
  | 'voice_pack'
  | 'avatar_skin'
  | 'badge'
  | 'hint_pack'
  | 'premium_feature';

export interface ShopItem {
  id: string;
  itemType: ShopItemType;
  name: string;
  description?: string;
  price: number;
  metadata?: Record<string, any>;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserPurchase {
  id: string;
  userId: string;
  shopItemId: string;
  transactionId?: string;
  purchaseDate: string;
  // Joined data
  item?: ShopItem;
}

// Request/Response DTOs

export interface CreateAllowanceRequest {
  parentId: string;
  childId: string;
  weeklyAmount: number;
  pointsBonusRate: number;
  paymentMethod: 'stripe' | 'paypal' | 'mock';
  paymentMethodId?: string;
  autoApproveRedemptions?: boolean;
  maxRedemptionPerWeek?: number;
}

export interface UpdateAllowanceRequest {
  weeklyAmount?: number;
  pointsBonusRate?: number;
  active?: boolean;
  autoApproveRedemptions?: boolean;
  maxRedemptionPerWeek?: number;
}

export interface RedeemPointsRequest {
  userId: string;
  pointsAmount: number;
  requestMessage?: string;
}

export interface RedeemPointsResponse {
  success: boolean;
  requiresApproval: boolean;
  redemptionRequestId?: string;
  dollarAmount?: number;
  newBalance?: number;
  message: string;
}

export interface ProcessRedemptionRequest {
  redemptionRequestId: string;
  parentId: string;
  approved: boolean;
  responseMessage?: string;
}

export interface PurchaseItemRequest {
  userId: string;
  shopItemId: string;
}

export interface PurchaseItemResponse {
  success: boolean;
  purchase?: UserPurchase;
  newBalance: number;
  message: string;
}

export interface WalletStats {
  balance: number;
  totalEarned: number;
  totalSpent: number;
  pendingRedemptions: number;
  recentTransactions: Transaction[];
}

export interface ParentDashboardStats {
  totalChildren: number;
  activeAllowances: number;
  totalSpentThisMonth: number;
  pendingRedemptions: number;
  children: ChildWalletSummary[];
}

export interface ChildWalletSummary {
  childId: string;
  childName: string;
  walletBalance: number;
  totalPoints: number;
  allowanceActive: boolean;
  weeklyAmount: number;
  lastActivity?: string;
}

// Constants

export const POINTS_TO_DOLLAR_RATE = 100; // 100 points = $1.00 (default)

export const TRANSACTION_TYPE_LABELS: Record<TransactionType, string> = {
  allowance_deposit: 'Weekly Allowance',
  points_redemption: 'Points Redeemed',
  purchase: 'Shop Purchase',
  refund: 'Refund',
  bonus: 'Bonus Payment',
  withdrawal: 'Withdrawal'
};

export const SHOP_ITEM_TYPE_LABELS: Record<ShopItemType, string> = {
  story_theme: 'Story Theme Pack',
  voice_pack: 'Voice Pack',
  avatar_skin: 'Avatar Skin',
  badge: 'Achievement Badge',
  hint_pack: 'Hint Credits',
  premium_feature: 'Premium Feature'
};

