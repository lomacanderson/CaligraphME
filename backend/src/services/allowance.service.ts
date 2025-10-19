// Allowance Service
// Manages parent-child allowance configurations

import { SupabaseService } from './database/supabase.service.js';
import { walletService } from './wallet.service.js';
import { paymentService } from './payment.service.js';
import type {
  Allowance,
  CreateAllowanceRequest,
  UpdateAllowanceRequest,
  RedemptionRequest,
  ProcessRedemptionRequest,
  ParentDashboardStats,
  ChildWalletSummary
} from '../../../shared/src/types/payment.types.js';

export class AllowanceService {
  /**
   * Create new allowance configuration
   */
  async createAllowance(request: CreateAllowanceRequest): Promise<Allowance> {
    const {
      parentId,
      childId,
      weeklyAmount,
      pointsBonusRate,
      paymentMethod,
      paymentMethodId,
      autoApproveRedemptions = false,
      maxRedemptionPerWeek
    } = request;

    // Note: parentId and childId can be the same for single-user mode
    // Calculate next payout date (7 days from now)
    const nextPayoutDate = new Date();
    nextPayoutDate.setDate(nextPayoutDate.getDate() + 7);

    // Create allowance
    const supabase = SupabaseService.getClient();
    const { data, error } = await supabase
      .from('allowances')
      .insert({
        parent_id: parentId,
        child_id: childId,
        weekly_amount: weeklyAmount,
        points_bonus_rate: pointsBonusRate,
        payment_method: paymentMethod,
        payment_method_id: paymentMethodId,
        next_payout_date: nextPayoutDate.toISOString().split('T')[0],
        active: true,
        auto_approve_redemptions: autoApproveRedemptions,
        max_redemption_per_week: maxRedemptionPerWeek
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating allowance:', error);
      throw new Error('Failed to create allowance');
    }

    return this.mapToAllowance(data);
  }

  /**
   * Update allowance configuration
   */
  async updateAllowance(
    allowanceId: string,
    updates: UpdateAllowanceRequest
  ): Promise<Allowance> {
    const updateData: any = {
      updated_at: new Date().toISOString()
    };

    if (updates.weeklyAmount !== undefined) {
      updateData.weekly_amount = updates.weeklyAmount;
    }
    if (updates.pointsBonusRate !== undefined) {
      updateData.points_bonus_rate = updates.pointsBonusRate;
    }
    if (updates.active !== undefined) {
      updateData.active = updates.active;
    }
    if (updates.autoApproveRedemptions !== undefined) {
      updateData.auto_approve_redemptions = updates.autoApproveRedemptions;
    }
    if (updates.maxRedemptionPerWeek !== undefined) {
      updateData.max_redemption_per_week = updates.maxRedemptionPerWeek;
    }

    const supabase = SupabaseService.getClient();
    const { data, error } = await supabase
      .from('allowances')
      .update(updateData)
      .eq('id', allowanceId)
      .select()
      .single();

    if (error) {
      console.error('Error updating allowance:', error);
      throw new Error('Failed to update allowance');
    }

    return this.mapToAllowance(data);
  }

  /**
   * Get allowance by ID
   */
  async getAllowance(allowanceId: string): Promise<Allowance | null> {
    const supabase = SupabaseService.getClient();
    const { data, error } = await supabase
      .from('allowances')
      .select('*')
      .eq('id', allowanceId)
      .single();

    if (error) {
      console.error('Error fetching allowance:', error);
      return null;
    }

    return this.mapToAllowance(data);
  }

  /**
   * Get allowances for a parent
   */
  async getParentAllowances(parentId: string): Promise<Allowance[]> {
    const supabase = SupabaseService.getClient();
    const { data, error } = await supabase
      .from('allowances')
      .select('*')
      .eq('parent_id', parentId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching parent allowances:', error);
      return [];
    }

    return data.map(this.mapToAllowance);
  }

  /**
   * Get active allowance for a child
   */
  async getChildAllowance(childId: string): Promise<Allowance | null> {
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

    return this.mapToAllowance(data);
  }

  /**
   * Process weekly allowance payouts (should be called by cron job)
   */
  async processWeeklyPayouts(): Promise<void> {
    const today = new Date().toISOString().split('T')[0];

    // Get all allowances due for payout
    const supabase = SupabaseService.getClient();
    const { data: dueAllowances, error } = await supabase
      .from('allowances')
      .select('*')
      .eq('active', true)
      .lte('next_payout_date', today);

    if (error || !dueAllowances) {
      console.error('Error fetching due allowances:', error);
      return;
    }

    for (const allowance of dueAllowances) {
      try {
        await this.processAllowancePayout(allowance);
      } catch (error) {
        console.error(`Error processing payout for allowance ${allowance.id}:`, error);
      }
    }
  }

  /**
   * Process single allowance payout
   */
  private async processAllowancePayout(allowanceData: any): Promise<void> {
    const childId = allowanceData.child_id;
    const amount = parseFloat(allowanceData.weekly_amount);

    // Add funds to child's wallet
    await walletService.addFunds(
      childId,
      amount,
      'Weekly allowance deposit'
    );

    // Create transaction record
    await paymentService.createTransaction({
      userId: childId,
      transactionType: 'allowance_deposit',
      amount,
      status: 'completed',
      description: 'Weekly allowance',
      metadata: { allowanceId: allowanceData.id }
    });

    // Update next payout date (add 7 days)
    const nextPayoutDate = new Date(allowanceData.next_payout_date);
    nextPayoutDate.setDate(nextPayoutDate.getDate() + 7);

    const supabase = SupabaseService.getClient();
    await supabase
      .from('allowances')
      .update({
        next_payout_date: nextPayoutDate.toISOString().split('T')[0]
      })
      .eq('id', allowanceData.id);

    console.log(`Processed allowance payout: $${amount} to user ${childId}`);
  }

  /**
   * Get pending redemption requests for parent
   */
  async getPendingRedemptions(parentId: string): Promise<RedemptionRequest[]> {
    const supabase = SupabaseService.getClient();
    const { data, error } = await supabase
      .from('redemption_requests')
      .select('*')
      .eq('parent_id', parentId)
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching pending redemptions:', error);
      return [];
    }

    return data.map(this.mapToRedemptionRequest);
  }

