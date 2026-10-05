import type { NearbyPlace } from "../types/location";

/**
 * Add or edit entries freely — the timeline sorts itself, so the order here
 * does not matter and the drawn path always runs shortest → longest.
 */
export const nearbyPlaces: NearbyPlace[] = [
  {
    id: "tunisia-mall",
    name: "Tunisia Mall",
    minutes: 5,
    description: "Commerces, restaurants et cinéma.",
    icon: "shopping-bag",
  },
  {
    id: "carrefour",
    name: "Carrefour",
    minutes: 9,
    description: "Les courses du quotidien, à portée de main.",
    icon: "cart",
  },
  {
    id: "la-marsa",
    name: "La Marsa",
    minutes: 10,
    description: "Front de mer, terrasses et week-ends.",
    icon: "waves",
  },
  {
    id: "tunis-carthage-airport",
    name: "Aéroport Tunis-Carthage",
    minutes: 15,
    description: "Toutes les liaisons internationales.",
    icon: "plane",
  },
];

/** The timeline always reads shortest → longest, whatever order they are in above. */
export const nearbyPlacesByDistance = [...nearbyPlaces].sort((a, b) => a.minutes - b.minutes);