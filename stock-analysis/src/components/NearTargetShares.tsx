import React, { useState, useEffect } from 'react';
import { PortfolioEntry } from '../types';
import { portfolioApi } from '../services/api';
import { formatDate } from '../utils/stockUtils';
import Loading from './common/Loading';

const NearTargetShares: React.FC = () => {
  const [nearTargetEntries, setNearTargetEntries] = useState<PortfolioEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [daysThreshold, setDaysThreshold] = useState(30); // Default to 30 days

  useEffect(() => {
    console.log('NearTargetShares component mounted, fetching data...');
    fetchNearTargetEntries();
  }, [daysThreshold]);

  const fetchNearTargetEntries = async () => {
    try {
      setLoading(true);
      const response = await portfolioApi.getNearTarget();
      console.log('Near target API response:', response);
      
      // Ensure we have an array
      const nearTargetData = Array.isArray(response.data) ? response.data : 
                            Array.isArray(response) ? response : [];
      
      // Filter by custom days threshold
      const filteredEntries = nearTargetData.filter(entry => {
        if (!entry.targetDate) return false;
        
        const targetDate = new Date(entry.targetDate);
        const isValidDate = !isNaN(targetDate.getTime());
        
        if (!isValidDate) return false;
        
        const now = new Date();
        const thresholdDate = new Date(now.getTime() + daysThreshold * 24 * 60 * 60 * 1000);
        return targetDate <= thresholdDate;
      });
      
      setNearTargetEntries(filteredEntries);
    } catch (error) {
      console.error('Error fetching near target entries:', error);
      setNearTargetEntries([]);
    } finally {
      setLoading(false);
    }
  };

  const getUrgencyClass = (daysRemaining: number): string => {
    if (daysRemaining <= 3) return 'critical';
    if (daysRemaining <= 7) return 'urgent';
    if (daysRemaining <= 15) return 'warning';
    return 'normal';
  };

  const getUrgencyIcon = (daysRemaining: number): string => {
    if (daysRemaining <= 3) return '🚨';
    if (daysRemaining <= 7) return '⚠️';
    if (daysRemaining <= 15) return '🟡';
    return '🟢';
  };

  if (loading) {
    return <Loading message="Loading near target shares..." />;
  }

  return (
    <div className="near-target-shares">
      <div className="near-target-header">
        <h2>📅 Shares Near Target Date</h2>
        <div className="threshold-selector">
          <label htmlFor="daysThreshold">Show shares with targets within:</label>
          <select
            id="daysThreshold"
            value={daysThreshold}
            onChange={(e) => setDaysThreshold(parseInt(e.target.value))}
          >
            <option value={7}>7 days</option>
            <option value={15}>15 days</option>
            <option value={30}>30 days</option>
            <option value={60}>60 days</option>
            <option value={90}>90 days</option>
          </select>
        </div>
      </div>

      {nearTargetEntries.length === 0 ? (
        <div className="no-targets">
          <h3>🎉 No shares approaching target dates!</h3>
          <p>All your target dates are more than {daysThreshold} days away or no targets are set.</p>
        </div>
      ) : (
        <div className="near-target-content">
          <div className="summary-stats">
            <div className="stat-card critical">
              <h4>🚨 Critical (≤3 days)</h4>
              <span>{nearTargetEntries.filter(entry => {
                const targetDate = new Date(entry.targetDate);
                const daysRemaining = Math.ceil((targetDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                return daysRemaining <= 3;
              }).length}</span>
            </div>
            <div className="stat-card urgent">
              <h4>⚠️ Urgent (≤7 days)</h4>
              <span>{nearTargetEntries.filter(entry => {
                const targetDate = new Date(entry.targetDate);
                const daysRemaining = Math.ceil((targetDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                return daysRemaining <= 7 && daysRemaining > 3;
              }).length}</span>
            </div>
            <div className="stat-card warning">
              <h4>🟡 Upcoming (≤15 days)</h4>
              <span>{nearTargetEntries.filter(entry => {
                const targetDate = new Date(entry.targetDate);
                const daysRemaining = Math.ceil((targetDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                return daysRemaining <= 15 && daysRemaining > 7;
              }).length}</span>
            </div>
            <div className="stat-card normal">
              <h4>🟢 Normal ({daysThreshold} days)</h4>
              <span>{nearTargetEntries.filter(entry => {
                const targetDate = new Date(entry.targetDate);
                const daysRemaining = Math.ceil((targetDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                return daysRemaining > 15;
              }).length}</span>
            </div>
          </div>

          <div className="targets-table-container">
            <table className="targets-table">
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Stock</th>
                  <th>Quantity</th>
                  <th>Target Price</th>
                  <th>Target Date</th>
                  <th>Days Remaining</th>
                  <th>Potential Value</th>
                </tr>
              </thead>
              <tbody>
                {nearTargetEntries
                  .sort((a, b) => {
                    // Sort by days remaining (most urgent first)
                    const daysA = Math.ceil((new Date(a.targetDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                    const daysB = Math.ceil((new Date(b.targetDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                    return daysA - daysB;
                  })
                  .map((entry) => {
                    const targetDate = new Date(entry.targetDate);
                    const isValidDate = !isNaN(targetDate.getTime());
                    const daysRemaining = isValidDate ? Math.ceil((targetDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : 0;
                    const urgencyClass = getUrgencyClass(daysRemaining);
                    const urgencyIcon = getUrgencyIcon(daysRemaining);
                    const potentialValue = (entry.quantity || 0) * (entry.targetPrice || 0);

                    return (
                      <tr key={entry.id} className={`target-row ${urgencyClass}`}>
                        <td>
                          <span className={`status-indicator ${urgencyClass}`}>
                            {urgencyIcon}
                          </span>
                        </td>
                        <td className="stock-name">{entry.stock?.name || 'Unknown Stock'}</td>
                        <td>{entry.quantity || 0}</td>
                        <td>₹{(entry.targetPrice || 0).toFixed(2)}</td>
                        <td>{formatDate(entry.targetDate)}</td>
                        <td className={`days-remaining ${urgencyClass}`}>
                          {isValidDate ? (
                            daysRemaining === 0 ? 'Today!' :
                            daysRemaining < 0 ? `${Math.abs(daysRemaining)} days overdue` :
                            `${daysRemaining} days`
                          ) : 'Invalid Date'}
                        </td>
                        <td className="potential-value">₹{potentialValue.toFixed(2)}</td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default NearTargetShares;