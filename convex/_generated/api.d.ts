/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as admin from "../admin.js";
import type * as carts from "../carts.js";
import type * as messages from "../messages.js";
import type * as notifications from "../notifications.js";
import type * as orders from "../orders.js";
import type * as products from "../products.js";
import type * as reviews from "../reviews.js";
import type * as services from "../services.js";
import type * as settings from "../settings.js";
import type * as shelves from "../shelves.js";
import type * as shops from "../shops.js";
import type * as subscriptions from "../subscriptions.js";
import type * as support from "../support.js";
import type * as users from "../users.js";
import type * as wishlists from "../wishlists.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  admin: typeof admin;
  carts: typeof carts;
  messages: typeof messages;
  notifications: typeof notifications;
  orders: typeof orders;
  products: typeof products;
  reviews: typeof reviews;
  services: typeof services;
  settings: typeof settings;
  shelves: typeof shelves;
  shops: typeof shops;
  subscriptions: typeof subscriptions;
  support: typeof support;
  users: typeof users;
  wishlists: typeof wishlists;
}>;
declare const fullApiWithMounts: typeof fullApi;

export declare const api: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, "internal">
>;

export declare const components: {};
