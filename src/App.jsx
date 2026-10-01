import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { AdminAuthProvider } from './admin/AdminAuthContext';
import { DataProvider } from './context/DataContext';

// Customer Layout Components
import Header from './components/Header';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import SearchModal from './components/SearchModal';
import MobileDrawer from './components/MobileDrawer';
import MobileBottomNav from './components/MobileBottomNav';
import Toast from './components/Toast';
import WhatsAppPopup from './components/WhatsAppPopup';

// Customer Pages
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Categories from './pages/Categories';
import CategoryDetail from './pages/CategoryDetail';
import Brands from './pages/Brands';
import BrandDetail from './pages/BrandDetail';
import Services from './pages/Services';
import ServiceDetail from './pages/ServiceDetail';
import Posts from './pages/Posts';
import PostDetail from './pages/PostDetail';
import About from './pages/About';
import Contact from './pages/Contact';
import Cart from './pages/Cart';
import SearchPage from './pages/SearchPage';
import Account from './pages/Account';
import NotFound from './pages/NotFound';

// Admin CMS Components & Modules
import AdminProtectedRoute from './admin/AdminProtectedRoute';
import AdminLayout from './admin/AdminLayout';
import AdminLogin from './admin/AdminLogin';
import AdminDashboard from './admin/Dashboard';
import { ProductsList, ProductForm } from './admin/Products';
import CategoriesAdmin from './admin/Categories';
import BrandsAdmin from './admin/Brands';
import ServicesAdmin from './admin/Services';
import EnquiriesAdmin from './admin/Enquiries';
import AdvertisementsAdmin from './admin/Advertisements';
import PostsAdmin from './admin/Posts';
import ReviewsAdmin from './admin/Reviews';
import OrdersAdmin from './admin/Orders';
import CustomersAdmin from './admin/Customers';
import CatalogsAdmin from './admin/Catalogs';
import ContactStoreAdmin from './admin/ContactStore';
import WebsiteContentAdmin from './admin/WebsiteContent';
import MediaLibraryAdmin from './admin/MediaLibrary';
import AdminUsers from './admin/AdminUsers';
import AdminSettings from './admin/AdminSettings';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function AdminApp() {
  return (
    <Routes>
      <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin/dashboard"
        element={
          <AdminProtectedRoute>
            <AdminLayout>
              <AdminDashboard />
            </AdminLayout>
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/admin/products"
        element={
          <AdminProtectedRoute>
            <AdminLayout>
              <ProductsList />
            </AdminLayout>
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/admin/products/new"
        element={
          <AdminProtectedRoute>
            <AdminLayout>
              <ProductForm />
            </AdminLayout>
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/admin/products/edit/:id"
        element={
          <AdminProtectedRoute>
            <AdminLayout>
              <ProductForm />
            </AdminLayout>
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/admin/categories"
        element={
          <AdminProtectedRoute>
            <AdminLayout>
              <CategoriesAdmin />
            </AdminLayout>
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/admin/brands"
        element={
          <AdminProtectedRoute>
            <AdminLayout>
              <BrandsAdmin />
            </AdminLayout>
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/admin/services"
        element={
          <AdminProtectedRoute>
            <AdminLayout>
              <ServicesAdmin />
            </AdminLayout>
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/admin/enquiries"
        element={
          <AdminProtectedRoute>
            <AdminLayout>
              <EnquiriesAdmin />
            </AdminLayout>
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/admin/advertisements"
        element={
          <AdminProtectedRoute>
            <AdminLayout>
              <AdvertisementsAdmin />
            </AdminLayout>
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/admin/posts"
        element={
          <AdminProtectedRoute>
            <AdminLayout>
              <PostsAdmin />
            </AdminLayout>
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/admin/reviews"
        element={
          <AdminProtectedRoute>
            <AdminLayout>
              <ReviewsAdmin />
            </AdminLayout>
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/admin/orders"
        element={
          <AdminProtectedRoute>
            <AdminLayout>
              <OrdersAdmin />
            </AdminLayout>
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/admin/customers"
        element={
          <AdminProtectedRoute>
            <AdminLayout>
              <CustomersAdmin />
            </AdminLayout>
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/admin/catalogs"
        element={
          <AdminProtectedRoute>
            <AdminLayout>
              <CatalogsAdmin />
            </AdminLayout>
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/admin/contact-store"
        element={
          <AdminProtectedRoute>
            <AdminLayout>
              <ContactStoreAdmin />
            </AdminLayout>
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/admin/website-content"
        element={
          <AdminProtectedRoute>
            <AdminLayout>
              <WebsiteContentAdmin />
            </AdminLayout>
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/admin/media"
        element={
          <AdminProtectedRoute>
            <AdminLayout>
              <MediaLibraryAdmin />
            </AdminLayout>
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <AdminProtectedRoute>
            <AdminLayout>
              <AdminUsers />
            </AdminLayout>
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/admin/settings"
        element={
          <AdminProtectedRoute>
            <AdminLayout>
              <AdminSettings />
            </AdminLayout>
          </AdminProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
    </Routes>
  );
}

function MainLayout() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-[#f8fafc] selection:bg-[#16a34a] selection:text-white pb-16 lg:pb-0">
      <ScrollToTop />
      
      {/* Header */}
      <Header
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
      />

      {/* Main Page Routing */}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:slug" element={<ProductDetail />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/category/:slug" element={<CategoryDetail />} />
          <Route path="/brands" element={<Brands />} />
          <Route path="/brands/:slug" element={<BrandDetail />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:slug" element={<ServiceDetail />} />
          <Route path="/posts" element={<Posts />} />
          <Route path="/posts/:slug" element={<PostDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/account" element={<Account />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* Footer */}
      <Footer />

      {/* Overlays & Modals */}
      <CartDrawer />
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <MobileDrawer isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
      <MobileBottomNav onOpenSearch={() => setIsSearchOpen(true)} />
      <Toast />
      <WhatsAppPopup />
    </div>
  );
}

function RootApp() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  if (isAdmin) {
    return <AdminApp />;
  }

  return <MainLayout />;
}

export default function App() {
  return (
    <DataProvider>
      <AuthProvider>
        <AdminAuthProvider>
          <CartProvider>
            <Router>
              <RootApp />
            </Router>
          </CartProvider>
        </AdminAuthProvider>
      </AuthProvider>
    </DataProvider>
  );
}
