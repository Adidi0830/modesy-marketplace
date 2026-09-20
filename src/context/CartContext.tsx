"use client";

import React, {
  createContext,
  useContext,
  useMemo,
  useEffect,
  useState,
  useCallback,
} from "react";
import { CartContextType, CartItem, Product } from "@/types";
import { useAuth } from "./AuthContext";
import {
  getCartFromDB,
  addToCartDB,
  updateCartQuantityDB,
  removeFromCartDB,
  clearCartDB,
} from "@/lib/services/cartService";

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { currentUser, isAuthenticated, openLoginModal } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch cart items directly from Supabase via cartService
  const fetchCartFromDB = useCallback(async (userId?: string) => {
    const targetUserId = userId || currentUser?.id;
    if (!targetUserId) {
      setItems([]);
      return;
    }

    setIsLoading(true);
    try {
      const dbItems = await getCartFromDB(targetUserId);
      setItems(dbItems);
    } catch (err) {
      console.error("Failed to fetch cart from database:", err);
    } finally {
      setIsLoading(false);
    }
  }, [currentUser?.id]);

  // Load from database when authenticated user changes
  useEffect(() => {
    if (isAuthenticated && currentUser?.id) {
      fetchCartFromDB(currentUser.id);
    } else {
      setItems([]);
    }
  }, [isAuthenticated, currentUser?.id, fetchCartFromDB]);

  const addToCart = useCallback(
    async (product: Product, quantity = 1) => {
      if (!isAuthenticated || !currentUser?.id) {
        openLoginModal();
        return;
      }

      const userId = currentUser.id;

      // Optimistic local state update
      setItems((prev) => {
        const idx = prev.findIndex((i) => i.product.id === product.id);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = { ...next[idx], quantity: next[idx].quantity + quantity };
          return next;
        }
        return [...prev, { product, quantity }];
      });

      try {
        const success = await addToCartDB(userId, product.id, quantity);
        if (!success) {
          throw new Error("Failed to add to cart in database");
        }
        await fetchCartFromDB(userId);
      } catch (err) {
        console.error("Error storing cart item to database:", err);
        await fetchCartFromDB(userId);
        throw err;
      }
    },
    [isAuthenticated, currentUser?.id, openLoginModal, fetchCartFromDB]
  );

  const removeFromCart = useCallback(
    async (productId: string) => {
      if (!isAuthenticated || !currentUser?.id) return;

      const userId = currentUser.id;

      // Optimistic update
      setItems((prev) => prev.filter((i) => i.product.id !== productId));

      try {
        const success = await removeFromCartDB(userId, productId);
        if (!success) {
          throw new Error("Failed to remove item from database cart");
        }
        await fetchCartFromDB(userId);
      } catch (err) {
        console.error("Error removing cart item from database:", err);
        await fetchCartFromDB(userId);
      }
    },
    [isAuthenticated, currentUser?.id, fetchCartFromDB]
  );

  const updateQuantity = useCallback(
    async (productId: string, quantity: number) => {
      if (!isAuthenticated || !currentUser?.id) return;

      const validQty = Math.max(1, quantity);
      const userId = currentUser.id;

      // Optimistic update
      setItems((prev) => {
        const idx = prev.findIndex((i) => i.product.id === productId);
        if (idx < 0) return prev;
        const next = [...prev];
        next[idx] = { ...next[idx], quantity: validQty };
        return next;
      });

      try {
        const success = await updateCartQuantityDB(userId, productId, validQty);
        if (!success) {
          throw new Error("Failed to update quantity in database");
        }
        await fetchCartFromDB(userId);
      } catch (err) {
        console.error("Error updating cart quantity in database:", err);
        await fetchCartFromDB(userId);
      }
    },
    [isAuthenticated, currentUser?.id, fetchCartFromDB]
  );

  const clearCart = useCallback(async () => {
    if (!isAuthenticated || !currentUser?.id) {
      setItems([]);
      return;
    }

    const userId = currentUser.id;
    setItems([]);

    try {
      const success = await clearCartDB(userId);
      if (!success) {
        throw new Error("Failed to clear database cart");
      }
      await fetchCartFromDB(userId);
    } catch (err) {
      console.error("Error clearing database cart:", err);
      await fetchCartFromDB(userId);
    }
  }, [isAuthenticated, currentUser?.id, fetchCartFromDB]);

  const cartCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const cartSubtotal = useMemo(
    () => items.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0),
    [items]
  );

  return (
    <CartContext.Provider
      value={{
        items,
        cartCount,
        cartSubtotal,
        isCartOpen,
        openCart: () => {
          if (!isAuthenticated) {
            openLoginModal();
          } else {
            setIsCartOpen(true);
          }
        },
        closeCart: () => setIsCartOpen(false),
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
