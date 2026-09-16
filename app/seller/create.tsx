import { router, type Href } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
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
import { Colors, FontSize, Spacing } from '@/constants/theme';
import { createStore } from '@/services/api/seller';
import { fetchProfile } from '@/store/authSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

export default function CreateStoreScreen() {
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const selectedCity = useAppSelector((s) => s.city.selected);
  const user = useAppSelector((s) => s.auth.user);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [address, setAddress] = useState('');
  const [workHours, setWorkHours] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedCity) {
      setError('Сначала выберите город на главной');
    }
  }, [selectedCity]);

  const onSubmit = useCallback(async () => {
    if (!selectedCity) {
      setError('Выберите город');
      return;
    }
    if (!name.trim() || !phone.trim()) {
      setError('Укажите название и телефон');
      return;
    }
    setLoading(true);
    setError(null);
    const result = await createStore({
      name: name.trim(),
      description: description.trim() || undefined,
      phone: phone.trim(),
      city_id: selectedCity.id,
      address: address.trim() || undefined,
      work_hours: workHours.trim() || undefined,
    });
    setLoading(false);
    if (!result.ok) {
      setError(result.error.message);
      return;
    }
    void dispatch(fetchProfile());
    router.replace('/seller' as Href);
  }, [address, description, dispatch, name, phone, selectedCity, workHours]);

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScreenHeader title="Новый магазин" showBack />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + Spacing.xxxl }]}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.hint}>
          Город магазина: {selectedCity?.name ?? 'не выбран'}
        </Text>
        <AuthTextField label="Название" value={name} onChangeText={setName} />
        <AuthTextField
          label="Описание"
          value={description}
          onChangeText={setDescription}
          autoCapitalize="sentences"
        />
        <AuthTextField
          label="Телефон"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />
        <AuthTextField label="Адрес" value={address} onChangeText={setAddress} />
        <AuthTextField
          label="Часы работы"
          value={workHours}
          onChangeText={setWorkHours}
          placeholder="Пн–Пт 9:00–18:00"
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <AuthButton label="Создать магазин" loading={loading} onPress={onSubmit} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.xl, gap: Spacing.lg },
  hint: {
    fontFamily: 'DMSans_400Regular',
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  error: { fontFamily: 'DMSans_400Regular', fontSize: FontSize.sm, color: Colors.error },
});
