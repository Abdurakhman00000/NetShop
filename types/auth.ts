/**
 * Auth & profile domain types — mirror of /api/v1/auth/* and /api/v1/me/
 */

export type AuthProvider = 'password' | 'google';

export type User = {
  id: string;
  email: string;
  email_verified: boolean;
  full_name: string;
  phone: string;
  auth_provider: AuthProvider | string;
  is_blocked: boolean;
  has_store: boolean;
  provider_status: string | null;
  date_joined: string;
};

export type AuthTokens = {
  access: string;
  refresh: string;
};

export type AuthResponse = AuthTokens & {
  user: User;
  is_new: boolean;
};

export type TokenRefreshResponse = AuthTokens;

export type RegisterPayload = {
  email: string;
  password: string;
  full_name?: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type GoogleAuthPayload = {
  id_token: string;
};

export type UpdateProfilePayload = {
  full_name?: string;
  phone?: string;
};

/** Field-level validation errors from Django REST (400). */
export type FieldErrors = Record<string, string[]>;
