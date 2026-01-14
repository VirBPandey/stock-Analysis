import React from 'react';
import { Stock } from '../../types';

interface RatingFilterProps {
  stocks: Stock[];
  selectedRatings: string[];
  showDropdown: boolean;
  onToggleDropdown: () => void;
  onSelectRatings: (ratings: string[]) => void;
}

const RATING_OPTIONS = [
  { value: 'strong_buy', label: '🚀 Strong Buy' },
  { value: 'buy', label: '✅ Buy' },
  { value: 'hold', label: '⚖️ Hold' },
  { value: 'sell', label: '❌ Sell' },
  { value: 'strong_sell', label: '🛑 Strong Sell' }
];

const RatingFilter: React.FC<RatingFilterProps> = ({
  stocks,
  selectedRatings,
  showDropdown,
  onToggleDropdown,
  onSelectRatings
}) => {
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectRatings(RATING_OPTIONS.map(r => r.value));
    } else {
      onSelectRatings([]);
    }
  };

  const handleToggleRating = (ratingValue: string, checked: boolean) => {
    if (checked) {
      onSelectRatings([...selectedRatings, ratingValue]);
    } else {
      onSelectRatings(selectedRatings.filter(r => r !== ratingValue));
    }
  };

  const getButtonLabel = () => {
    if (selectedRatings.length === 0) return '⭐ All Ratings';
    if (selectedRatings.length === 1) {
      return `⭐ ${selectedRatings[0].replace('_', ' ').toUpperCase()}`;
    }
    return `⭐ ${selectedRatings.length} ratings`;
  };

  return (
    <div className="rating-select-container multi-select-container">
      <button 
        className="multi-select-button"
        onClick={onToggleDropdown}
      >
        {getButtonLabel()}
        <span className="dropdown-arrow">▼</span>
      </button>
      {showDropdown && (
        <div className="multi-select-dropdown">
          <div className="select-all-option">
            <label>
              <input
                type="checkbox"
                checked={selectedRatings.length === RATING_OPTIONS.length}
                onChange={(e) => handleSelectAll(e.target.checked)}
              />
              <span>All Ratings</span>
            </label>
          </div>
          {RATING_OPTIONS.map(rating => {
            const count = stocks.filter(s => 
              rating.value === 'hold' 
                ? s.analystRating === 'hold' || !s.analystRating
                : s.analystRating === rating.value
            ).length;
            
            return (
              <div key={rating.value} className="sector-option">
                <label>
                  <input
                    type="checkbox"
                    checked={selectedRatings.includes(rating.value)}
                    onChange={(e) => handleToggleRating(rating.value, e.target.checked)}
                  />
                  <span>{rating.label} ({count})</span>
                </label>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RatingFilter;
