import React, { useState, useEffect } from 'react';
import { uploadToCloudinary } from '../lib/cloudinary';
import { supabase } from '../lib/supabase';
import {
  Image as ImageIcon, Upload, Search, Copy, Check, Trash2,
  ExternalLink, Loader, Eye, RefreshCw, Sparkles, Filter
} from 'lucide-react';

export default function MediaLibraryAdmin() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(null);
  const [search, setSearch] = useState('');
  const [filterFolder, setFilterFolder] = useState('');
  const [previewImage, setPreviewImage] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(null);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      // Gather images from product_images, categories, brands, services, advertisements
      const [
        { data: prodImgs },
        { data: catImgs },
        { data: brandImgs },
        { data: svcImgs },
        { data: adImgs },
      ] = await Promise.all([
        supabase.from('product_images').select('url, created_at'),
        supabase.from('categories').select('image_url, banner_url, name'),
        supabase.from('brands').select('banner_url, name'),
        supabase.from('services').select('image_url, title'),
        supabase.from('advertisements').select('image_url, title'),
      ]);

      const list = [];
      const seen = new Set();

      const addImg = (url, label, folder) => {
        if (!url || seen.has(url)) return;
        seen.add(url);
        list.push({
          url,
          label: label || 'Media Asset',
          folder: folder || 'general',
          created_at: new Date().toISOString(),
        });
      };

      (prodImgs || []).forEach(p => addImg(p.url, 'Product Image', 'products'));
      (catImgs || []).forEach(c => {
        addImg(c.image_url, `${c.name} Icon`, 'categories');
        addImg(c.banner_url, `${c.name} Banner`, 'categories');
      });
      (brandImgs || []).forEach(b => addImg(b.banner_url, `${b.name} Logo`, 'brands'));
      (svcImgs || []).forEach(s => addImg(s.image_url, `${s.title}`, 'services'));
      (adImgs || []).forEach(a => addImg(a.image_url, `${a.title}`, 'banners'));

      setImages(list);
    } catch (err) {
      console.error('Fetch media error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadProgress('Uploading to Cloudinary...');
    try {
      const folderName = filterFolder || 'uploads';
      const uploadedUrl = await uploadToCloudinary(file, folderName);
      setImages(prev => [
        {
          url: uploadedUrl,
          label: file.name,
          folder: folderName,
          created_at: new Date().toISOString(),
        },
        ...prev,
      ]);
      setUploadProgress(null);
    } catch (err) {
      alert(`Upload failed: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleCopy = (url) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2500);
  };

  const filteredImages = images.filter(img => {
    const matchesSearch = img.label?.toLowerCase().includes(search.toLowerCase()) || img.url?.toLowerCase().includes(search.toLowerCase());
    const matchesFolder = filterFolder ? img.folder === filterFolder : true;
    return matchesSearch && matchesFolder;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2.5">
            <ImageIcon className="w-7 h-7 text-[#16a34a]" />
            Media & Cloudinary Asset Hub
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Cloudinary cloud: <span className="font-mono text-slate-700 font-bold">fgognhhy</span> | Upload preset: <span className="font-mono text-slate-700 font-bold">ml_default</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 px-4 py-2.5 bg-[#16a34a] hover:bg-green-700 text-white rounded-xl font-bold text-sm shadow-md transition-all cursor-pointer">
            {uploading ? <Loader className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            <span>{uploading ? 'Uploading...' : 'Upload Image'}</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              disabled={uploading}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {uploadProgress && (
        <div className="p-3 bg-blue-50 text-blue-700 border border-blue-200 rounded-xl text-xs font-semibold animate-pulse flex items-center gap-2">
          <Loader className="w-4 h-4 animate-spin" />
          {uploadProgress}
        </div>
      )}

      {/* Filters Bar */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search images..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#16a34a]"
          />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={filterFolder}
            onChange={(e) => setFilterFolder(e.target.value)}
            className="px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#16a34a]"
          >
            <option value="">All Folders</option>
            <option value="products">Products</option>
            <option value="categories">Categories</option>
            <option value="brands">Brands</option>
            <option value="services">Services</option>
            <option value="banners">Banners & Ads</option>
            <option value="uploads">Uploads</option>
          </select>
          <button
            onClick={fetchMedia}
            title="Refresh Media"
            className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Images Grid */}
      {loading ? (
        <div className="p-16 text-center text-slate-400 bg-white rounded-2xl border border-slate-100">
          <Loader className="w-8 h-8 animate-spin mx-auto mb-2 text-[#16a34a]" />
          Scanning database media assets...
        </div>
      ) : filteredImages.length === 0 ? (
        <div className="p-16 text-center text-slate-400 bg-white rounded-2xl border border-slate-100">
          <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="font-semibold text-slate-700">No media found</p>
          <p className="text-xs text-slate-400 mt-1">Upload an image to start populating your media gallery.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredImages.map((img, i) => (
            <div
              key={i}
              className="group bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col"
            >
              <div
                onClick={() => setPreviewImage(img)}
                className="aspect-square bg-slate-100 relative overflow-hidden cursor-pointer flex items-center justify-center p-2"
              >
                <img
                  src={img.url}
                  alt={img.label}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Eye className="w-5 h-5 text-white" />
                </div>
              </div>

              <div className="p-3 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-800 truncate" title={img.label}>
                    {img.label}
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-slate-100 text-slate-500">
                    {img.folder}
                  </span>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => handleCopy(img.url)}
                    className="flex items-center gap-1 text-[11px] font-semibold text-slate-600 hover:text-[#16a34a] transition-colors"
                  >
                    {copiedUrl === img.url ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#16a34a]" />
                        <span className="text-[#16a34a]">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy URL</span>
                      </>
                    )}
                  </button>
                  <a
                    href={img.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Image Preview Modal */}
      {previewImage && (
        <div
          onClick={() => setPreviewImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-2xl w-full p-4 overflow-hidden shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-700 truncate">{previewImage.label}</span>
              <button
                onClick={() => setPreviewImage(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-xl"
              >
                ✕
              </button>
            </div>
            <div className="max-h-[60vh] flex items-center justify-center bg-slate-50 rounded-2xl p-4">
              <img
                src={previewImage.url}
                alt=""
                className="max-h-[55vh] max-w-full object-contain rounded-xl"
              />
            </div>
            <div className="flex items-center justify-between pt-2">
              <input
                type="text"
                readOnly
                value={previewImage.url}
                className="flex-1 mr-3 px-3 py-1.5 bg-slate-100 text-xs font-mono rounded-xl border border-slate-200 text-slate-600 select-all"
              />
              <button
                onClick={() => handleCopy(previewImage.url)}
                className="px-4 py-1.5 bg-[#16a34a] text-white rounded-xl text-xs font-bold shadow-sm"
              >
                {copiedUrl === previewImage.url ? 'Copied!' : 'Copy Link'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
