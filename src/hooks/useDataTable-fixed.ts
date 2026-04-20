import { useState, useCallback, useMemo, useEffect } from 'react';
import type { Item, DataTableState } from '../types';

function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export const useDataTable = (data: Item[]) => {
  const [state, setState] = useState<DataTableState>({
    searchQuery: '',
    filters: {},
    sort: { key: 'name', direction: 'asc' },
    pagination: { page: 1, limit: 999 } // Show all items by default
  });

  const debouncedSearch = useDebounce(state.searchQuery, 350);

  const filteredData = useMemo(() => {
    let filtered = [...data];

    if (debouncedSearch.trim()) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
    }

    if (state.filters.status) {
      filtered = filtered.filter(item => {
        const d = item.data || {};
        const year = d.year || 0;
        const mockStatus = year > 2010 ? 'Active' : year === 0 ? 'Pending' : 'Inactive';
        return mockStatus === state.filters.status;
      });
    }
    if (state.filters.department) {
      filtered = filtered.filter(item => {
        const d = item.data || {};
        const mockDept = d.cpuModel ? 'IT' : d.price && (d.price as number) > 1000 ? 'Sales' : 'HR';
        return mockDept === state.filters.department;
      });
    }

    filtered.sort((a, b) => {
      const getNestedValue = (obj: Item, path: string): any => {
        return path.split('.').reduce((current, key) => current?.[key], obj);
      };
      
      const aVal = getNestedValue(a, state.sort.key);
      const bVal = getNestedValue(b, state.sort.key);
      
      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return state.sort.direction === 'asc' ? 1 : -1;
      if (bVal == null) return state.sort.direction === 'asc' ? -1 : 1;
      
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return state.sort.direction === 'asc' 
          ? aVal - bVal 
          : bVal - aVal;
      }
      
      const aStr = String(aVal).toLowerCase();
      const bStr = String(bVal).toLowerCase();
      if (aStr < bStr) return state.sort.direction === 'asc' ? -1 : 1;
      if (aStr > bStr) return state.sort.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [data, debouncedSearch, state.filters, state.sort]);

  const paginatedData = useMemo(() => {
    const start = (state.pagination.page - 1) * state.pagination.limit;
    return filteredData.slice(start, start + state.pagination.limit);
  }, [filteredData, state.pagination]);

  const totalPages = Math.ceil(filteredData.length / state.pagination.limit);
  const totalCount = filteredData.length;

  const updateSearch = useCallback((query: string) => {
    setState(prev => ({ ...prev, searchQuery: query, pagination: { ...prev.pagination, page: 1 } }));
  }, []);

  const updateFilter = useCallback((key: string, value?: string) => {
    setState(prev => ({
      ...prev,
      filters: { ...prev.filters, [key]: value || undefined },
      pagination: { ...prev.pagination, page: 1 }
    }));
  }, []);

  const updateSort = useCallback((key: string) => {
    setState(prev => ({
      ...prev,
      sort: {
        key,
        direction: prev.sort.key === key && prev.sort.direction === 'asc' ? 'desc' : 'asc'
      },
      pagination: { ...prev.pagination, page: 1 }
    }));
  }, []);

  const updatePagination = useCallback((page: number, limit?: number) => {
    setState(prev => ({
      ...prev,
      pagination: { page, limit: limit ?? prev.pagination.limit }
    }));
  }, []);

  const resetAll = useCallback(() => {
    setState({
      searchQuery: '',
      filters: {},
      sort: { key: 'name', direction: 'asc' },
      pagination: { page: 1, limit: 999 }
    });
  }, []);

  return {
    state,
    debouncedSearch,
    filteredData,
    paginatedData,
    totalPages,
    totalCount,
    updateSearch,
    updateFilter,
    updateSort,
    updatePagination,
    resetAll,
  };
};

