export type CartItem = {
  product_id: string;
  title: string;
  price: string;
  store: string;
  cover: string | null;
  qty: number;
  line_total: string | number;
  available: boolean;
};

export type Cart = {
  items: CartItem[];
  total: string | number;
};

export type AddCartItemPayload = {
  product_id: string;
  qty: number;
};

export type CheckoutPayload = {
  contact_name: string;
  contact_phone: string;
  city_id: string;
  address: string;
  comment?: string;
};

export type OrderStatus = 'new' | 'confirmed' | 'completed' | 'cancelled';

export type OrderStore = {
  id: string;
  name: string;
  phone: string;
};

export type OrderItem = {
  product_id: string;
  title: string;
  unit_price: string;
  qty: number;
  line_total: string | number;
};

export type Order = {
  id: string;
  status: OrderStatus | string;
  store: OrderStore;
  total: string;
  contact_name: string;
  buyer_phone: string;
  city: string;
  address: string;
  comment: string;
  items: OrderItem[];
  cancel_reason: string | null;
  cancelled_by: string | null;
  created_at: string;
  confirmed_at: string | null;
  completed_at: string | null;
};

export type OrderListParams = {
  status?: OrderStatus;
  page?: number;
  page_size?: number;
  search?: string;
  ordering?: string;
};
