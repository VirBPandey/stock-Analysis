import React from 'react';
import { SectorFilter } from '../stock-analysis';
import { Stock } from '../../types';

interface PortfolioFiltersProps {
  searchTerm: string;
  selectedSectors: string[];
  availableSectors: string[];
  sectorGroups: Record<string, Stock[]>;
  showSectorDropdown: boolean;
  onSearchChange: (value: string) => void;
  onToggleSectorDropdown: () => void;
  onSelectSectors: (sectors: string[]) => void;
}

const PortfolioFilters: React.FC<PortfolioFiltersProps> = ({
  searchTerm,
  selectedSectors,
  availableSectors,
  sectorGroups,
  showSectorDropdown,
  onSearchChange,
  onToggleSectorDropdown,
  onSelectSectors
}) => {
  return (
    <div className="header-controls">
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
        placeholder="🔍 Search portfolio stocks..."
        value={searchTerm}
        onChange={e => onSearchChange(e.target.value)}
        className="search-input"
      />
    </div>
  );
};

export default PortfolioFilters;
