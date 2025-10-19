// Parent Dashboard Page
// Dashboard for parents to manage allowances and approve redemptions

import React, { useState, useEffect } from 'react';
import { useUserStore } from '../stores/userStore';
import { allowanceApi } from '../services/api/allowance.api';
import { SetupAllowanceModal } from '../components/wallet/SetupAllowanceModal';
import { EditAllowanceModal } from '../components/wallet/EditAllowanceModal';
import type {
  ParentDashboardStats,
  RedemptionRequest,
  Allowance
} from '../../../shared/src/types/payment.types';
import './ParentDashboard.css';

export const ParentDashboard: React.FC = () => {
  const user = useUserStore((state) => state.user);
  const [dashboardStats, setDashboardStats] = useState<ParentDashboardStats | null>(null);
  const [pendingRedemptions, setPendingRedemptions] = useState<RedemptionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [editingAllowance, setEditingAllowance] = useState<Allowance | null>(null);
  const [allowances, setAllowances] = useState<Allowance[]>([]);

  useEffect(() => {
    if (user) {
      fetchDashboard();
    }
  }, [user]);

  const fetchDashboard = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      const [stats, redemptions, allowancesList] = await Promise.all([
        allowanceApi.getParentDashboard(user.id),
        allowanceApi.getPendingRedemptions(user.id),
        allowanceApi.getParentAllowances(user.id)
      ]);

      setDashboardStats(stats);
      setPendingRedemptions(redemptions);
      setAllowances(allowancesList);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditAllowance = (childId: string) => {
    const allowance = allowances.find(a => a.childId === childId);
    if (allowance) {
      setEditingAllowance(allowance);
    }
  };

  const handleProcessRedemption = async (
    redemptionId: string,
    approved: boolean
  ) => {
    if (!user) return;

    try {
      setProcessingId(redemptionId);

      await allowanceApi.processRedemption({
        redemptionRequestId: redemptionId,
        parentId: user.id,
        approved,
        responseMessage: approved
          ? 'Approved! Great job earning those points!'
          : 'Not approved at this time.'
      });

      // Refresh data
      await fetchDashboard();
    } catch (error: any) {
      console.error('Error processing redemption:', error);
      alert(error.message || 'Failed to process redemption');
    } finally {
      setProcessingId(null);
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  if (!user) {
    return (
      <div className="parent-dashboard">
        <div className="empty-state">
          <div className="empty-icon">🔒</div>
          <div className="empty-message">Please log in to view dashboard</div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="parent-dashboard">
        <div className="loading-container">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="parent-dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Allowance Dashboard</h1>
        <p className="dashboard-subtitle">
          Manage your allowance settings and track your earnings
        </p>
      </div>

      {/* Stats Overview */}
      <div className="stats-grid">
        <div className="stat-card primary">
          <div className="stat-header">
            <span className="stat-label">Active Allowances</span>
            <span className="stat-icon">💰</span>
          </div>
          <div className="stat-value">{dashboardStats?.activeAllowances || 0}</div>
          <div className="stat-description">
            Recurring weekly deposits
          </div>
        </div>

        <div className="stat-card success">
          <div className="stat-header">
            <span className="stat-label">Earned This Month</span>
            <span className="stat-icon">💵</span>
          </div>
          <div className="stat-value">
            ${(dashboardStats?.totalSpentThisMonth || 0).toFixed(2)}
          </div>
          <div className="stat-description">
            From allowances and points
          </div>
        </div>

        <div className="stat-card warning">
          <div className="stat-header">
            <span className="stat-label">Pending Redemptions</span>
            <span className="stat-icon">⏳</span>
          </div>
          <div className="stat-value">{pendingRedemptions.length}</div>
          <div className="stat-description">
            Points waiting to convert
          </div>
        </div>

        <div className="stat-card info">
          <div className="stat-header">
            <span className="stat-label">Weekly Deposit</span>
            <span className="stat-icon">📅</span>
          </div>
          <div className="stat-value">
            ${dashboardStats?.children?.[0]?.weeklyAmount?.toFixed(2) || '0.00'}
          </div>
          <div className="stat-description">
            Automatic every 7 days
          </div>
        </div>
      </div>

      {/* Account Overview */}
      {dashboardStats && dashboardStats.children.length > 0 && (
        <div className="children-section">
          <h2 className="section-title">
            <span className="section-icon">💳</span>
            Account Details
          </h2>
          <div className="children-grid">
            {dashboardStats.children.map((child) => (
              <div key={child.childId} className="child-card">
                <div className="child-header">
                  <div className="child-name">{child.childName}</div>
                  {child.allowanceActive && (
                    <div className="child-status">Active</div>
                  )}
                </div>

                <div className="child-stats">
                  <div className="child-stat">
                    <div className="child-stat-label">Wallet Balance</div>
                    <div className="child-stat-value">
                      ${child.walletBalance.toFixed(2)}
                    </div>
                  </div>
                  <div className="child-stat">
                    <div className="child-stat-label">Total Points</div>
                    <div className="child-stat-value">
                      {child.totalPoints.toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="child-stats">
                  <div className="child-stat">
                    <div className="child-stat-label">Weekly Allowance</div>
                    <div className="child-stat-value">
                      ${child.weeklyAmount.toFixed(2)}
                    </div>
                  </div>
                  <div className="child-stat">
                    <div className="child-stat-label">Last Activity</div>
                    <div className="child-stat-value" style={{ fontSize: '0.85rem' }}>
                      {child.lastActivity
                        ? formatDate(child.lastActivity)
                        : 'Never'}
                    </div>
                  </div>
                </div>

                <div className="child-actions">
                  <button 
                    className="child-button"
                    onClick={() => handleEditAllowance(child.childId)}
                  >
                    Edit Settings
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pending Redemptions */}
      {pendingRedemptions.length > 0 && (
        <div className="redemptions-section">
          <h2 className="section-title">
            <span className="section-icon">⏳</span>
            Pending Point Redemptions
          </h2>

          <div className="redemption-cards">
            {pendingRedemptions.map((redemption) => {
              return (
                <div key={redemption.id} className="redemption-item">
                  <div className="redemption-item-header">
                    <div>
                      <div className="redemption-child-name">
                        Point Redemption Request
                      </div>
                      <div className="redemption-time">
                        Requested {formatDate(redemption.createdAt)}
                      </div>
                    </div>
                    <span className="redemption-badge">Pending</span>
                  </div>

                  <div className="redemption-details">
                    <div className="redemption-amount">
                      <span className="redemption-points">
                        {redemption.pointsAmount.toLocaleString()} points
                      </span>
                      <span className="redemption-dollars">
                        ${redemption.dollarAmount.toFixed(2)}
                      </span>
                    </div>

                    {redemption.requestMessage && (
                      <div className="redemption-message">
                        "{redemption.requestMessage}"
                      </div>
                    )}
                  </div>

                  <div className="redemption-actions">
                    <button
                      className="redemption-button redemption-button-approve"
                      onClick={() => handleProcessRedemption(redemption.id, true)}
                      disabled={processingId === redemption.id}
                    >
                      {processingId === redemption.id ? 'Processing...' : '✓ Approve'}
                    </button>
                    <button
                      className="redemption-button redemption-button-reject"
                      onClick={() => handleProcessRedemption(redemption.id, false)}
                      disabled={processingId === redemption.id}
                    >
                      {processingId === redemption.id ? 'Processing...' : '✗ Reject'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Setup Allowance CTA */}
      {(!dashboardStats || dashboardStats.children.length === 0) && (
        <div className="empty-state">
          <div className="empty-icon">💰</div>
          <div className="empty-message">Set Up Your Allowance</div>
          <div className="empty-hint">
            Configure a weekly deposit and points bonus to start earning money from your learning!
          </div>
          <button className="setup-button" onClick={() => setShowSetupModal(true)}>
            <span>➕</span>
            Set Up Allowance
          </button>
        </div>
      )}

      {/* Setup Allowance Modal */}
      {showSetupModal && user && (
        <SetupAllowanceModal
          userId={user.id}
          onClose={() => setShowSetupModal(false)}
          onSuccess={fetchDashboard}
        />
      )}

      {/* Edit Allowance Modal */}
      {editingAllowance && (
        <EditAllowanceModal
          allowance={editingAllowance}
          onClose={() => setEditingAllowance(null)}
          onSuccess={fetchDashboard}
        />
      )}
    </div>
  );
};

