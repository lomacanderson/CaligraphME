// Payment Service
// Handles payment processing with mock payment provider

import { SupabaseService } from './database/supabase.service.js';
import { walletService } from './wallet.service.js';
import { UserService } from './user.service.js';
import { MockPaymentProvider } from './mock-payment-provider.js';
import type {
  Transaction,
  TransactionType,
  TransactionStatus,
  RedeemPointsRequest,
  RedeemPointsResponse,
  PurchaseItemRequest,
  PurchaseItemResponse,
  ShopItem,
  UserPurchase,
  POINTS_TO_DOLLAR_RATE
} from '../../../shared/src/types/payment.types.js';

export class PaymentService {
  private readonly POINTS_TO_DOLLAR_RATE = 100; // 100 points = $1.00

  /**
   * Redeem points for money
   */
  async redeemPoints(request: RedeemPointsRequest): Promise<RedeemPointsResponse> {
    const { userId, pointsAmount, requestMessage } = request;

    // Validate user has enough points
    const user = await UserService.getUserById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    if (user.totalPoints < pointsAmount) {
      throw new Error('Insufficient points');
    }

    // Calculate dollar amount
    const dollarAmount = pointsAmount / this.POINTS_TO_DOLLAR_RATE;

    // Check if user has an allowance (requires parent approval)
    const allowance = await this.getActiveAllowanceForChild(userId);

    if (allowance) {
      // Check if auto-approve is enabled
      if (allowance.auto_approve_redemptions) {
        // Auto-approve: Process immediately
        await this.processRedemption(userId, pointsAmount, dollarAmount, allowance.id);

        const newWallet = await walletService.getWallet(userId);

        return {
          success: true,
          requiresApproval: false,
          dollarAmount,
          newBalance: newWallet?.balance || 0,
          message: `Successfully redeemed ${pointsAmount} points for $${dollarAmount.toFixed(2)}!`
        };
      } else {
        // Create redemption request for parent approval
        const redemptionRequest = await this.createRedemptionRequest({
          childId: userId,
          parentId: allowance.parent_id,
          allowanceId: allowance.id,
          pointsAmount,
          dollarAmount,
          requestMessage
        });

        return {
          success: true,
          requiresApproval: true,
          redemptionRequestId: redemptionRequest.id,
          dollarAmount,
          message: `Redemption request sent to parent for approval. You'll receive $${dollarAmount.toFixed(2)} once approved.`
        };
      }
    } else {
      // No allowance: Process directly (for independent users)
      await this.processRedemption(userId, pointsAmount, dollarAmount);

      const newWallet = await walletService.getWallet(userId);

      return {
        success: true,
        requiresApproval: false,
        dollarAmount,
        newBalance: newWallet?.balance || 0,
        message: `Successfully redeemed ${pointsAmount} points for $${dollarAmount.toFixed(2)}!`
      };
    }
  }

  /**
   * Process points redemption (internal)
   */
  private async processRedemption(
    userId: string,
    pointsAmount: number,
    dollarAmount: number,
    allowanceId?: string
  ): Promise<void> {
    // Deduct points from user
    await UserService.deductPoints(userId, pointsAmount);

    // Add funds to wallet
    await walletService.addFunds(
      userId,
      dollarAmount,
      `Redeemed ${pointsAmount} points`
    );

    // Create transaction record
    await this.createTransaction({
      userId,
      transactionType: 'points_redemption',
      amount: dollarAmount,
      pointsInvolved: pointsAmount,
      status: 'completed',
      description: `Redeemed ${pointsAmount} points for $${dollarAmount.toFixed(2)}`,
      metadata: { allowanceId }
    });
  }

  /**
   * Purchase shop item
   */
  async purchaseItem(request: PurchaseItemRequest): Promise<PurchaseItemResponse> {
    const { userId, shopItemId } = request;

    // Get shop item
    const item = await this.getShopItem(shopItemId);
    if (!item || !item.active) {
      throw new Error('Item not found or unavailable');
    }

    // Check if user already owns this item
    const alreadyOwns = await this.userOwnsItem(userId, shopItemId);
    if (alreadyOwns) {
      throw new Error('You already own this item');
    }

    // Get user wallet
    const wallet = await walletService.getWallet(userId);
    if (!wallet) {
      throw new Error('Wallet not found');
    }

    // Check sufficient balance
    if (wallet.balance < item.price) {
      throw new Error('Insufficient balance');
    }

    // Deduct from wallet
    await walletService.deductFunds(userId, item.price);

    // Create transaction
    const transaction = await this.createTransaction({
      userId,
      transactionType: 'purchase',
      amount: item.price,
      status: 'completed',
      description: `Purchased: ${item.name}`,
      metadata: { shopItemId, itemType: item.itemType }
    });

    // Record purchase
    const purchase = await this.recordPurchase(userId, shopItemId, transaction.id);

    // Apply item effects (e.g., unlock content)
    await this.applyItemEffects(userId, item);

    const newWallet = await walletService.getWallet(userId);

    return {
      success: true,
      purchase,
      newBalance: newWallet?.balance || 0,
      message: `Successfully purchased ${item.name}!`
    };
  }

