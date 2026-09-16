import { Image } from 'expo-image';
import { router, useLocalSearchParams, type Href } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AuthButton } from '@/components/auth/AuthButton';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { Colors, FontSize, Spacing } from '@/constants/theme';
import { fetchProduct } from '@/services/api/products';
import { addToCart } from '@/store/cartSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import type { ProductDetail } from '@/types/product';
import { formatMoney, formatRating, pickImageUrl } from '@/utils/format';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const authStatus = useAppSelector((s) => s.auth.status);
  const mutating = useAppSelector((s) => s.cart.mutating);

  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!id) return;
      setLoading(true);
      const result = await fetchProduct(id);
      if (cancelled) return;
      if (!result.ok) {
        setError(result.error.message);
        setProduct(null);
      } else {
        setProduct(result.data);
        setError(null);
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const onAdd = useCallback(async () => {
    if (!product) return;
    if (authStatus !== 'authenticated') {
      router.push('/(auth)/login' as Href);
      return;
    }
    const result = await dispatch(addToCart({ product_id: product.id, qty: 1 }));
    if (addToCart.fulfilled.match(result)) {
      Alert.alert('В корзине', 'Товар добавлен', [
        { text: 'Продолжить' },
        { text: 'В корзину', onPress: () => router.push('/(tabs)/cart' as Href) },
      ]);
    } else {
      Alert.alert('Не удалось добавить', (result.payload as string) || 'Попробуйте позже');
    }
  }, [authStatus, dispatch, product]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={Colors.brand} size="large" />
      </View>
    );
  }

  if (error || !product) {
    return (
      <View style={styles.root}>
        <ScreenHeader title="Товар" showBack />
        <View style={styles.centered}>
          <Text style={styles.error}>{error || 'Товар не найден'}</Text>
        </View>
      </View>
    );
  }

  const image = pickImageUrl(product.cover, product.images);

  return (
    <View style={styles.root}>
      <ScreenHeader title="Товар" showBack />
      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}>
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
          <Text style={styles.category}>{product.category.name}</Text>
          <Text style={styles.title}>{product.title}</Text>
          <Text style={styles.price}>{formatMoney(product.price)}</Text>
          <Text style={styles.meta}>
            {product.store.name} · {formatRating(product.rating, product.rating_count)}
          </Text>
          <Text style={styles.stock}>
            {product.in_stock
              ? `В наличии: ${product.stock_qty} шт.`
              : 'Нет в наличии'}
          </Text>
          {product.description ? (
            <>
              <Text style={styles.section}>Описание</Text>
              <Text style={styles.description}>{product.description}</Text>
            </>
          ) : null}
        </View>
      </ScrollView>
      <View style={[styles.footer, { paddingBottom: insets.bottom + Spacing.md }]}>
        <AuthButton
          label={product.in_stock ? 'В корзину' : 'Нет в наличии'}
          onPress={onAdd}
          loading={mutating}
          disabled={!product.in_stock}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.xl },
  error: { fontFamily: 'DMSans_400Regular', color: Colors.textSecondary, textAlign: 'center' },
  hero: { aspectRatio: 1, backgroundColor: Colors.surface },
  heroImage: { width: '100%', height: '100%' },
  heroPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.brandSoft,
  },
  placeholderText: { color: Colors.textMuted, fontFamily: 'DMSans_400Regular' },
  body: { padding: Spacing.xl, gap: Spacing.sm },
  category: { fontFamily: 'DMSans_400Regular', fontSize: FontSize.sm, color: Colors.textMuted },
  title: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: FontSize.xxl, color: Colors.text },
  price: { fontFamily: 'DMSans_700Bold', fontSize: FontSize.xl, color: Colors.brand, marginTop: 4 },
  meta: { fontFamily: 'DMSans_400Regular', fontSize: FontSize.sm, color: Colors.textSecondary },
  stock: { fontFamily: 'DMSans_500Medium', fontSize: FontSize.sm, color: Colors.text, marginTop: 4 },
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
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md,
    backgroundColor: Colors.background,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.border,
  },
});
