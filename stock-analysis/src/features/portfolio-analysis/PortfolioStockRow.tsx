import React from 'react';
import { Stock, StockPosition } from '../../types';
import { 
  calculateHealthScore, 
  getRatioClass, 
  truncateText 
} from '../../utils/stockUtils';

interface PortfolioStockRowProps {
  stock: Stock;
  position: StockPosition | null;
  onRowClick: (stock: Stock) => void;
  onDelete: (id: number) => void;
}

const PortfolioStockRow: React.FC<PortfolioStockRowProps> = ({
  stock,
  position,
  onRowClick,
  onDelete
}) => {
  const healthStatus = calculateHealthScore(stock);
  const hasTarget = stock.targetPrice > 0 && stock.targetDate;

  const renderTargetDate = () => {
    if (!hasTarget || !stock.targetDate) return null;
    
    const targetDate = new Date(stock.targetDate);
    const today = new Date();
    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return `${Math.abs(diffDays)}d ago`;
    } else if (diffDays === 0) {
      return 'Today';
    } else if (diffDays <= 30) {
      return `${diffDays}d left`;
    } else {
      return targetDate.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  const renderPL = () => {
    if (!position) return <span className="no-position">No position</span>;
    
    const currentValue = position.totalQuantity * (position.stock?.currentPrice || position.averagePrice);
    const unrealizedPL = currentValue - position.totalInvestment;
    const unrealizedPLPercentage = position.totalInvestment > 0 
      ? (unrealizedPL / position.totalInvestment) * 100 
      : 0;
    
    return (
      <div className="pl-info">
        <div className={`pl-amount ${unrealizedPL >= 0 ? 'profit' : 'loss'}`}>
          ₹{Math.abs(unrealizedPL).toFixed(0)}
        </div>
        <div className={`pl-percentage ${unrealizedPLPercentage >= 0 ? 'profit' : 'loss'}`}>
          ({unrealizedPLPercentage >= 0 ? '+' : ''}{unrealizedPLPercentage.toFixed(1)}%)
        </div>
      </div>
    );
  };

  return (
    <tr
      className={`stock-row ${healthStatus}`}
      onClick={() => onRowClick(stock)}
    >
      <td className="stock-name-cell">
        <div className="stock-name">{stock.name}</div>
        {position && (
          <div className="position-hint">
            {position.totalQuantity} shares • ₹{position.averagePrice.toFixed(2)} avg • ₹
            {(position.totalQuantity * (position.stock?.currentPrice || position.averagePrice)).toFixed(0)} value
          </div>
        )}
        {stock.shareholdingPattern && (
          <div className="shareholding-hint">
            {truncateText(stock.shareholdingPattern, 50)}
          </div>
        )}
      </td>
      
      <td className={`ratio-cell ${getRatioClass(stock.currentRatio, 'currentRatio')}`}>
        {stock.currentRatio}
      </td>
      
      <td className={`ratio-cell ${getRatioClass(stock.debtEquityRatio, 'debtEquity')}`}>
        {stock.debtEquityRatio}
      </td>
      
      <td className={`ratio-cell ${getRatioClass(stock.priceBookRatio, 'priceBook')}`}>
        {stock.priceBookRatio}
      </td>
      
      <td className="ratio-cell">
        {stock.beta}
      </td>
      
      <td className="target-cell">
        {hasTarget ? (
          <div className="target-info">
            <div className="target-price">₹{stock.targetPrice}</div>
            <div className="target-date">{renderTargetDate()}</div>
          </div>
        ) : (
          <span className="no-target">No target</span>
        )}
      </td>
      
      <td className="pl-cell">
        {renderPL()}
      </td>
      
      <td className="actions-cell">
        <button
          className="delete-btn-small"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(stock.id);
          }}
          title="Delete stock"
        >
          🗑️
        </button>
      </td>
    </tr>
  );
};

export default PortfolioStockRow;
