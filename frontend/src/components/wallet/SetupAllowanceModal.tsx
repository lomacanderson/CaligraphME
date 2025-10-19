// Setup Allowance Modal Component
// Modal for parents to set up allowances for their children

import React, { useState, useEffect } from 'react';
import { allowanceApi } from '../../services/api/allowance.api';
import type { CreateAllowanceRequest } from '../../../../shared/src/types/payment.types';
import './SetupAllowanceModal.css';
import './RedeemModal.css';

interface SetupAllowanceModalProps {
  userId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export const SetupAllowanceModal: React.FC<SetupAllowanceModalProps> = ({
  userId,
  onClose,
  onSuccess
}) => {
  const [weeklyAmount, setWeeklyAmount] = useState<string>('10.00');
  const [pointsBonusRate, setPointsBonusRate] = useState<string>('0.01');
  const [autoApprove, setAutoApprove] = useState(true); // Default to true for single-user
  const [maxRedemptionPerWeek, setMaxRedemptionPerWeek] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const amount = parseFloat(weeklyAmount);
    const bonusRate = parseFloat(pointsBonusRate);

    if (isNaN(amount) || amount <= 0) {
      setError('Please enter a valid weekly amount');
      return;
    }

    if (isNaN(bonusRate) || bonusRate < 0) {
      setError('Please enter a valid bonus rate');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // For single-user mode, use the same user ID for both parent and child
      const request: CreateAllowanceRequest = {
        parentId: userId,
        childId: userId,
        weeklyAmount: amount,
        pointsBonusRate: bonusRate,
        paymentMethod: 'mock', // Use 'stripe' in production
        autoApproveRedemptions: autoApprove,
        maxRedemptionPerWeek: maxRedemptionPerWeek 
          ? parseFloat(maxRedemptionPerWeek) 
          : undefined
      };

      await allowanceApi.createAllowance(request);
      setSuccess(true);

      setTimeout(() => {
        onSuccess();
        onClose();
      }, 2000);
    } catch (err: any) {
      console.error('Error creating allowance:', err);
      setError(err.message || 'Failed to create allowance');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="success-box">
            <div className="success-icon">🎉</div>
            <div className="success-message">Allowance Created!</div>
            <div className="success-details">
              Weekly allowance of ${weeklyAmount} has been set up successfully.
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content setup-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            <span>💰</span>
            Set Up Allowance
          </h2>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="setup-info-box">
          <div className="setup-info-title">
            <span>💡</span>
            How It Works
          </div>
          <div className="setup-info-text">
            Set up a recurring weekly deposit to your wallet. You can also earn bonus money 
            by converting your learning points. With auto-approve enabled, points convert instantly to cash!
          </div>
        </div>

        <form onSubmit={handleSubmit} className="setup-form">

          {/* Weekly Amount */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Weekly Allowance</label>
              <div className="input-with-prefix">
                <span className="input-prefix">$</span>
                <input
                  type="number"
                  className="form-input with-prefix"
                  value={weeklyAmount}
                  onChange={(e) => setWeeklyAmount(e.target.value)}
                  placeholder="10.00"
                  step="0.01"
                  min="0"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Points Bonus Rate */}
            <div className="form-group">
              <label className="form-label">Points Bonus Rate</label>
              <div className="input-with-prefix">
                <span className="input-prefix">$</span>
                <input
                  type="number"
                  className="form-input with-prefix"
                  value={pointsBonusRate}
                  onChange={(e) => setPointsBonusRate(e.target.value)}
                  placeholder="0.01"
                  step="0.001"
                  min="0"
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          <div className="rate-display">
            <span className="rate-highlight">${pointsBonusRate}</span> per point earned
            {' '}(100 points = ${(parseFloat(pointsBonusRate || '0') * 100).toFixed(2)})
          </div>

          {/* Max Redemption (Optional) */}
          <div className="form-group">
            <label className="form-label">Max Redemption Per Week (Optional)</label>
            <div className="input-with-prefix">
              <span className="input-prefix">$</span>
              <input
                type="number"
                className="form-input with-prefix"
                value={maxRedemptionPerWeek}
                onChange={(e) => setMaxRedemptionPerWeek(e.target.value)}
                placeholder="No limit"
                step="0.01"
                min="0"
                disabled={loading}
              />
            </div>
          </div>

          {/* Auto Approve Toggle */}
          <div className="toggle-container">
            <div className="toggle-label-section">
              <div className="toggle-title">Instant Point Redemption</div>
              <div className="toggle-description">
                Points automatically convert to cash when redeemed (recommended for single-user accounts)
              </div>
            </div>
            <div
              className={`toggle-switch ${autoApprove ? 'active' : ''}`}
              onClick={() => !loading && setAutoApprove(!autoApprove)}
            >
              <div className="toggle-slider"></div>
            </div>
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="form-actions">
            <button
              type="button"
              className="modal-button modal-button-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="modal-button modal-button-primary"
              disabled={loading}
            >
              {loading ? 'Setting up...' : 'Set Up Allowance'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

