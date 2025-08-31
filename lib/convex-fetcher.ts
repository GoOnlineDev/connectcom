import { api } from '@/convex/_generated/api';
import { FunctionReference } from 'convex/server';

// Type for Convex query arguments
type ConvexQueryArgs = Record<string, any>;

// Convex fetcher for SWR
export const convexFetcher = async <T>(
  queryRef: FunctionReference<'query'>,
  args?: ConvexQueryArgs
): Promise<T> => {
  try {
    // For now, we'll use a simple approach
    // In a real implementation, you'd need to call the Convex function directly
    // This is a placeholder that will be replaced with actual Convex integration
    
    // Simulate a delay to show loading states
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // This will be replaced with actual Convex function calls
    throw new Error('Convex fetcher not yet implemented - use useQuery directly');
  } catch (error) {
    console.error('Convex fetcher error:', error);
    throw error;
  }
};

// Helper function to create a fetcher for a specific Convex query
export const createConvexFetcher = <T>(
  queryRef: FunctionReference<'query'>
) => {
  return (args?: ConvexQueryArgs): Promise<T> => {
    return convexFetcher<T>(queryRef, args);
  };
};

// Pre-configured fetchers for common queries
export const convexFetchers = {
  // User fetchers
  getCurrentUser: createConvexFetcher(api.users.getCurrentUser),
  
  // Shop fetchers
  getAllApprovedShops: createConvexFetcher(api.shops.getAllApprovedShops),
  getFeaturedShops: createConvexFetcher(api.shops.getFeaturedShops),
  getRecentShops: createConvexFetcher(api.shops.getRecentShops),
  getShopById: createConvexFetcher(api.shops.getShopById),
  getShopsByOwner: createConvexFetcher(api.shops.getShopsByOwner),
  getShopsByCategory: createConvexFetcher(api.shops.getShopsByCategory),
  getAllShopCategories: createConvexFetcher(api.shops.getAllShopCategories),
  searchShops: createConvexFetcher(api.shops.searchShops),
  getHomepageStats: createConvexFetcher(api.shops.getHomepageStats),
  
  // Product fetchers
  getProductsByShop: createConvexFetcher(api.products.getProductsByShop),
  getProductById: createConvexFetcher(api.products.getProductById),
  
  // Service fetchers
  getServicesByShop: createConvexFetcher(api.services.getServicesByShop),
  getServiceById: createConvexFetcher(api.services.getServiceById),
  
  // Shelf fetchers
  getShopShelves: createConvexFetcher(api.shelves.getShopShelves),
  getShelfById: createConvexFetcher(api.shelves.getShelfById),
  
  // Cart fetchers
  getUserCart: createConvexFetcher(api.carts.getUserCart),
  getCartSummary: createConvexFetcher(api.carts.getCartSummary),
  
  // Wishlist fetchers
  getUserWishlist: createConvexFetcher(api.wishlists.getUserWishlist),
  getWishlistCount: createConvexFetcher(api.wishlists.getWishlistCount),
  
  // Subscription fetchers
  getSubscriptionPackages: createConvexFetcher(api.subscriptions.getSubscriptionPackages),
  getSubscriptionStatistics: createConvexFetcher(api.subscriptions.getSubscriptionStatistics),
  
  // Admin fetchers
  getUsers: createConvexFetcher(api.admin.getUsers),
  getShops: createConvexFetcher(api.admin.getShops),
  getProducts: createConvexFetcher(api.admin.getProducts),
  getServices: createConvexFetcher(api.admin.getServices),
} as const;
