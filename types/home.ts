import type { ImageSource } from 'expo-image';

/** Remote URL or local bundled asset — matches future API image fields. */
export type MediaSource = string | ImageSource;

export type EcosystemIcon =
  | 'hammer'
  | 'settings'
  | 'sparkles'
  | 'hexagon'
  | 'diamond';

export type EcosystemSize = 'featured' | 'grid';

export type EcosystemDirection = {
  id: string;
  title: string;
  description: string;
  badge: string;
  icon: EcosystemIcon;
  image: MediaSource;
  overlayColor: string;
  size: EcosystemSize;
  href?: string;
  /** Temporary: block stays visible but muted and non-interactive. */
  disabled?: boolean;
};

export type InspirationItem = {
  id: string;
  title: string;
  image: MediaSource;
  href?: string;
  disabled?: boolean;
};

export type HeroBanner = {
  id: string;
  title: string;
  subtitle: string;
  image: MediaSource;
};

export type ProjectCta = {
  title: string;
  subtitle: string;
  buttonLabel: string;
  disabled?: boolean;
};

export type HomeLocation = {
  city: string;
  cityId: string;
};

export type HomeUserPreview = {
  id: string | null;
  displayName: string | null;
  avatarUrl: string | null;
};

export type HomeFeed = {
  location: HomeLocation;
  user: HomeUserPreview;
  hero: HeroBanner;
  ecosystem: {
    title: string;
    directionsLabel: string;
    items: EcosystemDirection[];
  };
  inspiration: {
    title: string;
    seeAllLabel: string;
    items: InspirationItem[];
    /** Temporary: whole section muted / non-interactive. */
    disabled?: boolean;
  };
  projectCta: ProjectCta;
};

export type ApiSuccess<T> = {
  ok: true;
  data: T;
  meta?: {
    fetchedAt: string;
    source: 'mock' | 'api';
  };
};

export type ApiFailure = {
  ok: false;
  error: {
    code: string;
    message: string;
    fields?: Record<string, string[]>;
    status?: number;
    retryAfter?: number;
  };
};

export type ApiResult<T> = ApiSuccess<T> | ApiFailure;
