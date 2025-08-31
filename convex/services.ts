import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Doc, Id } from "./_generated/dataModel";

export const createService = mutation({
  args: {
    shopId: v.id("shops"), // ID of the shop offering this service
    shelfId: v.optional(v.id("shelves")), // Optional shelf assignment
    name: v.string(),
    description: v.optional(v.string()),
    duration: v.optional(v.any()),
    pricing: v.optional(v.any()),
    bookingInfo: v.optional(v.any()),
  },
  returns: v.object({
    success: v.boolean(),
    serviceId: v.optional(v.id("services")),
    error: v.optional(v.string()),
  }),
  handler: async (ctx, args) => {
    // If shelf is specified, validate subscription limits
    if (args.shelfId) {
      const shelf = await ctx.db.get(args.shelfId);
      if (!shelf) {
        return {
          success: false,
          error: "Shelf not found",
        };
      }

      // Get shop and owner
      const shop = await ctx.db.get(args.shopId);
      if (!shop) {
        return {
          success: false,
          error: "Shop not found",
        };
      }

      const owner = await ctx.db
        .query("users")
        .withIndex("by_clerkId", (q) => q.eq("clerkId", shop.ownerId))
        .unique();

      if (!owner) {
        return {
          success: false,
          error: "Shop owner not found",
        };
      }

      // Get package limits
      const pkg = await ctx.db
        .query("subscriptionPackages")
        .withIndex("by_packageName", (q) => q.eq("packageName", owner.subscriptionPackage))
        .first();

      if (!pkg) {
        return {
          success: false,
          error: "Subscription package not found",
        };
      }

      // Count current items on shelf
      const productsOnShelf = await ctx.db
        .query("products")
        .withIndex("by_shelfId", (q) => q.eq("shelfId", args.shelfId))
        .collect();

      const servicesOnShelf = await ctx.db
        .query("services")
        .withIndex("by_shelfId", (q) => q.eq("shelfId", args.shelfId))
        .collect();

      const currentItemCount = productsOnShelf.length + servicesOnShelf.length;

      if (currentItemCount >= pkg.maxItemsPerShelf) {
        return {
          success: false,
          error: `Maximum items per shelf limit reached (${pkg.maxItemsPerShelf} items allowed for ${pkg.displayName} package)`,
        };
      }
    }

    const currentTime = Date.now();
    const nextShelfOrder = args.shelfId ? 
      (await ctx.db
        .query("products")
        .withIndex("by_shelfId", (q) => q.eq("shelfId", args.shelfId!))
        .collect()).length + 
      (await ctx.db
        .query("services")
        .withIndex("by_shelfId", (q) => q.eq("shelfId", args.shelfId!))
        .collect()).length + 1 : undefined;

    const serviceId = await ctx.db.insert("services", {
      shopId: args.shopId,
      shelfId: args.shelfId,
      shelfOrder: nextShelfOrder,
      name: args.name,
      description: args.description,
      duration: args.duration,
      pricing: args.pricing,
      bookingInfo: args.bookingInfo,
      createdAt: currentTime,
      updatedAt: currentTime,
    });

    // Update shelf with service ID if shelf is specified
    if (args.shelfId) {
      const shelf = await ctx.db.get(args.shelfId);
      if (shelf) {
        const updatedServiceIds = [...(shelf.serviceIds || []), serviceId];
        await ctx.db.patch(args.shelfId, {
          serviceIds: updatedServiceIds,
          updatedAt: currentTime,
        });
      }
    }

    return {
      success: true,
      serviceId,
    };
  },
});

export const getServiceById = query({
  args: {
    serviceId: v.id("services"),
  },
  handler: async (ctx, args) => {
    const service = await ctx.db.get(args.serviceId);
    return service;
  },
});

export const getServicesByShop = query({
  args: {
    shopId: v.id("shops"),
  },
  handler: async (ctx, args) => {
    const services = await ctx.db
      .query("services")
      .withIndex("by_shopId", (q) => q.eq("shopId", args.shopId))
      .collect();

    return services;
  },
});

export const updateService = mutation({
  args: {
    serviceId: v.id("services"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    duration: v.optional(v.any()),
    pricing: v.optional(v.any()),
    bookingInfo: v.optional(v.any()),
  },
  returns: v.object({
    success: v.boolean(),
    error: v.optional(v.string()),
  }),
  handler: async (ctx, args) => {
    const service = await ctx.db.get(args.serviceId);
    if (!service) {
      return {
        success: false,
        error: "Service not found",
      };
    }

    const updates: any = {
      updatedAt: Date.now(),
    };

    if (args.name !== undefined) updates.name = args.name;
    if (args.description !== undefined) updates.description = args.description;
    if (args.duration !== undefined) updates.duration = args.duration;
    if (args.pricing !== undefined) updates.pricing = args.pricing;
    if (args.bookingInfo !== undefined) updates.bookingInfo = args.bookingInfo;

    await ctx.db.patch(args.serviceId, updates);

    return {
      success: true,
    };
  },
});

export const deleteService = mutation({
  args: {
    serviceId: v.id("services"),
  },
  returns: v.object({
    success: v.boolean(),
    error: v.optional(v.string()),
  }),
  handler: async (ctx, args) => {
    const service = await ctx.db.get(args.serviceId);
    if (!service) {
      return {
        success: false,
        error: "Service not found",
      };
    }

    // Remove from shelf if it's on one
    if (service.shelfId) {
      const shelf = await ctx.db.get(service.shelfId);
      if (shelf && shelf.serviceIds) {
        const updatedServiceIds = shelf.serviceIds.filter(id => id !== args.serviceId);
        await ctx.db.patch(service.shelfId, {
          serviceIds: updatedServiceIds,
          updatedAt: Date.now(),
        });
      }
    }

    await ctx.db.delete(args.serviceId);

    return {
      success: true,
    };
  },
}); 