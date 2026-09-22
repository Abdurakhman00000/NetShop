import { Ionicons } from '@expo/vector-icons';
import { router, type Href } from 'expo-router';
import { useCallback, useEffect, useMemo } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AuthButton } from '@/components/auth/AuthButton';
import {
  ProfileHeader,
  ProfileMenu,
  ProfileStats,
  type ProfileMenuItem,
} from '@/components/profile';
import { Colors, FontSize, Spacing } from '@/constants/theme';
import { fetchProfile } from '@/store/authSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

const LOGIN_HREF = '/(auth)/login' as Href;
const REGISTER_HREF = '/(auth)/register' as Href;
const SETTINGS_HREF = '/profile/settings' as Href;
const ORDERS_HREF = '/orders' as Href;
const SELLER_HREF = '/seller' as Href;

const PLACEHOLDER_STATS = { orders: 0, reviews: 0, favorites: 0 };

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const { status, user, bootstrapped, loading } = useAppSelector((s) => s.auth);

  const refreshing = status === 'authenticated' && loading;

  useEffect(() => {
    if (status === 'authenticated') {
      void dispatch(fetchProfile());
    }
  }, [dispatch, status]);

  const onRefresh = useCallback(() => {
    if (status === 'authenticated') {
      void dispatch(fetchProfile());
    }
  }, [dispatch, status]);

  const menuItems = useMemo<ProfileMenuItem[]>(() => {
    const isProvider = Boolean(user?.provider_status);
    const hasStore = Boolean(user?.has_store);
    return [
      {
        id: 'orders',
        title: 'Мои заказы',
        subtitle: 'История и статусы заказов',
        icon: 'cube-outline',
        iconBg: '#F3E9DC',
        iconColor: '#8B5E3C',
        onPress: () => router.push(ORDERS_HREF),
      },
      {
        id: 'favorites',
        title: 'Избранное',
        subtitle: 'Сохранённые товары и услуги',
        icon: 'heart',
        iconBg: '#FCE4EC',
        iconColor: '#E91E63',
        onPress: () => Alert.alert('Скоро', 'Избранное подключится следующим этапом.'),
      },
      {
        id: 'requests',
        title: 'Мои заявки',
        subtitle: 'Заявки на услуги',
        icon: 'clipboard-outline',
        iconBg: '#E3F2FD',
        iconColor: '#1976D2',
        onPress: () => Alert.alert('Скоро', 'Заявки подключатся следующим этапом.'),
      },
      {
        id: 'services',
        title: 'Мои услуги',
        icon: 'key-outline',
        iconBg: '#FFF8E1',
        iconColor: '#F9A825',
        onPress: () => Alert.alert('Скоро', 'Кабинет услуг подключится следующим этапом.'),
      },
      {
        id: 'store',
        title: hasStore ? 'Мой магазин' : 'Открыть магазин',
        subtitle: hasStore ? 'Товары и витрина' : 'Начните продавать товары',
        icon: 'storefront-outline',
        iconBg: '#E8F5E9',
        iconColor: '#2E7D32',
        accentTitle: !hasStore,
        onPress: () => router.push(SELLER_HREF),
      },
      {
        id: 'become-provider',
        title: isProvider ? 'Кабинет исполнителя' : 'Стать исполнителем',
        subtitle: isProvider ? 'Управляйте услугами' : 'Зарабатывайте на навыках',
        icon: 'star',
        iconBg: '#FFF3E0',
        iconColor: '#FB8C00',
        disabled: true,
      },
      {
        id: 'help',
        title: 'Помощь',
        icon: 'help-circle',
        iconBg: '#FCE4EC',
        iconColor: '#EC407A',
        disabled: true,
      },
    ];
  }, [user?.has_store, user?.provider_status]);

  if (!bootstrapped) {
    return (
      <View style={[styles.centered, { paddingTop: insets.top }]}>
        <ActivityIndicator color={Colors.brand} size="large" />
      </View>
    );
  }

  if (status !== 'authenticated' || !user) {
    return (
      <View
        style={[
          styles.guest,
          { paddingTop: insets.top + Spacing.xxl, paddingBottom: insets.bottom + Spacing.xl },
        ]}
      >
        <Text style={styles.guestTitle}>Профиль</Text>
        <Text style={styles.guestSubtitle}>
          Войдите, чтобы видеть заказы, избранное и управлять данными аккаунта.
        </Text>
        <AuthButton
          label="Войти"
          onPress={() => router.push(LOGIN_HREF)}
          style={styles.guestBtn}
        />
        <AuthButton
          label="Создать аккаунт"
          variant="outline"
          onPress={() => router.push(REGISTER_HREF)}
          style={styles.guestBtn}
        />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={{ paddingTop: insets.top, paddingBottom: Spacing.xxxl }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={Colors.brand}
        />
      }
    >
      <View style={styles.topBar}>
        <Text style={styles.screenTitle}>Профиль</Text>
        <Pressable
          onPress={() => router.push(SETTINGS_HREF)}
          hitSlop={10}
          style={styles.settingsBtn}
          accessibilityRole="button"
          accessibilityLabel="Настройки"
        >
          <Ionicons name="settings-outline" size={22} color={Colors.text} />
        </Pressable>
      </View>

      <ProfileHeader user={user} />
      <ProfileStats stats={PLACEHOLDER_STATS} />
      <ProfileMenu items={menuItems} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.sm,
  },
  screenTitle: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: FontSize.xxl,
    color: Colors.text,
  },
  settingsBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
  },
  guest: {
    flex: 1,
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.xl,
    justifyContent: 'center',
    gap: Spacing.md,
  },
  guestTitle: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: FontSize.hero,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  guestSubtitle: {
    fontFamily: 'DMSans_400Regular',
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    lineHeight: 22,
    marginBottom: Spacing.lg,
  },
  guestBtn: {
    alignSelf: 'stretch',
  },
});
