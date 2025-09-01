/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as admin from "../admin.js";
import type * as carts from "../carts.js";
import type * as products from "../products.js";
import type * as reviews from "../reviews.js";
import type * as services from "../services.js";
import type * as shelves from "../shelves.js";
import type * as shops from "../shops.js";
import type * as subscriptions from "../subscriptions.js";
import type * as users from "../users.js";
import type * as wishlists from "../wishlists.js";

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
  products: typeof products;
  reviews: typeof reviews;
  services: typeof services;
  shelves: typeof shelves;
  shops: typeof shops;
  subscriptions: typeof subscriptions;
  users: typeof users;
  wishlists: typeof wishlists;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
