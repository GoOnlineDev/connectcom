import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    role: v.string(), 
    phoneNumber: v.optional(v.string()), 
    location: v.optional(v.string()), 
    shopIds: v.optional(v.array(v.id("shops"))), 
    // Subscription information
    subscriptionPackage: v.string(), // "free", "pro", "unlimited"
    subscriptionStartDate: v.optional(v.number()),
    subscriptionEndDate: v.optional(v.number()),
    subscriptionStatus: v.string(), // "active", "expired", "cancelled"
    createdAt: v.number(), 
    updatedAt: v.number(), 
  })
  .index("by_clerkId", ["clerkId"])
  .index("by_subscriptionPackage", ["subscriptionPackage"])
  .index("by_subscriptionStatus", ["subscriptionStatus"]),

  // Subscription packages definition table
  subscriptionPackages: defineTable({
    packageName: v.string(), // "free", "pro", "unlimited"
    displayName: v.string(), // "Free", "Pro", "Unlimited"
    description: v.optional(v.string()),
    price: v.number(), // Price in cents (0 for free)
    currency: v.string(), // "USD", etc.
    // Limits
    maxShops: v.number(),
    maxShelvesPerShop: v.number(),
    maxItemsPerShelf: v.number(),
    // Features
    features: v.optional(v.array(v.string())),
    isActive: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
  .index("by_packageName", ["packageName"])
  .index("by_isActive", ["isActive"]),


  shops: defineTable({
    ownerId: v.string(), 
    shopName: v.string(),
    shopLogoUrl: v.optional(v.string()),
    contactInfo: v.optional(v.object({
      email: v.optional(v.string()),
      phone: v.optional(v.optional(v.string())),
      website: v.optional(v.string()),
    })),
    operatingHours: v.optional(v.any()), // Can be string or a more complex object, using v.any() for flexibility initially
    physicalLocation: v.optional(v.any()), // Can be string or object, using v.any()
    description: v.optional(v.string()),
    // Shop type: "product_shop" or "service_shop"
    shopType: v.string(),
    categories: v.optional(v.array(v.string())),
    // Arrays of IDs linking to products or services (deprecated - use shelves instead)
    productIds: v.optional(v.array(v.id("products"))), // Using v.id("products")
    serviceIds: v.optional(v.array(v.id("services"))), // Using v.id("services")
    // Shelf management
    shelfIds: v.optional(v.array(v.id("shelves"))), // Array of shelf IDs
    // Shop status
    status: v.string(), // e.g., "pending_approval", "active"
    // Admin review fields
    adminNotes: v.optional(v.string()),
    reviewedAt: v.optional(v.number()),
    //Future feature: shop layout config
    shopLayoutConfig: v.optional(v.any()), // Using v.any() for flexibility
    // Timestamps
    createdAt: v.number(),
    updatedAt: v.number(),
  })
  // Index to easily find shops by owner
  .index("by_ownerId", ["ownerId"])
  // Index to find shops by type
  .index("by_shopType", ["shopType"])
  // Index for status
  .index("by_status", ["status"]),

  // Shelves table to organize products/services
  shelves: defineTable({
    shopId: v.id("shops"), // Link to the shop
    shelfName: v.string(), // e.g., "Shelf 1", "Electronics", "Clothing"
    shelfDescription: v.optional(v.string()),
    shelfOrder: v.number(), // For ordering shelves (1, 2, 3, etc.)
    // Items on this shelf
    productIds: v.optional(v.array(v.id("products"))),
    serviceIds: v.optional(v.array(v.id("services"))),
    // Timestamps
    createdAt: v.number(),
    updatedAt: v.number(),
  })
  .index("by_shopId", ["shopId"])
  .index("by_shopId_and_order", ["shopId", "shelfOrder"]),


  products: defineTable({
    // ID of the shop selling this product
    shopId: v.id("shops"), // Link to the Shops table
    // Shelf organization
    shelfId: v.optional(v.id("shelves")), // Link to the shelf this product is on
    shelfOrder: v.optional(v.number()), // Order within the shelf
    // Product details
    name: v.string(),
    description: v.optional(v.string()),
    //Future feature: product images
    imageUrls: v.optional(v.array(v.string())),
    price: v.number(), // Assuming price is a number (e.g., in smallest currency unit)
    quantityAvailable: v.optional(v.number()),
    tags: v.optional(v.array(v.string())),
    // Timestamps
    createdAt: v.number(),
    updatedAt: v.number(),
  })
  // Index to easily find products by shop
  .index("by_shopId", ["shopId"])
  // Index to find products by shelf
  .index("by_shelfId", ["shelfId"])
  .index("by_shelfId_and_order", ["shelfId", "shelfOrder"]),


  services: defineTable({
    // ID of the shop offering this service
    shopId: v.id("shops"), // Link to the Shops table
    // Shelf organization
    shelfId: v.optional(v.id("shelves")), // Link to the shelf this service is on
    shelfOrder: v.optional(v.number()), // Order within the shelf
    // Service details
    name: v.string(),
    description: v.optional(v.string()),
    duration: v.optional(v.any()), // Can be string or number
    pricing: v.optional(v.any()), // Can be string or object
    bookingInfo: v.optional(v.any()), // Can be string or object
    // Timestamps
    createdAt: v.number(),
    updatedAt: v.number(),
  })
   // Index to easily find services by shop
  .index("by_shopId", ["shopId"])
  // Index to find services by shelf
  .index("by_shelfId", ["shelfId"])
  .index("by_shelfId_and_order", ["shelfId", "shelfOrder"]),

  // Wishlist table
  wishlists: defineTable({
    userId: v.string(), // Clerk user ID
    itemType: v.string(), // "product" or "service"
    itemId: v.union(v.id("products"), v.id("services")), // ID of the product or service
    shopId: v.id("shops"), // Shop that owns the item
    // Timestamps
    createdAt: v.number(),
  })
  .index("by_userId", ["userId"])
  .index("by_userId_and_itemType", ["userId", "itemType"])
  .index("by_userId_and_itemId", ["userId", "itemId"]),

  // Cart table
  carts: defineTable({
    userId: v.string(), // Clerk user ID
    itemType: v.string(), // "product" or "service"
    itemId: v.union(v.id("products"), v.id("services")), // ID of the product or service
    shopId: v.id("shops"), // Shop that owns the item
    quantity: v.number(), // Quantity of the item (for products, typically 1 for services)
    // Additional details for services
    serviceDetails: v.optional(v.object({
      selectedDate: v.optional(v.string()),
      selectedTime: v.optional(v.string()),
      notes: v.optional(v.string()),
    })),
    // Timestamps
    createdAt: v.number(),
    updatedAt: v.number(),
  })
  .index("by_userId", ["userId"])
  .index("by_userId_and_itemType", ["userId", "itemType"])
  .index("by_userId_and_itemId", ["userId", "itemId"])
  .index("by_shopId", ["shopId"]),

}); 