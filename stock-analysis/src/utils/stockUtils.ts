// Utility functions for stock analysis calculations

export const calculateHealthScore = (stock: {
  currentRatio: number;
  debtEquityRatio: number;
  priceBookRatio: number;
}): 'healthy' | 'moderate' | 'poor' => {
  const isHealthy = 
    stock.currentRatio > 1.5 && 
    stock.debtEquityRatio < 0.5 && 
    stock.priceBookRatio < 3;
  
  const isModerate = 
    stock.currentRatio > 1 && 
    stock.debtEquityRatio < 1 && 
    stock.priceBookRatio < 5;
  
  return isHealthy ? 'healthy' : isModerate ? 'moderate' : 'poor';
};

export const getRatioClass = (
  value: number,
  type: 'currentRatio' | 'debtEquity' | 'priceBook'
): 'good' | 'ok' | 'poor' => {
  switch (type) {
    case 'currentRatio':
      return value > 1.5 ? 'good' : value > 1 ? 'ok' : 'poor';
    case 'debtEquity':
      return value < 0.5 ? 'good' : value < 1 ? 'ok' : 'poor';
    case 'priceBook':
      return value < 2 ? 'good' : value < 3 ? 'ok' : 'poor';
    default:
      return 'ok';
  }
};

export const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString || dateString === '') return 'N/A';
  
  try {
    // Handle different date formats
    let dateToFormat: Date;
    
    // If it's already in ISO format with time (e.g., "2024-01-15T12:00:00")
    if (dateString.includes('T')) {
      dateToFormat = new Date(dateString);
    } 
    // If it's a date-only string (e.g., "2024-01-15")
    else if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
      dateToFormat = new Date(dateString + 'T00:00:00');
    }
    // If it's in DD-MM-YYYY or DD/MM/YYYY format
    else if (dateString.match(/^\d{2}[-\/]\d{2}[-\/]\d{4}$/)) {
      const parts = dateString.split(/[-\/]/);
      dateToFormat = new Date(`${parts[2]}-${parts[1]}-${parts[0]}T00:00:00`);
    }
    // Try direct parsing as last resort
    else {
      dateToFormat = new Date(dateString);
    }
    
    // Check if date is valid
    if (isNaN(dateToFormat.getTime())) {
      console.warn('Invalid date format:', dateString);
      return 'Invalid Date';
    }
    
    return dateToFormat.toLocaleDateString('en-GB', { 
      day: '2-digit', 
      month: 'short',
      year: 'numeric'
    });
  } catch (error) {
    console.error('Error formatting date:', dateString, error);
    return 'Invalid Date';
  }
};

export const formatCurrency = (amount: number, decimals: number = 2): string => {
  return `₹${amount.toFixed(decimals)}`;
};

export const truncateText = (text: string, maxLength: number): string => {
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};

export const groupByKey = <T,>(
  items: T[],
  keyFn: (item: T) => string
): Record<string, T[]> => {
  return items.reduce((acc, item) => {
    const key = keyFn(item);
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {} as Record<string, T[]>);
};
