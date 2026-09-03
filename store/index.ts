import { configureStore } from '@reduxjs/toolkit';

/**
 * Minimal store scaffold. Feature slices / RTK Query APIs will plug in here.
 */
export const store = configureStore({
  reducer: {
    // placeholder keeps configureStore typed until first slice lands
    _app: (state = { ready: true }) => state,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
