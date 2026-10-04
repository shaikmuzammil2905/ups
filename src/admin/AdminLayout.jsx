import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAdminAuth } from './AdminAuthContext';
import {
  LayoutDashboard, Package, Tags, Building2, Wrench, Megaphone,
  FileText, Star, ShoppingCart, Users, Layers, BookOpen,
  MapPin, Globe, Image, MessageSquare, UserCog, Settings,
  LogOut, Menu, X, Zap, ChevronDown, ChevronRight, Bell, Home,
  ExternalLink, BatteryCharging
} from 'lucide-react';

const NAV_ITEMS = [
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    path: '/admin/dashboard',
  },
  {
    label: 'Catalog Management',
    icon: Package,
    children: [
      { label: 'Products', icon: Package, path: '/admin/products' },
      { label: 'Online UPS', icon: Zap, path: '/admin/online-ups' },
      { label: 'Batteries', icon: BatteryCharging, path: '/admin/batteries' },
      { label: 'Categories', icon: Tags, path: '/admin/categories' },
      { label: 'Brands', icon: Building2, path: '/admin/brands' },
      { label: 'Catalogs', icon: Layers, path: '/admin/catalogs' },
    ],
  },
  {
    label: 'Services',
    icon: Wrench,
    children: [
      { label: 'Services', icon: Wrench, path: '/admin/services' },
      { label: 'Enquiries', icon: MessageSquare, path: '/admin/enquiries' },
    ],
  },
  {
    label: 'Marketing',
    icon: Megaphone,
    children: [
      { label: 'Advertisements', icon: Megaphone, path: '/admin/advertisements' },
      { label: 'Posts & Articles', icon: FileText, path: '/admin/posts' },
      { label: 'Website Content', icon: Globe, path: '/admin/website-content' },
    ],
  },
  {
    label: 'Customers & Sales',
    icon: Users,
    children: [
      { label: 'Orders', icon: ShoppingCart, path: '/admin/orders' },
      { label: 'Customers', icon: Users, path: '/admin/customers' },
      { label: 'Reviews & Ratings', icon: Star, path: '/admin/reviews' },
    ],
  },
  {
    label: 'Website & Media',
    icon: Globe,
    children: [
      { label: 'Contact & Store', icon: MapPin, path: '/admin/contact-store' },
      { label: 'Media Library', icon: Image, path: '/admin/media' },
    ],
  },
  {
    label: 'System & Admin',
    icon: Settings,
    children: [
      { label: 'Admin Users', icon: UserCog, path: '/admin/users' },
      { label: 'Settings', icon: Settings, path: '/admin/settings' },
    ],
  },
];

function NavItem({ item, collapsed, isExpanded, onToggle, onNavClick, depth = 0 }) {
  const location = useLocation();
  const isActive = item.path && location.pathname === item.path;
  const isChildActive = item.children?.some(c => location.pathname === c.path);

  if (item.children) {
    return (
      <div>
        <button
          onClick={() => onToggle(item.label)}
          className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all min-h-[44px] ${
            isChildActive
              ? 'bg-[#16a34a]/10 text-[#16a34a]'
              : 'text-slate-400 hover:bg-white/5 hover:text-white'
          }`}
        >
          <item.icon className={`w-4.5 h-4.5 flex-shrink-0 ${isChildActive ? 'text-[#16a34a]' : ''}`} />
          {!collapsed && (
            <>
              <span className="flex-1 text-left">{item.label}</span>
              {isExpanded
                ? <ChevronDown className="w-4 h-4" />
                : <ChevronRight className="w-4 h-4" />
              }
            </>
          )}
        </button>
        {isExpanded && !collapsed && (
          <div className="ml-4 mt-1 space-y-1 border-l border-white/10 pl-3">
            {item.children.map(child => (
              <NavItem
                key={child.path}
                item={child}
                collapsed={false}
                isExpanded={false}
                onToggle={() => {}}
                onNavClick={onNavClick}
                depth={1}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      to={item.path}
      onClick={() => onNavClick?.()}
      className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium transition-all min-h-[44px] ${
        isActive
          ? 'bg-[#16a34a] text-white shadow-lg shadow-green-900/30 font-bold'
          : 'text-slate-400 hover:bg-white/5 hover:text-white'
      } ${depth > 0 ? 'text-xs' : ''}`}
    >
      <item.icon className="w-4 h-4 flex-shrink-0" />
      {!collapsed && <span>{item.label}</span>}
    </Link>
  );
}

