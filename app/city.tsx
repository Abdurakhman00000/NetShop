import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { Colors, FontSize, Radii, Spacing } from '@/constants/theme';
import { loadCities, selectCity } from '@/store/citySlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import type { City } from '@/types/common';

export default function CityPickerScreen() {
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const { cities, selected, loading, error } = useAppSelector((s) => s.city);
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (cities.length === 0) {
      void dispatch(loadCities());
    }
  }, [cities.length, dispatch]);

  const filtered = cities.filter((c) =>
    c.name.toLowerCase().includes(query.trim().toLowerCase()),
  );

  const onPick = useCallback(
    async (city: City) => {
      await dispatch(selectCity(city));
      router.back();
    },
    [dispatch],
  );

  return (
    <View style={[styles.root, { paddingBottom: insets.bottom }]}>
      <ScreenHeader title="Город" showBack subtitle="Фильтр витрин и доставки" />
      <View style={styles.searchWrap}>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Поиск города"
          placeholderTextColor={Colors.textMuted}
          style={styles.search}
        />
      </View>
      {loading && cities.length === 0 ? (
        <View style={styles.centered}>
          <ActivityIndicator color={Colors.brand} />
        </View>
      ) : error && cities.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.error}>{error}</Text>
          <Pressable onPress={() => void dispatch(loadCities())}>
            <Text style={styles.retry}>Повторить</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => {
            const active = selected?.id === item.id;
            return (
              <Pressable
                onPress={() => void onPick(item)}
                style={[styles.row, active && styles.rowActive]}
              >
                <Text style={[styles.name, active && styles.nameActive]}>{item.name}</Text>
              </Pressable>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  searchWrap: { paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md },
  search: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    fontFamily: 'DMSans_400Regular',
    fontSize: FontSize.md,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  list: { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xxxl },
  row: {
    paddingVertical: Spacing.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
  },
  rowActive: { backgroundColor: Colors.brandSoft, marginHorizontal: -Spacing.sm, paddingHorizontal: Spacing.sm, borderRadius: Radii.sm },
  name: { fontFamily: 'DMSans_500Medium', fontSize: FontSize.md, color: Colors.text },
  nameActive: { color: Colors.brand, fontFamily: 'DMSans_700Bold' },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: Spacing.md },
  error: { color: Colors.textSecondary },
  retry: { color: Colors.brand, fontFamily: 'DMSans_700Bold' },
});
