import type { MediaImage, NamedRef } from './common';

export type StoreRef = {
  id: string;
  name: string;
  rating: number | null;
  rating_count: number;
};

export type ProductListItem = {
  id: string;
  title: string;
  category: NamedRef;
  price: string;
  in_stock: boolean;
  store: StoreRef;
  cover: string | null;
  rating: number | null;
  rating_count: number;
};

export type ProductDetail = ProductListItem & {
  description: string;
  stock_qty: number;
  images: MediaImage[];
  created_at: string;
};

export type ProductListParams = {
  category?: string;
  city?: string;
  store?: string;
  price_min?: number;
  price_max?: number;
  in_stock?: boolean;
  ordering?: string;
  search?: string;
  page?: number;
  page_size?: number;
};
