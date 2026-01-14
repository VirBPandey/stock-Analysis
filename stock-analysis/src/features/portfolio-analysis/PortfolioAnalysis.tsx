import React, { useState } from 'react';
import { Stock } from '../../types';
import { stocksApi } from '../../services/api';
import usePortfolio from '../../hooks/usePortfolio';
import { useStockModal } from '../../hooks/useModalManagement';
import { useStockSectorGroups } from '../../utils/portfolioHelpers';
import { confirmAction, showError, CONFIRM_MESSAGES } from '../../utils/uiUtils';
import StockFormModal from '../../components/StockFormModal';
import EmptyState from '../../components/EmptyState';
import PortfolioHeader from './PortfolioHeader';
import PortfolioFilters from './PortfolioFilters';
import PortfolioStockTable from './PortfolioStockTable';
import { useMultipleClickOutside } from '../stock-analysis';
import {
  usePortfolioMetrics,
  usePortfolioStocks,
  useFilteredPortfolioStocks
} from './usePortfolioMetrics';

const PortfolioAnalysis: React.FC = () => {
  // State management
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);
  const [showMultiSelectDropdown, setShowMultiSelectDropdown] = useState(false);
  const [sortAsc, setSortAsc] = useState(true);
  
  // Modal management
  const { isModalOpen, editingStock, openModal, closeModal } = useStockModal();

  // Get portfolio data
  const { stockPositions, stocks, refreshData } = usePortfolio();

  // Derived data using custom hooks
  const portfolioStocks = usePortfolioStocks(stocks, stockPositions);
  const filteredStocks = useFilteredPortfolioStocks(
    portfolioStocks,
    searchTerm,
    selectedSectors
  );
  const metrics = usePortfolioMetrics(stockPositions);

  // Group stocks by sector
  const { sectorGroups: sectorNameGroups, availableSectors: availableSectorNames } = 
    useStockSectorGroups(portfolioStocks);

  // Handle click outside for dropdowns
  useMultipleClickOutside([
    {
      selector: '.multi-select-container',
      callback: () => setShowMultiSelectDropdown(false),
      isActive: showMultiSelectDropdown
    }
  ]);

  // Event handlers
  const handleStockSaved = () => {
    refreshData();
  };

  const handleDelete = async (id: number) => {
    const confirmed = await confirmAction(CONFIRM_MESSAGES.DELETE_STOCK_WITH_PORTFOLIO);
    if (confirmed) {
      try {
        await stocksApi.delete(id);
        refreshData();
      } catch (error) {
        console.error('Error deleting stock:', error);
        showError('Error deleting stock');
      }
    }
  };

  return (
    <div className="portfolio-analysis">
      <div className="analysis-header-compact">
        <PortfolioHeader
          filteredCount={filteredStocks.length}
          totalCount={portfolioStocks.length}
          sectorsCount={availableSectorNames.length}
          totalPL={metrics.totalPL}
          totalPLPercentage={metrics.totalPLPercentage}
        />
        
        <PortfolioFilters
          searchTerm={searchTerm}
          selectedSectors={selectedSectors}
          availableSectors={availableSectorNames}
          sectorGroups={sectorNameGroups}
          showSectorDropdown={showMultiSelectDropdown}
          onSearchChange={setSearchTerm}
          onToggleSectorDropdown={() => setShowMultiSelectDropdown(!showMultiSelectDropdown)}
          onSelectSectors={setSelectedSectors}
        />
      </div>
      
      <div className="table-container">
        {portfolioStocks.length === 0 ? (
          <EmptyState
            title="No Portfolio Stocks Found"
            message="Add some stocks to your portfolio first to see their analysis here."
            icon="📈"
          />
        ) : filteredStocks.length === 0 ? (
          <EmptyState
            title="No Matching Portfolio Stocks"
            message="Try adjusting your search or sector filters."
            icon="🔍"
          />
        ) : (
          <PortfolioStockTable
            stocks={filteredStocks}
            stockPositions={stockPositions}
            sortAsc={sortAsc}
            onSortToggle={() => setSortAsc(!sortAsc)}
            onRowClick={openModal}
            onDelete={handleDelete}
          />
        )}
      </div>

      <StockFormModal
        isOpen={isModalOpen}
        editingStock={editingStock}
        onClose={closeModal}
        onStockSaved={handleStockSaved}
        availableSectors={availableSectorNames}
      />
    </div>
  );
};

export default PortfolioAnalysis;
