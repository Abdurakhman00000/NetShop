import { Tabs } from 'expo-router';

import { FloatingTabBar } from '@/components/navigation';
import { Colors } from '@/constants/theme';

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <FloatingTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        sceneStyle: {
          backgroundColor: Colors.background,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Главная',
        }}
      />
      <Tabs.Screen
        name="catalog"
        options={{
          title: 'Каталог',
        }}
      />
      <Tabs.Screen
        name="services"
        options={{
          title: 'Услуги',
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Корзина',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Профиль',
        }}
      />
    </Tabs>
  );
}
