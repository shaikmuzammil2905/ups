import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  User, 
  Package, 
  Heart, 
  MapPin, 
  LogOut, 
  ChevronRight, 
  ShoppingBag, 
  CheckCircle2, 
  Clock, 
  ShieldCheck,
  Building2,
  Lock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/DataContext';
import ProductCard from '../components/ProductCard';

export default function Account() {
  const products = useProducts();
  const { user, isLoggedIn, login, register, logout, wishlist, orders } = useAuth();
  const { addToCart } = useCart();

  const [activeTab, setActiveTab] = useState('orders');
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [gstin, setGstin] = useState('');

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    login(email, password);
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    register({ name, email, phone, company, gstin });
  };

  // Wishlist products
  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#f8fafc] py-12 px-4 sm:px-6 lg:px-8 max-w-lg mx-auto">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-md space-y-6">
          <div className="text-center space-y-1">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#16a34a] flex items-center justify-center mx-auto mb-2">
              <User className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-black text-[#0f2b48]">
              {authMode === 'login' ? 'Customer Login' : 'Create Livkam Account'}
            </h1>
            <p className="text-xs text-slate-500">
              Access your order history, GST invoices, warranty status, and saved addresses.
            </p>
          </div>

          {/* Toggle Login / Register */}
          <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl text-xs font-bold">
            <button
              onClick={() => setAuthMode('login')}
              className={`py-2 rounded-lg transition-all ${
                authMode === 'login' ? 'bg-white text-[#0f2b48] shadow-xs' : 'text-slate-500'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setAuthMode('register')}
              className={`py-2 rounded-lg transition-all ${
                authMode === 'register' ? 'bg-white text-[#0f2b48] shadow-xs' : 'text-slate-500'
              }`}
            >
              Register New
            </button>
          </div>

          {authMode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="client@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-[#16a34a]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-[#16a34a]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#16a34a] hover:bg-[#15803d] text-white rounded-xl text-xs font-bold shadow-md transition-all"
              >
                Sign In to Account
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="name@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 8884988990"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Company / Organization (Optional)</label>
                <input
                  type="text"
                  placeholder="Enterprise or Business Name"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">GSTIN (For B2B Tax Invoicing)</label>
                <input
                  type="text"
                  placeholder="29CYMPN3694M1ZC"
                  value={gstin}
                  onChange={(e) => setGstin(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl uppercase font-mono"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#16a34a] hover:bg-[#15803d] text-white rounded-xl text-xs font-bold shadow-md transition-all mt-2"
              >
                Complete Registration
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
        <Link to="/" className="hover:text-[#16a34a]">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-[#0f2b48] font-bold">Customer Dashboard</span>
      </div>

      {/* Profile Overview Card */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 text-center md:text-left">
          <div className="w-16 h-16 rounded-full bg-[#0f2b48] text-white font-black text-xl flex items-center justify-center shadow-sm">
            {user.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-[#0f2b48]">
              Welcome, {user.name}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">{user.email} • {user.phone}</p>
            {user.company && (
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full inline-block mt-1">
                {user.company} {user.gstin ? `(GSTIN: ${user.gstin})` : ''}
              </span>
            )}
          </div>
        </div>

        <button
          onClick={logout}
          className="flex items-center gap-2 text-xs font-bold text-red-600 hover:bg-red-50 border border-red-200 px-4 py-2 rounded-xl transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Tabs Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Sidebar Tabs */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200/80 p-3 shadow-xs space-y-1">
          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'orders' ? 'bg-[#16a34a] text-white shadow-xs' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Package className="w-4 h-4" />
              <span>Order History</span>
            </div>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${activeTab === 'orders' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'}`}>
              {orders.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('wishlist')}
            className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'wishlist' ? 'bg-[#16a34a] text-white shadow-xs' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Heart className="w-4 h-4" />
              <span>Saved Wishlist</span>
            </div>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${activeTab === 'wishlist' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'}`}>
              {wishlist.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('addresses')}
            className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'addresses' ? 'bg-[#16a34a] text-white shadow-xs' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4" />
              <span>Saved Addresses</span>
            </div>
          </button>
        </div>

        {/* Tab Content */}
        <div className="lg:col-span-9 space-y-6">
          {/* 1. Orders Tab */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-[#0f2b48]">Recent Equipment Orders</h2>
              {orders.length === 0 ? (
                <div className="bg-white rounded-2xl p-10 text-center border border-slate-200">
                  <p className="text-xs text-slate-500">No orders placed yet.</p>
                </div>
              ) : (
                orders.map((order) => (
                  <div key={order.id} className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100 text-xs">
                      <div>
                        <span className="text-slate-400 font-medium">Order ID: </span>
                        <span className="font-mono font-bold text-[#0f2b48]">{order.id}</span>
                        <span className="text-slate-400 ml-3">Placed on {order.date}</span>
                      </div>
                      <span className="bg-emerald-50 text-[#16a34a] font-bold px-3 py-1 rounded-full text-[11px] flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> {order.status}
                      </span>
                    </div>

                    <div className="space-y-2">
                      {order.items?.map((it, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs py-1">
                          <span className="font-bold text-slate-800">
                            {it.name} <span className="text-slate-400 font-normal">x {it.quantity}</span>
                          </span>
                          <span className="font-black text-[#0f2b48]">
                            ₹ {(it.price * it.quantity).toLocaleString('en-IN')}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-medium">Shipping to: {order.shippingAddress}</span>
                      <span className="font-black text-sm text-[#16a34a]">
                        Total: ₹ {order.total.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* 2. Wishlist Tab */}
          {activeTab === 'wishlist' && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-[#0f2b48]">Saved Items ({wishlist.length})</h2>
              {wishlistedProducts.length === 0 ? (
                <div className="bg-white rounded-2xl p-10 text-center border border-slate-200">
                  <p className="text-xs text-slate-500">Your wishlist is empty.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {wishlistedProducts.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 3. Addresses Tab */}
          {activeTab === 'addresses' && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
              <h2 className="text-lg font-bold text-[#0f2b48]">Saved Delivery Address</h2>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                <span className="font-bold text-slate-800 block">{user.name}</span>
                <p className="text-slate-600">{user.address || "Banashankari 2nd Stage, Bengaluru, Karnataka 560070"}</p>
                <p className="text-slate-500">Phone: {user.phone}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
