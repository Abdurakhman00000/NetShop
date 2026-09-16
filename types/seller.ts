import type { MediaImage, NamedRef } from './common';

export type StoreStatus = 'active' | 'pending' | 'blocked' | string;

export type Store = {
  id: string;
  name: string;
  description: string;
  phone: string;
  city: string;
  district: string | null;
  address: string;
  work_hours: string;
  status: StoreStatus;
  rating: number | null;
  rating_count: number;
  created_at: string;
};

export type CreateStorePayload = {
  name: string;
  description?: string;
  phone: string;
  city_id: string;
  district_id?: string | null;
  address?: string;
  work_hours?: string;
};

export type SellerProductStatus = 'draft' | 'published' | 'hidden' | 'archived';

export type SellerProduct = {
  id: string;
  category: NamedRef;
  title: string;
  description: string;
  price: string;
  stock_qty: number;
  status: SellerProductStatus | string;
  images: MediaImage[];
  created_at: string;
};

export type CreateSellerProductPayload = {
  category_id: string;
  title: string;
  description?: string;
  price: string;
  stock_qty: number;
};

export type SellerProductListParams = {
  page?: number;
  page_size?: number;
  search?: string;
  ordering?: string;
};
