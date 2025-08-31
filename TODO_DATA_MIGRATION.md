# 🚀 Data Migration Todo List

## 📋 Overview
This document tracks the migration of all components and pages from direct Convex queries to the new centralized data hooks system using SWR + Convex.

## ✅ Completed
- [x] **Navigation Component** (`components/navigation.tsx`)
- [x] **CustomUserButton Component** (`components/user-button.tsx`)
- [x] **Featured Shops Component** (`components/home/featured-shops.tsx`)

---

## 🔄 In Progress
*None currently*

---

## 📝 Todo List

### 🏠 **Main Pages & Components**

#### **Homepage Components** (`components/home/`)
- [ ] **Hero Section** (`components/home/hero-section.tsx`)
  - [ ] Replace direct Convex queries with `useHomepageStats`
  - [ ] Add loading states
  - [ ] Test responsive design

- [ ] **Trending Categories** (`components/home/trending-categories.tsx`)
  - [ ] Replace direct Convex queries with `useTrendingCategories`
  - [ ] Add loading states
  - [ ] Test category navigation

- [ ] **Recent Shops** (`components/home/recent-shops.tsx`)
  - [ ] Replace direct Convex queries with `useRecentShops`
  - [ ] Add loading states
  - [ ] Test shop links

- [ ] **Homepage Stats** (`components/home/homepage-stats.tsx`)
  - [ ] Replace direct Convex queries with `useHomepageStats`
  - [ ] Add loading states
  - [ ] Test statistics display

- [ ] **Shop Categories** (`components/home/shop-categories.tsx`)
  - [ ] Replace direct Convex queries with `useCategories`
  - [ ] Add loading states
  - [ ] Test category filtering

- [ ] **Testimonials** (`components/home/testimonials.tsx`)
  - [ ] Replace direct Convex queries with `useTestimonials` (if exists)
  - [ ] Add loading states
  - [ ] Test testimonial display

- [ ] **How It Works** (`components/home/how-it-works.tsx`)
  - [ ] Replace direct Convex queries with `useHowItWorks` (if exists)
  - [ ] Add loading states
  - [ ] Test step display

#### **Main Pages** (`app/(main)/`)
- [ ] **Homepage** (`app/(main)/page.tsx`)
  - [ ] Replace direct Convex queries with centralized hooks
  - [ ] Add loading states
  - [ ] Test all sections

- [ ] **Shops Page** (`app/(main)/shops/page.tsx`)
  - [ ] Replace direct Convex queries with `useShops`, `useCategories`
  - [ ] Add loading states
  - [ ] Test filtering and sorting
  - [ ] Test search functionality

- [ ] **Shop Detail Page** (`app/(main)/shops/[id]/page.tsx`)
  - [ ] Replace direct Convex queries with `useShop`, `useProductsByShop`, `useServicesByShop`
  - [ ] Add loading states
  - [ ] Test shop details display
  - [ ] Test products/services listing

- [ ] **Categories Page** (`app/(main)/categories/page.tsx`)
  - [ ] Replace direct Convex queries with `useCategories`
  - [ ] Add loading states
  - [ ] Test category grid

- [ ] **Category Detail Page** (`app/(main)/categories/[category]/page.tsx`)
  - [ ] Replace direct Convex queries with `useShopsByCategory`
  - [ ] Add loading states
  - [ ] Test category filtering

- [ ] **Cart Page** (`app/(main)/cart/page.tsx`)
  - [ ] Replace direct Convex queries with `useCart`, `useCartSummary`
  - [ ] Add loading states
  - [ ] Test cart operations (add/remove/update)
  - [ ] Test checkout flow

- [ ] **Wishlist Page** (`app/(main)/wishlist/page.tsx`)
  - [ ] Replace direct Convex queries with `useWishlist`
  - [ ] Add loading states
  - [ ] Test wishlist operations (add/remove)
  - [ ] Test wishlist display

- [ ] **About Page** (`app/(main)/about/page.tsx`)
  - [ ] Replace direct Convex queries with `useAboutData` (if exists)
  - [ ] Add loading states
  - [ ] Test content display

- [ ] **Contact Page** (`app/(main)/contact/page.tsx`)
  - [ ] Replace direct Convex queries with `useContactData` (if exists)
  - [ ] Add loading states
  - [ ] Test contact form

- [ ] **Policy Page** (`app/(main)/policy/page.tsx`)
  - [ ] Replace direct Convex queries with `usePolicyData` (if exists)
  - [ ] Add loading states
  - [ ] Test policy display

- [ ] **Terms Page** (`app/(main)/terms/page.tsx`)
  - [ ] Replace direct Convex queries with `useTermsData` (if exists)
  - [ ] Add loading states
  - [ ] Test terms display