  /**
   * Create transaction record
   */
  async createTransaction(data: {
    userId: string;
    transactionType: TransactionType;
    amount: number;
    pointsInvolved?: number;
    status: TransactionStatus;
    description?: string;
    metadata?: Record<string, any>;
    referenceId?: string;
  }): Promise<Transaction> {
    const supabase = SupabaseService.getClient();
    const { data: result, error } = await supabase
      .from('transactions')
      .insert({
        user_id: data.userId,
        transaction_type: data.transactionType,
        amount: data.amount,
        points_involved: data.pointsInvolved,
        status: data.status,
        description: data.description,
        metadata: data.metadata,
        reference_id: data.referenceId
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating transaction:', error);
      throw new Error('Failed to create transaction');
    }

    return this.mapToTransaction(result);
  }

  /**
   * Get shop item by ID
   */
  async getShopItem(itemId: string): Promise<ShopItem | null> {
    const supabase = SupabaseService.getClient();
    const { data, error } = await supabase
      .from('shop_items')
      .select('*')
      .eq('id', itemId)
      .single();

    if (error) {
      console.error('Error fetching shop item:', error);
      return null;
    }

    return this.mapToShopItem(data);
  }

  /**
   * Get all shop items
   */
  async getShopItems(itemType?: string): Promise<ShopItem[]> {
    const supabase = SupabaseService.getClient();
    let query = supabase
      .from('shop_items')
      .select('*')
      .eq('active', true)
      .order('price', { ascending: true });

    if (itemType) {
      query = query.eq('item_type', itemType);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching shop items:', error);
      return [];
    }

    return data.map(this.mapToShopItem);
  }

  /**
   * Get user's purchases
   */
  async getUserPurchases(userId: string): Promise<UserPurchase[]> {
    const supabase = SupabaseService.getClient();
    const { data, error } = await supabase
      .from('user_purchases')
      .select(`
        *,
        shop_items (*)
      `)
      .eq('user_id', userId)
      .order('purchase_date', { ascending: false });

    if (error) {
      console.error('Error fetching user purchases:', error);
      return [];
    }

    return data.map(this.mapToUserPurchase);
  }

  /**
   * Check if user owns an item
   */
  private async userOwnsItem(userId: string, shopItemId: string): Promise<boolean> {
    const supabase = SupabaseService.getClient();
    const { count, error } = await supabase
      .from('user_purchases')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('shop_item_id', shopItemId);

    if (error) {
      console.error('Error checking item ownership:', error);
      return false;
    }

    return (count || 0) > 0;
  }

  /**
   * Record purchase
   */
  private async recordPurchase(
    userId: string,
    shopItemId: string,
    transactionId: string
  ): Promise<UserPurchase> {
    const supabase = SupabaseService.getClient();
    const { data, error } = await supabase
      .from('user_purchases')
      .insert({
        user_id: userId,
        shop_item_id: shopItemId,
        transaction_id: transactionId
      })
      .select()
      .single();

    if (error) {
      console.error('Error recording purchase:', error);
      throw new Error('Failed to record purchase');
    }

    return this.mapToUserPurchase(data);
  }

  /**
   * Apply item effects to user account
   */
  private async applyItemEffects(userId: string, item: ShopItem): Promise<void> {
    // This is where you'd unlock content, add features, etc.
    // For now, just log the action
    console.log(`Applied effects for ${item.itemType}: ${item.name} to user ${userId}`);
    
    // TODO: Implement specific effects based on item type
    // e.g., unlock story themes, add hint credits, activate premium features
  }

  /**
   * Get active allowance for child
   */
  private async getActiveAllowanceForChild(childId: string): Promise<any> {
    const supabase = SupabaseService.getClient();
    const { data, error } = await supabase
      .from('allowances')
      .select('*')
      .eq('child_id', childId)
      .eq('active', true)
      .single();

    if (error) {
      return null;
    }

    return data;
  }

  /**
   * Create redemption request
   */
  private async createRedemptionRequest(data: {
    childId: string;
    parentId: string;
    allowanceId: string;
    pointsAmount: number;
    dollarAmount: number;
    requestMessage?: string;
  }): Promise<any> {
    const supabase = SupabaseService.getClient();
    const { data: result, error } = await supabase
      .from('redemption_requests')
      .insert({
        child_id: data.childId,
        parent_id: data.parentId,
        allowance_id: data.allowanceId,
        points_amount: data.pointsAmount,
        dollar_amount: data.dollarAmount,
        status: 'pending',
        request_message: data.requestMessage
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating redemption request:', error);
      throw new Error('Failed to create redemption request');
    }

    return result;
  }

  // Mapping functions
  private mapToTransaction(data: any): Transaction {
    return {
      id: data.id,
      userId: data.user_id,
      transactionType: data.transaction_type,
      amount: parseFloat(data.amount),
      pointsInvolved: data.points_involved,
      status: data.status,
      description: data.description,
      metadata: data.metadata,
      referenceId: data.reference_id,
      createdAt: data.created_at
    };
  }

  private mapToShopItem(data: any): ShopItem {
    return {
      id: data.id,
      itemType: data.item_type,
      name: data.name,
      description: data.description,
      price: parseFloat(data.price),
      metadata: data.metadata,
      active: data.active,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  }

  private mapToUserPurchase(data: any): UserPurchase {
    return {
      id: data.id,
      userId: data.user_id,
      shopItemId: data.shop_item_id,
      transactionId: data.transaction_id,
      purchaseDate: data.purchase_date,
      item: data.shop_items ? this.mapToShopItem(data.shop_items) : undefined
    };
  }
}

export const paymentService = new PaymentService();

