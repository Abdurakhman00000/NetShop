import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback } from 'react';
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EcosystemSection } from '@/components/home/EcosystemSection';
import { HeroBanner } from '@/components/home/HeroBanner';
import { HomeHeader } from '@/components/home/HomeHeader';
import { InspirationSection } from '@/components/home/InspirationSection';
import { ProjectCtaBanner } from '@/components/home/ProjectCtaBanner';
import { Colors, Layout, Spacing } from '@/constants/theme';
import { useHomeFeed } from '@/hooks/useHomeFeed';
import type { EcosystemDirection } from '@/types/home';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { data, loading, error, refreshing, refetch } = useHomeFeed();

  const onDirectionPress = useCallback((item: EcosystemDirection) => {
    if (item.href) {
      router.push(item.href as '/(tabs)/catalog');
      return;
    }
  }, []);

  if (loading && !data) {
    return (
      <View style={[styles.centered, { paddingTop: insets.top }]}>
        <ActivityIndicator color={Colors.brand} size="large" />
      </View>
    );
  }

  if (error && !data) {
    return (
      <View style={[styles.centered, { paddingTop: insets.top }]}>
        <Text style={styles.errorTitle}>Не удалось загрузить главную</Text>
        <Text style={styles.errorText}>{error}</Text>
        <Pressable onPress={() => void refetch()} style={styles.retry}>
          <Text style={styles.retryText}>Повторить</Text>
        </Pressable>
      </View>
    );
  }

  if (!data) return null;

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + Spacing.xxxl },
        ]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => void refetch()}
            tintColor={Colors.brand}
            colors={[Colors.brand]}
          />
        }
        // Keep scroll work light while images decode
        removeClippedSubviews
      >
        <HomeHeader />

        <View style={styles.sectionPad}>
          <HeroBanner data={data.hero} />
        </View>

        <View style={styles.sectionPad}>
          <EcosystemSection data={data.ecosystem} onItemPress={onDirectionPress} />
        </View>

        <InspirationSection data={data.inspiration} />

        <View style={styles.sectionPad}>
          <ProjectCtaBanner data={data.projectCta} />
        </View>
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
    gap: Layout.sectionGap,
    paddingTop: Spacing.md,
  },
  sectionPad: {
    paddingHorizontal: Layout.screenPadding,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.xl,
    gap: Spacing.sm,
  },
  errorTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.text,
  },
  errorText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  retry: {
    marginTop: Spacing.md,
    backgroundColor: Colors.brand,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: 12,
  },
  retryText: {
    color: Colors.textOnDark,
    fontWeight: '700',
  },
});
