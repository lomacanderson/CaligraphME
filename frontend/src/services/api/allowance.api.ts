// Allowance API Service
// Frontend API client for allowance and parent operations

import type {
  Allowance,
  CreateAllowanceRequest,
  UpdateAllowanceRequest,
  RedemptionRequest,
  ProcessRedemptionRequest,
  ParentDashboardStats
} from '../../../../shared/src/types/payment.types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const allowanceApi = {
  // ==================== ALLOWANCE OPERATIONS ====================

  /**
   * Create new allowance
   */
  async createAllowance(request: CreateAllowanceRequest): Promise<Allowance> {
    const response = await fetch(`${API_URL}/payment/allowance`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(request)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create allowance');
    }
    
    return response.json();
  },

  /**
   * Update allowance
   */
  async updateAllowance(
    allowanceId: string,
    updates: UpdateAllowanceRequest
  ): Promise<Allowance> {
    const response = await fetch(`${API_URL}/payment/allowance/${allowanceId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updates)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update allowance');
    }
    
    return response.json();
  },

  /**
   * Get parent's allowances
   */
  async getParentAllowances(parentId: string): Promise<Allowance[]> {
    const response = await fetch(`${API_URL}/payment/allowance/parent/${parentId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch allowances');
    }
    
    return response.json();
  },

  /**
   * Get child's active allowance
   */
  async getChildAllowance(childId: string): Promise<Allowance | null> {
    const response = await fetch(`${API_URL}/payment/allowance/child/${childId}`);
    
    if (response.status === 404) {
      return null;
    }
    
    if (!response.ok) {
      throw new Error('Failed to fetch allowance');
    }
    
    return response.json();
  },

  // ==================== PARENT DASHBOARD OPERATIONS ====================

  /**
   * Get parent dashboard statistics
   */
  async getParentDashboard(parentId: string): Promise<ParentDashboardStats> {
    const response = await fetch(`${API_URL}/payment/parent/dashboard/${parentId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch dashboard');
    }
    
    return response.json();
  },

  /**
   * Get pending redemption requests
   */
  async getPendingRedemptions(parentId: string): Promise<RedemptionRequest[]> {
    const response = await fetch(`${API_URL}/payment/parent/redemptions/${parentId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch redemptions');
    }
    
    return response.json();
  },

  /**
   * Process (approve/reject) redemption request
   */
  async processRedemption(request: ProcessRedemptionRequest): Promise<RedemptionRequest> {
    const response = await fetch(`${API_URL}/payment/parent/process-redemption`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(request)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to process redemption');
    }
    
    return response.json();
  }
};

