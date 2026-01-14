import React from 'react';
import { Transaction } from '../../types';
import { formatDate } from '../../utils/stockUtils';

interface TransactionTableProps {
  transactions: Transaction[];
  type: 'buy' | 'sell';
  expanded: boolean;
  onToggle: () => void;
  onDelete: (id: number) => void;
}

const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  type,
  expanded,
  onToggle,
  onDelete
}) => {
  if (transactions.length === 0) return null;

  const totalQty = transactions.reduce((sum, t) => sum + (t.quantity || 0), 0);
  const totalValue = transactions.reduce((sum, t) => sum + ((t.quantity || 0) * (t.price || 0)), 0);
  const icon = type === 'buy' ? '📈' : '📉';
  const headerClass = type === 'buy' ? 'buy-header' : 'sell-header';
  const tableClass = type === 'buy' ? 'buy-table' : 'sell-table';
  const rowClass = type === 'buy' ? 'transaction-buy' : 'transaction-sell';
  const totalsClass = type === 'buy' ? 'buy-totals' : 'sell-totals';

  return (
    <div className={`${type}-transactions`}>
      <div 
        className={`table-header ${headerClass} clickable-header`} 
        onClick={onToggle}
      >
        <div className="header-title">
          {icon} {type.charAt(0).toUpperCase() + type.slice(1)} Transactions ({transactions.length})
        </div>
        <div className="header-summary">
          Total: {totalQty} shares @ ₹{totalValue.toFixed(2)}
          <span className="toggle-indicator">
            {expanded ? '▼' : '▶'}
          </span>
        </div>
      </div>
      
      {expanded && (
        <table className={`transactions-table ${tableClass}`}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Total Value</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id} className={rowClass}>
                <td>{formatDate(transaction.date)}</td>
                <td>{transaction.quantity}</td>
                <td>₹{(transaction.price || 0).toFixed(2)}</td>
                <td>₹{((transaction.quantity || 0) * (transaction.price || 0)).toFixed(2)}</td>
                <td>
                  <button 
                    onClick={() => onDelete(transaction.id)} 
                    className="delete-btn"
                    title="Delete transaction"
                  >
                    🗑️ Delete
                  </button>
                </td>
              </tr>
            ))}
            <tr className={`totals-row ${totalsClass}`}>
              <td><strong>Totals:</strong></td>
              <td><strong>{totalQty}</strong></td>
              <td>
                <strong>
                  Avg: ₹{totalQty > 0 ? (totalValue / totalQty).toFixed(2) : '0.00'}
                </strong>
              </td>
              <td><strong>₹{totalValue.toFixed(2)}</strong></td>
              <td></td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TransactionTable;
