import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import {
  Package, Tags, Building2, Wrench, ShoppingCart, Users, Star,
  MessageSquare, FileText, Megaphone, TrendingUp, Plus, Eye,
  RefreshCw, Loader, AlertCircle, CheckCircle, Clock, Zap,
  ArrowRight, BarChart3, Globe, Layers
} from 'lucide-react';

function StatCard({ icon: Icon, label, value, color, link, loading }) {
  return (
    <Link to={link} className="group bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-all border border-slate-100 hover:border-slate-200">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="w-5.5 h-5.5 text-white" />
        </div>
        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all" />
      </div>
      <div className="text-2xl font-black text-slate-800 mb-1">
        {loading ? <div className="w-12 h-7 bg-slate-100 rounded animate-pulse" /> : value}
      </div>
      <div className="text-sm text-slate-500 font-medium">{label}</div>
    </Link>
  );
}

function QuickAction({ icon: Icon, label, path, color }) {
  return (
    <Link
      to={path}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all hover:scale-105 shadow-sm ${color}`}
    >
      <Icon className="w-4.5 h-4.5" />
      {label}
    </Link>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentEnquiries, setRecentEnquiries] = useState([]);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const [
        { count: totalProducts },
        { count: publishedProducts },
        { count: categories },
        { count: brands },
        { count: services },
        { count: orders },
        { count: customers },
        { count: reviews },
        { count: enquiries },
        { count: posts },
        { count: advertisements },
      ] = await Promise.all([
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('products').select('*', { count: 'exact', head: true }).eq('is_published', true),
        supabase.from('categories').select('*', { count: 'exact', head: true }),
        supabase.from('brands').select('*', { count: 'exact', head: true }),
        supabase.from('services').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'customer'),
        supabase.from('reviews').select('*', { count: 'exact', head: true }),
        supabase.from('customer_enquiries').select('*', { count: 'exact', head: true }),
        supabase.from('posts').select('*', { count: 'exact', head: true }),
        supabase.from('advertisements').select('*', { count: 'exact', head: true }),
      ]);

      setStats({
        totalProducts: totalProducts || 0,
        publishedProducts: publishedProducts || 0,
        categories: categories || 0,
        brands: brands || 0,
        services: services || 0,
        orders: orders || 0,
        customers: customers || 0,
        reviews: reviews || 0,
        enquiries: enquiries || 0,
        posts: posts || 0,
        advertisements: advertisements || 0,
      });

      // Recent orders
      const { data: ordersData } = await supabase
        .from('orders')
        .select('id, customer_name, total, order_status, created_at')
        .order('created_at', { ascending: false })
        .limit(5);
      setRecentOrders(ordersData || []);

      // Recent enquiries
      const { data: enquiriesData } = await supabase
        .from('customer_enquiries')
        .select('id, full_name, service, status, created_at')
        .order('created_at', { ascending: false })
        .limit(5);
      setRecentEnquiries(enquiriesData || []);
    } catch (err) {
      setError('Failed to load dashboard statistics. Please refresh.');
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const statCards = [
    { icon: Package, label: 'Total Products', value: stats.totalProducts, color: 'bg-[#0f2b48]', link: '/admin/products' },
    { icon: Package, label: 'Published Products', value: stats.publishedProducts, color: 'bg-[#16a34a]', link: '/admin/products' },
    { icon: Tags, label: 'Categories', value: stats.categories, color: 'bg-blue-600', link: '/admin/categories' },
    { icon: Building2, label: 'Brands', value: stats.brands, color: 'bg-purple-600', link: '/admin/brands' },
    { icon: Wrench, label: 'Services', value: stats.services, color: 'bg-amber-500', link: '/admin/services' },
    { icon: ShoppingCart, label: 'Total Orders', value: stats.orders, color: 'bg-rose-500', link: '/admin/orders' },
    { icon: Users, label: 'Customers', value: stats.customers, color: 'bg-cyan-600', link: '/admin/customers' },
    { icon: Star, label: 'Reviews', value: stats.reviews, color: 'bg-yellow-500', link: '/admin/reviews' },
    { icon: MessageSquare, label: 'Enquiries', value: stats.enquiries, color: 'bg-indigo-600', link: '/admin/enquiries' },
    { icon: FileText, label: 'Posts', value: stats.posts, color: 'bg-teal-600', link: '/admin/posts' },
    { icon: Megaphone, label: 'Advertisements', value: stats.advertisements, color: 'bg-orange-500', link: '/admin/advertisements' },
  ];

  const quickActions = [
    { icon: Plus, label: '+ Add Product', path: '/admin/products/new', color: 'bg-[#0f2b48] text-white hover:bg-[#1a3d60]' },
    { icon: Plus, label: '+ Add Category', path: '/admin/categories/new', color: 'bg-blue-600 text-white hover:bg-blue-700' },
    { icon: Plus, label: '+ Add Brand', path: '/admin/brands/new', color: 'bg-purple-600 text-white hover:bg-purple-700' },
    { icon: Plus, label: '+ Add Advertisement', path: '/admin/advertisements/new', color: 'bg-orange-500 text-white hover:bg-orange-600' },
    { icon: Plus, label: '+ Add Post', path: '/admin/posts/new', color: 'bg-teal-600 text-white hover:bg-teal-700' },
    { icon: Eye, label: 'View Enquiries', path: '/admin/enquiries', color: 'bg-indigo-600 text-white hover:bg-indigo-700' },
    { icon: ShoppingCart, label: 'View Orders', path: '/admin/orders', color: 'bg-rose-500 text-white hover:bg-rose-600' },
    { icon: Globe, label: 'Edit Website Content', path: '/admin/website-content', color: 'bg-[#16a34a] text-white hover:bg-[#15803d]' },
  ];

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-700',
    confirmed: 'bg-blue-100 text-blue-700',
    processing: 'bg-purple-100 text-purple-700',
    shipped: 'bg-indigo-100 text-indigo-700',
    delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
    new: 'bg-blue-100 text-blue-700',
    in_progress: 'bg-yellow-100 text-yellow-700',
    resolved: 'bg-green-100 text-green-700',
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Dashboard Overview</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <button
          onClick={fetchStats}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all shadow-sm"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl p-4">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Stats Grid */}
      <div>
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Live Statistics</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {statCards.map(card => (
            <StatCard key={card.label} {...card} loading={loading} />
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          {quickActions.map(action => (
            <QuickAction key={action.label} {...action} />
          ))}
        </div>
      </div>

      {/* Recent Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-slate-100">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <ShoppingCart className="w-4.5 h-4.5 text-rose-500" />
              Recent Orders
            </h3>
            <Link to="/admin/orders" className="text-xs text-[#16a34a] font-semibold hover:underline">
              View All →
            </Link>
          </div>
          <div className="divide-y divide-slate-50">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="p-4 space-y-2 animate-pulse">
                  <div className="h-4 bg-slate-100 rounded w-3/4" />
                  <div className="h-3 bg-slate-100 rounded w-1/2" />
                </div>
              ))
            ) : recentOrders.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-sm">No orders yet</div>
            ) : (
              recentOrders.map(order => (
                <div key={order.id} className="p-4 flex items-center gap-3">
                  <div className="w-9 h-9 bg-rose-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <ShoppingCart className="w-4 h-4 text-rose-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-slate-800 truncate">{order.customer_name || order.id}</div>
                    <div className="text-xs text-slate-500">₹{order.total?.toLocaleString('en-IN')}</div>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${statusColors[order.order_status] || 'bg-gray-100 text-gray-600'}`}>
                    {order.order_status?.replace(/_/g, ' ')}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Enquiries */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-slate-100">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <MessageSquare className="w-4.5 h-4.5 text-indigo-500" />
              Recent Enquiries
            </h3>
            <Link to="/admin/enquiries" className="text-xs text-[#16a34a] font-semibold hover:underline">
              View All →
            </Link>
          </div>
          <div className="divide-y divide-slate-50">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="p-4 space-y-2 animate-pulse">
                  <div className="h-4 bg-slate-100 rounded w-3/4" />
                  <div className="h-3 bg-slate-100 rounded w-1/2" />
                </div>
              ))
            ) : recentEnquiries.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-sm">No enquiries yet</div>
            ) : (
              recentEnquiries.map(enq => (
                <div key={enq.id} className="p-4 flex items-center gap-3">
                  <div className="w-9 h-9 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-slate-800 truncate">{enq.full_name}</div>
                    <div className="text-xs text-slate-500 truncate">{enq.service || 'General Enquiry'}</div>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${statusColors[enq.status] || 'bg-gray-100 text-gray-600'}`}>
                    {enq.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="bg-gradient-to-r from-[#0f2b48] to-[#1a3d60] rounded-2xl p-6 text-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center">
            <Zap className="w-5 h-5 text-[#4ade80] fill-[#4ade80]" />
          </div>
          <div>
            <h3 className="font-bold">System Status</h3>
            <p className="text-slate-400 text-xs">Livkam Power Technologies CMS</p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Supabase', status: 'Connected', icon: CheckCircle },
            { label: 'Media Storage', status: 'Ready', icon: CheckCircle },
            { label: 'Website', status: 'Live', icon: Globe },
            { label: 'Admin Panel', status: 'Active', icon: BarChart3 },
          ].map(item => (
            <div key={item.label} className="bg-white/10 rounded-xl p-3">
              <div className="flex items-center gap-2 mb-1">
                <item.icon className="w-3.5 h-3.5 text-[#4ade80]" />
                <span className="text-xs font-bold text-[#4ade80]">{item.status}</span>
              </div>
              <div className="text-slate-300 text-xs">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
