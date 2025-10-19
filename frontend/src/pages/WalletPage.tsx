// Wallet Page
// Main page for viewing wallet balance, transactions, and shop

import React, { useState, useEffect } from 'react';
import { useUserStore } from '../stores/userStore';
import { WalletCard } from '../components/wallet/WalletCard';
import { RedeemModal } from '../components/wallet/RedeemModal';
import { walletApi } from '../services/api/wallet.api';
import { paymentApi } from '../services/api/payment.api';
import type { Transaction, ShopItem, RedemptionRequest } from '../../../shared/src/types/payment.types';
import { TRANSACTION_TYPE_LABELS } from '../../../shared/src/types/payment.types';
import './WalletPage.css';

export const WalletPage: React.FC = () => {
  const user = useUserStore((state) => state.user);
  const [showRedeemModal, setShowRedeemModal] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [shopItems, setShopItems] = useState<ShopItem[]>([]);
  const [redemptions, setRedemptions] = useState<RedemptionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user, refreshKey]);

  const fetchData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      const [transactionsData, shopData, redemptionsData] = await Promise.all([
        walletApi.getTransactions(user.id, 5),
        paymentApi.getShopItems().then(items => items.slice(0, 3)),
        paymentApi.getChildRedemptions(user.id)
      ]);

      setTransactions(transactionsData);
      setShopItems(shopData);
      setRedemptions(redemptionsData);
    } catch (error) {
      console.error('Error fetching wallet data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const getTransactionIcon = (type: string): string => {
    const icons: Record<string, string> = {
      allowance_deposit: '💰',
      points_redemption: '⭐',
      purchase: '🛍️',
      refund: '↩️',
      bonus: '🎁',
      withdrawal: '💸'
    };
    return icons[type] || '💵';
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  if (!user) {
    return (
      <div className="wallet-page">
        <div className="empty-state">
          <div className="empty-icon">🔒</div>
          <div className="empty-message">Please log in to view your wallet</div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="wallet-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="wallet-page">
      <div className="page-header">
        <h1 className="page-title">My Wallet</h1>
        <p className="page-subtitle">
          Manage your earnings and redeem points for rewards
        </p>
      </div>

      <div className="wallet-grid">
        <div className="main-section">
          {/* Wallet Card */}
          <WalletCard
            userId={user.id}
            onRedeemClick={() => setShowRedeemModal(true)}
            onViewTransactions={() => {/* TODO: Navigate to full transactions */}}
          />

          {/* Recent Transactions */}
          <div className="section-card">
            <div className="section-header">
              <h2 className="section-title">
                <span className="section-icon">📜</span>
                Recent Transactions
              </h2>
              <a href="#" className="view-all-link">View All</a>
            </div>

            {transactions.length > 0 ? (
              <div className="transactions-list">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="transaction-item">
                    <div className="transaction-info">
                      <div className="transaction-icon">
                        {getTransactionIcon(transaction.transactionType)}
                      </div>
                      <div className="transaction-details">
                        <div className="transaction-description">
                          {transaction.description ||
                            TRANSACTION_TYPE_LABELS[transaction.transactionType]}
                        </div>
                        <div className="transaction-date">
                          {formatDate(transaction.createdAt)}
                        </div>
                      </div>
                    </div>
                    <div
                      className={`transaction-amount ${
                        ['allowance_deposit', 'refund', 'bonus'].includes(
                          transaction.transactionType
                        )
                          ? 'positive'
                          : 'negative'
                      }`}
                    >
                      {['allowance_deposit', 'refund', 'bonus'].includes(
                        transaction.transactionType
                      )
                        ? '+'
                        : '-'}
                      ${transaction.amount.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">📭</div>
                <div className="empty-message">No transactions yet</div>
                <div className="empty-hint">
                  Start earning by completing exercises!
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="sidebar-section">
          {/* Shop Preview */}
          <div className="section-card">
            <div className="section-header">
              <h2 className="section-title">
                <span className="section-icon">🛍️</span>
                Shop
              </h2>
              <a href="#" className="view-all-link">View All</a>
            </div>

            {shopItems.length > 0 ? (
              <div className="shop-grid">
                {shopItems.map((item) => (
                  <div key={item.id} className="shop-item-card">
                    <div className="shop-item-icon">🎁</div>
                    <div className="shop-item-info">
                      <div className="shop-item-name">{item.name}</div>
                      <div className="shop-item-description">
                        {item.description}
                      </div>
                      <div className="shop-item-price">
                        ${item.price.toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">🏪</div>
                <div className="empty-message">Shop coming soon!</div>
              </div>
            )}
          </div>

          {/* Pending Redemptions */}
          {redemptions.filter((r) => r.status === 'pending').length > 0 && (
            <div className="section-card">
              <div className="section-header">
                <h2 className="section-title">
                  <span className="section-icon">⏳</span>
                  Pending Requests
                </h2>
              </div>

              <div className="redemptions-list">
                {redemptions
                  .filter((r) => r.status === 'pending')
                  .map((redemption) => (
                    <div key={redemption.id} className="redemption-card">
                      <div className="redemption-header">
                        <span className="redemption-status pending">
                          Pending Approval
                        </span>
                      </div>
                      <div className="redemption-details">
                        <div className="redemption-amount">
                          {redemption.pointsAmount} points → $
                          {redemption.dollarAmount.toFixed(2)}
                        </div>
                        <div className="redemption-date">
                          {formatDate(redemption.createdAt)}
                        </div>
                      </div>
                      {redemption.requestMessage && (
                        <div className="redemption-message">
                          {redemption.requestMessage}
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Redeem Modal */}
      {showRedeemModal && (
        <RedeemModal
          userId={user.id}
          currentPoints={user.totalPoints}
          onClose={() => setShowRedeemModal(false)}
          onSuccess={handleRefresh}
        />
      )}
    </div>
  );
};

