import React from 'react';
import { StockPosition } from '../../types';

interface PortfolioSectorFilterProps {
  selectedSector: string;
  sectorGroups: Record<string, StockPosition[]>;
  totalPositions: number;
  onSectorChange: (sector: string) => void;
}

const PortfolioSectorFilter: React.FC<PortfolioSectorFilterProps> = ({
  selectedSector,
  sectorGroups,
  totalPositions,
  onSectorChange
}) => {
  const availableSectors = Object.keys(sectorGroups).sort();

  if (availableSectors.length <= 1) {
    return null;
  }

  return (
    <div className="portfolio-filter-compact">
      <select 
        value={selectedSector} 
        onChange={(e) => onSectorChange(e.target.value)}
        className="sector-selector-compact"
      >
        <option value="All">All Sectors ({totalPositions})</option>
        {availableSectors.map(sector => (
          <option key={sector} value={sector}>
            {sector} ({sectorGroups[sector].length})
          </option>
        ))}
      </select>
    </div>
  );
};

export default PortfolioSectorFilter;
