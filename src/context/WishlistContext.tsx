"use client";

import React, {
  createContext,
  useContext,
  useMemo,
  useEffect,
  useState,
  useCallback,
} from "react";
import { WishlistContextType } from "@/types";
import { Product } from "@/types";
import { useAuth } from "./AuthContext";
import {
  getWishlistFromDB,
  toggleWishlistDB,
  removeFromWishlistDB,
} from "@/lib/services/wishlistService";

interface ExtendedWishlistContextType extends WishlistContextType {
  toggleWishlistWithAuth: (product: Product) => Promise<void>;
  removeFromWishlistWithAuth: (productId: string) => Promise<void>;
  toggleWishlistUniversal: (product: Product) => Promise<void>;
  removeFromWishlistUniversal: (productId: string) => Promise<void>;
  fetchWishlistFromDB: () => Promise<void>;
  isLoadingFromDB: boolean;
}

const WishlistContext = createContext<ExtendedWishlistContextType | undefined>(
  undefined
);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { currentUser, isAuthenticated, openLoginModal } = useAuth();
  const [dbItems, setDbItems] = useState<Product[]>([]);
  const [isLoadingFromDB, setIsLoadingFromDB] = useState(false);
  const [hasLoadedDB, setHasLoadedDB] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  // Wishlist items are ONLY available when authenticated - no localStorage fallback
  const items = isAuthenticated ? dbItems : [];

  const fetchWishlistFromDB = useCallback(async () => {
    if (!isAuthenticated || !currentUser?.id) return;
    
    setIsLoadingFromDB(true);
    try {
      const items = await getWishlistFromDB(currentUser.id);
      setDbItems(items);
    } catch (err) {
      console.error("Failed to fetch wishlist from DB:", err);
    } finally {
      setIsLoadingFromDB(false);
      setHasLoadedDB(true);
    }
  }, [isAuthenticated, currentUser?.id]);

  useEffect(() => {
    if (isAuthenticated && !hasLoadedDB && currentUser?.id) {
      // Use setTimeout to avoid calling setState synchronously in effect
      setTimeout(() => {
        fetchWishlistFromDB();
      }, 0);
    }
  }, [isAuthenticated, hasLoadedDB, currentUser?.id, fetchWishlistFromDB]);

  const toggleWishlist = (product: Product) => {
    if (!isAuthenticated) {
      openLoginModal();
      return;
    }
    const exists = items.some((p) => p.id === product.id);
    setDbItems(exists ? items.filter((p) => p.id !== product.id) : [...items, product]);
  };

  const toggleWishlistWithAuth = async (product: Product) => {
    if (!isAuthenticated || !currentUser?.id) {
      openLoginModal();
      return;
    }

    try {
      const action = await toggleWishlistDB(currentUser.id, product.id);
      if (!action) {
        throw new Error("Failed to toggle wishlist");
      }
      await fetchWishlistFromDB();
    } catch (err) {
      console.error("Failed to toggle wishlist:", err);
      throw err;
    }
  };

  const isInWishlist = (productId: string) =>
    items.some((p) => p.id === productId);

  const removeFromWishlist = (productId: string) => {
    if (!isAuthenticated) {
      openLoginModal();
      return;
    }
    setDbItems(items.filter((p) => p.id !== productId));
  };

  const removeFromWishlistWithAuth = async (productId: string) => {
    if (!isAuthenticated || !currentUser?.id) {
      openLoginModal();
      return;
    }

    try {
      const success = await removeFromWishlistDB(currentUser.id, productId);
      if (!success) {
        throw new Error("Failed to remove from wishlist");
      }
      await fetchWishlistFromDB();
    } catch (err) {
      console.error("Failed to remove from wishlist:", err);
      throw err;
    }
  };

  const wishlistCount = useMemo(() => items.length, [items]);

  const openWishlist = () => {
    if (!isAuthenticated) {
      openLoginModal();
    } else {
      setIsWishlistOpen(true);
    }
  };
  const closeWishlist = () => setIsWishlistOpen(false);

  // All methods now require authentication - they will show login modal if not authenticated
  const toggleWishlistUniversal = useCallback(
    async (product: Product) => {
      await toggleWishlist(product);
    },
    [toggleWishlist]
  );

  const removeFromWishlistUniversal = useCallback(
    async (productId: string) => {
      await removeFromWishlist(productId);
    },
    [removeFromWishlist]
  );

  return (
    <WishlistContext.Provider
      value={{
        items,
        wishlistCount,
        isWishlistOpen,
        toggleWishlist,
        isInWishlist,
        removeFromWishlist,
        openWishlist,
        closeWishlist,
        toggleWishlistWithAuth,
        removeFromWishlistWithAuth,
        toggleWishlistUniversal,
        removeFromWishlistUniversal,
        fetchWishlistFromDB,
        isLoadingFromDB,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = (): ExtendedWishlistContextType => {
  const context = useContext(WishlistContext);
  if (!context)
    throw new Error("useWishlist must be used within a WishlistProvider");
  return context;
};