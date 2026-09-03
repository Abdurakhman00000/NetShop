import { Image, type ImageSource } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { memo } from 'react';
import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppLogo } from '@/components/ui/AppLogo';
import { Brand } from '@/constants/brand';
import { WelcomeImages } from '@/constants/images';
import { Colors, FontSize, Spacing } from '@/constants/theme';

type PolaroidProps = {
  source: ImageSource;
  rotate: `${number}deg`;
  style: object;
};

function Polaroid({ source, rotate, style }: PolaroidProps) {
  return (
    <View style={[styles.polaroid, { transform: [{ rotate }] }, style]}>
      <Image
        source={source}
        style={styles.polaroidImage}
        contentFit="cover"
        cachePolicy="memory-disk"
      />
    </View>
  );
}

function WelcomeScreenComponent() {
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();

  return (
    <View style={styles.root}>
      <Image
        source={WelcomeImages.background}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        priority="high"
        cachePolicy="memory-disk"
      />
      <LinearGradient
        colors={['rgba(0,0,0,0.25)', 'rgba(0,0,0,0.15)', 'rgba(0,0,0,0.55)']}
        locations={[0, 0.45, 1]}
        style={StyleSheet.absoluteFill}
      />

      <View style={[styles.content, { paddingTop: insets.top + Spacing.lg }]}>
        <Animated.View entering={FadeIn.duration(400)}>
          <AppLogo variant="light" size="md" />
        </Animated.View>

        <View style={[styles.polaroids, { top: height * 0.14 }]} pointerEvents="none">
          <Polaroid
            source={WelcomeImages.polaroid1}
            rotate="-8deg"
            style={styles.p1}
          />
          <Polaroid
            source={WelcomeImages.polaroid2}
            rotate="4deg"
            style={styles.p2}
          />
          <Polaroid
            source={WelcomeImages.polaroid3}
            rotate="-3deg"
            style={styles.p3}
          />
        </View>

        <Animated.View
          entering={FadeInDown.delay(180).duration(500)}
          style={[styles.copy, { paddingBottom: insets.bottom + Spacing.xxxl }]}
        >
          <Text style={styles.headline}>Создай уют{'\n'}своего дома</Text>
          <Text style={styles.subheadline}>{Brand.tagline}</Text>
        </Animated.View>
      </View>
    </View>
  );
}

export const WelcomeScreen = memo(WelcomeScreenComponent);

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
  },
  polaroids: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 180,
  },
  polaroid: {
    position: 'absolute',
    backgroundColor: Colors.textOnDark,
    padding: 6,
    paddingBottom: 18,
    borderRadius: 4,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  polaroidImage: {
    width: 92,
    height: 92,
    borderRadius: 2,
  },
  p1: {
    left: '8%',
    top: 24,
  },
  p2: {
    left: '36%',
    top: 0,
  },
  p3: {
    right: '8%',
    top: 36,
  },
  copy: {
    marginTop: 'auto',
    gap: Spacing.md,
  },
  headline: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: FontSize.display,
    lineHeight: 48,
    color: Colors.textOnDark,
  },
  subheadline: {
    fontFamily: 'DMSans_400Regular',
    fontSize: FontSize.md,
    lineHeight: 22,
    color: Colors.textOnDarkMuted,
    maxWidth: '90%',
  },
});