export default function AdminLayout({ children }) {
  const { adminProfile, adminLogout } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  // Automatically close mobile sidebar whenever route changes
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const [expandedGroups, setExpandedGroups] = useState(() => {
    const expanded = new Set(['Catalog Management', 'Services', 'Customers & Sales']);
    NAV_ITEMS.forEach(item => {
      if (item.children?.some(c => location.pathname === c.path || location.pathname.startsWith(c.path))) {
        expanded.add(item.label);
      }
    });
    return expanded;
  });

  const toggleGroup = (label) => {
    setExpandedGroups(prev => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  };

  const handleLogout = async () => {
    await adminLogout();
    navigate('/admin/login');
  };

  const closeMobileSidebar = () => setSidebarOpen(false);

  const Sidebar = ({ mobile = false }) => (
    <div className={`flex flex-col h-full bg-[#0a1f35] ${mobile ? 'w-72' : ''}`}>
      {/* Logo */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#16a34a] rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
            <Zap className="w-5 h-5 text-white fill-white" />
          </div>
          {(!collapsed || mobile) && (
            <div>
              <div className="text-white font-black text-sm leading-none tracking-wide">LIVKAM</div>
              <div className="text-[#4ade80] text-[10px] font-bold tracking-widest mt-0.5">ADMIN CMS</div>
            </div>
          )}
        </div>
        {!mobile && (
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors"
          >
            <Menu className="w-4 h-4" />
          </button>
        )}
        {mobile && (
          <button
            onClick={closeMobileSidebar}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {NAV_ITEMS.map(item => (
          <NavItem
            key={item.label}
            item={item}
            collapsed={collapsed && !mobile}
            isExpanded={expandedGroups.has(item.label)}
            onToggle={toggleGroup}
            onNavClick={closeMobileSidebar}
          />
        ))}
      </nav>

      {/* User Info + Logout */}
      <div className="p-3 border-t border-white/10 bg-[#071626]">
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <div className="w-9 h-9 bg-[#16a34a] rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
            <span className="text-white text-xs font-bold uppercase">
              {adminProfile?.full_name?.charAt(0) || adminProfile?.email?.charAt(0) || 'A'}
            </span>
          </div>
          {(!collapsed || mobile) && (
            <div className="flex-1 min-w-0">
              <div className="text-white text-xs font-bold truncate">
                {adminProfile?.full_name || 'Administrator'}
              </div>
              <div className="text-slate-400 text-[11px] truncate font-mono">{adminProfile?.email}</div>
            </div>
          )}
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-300 hover:bg-red-950/40 hover:text-red-400 transition-all min-h-[44px]"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {(!collapsed || mobile) && <span>Sign Out</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden">
      {/* Desktop Sidebar */}
      <div className={`hidden lg:flex flex-col border-r border-slate-800/80 transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'}`}>
        <Sidebar />
      </div>

      {/* Mobile Drawer Overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-xs animate-fade-in"
            onClick={closeMobileSidebar}
          />
          <div className="relative z-10 w-72 max-w-[85vw] bg-[#0a1f35] h-full shadow-2xl animate-slide-in-left">
            <Sidebar mobile />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden pb-16 lg:pb-0">
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3 flex items-center justify-between gap-4 flex-shrink-0 z-10">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Open Mobile Menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="min-w-0">
              <h2 className="text-slate-900 font-black text-sm sm:text-base truncate">
                {NAV_ITEMS.flatMap(i => [i, ...(i.children || [])]).find(i => i.path === location.pathname)?.label || 'Livkam CMS'}
              </h2>
              <p className="text-slate-400 text-[11px] truncate">Admin Control & Live Sync</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* View Live Website Button */}
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 bg-slate-900 hover:bg-[#16a34a] text-white text-xs font-bold px-3 py-2 rounded-xl transition-all shadow-sm"
            >
              <Globe className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Live Website</span>
            </a>

            {/* Profile Tag */}
            <div className="hidden md:flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="w-7 h-7 rounded-full bg-[#16a34a] text-white flex items-center justify-center font-bold text-xs">
                {adminProfile?.full_name?.charAt(0) || 'A'}
              </div>
              <span className="text-xs font-bold text-slate-700 truncate max-w-[120px]">
                {adminProfile?.full_name?.split(' ')[0] || 'Admin'}
              </span>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar (for small screens) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0a1f35] border-t border-white/10 px-2 py-1.5 flex items-center justify-around">
        <Link
          to="/admin/dashboard"
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-[10px] font-bold transition-all ${
            location.pathname === '/admin/dashboard' ? 'text-[#4ade80]' : 'text-slate-400'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span>Dashboard</span>
        </Link>

        <Link
          to="/admin/products"
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-[10px] font-bold transition-all ${
            location.pathname.startsWith('/admin/products') ? 'text-[#4ade80]' : 'text-slate-400'
          }`}
        >
          <Package className="w-5 h-5" />
          <span>Products</span>
        </Link>

        <Link
          to="/admin/orders"
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-[10px] font-bold transition-all ${
            location.pathname.startsWith('/admin/orders') ? 'text-[#4ade80]' : 'text-slate-400'
          }`}
        >
          <ShoppingCart className="w-5 h-5" />
          <span>Orders</span>
        </Link>

        <Link
          to="/admin/enquiries"
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-[10px] font-bold transition-all ${
            location.pathname.startsWith('/admin/enquiries') ? 'text-[#4ade80]' : 'text-slate-400'
          }`}
        >
          <MessageSquare className="w-5 h-5" />
          <span>Leads</span>
        </Link>

        <button
          onClick={() => setSidebarOpen(true)}
          className="flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-[10px] font-bold text-slate-400 hover:text-white"
        >
          <Menu className="w-5 h-5" />
          <span>Menu</span>
        </button>
      </div>
    </div>
  );
}
