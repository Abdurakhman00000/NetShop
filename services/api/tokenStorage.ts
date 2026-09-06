import AsyncStorage from '@react-native-async-storage/async-storage';

import type { AuthTokens, User } from '@/types/auth';

const KEYS = {
  access: '@netshop/access',
  refresh: '@netshop/refresh',
  user: '@netshop/user',
} as const;

export type StoredSession = {
  tokens: AuthTokens;
  user: User | null;
};

export async function loadSession(): Promise<StoredSession | null> {
  const [access, refresh, userJson] = await Promise.all([
    AsyncStorage.getItem(KEYS.access),
    AsyncStorage.getItem(KEYS.refresh),
    AsyncStorage.getItem(KEYS.user),
  ]);

  if (!access || !refresh) return null;

  let user: User | null = null;
  if (userJson) {
    try {
      user = JSON.parse(userJson) as User;
    } catch {
      user = null;
    }
  }

  return { tokens: { access, refresh }, user };
}

export async function saveTokens(tokens: AuthTokens): Promise<void> {
  await Promise.all([
    AsyncStorage.setItem(KEYS.access, tokens.access),
    AsyncStorage.setItem(KEYS.refresh, tokens.refresh),
  ]);
}

export async function saveUser(user: User): Promise<void> {
  await AsyncStorage.setItem(KEYS.user, JSON.stringify(user));
}

export async function saveSession(tokens: AuthTokens, user: User): Promise<void> {
  await Promise.all([saveTokens(tokens), saveUser(user)]);
}

export async function clearSession(): Promise<void> {
  await Promise.all([
    AsyncStorage.removeItem(KEYS.access),
    AsyncStorage.removeItem(KEYS.refresh),
    AsyncStorage.removeItem(KEYS.user),
  ]);
}

export async function getAccessToken(): Promise<string | null> {
  return AsyncStorage.getItem(KEYS.access);
}

export async function getRefreshToken(): Promise<string | null> {
  return AsyncStorage.getItem(KEYS.refresh);
}
