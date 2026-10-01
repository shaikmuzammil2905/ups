import React, { useState, useRef } from 'react';
import { Upload, X, Image, Loader, RefreshCw } from 'lucide-react';
import { uploadToCloudinary } from '../../lib/cloudinary';

/**
 * Reusable image upload component with Cloudinary integration
 * Props:
 * - value: current image URL
 * - onChange: (url, publicId) => void
 * - folder: Cloudinary folder name
 * - label: label text
 * - aspectRatio: CSS aspect-ratio value (default: 'video')
 */
export default function ImageUpload({ value, onChange, folder = 'livkam', label = 'Upload Image', aspectRatio = '4/3' }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef(null);

  const handleFile = async (file) => {
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (JPG, PNG, WebP, etc.)');
      return;
    }
    
    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('Image size must be less than 10MB');
      return;
    }

    setError('');
    setUploading(true);
    
    try {
      const { url, publicId } = await uploadToCloudinary(file, folder);
      onChange(url, publicId);
    } catch (err) {
      setError(err.message || 'Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    // Reset input
    e.target.value = '';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleRemove = () => {
    onChange('', '');
  };

  return (
    <div className="space-y-2">
      {label && <label className="block text-sm font-semibold text-gray-700">{label}</label>}
      
      {value ? (
        <div className="relative group rounded-xl overflow-hidden border border-gray-200 bg-gray-50" style={{ aspectRatio }}>
          <img src={value} alt="Preview" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="bg-white text-gray-800 px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 hover:bg-gray-100 transition-colors shadow"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Replace
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="bg-red-500 text-white px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 hover:bg-red-600 transition-colors shadow"
            >
              <X className="w-3.5 h-3.5" />
              Remove
            </button>
          </div>
          {uploading && (
            <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
              <Loader className="w-6 h-6 text-[#16a34a] animate-spin" />
            </div>
          )}
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`relative cursor-pointer rounded-xl border-2 border-dashed transition-all flex flex-col items-center justify-center gap-3 p-8 ${
            dragOver
              ? 'border-[#16a34a] bg-green-50'
              : 'border-gray-200 hover:border-[#16a34a] hover:bg-gray-50'
          }`}
          style={{ minHeight: '160px' }}
        >
          {uploading ? (
            <>
              <Loader className="w-8 h-8 text-[#16a34a] animate-spin" />
              <p className="text-sm text-gray-500 font-medium">Uploading Image...</p>
            </>
          ) : (
            <>
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                <Image className="w-6 h-6 text-gray-400" />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-gray-700">
                  {dragOver ? 'Drop image here' : 'Click or drag to upload'}
                </p>
                <p className="text-xs text-gray-400 mt-1">JPG, PNG, WebP up to 10MB</p>
              </div>
              <div className="flex items-center gap-2 bg-[#0f2b48] text-white px-4 py-2 rounded-lg text-xs font-semibold">
                <Upload className="w-3.5 h-3.5" />
                Choose Image
              </div>
            </>
          )}
        </div>
      )}

      {error && (
        <p className="text-red-600 text-xs flex items-center gap-1.5">
          <X className="w-3.5 h-3.5 flex-shrink-0" />
          {error}
        </p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        className="hidden"
      />
    </div>
  );
}
