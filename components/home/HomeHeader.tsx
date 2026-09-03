import { router } from 'expo-router';
import { memo, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppLogo, LocationChip } from '@/components/ui/AppLogo';
import { AvatarButton } from '@/components/ui/AvatarButton';
import { SearchBar } from '@/components/ui/SearchBar';
import { Spacing } from '@/constants/theme';
import type { HomeLocation } from '@/types/home';

type HomeHeaderProps = {
  location: HomeLocation;
};

function HomeHeaderComponent({ location }: HomeHeaderProps) {
  const openProfile = useCallback(() => {
    router.push('/(tabs)/profile');
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View>
          <AppLogo variant="dark" size="md" />
          <LocationChip city={location.city} />
        </View>
        <AvatarButton onPress={openProfile} />
      </View>
      <SearchBar />
    </View>
  );
}

export const HomeHeader = memo(HomeHeaderComponent);

const styles = StyleSheet.create({
  container: {
    gap: Spacing.lg,
    paddingHorizontal: Spacing.lg,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
});
