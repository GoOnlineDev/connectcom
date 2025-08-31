# Data Management System

This document explains the centralized data management system that combines SWR (Stale-While-Revalidate) with Convex for optimal performance and user experience.

## Overview

The data management system provides:
- **Centralized data access** for all application data
- **Automatic caching** and revalidation with SWR
- **Real-time updates** with Convex
- **Type-safe** data fetching
- **Optimized performance** with intelligent caching strategies

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Components    │    │   Data Hooks    │    │   Convex DB     │
│                 │    │                 │    │                 │
│ - Pages         │───▶│ - useData       │───▶│ - Queries       │
│ - UI Components │    │ - useShops      │    │ - Mutations     │
│ - Forms         │    │ - useCategories │    │ - Real-time     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │   SWR Cache     │
                       │                 │
                       │ - Stale data    │
                       │ - Revalidation  │
                       │ - Deduplication │
                       └─────────────────┘
```

## Core Files

### 1. Configuration (`lib/swr-config.ts`)
- Global SWR configuration
- Cache keys for different data types
- Revalidation strategies

### 2. Data Hooks (`hooks/useData.ts`)
- Centralized data access hooks
- Type-safe data fetching
- Loading and error states

### 3. Data Store (`lib/data-store.ts`)
- Global state management
- Data manipulation utilities
- Action handlers

### 4. Providers (`providers/swr-provider.tsx`)
- SWR context provider
- Global configuration

## Usage Examples

### Basic Data Fetching

```tsx
import { useShops, useCategories, useHomepageStats } from '@/hooks/useData';

function HomePage() {
  const { data: shops, isLoading: shopsLoading } = useShops();
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { data: stats, isLoading: statsLoading } = useHomepageStats();

  if (shopsLoading || categoriesLoading || statsLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <h1>Welcome to ConnectCom</h1>
      <p>Total Shops: {stats?.activeShops}</p>
      <p>Categories: {categories?.length}</p>
      {/* Render shops */}
    </div>
  );
}
```

### Filtered Data

```tsx
import { useShopsByCategory, useSearchShops } from '@/hooks/useData';

function CategoryPage({ category }) {
  const { data: shops, isLoading } = useShopsByCategory(category);
  
  return (
    <div>
      <h1>{category} Shops</h1>
      {isLoading ? <LoadingSpinner /> : <ShopGrid shops={shops} />}
    </div>
  );
}

function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: shops, isLoading } = useSearchShops(searchTerm);
  
  return (
    <div>
      <input 
        value={searchTerm} 
        onChange={(e) => setSearchTerm(e.target.value)} 
      />
      {isLoading ? <LoadingSpinner /> : <ShopGrid shops={shops} />}
    </div>
  );
}
```

### User-Specific Data

```tsx
import { useCurrentUser, useShopsByOwner, useCart } from '@/hooks/useData';

function UserDashboard() {
  const { data: user, isLoading: userLoading } = useCurrentUser();
  const { data: userShops, isLoading: shopsLoading } = useShopsByOwner(user?.clerkId);
  const { data: cart, isLoading: cartLoading } = useCart();

  return (
    <div>
      <h1>Welcome, {user?.firstName}</h1>
      <div>Your Shops: {userShops?.length}</div>
      <div>Cart Items: {cart?.length}</div>
    </div>
  );
}
```

### Mutations and Actions

```tsx
import { useDataStore } from '@/lib/data-store';

function ProductCard({ product }) {
  const { actions } = useDataStore();
  
  const handleAddToCart = async () => {
    try {
      await actions.addToCart({
        itemType: 'product',
        itemId: product._id,
        shopId: product.shopId,
        quantity: 1
      });
      toast.success('Added to cart!');
    } catch (error) {
      toast.error('Failed to add to cart');
    }
  };

  const handleAddToWishlist = async () => {
    try {
      await actions.addToWishlist({
        itemType: 'product',
        itemId: product._id,
        shopId: product.shopId
      });
      toast.success('Added to wishlist!');
    } catch (error) {
      toast.error('Failed to add to wishlist');
    }
  };

  return (
    <div>
      <h3>{product.name}</h3>
      <button onClick={handleAddToCart}>Add to Cart</button>
      <button onClick={handleAddToWishlist}>Add to Wishlist</button>
    </div>
  );
}
```

## Available Hooks

### User Data
- `useCurrentUser()` - Current authenticated user
- `useUserProfile(userId)` - User profile by ID

### Shop Data
- `useShops()` - All approved shops
- `useShop(shopId)` - Single shop by ID
- `useShopsByOwner(ownerId)` - Shops owned by user
- `useFeaturedShops(limit)` - Featured shops
- `useRecentShops(limit)` - Recently added shops
- `useShopsByCategory(category, limit)` - Shops by category
- `useSearchShops(searchTerm, category, shopType)` - Search shops

### Category Data
- `useCategories()` - All shop categories
- `useCategoryStats()` - Category statistics with shop counts
- `useTrendingCategories()` - Most popular categories

### Product Data
- `useProducts()` - All products
- `useProductsByShop(shopId)` - Products by shop
- `useProduct(productId)` - Single product

### Service Data
- `useServices()` - All services
- `useServicesByShop(shopId)` - Services by shop
- `useService(serviceId)` - Single service

### Cart & Wishlist
- `useCart()` - User's cart
- `useCartSummary()` - Cart summary
- `useWishlist()` - User's wishlist
- `useWishlistCount()` - Wishlist count

### Admin Data
- `useAdminUsers()` - All users (admin)
- `useAdminShops()` - All shops (admin)
- `useAdminProducts()` - All products (admin)
- `useAdminServices()` - All services (admin)

### Homepage Data
- `useHomepageStats()` - Platform statistics
- `useTrendingCategories()` - Trending categories

## Data Store Actions

The data store provides actions for common operations:

```tsx
const { actions } = useDataStore();

