import React, { createContext, useState, useContext, useEffect } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
  const storedCart = localStorage.getItem('cart');
  return storedCart ? JSON.parse(storedCart) : [];
  });
  const [cartTotal, setCartTotal] = useState(0);


  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
    const total = cart.reduce((sum, item) =>sum + (item.variant?.price || 0) * item.quantity, 0);
    setCartTotal(total);
  }, [cart]);

 const addToCart = (product, quantity) => {
  setCart((prev) => {
    const existing = prev.find(
      (item) =>
        item.productId === product.productId &&
        item.variant?.quantity === product.variant.quantity
    );

    const stock = product.variant?.stock || 0;

    if (existing) {
      const newQty = existing.quantity + quantity;

      // 🚫 STOCK LIMIT CHECK
      if (newQty > stock) {
        return prev.map((item) =>
          item.productId === product.productId &&
          item.variant?.quantity === product.variant.quantity
            ? { ...item, quantity: stock } // cap at max stock
            : item
        );
      }

      return prev.map((item) =>
        item.productId === product.productId &&
        item.variant?.quantity === product.variant.quantity
          ? { ...item, quantity: newQty }
          : item
      );
    }

    // 🚫 NEW ITEM STOCK CHECK
    const safeQty = Math.min(quantity, stock);

    return [...prev, { ...product, quantity: safeQty }];
  });
};

 const removeFromCart = (productId, variantQty) => {
  setCart((prev) =>
    prev.filter(
      (item) =>
        !(
          item.productId === productId &&
          item.variant?.quantity === variantQty
        )
    )
  );
};

 const updateQuantity = (productId, variantQty, newQty) => {
  setCart((prev) =>
    prev.map((item) => {
      if (
        item.productId === productId &&
        item.variant?.quantity === variantQty
      ) {
        if (newQty > (item.variant?.stock || 0)) {
          return item; 
        }

        if (newQty < 1) return item;

        return { ...item, quantity: newQty };
      }
      return item;
    })
  );
};

  const clearCart = () => {
    setCart([]);
  };

  const getCartItemsCount = () => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  };

  const value = {
    cart,
    cartTotal,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartItemsCount
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
