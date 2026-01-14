import React from 'react';
import { Stock } from '../../types';
import { 
  calculateHealthScore, 
  getRatioClass, 
  formatDate, 
  formatCurrency, 
  truncateText 
} from '../../utils/stockUtils';

interface StockTableRowProps {
  stock: Stock;
  onRowClick: (stock: Stock) => void;
  onDelete: (id: number) => void;
}

const StockTableRow: React.FC<StockTableRowProps> = ({
  stock,
  onRowClick,
  onDelete
}) => {
  const healthStatus = calculateHealthScore(stock);
  const hasTarget = stock.targetPrice > 0 && stock.targetDate;

  return (
    <tr
      className={`stock-row ${healthStatus}`}
      onClick={() => onRowClick(stock)}
    >
      <td className="stock-name-cell">
        <div className="stock-name">{stock.name}</div>
        {stock.shareholdingPattern && (
          <div className="shareholding-hint">
            {truncateText(stock.shareholdingPattern, 50)}
          </div>
        )}
      </td>
      
      <td className="price-cell">
        <div className="current-price">
          {stock.currentPrice ? formatCurrency(stock.currentPrice) : 'N/A'}
        </div>
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
            <div className="target-price">{formatCurrency(stock.targetPrice, 0)}</div>
            <div className="target-date">
              {formatDate(stock.targetDate)}
            </div>
          </div>
        ) : (
          <span className="no-target">-</span>
        )}
      </td>
      
      <td className="actions-cell">
        <button 
          className="delete-btn-small"
          onClick={e => { 
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

export default StockTableRow;
