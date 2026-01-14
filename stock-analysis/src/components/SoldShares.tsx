import React, { useState, useEffect } from 'react';
import { SoldShare, Stock, ProfitLossReport } from '../types';
import { soldSharesApi, stocksApi } from '../services/api';
import { formatDate } from '../utils/stockUtils';
import { confirmAction, showError, CONFIRM_MESSAGES } from '../utils/uiUtils';
import Loading from './common/Loading';

const SoldShares: React.FC = () => {
  const [soldShares, setSoldShares] = useState<SoldShare[]>([]);
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [profitLossReport, setProfitLossReport] = useState<ProfitLossReport | null>(null);
  const [newSoldShare, setNewSoldShare] = useState<Omit<SoldShare, 'id' | 'profitOrLoss'>>({
    stockId: 0,
    quantity: 0,
    purchasePrice: 0,
    sellPrice: 0,
    purchaseDate: '',
    sellDate: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSoldShares();
    fetchStocks();
    fetchProfitLossReport();
  }, []);

  const fetchSoldShares = async () => {
    try {
      setLoading(true);
      const response = await soldSharesApi.getAll();
      setSoldShares(response.data);
    } catch (error) {
      console.error('Error fetching sold shares:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStocks = async () => {
    try {
      const response = await stocksApi.getAll();
      setStocks(response.data);
    } catch (error) {
      console.error('Error fetching stocks:', error);
    }
  };

  const fetchProfitLossReport = async () => {
    try {
      const response = await soldSharesApi.getProfitLossReport();
      setProfitLossReport(response.data);
    } catch (error) {
      console.error('Error fetching profit/loss report:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await soldSharesApi.create(newSoldShare);
      setNewSoldShare({
        stockId: 0,
        quantity: 0,
        purchasePrice: 0,
        sellPrice: 0,
        purchaseDate: '',
        sellDate: '',
      });
      fetchSoldShares();
      fetchProfitLossReport();
    } catch (error) {
      console.error('Error creating sold share entry:', error);
      showError('Error creating sold share entry');
    }
  };

  const handleDelete = async (id: number) => {
    const confirmed = await confirmAction(CONFIRM_MESSAGES.DELETE_SOLD_SHARE);
    if (confirmed) {
      try {
        await soldSharesApi.delete(id);
        fetchSoldShares();
        fetchProfitLossReport();
      } catch (error) {
        console.error('Error deleting sold share entry:', error);
        showError('Error deleting sold share entry');
      }
    }
  };

  if (loading) {
    return <Loading message="Loading sold shares..." />;
  }

  return (
    <div className="sold-shares">
      <h2>Sold Shares</h2>

      {profitLossReport && (
        <div className="profit-loss-summary">
          <h3>Profit/Loss Summary</h3>
          <div className="summary-cards">
            <div className={`summary-card ${profitLossReport.totalProfitLoss >= 0 ? 'profit' : 'loss'}`}>
              <h4>Total P&L</h4>
              <p>₹{profitLossReport.totalProfitLoss.toFixed(2)}</p>
            </div>
            <div className="summary-card profit">
              <h4>Total Profit</h4>
              <p>₹{profitLossReport.totalProfit.toFixed(2)}</p>
            </div>
            <div className="summary-card loss">
              <h4>Total Loss</h4>
              <p>₹{profitLossReport.totalLoss.toFixed(2)}</p>
            </div>
            <div className="summary-card">
              <h4>Profitable Shares</h4>
              <p>{profitLossReport.totalProfitableShares}</p>
            </div>
            <div className="summary-card">
              <h4>Loss Shares</h4>
              <p>{profitLossReport.totalLossShares}</p>
            </div>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="sold-share-form">
        <h3>Add Sold Share Entry</h3>
        <div className="form-grid">
          <select
            value={newSoldShare.stockId}
            onChange={(e) => setNewSoldShare({ ...newSoldShare, stockId: parseInt(e.target.value) })}
            required
          >
            <option value={0}>Select Stock</option>
            {stocks.map((stock) => (
              <option key={stock.id} value={stock.id}>
                {stock.name} 
              </option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Quantity"
            value={newSoldShare.quantity}
            onChange={(e) => setNewSoldShare({ ...newSoldShare, quantity: parseInt(e.target.value) })}
            required
          />
          <input
            type="number"
            step="0.01"
            placeholder="Purchase Price (₹)"
            value={newSoldShare.purchasePrice}
            onChange={(e) => setNewSoldShare({ ...newSoldShare, purchasePrice: parseFloat(e.target.value) })}
            required
          />
          <input
            type="number"
            step="0.01"
            placeholder="Sell Price (₹)"
            value={newSoldShare.sellPrice}
            onChange={(e) => setNewSoldShare({ ...newSoldShare, sellPrice: parseFloat(e.target.value) })}
            required
          />
          <input
            type="date"
            placeholder="Purchase Date"
            value={newSoldShare.purchaseDate}
            onChange={(e) => setNewSoldShare({ ...newSoldShare, purchaseDate: e.target.value })}
            required
          />
          <input
            type="date"
            placeholder="Sell Date"
            value={newSoldShare.sellDate}
            onChange={(e) => setNewSoldShare({ ...newSoldShare, sellDate: e.target.value })}
            required
          />
        </div>
        <button type="submit">Add Sold Share</button>
      </form>

      <div className="sold-shares-list">
        <h3>Sold Shares History</h3>
        {soldShares.length === 0 ? (
          <p>No sold shares recorded yet.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Stock</th>
                <th>Quantity</th>
                <th>Purchase Price</th>
                <th>Sell Price</th>
                <th>Purchase Date</th>
                <th>Sell Date</th>
                <th>Profit/Loss</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {soldShares.map((share) => (
                <tr key={share.id}>                  
                  <td>{share.quantity}</td>
                  <td>₹{share.purchasePrice}</td>
                  <td>₹{share.sellPrice}</td>
                  <td>{formatDate(share.purchaseDate)}</td>
                  <td>{formatDate(share.sellDate)}</td>
                  <td className={share.profitOrLoss >= 0 ? 'profit-text' : 'loss-text'}>
                    ₹{share.profitOrLoss.toFixed(2)}
                  </td>
                  <td>
                    <button onClick={() => handleDelete(share.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default SoldShares;