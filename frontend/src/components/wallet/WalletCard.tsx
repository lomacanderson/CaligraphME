// Wallet Card Component
// Displays user's digital piggy bank with balance and stats

import React, { useState, useEffect } from 'react';
import { walletApi } from '../../services/api/wallet.api';
import type { WalletStats } from '../../../../shared/src/types/payment.types';
import './WalletCard.css';

interface WalletCardProps {
  userId: string;
  onRedeemClick: () => void;
  onViewTransactions: () => void;
}

export const WalletCard: React.FC<WalletCardProps> = ({
  userId,
  onRedeemClick,
  onViewTransactions
}) => {
  const [walletStats, setWalletStats] = useState<WalletStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchWalletStats();
  }, [userId]);

  const fetchWalletStats = async () => {
    try {
      setLoading(true);
      const stats = await walletApi.getWalletStats(userId);
      setWalletStats(stats);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching wallet stats:', err);
      setError(err.message || 'Failed to load wallet');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="wallet-card wallet-card-loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error || !walletStats) {
    return (
      <div className="wallet-card">
        <p>Error loading wallet: {error}</p>
      </div>
    );
  }

  return (
    <div className="wallet-card">
      <div className="wallet-header">
        <div>
          <div className="wallet-icon">🏦</div>
          <h2 className="wallet-title">Digital Piggy Bank</h2>
        </div>
        {walletStats.pendingRedemptions > 0 && (
          <span className="pending-badge">
            {walletStats.pendingRedemptions} Pending
          </span>
        )}
      </div>

      <div className="wallet-balance">
        <div className="balance-label">Available Balance</div>
        <div className="balance-amount">
          ${walletStats.balance.toFixed(2)}
        </div>
      </div>

      <div className="wallet-stats">
        <div className="wallet-stat">
          <div className="stat-label">Total Earned</div>
          <div className="stat-value">
            ${walletStats.totalEarned.toFixed(2)}
          </div>
        </div>
        <div className="wallet-stat">
          <div className="stat-label">Total Spent</div>
          <div className="stat-value">
            ${walletStats.totalSpent.toFixed(2)}
          </div>
        </div>
      </div>

      <div className="wallet-actions">
        <button
          className="wallet-button wallet-button-primary"
          onClick={onRedeemClick}
        >
          💰 Redeem Points
        </button>
        <button
          className="wallet-button wallet-button-secondary"
          onClick={onViewTransactions}
        >
          📜 Transactions
        </button>
      </div>
    </div>
  );
};

