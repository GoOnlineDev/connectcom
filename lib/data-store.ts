import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { SWR_KEYS } from './swr-config';

// Data store types
export interface DataStoreState {
  // User data
  currentUser: any;
  userProfile: any;
  
  // Shop data
  shops: any[];
  featuredShops: any[];
  recentShops: any[];
  shopCategories: string[];
  homepageStats: any;
  
  // Product data
  products: any[];
  
  // Service data
  services: any[];
  
  // Cart data
  cart: any[];
  cartSummary: any;
  
  // Wishlist data
  wishlist: any[];
  wishlistCount: number;
  
  // Subscription data
  subscriptionPackages: any[];
  subscriptionStats: any;
  
  // Admin data
  adminUsers: any[];
  adminShops: any[];
  adminProducts: any[];
  adminServices: any[];
  
  // Loading states
  isLoading: {
    shops: boolean;
    categories: boolean;
    products: boolean;
    services: boolean;
    cart: boolean;
    wishlist: boolean;
    user: boolean;
  };
  
  // Error states
  errors: {
    shops: string | null;
    categories: string | null;
    products: string | null;
    services: string | null;
    cart: string | null;
    wishlist: string | null;
    user: string | null;
  };
}

// Data store actions
export interface DataStoreActions {
  // Shop actions
  refreshShops: () => void;
  refreshCategories: () => void;
  refreshProducts: () => void;
  refreshServices: () => void;
  refreshCart: () => void;
  refreshWishlist: () => void;
  refreshUser: () => void;
  
  // Search and filter actions
  searchShops: (searchTerm: string, category?: string, shopType?: string) => void;
  getShopsByCategory: (category: string) => void;
  getShopsByOwner: (ownerId: string) => void;
  
