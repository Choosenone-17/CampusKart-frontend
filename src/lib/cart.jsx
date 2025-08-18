import React, { useState, useEffect, createContext, useContext } from "react";

const CartContext = createContext(undefined);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error("Failed to parse cart from localStorage:", error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  // ✅ Always normalize IDs to strings
  const normalizeId = (id) => String(id);

  const addItem = (product) => {
    const productId = normalizeId(product._id);
    setItems((prevItems) => {
      const exists = prevItems.some((item) => normalizeId(item._id) === productId);
      if (exists) return prevItems;
      return [...prevItems, { ...product, _id: productId }];
    });
  };

  const removeItem = (productId) => {
    const normalized = normalizeId(productId);
    setItems((prevItems) =>
      prevItems.filter((item) => normalizeId(item._id) !== normalized)
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const total = items.reduce(
    (sum, item) => sum + (Number(item.price) || 0),
    0
  );

  const isInCart = (productId) => {
    const normalized = normalizeId(productId);
    return items.some((item) => normalizeId(item._id) === normalized);
  };

  const value = {
    items,
    addItem,
    removeItem,
    clearCart,
    total,
    isInCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
