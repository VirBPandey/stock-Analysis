import React, { useState, useEffect } from 'react';
import { StockPosition } from '../types';
import { portfolioApi } from '../services/api';

// Utility function for consistent date formatting
const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return 'Not set';
  try {
    return new Date(dateString + 'T00:00:00').toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return 'Invalid Date';
  }
};

interface TargetPriceModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedStock: {stockId: number, stockName: string} | null;
  stockPositions: StockPosition[];
  onTargetUpdated: () => void;
}

const TargetPriceModal: React.FC<TargetPriceModalProps> = ({
  isOpen,
  onClose,
  selectedStock,
  stockPositions,
  onTargetUpdated
}) => {
  const [modalTargetPrice, setModalTargetPrice] = useState('');
  const [modalTargetDate, setModalTargetDate] = useState('');
  const [loading, setLoading] = useState(false);

  // Update modal fields when selectedStock changes
  useEffect(() => {
    debugger;
    if (selectedStock && isOpen) {
      const position = stockPositions.find(p => p.stockId === selectedStock.stockId);
      setModalTargetPrice(position?.targetPrice ? position.targetPrice.toString() : '');
      setModalTargetDate((() => {
        if (!position?.targetDate) return '';
        try {
          // Convert date to YYYY-MM-DD format for date input
          const date = new Date(position.targetDate);
          if (isNaN(date.getTime())) return '';
          return date.toISOString().split('T')[0];
        } catch (error) {
          console.log('Date conversion error for modal:', position.targetDate, error);
          return '';
        }
      })());
    }
  }, [selectedStock, isOpen, stockPositions]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStock || !modalTargetPrice || !modalTargetDate) {
      alert('Please fill in both target price and target date');
      return;
    }

    try {
      setLoading(true);
      const targetPrice = parseFloat(modalTargetPrice);
      await portfolioApi.updateStockTarget(selectedStock.stockId, targetPrice, modalTargetDate);
      
      alert(`Target price of ₹${targetPrice} set successfully for ${selectedStock.stockName}!`);
      
      // Notify parent component to refresh data
      onTargetUpdated();
      
      onClose();
    } catch (error) {
      console.error('Error updating target price:', error);
      alert('Error updating target price. Please check the console for details.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  const getCurrentPosition = () => {
    if (!selectedStock) return null;
    return stockPositions.find(p => p.stockId === selectedStock.stockId);
  };

  if (!isOpen || !selectedStock) return null;

  const position = getCurrentPosition();

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>🎯 Set Target Price</h3>
          <button 
            className="modal-close" 
            onClick={handleClose}
            disabled={loading}
          >
            ×
          </button>
        </div>
        
        <div className="modal-body">
          <h4>{selectedStock.stockName}</h4>
          
          {position && (
            <div className="stock-info">
              <div className="current-stats">
                <div className="stat-row">
                  <span className="stat-label">Avg Buy Price:</span>
                  <span className="stat-value">₹{(position.averagePrice || 0).toFixed(2)}</span>
                </div>
                <div className="stat-row">
                  <span className="stat-label">Net Quantity:</span>
                  <span className="stat-value">{position.totalQuantity || 0} shares</span>
                </div>
                <div className="stat-row">
                  <span className="stat-label">Net Investment:</span>
                  <span className="stat-value">₹{(position.totalInvestment || 0).toFixed(2)}</span>
                </div>
                <div className="stat-row transaction-summary">
                  <span className="stat-label">Transactions:</span>
                  <span className="stat-value">
                    Buy: {position.totalBuyQuantity || 0} @ ₹{(position.totalBuyValue || 0).toFixed(2)} | 
                    Sell: {position.totalSellQuantity || 0} @ ₹{(position.totalSellValue || 0).toFixed(2)}
                  </span>
                </div>
                {(position.totalSellQuantity || 0) > 0 && (
                  <div className="stat-row">
                    <span className="stat-label">Realized P&L:</span>
                    <span className={`stat-value realized-pl ${(position.realizedPL || 0) >= 0 ? 'profit' : 'loss'}`}>
                      ₹{(position.realizedPL || 0).toFixed(2)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="modal-form-group">
              <label htmlFor="target-price">Target Price (₹)</label>
              <input
                id="target-price"
                type="number"
                step="0.01"
                min="0.01"
                value={modalTargetPrice}
                onChange={(e) => setModalTargetPrice(e.target.value)}
                placeholder="Enter target price"
                required
                autoFocus
                disabled={loading}
              />
              {position && modalTargetPrice && (
                <small className="form-helper">
                  {(() => {
                    const currentPrice = position.averagePrice || 0;
                    const targetPrice = parseFloat(modalTargetPrice);
                    if (currentPrice > 0 && targetPrice > 0) {
                      const percentChange = ((targetPrice - currentPrice) / currentPrice) * 100;
                      return (
                        <span className={percentChange >= 0 ? 'profit' : 'loss'}>
                          {percentChange >= 0 ? '+' : ''}{percentChange.toFixed(2)}% from avg buy price
                        </span>
                      );
                    }
                    return null;
                  })()}
                </small>
              )}
            </div>
            
            <div className="modal-form-group">
              <label htmlFor="target-date">Target Date</label>
              <input
                id="target-date"
                type="date"
                value={modalTargetDate}
                onChange={(e) => setModalTargetDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]} // Prevent past dates
                required
                disabled={loading}
              />
              {modalTargetDate && (
                <small className="form-helper">
                  {(() => {
                    const targetDate = new Date(modalTargetDate);
                    const today = new Date();
                    const daysToTarget = Math.ceil((targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                    
                    if (daysToTarget < 0) {
                      return <span className="warning">Target date is in the past</span>;
                    } else if (daysToTarget <= 30) {
                      return <span className="warning">Target is within 30 days</span>;
                    } else {
                      return <span>{daysToTarget} days from today</span>;
                    }
                  })()}
                </small>
              )}
            </div>
            
            <div className="modal-actions">
              <button 
                type="button" 
                onClick={handleClose} 
                className="btn-cancel"
                disabled={loading}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn-primary"
                disabled={loading || !modalTargetPrice || !modalTargetDate}
              >
                {loading ? 'Setting Target...' : 'Set Target'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TargetPriceModal;