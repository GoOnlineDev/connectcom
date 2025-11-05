import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { QueryCtx, MutationCtx } from "./_generated/server";

/**
 * Middleware to check authentication
 */
const withAuth = async (ctx: QueryCtx | MutationCtx) => {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Not authenticated");
  }
  const user = await ctx.db
    .query("users")
    .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
    .unique();
  if (!user) {
    throw new Error("User not found");
  }
  return { identity, user };
};

/**
 * Get user settings
 */
export const getUserSettings = query({
  args: {},
  returns: v.union(v.null(), v.object({
    _id: v.id("userSettings"),
    _creationTime: v.number(),
    userId: v.string(),
    emailNotifications: v.optional(v.boolean()),
    pushNotifications: v.optional(v.boolean()),
    marketingEmails: v.optional(v.boolean()),
    profileVisibility: v.optional(v.string()),
    showEmail: v.optional(v.boolean()),
    showPhone: v.optional(v.boolean()),
    theme: v.optional(v.string()),
    language: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })),
  handler: async (ctx) => {
    const { identity } = await withAuth(ctx);
    
    const settings = await ctx.db
      .query("userSettings")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .unique();
    
    return settings;
  },
});

/**
 * Update user settings
 */
export const updateUserSettings = mutation({
  args: {
    emailNotifications: v.optional(v.boolean()),
    pushNotifications: v.optional(v.boolean()),
    marketingEmails: v.optional(v.boolean()),
    profileVisibility: v.optional(v.string()),
    showEmail: v.optional(v.boolean()),
    showPhone: v.optional(v.boolean()),
    theme: v.optional(v.string()),
    language: v.optional(v.string()),
  },
  returns: v.id("userSettings"),
  handler: async (ctx, args) => {
    const { identity } = await withAuth(ctx);
    
    // Get existing settings
    let settings = await ctx.db
      .query("userSettings")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .unique();
    
    const currentTime = Date.now();
    
    if (settings) {
      // Update existing settings
      await ctx.db.patch(settings._id, {
        ...args,
        updatedAt: currentTime,
      });
      return settings._id;
    } else {
      // Create new settings
      const settingsId = await ctx.db.insert("userSettings", {
        userId: identity.subject,
        emailNotifications: args.emailNotifications ?? true,
        pushNotifications: args.pushNotifications ?? true,
        marketingEmails: args.marketingEmails ?? false,
        profileVisibility: args.profileVisibility ?? "public",
        showEmail: args.showEmail ?? false,
        showPhone: args.showPhone ?? false,
        theme: args.theme ?? "light",
        language: args.language ?? "en",
        createdAt: currentTime,
        updatedAt: currentTime,
      });
      return settingsId;
    }
  },
});

/**
 * Update user profile (firstName, lastName, phoneNumber, location)
 */
export const updateUserProfile = mutation({
  args: {
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    phoneNumber: v.optional(v.string()),
    location: v.optional(v.string()),
  },
  returns: v.object({
    success: v.boolean(),
    userId: v.id("users"),
  }),
  handler: async (ctx, args) => {
    const { user } = await withAuth(ctx);
    
    const currentTime = Date.now();
    const updates: any = { updatedAt: currentTime };
    
    if (args.firstName !== undefined) updates.firstName = args.firstName || undefined;
    if (args.lastName !== undefined) updates.lastName = args.lastName || undefined;
    if (args.phoneNumber !== undefined) updates.phoneNumber = args.phoneNumber || undefined;
    if (args.location !== undefined) updates.location = args.location || undefined;
    
    await ctx.db.patch(user._id, updates);
    
    return {
      success: true,
      userId: user._id,
    };
  },
});
