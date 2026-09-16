import { Image } from 'expo-image';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { Colors, FontSize, Spacing } from '@/constants/theme';
import { fetchService } from '@/services/api/services';
import type { ServiceDetail } from '@/types/service';
import { formatMoney, formatRating, pickImageUrl } from '@/utils/format';

function priceLabel(item: ServiceDetail): string {
  if (item.price_type === 'from' || (!item.price_max && item.price_min)) {
    return `от ${formatMoney(item.price_min)}`;
  }
  if (item.price_min && item.price_max) {
    return `${formatMoney(item.price_min)} – ${formatMoney(item.price_max)}`;
  }
  return formatMoney(item.price_min);
}

export default function ServiceDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const [service, setService] = useState<ServiceDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!id) return;
      setLoading(true);
      const result = await fetchService(id);
      if (cancelled) return;
      if (!result.ok) {
        setError(result.error.message);
        setService(null);
      } else {
        setService(result.data);
        setError(null);
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={Colors.brand} size="large" />
      </View>
    );
  }

  if (error || !service) {
    return (
      <View style={styles.root}>
        <ScreenHeader title="Услуга" showBack />
        <View style={styles.centered}>
          <Text style={styles.error}>{error || 'Услуга не найдена'}</Text>
        </View>
      </View>
    );
  }

  const image = pickImageUrl(service.cover, service.images);

  return (
    <View style={styles.root}>
      <ScreenHeader title="Услуга" showBack />
      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + Spacing.xxxl }}>
        <View style={styles.hero}>
          {image ? (
            <Image source={{ uri: image }} style={styles.heroImage} contentFit="cover" />
          ) : (
            <View style={styles.heroPlaceholder}>
              <Text style={styles.placeholderText}>Нет фото</Text>
            </View>
          )}
        </View>
        <View style={styles.body}>
          <Text style={styles.category}>{service.category.name}</Text>
          <Text style={styles.title}>{service.title}</Text>
          <Text style={styles.price}>{priceLabel(service)}</Text>
          {service.unit ? (
            <Text style={styles.meta}>Ед.: {service.unit}</Text>
          ) : null}
          <Text style={styles.meta}>
            {service.provider.display_name} ·{' '}
            {formatRating(service.rating, service.rating_count)}
          </Text>
          {service.description ? (
            <>
              <Text style={styles.section}>Описание</Text>
              <Text style={styles.description}>{service.description}</Text>
            </>
          ) : null}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.xl },
  error: { fontFamily: 'DMSans_400Regular', color: Colors.textSecondary, textAlign: 'center' },
  hero: { aspectRatio: 16 / 10, backgroundColor: Colors.surface },
  heroImage: { width: '100%', height: '100%' },
  heroPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.brandSoft,
  },
  placeholderText: { color: Colors.textMuted },
  body: { padding: Spacing.xl, gap: Spacing.sm },
  category: { fontFamily: 'DMSans_400Regular', fontSize: FontSize.sm, color: Colors.textMuted },
  title: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: FontSize.xxl, color: Colors.text },
  price: { fontFamily: 'DMSans_700Bold', fontSize: FontSize.xl, color: Colors.brand },
  meta: { fontFamily: 'DMSans_400Regular', fontSize: FontSize.sm, color: Colors.textSecondary },
  section: {
    marginTop: Spacing.lg,
    fontFamily: 'DMSans_700Bold',
    fontSize: FontSize.md,
    color: Colors.text,
  },
  description: {
    fontFamily: 'DMSans_400Regular',
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
});
