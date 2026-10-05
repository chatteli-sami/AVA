export type NearbyPlaceIcon =
  | "shopping-bag"
  | "cart"
  | "waves"
  | "plane"
  | "landmark"
  | "utensils"
  | "building"
  | "train";

export interface NearbyPlace {
  /** Stable key, also used as the React key and the pulse-ring identity. */
  id: string;
  name: string;
  /** Travel time in minutes. Drives the sort order and the count-up. */
  minutes: number;
  /** One short line. Optional — omit it and the card just gets tighter. */
  description?: string;
  icon: NearbyPlaceIcon;
  /** Optional. When set, the card becomes a real link and gets focus states. */
  href?: string;
}