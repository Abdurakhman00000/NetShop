/** Shared API pagination + media helpers */

export type Paginated<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

export type NamedRef = {
  id: string;
  name: string;
};

export type MediaImage = {
  id: string;
  original: string | null;
  card: string | null;
  thumb: string | null;
  sort_order: number;
};

export type CategoryKind = 'product' | 'service';

export type Category = {
  id: string;
  name: string;
  slug: string;
  kind: CategoryKind;
  icon: string;
  sort_order: number;
  children: Category[];
};

export type City = {
  id: string;
  name: string;
  slug: string;
  sort_order: number;
};
