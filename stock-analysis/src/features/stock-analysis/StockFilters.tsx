import React from 'react';
import RatingFilter from './RatingFilter';
import SectorFilter from './SectorFilter';
import { Stock } from '../../types';

interface StockFiltersProps {
  stocks: Stock[];
  searchTerm: string;
  selectedRatings: string[];
  selectedSectors: string[];
  availableSectors: string[];
  sectorGroups: Record<string, any[]>;
  showRatingDropdown: boolean;
  showSectorDropdown: boolean;
  onSearchChange: (value: string) => void;
  onToggleRatingDropdown: () => void;
  onToggleSectorDropdown: () => void;
  onSelectRatings: (ratings: string[]) => void;
  onSelectSectors: (sectors: string[]) => void;
  onAddStock: () => void;
}

const StockFilters: React.FC<StockFiltersProps> = ({
  stocks,
  searchTerm,
  selectedRatings,
  selectedSectors,
  availableSectors,
  sectorGroups,
  showRatingDropdown,
  showSectorDropdown,
  onSearchChange,
  onToggleRatingDropdown,
  onToggleSectorDropdown,
  onSelectRatings,
  onSelectSectors,
  onAddStock
}) => {
  return (
    <div className="header-controls">
      <RatingFilter
        stocks={stocks}
        selectedRatings={selectedRatings}
        showDropdown={showRatingDropdown}
        onToggleDropdown={onToggleRatingDropdown}
        onSelectRatings={onSelectRatings}
      />
      
      <SectorFilter
        availableSectors={availableSectors}
        selectedSectors={selectedSectors}
        sectorGroups={sectorGroups}
        showDropdown={showSectorDropdown}
        onToggleDropdown={onToggleSectorDropdown}
        onSelectSectors={onSelectSectors}
      />
      
      <input
        type="text"
        placeholder="🔍 Search..."
        value={searchTerm}
        onChange={e => onSearchChange(e.target.value)}
        className="search-input"
      />
      
      <button 
        className="action-btn add-btn small"
        onClick={onAddStock}
      >
        ➕ Add Stock
      </button>
    </div>
  );
};

export default StockFilters;
