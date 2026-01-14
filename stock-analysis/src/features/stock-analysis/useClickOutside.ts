import { useState, useEffect } from 'react';

export const useClickOutside = (
  callback: () => void,
  selector: string,
  isActive: boolean
) => {
  useEffect(() => {
    if (!isActive) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest(selector)) {
        callback();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isActive, callback, selector]);
};

export const useMultipleClickOutside = (
  refs: Array<{ selector: string; callback: () => void; isActive: boolean }>
) => {
  useEffect(() => {
    const activeRefs = refs.filter(ref => ref.isActive);
    if (activeRefs.length === 0) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      
      activeRefs.forEach(ref => {
        if (!target.closest(ref.selector)) {
          ref.callback();
        }
      });
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [refs]);
};
