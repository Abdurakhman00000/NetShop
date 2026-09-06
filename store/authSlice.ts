import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';

import * as authApi from '@/services/api/auth';
import * as profileApi from '@/services/api/profile';
import {
  clearSession,
  getRefreshToken,
  loadSession,
} from '@/services/api/tokenStorage';
import type {
  FieldErrors,
  LoginPayload,
  RegisterPayload,
  UpdateProfilePayload,
  User,
} from '@/types/auth';

export type AuthStatus = 'idle' | 'hydrating' | 'authenticated' | 'anonymous';

type AuthState = {
  status: AuthStatus;
  user: User | null;
  bootstrapped: boolean;
  loading: boolean;
  error: string | null;
  fieldErrors: FieldErrors;
};

const initialState: AuthState = {
  status: 'hydrating',
  user: null,
  bootstrapped: false,
  loading: false,
  error: null,
  fieldErrors: {},
};

export const hydrateAuth = createAsyncThunk('auth/hydrate', async () => {
  const session = await loadSession();
  if (!session) {
    return { user: null as User | null };
  }

  // Prefer fresh /me/ when we have tokens; fall back to cached user offline.
  const me = await profileApi.fetchMe();
  if (me.ok) {
    return { user: me.data };
  }

  if (me.error.status === 401) {
    await clearSession();
    return { user: null };
  }

  return { user: session.user };
});

export const login = createAsyncThunk(
  'auth/login',
  async (payload: LoginPayload, { rejectWithValue }) => {
    const result = await authApi.login(payload);
    if (!result.ok) {
      return rejectWithValue({
        message: result.error.message,
        fields: result.error.fields ?? {},
      });
    }
    return result.data;
  },
);

export const register = createAsyncThunk(
  'auth/register',
  async (payload: RegisterPayload, { rejectWithValue }) => {
    const result = await authApi.register(payload);
    if (!result.ok) {
      return rejectWithValue({
        message: result.error.message,
        fields: result.error.fields ?? {},
      });
    }
    return result.data;
  },
);

export const logout = createAsyncThunk('auth/logout', async () => {
  const refresh = await getRefreshToken();
  await authApi.logout(refresh);
});

export const fetchProfile = createAsyncThunk(
  'auth/fetchProfile',
  async (_, { rejectWithValue }) => {
    const result = await profileApi.fetchMe();
    if (!result.ok) {
      return rejectWithValue(result.error.message);
    }
    return result.data;
  },
);

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (payload: UpdateProfilePayload, { rejectWithValue }) => {
    const result = await profileApi.updateMe(payload);
    if (!result.ok) {
      return rejectWithValue({
        message: result.error.message,
        fields: result.error.fields ?? {},
      });
    }
    return result.data;
  },
);

type RejectPayload = { message: string; fields: FieldErrors };

function isRejectPayload(value: unknown): value is RejectPayload {
  return (
    typeof value === 'object' &&
    value !== null &&
    'message' in value &&
    typeof (value as RejectPayload).message === 'string'
  );
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthError(state) {
      state.error = null;
      state.fieldErrors = {};
    },
    setUser(state, action: PayloadAction<User | null>) {
      state.user = action.payload;
      state.status = action.payload ? 'authenticated' : 'anonymous';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(hydrateAuth.pending, (state) => {
        state.status = 'hydrating';
      })
      .addCase(hydrateAuth.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.status = action.payload.user ? 'authenticated' : 'anonymous';
        state.bootstrapped = true;
      })
      .addCase(hydrateAuth.rejected, (state) => {
        state.user = null;
        state.status = 'anonymous';
        state.bootstrapped = true;
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.fieldErrors = {};
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.status = 'authenticated';
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        if (isRejectPayload(action.payload)) {
          state.error = action.payload.message;
          state.fieldErrors = action.payload.fields;
        } else {
          state.error = 'Не удалось войти';
        }
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.fieldErrors = {};
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.status = 'authenticated';
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        if (isRejectPayload(action.payload)) {
          state.error = action.payload.message;
          state.fieldErrors = action.payload.fields;
        } else {
          state.error = 'Не удалось зарегистрироваться';
        }
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.status = 'anonymous';
        state.error = null;
        state.fieldErrors = {};
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = 'authenticated';
      })
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.fieldErrors = {};
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        if (isRejectPayload(action.payload)) {
          state.error = action.payload.message;
          state.fieldErrors = action.payload.fields;
        } else {
          state.error = 'Не удалось сохранить профиль';
        }
      });
  },
});

export const { clearAuthError, setUser } = authSlice.actions;
export const authReducer = authSlice.reducer;
