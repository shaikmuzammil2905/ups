import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAdminAuth } from './AdminAuthContext';
import {
  LayoutDashboard, Package, Tags, Building2, Wrench, Megaphone,
  FileText, Star, ShoppingCart, Users, Layers, BookOpen,
  MapPin, Globe, Image, MessageSquare, UserCog, Settings,
  LogOut, Menu, X, Zap, ChevronDown, ChevronRight, Bell
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
    label: 'Customers',
    icon: Users,
    children: [
      { label: 'Customers', icon: Users, path: '/admin/customers' },
      { label: 'Orders', icon: ShoppingCart, path: '/admin/orders' },
      { label: 'Reviews & Ratings', icon: Star, path: '/admin/reviews' },
    ],
  },
  {
    label: 'Website',
    icon: Globe,
    children: [
      { label: 'Contact & Store', icon: MapPin, path: '/admin/contact-store' },
      { label: 'Media Library', icon: Image, path: '/admin/media' },
    ],
  },
  {
    label: 'System',
    icon: Settings,
    children: [
      { label: 'Admin Users', icon: UserCog, path: '/admin/users' },
      { label: 'Settings', icon: Settings, path: '/admin/settings' },
    ],
  },
];

function NavItem({ item, collapsed, isExpanded, onToggle, depth = 0 }) {
  const location = useLocation();
  const isActive = item.path && location.pathname === item.path;
  const isChildActive = item.children?.some(c => location.pathname === c.path);

  if (item.children) {
    return (
      <div>
        <button
          onClick={() => onToggle(item.label)}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
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
                ? <ChevronDown className="w-3.5 h-3.5" />
                : <ChevronRight className="w-3.5 h-3.5" />
              }
            </>
          )}
        </button>
        {isExpanded && !collapsed && (
          <div className="ml-4 mt-1 space-y-0.5 border-l border-white/10 pl-3">
            {item.children.map(child => (
              <NavItem key={child.path} item={child} collapsed={false} isExpanded={false} onToggle={() => {}} depth={1} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      to={item.path}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
        isActive
          ? 'bg-[#16a34a] text-white shadow-lg shadow-green-900/30'
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
  const [expandedGroups, setExpandedGroups] = useState(() => {
    // Auto-expand the group that contains the current route
    const expanded = new Set();
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

  const Sidebar = ({ mobile = false }) => (
    <div className={`flex flex-col h-full bg-[#0a1f35] ${mobile ? 'w-72' : ''}`}>
      {/* Logo */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#16a34a] rounded-xl flex items-center justify-center flex-shrink-0">
            <Zap className="w-5 h-5 text-white fill-white" />
          </div>
          {(!collapsed || mobile) && (
            <div>
              <div className="text-white font-black text-sm leading-none">LIVKAM</div>
              <div className="text-[#4ade80] text-[10px] font-semibold tracking-widest">ADMIN PANEL</div>
            </div>
          )}
          {!mobile && (
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="ml-auto text-slate-500 hover:text-white transition-colors"
            >
              <Menu className="w-4 h-4" />
            </button>
          )}
        </div>
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
          />
        ))}
      </nav>

      {/* User Info + Logout */}
      <div className="p-3 border-t border-white/10">
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <div className="w-8 h-8 bg-[#16a34a] rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-bold">
              {adminProfile?.full_name?.charAt(0) || adminProfile?.email?.charAt(0) || 'A'}
            </span>
          </div>
          {(!collapsed || mobile) && (
            <div className="flex-1 min-w-0">
              <div className="text-white text-xs font-semibold truncate">
                {adminProfile?.full_name || 'Administrator'}
              </div>
              <div className="text-slate-400 text-[11px] truncate">{adminProfile?.email}</div>
            </div>
          )}
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:bg-red-900/30 hover:text-red-400 transition-all"
        >
          <LogOut className="w-4.5 h-4.5 flex-shrink-0" />
          {(!collapsed || mobile) && <span>Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#f1f5f9] overflow-hidden">
      {/* Desktop Sidebar */}
      <div className={`hidden lg:flex flex-col border-r border-slate-700/50 transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'}`}>
        <Sidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 z-10">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-end p-3 bg-[#0a1f35] border-b border-white/10">
                <button onClick={() => setSidebarOpen(false)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <Sidebar mobile />
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white border-b border-slate-200 px-4 lg:px-6 py-3.5 flex items-center gap-4 flex-shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-slate-600 hover:text-slate-900"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex-1">
            <h2 className="text-slate-800 font-bold text-base">
              {NAV_ITEMS.flatMap(i => [i, ...(i.children || [])]).find(i => i.path === location.pathname)?.label || 'Admin'}
            </h2>
            <p className="text-slate-400 text-xs">Livkam Power Technologies CMS</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Live Website Link */}
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-2 bg-[#0f2b48] text-white text-xs font-semibold px-3.5 py-2 rounded-lg hover:bg-[#16a34a] transition-colors"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>View Website</span>
            </a>

            {/* Notifications */}
            <button className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors">
              <Bell className="w-5 h-5" />
            </button>

            {/* Avatar */}
            <div className="w-8 h-8 bg-[#16a34a] rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">
                {adminProfile?.full_name?.charAt(0) || 'A'}
              </span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
