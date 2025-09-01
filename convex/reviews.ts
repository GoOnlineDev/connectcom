import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Doc, Id } from "./_generated/dataModel";

// ============= SHOP REVIEWS =============

export const createShopReview = mutation({
  args: {
    shopId: v.id("shops"),
    stars: v.number(),
    comment: v.optional(v.string()),
  },
  returns: v.object({
    success: v.boolean(),
    reviewId: v.optional(v.id("shopReviews")),
    error: v.optional(v.string()),
  }),
  handler: async (ctx, args) => {
    // Get current user
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return {
        success: false,
        error: "You must be logged in to leave a review",
      };
    }

    // Validate stars rating
    if (args.stars < 1 || args.stars > 5) {
      return {
        success: false,
        error: "Rating must be between 1 and 5 stars",
      };
    }

    // Check if shop exists
    const shop = await ctx.db.get(args.shopId);
    if (!shop) {
      return {
        success: false,
        error: "Shop not found",
      };
    }

    // Check if user already reviewed this shop
    const existingReview = await ctx.db
      .query("shopReviews")
      .withIndex("by_shopId_and_userId", (q) => 
        q.eq("shopId", args.shopId).eq("userId", identity.subject)
      )
      .first();

    if (existingReview) {
      return {
        success: false,
        error: "You have already reviewed this shop",
      };
    }

    const currentTime = Date.now();
    const reviewId = await ctx.db.insert("shopReviews", {
      shopId: args.shopId,
      userId: identity.subject,
      stars: args.stars,
      comment: args.comment,
      createdAt: currentTime,
    });

    return {
      success: true,
      reviewId,
    };
  },
});

export const updateShopReview = mutation({
  args: {
    reviewId: v.id("shopReviews"),
    stars: v.optional(v.number()),
    comment: v.optional(v.string()),
  },
  returns: v.object({
    success: v.boolean(),
    error: v.optional(v.string()),
  }),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return {
        success: false,
        error: "You must be logged in to update a review",
      };
    }

    const review = await ctx.db.get(args.reviewId);
    if (!review) {
      return {
        success: false,
        error: "Review not found",
      };
    }

    if (review.userId !== identity.subject) {
      return {
        success: false,
        error: "You can only update your own reviews",
      };
    }

    if (args.stars !== undefined && (args.stars < 1 || args.stars > 5)) {
      return {
        success: false,
        error: "Rating must be between 1 and 5 stars",
      };
    }

    const updates: any = {
      updatedAt: Date.now(),
    };

    if (args.stars !== undefined) updates.stars = args.stars;
    if (args.comment !== undefined) updates.comment = args.comment;

    await ctx.db.patch(args.reviewId, updates);

    return {
      success: true,
    };
  },
});

export const deleteShopReview = mutation({
  args: {
    reviewId: v.id("shopReviews"),
  },
  returns: v.object({
    success: v.boolean(),
    error: v.optional(v.string()),
  }),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return {
        success: false,
        error: "You must be logged in to delete a review",
      };
    }

    const review = await ctx.db.get(args.reviewId);
    if (!review) {
      return {
        success: false,
        error: "Review not found",
      };
    }

    if (review.userId !== identity.subject) {
      return {
        success: false,
        error: "You can only delete your own reviews",
      };
    }

    await ctx.db.delete(args.reviewId);

    return {
      success: true,
    };
  },
});

export const getShopReviews = query({
  args: {
    shopId: v.id("shops"),
    limit: v.optional(v.number()),
  },
  returns: v.array(v.object({
    _id: v.id("shopReviews"),
    _creationTime: v.number(),
    shopId: v.id("shops"),
    userId: v.string(),
    stars: v.number(),
    comment: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
    // User info will be fetched separately
  })),
  handler: async (ctx, args) => {
    const reviews = await ctx.db
      .query("shopReviews")
      .withIndex("by_shopId", (q) => q.eq("shopId", args.shopId))
      .order("desc")
      .take(args.limit || 50);

    return reviews;
  },
});

