export interface GalleryTheme {
  bg: string;
  accent: string;
  fg: string;
  muted: string;
  surface: string;
}

export interface GalleryDetail {
  label: string;
  value: string;
}

export interface GalleryProject {
  slug: string;
  title: string;
  category: string;
  year: string;
  location: string;
  area: string;
  summary: string;
  description: string;
  cover: string;
  images: string[];
  meta: string[];
  details: GalleryDetail[];
  features: string[];
  theme: GalleryTheme;
}