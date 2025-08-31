import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { Doc, Id } from "./_generated/dataModel";
import { QueryCtx, MutationCtx } from "./_generated/server";

/**
 * Middleware to check if the user is an admin for queries
 */
const withAdminAuthQuery = <T extends Record<string, any>>(
  handler: (ctx: QueryCtx, args: T) => Promise<any>
) => {
  return async (ctx: QueryCtx, args: T) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    
    // Find the user in our database
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();
      
    if (!user) {
      throw new Error("User not found");
    }
    
    // Check if the user is an admin
    if (user.role !== "admin") {
      throw new Error("Not authorized. Admin access required.");
    }
    
    // User is authorized, proceed with the function
    return handler(ctx, args);
  };
};

/**
 * Middleware to check if the user is an admin for mutations
 */
const withAdminAuthMutation = <T extends Record<string, any>>(
  handler: (ctx: MutationCtx, args: T) => Promise<any>
) => {
  return async (ctx: MutationCtx, args: T) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    
    // Find the user in our database
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();
      
    if (!user) {
      throw new Error("User not found");
    }
    
    // Check if the user is an admin
    if (user.role !== "admin") {
      throw new Error("Not authorized. Admin access required.");
    }
    
    // User is authorized, proceed with the function
    return handler(ctx, args);
  };
};

/**
 * Get all users
 */
export const getUsers = query({
  args: {},
  returns: v.array(v.object({
    _id: v.id("users"),
    _creationTime: v.number(),
    clerkId: v.string(),
    email: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    role: v.string(),
    phoneNumber: v.optional(v.string()),
    location: v.optional(v.string()),
    shopIds: v.optional(v.array(v.id("shops"))),
    subscriptionPackage: v.string(),
    subscriptionStartDate: v.optional(v.number()),
    subscriptionEndDate: v.optional(v.number()),
    subscriptionStatus: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })),
  handler: withAdminAuthQuery(async (ctx, args) => {
    const users = await ctx.db.query("users").collect();
    return users;
  }),
});

/**
 * Get all shops
 */
export const getShops = query({
  args: {},
  returns: v.array(v.object({
    _id: v.id("shops"),
    _creationTime: v.number(),
    ownerId: v.string(),
    shopName: v.string(),
    shopImageUrl: v.optional(v.string()),
    shopLogoUrl: v.optional(v.string()),
    contactInfo: v.optional(v.object({
      email: v.optional(v.string()),
      phone: v.optional(v.string()),
      website: v.optional(v.string()),
    })),
    operatingHours: v.optional(v.any()),
    physicalLocation: v.optional(v.any()),
    description: v.optional(v.string()),
    shopType: v.string(),
    categories: v.optional(v.array(v.string())),
    productIds: v.optional(v.array(v.id("products"))),
    serviceIds: v.optional(v.array(v.id("services"))),
    shelfIds: v.optional(v.array(v.id("shelves"))),
    status: v.string(),
    adminNotes: v.optional(v.string()),
    reviewedAt: v.optional(v.number()),
    shopLayoutConfig: v.optional(v.any()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })),
  handler: withAdminAuthQuery(async (ctx, args) => {
    const shops = await ctx.db.query("shops").collect();
    return shops;
  }),
});

/**
 * Get all products
 */
export const getProducts = query({
  args: {},
  handler: withAdminAuthQuery(async (ctx, args) => {
    const products = await ctx.db.query("products").collect();
    return products;
  }),
});

/**
 * Get all services
 */
export const getServices = query({
  args: {},
  handler: withAdminAuthQuery(async (ctx, args) => {
    const services = await ctx.db.query("services").collect();
    return services;
  }),
});

/**
 * Update a shop's status (approve or reject)
 */
export const updateShopStatus = mutation({
  args: {
    shopId: v.id("shops"),
    status: v.string(), // "active", "rejected", etc.
    adminNotes: v.optional(v.string()),
  },
  returns: v.object({
    success: v.boolean(),
    shopId: v.id("shops"),
    status: v.string(),
  }),
  handler: withAdminAuthMutation(async (ctx, args) => {
    const { shopId, status, adminNotes } = args;
    
    // Check if the shop exists
    const shop = await ctx.db.get(shopId);
    if (!shop) {
      throw new Error(`Shop with ID ${shopId} not found`);
    }
    
    // Update the shop status
    const currentTime = Date.now();
    await ctx.db.patch(shopId, { 
      status, 
      adminNotes, 
      updatedAt: currentTime,
      reviewedAt: currentTime,
    });
    
    return {
      success: true,
      shopId,
      status,
    };
  }),
});

/**
 * Update a user's role
 */
export const updateUserRole = mutation({
  args: {
    userId: v.id("users"),
    newRole: v.string(), // "admin", "vendor", or "customer"
  },
  returns: v.object({
    success: v.boolean(),
    userId: v.id("users"),
    newRole: v.string(),
  }),
  handler: withAdminAuthMutation(async (ctx, args) => {
    const { userId, newRole } = args;
    
    // Check if the user exists
    const user = await ctx.db.get(userId);
    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }
    
    // Validate the role
    const validRoles = ["admin", "vendor", "customer"];
    if (!validRoles.includes(newRole)) {
      throw new Error(`Invalid role: ${newRole}. Must be one of: ${validRoles.join(", ")}`);
    }
    
    // Update the user's role
    const currentTime = Date.now();
    await ctx.db.patch(userId, { 
      role: newRole, 
      updatedAt: currentTime 
    });
    
    return {
      success: true,
      userId,
      newRole,
    };
  }),
});

/**
 * Delete a shop
 */
export const deleteShop = mutation({
  args: {
    shopId: v.id("shops"),
  },
  returns: v.object({
    success: v.boolean(),
    shopId: v.id("shops"),
  }),
  handler: withAdminAuthMutation(async (ctx, args) => {
    const { shopId } = args;
    
    // Check if the shop exists
    const shop = await ctx.db.get(shopId);
    if (!shop) {
      throw new Error(`Shop with ID ${shopId} not found`);
    }
    
    // Delete all products associated with this shop
    const products = await ctx.db
      .query("products")
      .withIndex("by_shopId", (q) => q.eq("shopId", shopId))
      .collect();
      
    for (const product of products) {
      await ctx.db.delete(product._id);
    }
    
    // Delete all services associated with this shop
    const services = await ctx.db
      .query("services")
      .withIndex("by_shopId", (q) => q.eq("shopId", shopId))
      .collect();
      
    for (const service of services) {
      await ctx.db.delete(service._id);
    }
    
    // Finally, delete the shop
    await ctx.db.delete(shopId);
    
    return {
      success: true,
      shopId,
    };
  }),
}); 