export const getShopReviewStats = query({
  args: {
    shopId: v.id("shops"),
  },
  returns: v.object({
    totalReviews: v.number(),
    averageRating: v.number(),
    ratingBreakdown: v.object({
      star1: v.number(),
      star2: v.number(),
      star3: v.number(),
      star4: v.number(),
      star5: v.number(),
    }),
  }),
  handler: async (ctx, args) => {
    const reviews = await ctx.db
      .query("shopReviews")
      .withIndex("by_shopId", (q) => q.eq("shopId", args.shopId))
      .collect();

    const totalReviews = reviews.length;
    if (totalReviews === 0) {
      return {
        totalReviews: 0,
        averageRating: 0,
        ratingBreakdown: { star1: 0, star2: 0, star3: 0, star4: 0, star5: 0 },
      };
    }

    const ratingBreakdown = { star1: 0, star2: 0, star3: 0, star4: 0, star5: 0 };
    let totalStars = 0;

    reviews.forEach((review) => {
      totalStars += review.stars;
      ratingBreakdown[`star${review.stars}` as keyof typeof ratingBreakdown]++;
    });

    const averageRating = totalStars / totalReviews;

    return {
      totalReviews,
      averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
      ratingBreakdown,
    };
  },
});

export const getUserShopReview = query({
  args: {
    shopId: v.id("shops"),
  },
  returns: v.union(
    v.object({
      _id: v.id("shopReviews"),
      _creationTime: v.number(),
      shopId: v.id("shops"),
      userId: v.string(),
      stars: v.number(),
      comment: v.optional(v.string()),
      createdAt: v.number(),
      updatedAt: v.optional(v.number()),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const review = await ctx.db
      .query("shopReviews")
      .withIndex("by_shopId_and_userId", (q) => 
        q.eq("shopId", args.shopId).eq("userId", identity.subject)
      )
      .first();

    return review;
  },
});

// ============= PRODUCT REVIEWS =============

export const createProductReview = mutation({
  args: {
    productId: v.id("products"),
    stars: v.number(),
    comment: v.optional(v.string()),
  },
  returns: v.object({
    success: v.boolean(),
    reviewId: v.optional(v.id("productReviews")),
    error: v.optional(v.string()),
  }),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return {
        success: false,
        error: "You must be logged in to leave a review",
      };
    }

    if (args.stars < 1 || args.stars > 5) {
      return {
        success: false,
        error: "Rating must be between 1 and 5 stars",
      };
    }

    const product = await ctx.db.get(args.productId);
    if (!product) {
      return {
        success: false,
        error: "Product not found",
      };
    }

    const existingReview = await ctx.db
      .query("productReviews")
      .withIndex("by_productId_and_userId", (q) => 
        q.eq("productId", args.productId).eq("userId", identity.subject)
      )
      .first();

    if (existingReview) {
      return {
        success: false,
        error: "You have already reviewed this product",
      };
    }

    const currentTime = Date.now();
    const reviewId = await ctx.db.insert("productReviews", {
      productId: args.productId,
      userId: identity.subject,
      stars: args.stars,
      comment: args.comment,
      createdAt: currentTime,
    });

    return {
      success: true,
      reviewId,
    };
  },
});

export const updateProductReview = mutation({
  args: {
    reviewId: v.id("productReviews"),
    stars: v.optional(v.number()),
    comment: v.optional(v.string()),
  },
  returns: v.object({
    success: v.boolean(),
    error: v.optional(v.string()),
  }),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return {
        success: false,
        error: "You must be logged in to update a review",
      };
    }

    const review = await ctx.db.get(args.reviewId);
    if (!review) {
      return {
        success: false,
        error: "Review not found",
      };
    }

    if (review.userId !== identity.subject) {
      return {
        success: false,
        error: "You can only update your own reviews",
      };
    }

    if (args.stars !== undefined && (args.stars < 1 || args.stars > 5)) {
      return {
        success: false,
        error: "Rating must be between 1 and 5 stars",
      };
    }

    const updates: any = {
      updatedAt: Date.now(),
    };

    if (args.stars !== undefined) updates.stars = args.stars;
    if (args.comment !== undefined) updates.comment = args.comment;

    await ctx.db.patch(args.reviewId, updates);

    return {
      success: true,
    };
  },
});

