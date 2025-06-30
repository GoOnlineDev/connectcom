import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Doc, Id } from "./_generated/dataModel";

export const createProduct = mutation({
  args: {
    shopId: v.id("shops"), 
    shelfId: v.optional(v.id("shelves")),
    name: v.string(),
    description: v.optional(v.string()),
    imageUrls: v.optional(v.array(v.string())),
    price: v.number(),
    quantityAvailable: v.optional(v.number()),
    tags: v.optional(v.array(v.string())),
  },
  returns: v.object({
    success: v.boolean(),
    productId: v.optional(v.id("products")),
    error: v.optional(v.string()),
  }),
  handler: async (ctx, args) => {
    if (args.shelfId) {
      const shelf = await ctx.db.get(args.shelfId);
      if (!shelf) {
        return {
          success: false,
          error: "Shelf not found",
        };
      }

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

    const productId = await ctx.db.insert("products", {
      shopId: args.shopId,
      shelfId: args.shelfId,
      shelfOrder: nextShelfOrder,
      name: args.name,
      description: args.description,
      imageUrls: args.imageUrls,
      price: args.price,
      quantityAvailable: args.quantityAvailable,
      tags: args.tags,
      createdAt: currentTime,
      updatedAt: currentTime,
    });

    if (args.shelfId) {
      const shelf = await ctx.db.get(args.shelfId);
      if (shelf) {
        const updatedProductIds = [...(shelf.productIds || []), productId];
        await ctx.db.patch(args.shelfId, {
          productIds: updatedProductIds,
          updatedAt: currentTime,
        });
      }
    }

    return {
      success: true,
      productId,
    };
  },
});

export const getProductById = query({
  args: {
    productId: v.id("products"),
  },
  handler: async (ctx, args) => {
    const product = await ctx.db.get(args.productId);
    return product;
  },
});

export const getProductsByShop = query({
  args: {
    shopId: v.id("shops"),
  },
  handler: async (ctx, args) => {
    const products = await ctx.db
      .query("products")
      .withIndex("by_shopId", (q) => q.eq("shopId", args.shopId))
      .collect();

    return products;
  },
});

export const updateProduct = mutation({
  args: {
    productId: v.id("products"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    imageUrls: v.optional(v.array(v.string())),
    price: v.optional(v.number()),
    quantityAvailable: v.optional(v.number()),
    tags: v.optional(v.array(v.string())),
  },
  returns: v.object({
    success: v.boolean(),
    error: v.optional(v.string()),
  }),
  handler: async (ctx, args) => {
    const product = await ctx.db.get(args.productId);
    if (!product) {
      return {
        success: false,
        error: "Product not found",
      };
    }

    const updates: any = {
      updatedAt: Date.now(),
    };

    if (args.name !== undefined) updates.name = args.name;
    if (args.description !== undefined) updates.description = args.description;
    if (args.imageUrls !== undefined) updates.imageUrls = args.imageUrls;
    if (args.price !== undefined) updates.price = args.price;
    if (args.quantityAvailable !== undefined) updates.quantityAvailable = args.quantityAvailable;
    if (args.tags !== undefined) updates.tags = args.tags;

    await ctx.db.patch(args.productId, updates);

    return {
      success: true,
    };
  },
});

export const deleteProduct = mutation({
  args: {
    productId: v.id("products"),
  },
  returns: v.object({
    success: v.boolean(),
    error: v.optional(v.string()),
  }),
  handler: async (ctx, args) => {
    const product = await ctx.db.get(args.productId);
    if (!product) {
      return {
        success: false,
        error: "Product not found",
      };
    }

    // Remove from shelf if it's on one
    if (product.shelfId) {
      const shelf = await ctx.db.get(product.shelfId);
      if (shelf && shelf.productIds) {
        const updatedProductIds = shelf.productIds.filter(id => id !== args.productId);
        await ctx.db.patch(product.shelfId, {
          productIds: updatedProductIds,
          updatedAt: Date.now(),
        });
      }
    }

    await ctx.db.delete(args.productId);

    return {
      success: true,
    };
  },
}); 