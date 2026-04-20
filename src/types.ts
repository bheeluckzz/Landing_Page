export interface ItemData {
  year?: number;
  price?: number;
  cpuModel?: string;
  hardDiskSize?: string;
  [key: string]: unknown;
}

export interface Item {
  id: string;
  name: string;
  year?: number;
  price?: number;
  cpuModel?: string;
  hardDiskSize?: string;
  created?: string;
  data?: ItemData | null;
}

export interface DataTableState {
  searchQuery: string;
  filters: {
    status?: string;
    department?: string;
  };
  sort: {
    key: string;
    direction: 'asc' | 'desc';
  };
  pagination: {
    page: number;
    limit: number;
  };
}

