// Payment API Service
// Frontend API client for payment and shop operations

import type {
  ShopItem,
  UserPurchase,
  RedeemPointsRequest,
  RedeemPointsResponse,
  PurchaseItemRequest,
  PurchaseItemResponse,
  RedemptionRequest
} from '../../../../shared/src/types/payment.types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const paymentApi = {
  // ==================== SHOP OPERATIONS ====================

  /**
   * Get all shop items
   */
  async getShopItems(itemType?: string): Promise<ShopItem[]> {
    const url = itemType
      ? `${API_URL}/payment/shop/items?type=${itemType}`
      : `${API_URL}/payment/shop/items`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Failed to fetch shop items');
    }
    
    return response.json();
  },

  /**
   * Get user's purchases
   */
  async getUserPurchases(userId: string): Promise<UserPurchase[]> {
    const response = await fetch(`${API_URL}/payment/shop/purchases/${userId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch purchases');
    }
    
    return response.json();
  },

  /**
   * Purchase a shop item
   */
  async purchaseItem(request: PurchaseItemRequest): Promise<PurchaseItemResponse> {
    const response = await fetch(`${API_URL}/payment/shop/purchase`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(request)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to purchase item');
    }
    
    return response.json();
  },

  // ==================== REDEMPTION OPERATIONS ====================

  /**
   * Redeem points for money
   */
  async redeemPoints(request: RedeemPointsRequest): Promise<RedeemPointsResponse> {
    const response = await fetch(`${API_URL}/payment/redeem`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(request)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to redeem points');
    }
    
    return response.json();
  },

  /**
   * Get child's redemption requests
   */
  async getChildRedemptions(childId: string): Promise<RedemptionRequest[]> {
    const response = await fetch(`${API_URL}/payment/redemptions/child/${childId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch redemptions');
    }
    
    return response.json();
  }
};

