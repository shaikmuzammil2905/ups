import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-20 h-20 bg-emerald-50 text-[#16a34a] rounded-full flex items-center justify-center mb-4">
        <Zap className="w-10 h-10" />
      </div>
      <h1 className="text-4xl font-black text-[#0f2b48] mb-2">404 - Page Not Found</h1>
      <p className="text-sm text-slate-500 max-w-md mb-6">
        The power solution page or product route you are looking for might have been moved or does not exist.
      </p>
      <div className="flex gap-3">
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-[#16a34a] hover:bg-[#15803d] text-white px-6 py-3 rounded-full text-xs font-bold transition-all shadow-md"
        >
          <Home className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 bg-[#0f2b48] text-white px-6 py-3 rounded-full text-xs font-bold transition-all"
        >
          <span>Browse Products</span>
        </Link>
      </div>
    </div>
  );
}
