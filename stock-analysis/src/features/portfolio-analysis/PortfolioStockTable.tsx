import React from 'react';
import { Stock, StockPosition } from '../../types';
import PortfolioStockRow from './PortfolioStockRow';

interface PortfolioStockTableProps {
  stocks: Stock[];
  stockPositions: StockPosition[];
  sortAsc: boolean;
  onSortToggle: () => void;
  onRowClick: (stock: Stock) => void;
  onDelete: (id: number) => void;
}

const PortfolioStockTable: React.FC<PortfolioStockTableProps> = ({
  stocks,
  stockPositions,
  sortAsc,
  onSortToggle,
  onRowClick,
  onDelete
}) => {
  const getPosition = (stockId: number) => {
    return stockPositions.find(pos => pos.stockId === stockId) || null;
  };

  const sortedStocks = [...stocks].sort((a, b) =>
    sortAsc
      ? a.name.localeCompare(b.name)
      : b.name.localeCompare(a.name)
  );

  return (
    <>
      <div className="table-header">
        <div className="table-title">
          <h3>Portfolio Stock Analysis</h3>
          <span className="results-count">({stocks.length} stocks)</span>
        </div>
        <button 
          className="sort-toggle"
          onClick={onSortToggle}
          title={`Sort ${sortAsc ? 'Z-A' : 'A-Z'}`}
        >
          🔤 {sortAsc ? 'A-Z' : 'Z-A'}
        </button>
      </div>
      
      <div className="table-wrapper">
        <table className="stocks-table">
          <thead>
            <tr>
              <th className="stock-name-col">Stock & Position</th>
              <th className="ratio-col" title="Current Ratio">CR</th>
              <th className="ratio-col" title="Debt-to-Equity Ratio">D/E</th>
              <th className="ratio-col" title="Price-to-Book Ratio">P/B</th>
              <th className="ratio-col" title="Beta">β</th>
              <th className="target-col">Target</th>
              <th className="pl-col">P&L</th>
              <th className="actions-col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedStocks.map((stock) => (
              <PortfolioStockRow
                key={stock.id}
                stock={stock}
                position={getPosition(stock.id)}
                onRowClick={onRowClick}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default PortfolioStockTable;