export const deleteProductReview = mutation({
  args: {
    reviewId: v.id("productReviews"),
  },
  returns: v.object({
    success: v.boolean(),
    error: v.optional(v.string()),
  }),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return {
        success: false,
        error: "You must be logged in to delete a review",
      };
    }

    const review = await ctx.db.get(args.reviewId);
    if (!review) {
      return {
        success: false,
        error: "Review not found",
      };
    }

    if (review.userId !== identity.subject) {
      return {
        success: false,
        error: "You can only delete your own reviews",
      };
    }

    await ctx.db.delete(args.reviewId);

    return {
      success: true,
    };
  },
});

export const getProductReviews = query({
  args: {
    productId: v.id("products"),
    limit: v.optional(v.number()),
  },
  returns: v.array(v.object({
    _id: v.id("productReviews"),
    _creationTime: v.number(),
    productId: v.id("products"),
    userId: v.string(),
    stars: v.number(),
    comment: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  })),
  handler: async (ctx, args) => {
    const reviews = await ctx.db
      .query("productReviews")
      .withIndex("by_productId", (q) => q.eq("productId", args.productId))
      .order("desc")
      .take(args.limit || 50);

    return reviews;
  },
});

export const getProductReviewStats = query({
  args: {
    productId: v.id("products"),
  },
  returns: v.object({
    totalReviews: v.number(),
    averageRating: v.number(),
    ratingBreakdown: v.object({
      star1: v.number(),
      star2: v.number(),
      star3: v.number(),
      star4: v.number(),
      star5: v.number(),
    }),
  }),
  handler: async (ctx, args) => {
    const reviews = await ctx.db
      .query("productReviews")
      .withIndex("by_productId", (q) => q.eq("productId", args.productId))
      .collect();

    const totalReviews = reviews.length;
    if (totalReviews === 0) {
      return {
        totalReviews: 0,
        averageRating: 0,
        ratingBreakdown: { star1: 0, star2: 0, star3: 0, star4: 0, star5: 0 },
      };
    }

    const ratingBreakdown = { star1: 0, star2: 0, star3: 0, star4: 0, star5: 0 };
    let totalStars = 0;

    reviews.forEach((review) => {
      totalStars += review.stars;
      ratingBreakdown[`star${review.stars}` as keyof typeof ratingBreakdown]++;
    });

    const averageRating = totalStars / totalReviews;

    return {
      totalReviews,
      averageRating: Math.round(averageRating * 10) / 10,
      ratingBreakdown,
    };
  },
});

export const getUserProductReview = query({
  args: {
    productId: v.id("products"),
  },
  returns: v.union(
    v.object({
      _id: v.id("productReviews"),
      _creationTime: v.number(),
      productId: v.id("products"),
      userId: v.string(),
      stars: v.number(),
      comment: v.optional(v.string()),
      createdAt: v.number(),
      updatedAt: v.optional(v.number()),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const review = await ctx.db
      .query("productReviews")
      .withIndex("by_productId_and_userId", (q) => 
        q.eq("productId", args.productId).eq("userId", identity.subject)
      )
      .first();

    return review;
  },
});

// ============= SERVICE REVIEWS =============

export const createServiceReview = mutation({
  args: {
    serviceId: v.id("services"),
    stars: v.number(),
    comment: v.optional(v.string()),
  },
  returns: v.object({
    success: v.boolean(),
    reviewId: v.optional(v.id("serviceReviews")),
    error: v.optional(v.string()),
  }),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return {
        success: false,
        error: "You must be logged in to leave a review",
      };
    }

    if (args.stars < 1 || args.stars > 5) {
      return {
        success: false,
        error: "Rating must be between 1 and 5 stars",
      };
    }

    const service = await ctx.db.get(args.serviceId);
    if (!service) {
      return {
        success: false,
        error: "Service not found",
      };
    }

    const existingReview = await ctx.db
      .query("serviceReviews")
      .withIndex("by_serviceId_and_userId", (q) => 
        q.eq("serviceId", args.serviceId).eq("userId", identity.subject)
      )
      .first();

    if (existingReview) {
      return {
        success: false,
        error: "You have already reviewed this service",
      };
    }

    const currentTime = Date.now();
    const reviewId = await ctx.db.insert("serviceReviews", {
      serviceId: args.serviceId,
      userId: identity.subject,
      stars: args.stars,
      comment: args.comment,
      createdAt: currentTime,
    });

    return {
      success: true,
      reviewId,
    };
  },
});

