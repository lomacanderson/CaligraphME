// Payment Routes
// API routes for payment, wallet, and allowance operations

import { Router } from 'express';
import { paymentController } from '../controllers/payment.controller.js';

const router = Router();

// ==================== WALLET ROUTES ====================
router.get('/wallet/:userId', (req, res) => paymentController.getWallet(req, res));
router.get('/wallet/:userId/stats', (req, res) => paymentController.getWalletStats(req, res));
router.get('/transactions/:userId', (req, res) => paymentController.getTransactions(req, res));

// ==================== SHOP ROUTES ====================
router.get('/shop/items', (req, res) => paymentController.getShopItems(req, res));
router.get('/shop/purchases/:userId', (req, res) => paymentController.getUserPurchases(req, res));
router.post('/shop/purchase', (req, res) => paymentController.purchaseItem(req, res));

// ==================== REDEMPTION ROUTES ====================
router.post('/redeem', (req, res) => paymentController.redeemPoints(req, res));
router.get('/redemptions/child/:childId', (req, res) => paymentController.getChildRedemptions(req, res));

// ==================== ALLOWANCE ROUTES ====================
router.post('/allowance', (req, res) => paymentController.createAllowance(req, res));
router.put('/allowance/:allowanceId', (req, res) => paymentController.updateAllowance(req, res));
router.get('/allowance/parent/:parentId', (req, res) => paymentController.getParentAllowances(req, res));
router.get('/allowance/child/:childId', (req, res) => paymentController.getChildAllowance(req, res));

// ==================== PARENT DASHBOARD ROUTES ====================
router.get('/parent/dashboard/:parentId', (req, res) => paymentController.getParentDashboard(req, res));
router.get('/parent/redemptions/:parentId', (req, res) => paymentController.getPendingRedemptions(req, res));
router.post('/parent/process-redemption', (req, res) => paymentController.processRedemption(req, res));

// ==================== ADMIN ROUTES ====================
router.post('/admin/process-weekly-payouts', (req, res) => paymentController.processWeeklyPayouts(req, res));

export default router;

