// Payment Controller
// Handles HTTP requests for payment, wallet, and allowance operations

import { Request, Response } from 'express';
import { walletService } from '../services/wallet.service.js';
import { paymentService } from '../services/payment.service.js';
import { allowanceService } from '../services/allowance.service.js';
import type {
  CreateAllowanceRequest,
  UpdateAllowanceRequest,
  RedeemPointsRequest,
  ProcessRedemptionRequest,
  PurchaseItemRequest
} from '../../../shared/src/types/payment.types.js';

export class PaymentController {
  // ==================== WALLET ENDPOINTS ====================

  /**
   * GET /api/payment/wallet/:userId
   * Get user's wallet information
   */
  async getWallet(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;

      const wallet = await walletService.getWallet(userId);

      if (!wallet) {
        res.status(404).json({ error: 'Wallet not found' });
        return;
      }

      res.json(wallet);
    } catch (error) {
      console.error('Error in getWallet:', error);
      res.status(500).json({ error: 'Failed to fetch wallet' });
    }
  }

  /**
   * GET /api/payment/wallet/:userId/stats
   * Get wallet with statistics
   */
  async getWalletStats(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;

      const stats = await walletService.getWalletStats(userId);

      if (!stats) {
        res.status(404).json({ error: 'Wallet not found' });
        return;
      }

      res.json(stats);
    } catch (error) {
      console.error('Error in getWalletStats:', error);
      res.status(500).json({ error: 'Failed to fetch wallet stats' });
    }
  }

  /**
   * GET /api/payment/transactions/:userId
   * Get user's recent transactions
   */
  async getTransactions(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const limit = parseInt(req.query.limit as string) || 20;

      const transactions = await walletService.getRecentTransactions(userId, limit);

      res.json(transactions);
    } catch (error) {
      console.error('Error in getTransactions:', error);
      res.status(500).json({ error: 'Failed to fetch transactions' });
    }
  }

  // ==================== SHOP ENDPOINTS ====================

  /**
   * GET /api/payment/shop/items
   * Get all shop items
   */
  async getShopItems(req: Request, res: Response): Promise<void> {
    try {
      const itemType = req.query.type as string | undefined;

      const items = await paymentService.getShopItems(itemType);

      res.json(items);
    } catch (error) {
      console.error('Error in getShopItems:', error);
      res.status(500).json({ error: 'Failed to fetch shop items' });
    }
  }

  /**
   * GET /api/payment/shop/purchases/:userId
   * Get user's purchases
   */
  async getUserPurchases(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;

      const purchases = await paymentService.getUserPurchases(userId);

      res.json(purchases);
    } catch (error) {
      console.error('Error in getUserPurchases:', error);
      res.status(500).json({ error: 'Failed to fetch purchases' });
    }
  }

  /**
   * POST /api/payment/shop/purchase
   * Purchase a shop item
   */
  async purchaseItem(req: Request, res: Response): Promise<void> {
    try {
      const purchaseRequest: PurchaseItemRequest = req.body;

      const result = await paymentService.purchaseItem(purchaseRequest);

      res.json(result);
    } catch (error: any) {
      console.error('Error in purchaseItem:', error);
      res.status(400).json({ error: error.message || 'Failed to purchase item' });
    }
  }

  // ==================== REDEMPTION ENDPOINTS ====================

  /**
   * POST /api/payment/redeem
   * Redeem points for money
   */
  async redeemPoints(req: Request, res: Response): Promise<void> {
    try {
      const redeemRequest: RedeemPointsRequest = req.body;

      const result = await paymentService.redeemPoints(redeemRequest);

      res.json(result);
    } catch (error: any) {
      console.error('Error in redeemPoints:', error);
      res.status(400).json({ error: error.message || 'Failed to redeem points' });
    }
  }

  /**
   * GET /api/payment/redemptions/child/:childId
   * Get child's redemption requests
   */
  async getChildRedemptions(req: Request, res: Response): Promise<void> {
    try {
      const { childId } = req.params;

      const redemptions = await allowanceService.getChildRedemptions(childId);

      res.json(redemptions);
    } catch (error) {
      console.error('Error in getChildRedemptions:', error);
      res.status(500).json({ error: 'Failed to fetch redemptions' });
    }
  }

  // ==================== ALLOWANCE ENDPOINTS ====================

  /**
   * POST /api/payment/allowance
   * Create new allowance
   */
  async createAllowance(req: Request, res: Response): Promise<void> {
    try {
      const allowanceRequest: CreateAllowanceRequest = req.body;

      const allowance = await allowanceService.createAllowance(allowanceRequest);

      res.status(201).json(allowance);
    } catch (error: any) {
      console.error('Error in createAllowance:', error);
      res.status(400).json({ error: error.message || 'Failed to create allowance' });
    }
  }

  /**
   * PUT /api/payment/allowance/:allowanceId
   * Update allowance
   */
  async updateAllowance(req: Request, res: Response): Promise<void> {
    try {
      const { allowanceId } = req.params;
      const updates: UpdateAllowanceRequest = req.body;

      const allowance = await allowanceService.updateAllowance(allowanceId, updates);

      res.json(allowance);
    } catch (error: any) {
      console.error('Error in updateAllowance:', error);
      res.status(400).json({ error: error.message || 'Failed to update allowance' });
    }
  }

  /**
   * GET /api/payment/allowance/parent/:parentId
   * Get parent's allowances
   */
  async getParentAllowances(req: Request, res: Response): Promise<void> {
    try {
      const { parentId } = req.params;

      const allowances = await allowanceService.getParentAllowances(parentId);

      res.json(allowances);
    } catch (error) {
      console.error('Error in getParentAllowances:', error);
      res.status(500).json({ error: 'Failed to fetch allowances' });
    }
  }

  /**
   * GET /api/payment/allowance/child/:childId
   * Get child's active allowance
   */
  async getChildAllowance(req: Request, res: Response): Promise<void> {
    try {
      const { childId } = req.params;

      const allowance = await allowanceService.getChildAllowance(childId);

      if (!allowance) {
        res.status(404).json({ error: 'No active allowance found' });
        return;
      }

      res.json(allowance);
    } catch (error) {
      console.error('Error in getChildAllowance:', error);
      res.status(500).json({ error: 'Failed to fetch allowance' });
    }
  }

  // ==================== PARENT DASHBOARD ENDPOINTS ====================

  /**
   * GET /api/payment/parent/dashboard/:parentId
   * Get parent dashboard statistics
   */
  async getParentDashboard(req: Request, res: Response): Promise<void> {
    try {
      const { parentId } = req.params;

      const dashboard = await allowanceService.getParentDashboard(parentId);

      res.json(dashboard);
    } catch (error) {
      console.error('Error in getParentDashboard:', error);
      res.status(500).json({ error: 'Failed to fetch dashboard' });
    }
  }

  /**
   * GET /api/payment/parent/redemptions/:parentId
   * Get pending redemption requests for parent
   */
  async getPendingRedemptions(req: Request, res: Response): Promise<void> {
    try {
      const { parentId } = req.params;

      const redemptions = await allowanceService.getPendingRedemptions(parentId);

      res.json(redemptions);
    } catch (error) {
      console.error('Error in getPendingRedemptions:', error);
      res.status(500).json({ error: 'Failed to fetch redemptions' });
    }
  }

  /**
   * POST /api/payment/parent/process-redemption
   * Process (approve/reject) redemption request
   */
  async processRedemption(req: Request, res: Response): Promise<void> {
    try {
      const processRequest: ProcessRedemptionRequest = req.body;

      const redemption = await allowanceService.processRedemption(processRequest);

      res.json(redemption);
    } catch (error: any) {
      console.error('Error in processRedemption:', error);
      res.status(400).json({ error: error.message || 'Failed to process redemption' });
    }
  }

  // ==================== ADMIN ENDPOINTS ====================

  /**
   * POST /api/payment/admin/process-weekly-payouts
   * Manually trigger weekly allowance payouts (normally called by cron)
   */
  async processWeeklyPayouts(req: Request, res: Response): Promise<void> {
    try {
      await allowanceService.processWeeklyPayouts();

      res.json({ success: true, message: 'Weekly payouts processed' });
    } catch (error) {
      console.error('Error in processWeeklyPayouts:', error);
      res.status(500).json({ error: 'Failed to process payouts' });
    }
  }
}

export const paymentController = new PaymentController();

