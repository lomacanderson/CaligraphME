// Wallet API Service
// Frontend API client for wallet operations

import type {
  Wallet,
  WalletStats,
  Transaction
} from '../../../../shared/src/types/payment.types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const walletApi = {
  /**
   * Get user's wallet
   */
  async getWallet(userId: string): Promise<Wallet> {
    const response = await fetch(`${API_URL}/payment/wallet/${userId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch wallet');
    }
    
    return response.json();
  },

  /**
   * Get wallet with statistics
   */
  async getWalletStats(userId: string): Promise<WalletStats> {
    const response = await fetch(`${API_URL}/payment/wallet/${userId}/stats`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch wallet stats');
    }
    
    return response.json();
  },

  /**
   * Get user's transactions
   */
  async getTransactions(userId: string, limit: number = 20): Promise<Transaction[]> {
    const response = await fetch(
      `${API_URL}/payment/transactions/${userId}?limit=${limit}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch transactions');
    }
    
    return response.json();
  }
};

