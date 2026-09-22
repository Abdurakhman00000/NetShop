import { router, type Href } from 'expo-router';
import { memo, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppLogo, LocationChip } from '@/components/ui/AppLogo';
import { AvatarButton } from '@/components/ui/AvatarButton';
import { SearchBar } from '@/components/ui/SearchBar';
import { Spacing } from '@/constants/theme';
import { useAppSelector } from '@/store/hooks';

function HomeHeaderComponent() {
  const selectedCity = useAppSelector((s) => s.city.selected);

  const openProfile = useCallback(() => {
    router.push('/(tabs)/profile');
  }, []);

  const openCity = useCallback(() => {
    router.push('/city' as Href);
  }, []);

  const openSearch = useCallback(() => {
    router.push('/search' as Href);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View>
          <AppLogo variant="dark" size="md" />
          <LocationChip
            city={selectedCity?.name ?? 'Выберите город'}
            onPress={openCity}
          />
        </View>
        <AvatarButton onPress={openProfile} />
      </View>
      <SearchBar onPress={openSearch} placeholder="Поиск товаров и услуг" />
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
