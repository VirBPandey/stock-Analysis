import React from 'react';
import { StockPosition } from '../../types';
import { calculatePortfolioMetrics } from '../../utils/portfolioHelpers';

interface PortfolioHeaderProps {
  stockPositions: StockPosition[];
  onOpenBuyModal: () => void;
  onOpenSellModal: () => void;
}

const PortfolioHeader: React.FC<PortfolioHeaderProps> = ({
  stockPositions,
  onOpenBuyModal,
  onOpenSellModal
}) => {
  // Calculate portfolio metrics using shared utility
  const { totalInvestment, totalRealizedPL, stocksWithTargets } = 
    calculatePortfolioMetrics(stockPositions);

  return (
    <div className="portfolio-header-compact">
      <div className="header-left">
        <h2>My Portfolio</h2>
        {stockPositions.length > 0 && (
          <div className="portfolio-stats-inline">
            <span className="stat-item">
              📊 <strong>{stockPositions.length}</strong> stocks
            </span>
            <span className="stat-item">
              💰 <strong>₹{totalInvestment.toFixed(0)}</strong>
            </span>
            <span className={`stat-item ${totalRealizedPL >= 0 ? 'profit' : 'loss'}`}>
              📈 <strong>₹{totalRealizedPL.toFixed(0)}</strong> P&L
            </span>
            {stocksWithTargets > 0 && (
              <span className="stat-item">
                🎯 <strong>{stocksWithTargets}</strong> targets
              </span>
            )}
          </div>
        )}
      </div>
      <div className="portfolio-actions-compact">
        <button 
          className="action-btn buy-btn small"
          onClick={onOpenBuyModal}
          title="Buy any stock"
        >
          💰 Buy
        </button>
        <button 
          className="action-btn sell-btn small"
          onClick={onOpenSellModal}
          title="Sell from positions"
          disabled={stockPositions.length === 0}
        >
          💸 Sell
        </button>
      </div>
    </div>
  );
};

export default PortfolioHeader;
