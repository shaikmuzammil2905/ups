import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { notifyDataUpdated } from '../lib/syncEvents';
import ImageUpload from './components/ImageUpload';
import ConfirmDialog from './components/ConfirmDialog';
import {
  Plus, Search, Edit2, Trash2, Wrench, Save, X, Loader,
  Check, Clock, IndianRupee, ShieldCheck, Sparkles, ExternalLink,
  Layers, Image as ImageIcon
} from 'lucide-react';
import { SERVICE_CATEGORIES, services as staticServices } from '../data/services';

const DEFAULT_FORM = {
  id: '',
  title: '',
  slug: '',
  category: 'APC UPS AMC SERVICE',
  categoryId: 'apc-ups-amc-service',
  short_desc: '',
  introduction: '',
  badge: 'Certified Specialist',
  price_starts_at: '₹ 1,499',
  turnaround: 'Same Day Service',
  icon: 'Wrench',
  image_url: '/images/services/apc-service-cabinets.jpg',
  range_items: '',
  benefits_items: '',
  features: '',
  display_order: 1,
  is_published: true,
};

export default function ServicesAdmin() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState(DEFAULT_FORM);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  const fetchServices = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error: err } = await supabase
        .from('services')
        .select('*')
        .order('display_order', { ascending: true });

      if (!err && data && data.length > 0) {
        setServices(data);
      } else {
        // Fallback to static services (all 12 services matching images 70-79)
        setServices(staticServices);
      }
    } catch (err) {
      console.warn('Fetch services fallback to static:', err);
      setServices(staticServices);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const showNotification = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3500);
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
    setEditingService(null);
    setFormData({
      ...DEFAULT_FORM,
      display_order: services.length + 1,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (svc) => {
    setEditingService(svc);
    
    const rangeText = Array.isArray(svc.rangeItems)
      ? svc.rangeItems.map(f => typeof f === 'string' ? f : f.title || f.text || '').join('\n')
      : (typeof svc.range_items === 'string' ? svc.range_items : (Array.isArray(svc.range_items) ? svc.range_items.join('\n') : ''));

    const benefitsText = Array.isArray(svc.benefitsItems)
      ? svc.benefitsItems.map(f => typeof f === 'string' ? f : f.title || f.text || '').join('\n')
      : (typeof svc.benefits_items === 'string' ? svc.benefits_items : (Array.isArray(svc.benefits_items) ? svc.benefits_items.join('\n') : ''));

    const featuresText = Array.isArray(svc.features)
      ? svc.features.map(f => typeof f === 'string' ? f : f.title || f.text || '').join('\n')
      : (svc.features || '');

    setFormData({
      ...svc,
      category: svc.category || svc.categoryId || 'APC UPS AMC SERVICE',
      image_url: svc.image_url || svc.imageUrl || svc.image || svc.banner || '',
      range_items: rangeText,
      benefits_items: benefitsText,
      features: featuresText,
    });
    setIsModalOpen(true);
  };

  const handleTitleChange = (e) => {
    const val = e.target.value;
    setFormData(prev => ({
      ...prev,
      title: val,
      slug: !editingService ? handleSlugify(val) : prev.slug,
      id: !editingService ? handleSlugify(val) : prev.id,
    }));
  };

  const handleCategoryChange = (catTitle) => {
    const found = SERVICE_CATEGORIES.find(c => c.title === catTitle || c.id === catTitle);
    setFormData(prev => ({
      ...prev,
      category: catTitle,
      categoryId: found ? found.id : handleSlugify(catTitle)
    }));
  };

  const handleTogglePublish = async (svc) => {
    const updatedStatus = !svc.is_published;
    try {
      await supabase
        .from('services')
        .update({ is_published: updatedStatus, updated_at: new Date().toISOString() })
        .eq('id', svc.id);
    } catch (_) {}

    setServices(prev => prev.map(s => s.id === svc.id ? { ...s, is_published: updatedStatus } : s));
    showNotification(`Service "${svc.title}" ${updatedStatus ? 'published' : 'hidden'}.`);
    notifyDataUpdated({ type: 'SERVICE_UPDATED', serviceId: svc.id });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('Service title is required.');
      return;
    }
    const slug = formData.slug || handleSlugify(formData.title);
    const svcId = formData.id || slug;

    const rangeList = typeof formData.range_items === 'string'
      ? formData.range_items.split('\n').map(s => s.trim()).filter(Boolean)
      : formData.range_items;

    const benefitsList = typeof formData.benefits_items === 'string'
      ? formData.benefits_items.split('\n').map(s => s.trim()).filter(Boolean)
      : formData.benefits_items;

    const featuresList = typeof formData.features === 'string'
      ? formData.features.split('\n').map(s => s.trim()).filter(Boolean)
      : formData.features;

    setFormLoading(true);
    const payload = {
      id: svcId,
      title: formData.title.trim(),
      slug: slug.trim(),
      category: formData.category,
      categoryId: formData.categoryId || handleSlugify(formData.category),
      short_desc: formData.short_desc || '',
      introduction: formData.introduction || '',
      badge: formData.badge || '',
      price_starts_at: formData.price_starts_at || '₹499',
      turnaround: formData.turnaround || 'Same Day',
      icon: formData.icon || 'Wrench',
      image_url: formData.image_url || '',
      image: formData.image_url || '',
      banner: formData.image_url || '',
      range_items: rangeList,
      rangeItems: rangeList,
      benefits_items: benefitsList,
      benefitsItems: benefitsList,
      features: featuresList,
      display_order: parseInt(formData.display_order) || 0,
      is_published: formData.is_published,
      updated_at: new Date().toISOString(),
    };

    try {
      if (editingService) {
        await supabase
          .from('services')
          .update(payload)
          .eq('id', editingService.id);
        
        setServices(prev => prev.map(s => s.id === editingService.id ? { ...s, ...payload } : s));
        showNotification('Service updated successfully!');
      } else {
        await supabase
          .from('services')
          .insert({ ...payload, created_at: new Date().toISOString() });
        
        setServices(prev => [...prev, payload]);
        showNotification('Service created successfully!');
      }

      // Update cached services in localStorage for immediate sync
      try {
        const cached = localStorage.getItem('livkam_cached_services');
        const list = cached ? JSON.parse(cached) : [...services];
        const updatedList = editingService 
          ? list.map(s => s.id === editingService.id ? { ...s, ...payload } : s)
          : [...list, payload];
        localStorage.setItem('livkam_cached_services', JSON.stringify(updatedList));
      } catch (_) {}

      notifyDataUpdated({ type: 'SERVICE_SAVED', serviceId: svcId });
      setIsModalOpen(false);
    } catch (err) {
      console.warn('Save error:', err);
      // Still update local state for the session
      if (editingService) {
        setServices(prev => prev.map(s => s.id === editingService.id ? { ...s, ...payload } : s));
      } else {
        setServices(prev => [...prev, payload]);
      }
      setIsModalOpen(false);
      showNotification('Service saved locally!');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await supabase
        .from('services')
        .delete()
        .eq('id', deleteConfirm.id);
    } catch (_) {}

    setServices(prev => prev.filter(s => s.id !== deleteConfirm.id));
    try {
      const cached = localStorage.getItem('livkam_cached_services');
      if (cached) {
        const list = JSON.parse(cached);
        localStorage.setItem('livkam_cached_services', JSON.stringify(list.filter(s => s.id !== deleteConfirm.id)));
      }
    } catch (_) {}

    showNotification(`Service "${deleteConfirm.title}" deleted.`);
    notifyDataUpdated({ type: 'SERVICE_DELETED', serviceId: deleteConfirm.id });
    setDeleteConfirm(null);
  };

  const filteredServices = services.filter(s => {
    const matchesSearch = s.title?.toLowerCase().includes(search.toLowerCase()) ||
      s.slug?.toLowerCase().includes(search.toLowerCase()) ||
      s.category?.toLowerCase().includes(search.toLowerCase()) ||
      s.badge?.toLowerCase().includes(search.toLowerCase());
    
    if (!matchesSearch) return false;
    if (selectedCategoryFilter === 'all') return true;
    return s.categoryId === selectedCategoryFilter || s.category === selectedCategoryFilter;
  });

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {successMsg && (
        <div className="fixed top-6 right-6 z-50 bg-[#16a34a] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-300 font-bold text-sm">
          <Check className="w-4 h-4" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2.5">
            <Wrench className="w-7 h-7 text-[#16a34a]" />
            Services & AMC Management
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage 8 Service Categories, 12 Catalogues (APC, Vertiv, Delta, Microtek, Eaton, Numeric), equipment photos, range items, and grand level benefits.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#16a34a] hover:bg-green-700 text-white rounded-xl font-bold text-sm shadow-md transition-all self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Service / Catalogue
        </button>
      </div>

      {/* Category Filter Pills & Search */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search services by title, category, brand or badge..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#16a34a]"
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-slate-600 whitespace-nowrap">Filter Category:</label>
            <select
              value={selectedCategoryFilter}
              onChange={(e) => setSelectedCategoryFilter(e.target.value)}
              className="px-3 py-2 text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#16a34a]"
            >
              <option value="all">All Categories ({services.length})</option>
              {SERVICE_CATEGORIES.map(c => (
                <option key={c.id} value={c.title}>{c.title}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Services Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center p-12 text-slate-400 gap-2">
            <Loader className="w-5 h-5 animate-spin" />
            <span className="text-sm">Loading services data...</span>
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Wrench className="w-12 h-12 text-slate-300 mx-auto" />
            <p className="text-slate-500 font-bold text-sm">No services found matching your search</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-[11px] font-black uppercase text-slate-400 tracking-wider">
                  <th className="py-3 px-4">Service / Catalogue</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Badge / Pricing</th>
                  <th className="py-3 px-4">Turnaround</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm font-medium">
                {filteredServices.map((svc) => (
                  <tr key={svc.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex-shrink-0 flex items-center justify-center p-1">
                          <img
                            src={svc.image_url || svc.imageUrl || svc.image || svc.banner || '/images/services/apc-service-cabinets.jpg'}
                            alt={svc.title}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div>
                          <span className="font-bold text-slate-800 block text-sm">{svc.title}</span>
                          <span className="text-[11px] font-mono text-slate-400">/services/{svc.slug}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
                        {svc.category || 'Standard Service'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="text-xs font-bold text-[#16a34a] block">{svc.priceStartsAt || svc.price_starts_at || 'Custom Quote'}</span>
                      <span className="text-[11px] text-slate-400">{svc.badge}</span>
                    </td>

                    <td className="py-3.5 px-4 text-xs text-slate-600">
                      {svc.turnaround || 'Same Day'}
                    </td>

                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleTogglePublish(svc)}
                        className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                          svc.is_published
                            ? 'bg-emerald-50 text-[#16a34a] border border-emerald-200'
                            : 'bg-slate-100 text-slate-400 border border-slate-200'
                        }`}
                      >
                        {svc.is_published ? 'Published' : 'Draft / Hidden'}
                      </button>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/services/${svc.slug}`}
                          target="_blank"
                          title="View on Live Website"
                          className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleOpenEdit(svc)}
                          title="Edit Service"
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(svc)}
                          title="Delete Service"
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
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

      {/* Edit / Create Service Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 p-6 sm:p-8 space-y-6">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-xl font-black text-slate-800">
                  {editingService ? `Edit Service: ${editingService.title}` : 'Add New Service / Catalogue'}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Configure category, title, equipment image, comprehensive range items, and customer benefits.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-5">
              
              {/* Category Dropdown */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Service Category (from Navbar Dropdown) *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:border-[#16a34a]"
                >
                  {SERVICE_CATEGORIES.map(c => (
                    <option key={c.id} value={c.title}>{c.title}</option>
                  ))}
                </select>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Determines which group in the Services navbar dropdown this service appears under.
                </span>
              </div>

              {/* Title & Slug */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Service Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={handleTitleChange}
                    placeholder="e.g. APC UPS Service"
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:border-[#16a34a]"
                  />
                </div>
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
              </div>

              {/* Price, Turnaround, Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Price Starts At
                  </label>
                  <input
                    type="text"
                    value={formData.price_starts_at}
                    onChange={(e) => setFormData({ ...formData, price_starts_at: e.target.value })}
                    placeholder="e.g. ₹ 1,499"
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Turnaround SLA
                  </label>
                  <input
                    type="text"
                    value={formData.turnaround}
                    onChange={(e) => setFormData({ ...formData, turnaround: e.target.value })}
                    placeholder="e.g. Same Day / 2-4 Hours"
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Badge / Tag
                  </label>
                  <input
                    type="text"
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    placeholder="e.g. Authorized Specialist"
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              {/* Image Upload Component */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Service Equipment Photo (Pictorial Representation)
                </label>
                <ImageUpload
                  value={formData.image_url}
                  onChange={(url) => setFormData({ ...formData, image_url: url })}
                  folder="services"
                />
              </div>

              {/* Introduction Text */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Introduction / Summary (Shown at top of Service Page)
                </label>
                <textarea
                  rows={3}
                  value={formData.introduction}
                  onChange={(e) => setFormData({ ...formData, introduction: e.target.value })}
                  placeholder="Livkam Power Technologies is your go-to source for comprehensive..."
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              {/* Comprehensive Range Items (Image Copy 78) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Our Comprehensive Range of Services (One bullet point per line)
                </label>
                <textarea
                  rows={4}
                  value={formData.range_items}
                  onChange={(e) => setFormData({ ...formData, range_items: e.target.value })}
                  placeholder="APC UPS installation and setup, ensuring optimal configuration.&#10;Regular preventive maintenance to keep systems running smoothly.&#10;Troubleshooting and emergency repair services.&#10;System upgrades and replacements."
                  className="w-full px-3.5 py-2.5 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl leading-relaxed"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Displayed alongside the equipment photo in "Our Comprehensive Range of Services" section.
                </span>
              </div>

              {/* Benefits Items (Image Copy 79) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Benefits of Choosing Livkam Power Technologies (One bullet point per line)
                </label>
                <textarea
                  rows={4}
                  value={formData.benefits_items}
                  onChange={(e) => setFormData({ ...formData, benefits_items: e.target.value })}
                  placeholder="Access to a team of experienced professionals with in-depth knowledge.&#10;Reliable and efficient solutions to minimize downtime.&#10;Competitive pricing for top-quality UPS services.&#10;Responsive 24/7 customer support."
                  className="w-full px-3.5 py-2.5 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl leading-relaxed"
                />
              </div>

              {/* Publish & Order */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={formData.is_published}
                    onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                    className="w-4 h-4 text-[#16a34a] rounded"
                  />
                  Published on Live Website
                </label>
                <div className="flex items-center gap-2">
                  <label className="text-xs font-bold text-slate-600 uppercase">Display Order:</label>
                  <input
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: e.target.value })}
                    className="w-20 px-3 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-bold text-sm cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex items-center gap-2 px-6 py-2.5 bg-[#16a34a] hover:bg-green-700 text-white rounded-xl font-bold text-sm shadow-md transition-all disabled:opacity-50 cursor-pointer"
                >
                  {formLoading && <Loader className="w-4 h-4 animate-spin" />}
                  <span>{editingService ? 'Update Service' : 'Create Service'}</span>
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
          title="Delete Service"
          message={`Are you sure you want to delete service "${deleteConfirm.title}"? This action cannot be undone.`}
          confirmText="Yes, Delete Service"
          onConfirm={handleDelete}
          onCancel={() => setDeleteConfirm(null)}
        />
      )}
    </div>
  );
}