  /**
   * Get all redemption requests for child
   */
  async getChildRedemptions(childId: string): Promise<RedemptionRequest[]> {
    const supabase = SupabaseService.getClient();
    const { data, error } = await supabase
      .from('redemption_requests')
      .select('*')
      .eq('child_id', childId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching child redemptions:', error);
      return [];
    }

    return data.map(this.mapToRedemptionRequest);
  }

  /**
   * Process redemption request (approve/reject)
   */
  async processRedemption(request: ProcessRedemptionRequest): Promise<RedemptionRequest> {
    const { redemptionRequestId, parentId, approved, responseMessage } = request;

    // Get redemption request
    const supabase = SupabaseService.getClient();
    const { data: redemption, error: fetchError } = await supabase
      .from('redemption_requests')
      .select('*')
      .eq('id', redemptionRequestId)
      .eq('parent_id', parentId)
      .single();

    if (fetchError || !redemption) {
      throw new Error('Redemption request not found');
    }

    if (redemption.status !== 'pending') {
      throw new Error('Redemption request already processed');
    }

    const newStatus = approved ? 'approved' : 'rejected';

    // Update redemption request
    const { data: updated, error: updateError } = await supabase
      .from('redemption_requests')
      .update({
        status: newStatus,
        parent_response: responseMessage,
        processed_at: new Date().toISOString()
      })
      .eq('id', redemptionRequestId)
      .select()
      .single();

    if (updateError) {
      throw new Error('Failed to update redemption request');
    }

    // If approved, process the redemption
    if (approved) {
      const childId = redemption.child_id;
      const pointsAmount = redemption.points_amount;
      const dollarAmount = parseFloat(redemption.dollar_amount);

      // Use the payment service to process the redemption
      const { UserService } = await import('./user.service.js');
      await UserService.deductPoints(childId, pointsAmount);

      await walletService.addFunds(
        childId,
        dollarAmount,
        `Redeemed ${pointsAmount} points (parent approved)`
      );

      await paymentService.createTransaction({
        userId: childId,
        transactionType: 'points_redemption',
        amount: dollarAmount,
        pointsInvolved: pointsAmount,
        status: 'completed',
        description: `Points redemption approved by parent`,
        metadata: { redemptionRequestId, allowanceId: redemption.allowance_id }
      });
    }

    return this.mapToRedemptionRequest(updated);
  }

