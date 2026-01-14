import React from 'react';
import { StockPosition } from '../../types';
import TransactionTable from './TransactionTable';

interface PositionCardProps {
  position: StockPosition;
  expanded: boolean;
  buyTableExpanded: boolean;
  sellTableExpanded: boolean;
  onToggleStock: () => void;
  onToggleBuyTable: () => void;
  onToggleSellTable: () => void;
  onOpenTargetModal: (stockId: number, stockName: string, currentTarget?: number, currentDate?: string) => void;
  onOpenTransactionModal?: (type: 'buy' | 'sell', stockId?: number) => void;
  onDeleteTransaction: (id: number) => void;
}

const PositionCard: React.FC<PositionCardProps> = ({
  position,
  expanded,
  buyTableExpanded,
  sellTableExpanded,
  onToggleStock,
  onToggleBuyTable,
  onToggleSellTable,
  onOpenTargetModal,
  onOpenTransactionModal,
  onDeleteTransaction
}) => {
  const formatTargetDate = (dateString: string) => {
    if (!dateString) return 'Not set';
    try {
      return new Date(dateString + 'T00:00:00').toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return 'Invalid date';
    }
  };

  return (
    <div className="stock-position-card" data-stock-id={position.stockId}>
      <div className="stock-card-header">
        <div className="stock-title-section" onClick={onToggleStock}>
          <div className="stock-name-compact">
            <span className="expand-icon">{expanded ? '▼' : '▶'}</span>
            <h3>{position.stock?.name}</h3>
            <div className="stock-sector-tag">
              {position.stock?.sectorName || 'Other'}
            </div>
          </div>
          <div className="stock-metrics-compact">
            <span className="metric-compact">
              <strong>{position.totalQuantity || 0}</strong> @ ₹{(position.averagePrice || 0).toFixed(1)}
            </span>
            <span className="metric-compact investment">
              ₹{(position.totalInvestment || 0).toFixed(0)}
            </span>
            {position.totalSellQuantity > 0 && (
              <span className={`metric-compact pl ${(position.realizedPL || 0) >= 0 ? 'profit' : 'loss'}`}>
                ₹{(position.realizedPL || 0).toFixed(0)} P&L
              </span>
            )}
          </div>
        </div>

        <div className="stock-actions">
          {/* Buy Button */}
          {onOpenTransactionModal && (
            <button 
              className="action-btn buy-btn small"
              onClick={(e) => {
                e.stopPropagation();
                onOpenTransactionModal('buy', position.stockId);
              }}
              title="Add buy transaction"
            >
              📈 Buy
            </button>
          )}

          {/* Sell Button */}
          {onOpenTransactionModal && (
            <button 
              className="action-btn sell-btn small"
              onClick={(e) => {
                e.stopPropagation();
                onOpenTransactionModal('sell', position.stockId);
              }}
              title="Add sell transaction"
              disabled={position.totalQuantity <= 0}
            >
              📉 Sell
            </button>
          )}

          {/* Set Target Button */}
          {(position.targetPrice || 0) > 0 && position.targetDate ? (
            <button 
              className="action-btn target-btn set small"
              title={`Target: ₹${(position.targetPrice || 0).toFixed(2)} by ${formatTargetDate(position.targetDate)} - Click to update`}
              onClick={(e) => {
                e.stopPropagation();
                onOpenTargetModal(position.stockId, position.stock?.name || '', position.targetPrice, position.targetDate);
              }}
            >
              🎯 ₹{(position.targetPrice || 0).toFixed(2)}
            </button>
          ) : (
            <button 
              className="action-btn target-btn unset small"
              title="Click to set target price"
              onClick={(e) => {
                e.stopPropagation();
                onOpenTargetModal(position.stockId, position.stock?.name || '');
              }}
            >
              📋 Set Target
            </button>
          )}
        </div>
      </div>

      {/* Transactions List */}
      {expanded && (
        <div className="transactions-list">
          {/* Transaction Control Buttons */}
          {position.transactions.length > 0 && (
            <div className="transaction-controls-compact">
              <span className="transaction-title">Transactions</span>
              <div className="control-buttons-compact">
                <button 
                  className="control-btn-small"
                  onClick={() => {
                    onToggleBuyTable();
                    onToggleSellTable();
                  }}
                  title="Expand all transaction tables"
                >
                  📊
                </button>
                <button 
                  className="control-btn-small"
                  onClick={() => {
                    if (buyTableExpanded) onToggleBuyTable();
                    if (sellTableExpanded) onToggleSellTable();
                  }}
                  title="Collapse all transaction tables"
                >
                  📋
                </button>
              </div>
            </div>
          )}
          
          <div className="transactions-container">
            <TransactionTable
              transactions={position.transactions.filter(t => t.type === 'buy')}
              type="buy"
              expanded={buyTableExpanded}
              onToggle={onToggleBuyTable}
              onDelete={onDeleteTransaction}
            />
            
            <TransactionTable
              transactions={position.transactions.filter(t => t.type === 'sell')}
              type="sell"
              expanded={sellTableExpanded}
              onToggle={onToggleSellTable}
              onDelete={onDeleteTransaction}
            />

            {/* No Transactions Message */}
            {position.transactions.length === 0 && (
              <div className="no-transactions">
                <p>No transactions recorded for this stock yet.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PositionCard;
