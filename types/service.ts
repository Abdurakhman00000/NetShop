import type { MediaImage, NamedRef } from './common';

export type ProviderRef = {
  id: string;
  display_name: string;
  rating: number | null;
  rating_count: number;
};

export type ServicePriceType = 'fixed' | 'from' | 'range' | string;

export type ServiceListItem = {
  id: string;
  title: string;
  category: NamedRef;
  price_type: ServicePriceType;
  price_min: string | null;
  price_max: string | null;
  unit: string;
  provider: ProviderRef;
  cover: string | null;
  rating: number | null;
  rating_count: number;
};

export type ServiceDetail = ServiceListItem & {
  description: string;
  images: MediaImage[];
  created_at: string;
};

export type ServiceListParams = {
  category?: string;
  city?: string;
  price_type?: string;
  price_min?: number;
  price_max?: number;
  ordering?: string;
  search?: string;
  page?: number;
  page_size?: number;
};