#### **Other Components**
- [ ] **Footer Component** (`components/footer.tsx`)
  - [ ] Replace direct Convex queries with `useFooterData` (if exists)
  - [ ] Add loading states
  - [ ] Test footer links

---

### 🏢 **Dashboard Pages & Components**

#### **Dashboard Components** (`components/dashboard/`)
- [ ] **Dashboard Navbar** (`components/dashboard/navbar.tsx`)
  - [ ] Replace direct Convex queries with `useCurrentUser`, `useNotifications`
  - [ ] Add loading states
  - [ ] Test user menu

- [ ] **Dashboard Sidebar** (`components/dashboard/sidebar.tsx`)
  - [ ] Replace direct Convex queries with `useCurrentUser`, `useUserStats`
  - [ ] Add loading states
  - [ ] Test navigation menu

- [ ] **Dashboard Footer** (`components/dashboard/footer.tsx`)
  - [ ] Replace direct Convex queries with `useFooterData` (if exists)
  - [ ] Add loading states
  - [ ] Test footer display

#### **Admin Pages** (`app/(dashboard)/admin/`)
- [ ] **Admin Dashboard** (`app/(dashboard)/admin/page.tsx`)
  - [ ] Replace direct Convex queries with `useAdminStats`, `useAdminUsers`, `useAdminShops`
  - [ ] Add loading states
  - [ ] Test admin dashboard

- [ ] **Admin Users** (`app/(dashboard)/admin/users/page.tsx`)
  - [ ] Replace direct Convex queries with `useAdminUsers`
  - [ ] Add loading states
  - [ ] Test user management

- [ ] **Admin Shops** (`app/(dashboard)/admin/shops/page.tsx`)
  - [ ] Replace direct Convex queries with `useAdminShops`
  - [ ] Add loading states
  - [ ] Test shop management

- [ ] **Admin Shop Detail** (`app/(dashboard)/admin/shops/[id]/page.tsx`)
  - [ ] Replace direct Convex queries with `useShop`, `useShopAnalytics`
  - [ ] Add loading states
  - [ ] Test shop details

- [ ] **Admin Shop Approve** (`app/(dashboard)/admin/shops/approve/page.tsx`)
  - [ ] Replace direct Convex queries with `usePendingShops`
  - [ ] Add loading states
  - [ ] Test approval workflow

- [ ] **Admin Subscriptions** (`app/(dashboard)/admin/subscriptions/page.tsx`)
  - [ ] Replace direct Convex queries with `useSubscriptionStats`, `useAdminSubscriptions`
  - [ ] Add loading states
  - [ ] Test subscription management

#### **Vendor Pages** (`app/(dashboard)/vendor/`)
- [ ] **Vendor Dashboard** (`app/(dashboard)/vendor/page.tsx`)
  - [ ] Replace direct Convex queries with `useVendorStats`, `useShopsByOwner`
  - [ ] Add loading states
  - [ ] Test vendor dashboard

- [ ] **Vendor Shops** (`app/(dashboard)/vendor/shops/page.tsx`)
  - [ ] Replace direct Convex queries with `useShopsByOwner`
  - [ ] Add loading states
  - [ ] Test shop management

---

### 🚀 **Onboarding Pages**
- [ ] **Shop Onboarding** (`app/onboarding/shop/page.tsx`)
  - [ ] Replace direct Convex queries with `useCurrentUser`
  - [ ] Add loading states
  - [ ] Test onboarding flow

- [ ] **Success Page** (`app/onboarding/success/page.tsx`)
  - [ ] Replace direct Convex queries with `useCurrentUser`
  - [ ] Add loading states
  - [ ] Test success display

---

## 🔧 **Convex Functions Review & Optimization**

### **Schema Review** (`convex/schema.ts`)
- [ ] **Review all indexes**
  - [ ] Verify `by_status_and_category` index for shops
  - [ ] Verify `by_status_and_shopType` index for shops
  - [ ] Check for missing indexes
  - [ ] Optimize query performance

### **Users Functions** (`convex/users.ts`)
- [ ] **Review existing queries**
  - [ ] `getCurrentUser` - optimize for performance
  - [ ] `getUserById` - verify implementation
  - [ ] `createOrGetUser` - check for race conditions
  - [ ] Add missing user queries if needed

### **Shops Functions** (`convex/shops.ts`)
- [ ] **Review existing queries**
  - [ ] `getAllApprovedShops` - optimize filtering
  - [ ] `getShopsByCategory` - verify category filtering
  - [ ] `getFeaturedShops` - check selection logic
  - [ ] `getRecentShops` - verify date sorting
  - [ ] `getHomepageStats` - optimize aggregation
  - [ ] `getAllShopCategories` - check category extraction
  - [ ] Add missing shop queries if needed

