import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

export const createOrGetUser = mutation({
  args: {},
  returns: v.id("users"),
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Called createOrGetUser without authentication");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) =>
        q.eq("clerkId", identity.subject)
      )
      .unique();

    if (user) {
      return user._id;
    }

    const currentTime = Date.now();
    const userId = await ctx.db.insert("users", {
      clerkId: identity.subject,
      email: identity.email!,
      firstName: identity.givenName ?? undefined,
      lastName: identity.familyName ?? undefined,
      imageUrl: typeof identity.pictureUrl === "string" ? identity.pictureUrl : undefined, 
      role: "customer",
      // Default subscription package
      subscriptionPackage: "free",
      subscriptionStartDate: currentTime,
      subscriptionStatus: "active",
      createdAt: currentTime,
      updatedAt: currentTime,
    });

    return userId;
  },
});

/**
 * Updates a user's role in the database
 */
export const updateUserRole = mutation({
  args: {
    userId: v.optional(v.id("users")), 
    clerkUserId: v.optional(v.string()), 
    newRole: v.string(), 
  },
  returns: v.object({
    userId: v.id("users"),
    newRole: v.string(),
    success: v.boolean(),
  }),
  handler: async (ctx, args) => {
    if (!args.userId && !args.clerkUserId) {
      throw new Error("Either userId or clerkUserId must be provided");
    }

    const validRoles = ["customer", "vendor", "admin"];
    if (!validRoles.includes(args.newRole)) {
      throw new Error(`Invalid role: ${args.newRole}. Must be one of: ${validRoles.join(", ")}`);
    }

    let userId;
    
    if (args.userId) {
      const user = await ctx.db.get(args.userId);
      if (!user) {
        throw new Error(`User with ID ${args.userId} not found`);
      }
      userId = args.userId;
    } 
    else if (args.clerkUserId) {
      const clerkId = args.clerkUserId; 
      const user = await ctx.db
        .query("users")
        .withIndex("by_clerkId", (q) => q.eq("clerkId", clerkId))
        .unique();
      
      if (!user) {
        throw new Error(`User with Clerk ID ${clerkId} not found`);
      }
      userId = user._id;
    } else {
      throw new Error("No user identifier provided");
    }

    const currentTime = Date.now();
    await ctx.db.patch(userId, {
      role: args.newRole,
      updatedAt: currentTime,
    });

    return {
      userId,
      newRole: args.newRole,
      success: true
    };
  },
});

/**
 * Get the current authenticated user's details
 */
export const getCurrentUser = query({
  args: {},
  returns: v.union(v.null(), v.object({
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
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null; 
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) =>   
        q.eq("clerkId", identity.subject)
      )
      .unique();
    
    return user;
  },
});

/**
 * Update user's subscription package
 */
export const updateUserSubscription = mutation({
  args: {
    clerkId: v.string(),
    packageName: v.string(),
    subscriptionEndDate: v.optional(v.number()),
  },
  returns: v.object({
    success: v.boolean(),
    userId: v.id("users"),
    packageName: v.string(),
  }),
  handler: async (ctx, args) => {
    // Get user
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .unique();

    if (!user) {
      throw new Error(`User with Clerk ID ${args.clerkId} not found`);
    }

    // Validate package exists
    const pkg = await ctx.db
      .query("subscriptionPackages")
      .withIndex("by_packageName", (q) => q.eq("packageName", args.packageName))
      .first();

    if (!pkg) {
      throw new Error(`Subscription package ${args.packageName} not found`);
    }

    const currentTime = Date.now();
    
    await ctx.db.patch(user._id, {
      subscriptionPackage: args.packageName,
      subscriptionStartDate: currentTime,
      subscriptionEndDate: args.subscriptionEndDate,
      subscriptionStatus: "active",
      updatedAt: currentTime,
    });

    return {
      success: true,
      userId: user._id,
      packageName: args.packageName,
    };
  },
});