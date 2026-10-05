import type { NearbyPlaceIcon } from "../../types/location";

/**
 * Thin single-weight line icons, drawn on a 24×24 grid with `stroke` only.
 * Keeping them as path data means they inherit `currentColor` and the stroke
 * width from CSS, so they restyle with the rest of the component.
 */
const ICON_PATHS: Record<NearbyPlaceIcon, string[]> = {
  "shopping-bag": ["M5.6 8h12.8l-1.1 12.2H6.7L5.6 8Z", "M9.1 8a2.9 2.9 0 0 1 5.8 0"],
  cart: ["M3.2 5h2.2l2.5 9.1h9.4L19.7 8H7.4", "M9.7 18.9a1.2 1.2 0 1 0 0-2.4 1.2 1.2 0 0 0 0 2.4Z", "M16.4 18.9a1.2 1.2 0 1 0 0-2.4 1.2 1.2 0 0 0 0 2.4Z"],
  waves: [
    "M3 9.4c1.8-2 3.6-2 5.4 0s3.6 2 5.4 0 3.6-2 5.4 0",
    "M3 14.6c1.8-2 3.6-2 5.4 0s3.6 2 5.4 0 3.6-2 5.4 0",
  ],
  plane: ["M10.6 3.3a1.4 1.4 0 0 1 2.8 0V9l7.4 4.3v2.1l-7.4-2.2v4.2l2.3 1.6v1.6L12 19.5l-3.7 1.1V19l2.3-1.6v-4.2L3.2 15.4v-2.1l7.4-4.3V3.3Z"],
  landmark: ["M3.8 20.4h16.4", "M6.6 20.4V10.2", "M17.4 20.4V10.2", "M12 3.4 20.6 9.1H3.4L12 3.4Z"],
  utensils: ["M6.8 3.2v6.6a2 2 0 0 0 4 0V3.2", "M8.8 11.8v9", "M16.2 3.2c-1.4 1.5-1.9 3.1-1.9 5.3 0 1.6.6 2.6 1.9 3v9.3"],
  building: ["M4.6 21V5.6L14 3.2V21", "M14 21h5.4V9.6L14 8.1", "M7.4 8.6h2.6", "M7.4 12.1h2.6", "M7.4 15.6h2.6"],
  train: [
    "M6.4 3.4h11.2a2 2 0 0 1 2 2v9.2a2 2 0 0 1-2 2H6.4a2 2 0 0 1-2-2V5.4a2 2 0 0 1 2-2Z",
    "M4.4 10.6h15.2",
    "M8.2 16.4h.02",
    "M15.8 16.4h.02",
    "M7.2 20.8 9.6 18.4",
    "M16.8 20.8 14.4 18.4",
  ],
};

interface LocationIconProps {
  name: NearbyPlaceIcon;
  className?: string;
}

export default function LocationIcon({ name, className }: LocationIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.25}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {ICON_PATHS[name].map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}