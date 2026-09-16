import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { fetchCities } from '@/services/api/catalog';
import type { City } from '@/types/common';

const CITY_KEY = '@netshop/selected_city';

type CityState = {
  cities: City[];
  selected: City | null;
  loading: boolean;
  error: string | null;
};

const initialState: CityState = {
  cities: [],
  selected: null,
  loading: false,
  error: null,
};

export const hydrateCity = createAsyncThunk('city/hydrate', async () => {
  const raw = await AsyncStorage.getItem(CITY_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as City;
  } catch {
    return null;
  }
});

export const loadCities = createAsyncThunk('city/load', async (_, { getState, rejectWithValue }) => {
  const result = await fetchCities();
  if (!result.ok) return rejectWithValue(result.error.message);

  const state = getState() as { city: { selected: City | null } };
  if (!state.city.selected && result.data.length > 0) {
    await AsyncStorage.setItem(CITY_KEY, JSON.stringify(result.data[0]));
  }

  return result.data;
});

export const selectCity = createAsyncThunk(
  'city/select',
  async (city: City) => {
    await AsyncStorage.setItem(CITY_KEY, JSON.stringify(city));
    return city;
  },
);

const citySlice = createSlice({
  name: 'city',
  initialState,
  reducers: {
    clearCityError(state) {
      state.error = null;
    },
    setSelectedCityLocal(state, action: PayloadAction<City | null>) {
      state.selected = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(hydrateCity.fulfilled, (state, action) => {
        state.selected = action.payload;
      })
      .addCase(loadCities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadCities.fulfilled, (state, action) => {
        state.loading = false;
        state.cities = action.payload;
        if (!state.selected && action.payload.length > 0) {
          state.selected = action.payload[0];
        }
      })
      .addCase(loadCities.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Не удалось загрузить города';
      })
      .addCase(selectCity.fulfilled, (state, action) => {
        state.selected = action.payload;
      });
  },
});

export const { clearCityError, setSelectedCityLocal } = citySlice.actions;
export const cityReducer = citySlice.reducer;
