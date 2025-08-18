import React, { useState, useEffect, createContext, useContext } from "react";
import api from "@/lib/api"; // axios instance (configured with baseURL, etc.)

const CartContext = createContext(undefined);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch cart from MongoDB (via backend API)
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await api.get("/api/cart");
        setItems(res.data.items || []);
      } catch (error) {
        console.error("Failed to load cart:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  // 🔹 Add product to cart (MongoDB Atlas)
  const addItem = async (product) => {
    try {
      const res = await api.post("/api/cart", { productId: product._id });
      setItems(res.data.items);
    } catch (error) {
      console.error("Add to cart failed:", error);
    }
  };

  // 🔹 Remove product from cart
  const removeItem = async (productId) => {
    try {
      const res = await api.delete(`/api/cart/${productId}`);
      setItems(res.data.items);
    } catch (error) {
      console.error("Remove from cart failed:", error);
    }
  };

  // 🔹 Clear entire cart
  const clearCart = async () => {
    try {
      const res = await api.delete("/api/cart");
      setItems(res.data.items || []);
    } catch (error) {
      console.error("Clear cart failed:", error);
    }
  };

  // 🔹 Helpers
  const total = items.reduce(
    (sum, item) => sum + (Number(item.price) || 0),
    0
  );

  const isInCart = (productId) => {
    return items.some((item) => String(item._id) === String(productId));
  };

  const value = {
    items,
    addItem,
    removeItem,
    clearCart,
    total,
    isInCart,
    loading,
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
