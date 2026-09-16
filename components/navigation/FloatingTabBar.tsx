import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import type { ComponentProps } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors, FontSize, Radii, Shadows, Spacing } from '@/constants/theme';

type FloatingTabBarProps = Parameters<
  NonNullable<ComponentProps<typeof Tabs>['tabBar']>
>[0];

type IconName = ComponentProps<typeof Ionicons>['name'];

const TAB_META: Record<
  string,
  { label: string; outline: IconName; filled: IconName }
> = {
  index: { label: 'Главная', outline: 'home-outline', filled: 'home' },
  catalog: { label: 'Каталог', outline: 'grid-outline', filled: 'grid' },
  services: { label: 'Услуги', outline: 'time-outline', filled: 'time' },
  cart: { label: 'Корзина', outline: 'bag-outline', filled: 'bag' },
  profile: { label: 'Профиль', outline: 'person-outline', filled: 'person' },
};

const ICON_SIZE = 22;
const CAPSULE_HEIGHT = 62;
const SIDE_INSET = 18;

export function FloatingTabBar({ state, descriptors, navigation }: FloatingTabBarProps) {
  const insets = useSafeAreaInsets();
  // Extra lift so the floating capsule sits slightly above the screen edge / home indicator
  const bottomPad = Math.max(insets.bottom, Platform.OS === 'android' ? 10 : 8) + 14;

  return (
    <View
      pointerEvents="box-none"
      style={[styles.wrapper, { paddingBottom: bottomPad }]}
    >
      <View style={styles.capsule}>
        {state.routes.map((route, index) => {
          const focused = state.index === index;
          const meta = TAB_META[route.name] ?? {
            label: descriptors[route.key]?.options.title ?? route.name,
            outline: 'ellipse-outline' as IconName,
            filled: 'ellipse' as IconName,
          };
          const { options } = descriptors[route.key];

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!focused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          return (
            <Animated.View
              key={route.key}
              layout={LinearTransition.duration(220)}
              style={focused ? styles.itemActiveGrow : styles.itemIdle}
            >
              <Pressable
                accessibilityRole="button"
                accessibilityState={focused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel ?? meta.label}
                onPress={onPress}
                onLongPress={onLongPress}
                style={({ pressed }) => [
                  styles.itemPressable,
                  focused ? styles.itemActive : styles.itemInactive,
                  pressed && styles.itemPressed,
                ]}
              >
                <Ionicons
                  name={focused ? meta.filled : meta.outline}
                  size={ICON_SIZE}
                  color={focused ? Colors.tabBarActiveFg : Colors.tabBarInactiveIcon}
                />
                {focused ? (
                  <Animated.View
                    entering={FadeIn.duration(160)}
                    exiting={FadeOut.duration(100)}
                    style={styles.labelWrap}
                  >
                    <Text numberOfLines={1} style={styles.label}>
                      {meta.label}
                    </Text>
                  </Animated.View>
                ) : null}
              </Pressable>
            </Animated.View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: SIDE_INSET,
    paddingTop: Spacing.sm,
    backgroundColor: 'transparent',
    borderTopWidth: 0,
  },
  capsule: {
    height: CAPSULE_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: Radii.pill,
    backgroundColor: Colors.tabBarCapsule,
    gap: 4,
    ...Shadows.soft,
    shadowOpacity: 0.22,
    shadowRadius: 16,
    elevation: 10,
  },
  itemIdle: {
    flexGrow: 0,
    flexShrink: 0,
  },
  itemActiveGrow: {
    flexGrow: 1,
    flexShrink: 1,
    minWidth: 0,
  },
  itemPressable: {
    height: 48,
    borderRadius: Radii.pill,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemInactive: {
    width: 48,
    paddingHorizontal: 0,
  },
  itemActive: {
    alignSelf: 'stretch',
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.tabBarActiveBg,
    gap: 6,
  },
  itemPressed: {
    opacity: 0.88,
  },
  labelWrap: {
    flexShrink: 1,
    minWidth: 0,
  },
  label: {
    color: Colors.tabBarActiveFg,
    fontSize: FontSize.sm,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
});
