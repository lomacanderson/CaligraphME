// Redeem Modal Component
// Modal for converting points to money

import React, { useState, useEffect } from 'react';
import { paymentApi } from '../../services/api/payment.api';
import { useUserStore } from '../../stores/userStore';
import type { RedeemPointsResponse } from '../../../../shared/src/types/payment.types';
import './RedeemModal.css';

interface RedeemModalProps {
  userId: string;
  currentPoints: number;
  onClose: () => void;
  onSuccess: () => void;
}

const POINTS_TO_DOLLAR_RATE = 100; // 100 points = $1.00

export const RedeemModal: React.FC<RedeemModalProps> = ({
  userId,
  currentPoints,
  onClose,
  onSuccess
}) => {
  const [pointsToRedeem, setPointsToRedeem] = useState<string>('');
  const [requestMessage, setRequestMessage] = useState<string>('');
  const [dollarAmount, setDollarAmount] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<RedeemPointsResponse | null>(null);

  useEffect(() => {
    const points = parseInt(pointsToRedeem) || 0;
    setDollarAmount(points / POINTS_TO_DOLLAR_RATE);
  }, [pointsToRedeem]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const points = parseInt(pointsToRedeem);
    
    if (!points || points <= 0) {
      setError('Please enter a valid number of points');
      return;
    }

    if (points > currentPoints) {
      setError('You don\'t have enough points');
      return;
    }

    if (points < POINTS_TO_DOLLAR_RATE) {
      setError(`Minimum redemption is ${POINTS_TO_DOLLAR_RATE} points ($1.00)`);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const result = await paymentApi.redeemPoints({
        userId,
        pointsAmount: points,
        requestMessage: requestMessage.trim() || undefined
      });

      setSuccess(result);

      // Refresh user data if redemption was immediate
      if (!result.requiresApproval) {
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 2000);
      }
    } catch (err: any) {
      console.error('Error redeeming points:', err);
      setError(err.message || 'Failed to redeem points');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickSelect = (percentage: number) => {
    const points = Math.floor(currentPoints * percentage);
    setPointsToRedeem(points.toString());
  };

  if (success) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="success-box">
            <div className="success-icon">🎉</div>
            <div className="success-message">
              {success.requiresApproval ? 'Request Sent!' : 'Success!'}
            </div>
            <div className="success-details">{success.message}</div>
          </div>
          <div className="form-actions">
            <button
              className="modal-button modal-button-primary"
              onClick={() => {
                onSuccess();
                onClose();
              }}
            >
              Done
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            <span>💰</span>
            Redeem Points
          </h2>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="redeem-form">
          <div className="current-points">
            <span className="points-label">Your Points:</span>
            <span className="points-value">{currentPoints.toLocaleString()}</span>
          </div>

          <div className="form-group">
            <label className="form-label">Points to Redeem</label>
            <input
              type="number"
              className="form-input"
              value={pointsToRedeem}
              onChange={(e) => setPointsToRedeem(e.target.value)}
              placeholder="Enter points amount"
              min={POINTS_TO_DOLLAR_RATE}
              max={currentPoints}
              disabled={loading}
            />
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
              <button
                type="button"
                className="modal-button modal-button-secondary"
                style={{ fontSize: '0.85rem', padding: '0.5rem' }}
                onClick={() => handleQuickSelect(0.25)}
                disabled={loading}
              >
                25%
              </button>
              <button
                type="button"
                className="modal-button modal-button-secondary"
                style={{ fontSize: '0.85rem', padding: '0.5rem' }}
                onClick={() => handleQuickSelect(0.5)}
                disabled={loading}
              >
                50%
              </button>
              <button
                type="button"
                className="modal-button modal-button-secondary"
                style={{ fontSize: '0.85rem', padding: '0.5rem' }}
                onClick={() => handleQuickSelect(1)}
                disabled={loading}
              >
                100%
              </button>
            </div>
          </div>

          {pointsToRedeem && parseInt(pointsToRedeem) >= POINTS_TO_DOLLAR_RATE && (
            <div className="conversion-display">
              <div className="conversion-title">You'll Receive</div>
              <div className="conversion-amount">
                ${dollarAmount.toFixed(2)}
              </div>
              <div className="conversion-rate">
                Rate: {POINTS_TO_DOLLAR_RATE} points = $1.00
              </div>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Message (Optional)</label>
            <textarea
              className="form-textarea"
              value={requestMessage}
              onChange={(e) => setRequestMessage(e.target.value)}
              placeholder="Add a message to your redemption request..."
              disabled={loading}
            />
          </div>

          <div className="info-box">
            <span className="info-icon">ℹ️</span>
            <div className="info-text">
              Your points will be converted to money in your digital wallet. 
              If you have an allowance set up, your parent may need to approve this request.
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
              disabled={loading || !pointsToRedeem || parseInt(pointsToRedeem) <= 0}
            >
              {loading ? 'Processing...' : 'Redeem Points'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

