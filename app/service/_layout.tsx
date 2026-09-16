import { Stack } from 'expo-router';

import { Colors } from '@/constants/theme';

export default function ServiceLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.background },
        animation: 'slide_from_right',
      }}
    />
  );
}
