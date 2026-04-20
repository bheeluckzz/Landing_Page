import React from 'react';

interface DataTableControlsProps {
  state: any;
  onSearchChange: (query: string) => void;
  onFilterChange: (key: string, value?: string) => void;
  onSortChange: (key: string) => void;
  onPageChange: (page: number, limit?: number) => void;
  onReset: () => void;
  totalPages: number;
  totalCount: number;
  paginatedCount: number;
}

const DataTableControls: React.FC<DataTableControlsProps> = ({
  state,
  onSearchChange,
  onFilterChange,
  onSortChange,
  onPageChange,
  onReset,
  totalPages,
  totalCount,
  paginatedCount,
}) => {
  const { searchQuery, filters, sort, pagination } = state;
  const startItem = (pagination.page - 1) * pagination.limit + 1;
  const endItem = Math.min(pagination.page * pagination.limit, totalCount);

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'Active', label: 'Active' },
    { value: 'Inactive', label: 'Inactive' },
    { value: 'Pending', label: 'Pending' },
  ];

  const deptOptions = [
    { value: '', label: 'All Departments' },
    { value: 'IT', label: 'IT' },
    { value: 'HR', label: 'HR' },
    { value: 'Sales', label: 'Sales' },
  ];

  const limitOptions = Array.from(new Set([5, 10, 20, 50, totalCount])).sort((a, b) => a - b);

  const getSortIcon = (key: string) => {
    if (sort.key !== key) return (
      <svg className="w-3 h-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 10v8m6-8v8M9 10v8m4-8v8M13 7l-2 2-2-2M13 17l-2-2-2 2" />
      </svg>
    );
    return sort.direction === 'asc' ? (
      <svg className="w-3.5 h-3.5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    ) : (
      <svg className="w-3.5 h-3.5 text-blue-400 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    );
  };

  return (
    <div className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm p-4 space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="relative">
          <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search by name..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-sm text-gray-100 placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all"
          />
        </div>

        <select
          value={filters.status || ''}
          onChange={(e) => onFilterChange('status', e.target.value || undefined)}
          className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-sm text-gray-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20"
        >
          {statusOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>

        <select
          value={filters.department || ''}
          onChange={(e) => onFilterChange('department', e.target.value || undefined)}
          className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-sm text-gray-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20"
        >
          {deptOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>

        <button
          onClick={onReset}
          className="w-full md:w-auto px-4 py-2 bg-gray-800/50 hover:bg-gray-700 border border-gray-700 hover:border-gray-600 rounded-lg text-sm font-medium text-gray-300 hover:text-gray-100 transition-all flex items-center justify-center gap-1.5 h-10"
        >
          Reset Filters
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="text-sm text-gray-500">
          Showing {totalCount === 0 ? 0 : startItem}-{endItem} of {totalCount} items
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={pagination.limit === 999 ? totalCount : pagination.limit}
            onChange={(e) => {
              const newLimit = parseInt(e.target.value);
              onPageChange(1, newLimit === totalCount ? 999 : newLimit);
            }}
            className="px-3 py-1.5 bg-gray-800/50 border border-gray-700 rounded text-xs text-gray-100 focus:border-blue-500"
          >
            {limitOptions.map((opt, index) => (
              <option key={`limit-${index}`} value={opt}>{opt === totalCount ? 'All' : opt}</option>
            ))}
          </select>

          <div className="flex items-center gap-1">
            <button
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="w-8 h-8 rounded border border-gray-700 text-xs hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
            >
              ‹
            </button>
            <div className="flex gap-1 min-w-[100px] justify-center">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = Math.max(1, Math.min(pagination.page - 2 + i, totalPages));
                const uniqueKey = `page-${pageNum}-${i}`;
                return (
                  <button
                    key={uniqueKey}
                    onClick={() => onPageChange(pageNum)}
                    className={`w-8 h-8 rounded text-xs font-medium flex items-center justify-center transition-colors ${
                      pagination.page === pageNum
                        ? 'bg-blue-500 text-white shadow-md'
                        : 'border border-gray-700 hover:bg-gray-700 text-gray-300'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={pagination.page === totalPages}
              className="w-8 h-8 rounded border border-gray-700 text-xs hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
            >
              ›
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataTableControls;

