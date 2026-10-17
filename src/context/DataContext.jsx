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
  warehouse_address: '6 And 7 4th Cross Ganesh Nagar, Main Road, Vidyaranyapura Post, Telecom Colony, Kodigehalli, Bengaluru, Karnataka 560097',
  gst: '29CYMPN3694M1ZC',
  business_hours: 'Mon-Sat: 9AM - 7PM',
  google_maps_url: 'https://maps.google.com/?q=21+Subhash+Chandra+Bose+Rd+Banashankari+2nd+Stage+Bengaluru',
  google_maps_embed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.3245!2d77.5495!3d12.9279!',
  facebook_url: 'https://www.facebook.com/share/14tTKpW4pF4/',
  emergency_banner_text: '⚡ 24/7 Emergency UPS Breakdown Support & Mobile Battery Delivery in Bengaluru: +91 8884988990',
  emergency_banner_active: true,
};

export function DataProvider({ children }) {
  const [products, setProducts] = useState(() => {
    try {
      const cached = localStorage.getItem('livkam_cached_products');
      if (cached) return JSON.parse(cached);
    } catch (_) {}
    return staticProducts;
  });

  const [categories, setCategories] = useState(() => {
    try {
      const cached = localStorage.getItem('livkam_cached_categories');
      if (cached) return JSON.parse(cached);
    } catch (_) {}
    return staticCategories;
  });

  const [brands, setBrands] = useState(() => {
    try {
      const cached = localStorage.getItem('livkam_cached_brands');
      if (cached) return JSON.parse(cached);
    } catch (_) {}
    return staticBrands;
  });

  const [services, setServices] = useState(() => {
    try {
      const cached = localStorage.getItem('livkam_cached_services');
      if (cached) return JSON.parse(cached);
    } catch (_) {}
    return staticServices;
  });

  const [posts, setPosts] = useState(staticPosts);
  const [settings, setSettings] = useState(() => {
    try {
      const cached = localStorage.getItem('livkam_cached_settings');
      if (cached) return JSON.parse(cached);
    } catch (_) {}
    return DEFAULT_SETTINGS;
  });
  const [advertisements, setAdvertisements] = useState([]);
  const [heroSlides, setHeroSlides] = useState([]);
  const [isLiveConnected, setIsLiveConnected] = useState(false);

  // Fetch all live data from Supabase
  const refreshAllData = useCallback(async () => {
    try {
      // 1. Fetch Products
      const { data: dbProducts, error: pErr } = await supabase
        .from('products')
        .select(`*, product_images(id, url, display_order)`)
        .eq('is_published', true)
        .order('display_order', { ascending: true });

      if (!pErr && dbProducts && dbProducts.length > 0) {
        const formatted = dbProducts.map(p => {
          // Sort product_images by display_order ascending (order 0 is Primary)
          const sortedImgs = (p.product_images || [])
            .slice()
            .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))
            .map(img => img.url)
            .filter(Boolean);

          const primaryImg = sortedImgs[0] || p.image || '/images/products/online-ups.jpg';
          const allImages = sortedImgs.length > 0 ? sortedImgs : (p.images || [primaryImg]);

          return {
            ...p,
            brand: p.brand_name || p.brand_id,
            brandId: p.brand_id,
            brandName: p.brand_name,
            category: p.category_id || p.category_name,
            categoryId: p.category_id,
            categoryName: p.category_name,
            images: allImages,
            image: primaryImg,
            imageUrl: primaryImg,
            primaryImage: primaryImg,
            originalPrice: p.original_price || p.originalPrice,
            inStock: p.in_stock ?? p.inStock,
            isFeatured: p.is_featured ?? p.isFeatured,
            featured: p.is_featured ?? p.featured,
            isBestseller: p.is_bestseller ?? p.isBestseller,
            bestseller: p.is_bestseller ?? p.bestseller,
            reviewCount: p.review_count || p.reviewCount,
            shortSpecs: p.short_specs || p.shortSpecs || [],
            specs: p.specifications || p.specs || {},
          };
        });

        // Merge: DB products are the primary source of truth, preserve remaining static items
        const dbProductMap = new Map();
        formatted.forEach(p => {
          if (p.id) dbProductMap.set(p.id, p);
          if (p.slug) dbProductMap.set(p.slug, p);
        });

        const mergedProducts = [...formatted];
        staticProducts.forEach(sp => {
          if (!dbProductMap.has(sp.id) && !dbProductMap.has(sp.slug)) {
            mergedProducts.push(sp);
          }
        });

        setProducts(mergedProducts);
        try { localStorage.setItem('livkam_cached_products', JSON.stringify(mergedProducts)); } catch (_) {}
      }

      // 2. Fetch Categories
      const { data: dbCategories, error: cErr } = await supabase
        .from('categories')
        .select('*')
        .eq('is_published', true)
        .order('display_order', { ascending: true });

      if (!cErr && dbCategories && dbCategories.length > 0) {
        const formatted = dbCategories.map(c => {
          const catImg = c.image_url || c.imageUrl || c.image || '';
          return {
            ...c,
            shortDesc: c.short_desc || c.shortDesc,
            itemCount: c.item_count || c.itemCount,
            imageUrl: catImg,
            image: catImg,
            image_url: catImg,
            bannerUrl: c.banner_url || c.bannerUrl || catImg,
            fallbackIcon: c.fallback_icon || c.fallbackIcon || 'Zap',
          };
        });

        const dbCatMap = new Map();
        formatted.forEach(c => {
          if (c.id) dbCatMap.set(c.id, c);
          if (c.slug) dbCatMap.set(c.slug, c);
        });

        const mergedCategories = [...formatted];
        staticCategories.forEach(sc => {
          if (!dbCatMap.has(sc.id) && !dbCatMap.has(sc.slug)) {
            mergedCategories.push(sc);
          }
        });

        setCategories(mergedCategories);
        try { localStorage.setItem('livkam_cached_categories', JSON.stringify(mergedCategories)); } catch (_) {}
      }

      // 3. Fetch Brands
      const { data: dbBrands, error: bErr } = await supabase
        .from('brands')
        .select('*')
        .eq('is_published', true)
        .order('display_order', { ascending: true });

      if (!bErr && dbBrands && dbBrands.length > 0) {
        const formatted = dbBrands.map(b => {
          const img = b.logo_url || b.banner_url || b.image_url || b.logo || b.image || '';
          return {
            ...b,
            fullName: b.full_name || b.fullName || b.name,
            logoText: b.logo_text || b.logoText || b.name,
            subText: b.sub_text || b.subText || '',
            authorizedPartner: b.authorized_partner ?? b.authorizedPartner,
            popularCategories: b.popular_categories || b.popularCategories || [],
            bannerUrl: b.banner_url || b.bannerUrl || img,
            logoUrl: b.logo_url || img,
            image: img,
            logo: img,
            color: b.color || '#0284c7',
          };
        });
        setBrands(formatted);
        try { localStorage.setItem('livkam_cached_brands', JSON.stringify(formatted)); } catch (_) {}
      }

      // 4. Fetch Services
      const { data: dbServices, error: sErr } = await supabase
        .from('services')
        .select('*')
        .eq('is_published', true)
        .order('display_order', { ascending: true });

      if (!sErr && dbServices && dbServices.length > 0) {
        const dbMap = new Map();
        dbServices.forEach(s => {
          if (s.id) dbMap.set(s.id, s);
          if (s.slug) dbMap.set(s.slug, s);
        });

        const formatted = dbServices.map(s => ({
          ...s,
          category: s.category || s.categoryId || 'APC UPS AMC SERVICE',
          categoryId: s.category_id || s.categoryId || s.category,
          rangeItems: s.range_items || s.rangeItems,
          benefitsItems: s.benefits_items || s.benefitsItems,
          shortDesc: s.short_desc || s.shortDesc,
          priceStartsAt: s.price_starts_at || s.priceStartsAt,
          aboutContent: s.about_content || s.aboutContent,
          fourColumns: s.four_columns || s.fourColumns,
          technicalInfo: s.technical_info || s.technicalInfo,
          relatedProducts: s.related_products || s.relatedProducts,
          imageUrl: s.image_url || s.imageUrl || s.image || s.banner,
          image: s.image_url || s.image || s.banner || s.imageUrl,
          banner: s.image_url || s.banner || s.image || s.imageUrl,
        }));

        staticServices.forEach(ss => {
          if (!dbMap.has(ss.id) && !dbMap.has(ss.slug)) {
            formatted.push(ss);
          }
        });

        setServices(formatted);
        try { localStorage.setItem('livkam_cached_services', JSON.stringify(formatted)); } catch (_) {}
      } else {
        setServices(staticServices);
        try { localStorage.setItem('livkam_cached_services', JSON.stringify(staticServices)); } catch (_) {}
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
          coverImage: p.cover_image || p.coverImage,
          readTime: p.read_time || p.readTime,
          createdAt: p.created_at || p.createdAt,
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
        try { localStorage.setItem('livkam_cached_settings', JSON.stringify(merged)); } catch (_) {}
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

    // 1. Local event listener for immediate same-window updates
    const handleLocalSync = () => {
      refreshAllData();
    };
    window.addEventListener('livkam_data_updated', handleLocalSync);

    // 2. Cross-tab synchronization via BroadcastChannel
    let broadcastChannel = null;
    if (typeof BroadcastChannel !== 'undefined') {
      try {
        broadcastChannel = new BroadcastChannel('livkam_sync_channel');
        broadcastChannel.onmessage = (event) => {
          if (event.data?.type === 'DATA_UPDATED') {
            refreshAllData();
          }
        };
      } catch (e) {
        console.warn('BroadcastChannel setup error:', e);
      }
    }

    // 3. Setup Supabase Realtime broadcast listener
    const channel = supabase
      .channel('public:realtime_website_sync')
      .on('postgres_changes', { event: '*', schema: 'public' }, () => {
        refreshAllData();
      })
      .subscribe();

    return () => {
      window.removeEventListener('livkam_data_updated', handleLocalSync);
      if (broadcastChannel) {
        try { broadcastChannel.close(); } catch (_) {}
      }
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
