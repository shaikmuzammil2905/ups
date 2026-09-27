import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('livkam_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem('livkam_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cartItems]);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const addToCart = (product, quantity = 1) => {
    if (!product) return;
    
    setCartItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [
          ...prev,
          {
            id: product.id,
            name: product.name,
            slug: product.slug,
            price: product.price,
            originalPrice: product.originalPrice || product.price,
            brandName: product.brandName,
            brandId: product.brandId,
            categoryId: product.categoryId,
            categoryName: product.categoryName,
            capacity: product.capacity,
            sku: product.sku,
            quantity: quantity,
            inStock: product.inStock !== false
          }
        ];
      }
    });

    showToast(`Added "${product.name}" to your cart`);
  };

  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const originalSubtotal = cartItems.reduce(
    (acc, item) => acc + (item.originalPrice || item.price) * item.quantity,
    0
  );
  const discount = originalSubtotal > subtotal ? originalSubtotal - subtotal : 0;
  const deliveryFee = subtotal > 10000 || subtotal === 0 ? 0 : 499;
  const gstIncluded = true; // Prices in India are typically GST inclusive, but we show the breakdown
  const gstAmount = Math.round((subtotal * 18) / 118); // 18% GST portion
  const finalTotal = subtotal + (deliveryFee > 0 ? deliveryFee : 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        totalItems,
        subtotal,
        originalSubtotal,
        discount,
        deliveryFee,
        gstAmount,
        finalTotal,
        isCartOpen,
        openCart: () => setIsCartOpen(true),
        closeCart: () => setIsCartOpen(false),
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toastMessage,
        hideToast: () => setToastMessage(null)
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
