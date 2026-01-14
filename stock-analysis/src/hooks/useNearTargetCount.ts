import { useState, useEffect } from 'react';
import { portfolioApi } from '../services/api';

export const useNearTargetCount = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const response = await portfolioApi.getNearTarget();
        const nearTargetData = Array.isArray(response.data) ? response.data : 
                              Array.isArray(response) ? response : [];
        setCount(nearTargetData.length);
      } catch (error) {
        console.error('Error fetching near target count:', error);
        setCount(0);
      }
    };

    fetchCount();
    
    // Refresh count every 5 minutes
    const interval = setInterval(fetchCount, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return count;
};