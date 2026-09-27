import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import ProductImage from './ProductImage';

export default function CartDrawer() {
  const { 
    isCartOpen, 
    closeCart, 
    cartItems, 
    totalItems, 
    subtotal, 
    discount,
    deliveryFee, 
    finalTotal, 
    updateQuantity, 
    removeFromCart 
  } = useCart();
  
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={closeCart}
      />

      {/* Slide-out drawer on right */}
      <div className="fixed inset-y-0 right-0 max-w-md w-full bg-white shadow-2xl flex flex-col justify-between transform transition-transform duration-300 ease-in-out z-50">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#16a34a]" />
            <h2 className="text-base sm:text-lg font-bold text-[#0f2b48]">
              Shopping Cart ({totalItems})
            </h2>
          </div>
          <button 
            onClick={closeCart}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
            aria-label="Close cart drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Alert Bar */}
        <div className="bg-emerald-50 px-4 py-2 text-xs text-emerald-800 border-b border-emerald-100 flex items-center gap-2">
          <Truck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>
            {subtotal >= 10000 
              ? "🎉 You've unlocked FREE Pan-India Express Delivery!" 
              : `Add ₹ ${(10000 - subtotal).toLocaleString('en-IN')} more to unlock FREE Delivery.`}
          </span>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {cartItems.length === 0 ? (
            <div className="py-16 text-center space-y-4">
              <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-800">Your cart is empty</h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Browse our range of Online UPS, SMF & Tubular Batteries, and Inverters.
              </p>
              <Link
                to="/products"
                onClick={closeCart}
                className="inline-flex items-center gap-1.5 bg-[#16a34a] hover:bg-[#15803d] text-white px-5 py-2.5 rounded-full text-xs font-bold transition-all shadow-sm"
              >
                Browse Products
              </Link>
            </div>
          ) : (
            cartItems.map((item) => (
              <div 
                key={item.id} 
                className="flex gap-3.5 p-3 rounded-xl border border-slate-100 bg-slate-50/40 hover:bg-slate-50 transition-colors"
              >
                {/* Product thumbnail */}
                <div className="w-20 h-20 bg-white rounded-lg border border-slate-200 p-1 flex-shrink-0 flex items-center justify-center overflow-hidden">
                  <ProductImage product={item} categorySlug={item.categoryId} className="w-full h-full" />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        {item.brandName || "LIVKAM"}
                      </span>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-slate-400 hover:text-red-600 transition-colors p-0.5"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <Link
                      to={`/products/${item.slug || item.id}`}
                      onClick={closeCart}
                      className="text-xs sm:text-sm font-bold text-[#0f2b48] hover:text-[#16a34a] line-clamp-1"
                    >
                      {item.name}
                    </Link>

                    {item.capacity && (
                      <span className="text-[10px] text-slate-500 font-medium">
                        {item.capacity}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs sm:text-sm font-black text-[#0f2b48]">
                      ₹ {(item.price * item.quantity).toLocaleString('en-IN')}
                    </span>

                    {/* Quantity Controls */}
                    <div className="flex items-center border border-slate-200 rounded-lg bg-white overflow-hidden shadow-2xs">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 hover:bg-slate-100 text-slate-600 transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2.5 text-xs font-bold text-slate-800">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 hover:bg-slate-100 text-slate-600 transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Summary */}
        {cartItems.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-slate-100 bg-white space-y-3">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-800">₹ {subtotal.toLocaleString('en-IN')}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Savings</span>
                  <span>- ₹ {discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-500">
                <span>Delivery</span>
                <span className="font-semibold text-slate-800">
                  {deliveryFee === 0 ? (
                    <span className="text-emerald-600 font-bold uppercase">FREE</span>
                  ) : (
                    `₹ ${deliveryFee.toLocaleString('en-IN')}`
                  )}
                </span>
              </div>
              <div className="flex justify-between text-base font-black text-[#0f2b48] pt-2 border-t border-slate-100">
                <span>Estimated Total</span>
                <span>₹ {finalTotal.toLocaleString('en-IN')}</span>
              </div>
              <p className="text-[10px] text-slate-400 text-right">Includes applicable GST</p>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <Link
                to="/cart"
                onClick={closeCart}
                className="w-full py-2.5 px-3 border-2 border-[#0f2b48] text-[#0f2b48] hover:bg-[#0f2b48] hover:text-white rounded-lg text-xs font-bold text-center transition-colors"
              >
                View Full Cart
              </Link>
              <button
                onClick={() => {
                  closeCart();
                  navigate('/cart?checkout=true');
                }}
                className="w-full py-2.5 px-3 bg-[#16a34a] hover:bg-[#15803d] text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
              >
                <span>Checkout</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>100% Genuine Products • Factory Warranty</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
