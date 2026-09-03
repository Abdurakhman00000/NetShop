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
  onPress?: (item: InspirationItem) => void;
};

function InspirationCardComponent({ item, onPress }: InspirationCardProps) {
  return (
    <Pressable
      onPress={() => onPress?.(item)}
      style={styles.card}
      accessibilityRole="button"
      accessibilityLabel={item.title}
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
  const renderItem = useCallback<ListRenderItem<InspirationItem>>(
    ({ item }) => <InspirationCard item={item} onPress={onItemPress} />,
    [onItemPress],
  );

  const keyExtractor = useCallback((item: InspirationItem) => item.id, []);

  return (
    <View>
      <View style={styles.headerPad}>
        <SectionHeader
          title={data.title}
          actionLabel={data.seeAllLabel}
          onActionPress={onSeeAll}
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
        // Performance: keep offscreen work low for horizontal carousels
        initialNumToRender={3}
        windowSize={3}
        removeClippedSubviews
      />
    </View>
  );
}

function Separator() {
  return <View style={{ width: Spacing.md }} />;
}

export const InspirationSection = memo(InspirationSectionComponent);

const styles = StyleSheet.create({
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
  label: {
    color: Colors.textOnDark,
    fontSize: FontSize.md,
    fontWeight: '700',
  },
});
