import { router, type Href } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
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
import { CategoryChips } from '@/components/catalog/CategoryChips';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { Colors, FontSize, Spacing } from '@/constants/theme';
import { useCategories } from '@/hooks/useCategories';
import { createSellerProduct } from '@/services/api/seller';

export default function NewSellerProductScreen() {
  const insets = useSafeAreaInsets();
  const { data: categories } = useCategories('product');

  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('1');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const leafCategories = useMemo(() => {
    // Prefer children for product tree; chips already flatten
    return categories;
  }, [categories]);

  useEffect(() => {
    if (!categoryId && leafCategories.length) {
      const first = leafCategories[0]?.children?.[0] ?? leafCategories[0];
      if (first) setCategoryId(first.id);
    }
  }, [categoryId, leafCategories]);

  const onSubmit = useCallback(async () => {
    if (!categoryId) {
      setError('Выберите категорию');
      return;
    }
    if (!title.trim() || !price.trim()) {
      setError('Укажите название и цену');
      return;
    }
    const stockQty = Number.parseInt(stock, 10);
    if (!Number.isFinite(stockQty) || stockQty < 0) {
      setError('Некорректный остаток');
      return;
    }

    setLoading(true);
    setError(null);
    const result = await createSellerProduct({
      category_id: categoryId,
      title: title.trim(),
      description: description.trim() || undefined,
      price: price.trim().includes('.') ? price.trim() : `${price.trim()}.00`,
      stock_qty: stockQty,
    });
    setLoading(false);

    if (!result.ok) {
      setError(result.error.message);
      return;
    }
    router.replace('/seller' as Href);
  }, [categoryId, description, price, stock, title]);

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScreenHeader title="Новый товар" showBack />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + Spacing.xxxl }]}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.label}>Категория</Text>
        <CategoryChips
          categories={categories}
          selectedId={categoryId}
          onSelect={setCategoryId}
        />
        <View style={styles.fields}>
          <AuthTextField label="Название" value={title} onChangeText={setTitle} />
          <AuthTextField
            label="Описание"
            value={description}
            onChangeText={setDescription}
            autoCapitalize="sentences"
          />
          <AuthTextField
            label="Цена"
            value={price}
            onChangeText={setPrice}
            keyboardType="decimal-pad"
            placeholder="1500.00"
          />
          <AuthTextField
            label="Остаток"
            value={stock}
            onChangeText={setStock}
            keyboardType="number-pad"
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <AuthButton label="Создать черновик" loading={loading} onPress={onSubmit} />
          <Text style={styles.hint}>
            Товар создаётся в статусе draft. Публикация — отдельным действием на бэке.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  content: { paddingVertical: Spacing.xl, gap: Spacing.lg },
  fields: { paddingHorizontal: Spacing.xl, gap: Spacing.lg },
  label: {
    fontFamily: 'DMSans_500Medium',
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    paddingHorizontal: Spacing.xl,
  },
  error: {
    fontFamily: 'DMSans_400Regular',
    fontSize: FontSize.sm,
    color: Colors.error,
  },
  hint: {
    fontFamily: 'DMSans_400Regular',
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    lineHeight: 18,
  },
});
