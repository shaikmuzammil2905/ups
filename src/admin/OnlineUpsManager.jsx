import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { notifyDataUpdated } from '../lib/syncEvents';
import ConfirmDialog from './components/ConfirmDialog';
import ImageUpload from './components/ImageUpload';
import {
  Zap, Plus, Search, Filter, Edit2, Trash2, Eye, Package,
  Save, X, Check, Loader, AlertCircle, ArrowUpDown,
  ToggleLeft, ToggleRight, Star, ExternalLink, Settings,
  ShieldAlert, RefreshCw
} from 'lucide-react';

export default function OnlineUpsManager() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categoryData, setCategoryData] = useState(null);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [catLoading, setCatLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [filterBrand, setFilterBrand] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  // Category Edit Modal State
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [catForm, setCatForm] = useState({
    name: 'Online UPS',
    short_desc: '',
    image_url: '',
    banner_url: '',
    badge: 'Industrial & IT',
    is_published: true,
  });
  const [catUrlInput, setCatUrlInput] = useState('');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  // 1. Fetch Online UPS Category details
  const fetchCategoryDetails = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('id', 'online-ups')
        .maybeSingle();

      if (!error && data) {
        setCategoryData(data);
        setCatForm({
          name: data.name || 'Online UPS',
          short_desc: data.short_desc || '',
          image_url: data.image_url || '',
          banner_url: data.banner_url || '',
          badge: data.badge || 'Industrial & IT',
          is_published: data.is_published ?? true,
        });
        setCatUrlInput(data.image_url || '');
      }
    } catch (err) {
      console.error('Error fetching online-ups category:', err);
    }
  }, []);

  // 2. Fetch Online UPS Products
  const fetchUpsProducts = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('products')
        .select(`*, product_images(id, url, display_order)`)
        .in('category_id', ['online-ups', 'small-backups'])
        .order('display_order', { ascending: true });

      if (filterBrand) query = query.eq('brand_id', filterBrand);
      if (filterStatus === 'published') query = query.eq('is_published', true);
      if (filterStatus === 'unpublished') query = query.eq('is_published', false);

      const { data, error } = await query;
      if (!error && data) {
        let filtered = data;
        if (search) {
          const s = search.toLowerCase();
          filtered = filtered.filter(p =>
            p.name.toLowerCase().includes(s) ||
            p.sku?.toLowerCase().includes(s) ||
            p.brand_name?.toLowerCase().includes(s) ||
            p.capacity?.toLowerCase().includes(s)
          );
        }
        setProducts(filtered);
      }
    } catch (err) {
      console.error('Error fetching online UPS products:', err);
    } finally {
      setLoading(false);
    }
  }, [search, filterBrand, filterStatus]);

  useEffect(() => {
    fetchCategoryDetails();
    fetchUpsProducts();

    // Fetch Brands for filter
    supabase
      .from('brands')
      .select('id, name')
      .order('name')
      .then(({ data }) => setBrands(data || []));
  }, [fetchCategoryDetails, fetchUpsProducts]);

  // Toggle publish status for product
  const handleTogglePublish = async (product) => {
    setActionLoading(product.id);
    const updatedStatus = !product.is_published;
    const { error } = await supabase
      .from('products')
      .update({ is_published: updatedStatus, updated_at: new Date().toISOString() })
      .eq('id', product.id);

    if (!error) {
      setProducts(prev => prev.map(p => p.id === product.id ? { ...p, is_published: updatedStatus } : p));
      notifyDataUpdated();
    }
    setActionLoading(null);
  };

  // Delete product
  const handleDeleteProduct = async () => {
    if (!deleteConfirm) return;
    setActionLoading(deleteConfirm.id);
    
    await supabase.from('product_images').delete().eq('product_id', deleteConfirm.id);
    const { error } = await supabase.from('products').delete().eq('id', deleteConfirm.id);

    if (!error) {
      setProducts(prev => prev.filter(p => p.id !== deleteConfirm.id));
      notifyDataUpdated();
    }
    setDeleteConfirm(null);
    setActionLoading(null);
  };

  // Save Category Metadata
  const handleSaveCategory = async (e) => {
    e.preventDefault();
    setCatLoading(true);
    try {
      const payload = {
        name: catForm.name,
        short_desc: catForm.short_desc,
        image_url: catForm.image_url,
        banner_url: catForm.banner_url || catForm.image_url,
        badge: catForm.badge,
        is_published: catForm.is_published,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('categories')
        .update(payload)
        .eq('id', 'online-ups')
        .select()
        .single();

      if (!error && data) {
        setCategoryData(data);
        setIsCatModalOpen(false);
        setSaveSuccessMsg('Online UPS category updated! Live website refreshed.');
        setTimeout(() => setSaveSuccessMsg(''), 4000);
        notifyDataUpdated();
      } else {
        throw error;
      }
    } catch (err) {
      console.error('Error updating online-ups category:', err);
      alert('Failed to save category: ' + (err.message || 'Unknown error'));
    } finally {
      setCatLoading(false);
    }
  };

  const getProductImage = (product) => {
    const imgs = product.product_images || [];
    const sorted = [...imgs].sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));
    return sorted[0]?.url || product.image || product.imageUrl || 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=120&q=80';
  };

  const publishedCount = products.filter(p => p.is_published).length;

  return (
    <div className="space-y-6">
      {/* Top Banner / Header */}
      <div className="bg-gradient-to-r from-[#0f2b48] to-[#1e4e7e] rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg">
                <Zap className="w-6 h-6" />
              </span>
              <h1 className="text-2xl font-black">Online UPS Management</h1>
            </div>
            <p className="text-slate-300 text-sm max-w-2xl">
              Control pure sine wave Online UPS systems, capacities (1kVA–200kVA), pricing, images, and live website synchronization.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setIsCatModalOpen(true)}
              className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white px-3.5 py-2 rounded-xl text-xs font-semibold backdrop-blur-xs transition-colors border border-white/10"
            >
              <Settings className="w-4 h-4 text-emerald-400" />
              Category Settings
            </button>
            <a
              href="/category/online-ups"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white px-3.5 py-2 rounded-xl text-xs font-semibold backdrop-blur-xs transition-colors border border-white/10"
            >
              <ExternalLink className="w-4 h-4 text-sky-400" />
              View Live Page
            </a>
            <Link
              to="/admin/products/new?category=online-ups"
              className="flex items-center gap-1.5 bg-[#16a34a] hover:bg-[#15803d] text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md shadow-green-900/30"
            >
              <Plus className="w-4 h-4" />
              Add Online UPS
            </Link>
          </div>
        </div>

        {/* Quick Stats Strip */}
        <div className="mt-5 pt-4 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-slate-400 block">Total Models</span>
            <span className="text-lg font-bold">{products.length}</span>
          </div>
          <div>
            <span className="text-slate-400 block">Live & Published</span>
            <span className="text-lg font-bold text-emerald-400">{publishedCount}</span>
          </div>
          <div>
            <span className="text-slate-400 block">Draft / Hidden</span>
            <span className="text-lg font-bold text-slate-300">{products.length - publishedCount}</span>
          </div>
          <div>
            <span className="text-slate-400 block">Category Status</span>
            <span className="inline-flex items-center gap-1 text-emerald-300 font-semibold mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Active on Site
            </span>
          </div>
        </div>
      </div>

      {saveSuccessMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
          <Check className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* Online UPS Category Overview Card */}
      {categoryData && (
        <div className="bg-white rounded-2xl shadow-xs border border-slate-100 p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-5 justify-between">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <img
              src={categoryData.image_url || 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=200&q=80'}
              alt={categoryData.name}
              className="w-16 h-16 rounded-xl object-cover border border-slate-200 shadow-xs flex-shrink-0"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-base">{categoryData.name}</h3>
                {categoryData.badge && (
                  <span className="text-[10px] font-bold bg-emerald-100 text-[#16a34a] px-2 py-0.5 rounded-full">
                    {categoryData.badge}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-1 line-clamp-1 max-w-lg">
                {categoryData.short_desc || 'High-grade pure sine wave online UPS for critical IT and industrial loads.'}
              </p>
              <div className="text-[11px] text-slate-400 mt-1">
                Slug: <span className="font-mono text-slate-600">/category/{categoryData.slug}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={() => setIsCatModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 hover:border-[#16a34a] hover:text-[#16a34a] text-slate-700 rounded-lg text-xs font-semibold transition-colors"
            >
              <Edit2 className="w-3.5 h-3.5" />
              Edit Category Info & Image
            </button>
          </div>
        </div>
      )}

      {/* Filters Bar */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-100 p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search Online UPS by model, kVA, brand..."
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-[#16a34a] text-sm"
            />
          </div>

          <select
            value={filterBrand}
            onChange={e => setFilterBrand(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-[#16a34a] text-xs bg-white min-w-[130px]"
          >
            <option value="">All Brands</option>
            {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>

          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-[#16a34a] text-xs bg-white min-w-[120px]"
          >
            <option value="">All Status</option>
            <option value="published">Published</option>
            <option value="unpublished">Draft</option>
          </select>

          <button
            onClick={() => { setSearch(''); setFilterBrand(''); setFilterStatus(''); fetchUpsProducts(); }}
            className="p-2 border border-slate-200 text-slate-500 hover:text-slate-800 rounded-xl text-xs hover:bg-slate-50"
            title="Reset Filters"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Online UPS Products Table */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-4 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Product & Image</th>
                <th className="px-4 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider hidden sm:table-cell">Brand</th>
                <th className="px-4 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider hidden md:table-cell">Capacity / Specs</th>
                <th className="px-4 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider hidden md:table-cell">Price</th>
                <th className="px-4 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3.5 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-4 py-3.5"><div className="flex items-center gap-3"><div className="w-12 h-12 bg-slate-100 rounded-lg" /><div className="space-y-2"><div className="h-4 bg-slate-100 rounded w-32" /><div className="h-3 bg-slate-100 rounded w-20" /></div></div></td>
                    <td className="px-4 py-3.5 hidden sm:table-cell"><div className="h-4 bg-slate-100 rounded w-24" /></td>
                    <td className="px-4 py-3.5 hidden md:table-cell"><div className="h-4 bg-slate-100 rounded w-20" /></td>
                    <td className="px-4 py-3.5 hidden md:table-cell"><div className="h-4 bg-slate-100 rounded w-16" /></td>
                    <td className="px-4 py-3.5"><div className="h-6 bg-slate-100 rounded-full w-20" /></td>
                    <td className="px-4 py-3.5 text-right"><div className="h-8 bg-slate-100 rounded w-20 ml-auto" /></td>
                  </tr>
                ))
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-slate-400">
                    <Zap className="w-10 h-10 mx-auto mb-3 text-slate-300" />
                    <p className="font-semibold text-slate-700">No Online UPS Products Found</p>
                    <p className="text-xs text-slate-400 mt-1">Click "Add Online UPS" above to create your first model.</p>
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <img
                          src={getProductImage(product)}
                          alt={product.name}
                          className="w-12 h-12 rounded-lg object-cover bg-slate-100 flex-shrink-0 border border-slate-100"
                          onError={e => e.target.src = 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=80&q=60'}
                        />
                        <div>
                          <div className="text-sm font-semibold text-slate-800 line-clamp-1">{product.name}</div>
                          <div className="text-xs text-slate-400">{product.sku}</div>
                          {product.is_featured && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded mt-0.5">
                              <Star className="w-2.5 h-2.5" /> Featured
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 hidden sm:table-cell">
                      <span className="text-xs text-slate-700 bg-slate-100 px-2.5 py-1 rounded-full font-medium">
                        {product.brand_name || product.brand_id}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 hidden md:table-cell">
                      <div className="text-xs font-semibold text-slate-700">
                        {product.capacity || '1kVA - 20kVA'}
                      </div>
                      <div className="text-[11px] text-slate-400">{product.voltage || 'Pure Sine Wave'}</div>
                    </td>
                    <td className="px-4 py-3.5 hidden md:table-cell">
                      <div className="text-sm font-bold text-slate-800">
                        ₹{Number(product.price || 0).toLocaleString('en-IN')}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <button
                        onClick={() => handleTogglePublish(product)}
                        disabled={actionLoading === product.id}
                        className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full transition-all ${
                          product.is_published
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                        }`}
                      >
                        {actionLoading === product.id ? (
                          <Loader className="w-3 h-3 animate-spin" />
                        ) : product.is_published ? (
                          <ToggleRight className="w-3.5 h-3.5" />
                        ) : (
                          <ToggleLeft className="w-3.5 h-3.5" />
                        )}
                        {product.is_published ? 'Published' : 'Draft'}
                      </button>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={`/products/${product.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View on website"
                        >
                          <Eye className="w-4 h-4" />
                        </a>
                        <Link
                          to={`/admin/products/${product.id}/edit`}
                          className="p-1.5 text-slate-400 hover:text-[#16a34a] hover:bg-green-50 rounded-lg transition-colors"
                          title="Edit product & images"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => setDeleteConfirm(product)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Category Modal */}
      {isCatModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                <Zap className="w-5 h-5 text-emerald-600" />
                Edit Online UPS Category
              </h3>
              <button
                onClick={() => setIsCatModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Category Title</label>
                <input
                  type="text"
                  value={catForm.name}
                  onChange={e => setCatForm(prev => ({ ...prev, name: e.target.value }))}
                  required
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#16a34a]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Badge</label>
                <input
                  type="text"
                  value={catForm.badge}
                  onChange={e => setCatForm(prev => ({ ...prev, badge: e.target.value }))}
                  placeholder="e.g. Industrial & IT"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#16a34a]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Short Description</label>
                <textarea
                  rows={3}
                  value={catForm.short_desc}
                  onChange={e => setCatForm(prev => ({ ...prev, short_desc: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#16a34a]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Category Image</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="url"
                    value={catUrlInput}
                    onChange={e => setCatUrlInput(e.target.value)}
                    placeholder="Enter Image URL or upload below..."
                    className="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#16a34a]"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (catUrlInput.trim()) {
                        setCatForm(prev => ({ ...prev, image_url: catUrlInput.trim() }));
                      }
                    }}
                    className="px-3 py-2 bg-slate-800 text-white rounded-xl text-xs font-semibold hover:bg-slate-900"
                  >
                    Apply URL
                  </button>
                </div>

                <ImageUpload
                  value={catForm.image_url}
                  onChange={url => {
                    setCatForm(prev => ({ ...prev, image_url: url }));
                    setCatUrlInput(url);
                  }}
                  folder="categories"
                />
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCatModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={catLoading}
                  className="px-5 py-2 bg-[#16a34a] hover:bg-[#15803d] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  {catLoading && <Loader className="w-3.5 h-3.5 animate-spin" />}
                  Save & Sync Live
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={!!deleteConfirm}
        title="Delete Online UPS Product"
        message={`Are you sure you want to delete "${deleteConfirm?.name}"? This will remove the product and its images from the database and live website.`}
        onConfirm={handleDeleteProduct}
        onCancel={() => setDeleteConfirm(null)}
      />
    </div>
  );
}
