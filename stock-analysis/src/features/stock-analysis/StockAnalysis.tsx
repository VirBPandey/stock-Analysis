import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Stock } from '../../types';
import StockFormModal from '../../components/StockFormModal';
import EmptyState from '../../components/EmptyState';
import Loading from '../../components/common/Loading';
import { confirmAction, showError, CONFIRM_MESSAGES } from '../../utils/uiUtils';
import StockAnalysisHeader from './StockAnalysisHeader';
import StockFilters from './StockFilters';
import StockTable from './StockTable';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { fetchStocks, deleteStock } from '../../store/stocksSlice';
import { groupByKey } from '../../utils/stockUtils';
import { SEARCH_MIN_LENGTH } from '../../constants';
import { useMultipleClickOutside } from './useClickOutside';

const StockAnalysis: React.FC = () => {
  const dispatch = useAppDispatch();
  const { stocks, loading } = useAppSelector((state) => state.stocks);
  
  // State management
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);
  const [selectedRatings, setSelectedRatings] = useState<string[]>([]);
  const [sortAsc, setSortAsc] = useState(true);
  const [showMultiSelectDropdown, setShowMultiSelectDropdown] = useState(false);
  const [showRatingDropdown, setShowRatingDropdown] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStock, setEditingStock] = useState<Stock | null>(null);

  // Fetch stocks on mount
  useEffect(() => {
    dispatch(fetchStocks());
  }, [dispatch]);

  // Handle click outside for dropdowns
  useMultipleClickOutside([
    {
      selector: '.multi-select-container',
      callback: () => setShowMultiSelectDropdown(false),
      isActive: showMultiSelectDropdown
    },
    {
      selector: '.rating-select-container',
      callback: () => setShowRatingDropdown(false),
      isActive: showRatingDropdown
    }
  ]);

  // Event handlers
  const handleAddStock = () => {
    setEditingStock(null);
    setIsModalOpen(true);
  };

  const handleEditStock = (stock: Stock) => {
    setEditingStock(stock);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingStock(null);
  };

  const handleStockSaved = useCallback(() => {
    dispatch(fetchStocks());
  }, [dispatch]);

  const handleDelete = async (id: number) => {
    const confirmed = await confirmAction(CONFIRM_MESSAGES.DELETE_STOCK);
    if (confirmed) {
      try {
        await dispatch(deleteStock(id)).unwrap();
      } catch (error) {
        console.error('Error deleting stock:', error);
        showError('Error deleting stock');
      }
    }
  };

  // Memoized computations
  const sectorNameGroups = useMemo(
    () => groupByKey(stocks, (stock) => stock.sectorName || 'Other'),
    [stocks]
  );

  const availableSectorNames = useMemo(
    () => Object.keys(sectorNameGroups).sort(),
    [sectorNameGroups]
  );

  const filteredStocks = useMemo(() => {
    return stocks.filter(stock => {
      const matchesSearch = searchTerm.length < SEARCH_MIN_LENGTH ||
        stock.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSector = selectedSectors.length === 0 ||
        selectedSectors.includes(stock.sectorName || 'Other');
      const matchesRating = selectedRatings.length === 0 ||
        selectedRatings.includes(stock.analystRating || 'hold');
      return matchesSearch && matchesSector && matchesRating;
    });
  }, [stocks, searchTerm, selectedSectors, selectedRatings]);

  const sortedStocks = useMemo(() => {
    return [...filteredStocks].sort((a, b) =>
      sortAsc
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name)
    );
  }, [filteredStocks, sortAsc]);

  // Render loading state
  if (loading) {
    return <Loading message="Loading stocks..." />;
  }

  return (
    <div className="stock-analysis">
      <div className="analysis-header-compact">
        <StockAnalysisHeader
          filteredCount={filteredStocks.length}
          totalCount={stocks.length}
          sectorsCount={availableSectorNames.length}
        />
        
        <StockFilters
          stocks={stocks}
          searchTerm={searchTerm}
          selectedRatings={selectedRatings}
          selectedSectors={selectedSectors}
          availableSectors={availableSectorNames}
          sectorGroups={sectorNameGroups}
          showRatingDropdown={showRatingDropdown}
          showSectorDropdown={showMultiSelectDropdown}
          onSearchChange={setSearchTerm}
          onToggleRatingDropdown={() => setShowRatingDropdown(!showRatingDropdown)}
          onToggleSectorDropdown={() => setShowMultiSelectDropdown(!showMultiSelectDropdown)}
          onSelectRatings={setSelectedRatings}
          onSelectSectors={setSelectedSectors}
          onAddStock={handleAddStock}
        />
      </div>
      
      <div className="table-container">
        {stocks.length === 0 ? (
          <EmptyState
            title="No Stocks Added Yet"
            message="Start building your analysis by adding your first stock."
            actionLabel="➕ Add Your First Stock"
            onAction={handleAddStock}
          />
        ) : filteredStocks.length === 0 ? (
          <EmptyState
            title="No Matching Stocks"
            message="Try adjusting your search or sector filters."
            icon="🔍"
          />
        ) : (
          <StockTable
            stocks={sortedStocks}
            sortAsc={sortAsc}
            onSortToggle={() => setSortAsc(!sortAsc)}
            onRowClick={handleEditStock}
            onDelete={handleDelete}
          />
        )}
      </div>
      
      <StockFormModal
        isOpen={isModalOpen}
        editingStock={editingStock}
        onClose={handleCloseModal}
        onStockSaved={handleStockSaved}
        availableSectors={availableSectorNames}
      />
    </div>
  );
};

export default StockAnalysis;
