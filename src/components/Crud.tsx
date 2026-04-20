import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { api } from '../api';
import type { Item, ItemData } from '../types';
import { useDataTable } from '../hooks/useDataTable-fixed';
import DataTableControls from './DataTableControls-fixed';

const Crud: React.FC = () => {
  // State
  const [rawItems, setRawItems] = useState<Item[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [alerts, setAlerts] = useState<{ id: string; message: string; type: 'success' | 'danger' }[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    year: '',
    price: '',
    cpuModel: '',
    hardDiskSize: ''
  });

  const { 
    paginatedData, 
    totalCount, 
    totalPages, 
    state,
    updateSearch,
    updateFilter,
    updateSort,
    updatePagination,
    resetAll 
  } = useDataTable(rawItems);

  // Fetch ALL data once - client-side pagination/filter/sort
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.getItems();
      setRawItems(response.data || []);
    } catch (err) {
      console.error('Fetch error:', err);
      setRawItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Alerts
  const showAlert = (message: string, type: 'success' | 'danger' = 'success') => {
    const id = Date.now().toString();
    setAlerts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setAlerts(prev => prev.filter(a => a.id !== id)), 3500);
  };

  // Form handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = (): boolean => {
    let isValid = true;
    
    if (!formData.name.trim()) {
      isValid = false;
      showAlert('Nama item wajib diisi.', 'danger');
    }
    
    const year = parseInt(formData.year);
    if (formData.year && (year < 1990 || year > 2030)) {
      isValid = false;
      showAlert('Tahun harus 1990–2030.', 'danger');
    }
    
    const price = parseFloat(formData.price);
    if (formData.price && price < 0) {
      isValid = false;
      showAlert('Harga tidak boleh negatif.', 'danger');
    }
    
    return isValid;
  };

  const buildPayload = (): { name: string; data?: ItemData } => {
    const payload: { name: string; data?: ItemData } = { name: formData.name.trim() };
    const data: ItemData = {};
    
    if (formData.year) data.year = parseInt(formData.year);
    if (formData.price) data.price = parseFloat(formData.price);
    if (formData.cpuModel) data.cpuModel = formData.cpuModel.trim();
    if (formData.hardDiskSize) data.hardDiskSize = formData.hardDiskSize.trim();
    
    if (Object.keys(data).length) payload.data = data;
    return payload;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setSubmitting(true);
    try {
      const payload = buildPayload();
      
      if (editId) {
        // Update
        const updated = await api.updateItem(editId, payload);
        setRawItems(prev => prev.map(item => 
          item.id === editId ? updated : item
        ));
        showAlert(`✎ Item "${updated.name}" berhasil diperbarui.`);
      } else {
        // Create
        const created = await api.createItem(payload);
        setRawItems(prev => [created, ...prev]);
        showAlert(`✦ Item "${created.name}" berhasil ditambahkan.`);
      }
      
      cancelEdit();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      showAlert(`Gagal: ${errorMessage}`, 'danger');
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = (id: string) => {
    const item = rawItems.find(i => i.id === id);
    if (!item) return;
    
    setEditId(id);
    setFormData({
      name: item.name || '',
      year: (item.year || item.data?.year || 0).toString(),
      price: (item.price || item.data?.price || 0).toString(),
      cpuModel: item.cpuModel || item.data?.cpuModel || '',
      hardDiskSize: item.hardDiskSize || item.data?.hardDiskSize || ''
    });
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditId(null);
    setFormData({ name: '', year: '', price: '', cpuModel: '', hardDiskSize: '' });
  };

  const deleteItem = async (id: string) => {
    const item = rawItems.find(i => i.id === id);
    if (!item || !confirm(`Hapus "${item.name}"?\nTindakan ini tidak dapat dibatalkan.`)) 
      return;
    
    try {
      await api.deleteItem(id);
      setRawItems(prev => prev.filter(i => i.id !== id));
      showAlert(`Item "${item.name}" berhasil dihapus.`);
    } catch (err: any) {
      showAlert(`Gagal menghapus: ${err.message}`, 'danger');
    }
  };

  // Render table
  const renderTable = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center p-12 gap-3 text-center">
          <div className="w-7 h-7 border-2 border-gray-600 border-t-blue-400 rounded-full animate-spin"></div>
          <div className="text-sm font-medium text-gray-100">Mengambil data...</div>
          <div className="text-xs text-gray-500">Menghubungi /api/items</div>
        </div>
      );
    }

    if (paginatedData.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center p-12 gap-3 text-center">
          <div className="text-3xl opacity-50">○</div>
          <div className="text-sm font-medium text-gray-100">
            {totalCount === 0 ? 'Belum ada items' : 'Tidak ada hasil yang cocok'}
          </div>
          <div className="text-xs text-gray-500 max-w-[240px]">
            {totalCount === 0 
              ? 'Tambahkan item baru menggunakan form di sebelah kiri.'
              : 'Coba ubah filter, pencarian, atau sorting.'
            }
          </div>
        </div>
      );
    }

    return (
      <div className="overflow-x-auto min-h-[160px]">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              {[
                { key: 'id', label: 'ID', sortable: false },
                { key: 'name', label: 'Nama Item', sortable: true },
                { key: 'data.year', label: 'Tahun', sortable: true },
                { key: 'data.cpuModel', label: 'CPU', sortable: true },
                { key: 'data.price', label: 'Harga', sortable: true },
                { key: 'actions', label: 'Aksi', sortable: false }
              ].map(({ key, label, sortable }) => (
                <th 
                  key={key}
                  className="p-2.5 pl-4 pr-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400 border-b border-gray-800 whitespace-nowrap cursor-pointer hover:bg-white/5 transition-colors group relative"
                  onClick={sortable ? () => updateSort(key as any) : undefined}
                >
                  <div className="flex items-center gap-1">
                    {label}
                    {sortable && (
                      <span className={`text-xs opacity-50 group-hover:opacity-100 transition-all ml-1 flex-shrink-0 ${
                        state.sort.key === key 
                          ? 'text-blue-400 font-medium' 
                          : 'text-gray-500'
                      }`}>
                        {state.sort.key === key && state.sort.direction === 'asc' ? '↑' : 
                         state.sort.key === key ? '↓' : '↕'}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
              {paginatedData.map((item) => {
                const year = item.year || item.data?.year || '—';
                const cpuModel = item.cpuModel || item.data?.cpuModel || '—';
                const price = (item.price != null || item.data?.price != null) ? `$${(Number(item.price || item.data?.price) || 0).toLocaleString()}` : '—';
                return (
                  <tr key={item.id} className="hover:bg-white/5 transition-colors">
                    <td className="font-mono text-xs text-gray-500 p-3 pl-4 pr-4 border-b border-gray-800">
                      {String(item.id).slice(0,10)}
                    </td>
                    <td className="font-medium text-gray-100 p-3 pl-4 pr-4 border-b border-gray-800">
                      {item.name || '—'}
                    </td>
                    <td className="text-gray-400 text-sm p-3 pl-4 pr-4 border-b border-gray-800">
                      {year}
                    </td>
                    <td className="text-gray-400 text-sm max-w-[120px] truncate p-3 pl-4 pr-4 border-b border-gray-800">
                      {cpuModel}
                    </td>
                    <td className="font-mono text-sm text-green-400 p-3 pl-4 pr-4 border-b border-gray-800">
                      {price}
                    </td>
                    <td className="p-3 pl-4 pr-4 border-b border-gray-800">
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => startEdit(item.id)}
                          className="px-2.5 py-1 text-xs font-medium rounded border border-gray-600 hover:border-gray-500 hover:bg-gray-800/50 transition-all text-gray-200 h-7"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteItem(item.id)}
                          className="px-2.5 py-1 text-xs font-medium rounded border border-red-500/30 hover:border-red-400 hover:bg-red-500/10 transition-all text-red-400 h-7"
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900/80 to-black text-gray-100 overflow-x-hidden">
      {/* Background grid */}
      <div className="fixed inset-0 bg-grid opacity-20 pointer-events-none z-0" 
           style={{
             backgroundImage: `linear-gradient(rgba(79,142,247,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(79,142,247,0.03) 1px, transparent 1px)`,
             backgroundSize: '48px 48px'
           }} />
      
      {/* Alerts */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
        {alerts.map((alert) => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className={`flex items-center gap-2.5 p-3 rounded-xl text-sm font-medium shadow-2xl border ${
              alert.type === 'success'
                ? 'bg-emerald-950/80 border-emerald-500/30 text-emerald-300'
                : 'bg-red-950/80 border-red-500/30 text-red-300'
            } backdrop-blur-sm`}
          >
            <span className={`text-lg ${alert.type === 'success' ? 'text-emerald-400' : 'text-red-400'}`}>
              {alert.type === 'success' ? '✓' : '✕'}
            </span>
            {alert.message}
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pb-16 pt-8 md:pt-12 md:pb-20 lg:px-8">
        {/* Header */}
        <header className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-10 pb-6 border-b border-gray-800 animate-fade-down">
          <div>
            <h1 className="font-serif text-4xl md:text-5xl font-normal leading-tight mb-1.5 text-gray-100">
              Item Manager
            </h1>
            <p className="text-xs text-gray-500 font-medium tracking-wide">CRUD App - JSON Backend</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono border border-emerald-600/30 rounded-full bg-emerald-950/50 text-emerald-400">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full shadow-glow"></span>
              JSON Persist ✓
            </span>
            <span className="px-2 py-1 text-xs font-mono border border-blue-500/30 bg-blue-500/5 rounded-full text-blue-400">
              v2.0
            </span>
          </div>
        </header>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[340px,1fr] gap-6 items-start">
          
          {/* Left Panel: Form */}
          <div className="lg:flex lg:flex-col lg:gap-6 space-y-6 lg:space-y-0 order-2 lg:order-1">
            
            {/* Form Card */}
            <div className="bg-gray-950/50 border border-gray-800/50 backdrop-blur-sm rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-800 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-widest text-gray-500">
                  {editId ? 'Edit Item' : 'Tambah Item'}
                </span>
                <span className={`px-2 py-0.5 text-xs font-mono font-semibold uppercase tracking-wide rounded-md ${
                  editId 
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' 
                    : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                }`}>
                  {editId ? 'PUT /api/items/:id' : 'POST /api/items'}
                </span>
              </div>
              <div className="p-5">
                <div className="space-y-3.5">
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">
                      Nama Item <span className="text-red-400">*</span>
                    </label>
                    <input
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="cth. Apple MacBook Pro 16"
                      className="w-full h-10 px-3 bg-gray-900/50 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all text-sm font-medium"
                    />
                  </div>

                  {/* Row: Year + Price */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">
                        Tahun
                      </label>
                      <input
                        name="year"
                        type="number"
                        value={formData.year}
                        onChange={handleInputChange}
                        placeholder="2023"
                        min="1990"
                        max="2030"
                        className="w-full h-10 px-3 bg-gray-900/50 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">
                        Harga (USD)
                      </label>
                      <input
                        name="price"
                        type="number"
                        value={formData.price}
                        onChange={handleInputChange}
                        placeholder="1749"
                        min="0"
                        className="w-full h-10 px-3 bg-gray-900/50 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all text-sm"
                      />
                    </div>
                  </div>

                  {/* CPU + Disk */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">
                      CPU Model
                    </label>
                    <input
                      name="cpuModel"
                      value={formData.cpuModel}
                      onChange={handleInputChange}
                      placeholder="cth. Apple M2 Pro"
                      className="w-full h-10 px-3 bg-gray-900/50 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">
                      Hard Disk Size
                    </label>
                    <input
                      name="hardDiskSize"
                      value={formData.hardDiskSize}
                      onChange={handleInputChange}
                      placeholder="cth. 512 GB"
                      className="w-full h-10 px-3 bg-gray-900/50 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all text-sm"
                    />
                  </div>

                  <hr className="border-gray-800 my-4" />

                  <div className="flex gap-2">
                    <button
                      onClick={handleSubmit}
                      disabled={submitting}
                      className="flex-1 flex items-center justify-center gap-1 h-9 px-4 rounded-lg text-sm font-medium bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 border border-transparent shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 16 16">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 2.5H3a.5.5 0 00-.5.5v10a.5.5 0 00.5.5h10a.5.5 0 00.5-.5V3a.5.5 0 00-.5-.5zM8 11V5m-3 3h6" />
                      </svg>
                      {editId ? 'Update' : 'Simpan'}
                    </button>
                    {editId && (
                      <button
                        onClick={cancelEdit}
                        className="px-4 h-9 text-sm font-medium border border-gray-700 hover:border-gray-600 hover:bg-gray-800/50 text-gray-400 rounded-lg transition-all flex items-center justify-center"
                      >
                        Batal
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Endpoints Reference */}
            <div className="bg-gray-950/50 border border-gray-800/50 backdrop-blur-sm rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-800">
                <span className="text-xs font-semibold uppercase tracking-widest text-gray-500 block">
                  New Backend API
                </span>
              </div>
              <div className="p-5">
                <ul className="space-y-2 text-xs text-gray-400">
                  <li>• <code>GET /api/items?page=1&amp;limit=10&amp;search=foo</code></li>
                  <li>• <code>POST /api/items</code> {editId ? 'PUT' : ''}</li>
                  <li>• <code>DELETE /api/items/:id</code></li>
                  <li>• Data: <code>server/data/items.json</code> ✓ Persist</li>
                  <li>• Auth: <code>/api/auth/*</code></li>
                </ul>
              </div>
            </div>

          </div>

          {/* Right Panel: Table */}
          <div className="order-1 lg:order-2">
            <div className="bg-gray-950/50 border border-gray-800/50 backdrop-blur-sm rounded-2xl overflow-hidden">
              
              <DataTableControls
                state={state}
                onSearchChange={updateSearch}
                onFilterChange={updateFilter}
                onSortChange={updateSort}
                onPageChange={updatePagination}
                onReset={resetAll}
                totalPages={totalPages}
                totalCount={totalCount}
                paginatedCount={paginatedData.length}
              />

              {/* Table Container */}
              <div className="p-0">
                {renderTable()}
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Crud;

