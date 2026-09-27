import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  ShieldCheck, 
  Truck, 
  Check, 
  CheckCircle2, 
  Lock, 
  Percent, 
  CreditCard, 
  Banknote, 
  Zap,
  ChevronRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import ProductImage from '../components/ProductImage';

export default function Cart() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { 
    cartItems, 
    totalItems, 
    subtotal, 
    discount, 
    deliveryFee, 
    gstAmount, 
    finalTotal, 
    updateQuantity, 
    removeFromCart, 
    clearCart 
  } = useCart();

  const { user, isLoggedIn, addOrder } = useAuth();

  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Checkout form
  const [shippingData, setShippingData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560070',
    gstin: user?.gstin || '',
    paymentMethod: 'UPI'
  });

  const [orderPlaced, setOrderPlaced] = useState(null);

  // Auto-open checkout if ?checkout=true in URL
  useEffect(() => {
    if (searchParams.get('checkout') === 'true' && cartItems.length > 0) {
      setIsCheckoutOpen(true);
    }
  }, [searchParams, cartItems]);

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'LIVKAM500' || promoCode.trim().toUpperCase() === 'POWERSAVE') {
      setPromoDiscount(500);
      setPromoApplied(true);
    } else {
      alert('Invalid promo code. Try "LIVKAM500"');
    }
  };

  const grandTotal = Math.max(0, finalTotal - promoDiscount);

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    const newOrder = addOrder({
      items: [...cartItems],
      subtotal,
      discount: discount + promoDiscount,
      total: grandTotal,
      shippingAddress: `${shippingData.address}, ${shippingData.city}, ${shippingData.state} - ${shippingData.pincode}`,
      recipientName: shippingData.name,
      recipientPhone: shippingData.phone,
      gstin: shippingData.gstin,
      paymentMethod: shippingData.paymentMethod
    });

    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {}

    setOrderPlaced(newOrder);
    clearCart();
    setIsCheckoutOpen(false);
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-[#f8fafc] py-12 px-4 max-w-3xl mx-auto text-center space-y-6">
        <div className="bg-white rounded-3xl p-8 md:p-12 border border-slate-200/80 shadow-lg space-y-6">
          <div className="w-20 h-20 rounded-full bg-emerald-100 text-[#16a34a] flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-12 h-12" />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider bg-emerald-50 text-[#16a34a] px-3 py-1 rounded-full">
              Order Confirmed & Logged
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-[#0f2b48] mt-2">
              Thank You for Your Order!
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Your Order Reference: <span className="font-mono font-bold text-slate-800">{orderPlaced.id}</span>
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl text-left text-xs space-y-2 border border-slate-100">
            <div className="flex justify-between font-bold text-slate-700">
              <span>Delivery To:</span>
              <span>{orderPlaced.recipientName} ({orderPlaced.recipientPhone})</span>
            </div>
            <p className="text-slate-500">{orderPlaced.shippingAddress}</p>
            <div className="pt-2 border-t flex justify-between font-bold text-slate-800">
              <span>Total Amount:</span>
              <span className="text-[#16a34a] text-sm font-black">₹ {orderPlaced.total.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/account"
              className="w-full sm:w-auto bg-[#0f2b48] hover:bg-[#1a3d60] text-white px-6 py-3 rounded-xl text-xs font-bold transition-all"
            >
              View in Account Orders
            </Link>
            <Link
              to="/products"
              className="w-full sm:w-auto bg-[#16a34a] hover:bg-[#15803d] text-white px-6 py-3 rounded-xl text-xs font-bold transition-all"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500 mb-6 font-medium">
        <Link to="/" className="hover:text-[#16a34a]">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-[#0f2b48] font-bold">Shopping Cart</span>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-black text-[#0f2b48]">
          Shopping Cart ({totalItems} Items)
        </h1>
      </div>

      {cartItems.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs space-y-5 max-w-xl mx-auto my-8">
          <div className="w-20 h-20 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h2 className="text-xl font-bold text-slate-800">Your shopping cart is empty</h2>
          <p className="text-xs text-slate-500">
            Explore authentic APC Online UPS, Luminous Inverters, Exide Batteries, and more with Pan-India delivery.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-[#16a34a] hover:bg-[#15803d] text-white px-6 py-3 rounded-full text-xs font-bold transition-all shadow-md"
          >
            <span>Browse Products</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Cart Items List */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50/70 border border-slate-100"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 bg-white rounded-xl border border-slate-200 p-1 flex-shrink-0 flex items-center justify-center">
                      <ProductImage product={item} categorySlug={item.categoryId} className="w-full h-full" />
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        {item.brandName}
                      </span>
                      <Link
                        to={`/products/${item.slug || item.id}`}
                        className="text-sm font-bold text-[#0f2b48] hover:text-[#16a34a] block line-clamp-1"
                      >
                        {item.name}
                      </Link>
                      {item.capacity && (
                        <span className="text-xs text-slate-500">{item.capacity}</span>
                      )}
                      <span className="text-xs font-black text-[#0f2b48] block sm:hidden mt-1">
                        ₹ {item.price.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {/* Quantity and Price */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200">
                    <div className="flex items-center border border-slate-200 rounded-lg bg-white">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-l-lg"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 text-xs font-bold text-slate-800">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-r-lg"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <span className="text-sm font-black text-[#0f2b48] hidden sm:inline">
                      ₹ {(item.price * item.quantity).toLocaleString('en-IN')}
                    </span>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-slate-400 hover:text-red-600 p-1"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Delivery Perks */}
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between text-xs text-emerald-900">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-emerald-600" />
                <span className="font-semibold">Fast Bangalore Express & Pan-India Insured Dispatch</span>
              </div>
              <span className="font-bold uppercase text-[10px] bg-emerald-200 px-2 py-0.5 rounded">
                Verified
              </span>
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-4 space-y-4 sticky top-28">
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-5">
              <h2 className="text-base font-bold text-[#0f2b48]">Order Summary</h2>

              {/* Promo Code Form */}
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Coupon (e.g. LIVKAM500)"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl uppercase font-bold"
                />
                <button
                  type="submit"
                  className="bg-[#0f2b48] hover:bg-[#1a3d60] text-white px-3.5 py-2.5 rounded-xl text-xs font-bold flex-shrink-0"
                >
                  Apply
                </button>
              </form>

              {promoApplied && (
                <div className="text-xs text-emerald-700 bg-emerald-50 p-2 rounded-lg font-semibold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Coupon Applied (-₹500)
                </div>
              )}

              {/* Breakdown */}
              <div className="space-y-2 text-xs pt-2 border-t border-slate-100">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-800">₹ {subtotal.toLocaleString('en-IN')}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>Discount</span>
                    <span>- ₹ {discount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                {promoDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>Coupon Discount</span>
                    <span>- ₹ {promoDiscount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="flex justify-between text-slate-500">
                  <span>Pan-India Delivery</span>
                  <span className="font-semibold text-slate-800">
                    {deliveryFee === 0 ? <span className="text-emerald-600 font-bold">FREE</span> : `₹ ${deliveryFee}`}
                  </span>
                </div>

                <div className="flex justify-between text-slate-400 text-[11px]">
                  <span>GST Portion (18%)</span>
                  <span>₹ {gstAmount.toLocaleString('en-IN')}</span>
                </div>

                <div className="flex justify-between text-base font-black text-[#0f2b48] pt-3 border-t border-slate-200">
                  <span>Total Payable</span>
                  <span className="text-lg text-[#16a34a]">₹ {grandTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <button
                onClick={() => setIsCheckoutOpen(true)}
                className="w-full py-3.5 bg-[#16a34a] hover:bg-[#15803d] active:scale-98 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all"
              >
                <Lock className="w-4 h-4" />
                <span>Proceed to Secure Checkout</span>
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Official OEM Invoices with GST Input Credit</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* CHECKOUT MODAL */}
      {/* ============================================================ */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            onClick={() => setIsCheckoutOpen(false)}
          />

          <div className="min-h-screen px-4 text-center flex items-center justify-center py-10">
            <div className="relative inline-block w-full max-w-xl bg-white rounded-3xl shadow-2xl text-left overflow-hidden z-50 p-6 md:p-8 border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
              <h2 className="text-xl font-black text-[#0f2b48] mb-1">
                Complete Your Power Order
              </h2>
              <p className="text-xs text-slate-500 mb-6 font-medium">
                Enter shipping details for doorstep dispatch from our Bengaluru warehouse.
              </p>

              <form onSubmit={handlePlaceOrder} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="Receiver Name"
                      value={shippingData.name}
                      onChange={(e) => setShippingData({ ...shippingData, name: e.target.value })}
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-[#16a34a]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 9876543210"
                      value={shippingData.phone}
                      onChange={(e) => setShippingData({ ...shippingData, phone: e.target.value })}
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-[#16a34a]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Delivery Address *</label>
                  <input
                    type="text"
                    required
                    placeholder="Door / Flat No, Street, Building Name"
                    value={shippingData.address}
                    onChange={(e) => setShippingData({ ...shippingData, address: e.target.value })}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-[#16a34a]"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">City</label>
                    <input
                      type="text"
                      required
                      value={shippingData.city}
                      onChange={(e) => setShippingData({ ...shippingData, city: e.target.value })}
                      className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">State</label>
                    <input
                      type="text"
                      required
                      value={shippingData.state}
                      onChange={(e) => setShippingData({ ...shippingData, state: e.target.value })}
                      className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Pincode</label>
                    <input
                      type="text"
                      required
                      value={shippingData.pincode}
                      onChange={(e) => setShippingData({ ...shippingData, pincode: e.target.value })}
                      className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">GSTIN (Optional for Business ITC)</label>
                  <input
                    type="text"
                    placeholder="29AAAAA0000A1Z5"
                    value={shippingData.gstin}
                    onChange={(e) => setShippingData({ ...shippingData, gstin: e.target.value })}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl uppercase font-mono"
                  />
                </div>

                {/* Payment method */}
                <div className="space-y-2 pt-2">
                  <span className="text-xs font-bold text-slate-700 block">Payment Method</span>
                  <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                    <label className={`p-3 rounded-xl border flex items-center gap-2 cursor-pointer ${shippingData.paymentMethod === 'UPI' ? 'border-[#16a34a] bg-emerald-50 text-[#16a34a]' : 'border-slate-200 text-slate-700'}`}>
                      <input
                        type="radio"
                        name="payment"
                        checked={shippingData.paymentMethod === 'UPI'}
                        onChange={() => setShippingData({ ...shippingData, paymentMethod: 'UPI' })}
                        className="hidden"
                      />
                      <CreditCard className="w-4 h-4" />
                      <span>UPI / Net Banking</span>
                    </label>

                    <label className={`p-3 rounded-xl border flex items-center gap-2 cursor-pointer ${shippingData.paymentMethod === 'COD' ? 'border-[#16a34a] bg-emerald-50 text-[#16a34a]' : 'border-slate-200 text-slate-700'}`}>
                      <input
                        type="radio"
                        name="payment"
                        checked={shippingData.paymentMethod === 'COD'}
                        onChange={() => setShippingData({ ...shippingData, paymentMethod: 'COD' })}
                        className="hidden"
                      />
                      <Banknote className="w-4 h-4" />
                      <span>Pay on Delivery / COD</span>
                    </label>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-slate-100">
                  <div>
                    <span className="text-xs text-slate-400 block">Final Amount</span>
                    <span className="text-lg font-black text-[#16a34a]">₹ {grandTotal.toLocaleString('en-IN')}</span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setIsCheckoutOpen(false)}
                      className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-[#16a34a] hover:bg-[#15803d] text-white rounded-xl text-xs font-bold shadow-md"
                    >
                      Confirm Order
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
