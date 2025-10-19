// Wallet Service
// Manages user virtual wallet balances

import { SupabaseService } from './database/supabase.service.js';
import type { Wallet, Transaction, WalletStats } from '../../../shared/src/types/payment.types.js';

export class WalletService {
  /**
   * Get user's wallet information
   */
  async getWallet(userId: string): Promise<Wallet | null> {
    const supabase = SupabaseService.getClient();
    const { data, error } = await supabase
      .from('wallets')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error fetching wallet:', error);
      return null;
    }

    return this.mapToWallet(data);
  }

  /**
   * Get wallet with statistics
   */
  async getWalletStats(userId: string): Promise<WalletStats | null> {
    const wallet = await this.getWallet(userId);
    if (!wallet) return null;

    const recentTransactions = await this.getRecentTransactions(userId, 10);
    const pendingRedemptions = await this.getPendingRedemptionsCount(userId);

    return {
      balance: wallet.balance,
      totalEarned: wallet.totalEarned,
      totalSpent: wallet.totalSpent,
      pendingRedemptions,
      recentTransactions
    };
  }

  /**
   * Add funds to wallet
   */
  async addFunds(userId: string, amount: number, description?: string): Promise<Wallet | null> {
    // Get current wallet
    const wallet = await this.getWallet(userId);
    if (!wallet) {
      throw new Error('Wallet not found');
    }

    // Calculate new values
    const newBalance = wallet.balance + amount;
    const newTotalEarned = wallet.totalEarned + amount;

    // Update wallet
    const supabase = SupabaseService.getClient();
    const { data, error } = await supabase
      .from('wallets')
      .update({
        balance: newBalance,
        total_earned: newTotalEarned,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error adding funds:', error);
      throw new Error('Failed to add funds to wallet');
    }

    return this.mapToWallet(data);
  }

  /**
   * Deduct funds from wallet
   */
  async deductFunds(userId: string, amount: number): Promise<Wallet | null> {
    // Get current wallet
    const wallet = await this.getWallet(userId);
    if (!wallet) {
      throw new Error('Wallet not found');
    }

    // Check sufficient balance
    if (wallet.balance < amount) {
      throw new Error('Insufficient balance');
    }

    // Calculate new values
    const newBalance = wallet.balance - amount;
    const newTotalSpent = wallet.totalSpent + amount;

    // Update wallet
    const supabase = SupabaseService.getClient();
    const { data, error } = await supabase
      .from('wallets')
      .update({
        balance: newBalance,
        total_spent: newTotalSpent,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error deducting funds:', error);
      throw new Error('Failed to deduct funds from wallet');
    }

    return this.mapToWallet(data);
  }

  /**
   * Get recent transactions
   */
  async getRecentTransactions(userId: string, limit: number = 20): Promise<Transaction[]> {
    const supabase = SupabaseService.getClient();
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching transactions:', error);
      return [];
    }

    return data.map(this.mapToTransaction);
  }

  /**
   * Get transactions by type
   */
  async getTransactionsByType(
    userId: string,
    transactionType: string,
    limit: number = 20
  ): Promise<Transaction[]> {
    const supabase = SupabaseService.getClient();
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .eq('transaction_type', transactionType)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching transactions by type:', error);
      return [];
    }

    return data.map(this.mapToTransaction);
  }

  /**
   * Get transaction by ID
   */
  async getTransaction(transactionId: string): Promise<Transaction | null> {
    const supabase = SupabaseService.getClient();
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('id', transactionId)
      .single();

    if (error) {
      console.error('Error fetching transaction:', error);
      return null;
    }

    return this.mapToTransaction(data);
  }

  /**
   * Get count of pending redemptions
   */
  private async getPendingRedemptionsCount(userId: string): Promise<number> {
    const supabase = SupabaseService.getClient();
    const { count, error } = await supabase
      .from('redemption_requests')
      .select('*', { count: 'exact', head: true })
      .eq('child_id', userId)
      .eq('status', 'pending');

    if (error) {
      console.error('Error counting pending redemptions:', error);
      return 0;
    }

    return count || 0;
  }

  /**
   * Create wallet for new user (usually called by trigger, but can be manual)
   */
  async createWallet(userId: string): Promise<Wallet> {
    const supabase = SupabaseService.getClient();
    const { data, error } = await supabase
      .from('wallets')
      .insert({
        user_id: userId,
        balance: 0,
        total_earned: 0,
        total_spent: 0,
        currency: 'USD'
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating wallet:', error);
      throw new Error('Failed to create wallet');
    }

    return this.mapToWallet(data);
  }

  // Mapping functions
  private mapToWallet(data: any): Wallet {
    return {
      id: data.id,
      userId: data.user_id,
      balance: parseFloat(data.balance),
      totalEarned: parseFloat(data.total_earned),
      totalSpent: parseFloat(data.total_spent),
      currency: data.currency,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  }

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
}

export const walletService = new WalletService();