  // Cart actions
  addToCart: (item: any) => Promise<void>;
  removeFromCart: (cartId: Id<"carts">) => Promise<void>;
  updateCartQuantity: (cartId: Id<"carts">, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  
  // Wishlist actions
  addToWishlist: (item: any) => Promise<void>;
  removeFromWishlist: (itemId: Id<"products"> | Id<"services">) => Promise<void>;
  clearWishlist: () => Promise<void>;
  
  // User actions
  updateUserProfile: (profile: any) => Promise<void>;
}

// Hook for accessing the data store
export const useDataStore = () => {
  // User data
  const currentUser = useQuery(api.users.getCurrentUser);
  
  // Shop data
  const shops = useQuery(api.shops.getAllApprovedShops);
  const featuredShops = useQuery(api.shops.getFeaturedShops, { limit: 6 });
  const recentShops = useQuery(api.shops.getRecentShops, { limit: 8 });
  const shopCategories = useQuery(api.shops.getAllShopCategories);
  const homepageStats = useQuery(api.shops.getHomepageStats);
  
  // Cart data
  const cart = useQuery(api.carts.getUserCart, {});
  const cartSummary = useQuery(api.carts.getCartSummary);
  
  // Wishlist data
  const wishlist = useQuery(api.wishlists.getUserWishlist, {});
  const wishlistCount = useQuery(api.wishlists.getWishlistCount, {});
  
  // Subscription data
  const subscriptionPackages = useQuery(api.subscriptions.getSubscriptionPackages);
  const subscriptionStats = useQuery(api.subscriptions.getSubscriptionStatistics);
  
  // Mutations
  const addToCartMutation = useMutation(api.carts.addToCart);
  const removeFromCartMutation = useMutation(api.carts.removeFromCart);
  const updateCartQuantityMutation = useMutation(api.carts.updateCartQuantity);
  const clearCartMutation = useMutation(api.carts.clearCart);
  
  const addToWishlistMutation = useMutation(api.wishlists.addToWishlist);
  const removeFromWishlistMutation = useMutation(api.wishlists.removeFromWishlist);
  const clearWishlistMutation = useMutation(api.wishlists.clearWishlist);
  
  // State
  const state: DataStoreState = {
    currentUser,
    userProfile: null,
    shops: shops || [],
    featuredShops: featuredShops || [],
    recentShops: recentShops || [],
    shopCategories: shopCategories || [],
    homepageStats,
    products: [],
    services: [],
    cart: cart || [],
    cartSummary,
    wishlist: wishlist || [],
    wishlistCount: wishlistCount || 0,
    subscriptionPackages: subscriptionPackages || [],
    subscriptionStats,
    adminUsers: [],
    adminShops: [],
    adminProducts: [],
    adminServices: [],
    isLoading: {
      shops: shops === undefined,
      categories: shopCategories === undefined,
      products: false,
      services: false,
      cart: cart === undefined,
      wishlist: wishlist === undefined,
      user: currentUser === undefined,
    },
    errors: {
      shops: null,
      categories: null,
      products: null,
      services: null,
      cart: null,
      wishlist: null,
      user: null,
    },
  };
  
  // Actions
  const actions: DataStoreActions = {
    refreshShops: () => {
      // Convex handles this automatically
    },
    refreshCategories: () => {
      // Convex handles this automatically
    },
    refreshProducts: () => {
      // Convex handles this automatically
    },
    refreshServices: () => {
      // Convex handles this automatically
    },
    refreshCart: () => {
      // Convex handles this automatically
    },
    refreshWishlist: () => {
      // Convex handles this automatically
    },
    refreshUser: () => {
      // Convex handles this automatically
    },
    
    searchShops: (searchTerm: string, category?: string, shopType?: string) => {
      // This would be handled by individual components using useQuery
    },
    
    getShopsByCategory: (category: string) => {
      // This would be handled by individual components using useQuery
    },
    
    getShopsByOwner: (ownerId: string) => {
      // This would be handled by individual components using useQuery
    },
    
    addToCart: async (item: any) => {
      try {
        await addToCartMutation(item);
      } catch (error) {
        console.error('Error adding to cart:', error);
        throw error;
      }
    },
    
    removeFromCart: async (cartId: Id<"carts">) => {
      try {
        await removeFromCartMutation({ cartId });
      } catch (error) {
        console.error('Error removing from cart:', error);
        throw error;
      }
    },
    
    updateCartQuantity: async (cartId: Id<"carts">, quantity: number) => {
      try {
        await updateCartQuantityMutation({ cartId, quantity });
      } catch (error) {
        console.error('Error updating cart quantity:', error);
        throw error;
      }
    },
    
    clearCart: async () => {
      try {
        await clearCartMutation();
      } catch (error) {
        console.error('Error clearing cart:', error);
        throw error;
      }
    },
    
    addToWishlist: async (item: any) => {
      try {
        await addToWishlistMutation(item);
      } catch (error) {
        console.error('Error adding to wishlist:', error);
        throw error;
      }
    },
    
    removeFromWishlist: async (itemId: Id<"products"> | Id<"services">) => {
      try {
        await removeFromWishlistMutation({ itemId });
      } catch (error) {
        console.error('Error removing from wishlist:', error);
        throw error;
      }
    },
    
    clearWishlist: async () => {
      try {
        await clearWishlistMutation();
      } catch (error) {
        console.error('Error clearing wishlist:', error);
        throw error;
      }
    },
    
    updateUserProfile: async (profile: any) => {
      // This would be implemented with a user update mutation
      console.log('Update user profile:', profile);
    },
  };
  
  return {
    state,
    actions,
  };
};

// Utility functions for data manipulation
export const dataStoreUtils = {
  // Calculate category statistics
  getCategoryStats: (shops: any[], categories: string[]) => {
    return categories.map(category => {
      const shopCount = shops.filter(shop => 
        shop.categories?.includes(category)
      ).length;
      
      return {
        name: category,
        shopCount,
        slug: category.toLowerCase().replace(/\s+/g, '-')
      };
    }).filter(cat => cat.shopCount > 0);
  },
  
  // Get trending categories
  getTrendingCategories: (shops: any[], categories: string[], limit: number = 4) => {
    const stats = dataStoreUtils.getCategoryStats(shops, categories);
    return stats
      .sort((a, b) => b.shopCount - a.shopCount)
      .slice(0, limit);
  },
  
  // Search shops
  searchShops: (shops: any[], searchTerm: string, category?: string, shopType?: string) => {
    return shops.filter(shop => {
      const matchesSearch = !searchTerm || 
        shop.shopName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (shop.description && shop.description.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = !category || shop.categories?.includes(category);
      const matchesType = !shopType || shop.shopType === shopType;
      
      return matchesSearch && matchesCategory && matchesType;
    });
  },
  
  // Get shop by ID
  getShopById: (shops: any[], shopId: string) => {
    return shops.find(shop => shop._id === shopId);
  },
  
  // Get shops by owner
  getShopsByOwner: (shops: any[], ownerId: string) => {
    return shops.filter(shop => shop.ownerId === ownerId);
  },
  
  // Get shops by category
  getShopsByCategory: (shops: any[], category: string) => {
    return shops.filter(shop => shop.categories?.includes(category));
  },
};
