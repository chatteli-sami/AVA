"use client";

import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

export function MapPinIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.1}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M21 10c0 6-9 13-9 13S3 16 3 10a9 9 0 0 1 18 0z" />
      <circle cx={12} cy={10} r={3} />
    </svg>
  );
}

export function CrownIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.1}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M12 17.27L18.18 21l-2.37-7.77L22 10.27l-3.31-1.94L12 13.83 5.31 8.33 2 10.27l6.19 2.94L4.19 21.07z" />
    </svg>
  );
}

export function GemIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.1}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M12 2L2 12l10 10 10-10L12 2z" />
      <path d="M2 12h20" />
      <path d="M12 2v20" />
    </svg>
  );
}