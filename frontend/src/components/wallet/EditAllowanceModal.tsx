// Edit Allowance Modal Component
// Modal for editing existing allowance settings

import React, { useState } from 'react';
import { allowanceApi } from '../../services/api/allowance.api';
import type { Allowance, UpdateAllowanceRequest } from '../../../../shared/src/types/payment.types';
import './SetupAllowanceModal.css';
import './RedeemModal.css';

interface EditAllowanceModalProps {
  allowance: Allowance;
  onClose: () => void;
  onSuccess: () => void;
}

export const EditAllowanceModal: React.FC<EditAllowanceModalProps> = ({
  allowance,
  onClose,
  onSuccess
}) => {
  const [weeklyAmount, setWeeklyAmount] = useState<string>(allowance.weeklyAmount.toString());
  const [pointsBonusRate, setPointsBonusRate] = useState<string>(allowance.pointsBonusRate.toString());
  const [autoApprove, setAutoApprove] = useState(allowance.autoApproveRedemptions);
  const [maxRedemptionPerWeek, setMaxRedemptionPerWeek] = useState<string>(
    allowance.maxRedemptionPerWeek ? allowance.maxRedemptionPerWeek.toString() : ''
  );
  const [active, setActive] = useState(allowance.active);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const amount = parseFloat(weeklyAmount);
    const bonusRate = parseFloat(pointsBonusRate);

    if (isNaN(amount) || amount < 0) {
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

      const updates: UpdateAllowanceRequest = {
        weeklyAmount: amount,
        pointsBonusRate: bonusRate,
        autoApproveRedemptions: autoApprove,
        maxRedemptionPerWeek: maxRedemptionPerWeek 
          ? parseFloat(maxRedemptionPerWeek) 
          : undefined,
        active
      };

      await allowanceApi.updateAllowance(allowance.id, updates);
      setSuccess(true);

      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);
    } catch (err: any) {
      console.error('Error updating allowance:', err);
      setError(err.message || 'Failed to update allowance');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="success-box">
            <div className="success-icon">✅</div>
            <div className="success-message">Allowance Updated!</div>
            <div className="success-details">
              Your allowance settings have been updated successfully.
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
            <span>⚙️</span>
            Edit Allowance
          </h2>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
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
                Points automatically convert to cash when redeemed
              </div>
            </div>
            <div
              className={`toggle-switch ${autoApprove ? 'active' : ''}`}
              onClick={() => !loading && setAutoApprove(!autoApprove)}
            >
              <div className="toggle-slider"></div>
            </div>
          </div>

          {/* Active Toggle */}
          <div className="toggle-container">
            <div className="toggle-label-section">
              <div className="toggle-title">Allowance Active</div>
              <div className="toggle-description">
                {active 
                  ? 'Weekly deposits are enabled' 
                  : 'Weekly deposits are paused (you can reactivate anytime)'}
              </div>
            </div>
            <div
              className={`toggle-switch ${active ? 'active' : ''}`}
              onClick={() => !loading && setActive(!active)}
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
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

