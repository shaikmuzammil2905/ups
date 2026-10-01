import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import ImageUpload from './components/ImageUpload';
import ConfirmDialog from './components/ConfirmDialog';
import {
  Layers, Plus, Search, Edit2, Trash2, Download, FileText,
  Save, X, Loader, Check, ExternalLink
} from 'lucide-react';

const DEFAULT_FORM = {
  title: '',
  brand_name: 'APC',
  category_name: 'Online UPS',
  file_url: '',
  thumbnail_url: '',
  file_size: '2.4 MB',
  is_active: true,
};

export default function CatalogsAdmin() {
  const [catalogs, setCatalogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCatalog, setEditingCatalog] = useState(null);
  const [formData, setFormData] = useState(DEFAULT_FORM);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  const fetchCatalogs = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error: err } = await supabase
        .from('catalogs')
        .select('*')
        .order('created_at', { ascending: false });
      if (err) throw err;
      setCatalogs(data || []);
    } catch (err) {
      console.error('Fetch catalogs error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCatalogs();
  }, [fetchCatalogs]);

  const showNotification = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleOpenCreate = () => {
    setEditingCatalog(null);
    setFormData(DEFAULT_FORM);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat) => {
    setEditingCatalog(cat);
    setFormData({ ...cat });
    setIsModalOpen(true);
  };

  const handleToggleActive = async (cat) => {
    try {
      const updated = !cat.is_active;
      const { error: err } = await supabase
        .from('catalogs')
        .update({ is_active: updated, updated_at: new Date().toISOString() })
        .eq('id', cat.id);
      if (err) throw err;
      setCatalogs(prev => prev.map(c => c.id === cat.id ? { ...c, is_active: updated } : c));
      showNotification(`Catalog ${updated ? 'activated' : 'hidden'}.`);
    } catch (err) {
      alert(`Error toggling catalog: ${err.message}`);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.file_url.trim()) {
      alert('Catalog title and document link/file URL are required.');
      return;
    }

    setFormLoading(true);
    try {
      const payload = {
        title: formData.title.trim(),
        brand_name: formData.brand_name || '',
        category_name: formData.category_name || '',
        file_url: formData.file_url.trim(),
        thumbnail_url: formData.thumbnail_url || '',
        file_size: formData.file_size || 'PDF Document',
        is_active: formData.is_active,
        updated_at: new Date().toISOString(),
      };

      if (editingCatalog) {
        const { error: err } = await supabase
          .from('catalogs')
          .update(payload)
          .eq('id', editingCatalog.id);
        if (err) throw err;
        showNotification('Catalog updated!');
      } else {
        const { error: err } = await supabase
          .from('catalogs')
          .insert({ ...payload, created_at: new Date().toISOString() });
        if (err) throw err;
        showNotification('Catalog added!');
      }

      setIsModalOpen(false);
      fetchCatalogs();
    } catch (err) {
      console.error('Save error:', err);
      alert(`Failed to save catalog: ${err.message}`);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try {
      const { error: err } = await supabase
        .from('catalogs')
        .delete()
        .eq('id', deleteConfirm.id);
      if (err) throw err;
      setCatalogs(prev => prev.filter(c => c.id !== deleteConfirm.id));
      setDeleteConfirm(null);
      showNotification('Catalog deleted.');
    } catch (err) {
      alert(`Delete error: ${err.message}`);
    }
  };

  const filteredCatalogs = catalogs.filter(c =>
    c.title?.toLowerCase().includes(search.toLowerCase()) ||
    c.brand_name?.toLowerCase().includes(search.toLowerCase()) ||
    c.category_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2.5">
            <Layers className="w-7 h-7 text-[#16a34a]" />
            Catalog & PDF Management
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage downloadable product brochures, technical specification sheets, and manufacturer catalogs.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#16a34a] hover:bg-green-700 text-white rounded-xl font-bold text-sm shadow-md transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add Catalog PDF
        </button>
      </div>

      {/* Notification */}
      {successMsg && (
        <div className="flex items-center gap-2 p-3 bg-green-50 text-green-800 border border-green-200 rounded-xl text-sm font-medium animate-fade-in">
          <Check className="w-4 h-4 text-green-600" />
          {successMsg}
        </div>
      )}

      {/* Search Bar */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search catalogs by title or brand..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#16a34a]"
          />
        </div>
        <div className="text-sm text-slate-500 font-medium">
          Total Documents: <span className="font-bold text-slate-800">{catalogs.length}</span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400">
            <Loader className="w-8 h-8 animate-spin mx-auto mb-2 text-[#16a34a]" />
            Loading catalogs...
          </div>
        ) : filteredCatalogs.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Layers className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-base font-semibold text-slate-600">No catalogs uploaded yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 uppercase text-[11px] font-bold tracking-wider border-b border-slate-100">
                  <th className="py-3 px-4">Document</th>
                  <th className="py-3 px-4">Brand / Category</th>
                  <th className="py-3 px-4">File Size</th>
                  <th className="py-3 px-4">Downloads</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredCatalogs.map((cat) => (
                  <tr key={cat.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-red-50 text-red-600 border border-red-200 flex items-center justify-center flex-shrink-0">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-800">{cat.title}</div>
                          <a
                            href={cat.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:underline flex items-center gap-1 font-mono"
                          >
                            Download link <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-xs">
                      <div className="font-bold text-slate-700">{cat.brand_name || 'Generic'}</div>
                      <div className="text-slate-400">{cat.category_name}</div>
                    </td>
                    <td className="py-3.5 px-4 text-xs font-mono text-slate-500">
                      {cat.file_size || 'PDF'}
                    </td>
                    <td className="py-3.5 px-4 text-xs font-semibold text-slate-700">
                      <span className="inline-flex items-center gap-1">
                        <Download className="w-3.5 h-3.5 text-slate-400" />
                        {cat.download_count || 0}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleToggleActive(cat)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
                          cat.is_active
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                        }`}
                      >
                        {cat.is_active ? 'Active' : 'Hidden'}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(cat)}
                          title="Edit"
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(cat)}
                          title="Delete"
                          className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-100 p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-xl font-black text-slate-800">
                {editingCatalog ? 'Edit Catalog' : 'Add Catalog Document'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Brochure / Catalog Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. APC Smart-UPS SRT On-Line Brochure"
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#16a34a]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Brand
                  </label>
                  <input
                    type="text"
                    value={formData.brand_name}
                    onChange={(e) => setFormData({ ...formData, brand_name: e.target.value })}
                    placeholder="e.g. APC"
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    value={formData.category_name}
                    onChange={(e) => setFormData({ ...formData, category_name: e.target.value })}
                    placeholder="e.g. Online UPS"
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  PDF Download URL *
                </label>
                <input
                  type="url"
                  required
                  value={formData.file_url}
                  onChange={(e) => setFormData({ ...formData, file_url: e.target.value })}
                  placeholder="https://... or /catalogs/brochure.pdf"
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs focus:outline-none focus:border-[#16a34a]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Estimated File Size
                </label>
                <input
                  type="text"
                  value={formData.file_size}
                  onChange={(e) => setFormData({ ...formData, file_size: e.target.value })}
                  placeholder="e.g. 2.4 MB PDF"
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Thumbnail Cover Preview
                </label>
                <ImageUpload
                  value={formData.thumbnail_url}
                  onChange={(url) => setFormData({ ...formData, thumbnail_url: url })}
                  folder="catalogs"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="cat-active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-4 h-4 text-[#16a34a] rounded"
                />
                <label htmlFor="cat-active" className="text-sm font-semibold text-slate-700 cursor-pointer">
                  Available for Customer Download
                </label>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-bold text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#16a34a] hover:bg-green-700 text-white rounded-xl font-bold text-sm shadow-md disabled:opacity-50"
                >
                  {formLoading && <Loader className="w-4 h-4 animate-spin" />}
                  {editingCatalog ? 'Update Catalog' : 'Add Catalog'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <ConfirmDialog
          isOpen={true}
          title="Delete Catalog"
          message={`Are you sure you want to delete catalog "${deleteConfirm.title}"?`}
          confirmText="Yes, Delete"
          onConfirm={handleDelete}
          onCancel={() => setDeleteConfirm(null)}
        />
      )}
    </div>
  );
}
