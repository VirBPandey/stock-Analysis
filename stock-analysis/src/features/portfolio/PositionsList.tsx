import React, { useState, useMemo } from 'react';
import { StockPosition } from '../../types';
import { usePositionSectorGroups } from '../../utils/portfolioHelpers';
import PortfolioSectorFilter from './PortfolioSectorFilter';
import PositionCard from './PositionCard';
import Loading from '../../components/common/Loading';

interface PositionsListProps {
  stockPositions: StockPosition[];
  expandedStocks: {[stockId: number]: boolean};
  expandedBuyTables: {[stockId: number]: boolean};
  expandedSellTables: {[stockId: number]: boolean};
  onToggleStock: (stockId: number) => void;
  onToggleBuyTable: (stockId: number) => void;
  onToggleSellTable: (stockId: number) => void;
  onOpenTargetModal: (stockId: number, stockName: string, currentTarget?: number, currentDate?: string) => void;
  onOpenTransactionModal?: (type: 'buy' | 'sell', stockId?: number) => void;
  onDeleteTransaction: (id: number) => void;
  loading: boolean;
}

const PositionsList: React.FC<PositionsListProps> = ({
  stockPositions,
  expandedStocks,
  expandedBuyTables,
  expandedSellTables,
  onToggleStock,
  onToggleBuyTable,
  onToggleSellTable,
  onOpenTargetModal,
  onOpenTransactionModal,
  onDeleteTransaction,
  loading
}) => {
  const [selectedSector, setSelectedSector] = useState<string>('All');

  // Sort stock positions alphabetically by stock name
  const sortedStockPositions = useMemo(() => {
    return [...stockPositions].sort((a, b) => {
      const nameA = a.stock?.name || '';
      const nameB = b.stock?.name || '';
      return nameA.localeCompare(nameB);
    });
  }, [stockPositions]);

  // Group positions by sector using shared utility
  const sectorGroups = usePositionSectorGroups(sortedStockPositions);
  
  // Filter positions based on selected sector
  const displayPositions = useMemo(() => {
    return selectedSector === 'All' 
      ? sortedStockPositions 
      : sectorGroups[selectedSector] || [];
  }, [selectedSector, sortedStockPositions, sectorGroups]);

  if (loading) {
    return <Loading message="Loading portfolio data..." />;
  }

  if (!stockPositions || stockPositions.length === 0) {
    return (
      <div className="no-positions">
        <h3>No portfolio entries yet</h3>
        <p>Start by adding your first transaction above.</p>
      </div>
    );
  }

  return (
    <div className="portfolio-list">
      <PortfolioSectorFilter
        selectedSector={selectedSector}
        sectorGroups={sectorGroups}
        totalPositions={sortedStockPositions.length}
        onSectorChange={setSelectedSector}
      />

      <div className="stock-positions">
        {displayPositions.length > 0 ? (
          displayPositions.map((position) => (
            <PositionCard
              key={position.stockId}
              position={position}
              expanded={expandedStocks[position.stockId]}
              buyTableExpanded={expandedBuyTables[position.stockId]}
              sellTableExpanded={expandedSellTables[position.stockId]}
              onToggleStock={() => onToggleStock(position.stockId)}
              onToggleBuyTable={() => onToggleBuyTable(position.stockId)}
              onToggleSellTable={() => onToggleSellTable(position.stockId)}
              onOpenTargetModal={onOpenTargetModal}
              onOpenTransactionModal={onOpenTransactionModal}
              onDeleteTransaction={onDeleteTransaction}
            />
          ))
        ) : (
          <div className="no-positions">
            <p>No stocks found in the {selectedSector} sector.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PositionsList;
