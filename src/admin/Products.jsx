import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { uploadToCloudinary } from '../lib/cloudinary';
import ImageUpload from './components/ImageUpload';
import ConfirmDialog from './components/ConfirmDialog';
import {
  Plus, Search, Filter, Edit2, Trash2, Eye, Package, ChevronLeft, ChevronRight,
  Save, X, Check, Upload, Image, Loader, AlertCircle, ArrowUpDown,
  ToggleLeft, ToggleRight, Star
} from 'lucide-react';
import { notifyDataUpdated } from '../lib/syncEvents';

// ─── Products List ───────────────────────────────────────────────────────────
export function ProductsList() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterBrand, setFilterBrand] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    let query = supabase
      .from('products')
      .select(`*, product_images(url, display_order)`)
      .order('display_order', { ascending: true });

    if (filterCategory) query = query.eq('category_id', filterCategory);
    if (filterBrand) query = query.eq('brand_id', filterBrand);
    if (filterStatus === 'published') query = query.eq('is_published', true);
    if (filterStatus === 'unpublished') query = query.eq('is_published', false);

    const { data, error } = await query;
    if (!error) {
      let filtered = data || [];
      if (search) {
        const s = search.toLowerCase();
        filtered = filtered.filter(p =>
          p.name.toLowerCase().includes(s) ||
          p.sku?.toLowerCase().includes(s) ||
          p.brand_name?.toLowerCase().includes(s)
        );
      }
      setProducts(filtered);
    }
    setLoading(false);
  }, [search, filterCategory, filterBrand, filterStatus]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    Promise.all([
      supabase.from('categories').select('id, name').order('name'),
      supabase.from('brands').select('id, name').order('name'),
    ]).then(([cat, bra]) => {
      setCategories(cat.data || []);
      setBrands(bra.data || []);
    });
  }, []);

  const handleTogglePublish = async (product) => {
    setActionLoading(product.id);
    const { error } = await supabase
      .from('products')
      .update({ is_published: !product.is_published })
      .eq('id', product.id);
    if (!error) {
      setProducts(prev => prev.map(p => p.id === product.id ? { ...p, is_published: !p.is_published } : p));
    }
    setActionLoading(null);
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    setActionLoading(deleteConfirm.id);
    
    // Delete product images first
    await supabase.from('product_images').delete().eq('product_id', deleteConfirm.id);
    const { error } = await supabase.from('products').delete().eq('id', deleteConfirm.id);
    
    if (!error) {
      setProducts(prev => prev.filter(p => p.id !== deleteConfirm.id));
    }
    setDeleteConfirm(null);
    setActionLoading(null);
  };

  const getProductImage = (product) => {
    const imgs = product.product_images || [];
    const sorted = [...imgs].sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));
    return sorted[0]?.url || product.image || product.imageUrl || 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=80&q=60';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Products</h1>
          <p className="text-slate-500 text-sm mt-0.5">{products.length} products total</p>
        </div>
        <Link
          to="/admin/products/new"
          className="flex items-center gap-2 bg-[#16a34a] text-white px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#15803d] transition-colors shadow-sm"
        >
          <Plus className="w-4.5 h-4.5" />
          Add Product
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 mb-6">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search products, SKU, brand..."
              className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-[#16a34a] text-sm"
            />
          </div>
          <select
            value={filterCategory}
            onChange={e => setFilterCategory(e.target.value)}
            className="px-3 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-[#16a34a] text-sm bg-white min-w-36"
          >
            <option value="">All Categories</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select
            value={filterBrand}
            onChange={e => setFilterBrand(e.target.value)}
            className="px-3 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-[#16a34a] text-sm bg-white min-w-32"
          >
            <option value="">All Brands</option>
            {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="px-3 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-[#16a34a] text-sm bg-white min-w-32"
          >
            <option value="">All Status</option>
            <option value="published">Published</option>
            <option value="unpublished">Unpublished</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-4 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Product</th>
                <th className="px-4 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider hidden sm:table-cell">Category</th>
                <th className="px-4 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider hidden md:table-cell">Price</th>
                <th className="px-4 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider hidden lg:table-cell">Stock</th>
                <th className="px-4 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3.5 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-4 py-3.5"><div className="flex items-center gap-3"><div className="w-12 h-12 bg-slate-100 rounded-lg" /><div className="space-y-2"><div className="h-4 bg-slate-100 rounded w-32" /><div className="h-3 bg-slate-100 rounded w-20" /></div></div></td>
                    <td className="px-4 py-3.5 hidden sm:table-cell"><div className="h-4 bg-slate-100 rounded w-24" /></td>
                    <td className="px-4 py-3.5 hidden md:table-cell"><div className="h-4 bg-slate-100 rounded w-16" /></td>
                    <td className="px-4 py-3.5 hidden lg:table-cell"><div className="h-4 bg-slate-100 rounded w-12" /></td>
                    <td className="px-4 py-3.5"><div className="h-6 bg-slate-100 rounded-full w-20" /></td>
                    <td className="px-4 py-3.5 text-right"><div className="h-8 bg-slate-100 rounded w-20 ml-auto" /></td>
                  </tr>
                ))
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-slate-400">
                    <Package className="w-10 h-10 mx-auto mb-3 text-slate-300" />
                    <p className="font-medium">No products found</p>
                    <p className="text-sm mt-1">Try adjusting your filters or add a new product</p>
                  </td>
                </tr>
              ) : (
                products.map(product => (
                  <tr key={product.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <img
                          src={getProductImage(product)}
                          alt={product.name}
                          className="w-12 h-12 rounded-lg object-cover bg-slate-100 flex-shrink-0"
                          onError={e => e.target.src = 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=80&q=60'}
                        />
                        <div>
                          <div className="text-sm font-semibold text-slate-800 line-clamp-1">{product.name}</div>
                          <div className="text-xs text-slate-400">{product.sku}</div>
                          {product.is_featured && <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded mt-0.5"><Star className="w-2.5 h-2.5" /> Featured</span>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 hidden sm:table-cell">
                      <span className="text-xs text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full font-medium">{product.category_name}</span>
                    </td>
                    <td className="px-4 py-3.5 hidden md:table-cell">
                      <div className="text-sm font-bold text-slate-800">₹{product.price?.toLocaleString('en-IN')}</div>
                      {product.original_price > product.price && (
                        <div className="text-xs text-slate-400 line-through">₹{product.original_price?.toLocaleString('en-IN')}</div>
                      )}
                    </td>
                    <td className="px-4 py-3.5 hidden lg:table-cell">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${product.in_stock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {product.in_stock ? `${product.stock} in stock` : 'Out of stock'}
                      </span>
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
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => setDeleteConfirm(product)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
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

      <ConfirmDialog
        isOpen={!!deleteConfirm}
        title="Delete Product"
        message={`Are you sure you want to delete "${deleteConfirm?.name}"? This will permanently remove the product and all its images from the database.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteConfirm(null)}
      />
    </div>
  );
}

// ─── Product Form ─────────────────────────────────────────────────────────────
export function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [actualProductId, setActualProductId] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [formData, setFormData] = useState({
    name: '', slug: '', sku: '', brand_id: '', brand_name: '',
    category_id: '', category_name: '', price: '', original_price: '',
    stock: '', in_stock: true, is_featured: false, is_bestseller: false,
    is_published: true, capacity: '', voltage: '', warranty: '',
    short_specs: '', description: '', features: [], specifications: {},
    tags: [], display_order: 0,
  });
  const [images, setImages] = useState([]); // [{id, url, public_id, display_order}]
  const [newImageUrl, setNewImageUrl] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEditing);
  const [errors, setErrors] = useState({});
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Feature/spec editing
  const [newFeature, setNewFeature] = useState('');
  const [newSpecKey, setNewSpecKey] = useState('');
  const [newSpecVal, setNewSpecVal] = useState('');
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    Promise.all([
      supabase.from('categories').select('id, name').order('name'),
      supabase.from('brands').select('id, name').order('name'),
    ]).then(([cat, bra]) => {
      setCategories(cat.data || []);
      setBrands(bra.data || []);
    });

    if (isEditing) {
      setFetchLoading(true);
      setNotFound(false);
      supabase.from('products')
        .select('*, product_images(id, url, public_id, display_order)')
        .or(`id.eq.${id},slug.eq.${id}`)
        .single()
        .then(({ data, error }) => {
          if (error || !data) {
            console.error('Fetch product error:', error);
            setNotFound(true);
          } else {
            setActualProductId(data.id);
            setFormData({
              name: data.name || '',
              slug: data.slug || '',
              sku: data.sku || '',
              brand_id: data.brand_id || '',
              brand_name: data.brand_name || '',
              category_id: data.category_id || '',
              category_name: data.category_name || '',
              price: data.price || '',
              original_price: data.original_price || '',
              stock: data.stock || '',
              in_stock: data.in_stock ?? true,
              is_featured: data.is_featured || false,
              is_bestseller: data.is_bestseller || false,
              is_published: data.is_published ?? true,
              capacity: data.capacity || '',
              voltage: data.voltage || '',
              warranty: data.warranty || '',
              short_specs: data.short_specs || '',
              description: data.description || '',
              features: Array.isArray(data.features) ? data.features : [],
              specifications: data.specifications || {},
              tags: data.tags || [],
              display_order: data.display_order || 0,
            });
            const imgs = (data.product_images || []).sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
            setImages(imgs);
          }
          setFetchLoading(false);
        });
    }
  }, [id, isEditing]);

  const generateSlug = (name) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  };

  const handleChange = (field, value) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      if (field === 'name' && !isEditing) {
        updated.slug = generateSlug(value);
      }
      if (field === 'category_id') {
        const cat = categories.find(c => String(c.id) === String(value));
        updated.category_name = cat?.name || '';
      }
      if (field === 'brand_id') {
        const bra = brands.find(b => String(b.id) === String(value));
        updated.brand_name = bra?.name || '';
      }
      return updated;
    });
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.slug.trim()) newErrors.slug = 'Slug is required';
    if (!formData.price) newErrors.price = 'Price is required';
    if (formData.price < 0) newErrors.price = 'Price must be positive';
    if (!formData.category_id) newErrors.category_id = 'Category is required';
    if (!formData.brand_id) newErrors.brand_id = 'Brand is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageUpload = (url, publicId) => {
    if (!url) return;
    const newImg = {
      id: `temp-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      url,
      public_id: publicId || `img-${Date.now()}`,
      display_order: images.length,
      isNew: true,
    };
    setImages(prev => [...prev, newImg]);
  };

  const handleSetPrimary = (index) => {
    if (index === 0 || index >= images.length) return;
    setImages(prev => {
      const selected = prev[index];
      const rest = prev.filter((_, i) => i !== index);
      return [selected, ...rest];
    });
  };

  const handleMoveImage = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= images.length) return;
    setImages(prev => {
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[targetIndex];
      copy[targetIndex] = temp;
      return copy;
    });
  };

  const handleRemoveImage = (imgId) => {
    setImages(prev => prev.filter(img => img.id !== imgId));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    try {
      const productData = {
        name: formData.name.trim(),
        slug: formData.slug.trim(),
        sku: formData.sku.trim() || null,
        brand_id: formData.brand_id || null,
        brand_name: formData.brand_name,
        category_id: formData.category_id || null,
        category_name: formData.category_name,
        price: parseFloat(formData.price) || 0,
        original_price: parseFloat(formData.original_price) || null,
        stock: parseInt(formData.stock) || 0,
        in_stock: formData.in_stock,
        is_featured: formData.is_featured,
        is_bestseller: formData.is_bestseller,
        is_published: formData.is_published,
        capacity: formData.capacity || null,
        voltage: formData.voltage || null,
        warranty: formData.warranty || null,
        short_specs: formData.short_specs || null,
        description: formData.description || null,
        features: formData.features,
        specifications: formData.specifications,
        tags: formData.tags,
        display_order: parseInt(formData.display_order) || 0,
        updated_at: new Date().toISOString(),
      };

      let targetId = actualProductId || id;

      if (isEditing) {
        const { error } = await supabase.from('products').update(productData).eq('id', targetId);
        if (error) throw error;
      } else {
        productData.id = formData.slug || `prod-${Date.now()}`;
        const { data, error } = await supabase.from('products').insert(productData).select().single();
        if (error) throw error;
        targetId = data.id;
      }

      // ==============================================================
      // 2. Persist Product Images with 100% Integrity
      // (Primary at display_order: 0, Related at 1..N, Order updates & Deletions)
      // ==============================================================
      const { data: dbExistingImgs } = await supabase
        .from('product_images')
        .select('id, url')
        .eq('product_id', targetId);

      const currentNonTempIds = images
        .filter(img => !img.isNew && !String(img.id).startsWith('temp-'))
        .map(img => img.id);

      // A. Delete removed images from DB
      const toDelete = (dbExistingImgs || []).filter(img => !currentNonTempIds.includes(img.id));
      if (toDelete.length > 0) {
        const { error: delErr } = await supabase
          .from('product_images')
          .delete()
          .in('id', toDelete.map(i => i.id));
        if (delErr) console.warn('Error deleting removed images:', delErr);
      }

      // B. Update display_order for retained existing images
      for (let i = 0; i < images.length; i++) {
        const img = images[i];
        if (!img.isNew && !String(img.id).startsWith('temp-')) {
          const { error: upErr } = await supabase
            .from('product_images')
            .update({ display_order: i })
            .eq('id', img.id);
          if (upErr) console.warn(`Error updating image order for ${img.id}:`, upErr);
        }
      }

      // C. Insert new images with their exact display_order
      const newImagesToInsert = images
        .map((img, i) => ({ img, order: i }))
        .filter(({ img }) => img.isNew || String(img.id).startsWith('temp-'));

      if (newImagesToInsert.length > 0) {
        const imageInserts = newImagesToInsert.map(({ img, order }) => ({
          product_id: targetId,
          url: img.url,
          public_id: img.public_id || null,
          display_order: order,
        }));
        const { error: insErr } = await supabase
          .from('product_images')
          .insert(imageInserts);
        if (insErr) throw insErr;
      }

      // 3. Notify real-time / cross-tab synchronization
      notifyDataUpdated({ type: 'PRODUCT_SAVED', productId: targetId });

      setSaveSuccess(true);
      setTimeout(() => {
        navigate('/admin/products');
      }, 1500);
    } catch (err) {
      if (err.code === '23505') {
        setErrors({ slug: 'This slug already exists. Please use a different one.' });
      } else {
        setErrors({ submit: err.message || 'Failed to save product. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="w-8 h-8 text-[#16a34a] animate-spin" />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 bg-white rounded-3xl shadow-sm text-center border border-slate-100">
        <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
        <h2 className="text-xl font-black text-slate-800 mb-2">Product Not Found</h2>
        <p className="text-sm text-slate-500 mb-6">The requested product could not be found in the database.</p>
        <Link to="/admin/products" className="inline-flex items-center gap-2 bg-[#16a34a] text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-[#15803d] shadow-sm">
          <ChevronLeft className="w-4 h-4" />
          Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link
          to="/admin/products"
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ChevronLeft className="w-4.5 h-4.5" />
          <span className="text-sm font-medium">Back to Products</span>
        </Link>
        <div className="h-5 w-px bg-slate-200" />
        <h1 className="text-xl font-black text-slate-800">
          {isEditing ? 'Edit Product' : 'Add New Product'}
        </h1>
      </div>

      {saveSuccess && (
        <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
          <Check className="w-5 h-5 text-green-600" />
          <p className="text-green-700 font-semibold">Product saved successfully! Redirecting...</p>
        </div>
      )}

      {errors.submit && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <p className="text-red-700">{errors.submit}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h2 className="text-base font-bold text-slate-800 mb-4">Basic Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Product Name *</label>
                  <input
                    value={formData.name}
                    onChange={e => handleChange('name', e.target.value)}
                    className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:border-[#16a34a] focus:ring-2 focus:ring-[#16a34a]/20 text-sm ${errors.name ? 'border-red-400' : 'border-gray-200'}`}
                    placeholder="e.g. APC Smart-UPS 1000VA"
                  />
                  {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Slug *</label>
                    <input
                      value={formData.slug}
                      onChange={e => handleChange('slug', generateSlug(e.target.value))}
                      className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:border-[#16a34a] text-sm font-mono ${errors.slug ? 'border-red-400' : 'border-gray-200'}`}
                      placeholder="apc-smart-ups-1000va"
                    />
                    {errors.slug && <p className="text-red-600 text-xs mt-1">{errors.slug}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">SKU</label>
                    <input
                      value={formData.sku}
                      onChange={e => handleChange('sku', e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-[#16a34a] text-sm"
                      placeholder="APC-SMT1000I"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category *</label>
                    <select
                      value={formData.category_id}
                      onChange={e => handleChange('category_id', e.target.value)}
                      className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:border-[#16a34a] text-sm bg-white ${errors.category_id ? 'border-red-400' : 'border-gray-200'}`}
                    >
                      <option value="">Select Category</option>
                      {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    {errors.category_id && <p className="text-red-600 text-xs mt-1">{errors.category_id}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Brand *</label>
                    <select
                      value={formData.brand_id}
                      onChange={e => handleChange('brand_id', e.target.value)}
                      className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:border-[#16a34a] text-sm bg-white ${errors.brand_id ? 'border-red-400' : 'border-gray-200'}`}
                    >
                      <option value="">Select Brand</option>
                      {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                    </select>
                    {errors.brand_id && <p className="text-red-600 text-xs mt-1">{errors.brand_id}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Short Specs</label>
                  <input
                    value={formData.short_specs}
                    onChange={e => handleChange('short_specs', e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-[#16a34a] text-sm"
                    placeholder="1000VA / 700W • Pure Sine Wave • LCD Display"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={e => handleChange('description', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-[#16a34a] text-sm resize-none"
                    placeholder="Detailed product description..."
                  />
                </div>
              </div>
            </div>

            {/* Pricing & Stock */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h2 className="text-base font-bold text-slate-800 mb-4">Pricing & Stock</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Price (₹) *</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={e => handleChange('price', e.target.value)}
                    className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:border-[#16a34a] text-sm ${errors.price ? 'border-red-400' : 'border-gray-200'}`}
                    placeholder="42000"
                    min="0"
                    step="0.01"
                  />
                  {errors.price && <p className="text-red-600 text-xs mt-1">{errors.price}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Original Price (₹)</label>
                  <input
                    type="number"
                    value={formData.original_price}
                    onChange={e => handleChange('original_price', e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-[#16a34a] text-sm"
                    placeholder="49990"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Stock Quantity</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={e => handleChange('stock', e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-[#16a34a] text-sm"
                    placeholder="18"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Display Order</label>
                  <input
                    type="number"
                    value={formData.display_order}
                    onChange={e => handleChange('display_order', e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-[#16a34a] text-sm"
                    min="0"
                  />
                </div>
              </div>
            </div>

            {/* Technical Info */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h2 className="text-base font-bold text-slate-800 mb-4">Technical Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Capacity</label>
                  <input value={formData.capacity} onChange={e => handleChange('capacity', e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-[#16a34a] text-sm" placeholder="1000VA / 700W" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Voltage</label>
                  <input value={formData.voltage} onChange={e => handleChange('voltage', e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-[#16a34a] text-sm" placeholder="230V Pure Sine Wave" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Warranty</label>
                  <input value={formData.warranty} onChange={e => handleChange('warranty', e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-[#16a34a] text-sm" placeholder="2 Years On-Site Comprehensive Warranty" />
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h2 className="text-base font-bold text-slate-800 mb-4">Features</h2>
              <div className="space-y-2 mb-4">
                {formData.features.map((feat, i) => (
                  <div key={i} className="flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-2">
                    <span className="text-sm text-slate-700 flex-1">{feat}</span>
                    <button type="button" onClick={() => handleChange('features', formData.features.filter((_, fi) => fi !== i))} className="text-slate-400 hover:text-red-500">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  value={newFeature}
                  onChange={e => setNewFeature(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); if (newFeature.trim()) { handleChange('features', [...formData.features, newFeature.trim()]); setNewFeature(''); } } }}
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-[#16a34a] text-sm"
                  placeholder="Add a feature and press Enter"
                />
                <button
                  type="button"
                  onClick={() => { if (newFeature.trim()) { handleChange('features', [...formData.features, newFeature.trim()]); setNewFeature(''); } }}
                  className="px-4 py-2.5 bg-[#0f2b48] text-white rounded-xl text-sm font-semibold hover:bg-[#16a34a] transition-colors"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Specifications */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h2 className="text-base font-bold text-slate-800 mb-4">Specifications</h2>
              <div className="space-y-2 mb-4">
                {Object.entries(formData.specifications).map(([key, val]) => (
                  <div key={key} className="flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-2">
                    <span className="text-xs font-bold text-slate-500 w-40 flex-shrink-0">{key}</span>
                    <span className="text-sm text-slate-700 flex-1">{val}</span>
                    <button type="button" onClick={() => {
                      const specs = { ...formData.specifications };
                      delete specs[key];
                      handleChange('specifications', specs);
                    }} className="text-slate-400 hover:text-red-500">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input value={newSpecKey} onChange={e => setNewSpecKey(e.target.value)} className="w-40 px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-[#16a34a] text-sm" placeholder="Spec name" />
                <input value={newSpecVal} onChange={e => setNewSpecVal(e.target.value)} className="flex-1 px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-[#16a34a] text-sm" placeholder="Spec value" />
                <button
                  type="button"
                  onClick={() => {
                    if (newSpecKey.trim() && newSpecVal.trim()) {
                      handleChange('specifications', { ...formData.specifications, [newSpecKey.trim()]: newSpecVal.trim() });
                      setNewSpecKey(''); setNewSpecVal('');
                    }
                  }}
                  className="px-4 py-2.5 bg-[#0f2b48] text-white rounded-xl text-sm font-semibold hover:bg-[#16a34a] transition-colors"
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h2 className="text-base font-bold text-slate-800 mb-4">Status</h2>
              <div className="space-y-3">
                {[
                  { key: 'is_published', label: 'Published', desc: 'Visible on website' },
                  { key: 'in_stock', label: 'In Stock', desc: 'Available to order' },
                  { key: 'is_featured', label: 'Featured', desc: 'Show on homepage' },
                  { key: 'is_bestseller', label: 'Bestseller', desc: 'Show bestseller badge' },
                ].map(toggle => (
                  <label key={toggle.key} className="flex items-center justify-between cursor-pointer">
                    <div>
                      <div className="text-sm font-semibold text-slate-700">{toggle.label}</div>
                      <div className="text-xs text-slate-400">{toggle.desc}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleChange(toggle.key, !formData[toggle.key])}
                      className={`relative w-10 h-6 rounded-full transition-colors flex-shrink-0 ${formData[toggle.key] ? 'bg-[#16a34a]' : 'bg-slate-200'}`}
                    >
                      <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform shadow-sm ${formData[toggle.key] ? 'translate-x-4' : 'translate-x-0'}`} />
                    </button>
                  </label>
                ))}
              </div>
            </div>

            {/* Product Images */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-base font-bold text-slate-800">Product Images</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Image 1 is the <strong>Primary Image</strong> (used across all catalog cards, search & category pages).
                  </p>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full">
                  {images.length} {images.length === 1 ? 'image' : 'images'}
                </span>
              </div>
              
              {images.length > 0 && (
                <div className="space-y-3 mb-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {images.map((img, i) => (
                      <div 
                        key={img.id} 
                        className={`relative rounded-xl overflow-hidden border-2 transition-all p-2 flex flex-col justify-between bg-white ${
                          i === 0 ? 'border-[#16a34a] shadow-sm' : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {/* Image Preview */}
                        <div className="relative aspect-4/3 w-full rounded-lg overflow-hidden bg-slate-50 flex items-center justify-center">
                          <img 
                            src={img.url} 
                            alt={`Product view ${i + 1}`} 
                            className="w-full h-full object-contain" 
                          />
                          {i === 0 ? (
                            <span className="absolute top-2 left-2 flex items-center gap-1 text-[11px] bg-[#16a34a] text-white px-2 py-0.5 rounded-full font-bold shadow">
                              <Star className="w-3 h-3 fill-current" /> Primary
                            </span>
                          ) : (
                            <span className="absolute top-2 left-2 text-[10px] bg-slate-800/80 text-white px-2 py-0.5 rounded-full font-medium">
                              Gallery #{i + 1}
                            </span>
                          )}

                          <button
                            type="button"
                            onClick={() => handleRemoveImage(img.id)}
                            className="absolute top-2 right-2 w-7 h-7 bg-red-600 text-white rounded-full flex items-center justify-center opacity-80 hover:opacity-100 transition-opacity shadow"
                            title="Delete this image"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Controls Bar */}
                        <div className="flex items-center justify-between gap-1 mt-2 pt-2 border-t border-slate-100">
                          {i !== 0 ? (
                            <button
                              type="button"
                              onClick={() => handleSetPrimary(i)}
                              className="text-[11px] font-bold text-[#16a34a] hover:bg-green-50 px-2 py-1 rounded transition-colors flex items-center gap-1"
                              title="Make this the main product image"
                            >
                              <Star className="w-3 h-3" /> Set Primary
                            </button>
                          ) : (
                            <span className="text-[11px] font-bold text-[#16a34a] px-2 py-1 flex items-center gap-1">
                              <Check className="w-3.5 h-3.5" /> Main Image
                            </span>
                          )}

                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              disabled={i === 0}
                              onClick={() => handleMoveImage(i, -1)}
                              className="p-1 rounded text-slate-500 hover:text-slate-800 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent"
                              title="Move left / up in gallery"
                            >
                              <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              disabled={i === images.length - 1}
                              onClick={() => handleMoveImage(i, 1)}
                              className="p-1 rounded text-slate-500 hover:text-slate-800 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent"
                              title="Move right / down in gallery"
                            >
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upload New Image */}
              <div className="space-y-3">
                <ImageUpload
                  value=""
                  onChange={handleImageUpload}
                  folder="livkam/products"
                  label={images.length === 0 ? "Upload Primary Image" : "Add Another Image"}
                  aspectRatio="4/3"
                />

                {/* Paste URL option */}
                <div className="flex gap-2 pt-1">
                  <input
                    type="url"
                    value={urlInput}
                    onChange={e => setUrlInput(e.target.value)}
                    placeholder="Or paste an image URL (https://...)"
                    className="flex-1 px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-[#16a34a]"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (urlInput.trim()) {
                        handleImageUpload(urlInput.trim(), `url-${Date.now()}`);
                        setUrlInput('');
                      }
                    }}
                    className="px-3.5 py-2 bg-slate-800 text-white rounded-xl text-xs font-semibold hover:bg-slate-700 transition-colors flex-shrink-0"
                  >
                    Add URL
                  </button>
                </div>
              </div>
              
              <p className="text-xs text-slate-400 mt-3">
                Tip: Click <strong>Set Primary</strong> to change which image appears on website cards. Use arrows to reorder gallery pictures.
              </p>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center gap-4 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-[#16a34a] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#15803d] transition-colors shadow-sm disabled:opacity-70"
          >
            {loading ? <Loader className="w-4.5 h-4.5 animate-spin" /> : <Save className="w-4.5 h-4.5" />}
            {loading ? 'Saving...' : isEditing ? 'Update Product' : 'Create Product'}
          </button>
          <Link to="/admin/products" className="px-6 py-3 border border-slate-200 text-slate-600 rounded-xl font-semibold hover:bg-slate-50 transition-colors">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
