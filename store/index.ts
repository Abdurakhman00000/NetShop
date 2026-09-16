import { configureStore } from '@reduxjs/toolkit';

import { authReducer } from './authSlice';
import { cartReducer } from './cartSlice';
import { cityReducer } from './citySlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    city: cityReducer,
    cart: cartReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
