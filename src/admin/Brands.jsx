import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import ImageUpload from './components/ImageUpload';
import ConfirmDialog from './components/ConfirmDialog';
import {
  Plus, Search, Edit2, Trash2, Building2, Save, X, Loader,
  AlertCircle, Check, Award, ExternalLink, Globe
} from 'lucide-react';

const DEFAULT_FORM = {
  id: '',
  name: '',
  full_name: '',
  slug: '',
  logo_text: '',
  sub_text: '',
  color: '#0284c7',
  description: '',
  banner_url: '',
  authorized_partner: true,
  established: '',
  country: 'India',
  popular_categories: '',
  display_order: 0,
  is_published: true,
};

export default function BrandsAdmin() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [formData, setFormData] = useState(DEFAULT_FORM);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  const fetchBrands = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error: err } = await supabase
        .from('brands')
        .select('*')
        .order('display_order', { ascending: true });
      if (err) throw err;
      setBrands(data || []);
    } catch (err) {
      console.error('Fetch brands error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBrands();
  }, [fetchBrands]);

  const showNotification = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleSlugify = (name) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleOpenCreate = () => {
    setEditingBrand(null);
    setFormData({
      ...DEFAULT_FORM,
      display_order: brands.length + 1,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (brand) => {
    setEditingBrand(brand);
    setFormData({
      ...brand,
      popular_categories: Array.isArray(brand.popular_categories)
        ? brand.popular_categories.join(', ')
        : (brand.popular_categories || ''),
    });
    setIsModalOpen(true);
  };

  const handleNameChange = (e) => {
    const val = e.target.value;
    setFormData(prev => ({
      ...prev,
      name: val,
      slug: !editingBrand ? handleSlugify(val) : prev.slug,
      id: !editingBrand ? handleSlugify(val) : prev.id,
      logo_text: !editingBrand ? val.toUpperCase() : prev.logo_text,
    }));
  };

  const handleTogglePartner = async (brand) => {
    try {
      const updatedStatus = !brand.authorized_partner;
      const { error: err } = await supabase
        .from('brands')
        .update({ authorized_partner: updatedStatus, updated_at: new Date().toISOString() })
        .eq('id', brand.id);
      if (err) throw err;
      setBrands(prev => prev.map(b => b.id === brand.id ? { ...b, authorized_partner: updatedStatus } : b));
      showNotification(`Brand "${brand.name}" partner badge updated.`);
    } catch (err) {
      alert(`Error toggling partner status: ${err.message}`);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Brand name is required.');
      return;
    }
    const slug = formData.slug || handleSlugify(formData.name);
    const brandId = formData.id || slug;

    // parse popular categories
    const popCats = typeof formData.popular_categories === 'string'
      ? formData.popular_categories.split(',').map(s => s.trim()).filter(Boolean)
      : formData.popular_categories;

    setFormLoading(true);
    try {
      const payload = {
        name: formData.name.trim(),
        full_name: formData.full_name?.trim() || formData.name.trim(),
        slug: slug.trim(),
        logo_text: formData.logo_text?.trim() || formData.name.trim().toUpperCase(),
        sub_text: formData.sub_text?.trim() || '',
        color: formData.color || '#0284c7',
        description: formData.description || '',
        banner_url: formData.banner_url || '',
        authorized_partner: formData.authorized_partner,
        established: formData.established ? String(formData.established) : '',
        country: formData.country || 'India',
        popular_categories: popCats,
        display_order: parseInt(formData.display_order) || 0,
        is_published: formData.is_published,
        updated_at: new Date().toISOString(),
      };

      if (editingBrand) {
        const { error: err } = await supabase
          .from('brands')
          .update(payload)
          .eq('id', editingBrand.id);
        if (err) throw err;
        showNotification('Brand updated successfully!');
      } else {
        const { error: err } = await supabase
          .from('brands')
          .insert({ id: brandId, ...payload, created_at: new Date().toISOString() });
        if (err) throw err;
        showNotification('Brand created successfully!');
      }

      setIsModalOpen(false);
      fetchBrands();
    } catch (err) {
      console.error('Save error:', err);
      alert(`Failed to save brand: ${err.message}`);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try {
      const { error: err } = await supabase
        .from('brands')
        .delete()
        .eq('id', deleteConfirm.id);
      if (err) throw err;
      showNotification(`Brand "${deleteConfirm.name}" deleted.`);
      setBrands(prev => prev.filter(b => b.id !== deleteConfirm.id));
      setDeleteConfirm(null);
    } catch (err) {
      alert(`Delete error: ${err.message}`);
    }
  };

  const filteredBrands = brands.filter(b =>
    b.name?.toLowerCase().includes(search.toLowerCase()) ||
    b.slug?.toLowerCase().includes(search.toLowerCase()) ||
    b.country?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2.5">
            <Building2 className="w-7 h-7 text-[#16a34a]" />
            Brand Management
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage partner brands (APC, Luminous, Exide, Amarom, Microtek, Vertiv, etc.) and authorization badges.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#16a34a] hover:bg-green-700 text-white rounded-xl font-bold text-sm shadow-md transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add Brand
        </button>
      </div>

      {/* Notification */}
      {successMsg && (
        <div className="flex items-center gap-2 p-3 bg-green-50 text-green-800 border border-green-200 rounded-xl text-sm font-medium animate-fade-in">
          <Check className="w-4 h-4 text-green-600" />
          {successMsg}
        </div>
      )}

      {/* Search & Stats Bar */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search brands..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#16a34a] transition-colors"
          />
        </div>
        <div className="text-sm text-slate-500 font-medium">
          Total Brands: <span className="font-bold text-slate-800">{brands.length}</span>
        </div>
      </div>

      {/* Grid or Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400">
            <Loader className="w-8 h-8 animate-spin mx-auto mb-2 text-[#16a34a]" />
            Loading brands...
          </div>
        ) : filteredBrands.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Building2 className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-base font-semibold text-slate-600">No brands found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 uppercase text-[11px] font-bold tracking-wider border-b border-slate-100">
                  <th className="py-3 px-4">Order</th>
                  <th className="py-3 px-4">Brand</th>
                  <th className="py-3 px-4">Country & Est.</th>
                  <th className="py-3 px-4">Partner Status</th>
                  <th className="py-3 px-4">Popular In</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredBrands.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-xs text-slate-400 font-bold">
                      #{b.display_order ?? 0}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-12 h-12 rounded-xl border border-slate-200 overflow-hidden flex items-center justify-center font-black text-xs text-white uppercase shadow-inner"
                          style={{ backgroundColor: b.color || '#0a1f35' }}
                        >
                          {b.banner_url ? (
                            <img src={b.banner_url} alt={b.name} className="w-full h-full object-cover" />
                          ) : (
                            b.logo_text || b.name?.slice(0, 3)
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-slate-800 flex items-center gap-1.5">
                            {b.name}
                            <span className="text-xs text-slate-400 font-normal">({b.full_name})</span>
                          </div>
                          <div className="text-xs text-slate-400 line-clamp-1 max-w-xs">{b.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-600">
                      <div>{b.country || 'India'}</div>
                      <div className="text-slate-400">Est. {b.established || 'N/A'}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleTogglePartner(b)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
                          b.authorized_partner
                            ? 'bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100'
                            : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                        }`}
                      >
                        <Award className="w-3.5 h-3.5" />
                        {b.authorized_partner ? 'Authorized' : 'Standard'}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-500">
                      {Array.isArray(b.popular_categories)
                        ? b.popular_categories.slice(0, 2).join(', ')
                        : (b.popular_categories || '—')}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(b)}
                          title="Edit"
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(b)}
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

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h2 className="text-xl font-black text-slate-800">
                {editingBrand ? 'Edit Brand' : 'Create Brand'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 pt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Brand Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleNameChange}
                    placeholder="e.g. APC"
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#16a34a]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Full Legal Name
                  </label>
                  <input
                    type="text"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    placeholder="e.g. APC by Schneider Electric"
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#16a34a]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Slug / URL Path *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs focus:outline-none focus:border-[#16a34a]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Brand Accent Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      className="w-10 h-10 rounded-xl border border-slate-200 cursor-pointer p-0.5"
                    />
                    <input
                      type="text"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      className="flex-1 px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Brand Description
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Overview of this brand and their offerings..."
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#16a34a]"
                />
              </div>

              {/* Brand Logo / Banner Upload */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Brand Logo / Banner Image
                </label>
                <ImageUpload
                  value={formData.banner_url}
                  onChange={(url) => setFormData({ ...formData, banner_url: url })}
                  folder="brands"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Country of Origin
                  </label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Established Year
                  </label>
                  <input
                    type="text"
                    value={formData.established}
                    onChange={(e) => setFormData({ ...formData, established: e.target.value })}
                    placeholder="e.g. 1981"
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Popular Categories (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.popular_categories}
                  onChange={(e) => setFormData({ ...formData, popular_categories: e.target.value })}
                  placeholder="Online UPS, Inverters, Batteries"
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={formData.authorized_partner}
                    onChange={(e) => setFormData({ ...formData, authorized_partner: e.target.checked })}
                    className="w-4 h-4 text-[#16a34a] rounded"
                  />
                  Authorized Partner
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={formData.is_published}
                    onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                    className="w-4 h-4 text-[#16a34a] rounded"
                  />
                  Published on Website
                </label>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-bold text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#16a34a] hover:bg-green-700 text-white rounded-xl font-bold text-sm shadow-md transition-all disabled:opacity-50"
                >
                  {formLoading && <Loader className="w-4 h-4 animate-spin" />}
                  {editingBrand ? 'Update Brand' : 'Create Brand'}
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
          title="Delete Brand"
          message={`Are you sure you want to delete brand "${deleteConfirm.name}"? This action cannot be undone.`}
          confirmText="Yes, Delete"
          onConfirm={handleDelete}
          onCancel={() => setDeleteConfirm(null)}
        />
      )}
    </div>
  );
}
