import React from 'react';
import { Stock } from '../../types';
import StockTableRow from './StockTableRow';

interface StockTableProps {
  stocks: Stock[];
  sortAsc: boolean;
  onSortToggle: () => void;
  onRowClick: (stock: Stock) => void;
  onDelete: (id: number) => void;
}

const StockTable: React.FC<StockTableProps> = ({
  stocks,
  sortAsc,
  onSortToggle,
  onRowClick,
  onDelete
}) => {
  return (
    <>
      <div className="table-header">
        <div className="table-title">
          <h3>Stock Data</h3>
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
              <th className="stock-name-col">Stock Name</th>
              <th className="price-col">Price (₹)</th>
              <th className="ratio-col" title="Current Ratio">CR</th>
              <th className="ratio-col" title="Debt-to-Equity Ratio">D/E</th>
              <th className="ratio-col" title="Price-to-Book Ratio">P/B</th>
              <th className="ratio-col" title="Beta">β</th>
              <th className="target-col">Target</th>
              <th className="actions-col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {stocks.map((stock) => (
              <StockTableRow
                key={stock.id}
                stock={stock}
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

export default StockTable;