// Cart actions
await actions.addToCart(item);
await actions.removeFromCart(itemId);
await actions.updateCartQuantity(itemId, quantity);
await actions.clearCart();

// Wishlist actions
await actions.addToWishlist(item);
await actions.removeFromWishlist(itemId);
await actions.clearWishlist();

// User actions
await actions.updateUserProfile(profile);
```

## Performance Optimizations

### 1. Automatic Caching
- SWR caches data automatically
- Stale data shown immediately while revalidating
- Deduplication prevents duplicate requests

### 2. Intelligent Revalidation
- Revalidate on focus
- Revalidate on reconnect
- Configurable revalidation intervals

### 3. Optimistic Updates
- UI updates immediately
- Rollback on error
- Better user experience

### 4. Background Updates
- Data updates in background
- No blocking UI operations
- Seamless user experience

## Error Handling

All hooks provide error states:

```tsx
const { data, isLoading, error } = useShops();

if (error) {
  return <ErrorMessage error={error} />;
}

if (isLoading) {
  return <LoadingSpinner />;
}

return <ShopGrid shops={data} />;
```

## Best Practices

### 1. Use Specific Hooks
```tsx
// ✅ Good - Use specific hook
const { data: shops } = useShopsByCategory('fashion');

// ❌ Bad - Don't fetch all data and filter
const { data: allShops } = useShops();
const shops = allShops?.filter(s => s.categories.includes('fashion'));
```

### 2. Handle Loading States
```tsx
// ✅ Good - Show loading state
if (isLoading) return <LoadingSpinner />;

// ❌ Bad - Don't render with undefined data
return <ShopGrid shops={data} />; // data might be undefined
```

### 3. Use Error Boundaries
```tsx
// ✅ Good - Handle errors gracefully
if (error) {
  return <ErrorMessage error={error} retry={() => mutate()} />;
}
```

### 4. Optimize Re-renders
```tsx
// ✅ Good - Memoize expensive operations
const trendingCategories = useMemo(() => 
  dataStoreUtils.getTrendingCategories(shops, categories, 4),
  [shops, categories]
);
```

## Migration Guide

### From Direct Convex Queries

**Before:**
```tsx
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

function Component() {
  const shops = useQuery(api.shops.getAllApprovedShops);
  const categories = useQuery(api.shops.getAllShopCategories);
  
  if (shops === undefined || categories === undefined) {
    return <LoadingSpinner />;
  }
  
  return <ShopGrid shops={shops} categories={categories} />;
}
```

**After:**
```tsx
import { useShops, useCategories } from '@/hooks/useData';

function Component() {
  const { data: shops, isLoading: shopsLoading } = useShops();
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  
  if (shopsLoading || categoriesLoading) {
    return <LoadingSpinner />;
  }
  
  return <ShopGrid shops={shops} categories={categories} />;
}
```

### Benefits of Migration

1. **Consistent API** - All data access follows the same pattern
2. **Better Error Handling** - Centralized error management
3. **Performance** - Automatic caching and optimization
4. **Type Safety** - Better TypeScript support
5. **Maintainability** - Centralized data logic

## Troubleshooting

### Common Issues

1. **Data not updating**
   - Check if Convex query is properly configured
   - Verify SWR cache keys are unique
   - Ensure mutations trigger revalidation

2. **Performance issues**
   - Use specific hooks instead of fetching all data
   - Implement proper loading states
   - Consider pagination for large datasets

3. **Type errors**
   - Ensure proper TypeScript types
   - Check Convex schema definitions
   - Verify hook return types

### Debug Tools

1. **SWR DevTools** - Browser extension for debugging
2. **Convex Dashboard** - Monitor queries and mutations
3. **React DevTools** - Inspect component state

## Future Enhancements

1. **Offline Support** - Cache data for offline access
2. **Pagination** - Handle large datasets efficiently
3. **Real-time Subscriptions** - Enhanced real-time updates
4. **Analytics Integration** - Track data usage patterns
5. **Advanced Caching** - Custom cache strategies
