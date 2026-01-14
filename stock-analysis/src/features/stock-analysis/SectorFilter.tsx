import React from 'react';

interface SectorFilterProps {
  availableSectors: string[];
  selectedSectors: string[];
  sectorGroups: Record<string, any[]>;
  showDropdown: boolean;
  onToggleDropdown: () => void;
  onSelectSectors: (sectors: string[]) => void;
}

const SectorFilter: React.FC<SectorFilterProps> = ({
  availableSectors,
  selectedSectors,
  sectorGroups,
  showDropdown,
  onToggleDropdown,
  onSelectSectors
}) => {
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectSectors([...availableSectors]);
    } else {
      onSelectSectors([]);
    }
  };

  const handleToggleSector = (sector: string, checked: boolean) => {
    if (checked) {
      onSelectSectors([...selectedSectors, sector]);
    } else {
      onSelectSectors(selectedSectors.filter(s => s !== sector));
    }
  };

  const getButtonLabel = () => {
    if (selectedSectors.length === 0) return 'All Sectors';
    if (selectedSectors.length === 1) {
      return `${selectedSectors[0]} (${sectorGroups[selectedSectors[0]].length})`;
    }
    return `${selectedSectors.length} sectors selected`;
  };

  if (availableSectors.length <= 1) return null;

  return (
    <div className="multi-select-container">
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
                checked={selectedSectors.length === availableSectors.length}
                onChange={(e) => handleSelectAll(e.target.checked)}
              />
              <span>Select All Sectors</span>
            </label>
          </div>
          {availableSectors.map(sector => (
            <div key={sector} className="sector-option">
              <label>
                <input
                  type="checkbox"
                  checked={selectedSectors.includes(sector)}
                  onChange={(e) => handleToggleSector(sector, e.target.checked)}
                />
                <span>{sector} ({sectorGroups[sector].length})</span>
              </label>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SectorFilter;
