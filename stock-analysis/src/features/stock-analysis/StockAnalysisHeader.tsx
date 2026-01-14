import React from 'react';

interface StockAnalysisHeaderProps {
  filteredCount: number;
  totalCount: number;
  sectorsCount: number;
}

const StockAnalysisHeader: React.FC<StockAnalysisHeaderProps> = ({
  filteredCount,
  totalCount,
  sectorsCount
}) => {
  return (
    <div className="header-title-section">
      <h2>Stock Analysis</h2>
      <div className="stats-summary">
        <span className="stat-item">📈 {filteredCount} of {totalCount} stocks</span>
        {sectorsCount > 1 && (
          <span className="stat-item">🏷️ {sectorsCount} sectors</span>
        )}
      </div>
    </div>
  );
};

export default StockAnalysisHeader;
