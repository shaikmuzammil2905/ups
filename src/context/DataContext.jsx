import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { products as staticProducts } from '../data/products';
import { categories as staticCategories } from '../data/categories';
import { brands as staticBrands } from '../data/brands';
import { services as staticServices } from '../data/services';
import { posts as staticPosts } from '../data/posts';

const DataContext = createContext(null);

const DEFAULT_SETTINGS = {
  business_name: 'Livkam Power Technologies',
  tagline: 'Smart Power. Sustainable Future.',
  phone1: '8884988990',
  phone2: '9945535819',
  whatsapp: '8884988990',
  email: 'info@livkampower.in',
  address: '21, Subhash Chandra Bose Rd, Banashankari 2nd Stage, Bendre Nagar, Bengaluru, Karnataka 560070',
  gst: '29CYMPN3694M1ZC',
  business_hours: 'Mon-Sat: 9AM - 7PM',
  google_maps_url: 'https://maps.google.com/?q=21+Subhash+Chandra+Bose+Rd+Banashankari+2nd+Stage+Bengaluru',
  google_maps_embed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.3245!2d77.5495!3d12.9279!',
  emergency_banner_text: '⚡ 24/7 Emergency UPS Breakdown Support & Mobile Battery Delivery in Bengaluru: +91 8884988990',
  emergency_banner_active: true,
};

export function DataProvider({ children }) {
  const [products, setProducts] = useState(staticProducts);
  const [categories, setCategories] = useState(staticCategories);
  const [brands, setBrands] = useState(staticBrands);
  const [services, setServices] = useState(staticServices);
  const [posts, setPosts] = useState(staticPosts);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [advertisements, setAdvertisements] = useState([]);
  const [heroSlides, setHeroSlides] = useState([]);
  const [isLiveConnected, setIsLiveConnected] = useState(false);

  // Fetch all live data from Supabase
  const refreshAllData = useCallback(async () => {
    try {
      // 1. Fetch Products
      const { data: dbProducts, error: pErr } = await supabase
        .from('products')
        .select(`*, product_images(url, display_order)`)
        .eq('is_published', true)
        .order('display_order', { ascending: true });

      if (!pErr && dbProducts && dbProducts.length > 0) {
        // Map database products to match frontend component properties
        const formatted = dbProducts.map(p => ({
          ...p,
          brand: p.brand_name || p.brand_id,
          category: p.category_id || p.category_name,
          images: p.product_images?.length > 0
            ? p.product_images.sort((a,b) => (a.display_order||0)-(b.display_order||0)).map(img => img.url)
            : (p.images || [p.image || '/images/products/online-ups.jpg']),
          image: p.product_images?.[0]?.url || p.image || '/images/products/online-ups.jpg',
          originalPrice: p.original_price,
          inStock: p.in_stock,
          isFeatured: p.is_featured,
          isBestseller: p.is_bestseller,
          reviewCount: p.review_count,
          shortSpecs: p.short_specs || [],
          specs: p.specifications || {},
        }));
        setProducts(formatted);
      }

      // 2. Fetch Categories
      const { data: dbCategories, error: cErr } = await supabase
        .from('categories')
        .select('*')
        .eq('is_published', true)
        .order('display_order', { ascending: true });

      if (!cErr && dbCategories && dbCategories.length > 0) {
        const formatted = dbCategories.map(c => ({
          ...c,
          shortDesc: c.short_desc,
          itemCount: c.item_count,
          imageUrl: c.image_url,
          bannerUrl: c.banner_url,
          fallbackIcon: c.fallback_icon,
        }));
        setCategories(formatted);
      }

      // 3. Fetch Brands
      const { data: dbBrands, error: bErr } = await supabase
        .from('brands')
        .select('*')
        .eq('is_published', true)
        .order('display_order', { ascending: true });

      if (!bErr && dbBrands && dbBrands.length > 0) {
        const formatted = dbBrands.map(b => ({
          ...b,
          fullName: b.full_name,
          logoText: b.logo_text,
          subText: b.sub_text,
          authorizedPartner: b.authorized_partner,
          popularCategories: b.popular_categories || [],
          bannerUrl: b.banner_url,
        }));
        setBrands(formatted);
      }

      // 4. Fetch Services
      const { data: dbServices, error: sErr } = await supabase
        .from('services')
        .select('*')
        .eq('is_published', true)
        .order('display_order', { ascending: true });

      if (!sErr && dbServices && dbServices.length > 0) {
        const formatted = dbServices.map(s => ({
          ...s,
          shortDesc: s.short_desc,
          priceStartsAt: s.price_starts_at,
          aboutContent: s.about_content,
          fourColumns: s.four_columns,
          technicalInfo: s.technical_info,
          relatedProducts: s.related_products,
          imageUrl: s.image_url,
        }));
        setServices(formatted);
      }

      // 5. Fetch Posts
      const { data: dbPosts, error: postErr } = await supabase
        .from('posts')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (!postErr && dbPosts && dbPosts.length > 0) {
        const formatted = dbPosts.map(p => ({
          ...p,
          coverImage: p.cover_image,
          readTime: p.read_time,
          createdAt: p.created_at,
        }));
        setPosts(formatted);
      }

      // 6. Fetch Settings
      const { data: dbSettings } = await supabase.from('site_settings').select('*');
      if (dbSettings && dbSettings.length > 0) {
        const merged = { ...DEFAULT_SETTINGS };
        dbSettings.forEach(s => {
          if (s.key in merged) merged[s.key] = s.value;
        });
        setSettings(merged);
      }

      // 7. Fetch Advertisements
      const { data: dbAds } = await supabase
        .from('advertisements')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });
      if (dbAds) setAdvertisements(dbAds);

      // 8. Fetch Hero Slides
      const { data: dbSlides } = await supabase
        .from('hero_slides')
        .select('*')
        .order('display_order', { ascending: true });
      if (dbSlides && dbSlides.length > 0) setHeroSlides(dbSlides);

      setIsLiveConnected(true);
    } catch (err) {
      console.warn('Realtime sync fallback active:', err);
    }
  }, []);

  useEffect(() => {
    // Initial fetch
    refreshAllData();

    // Setup Supabase Realtime broadcast listener
    const channel = supabase
      .channel('public:realtime_website_sync')
      .on('postgres_changes', { event: '*', schema: 'public' }, () => {
        refreshAllData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refreshAllData]);

  const value = {
    products,
    categories,
    brands,
    services,
    posts,
    settings,
    advertisements,
    heroSlides,
    isLiveConnected,
    refreshAllData,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) {
    // Fallback if accessed outside provider
    return {
      products: staticProducts,
      categories: staticCategories,
      brands: staticBrands,
      services: staticServices,
      posts: staticPosts,
      settings: DEFAULT_SETTINGS,
      advertisements: [],
      heroSlides: [],
      isLiveConnected: false,
      refreshAllData: () => {},
    };
  }
  return ctx;
}

export function useProducts() {
  return useData().products;
}

export function useCategories() {
  return useData().categories;
}

export function useBrands() {
  return useData().brands;
}

export function useServices() {
  return useData().services;
}

export function usePosts() {
  return useData().posts;
}

export function useSiteSettings() {
  return useData().settings;
}