### **Products Functions** (`convex/products.ts`)
- [ ] **Review existing queries**
  - [ ] Check for missing product queries
  - [ ] Optimize product filtering
  - [ ] Add product search functionality
  - [ ] Verify product-shop relationships

### **Services Functions** (`convex/services.ts`)
- [ ] **Review existing queries**
  - [ ] Check for missing service queries
  - [ ] Optimize service filtering
  - [ ] Add service search functionality
  - [ ] Verify service-shop relationships

### **Carts Functions** (`convex/carts.ts`)
- [ ] **Review existing queries**
  - [ ] `getUserCart` - optimize for performance
  - [ ] `getCartSummary` - verify calculation logic
  - [ ] Check cart operations (add/remove/update)
  - [ ] Add missing cart queries if needed

### **Wishlists Functions** (`convex/wishlists.ts`)
- [ ] **Review existing queries**
  - [ ] `getUserWishlist` - optimize for performance
  - [ ] `getWishlistCount` - verify count logic
  - [ ] Check wishlist operations (add/remove)
  - [ ] Add missing wishlist queries if needed

### **Shelves Functions** (`convex/shelves.ts`)
- [ ] **Review existing queries**
  - [ ] `getShelfById` - verify implementation
  - [ ] Check shelf-shop relationships
  - [ ] Add missing shelf queries if needed

### **Subscriptions Functions** (`convex/subscriptions.ts`)
- [ ] **Review existing queries**
  - [ ] Check subscription management
  - [ ] Verify subscription stats
  - [ ] Add missing subscription queries if needed

### **Admin Functions** (`convex/admin.ts`)
- [ ] **Review existing queries**
  - [ ] Check admin-specific queries
  - [ ] Verify admin permissions
  - [ ] Add missing admin queries if needed

---

## 🧪 **Testing & Quality Assurance**

### **Component Testing**
- [ ] **Test all migrated components**
  - [ ] Verify loading states work correctly
  - [ ] Test error handling
  - [ ] Verify data updates in real-time
  - [ ] Test responsive design

### **Performance Testing**
- [ ] **Monitor performance**
  - [ ] Check bundle size impact
  - [ ] Monitor network requests
  - [ ] Test caching effectiveness
  - [ ] Verify SWR optimization

### **Integration Testing**
- [ ] **Test data flow**
  - [ ] Verify data consistency across components
  - [ ] Test data synchronization
  - [ ] Verify real-time updates
  - [ ] Test offline functionality

---

## 📊 **Monitoring & Analytics**

### **Data Usage Tracking**
- [ ] **Monitor hook usage**
  - [ ] Track most used hooks
  - [ ] Monitor cache hit rates
  - [ ] Track performance metrics
  - [ ] Identify optimization opportunities

### **Error Tracking**
- [ ] **Monitor errors**
  - [ ] Track hook errors
  - [ ] Monitor data fetching failures
  - [ ] Track user experience issues
  - [ ] Implement error recovery

---

## 🎯 **Priority Levels**

### **🔥 High Priority**
1. **Shops Page** - Core functionality
2. **Cart Page** - E-commerce essential
3. **Wishlist Page** - User engagement
4. **Admin Dashboard** - Business critical

### **⚡ Medium Priority**
1. **Homepage Components** - User experience
2. **Category Pages** - Navigation
3. **Vendor Dashboard** - Business operations
4. **Dashboard Components** - Admin experience

### **📝 Low Priority**
1. **Static Pages** (About, Contact, Policy, Terms)
2. **Onboarding Pages** - One-time use
3. **Footer Component** - Non-critical

---

## 📝 **Notes**

### **Migration Strategy**
- Start with high-priority pages
- Test each component thoroughly before moving to next
- Keep original files as backup until migration is complete
- Monitor performance impact throughout migration

### **Rollback Plan**
- Keep original Convex queries as comments
- Maintain feature flags for gradual rollout
- Have backup implementation ready

### **Success Criteria**
- All components use centralized data hooks
- No direct Convex imports in UI components
- Improved performance metrics
- Better user experience with loading states
- Reduced bundle size
- Better error handling

---

## 🚀 **Next Steps**
1. Start with **Shops Page** (High Priority)
2. Move to **Cart Page** (High Priority)
3. Continue with **Wishlist Page** (High Priority)
4. Complete **Admin Dashboard** (High Priority)
5. Move to medium priority items
6. Finish with low priority items
7. Conduct final testing and optimization

---

*Last Updated: [Current Date]*
*Status: In Progress*
