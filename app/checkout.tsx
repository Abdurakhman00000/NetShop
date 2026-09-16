import { router, type Href } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AuthButton, AuthTextField } from '@/components/auth';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { Colors, FontSize, Radii, Spacing } from '@/constants/theme';
import { checkout } from '@/services/api/commerce';
import { clearCart, loadCart } from '@/store/cartSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { formatMoney } from '@/utils/format';

export default function CheckoutScreen() {
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const selectedCity = useAppSelector((s) => s.city.selected);
  const cart = useAppSelector((s) => s.cart.cart);
  const authStatus = useAppSelector((s) => s.auth.status);

  const [contactName, setContactName] = useState(user?.full_name ?? '');
  const [contactPhone, setContactPhone] = useState(user?.phone ?? '');
  const [address, setAddress] = useState('');
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authStatus === 'anonymous') {
      router.replace('/(auth)/login' as Href);
    }
  }, [authStatus]);

  useEffect(() => {
    void dispatch(loadCart());
  }, [dispatch]);

  const onSubmit = useCallback(async () => {
    if (!selectedCity) {
      setError('Выберите город на главной');
      return;
    }
    if (!contactName.trim() || !contactPhone.trim() || !address.trim()) {
      setError('Заполните имя, телефон и адрес');
      return;
    }

    setLoading(true);
    setError(null);
    const result = await checkout({
      contact_name: contactName.trim(),
      contact_phone: contactPhone.trim(),
      city_id: selectedCity.id,
      address: address.trim(),
      comment: comment.trim() || undefined,
    });
    setLoading(false);

    if (!result.ok) {
      setError(result.error.message);
      return;
    }

    dispatch(clearCart());
    Alert.alert(
      'Заказ оформлен',
      `Создано заказов: ${result.data.length}`,
      [
        {
          text: 'К заказам',
          onPress: () => router.replace('/orders' as Href),
        },
      ],
    );
  }, [address, comment, contactName, contactPhone, dispatch, selectedCity]);

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScreenHeader title="Оформление" showBack />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + Spacing.xxxl }]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.summary}>
          <Text style={styles.summaryLabel}>К оплате</Text>
          <Text style={styles.summaryValue}>{formatMoney(cart?.total)}</Text>
          <Text style={styles.summaryMeta}>
            Город: {selectedCity?.name ?? 'не выбран'} · позиций: {cart?.items.length ?? 0}
          </Text>
        </View>

        <AuthTextField
          label="Имя получателя"
          value={contactName}
          onChangeText={setContactName}
          autoCapitalize="words"
        />
        <AuthTextField
          label="Телефон"
          value={contactPhone}
          onChangeText={setContactPhone}
          keyboardType="phone-pad"
        />
        <AuthTextField
          label="Адрес"
          value={address}
          onChangeText={setAddress}
          placeholder="Улица, дом, квартира"
          autoCapitalize="sentences"
        />
        <AuthTextField
          label="Комментарий"
          value={comment}
          onChangeText={setComment}
          placeholder="Необязательно"
          autoCapitalize="sentences"
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <AuthButton label="Подтвердить заказ" loading={loading} onPress={onSubmit} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  content: {
    padding: Spacing.xl,
    gap: Spacing.lg,
  },
  summary: {
    backgroundColor: Colors.brandSoft,
    borderRadius: Radii.lg,
    padding: Spacing.lg,
    gap: 4,
  },
  summaryLabel: {
    fontFamily: 'DMSans_400Regular',
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  summaryValue: {
    fontFamily: 'DMSans_700Bold',
    fontSize: FontSize.xxl,
    color: Colors.brand,
  },
  summaryMeta: {
    fontFamily: 'DMSans_400Regular',
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  error: {
    fontFamily: 'DMSans_400Regular',
    fontSize: FontSize.sm,
    color: Colors.error,
  },
});
