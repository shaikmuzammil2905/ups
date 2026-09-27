import React from 'react';
import { CheckCircle2, X } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Toast() {
  const { toastMessage, hideToast } = useCart();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-20 md:bottom-8 right-4 md:right-8 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="bg-[#0f2b48] text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-slate-700 max-w-sm">
        <CheckCircle2 className="w-5 h-5 text-[#22c55e] flex-shrink-0" />
        <span className="text-xs font-semibold flex-1">{toastMessage}</span>
        <button
          onClick={hideToast}
          className="text-slate-400 hover:text-white p-1 rounded-full"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
