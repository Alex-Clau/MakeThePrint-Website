/**
 * Auth-related types
 */

/** Auth confirm page UI state. */
export type AuthConfirmStatus =
  | "loading"
  | "interstitial"
  | "confirming"
  | "error";
