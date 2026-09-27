import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('livkam_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('livkam_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('livkam_orders');
      if (saved) return JSON.parse(saved);
      // Sample mock initial order for demonstration
      return [
        {
          id: "ORD-2026-89412",
          date: "Sep 22, 2026",
          items: [
            {
              id: "apc-smart-ups-1000va",
              name: "APC Smart-UPS 1000VA",
              price: 42000,
              quantity: 1,
              brandName: "APC"
            }
          ],
          total: 42000,
          status: "Delivered",
          shippingAddress: "21, Subhash Chandra Bose Rd, Banashankari 2nd Stage, Bengaluru, Karnataka 560070",
          paymentMethod: "UPI / Net Banking"
        }
      ];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem('livkam_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('livkam_user');
      }
    } catch (e) {
      console.error(e);
    }
  }, [user]);

  useEffect(() => {
    try {
      localStorage.setItem('livkam_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error(e);
    }
  }, [wishlist]);

  useEffect(() => {
    try {
      localStorage.setItem('livkam_orders', JSON.stringify(orders));
    } catch (e) {
      console.error(e);
    }
  }, [orders]);

  const login = (email, password) => {
    // Simulated realistic user authentication
    const newUser = {
      id: "usr_" + Date.now(),
      name: email.split('@')[0].toUpperCase(),
      email: email,
      phone: "+91 9876543210",
      company: "Livkam Power Client",
      gstin: "29AAAAA0000A1Z5",
      address: "Banashankari 2nd Stage, Bengaluru 560070"
    };
    setUser(newUser);
    return true;
  };

  const register = (userData) => {
    const newUser = {
      id: "usr_" + Date.now(),
      name: userData.name || "Customer",
      email: userData.email,
      phone: userData.phone || "+91 8884988990",
      company: userData.company || "",
      gstin: userData.gstin || "",
      address: userData.address || "Bengaluru, Karnataka"
    };
    setUser(newUser);
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  const toggleWishlist = (productId) => {
    setWishlist((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  const isWishlisted = (productId) => {
    return wishlist.includes(productId);
  };

  const addOrder = (orderData) => {
    const newOrder = {
      id: `ORD-2026-${Math.floor(10000 + Math.random() * 90000)}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: 'Processing',
      ...orderData
    };
    setOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        login,
        register,
        logout,
        wishlist,
        toggleWishlist,
        isWishlisted,
        orders,
        addOrder
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
