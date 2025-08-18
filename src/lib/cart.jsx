import React, { useState, useEffect, createContext, useContext } from "react";
import { fetchCart, addToCart, removeFromCart } from "@/lib/api";

const CartContext = createContext(undefined);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch cart from backend using sessionId
  useEffect(() => {
    const loadCart = async () => {
      try {
        const data = await fetchCart();
        setItems(data || []);
      } catch (error) {
        console.error("Failed to load cart:", error);
      } finally {
        setLoading(false);
      }
    };
    loadCart();
  }, []);

  // 🔹 Add product to cart
  const addItem = async (product) => {
    try {
      const data = await addToCart(product._id);
      setItems(data || []);
    } catch (error) {
      console.error("Add to cart failed:", error);
    }
  };

  // 🔹 Remove product from cart
  const removeItem = async (productId) => {
    try {
      const data = await removeFromCart(productId);
      setItems(data || []);
    } catch (error) {
      console.error("Remove from cart failed:", error);
    }
  };

  // 🔹 Helpers
  const total = items.reduce((sum, item) => sum + (Number(item.price) || 0), 0);

  const isInCart = (productId) => {
    return items.some((item) => String(item._id) === String(productId));
  };

  const value = {
    items,
    addItem,
    removeItem,
    total,
    isInCart,
    loading,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