export const updateServiceReview = mutation({
  args: {
    reviewId: v.id("serviceReviews"),
    stars: v.optional(v.number()),
    comment: v.optional(v.string()),
  },
  returns: v.object({
    success: v.boolean(),
    error: v.optional(v.string()),
  }),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return {
        success: false,
        error: "You must be logged in to update a review",
      };
    }

    const review = await ctx.db.get(args.reviewId);
    if (!review) {
      return {
        success: false,
        error: "Review not found",
      };
    }

    if (review.userId !== identity.subject) {
      return {
        success: false,
        error: "You can only update your own reviews",
      };
    }

    if (args.stars !== undefined && (args.stars < 1 || args.stars > 5)) {
      return {
        success: false,
        error: "Rating must be between 1 and 5 stars",
      };
    }

    const updates: any = {
      updatedAt: Date.now(),
    };

    if (args.stars !== undefined) updates.stars = args.stars;
    if (args.comment !== undefined) updates.comment = args.comment;

    await ctx.db.patch(args.reviewId, updates);

    return {
      success: true,
    };
  },
});

export const deleteServiceReview = mutation({
  args: {
    reviewId: v.id("serviceReviews"),
  },
  returns: v.object({
    success: v.boolean(),
    error: v.optional(v.string()),
  }),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return {
        success: false,
        error: "You must be logged in to delete a review",
      };
    }

    const review = await ctx.db.get(args.reviewId);
    if (!review) {
      return {
        success: false,
        error: "Review not found",
      };
    }

    if (review.userId !== identity.subject) {
      return {
        success: false,
        error: "You can only delete your own reviews",
      };
    }

    await ctx.db.delete(args.reviewId);

    return {
      success: true,
    };
  },
});

export const getServiceReviews = query({
  args: {
    serviceId: v.id("services"),
    limit: v.optional(v.number()),
  },
  returns: v.array(v.object({
    _id: v.id("serviceReviews"),
    _creationTime: v.number(),
    serviceId: v.id("services"),
    userId: v.string(),
    stars: v.number(),
    comment: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  })),
  handler: async (ctx, args) => {
    const reviews = await ctx.db
      .query("serviceReviews")
      .withIndex("by_serviceId", (q) => q.eq("serviceId", args.serviceId))
      .order("desc")
      .take(args.limit || 50);

    return reviews;
  },
});

export const getServiceReviewStats = query({
  args: {
    serviceId: v.id("services"),
  },
  returns: v.object({
    totalReviews: v.number(),
    averageRating: v.number(),
    ratingBreakdown: v.object({
      star1: v.number(),
      star2: v.number(),
      star3: v.number(),
      star4: v.number(),
      star5: v.number(),
    }),
  }),
  handler: async (ctx, args) => {
    const reviews = await ctx.db
      .query("serviceReviews")
      .withIndex("by_serviceId", (q) => q.eq("serviceId", args.serviceId))
      .collect();

    const totalReviews = reviews.length;
    if (totalReviews === 0) {
      return {
        totalReviews: 0,
        averageRating: 0,
        ratingBreakdown: { star1: 0, star2: 0, star3: 0, star4: 0, star5: 0 },
      };
    }

    const ratingBreakdown = { star1: 0, star2: 0, star3: 0, star4: 0, star5: 0 };
    let totalStars = 0;

    reviews.forEach((review) => {
      totalStars += review.stars;
      ratingBreakdown[`star${review.stars}` as keyof typeof ratingBreakdown]++;
    });

    const averageRating = totalStars / totalReviews;

    return {
      totalReviews,
      averageRating: Math.round(averageRating * 10) / 10,
      ratingBreakdown,
    };
  },
});

export const getUserServiceReview = query({
  args: {
    serviceId: v.id("services"),
  },
  returns: v.union(
    v.object({
      _id: v.id("serviceReviews"),
      _creationTime: v.number(),
      serviceId: v.id("services"),
      userId: v.string(),
      stars: v.number(),
      comment: v.optional(v.string()),
      createdAt: v.number(),
      updatedAt: v.optional(v.number()),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const review = await ctx.db
      .query("serviceReviews")
      .withIndex("by_serviceId_and_userId", (q) => 
        q.eq("serviceId", args.serviceId).eq("userId", identity.subject)
      )
      .first();

    return review;
  },
});
