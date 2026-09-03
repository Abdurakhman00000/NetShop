import { memo, useCallback } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';

import { EcosystemCard } from '@/components/home/EcosystemCard';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Layout } from '@/constants/theme';
import type { EcosystemDirection, HomeFeed } from '@/types/home';

type EcosystemSectionProps = {
  data: HomeFeed['ecosystem'];
  onItemPress?: (item: EcosystemDirection) => void;
};

function EcosystemSectionComponent({ data, onItemPress }: EcosystemSectionProps) {
  const { width } = useWindowDimensions();
  const featured = data.items.find((item) => item.size === 'featured');
  const gridItems = data.items.filter((item) => item.size === 'grid');
  const gridCardWidth = (width - Layout.screenPadding * 2 - Layout.cardGap) / 2;

  const handlePress = useCallback(
    (item: EcosystemDirection) => {
      onItemPress?.(item);
    },
    [onItemPress],
  );

  return (
    <View>
      <SectionHeader title={data.title} meta={data.directionsLabel} />
      <View style={styles.stack}>
        {featured ? <EcosystemCard item={featured} onPress={handlePress} /> : null}
        <View style={styles.grid}>
          {gridItems.map((item) => (
            <View key={item.id} style={{ width: gridCardWidth }}>
              <EcosystemCard item={item} onPress={handlePress} />
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

export const EcosystemSection = memo(EcosystemSectionComponent);

const styles = StyleSheet.create({
  stack: {
    gap: Layout.cardGap,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Layout.cardGap,
  },
});
