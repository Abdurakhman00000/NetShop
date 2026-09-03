import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import type { ComponentProps } from 'react';
import { Platform, type ColorValue } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors, FontSize } from '@/constants/theme';

type IconName = ComponentProps<typeof Ionicons>['name'];

type TabIconProps = {
  color: ColorValue;
  size: number;
  name: IconName;
  focused: boolean;
};

function TabIcon({ name, color, size, focused }: TabIconProps) {
  const iconName = (focused ? name.replace('-outline', '') : name) as IconName;
  return <Ionicons name={iconName} size={size} color={color} />;
}

const TAB_BAR_CONTENT_HEIGHT = 56;

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  // Android gesture/3-button nav often sits over a fixed-height tab bar
  const bottomInset = Math.max(insets.bottom, Platform.OS === 'android' ? 12 : 0);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.brand,
        tabBarInactiveTintColor: Colors.tabInactive,
        tabBarHideOnKeyboard: true,
        tabBarLabelStyle: {
          fontSize: FontSize.xs,
          fontWeight: '600',
          marginBottom: 2,
        },
        tabBarItemStyle: {
          paddingTop: 4,
        },
        tabBarStyle: {
          backgroundColor: Colors.background,
          borderTopColor: Colors.border,
          height: TAB_BAR_CONTENT_HEIGHT + bottomInset,
          paddingTop: 4,
          paddingBottom: bottomInset,
        },
        sceneStyle: {
          backgroundColor: Colors.background,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Главная',
          tabBarLabel: 'Главная',
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon name="home-outline" color={color} size={size} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="catalog"
        options={{
          title: 'Каталог',
          tabBarLabel: 'Каталог',
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon name="grid-outline" color={color} size={size} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="services"
        options={{
          title: 'Услуги',
          tabBarLabel: 'Услуги',
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon name="time-outline" color={color} size={size} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Корзина',
          tabBarLabel: 'Корзина',
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon name="bag-outline" color={color} size={size} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Профиль',
          tabBarLabel: 'Профиль',
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon name="person-outline" color={color} size={size} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}
