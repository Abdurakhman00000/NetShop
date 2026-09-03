import { Ionicons } from '@expo/vector-icons';
import { memo } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { Colors } from '@/constants/theme';

type AvatarButtonProps = {
  onPress?: () => void;
  size?: number;
};

function AvatarButtonComponent({ onPress, size = 40 }: AvatarButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Профиль"
      style={[
        styles.button,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
        },
      ]}
    >
      <Ionicons name="person" size={size * 0.45} color={Colors.avatarIcon} />
    </Pressable>
  );
}

export const AvatarButton = memo(AvatarButtonComponent);

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.avatarBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
