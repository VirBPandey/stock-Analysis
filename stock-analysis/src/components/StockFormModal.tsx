import React, { useState, useEffect } from 'react';
import { Stock } from '../types';
import { useAppDispatch } from '../hooks/useRedux';
import { createStock, updateStock } from '../store/stocksSlice';

interface StockFormModalProps {
  isOpen: boolean;
  editingStock: Stock | null;
  onClose: () => void;
  onStockSaved: () => void;
  availableSectors: string[];
}

const StockFormModal: React.FC<StockFormModalProps> = ({
  isOpen,
  editingStock,
  onClose,
  onStockSaved,
  availableSectors
}) => {
  const [formData, setFormData] = useState<Omit<Stock, 'id'>>({
    name: '',
    sectorName: '',
    currentRatio: 0,
    debtEquityRatio: 0,
    priceBookRatio: 0,
    beta: 0,
    shareholdingPattern: '',
    targetPrice: 0,
    targetDate: '',
    positiveAnalysis: '',
    negativeAnalysis: '',
    // Enhanced fields    
    volume: '' ,
    analystRating: 'hold',    
    currentPrice: 0,
  });
  const [loading, setLoading] = useState(false);
  const [showSectorDropdown, setShowSectorDropdown] = useState(false);
  const dispatch = useAppDispatch();

  // Initialize form data when modal opens or editing stock changes
  useEffect(() => {
    if (editingStock) {
      setFormData({
        name: editingStock.name,
        sectorName: editingStock.sectorName || '',
        currentRatio: editingStock.currentRatio,
        debtEquityRatio: editingStock.debtEquityRatio,
        priceBookRatio: editingStock.priceBookRatio,
        beta: editingStock.beta,
        shareholdingPattern: editingStock.shareholdingPattern,
        targetPrice: editingStock.targetPrice,
        targetDate: editingStock.targetDate ? (() => {
          try {
            const date = new Date(editingStock.targetDate);
            if (isNaN(date.getTime())) return '';
            return date.toISOString().split('T')[0];
          } catch (error) {
            console.log('Date conversion error for form:', editingStock.targetDate, error);
            return '';
          }
        })() : '',
        positiveAnalysis: editingStock.positiveAnalysis || '',
        negativeAnalysis: editingStock.negativeAnalysis || '',
        // Enhanced fields      
        marketCap: editingStock.marketCap || 0,       
        volume: editingStock.volume || '',       
        analystRating: editingStock.analystRating || 'hold',      
        currentPrice: editingStock.currentPrice || 0,
      });
    } else {
      // Reset form for new stock
      setFormData({
        name: '',
        sectorName: '',
        currentRatio: 0,
        debtEquityRatio: 0,
        priceBookRatio: 0,
        beta: 0,
        shareholdingPattern: '',
        targetPrice: 0,
        targetDate: '',
        positiveAnalysis: '',
        negativeAnalysis: '',
        // Enhanced fields        
        marketCap: 0,       
        volume: '',      
        currentPrice: 0,
      });
    }
  }, [editingStock, isOpen]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (editingStock) {
        // Update existing stock
        await dispatch(updateStock({ 
          id: editingStock.id, 
          data: { ...formData, id: editingStock.id } 
        })).unwrap();
      } else {
        // Create new stock
        await dispatch(createStock(formData)).unwrap();
      }
      
      onStockSaved();
      onClose();
    } catch (error) {
      console.error('Error saving stock:', error);
      alert(editingStock ? 'Error updating stock' : 'Error creating stock');
    } finally {
      setLoading(false);
    }
  };

  // Handle input changes
  const handleInputChange = (field: keyof Omit<Stock, 'id'>, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (isOpen && target.closest('.modal-content') === null && target.closest('.dropdown-options') === null) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, onClose]);

  // Close sector dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.editable-dropdown-container')) {
        setShowSectorDropdown(false);
      }
    };

    if (showSectorDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showSectorDropdown]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>{editingStock ? '✏️ Update Stock' : '➕ Add New Stock'}</h3>
          <button 
            type="button" 
            className="modal-close-btn"
            onClick={onClose}
            disabled={loading}
          >
            ❌
          </button>
        </div>

        <div className="modal-body">
          <form onSubmit={handleSubmit} className="stock-form">
            <div className="form-grid">
              {/* Company Name */}
              <input
                type="text"
                placeholder="Company Name"
                title="Company Name: Enter the full company name (e.g., 'Tata Consultancy Services', 'Reliance Industries')"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
              />

              {/* Sector Name with Dropdown */}
              <div className="editable-dropdown-container">
                <input
                  type="text"
                  placeholder="Sector Name (e.g., IT Services, Private Banks, Pharma)"
                  title="Sector Name: Industry category for the company. Examples: IT Services, Banking, Pharma, Auto, FMCG"
                  value={formData.sectorName}
                  onChange={(e) => {
                    handleInputChange('sectorName', e.target.value);
                    setShowSectorDropdown(e.target.value.length > 0);
                  }}
                  onFocus={() => setShowSectorDropdown(availableSectors.length > 0)}
                  className="editable-dropdown-input"
                />
                {showSectorDropdown && availableSectors.length > 0 && (
                  <div className="dropdown-options">
                    {availableSectors
                      .filter(sector => 
                        sector.toLowerCase().includes((formData.sectorName || '').toLowerCase())
                      )
                      .slice(0, 8)
                      .map(sector => (
                        <div
                          key={sector}
                          className="dropdown-option"
                          onClick={() => {
                            handleInputChange('sectorName', sector);
                            setShowSectorDropdown(false);
                          }}
                        >
                          {sector}
                        </div>
                      ))
                    }
                  </div>
                )}
              </div>
              <input
                type="number"
                step="0.01"
                placeholder="Current Price (₹)"
                title="Current Market Price per share"
                value={formData.currentPrice === 0 ? '' : formData.currentPrice}
                onChange={(e) => {
                  const value = e.target.value;
                  handleInputChange('currentPrice', value === '' ? 0 : parseFloat(value));
                }}
              />

              {/* Financial Ratios */}
              <input
                type="number"
                step="0.01"
                placeholder="Current Ratio"
                title="Current Ratio: Current Assets ÷ Current Liabilities. Higher is better (>1.5 is good)"
                value={formData.currentRatio === 0 ? '' : formData.currentRatio}
                onChange={(e) => {
                  const value = e.target.value;
                  handleInputChange('currentRatio', value === '' ? 0 : parseFloat(value));
                }}
              />

              <input
                type="number"
                step="0.01"
                placeholder="D/E Ratio"
                title="Debt-to-Equity Ratio: Total Debt ÷ Total Equity. Lower is better (<0.5 is good)"
                value={formData.debtEquityRatio === 0 ? '' : formData.debtEquityRatio}
                onChange={(e) => {
                  const value = e.target.value;
                  handleInputChange('debtEquityRatio', value === '' ? 0 : parseFloat(value));
                }}
              />

              <input
                type="number"
                step="0.01"
                placeholder="P/B Ratio"
                title="Price-to-Book Ratio: Market Price ÷ Book Value per Share. Lower may indicate undervalued stock"
                value={formData.priceBookRatio === 0 ? '' : formData.priceBookRatio}
                onChange={(e) => {
                  const value = e.target.value;
                  handleInputChange('priceBookRatio', value === '' ? 0 : parseFloat(value));
                }}
              />

              <input
                type="number"
                step="0.01"
                placeholder="Beta"
                title="Beta: Measures stock volatility vs market. >1 (more volatile), <1 (less volatile)"
                value={formData.beta === 0 ? '' : formData.beta}
                onChange={(e) => {
                  const value = e.target.value;
                  handleInputChange('beta', value === '' ? 0 : parseFloat(value));
                }}
              />

              {/* Target Information */}
              <input
                type="number"
                step="0.01"
                placeholder="Target Price"
                title="Target Price: Your expected price goal for this stock in ₹"
                value={formData.targetPrice === 0 ? '' : formData.targetPrice}
                onChange={(e) => {
                  const value = e.target.value;
                  handleInputChange('targetPrice', value === '' ? 0 : parseFloat(value));
                }}
              />

              <input
                type="date"
                placeholder="Target Date"
                title="Target Date: Expected date to achieve target price"
                value={formData.targetDate}
                onChange={(e) => handleInputChange('targetDate', e.target.value)}
              />

              {/* Shareholding Pattern */}
              <input
                type="text"
                placeholder="Shareholding Pattern"
                title="Shareholding Pattern: Ownership distribution (e.g., '45% Promoters, 25% FII, 20% DII, 10% Retail')"
                value={formData.shareholdingPattern}
                onChange={(e) => handleInputChange('shareholdingPattern', e.target.value)}
                style={{ gridColumn: '1 / span 2', fontSize: '0.85em' }}
              />

              {/* Valuation & Market Data */}
              <input
                type="number"
                step="0.01"
                placeholder="Dividend Yield (%)"
                title="Annual dividend as percentage of current stock price"
                value={formData.dividendYield === 0 ? '' : formData.dividendYield}
                onChange={(e) => {
                  const value = e.target.value;
                  handleInputChange('dividendYield', value === '' ? 0 : parseFloat(value));
                }}
              />

              <input
                type="number"
                step="0.01"
                placeholder="Market Cap (Cr)"
                title="Market Capitalization in Crores"
                value={formData.marketCap === 0 ? '' : formData.marketCap}
                onChange={(e) => {
                  const value = e.target.value;
                  handleInputChange('marketCap', value === '' ? 0 : parseFloat(value));
                }}
              />

              <input
                type="text"
                placeholder="Trading Volume"
                title="Average daily trading volume"
                value={formData.volume}
                onChange={(e) => handleInputChange('volume', e.target.value)}
              />

              <select
                value={formData.analystRating}
                onChange={(e) => handleInputChange('analystRating', e.target.value)}
                title="Overall investment recommendation"
              >
                <option value="strong_buy">🚀 Strong Buy</option>
                <option value="buy">✅ Buy</option>
                <option value="hold">⚖️ Hold</option>
                <option value="sell">❌ Sell</option>
                <option value="strong_sell">🛑 Strong Sell</option>
              </select>              

             
              

              {/* Analysis Fields */}
              <textarea
                placeholder="Positive Analysis"
                title="Positive Analysis: Record bullish factors, growth prospects, competitive advantages"
                value={formData.positiveAnalysis}
                onChange={(e) => handleInputChange('positiveAnalysis', e.target.value)}
                rows={2}
                style={{ gridColumn: '1 / -1', resize: 'vertical' }}
              />

              <textarea
                placeholder="Negative Analysis"
                title="Negative Analysis: Record bearish factors, risks, challenges, weaknesses"
                value={formData.negativeAnalysis}
                onChange={(e) => handleInputChange('negativeAnalysis', e.target.value)}
                rows={2}
                style={{ gridColumn: '1 / -1', resize: 'vertical' }}
              />
            </div>

            <div className="form-actions">
              <button 
                type="submit" 
                className="primary-btn"
                disabled={loading || !formData.name.trim()}
              >
                {loading ? '💾 Saving...' : (editingStock ? '💾 Update Stock' : '➕ Add Stock')}
              </button>
              <button 
                type="button" 
                onClick={onClose} 
                className="secondary-btn"
                disabled={loading}
              >
                ❌ Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StockFormModal;