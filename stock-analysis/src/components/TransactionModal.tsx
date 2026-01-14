import React, { useState, useEffect } from 'react';
import { Stock, StockPosition, Transaction } from '../types';
import { portfolioApi } from '../services/api';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  stocks: Stock[];
  stockPositions: StockPosition[];
  onTransactionAdded: () => void;
  initialType?: 'buy' | 'sell';
  initialStockId?: number;
}

const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  stocks,
  stockPositions,
  onTransactionAdded,
  initialType = 'buy',
  initialStockId = 0
}) => {
  const [transaction, setTransaction] = useState<Omit<Transaction, 'id'>>({
    stockId: 0,
    quantity: 0,
    price: 0,
    date: new Date().toISOString().split('T')[0], // Today's date as default
    type: 'buy',
  });
  const [loading, setLoading] = useState(false);

  // Reset form when modal opens/closes or initial values change
  useEffect(() => {
    if (isOpen) {
      setTransaction({
        stockId: initialStockId || 0,
        quantity: 0,
        price: 0,
        date: new Date().toISOString().split('T')[0],
        type: initialType,
      });
    }
  }, [isOpen, initialType, initialStockId]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Validate input data
      if (!transaction.stockId || transaction.quantity <= 0 || transaction.price <= 0 || !transaction.date) {
        alert('Please fill in all required fields with valid values');
        return;
      }
      
      // Validate sell transaction doesn't exceed owned quantity
      if (transaction.type === 'sell') {
        const existingPosition = stockPositions.find(p => p.stockId === transaction.stockId);
        if (!existingPosition || existingPosition.totalQuantity < transaction.quantity) {
          alert(`Cannot sell ${transaction.quantity} shares. You only own ${existingPosition?.totalQuantity || 0} shares of this stock.`);
          return;
        }
      }

      // Create portfolio entry
      const portfolioEntry: any = {
        stockId: transaction.stockId,
        quantity: transaction.quantity,
        price: transaction.price,
        purchasePrice: transaction.price, // API compatibility
        date: transaction.date,
        purchaseDate: transaction.date, // API compatibility
        type: transaction.type,
        targetPrice: 0,
        targetDate: new Date().toISOString().split('T')[0],
      };
      
      console.log('Sending transaction to API:', portfolioEntry);
      await portfolioApi.create(portfolioEntry);
      
      // Success feedback
      const stockName = stocks.find(s => s.id === transaction.stockId)?.name || 'Unknown Stock';
      alert(`✅ ${transaction.type === 'buy' ? 'Buy' : 'Sell'} transaction added successfully!\n${stockName}: ${transaction.quantity} shares @ ₹${transaction.price.toFixed(2)}`);
      
      // Notify parent and close modal
      onTransactionAdded();
      handleClose();
      
    } catch (error) {
      console.error('Error creating transaction:', error);
      alert('❌ Error creating transaction. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof Omit<Transaction, 'id'>, value: any) => {
    setTransaction(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  const getSelectedStock = () => {
    return stocks.find(s => s.id === transaction.stockId);
  };

  const getStockPosition = () => {
    return stockPositions.find(p => p.stockId === transaction.stockId);
  };

  if (!isOpen) return null;

  const selectedStock = getSelectedStock();
  const stockPosition = getStockPosition();
  const totalValue = transaction.quantity * transaction.price;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content transaction-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>
            {transaction.type === 'buy' ? '📈 Add Buy Transaction' : '📉 Add Sell Transaction'}
          </h3>
          <button 
            className="modal-close" 
            onClick={handleClose}
            disabled={loading}
          >
            ×
          </button>
        </div>
        
        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <div className="transaction-type-switcher">
              <button
                type="button"
                className={`type-btn ${transaction.type === 'buy' ? 'active' : ''}`}
                onClick={() => handleInputChange('type', 'buy')}
                disabled={loading}
              >
                📈 Buy
              </button>
              <button
                type="button"
                className={`type-btn ${transaction.type === 'sell' ? 'active' : ''}`}
                onClick={() => handleInputChange('type', 'sell')}
                disabled={loading}
              >
                📉 Sell
              </button>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="stock-select">Stock *</label>
                <select
                  id="stock-select"
                  value={transaction.stockId}
                  onChange={(e) => handleInputChange('stockId', parseInt(e.target.value))}
                  required
                  disabled={loading}
                >
                  <option value={0}>
                    {transaction.type === 'sell' ? 'Select Stock to Sell' : 'Select Stock to Buy'}
                  </option>
                  {(transaction.type === 'sell' 
                    ? stocks.filter(stock => 
                        stockPositions.some(pos => 
                          pos.stockId === stock.id && pos.totalQuantity > 0
                        )
                      )
                    : stocks
                  ).map((stock) => {
                    const position = stockPositions.find(p => p.stockId === stock.id);
                    return (
                      <option key={stock.id} value={stock.id}>
                        {stock.name}
                        {transaction.type === 'sell' && position 
                          ? ` (${position.totalQuantity} shares available)`
                          : ''
                        }
                      </option>
                    );
                  })}
                </select>
                {transaction.stockId > 0 && stockPosition && transaction.type === 'sell' && (
                  <small className="form-helper">
                    Available: {stockPosition.totalQuantity} shares (Avg: ₹{stockPosition.averagePrice.toFixed(2)})
                  </small>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="quantity">Quantity *</label>
                <input
                  id="quantity"
                  type="number"
                  min="1"
                  placeholder="Enter quantity"
                  value={transaction.quantity || ''}
                  onChange={(e) => handleInputChange('quantity', parseInt(e.target.value) || 0)}
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="price">Price per Share (₹) *</label>
                <input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="Enter price per share"
                  value={transaction.price || ''}
                  onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="date">Transaction Date *</label>
                <input
                  id="date"
                  type="date"
                  value={transaction.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Transaction Preview */}
            {transaction.stockId > 0 && transaction.quantity > 0 && transaction.price > 0 && (
              <div className="transaction-preview">
                <h4>Transaction Preview</h4>
                <div className="preview-grid">
                  <div className="preview-item">
                    <span className="label">Stock:</span>
                    <span className="value">{selectedStock?.name || 'Unknown'}</span>
                  </div>
                  <div className="preview-item">
                    <span className="label">Type:</span>
                    <span className={`value ${transaction.type}`}>
                      {transaction.type === 'buy' ? '📈 Buy' : '📉 Sell'}
                    </span>
                  </div>
                  <div className="preview-item">
                    <span className="label">Quantity:</span>
                    <span className="value">{transaction.quantity} shares</span>
                  </div>
                  <div className="preview-item">
                    <span className="label">Price per share:</span>
                    <span className="value">₹{transaction.price.toFixed(2)}</span>
                  </div>
                  <div className="preview-item total">
                    <span className="label">Total Value:</span>
                    <span className="value">₹{totalValue.toFixed(2)}</span>
                  </div>
                </div>

                {/* P&L Estimation for Sell */}
                {transaction.type === 'sell' && stockPosition && stockPosition.averagePrice > 0 && (
                  <div className="pl-estimation">
                    <div className="preview-item">
                      <span className="label">Estimated P&L:</span>
                      <span className={`value ${(totalValue - (stockPosition.averagePrice * transaction.quantity)) >= 0 ? 'profit' : 'loss'}`}>
                        ₹{(totalValue - (stockPosition.averagePrice * transaction.quantity)).toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

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
                className={`btn-primary ${transaction.type}`}
                disabled={loading || !transaction.stockId || !transaction.quantity || !transaction.price || !transaction.date}
              >
                {loading ? 'Adding...' : `Add ${transaction.type === 'buy' ? 'Buy' : 'Sell'} Transaction`}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TransactionModal;