  /**
   * Get parent dashboard statistics
   */
  async getParentDashboard(parentId: string): Promise<ParentDashboardStats> {
    // Get all allowances
    const allowances = await this.getParentAllowances(parentId);
    const activeAllowances = allowances.filter(a => a.active);

    // Get pending redemptions count
    const pendingRedemptions = await this.getPendingRedemptions(parentId);

    // Calculate total spent this month
    const firstDayOfMonth = new Date();
    firstDayOfMonth.setDate(1);
    firstDayOfMonth.setHours(0, 0, 0, 0);

    const supabase = SupabaseService.getClient();
    const { data: monthlyTransactions, error } = await supabase
      .from('transactions')
      .select('amount')
      .in('transaction_type', ['allowance_deposit', 'points_redemption'])
      .gte('created_at', firstDayOfMonth.toISOString());

    const totalSpentThisMonth = monthlyTransactions
      ? monthlyTransactions.reduce((sum, t) => sum + parseFloat(t.amount), 0)
      : 0;

    // Get children summaries
    const children: ChildWalletSummary[] = await Promise.all(
      activeAllowances.map(async (allowance) => {
        const wallet = await walletService.getWallet(allowance.childId);
        const { UserService } = await import('./user.service.js');
        const user = await UserService.getUserById(allowance.childId);

        return {
          childId: allowance.childId,
          childName: user?.name || 'Unknown',
          walletBalance: wallet?.balance || 0,
          totalPoints: user?.totalPoints || 0,
          allowanceActive: allowance.active,
          weeklyAmount: allowance.weeklyAmount,
          lastActivity: user?.updatedAt
        };
      })
    );

    return {
      totalChildren: activeAllowances.length,
      activeAllowances: activeAllowances.length,
      totalSpentThisMonth,
      pendingRedemptions: pendingRedemptions.length,
      children
    };
  }

  // Mapping functions
  private mapToAllowance(data: any): Allowance {
    return {
      id: data.id,
      parentId: data.parent_id,
      childId: data.child_id,
      weeklyAmount: parseFloat(data.weekly_amount),
      pointsBonusRate: parseFloat(data.points_bonus_rate),
      paymentMethod: data.payment_method,
      paymentMethodId: data.payment_method_id,
      nextPayoutDate: data.next_payout_date,
      active: data.active,
      autoApproveRedemptions: data.auto_approve_redemptions,
      maxRedemptionPerWeek: data.max_redemption_per_week
        ? parseFloat(data.max_redemption_per_week)
        : undefined,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  }

  private mapToRedemptionRequest(data: any): RedemptionRequest {
    return {
      id: data.id,
      childId: data.child_id,
      parentId: data.parent_id,
      allowanceId: data.allowance_id,
      pointsAmount: data.points_amount,
      dollarAmount: parseFloat(data.dollar_amount),
      status: data.status,
      requestMessage: data.request_message,
      parentResponse: data.parent_response,
      createdAt: data.created_at,
      processedAt: data.processed_at
    };
  }
}

export const allowanceService = new AllowanceService();

