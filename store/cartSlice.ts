import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { addCartItem, fetchCart } from '@/services/api/commerce';
import type { AddCartItemPayload, Cart } from '@/types/commerce';

type CartState = {
  cart: Cart | null;
  loading: boolean;
  mutating: boolean;
  error: string | null;
};

const emptyCart: Cart = { items: [], total: '0.00' };

const initialState: CartState = {
  cart: null,
  loading: false,
  mutating: false,
  error: null,
};

export const loadCart = createAsyncThunk('cart/load', async (_, { rejectWithValue }) => {
  const result = await fetchCart();
  if (!result.ok) return rejectWithValue(result.error.message);
  return result.data;
});

export const addToCart = createAsyncThunk(
  'cart/add',
  async (payload: AddCartItemPayload, { rejectWithValue }) => {
    const result = await addCartItem(payload);
    if (!result.ok) return rejectWithValue(result.error.message);
    return result.data;
  },
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCart(state) {
      state.cart = emptyCart;
      state.error = null;
    },
    clearCartError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
      })
      .addCase(loadCart.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Не удалось загрузить корзину';
      })
      .addCase(addToCart.pending, (state) => {
        state.mutating = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.mutating = false;
        state.cart = action.payload;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.mutating = false;
        state.error = (action.payload as string) || 'Не удалось добавить в корзину';
      });
  },
});

export const { clearCart, clearCartError } = cartSlice.actions;
export const cartReducer = cartSlice.reducer;

export function selectCartCount(cart: Cart | null): number {
  if (!cart) return 0;
  return cart.items.reduce((sum, item) => sum + item.qty, 0);
}
