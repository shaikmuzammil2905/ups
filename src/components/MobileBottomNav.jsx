import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, LayoutGrid, Search, ShoppingBag, User } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function MobileBottomNav({ onOpenSearch }) {
  const location = useLocation();
  const { totalItems, openCart } = useCart();
  const { isLoggedIn } = useAuth();

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 py-1.5 px-4 lg:hidden shadow-[0_-4px_12px_rgba(0,0,0,0.06)]">
      <div className="flex items-center justify-around">
        {/* Home */}
        <Link
          to="/"
          className={`flex flex-col items-center py-1 px-2 transition-colors ${
            isActive('/') ? 'text-[#16a34a]' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-semibold mt-1">Home</span>
        </Link>

        {/* Categories */}
        <Link
          to="/categories"
          className={`flex flex-col items-center py-1 px-2 transition-colors ${
            isActive('/categories') || isActive('/category') ? 'text-[#16a34a]' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <LayoutGrid className="w-5 h-5" />
          <span className="text-[10px] font-semibold mt-1">Categories</span>
        </Link>

        {/* Search */}
        <button
          onClick={onOpenSearch}
          className="flex flex-col items-center py-1 px-2 text-slate-500 hover:text-[#16a34a] transition-colors"
        >
          <Search className="w-5 h-5" />
          <span className="text-[10px] font-semibold mt-1">Search</span>
        </button>

        {/* Cart */}
        <button
          onClick={openCart}
          className="relative flex flex-col items-center py-1 px-2 text-slate-500 hover:text-[#16a34a] transition-colors"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5" />
            <span className="absolute -top-1 -right-2 bg-[#16a34a] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {totalItems}
            </span>
          </div>
          <span className="text-[10px] font-semibold mt-1">Cart</span>
        </button>

        {/* Account */}
        <Link
          to="/account"
          className={`relative flex flex-col items-center py-1 px-2 transition-colors ${
            isActive('/account') ? 'text-[#16a34a]' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className="relative">
            <User className="w-5 h-5" />
            {isLoggedIn && (
              <span className="absolute 0 top-0 right-0 w-2 h-2 bg-[#16a34a] rounded-full ring-2 ring-white"></span>
            )}
          </div>
          <span className="text-[10px] font-semibold mt-1">Account</span>
        </Link>
      </div>
    </div>
  );
}
