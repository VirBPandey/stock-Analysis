import React from 'react';

interface PortfolioHeaderProps {
  filteredCount: number;
  totalCount: number;
  sectorsCount: number;
  totalPL: number;
  totalPLPercentage: number;
}

const PortfolioHeader: React.FC<PortfolioHeaderProps> = ({
  filteredCount,
  totalCount,
  sectorsCount,
  totalPL,
  totalPLPercentage
}) => {
  return (
    <div className="header-title-section">
      <h2>Portfolio Stock Analysis</h2>
      <div className="stats-summary">
        <span className="stat-item">
          📊 {filteredCount} of {totalCount} portfolio stocks
        </span>
        <span className={`stat-item ${totalPL >= 0 ? 'profit' : 'loss'}`}>
          💰 ₹{Math.abs(totalPL).toFixed(0)} ({totalPLPercentage >= 0 ? '+' : ''}
          {totalPLPercentage.toFixed(1)}%)
        </span>
        {sectorsCount > 1 && (
          <span className="stat-item">🏷️ {sectorsCount} sectors</span>
        )}
      </div>
    </div>
  );
};

export default PortfolioHeader;
