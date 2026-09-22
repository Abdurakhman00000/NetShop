import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { memo, useCallback } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View, type ListRenderItem } from 'react-native';

import { SectionHeader } from '@/components/ui/SectionHeader';
import { Colors, FontSize, Radii, Spacing } from '@/constants/theme';
import type { HomeFeed, InspirationItem } from '@/types/home';

const CARD_WIDTH = 132;
const CARD_HEIGHT = 168;

type InspirationCardProps = {
  item: InspirationItem;
  disabled?: boolean;
  onPress?: (item: InspirationItem) => void;
};

function InspirationCardComponent({ item, disabled, onPress }: InspirationCardProps) {
  const isDisabled = disabled || Boolean(item.disabled);

  return (
    <Pressable
      onPress={() => {
        if (isDisabled) return;
        onPress?.(item);
      }}
      disabled={isDisabled}
      style={[styles.card, isDisabled && styles.cardDisabled]}
      accessibilityRole="button"
      accessibilityLabel={item.title}
      accessibilityState={{ disabled: isDisabled }}
    >
      <Image
        source={item.image}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        transition={180}
        cachePolicy="memory-disk"
      />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.7)']}
        style={StyleSheet.absoluteFill}
      />
      {isDisabled ? <View style={styles.disabledOverlay} pointerEvents="none" /> : null}
      <Text style={styles.label}>{item.title}</Text>
    </Pressable>
  );
}

const InspirationCard = memo(InspirationCardComponent);

type InspirationSectionProps = {
  data: HomeFeed['inspiration'];
  onSeeAll?: () => void;
  onItemPress?: (item: InspirationItem) => void;
};

function InspirationSectionComponent({
  data,
  onSeeAll,
  onItemPress,
}: InspirationSectionProps) {
  const sectionDisabled = Boolean(data.disabled);

  const renderItem = useCallback<ListRenderItem<InspirationItem>>(
    ({ item }) => (
      <InspirationCard
        item={item}
        disabled={sectionDisabled}
        onPress={sectionDisabled ? undefined : onItemPress}
      />
    ),
    [onItemPress, sectionDisabled],
  );

  const keyExtractor = useCallback((item: InspirationItem) => item.id, []);

  return (
    <View style={sectionDisabled ? styles.sectionDisabled : undefined}>
      <View style={styles.headerPad}>
        <SectionHeader
          title={data.title}
          actionLabel={data.seeAllLabel}
          onActionPress={sectionDisabled ? undefined : onSeeAll}
          actionDisabled={sectionDisabled}
        />
      </View>
      <FlatList
        data={data.items}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={Separator}
        initialNumToRender={3}
        windowSize={3}
        removeClippedSubviews
        scrollEnabled={!sectionDisabled}
      />
    </View>
  );
}

function Separator() {
  return <View style={{ width: Spacing.md }} />;
}

export const InspirationSection = memo(InspirationSectionComponent);

const styles = StyleSheet.create({
  sectionDisabled: {
    opacity: 0.72,
  },
  headerPad: {
    paddingHorizontal: Spacing.lg,
  },
  list: {
    paddingHorizontal: Spacing.lg,
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: Radii.lg,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    padding: Spacing.md,
    backgroundColor: Colors.surface,
  },
  cardDisabled: {
    opacity: 0.55,
  },
  disabledOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.28)',
  },
  label: {
    color: Colors.textOnDark,
    fontSize: FontSize.md,
    fontWeight: '700',
  },
});
