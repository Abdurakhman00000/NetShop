import { router, type Href } from 'expo-router';
import { useCallback, useEffect } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AuthButton } from '@/components/auth/AuthButton';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { Colors, FontSize, Radii, Spacing } from '@/constants/theme';
import { logout } from '@/store/authSlice';
import { clearCart } from '@/store/cartSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

const LOGIN_HREF = '/(auth)/login' as Href;
const EDIT_HREF = '/profile/edit' as Href;

export default function ProfileSettingsScreen() {
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const { user, status } = useAppSelector((s) => s.auth);

  useEffect(() => {
    if (status === 'anonymous') {
      router.replace(LOGIN_HREF);
    }
  }, [status]);

  const onLogout = useCallback(() => {
    Alert.alert('Выйти из аккаунта?', 'Сессия будет завершена на этом устройстве.', [
      { text: 'Отмена', style: 'cancel' },
      {
        text: 'Выйти',
        style: 'destructive',
        onPress: () => {
          void dispatch(logout()).then(() => {
            dispatch(clearCart());
            router.replace('/(tabs)/profile' as Href);
          });
        },
      },
    ]);
  }, [dispatch]);

  return (
    <View style={styles.root}>
      <ScreenHeader title="Настройки" showBack />
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + Spacing.xxxl },
        ]}
      >
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Аккаунт</Text>
          <Text style={styles.cardMeta} numberOfLines={1}>
            {user?.email ?? '—'}
          </Text>
        </View>

        <AuthButton
          label="Редактировать профиль"
          variant="outline"
          onPress={() => router.push(EDIT_HREF)}
        />

        <AuthButton label="Выйти" variant="ghost" onPress={onLogout} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
    gap: Spacing.md,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.sm,
    gap: 4,
  },
  cardTitle: {
    fontFamily: 'DMSans_700Bold',
    fontSize: FontSize.md,
    color: Colors.text,
  },
  cardMeta: {
    fontFamily: 'DMSans_400Regular',
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
});
