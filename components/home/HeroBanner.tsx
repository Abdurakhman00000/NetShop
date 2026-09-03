import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Colors, FontSize, Radii, Spacing } from '@/constants/theme';
import type { HeroBanner as HeroBannerType } from '@/types/home';

type HeroBannerProps = {
  data: HeroBannerType;
  onPress?: () => void;
};

function HeroBannerComponent({ data, onPress }: HeroBannerProps) {
  return (
    <Pressable onPress={onPress} style={styles.wrap} accessibilityRole="button">
      <Image
        source={data.image}
        style={styles.image}
        contentFit="cover"
        transition={200}
        cachePolicy="memory-disk"
      />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.15)', 'rgba(0,0,0,0.72)']}
        locations={[0, 0.35, 1]}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.content}>
        <Text style={styles.title}>{data.title}</Text>
        <Text style={styles.subtitle}>{data.subtitle}</Text>
      </View>
    </Pressable>
  );
}

export const HeroBanner = memo(HeroBannerComponent);

const styles = StyleSheet.create({
  wrap: {
    height: 168,
    borderRadius: Radii.xl,
    overflow: 'hidden',
    backgroundColor: Colors.surface,
  },
  image: {
    ...StyleSheet.absoluteFill,
  },
  content: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: Spacing.lg,
    gap: 6,
  },
  title: {
    color: Colors.textOnDark,
    fontSize: FontSize.xl,
    fontWeight: '700',
    lineHeight: 26,
    maxWidth: '92%',
  },
  subtitle: {
    color: Colors.textOnDarkMuted,
    fontSize: FontSize.sm,
    lineHeight: 18,
    maxWidth: '95%',
  },
});
