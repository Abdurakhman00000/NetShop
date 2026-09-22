import { Ionicons } from '@expo/vector-icons';
import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Colors, FontSize, Spacing } from '@/constants/theme';
import type { User } from '@/types/auth';

type ProfileHeaderProps = {
  user: User;
};

function displayName(user: User): string {
  const name = user.full_name?.trim();
  if (name) return name;
  return user.email.split('@')[0] || 'Пользователь';
}

function formatPhone(phone: string): string {
  const raw = phone.trim();
  if (!raw) return 'Телефон не указан';
  return raw;
}

function ProfileHeaderComponent({ user }: ProfileHeaderProps) {
  return (
    <View style={styles.wrap}>
      <View style={styles.avatar}>
        <Ionicons name="person" size={34} color={Colors.avatarIcon} />
      </View>
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2}>
          {displayName(user)}
        </Text>
        <Text style={styles.phone} numberOfLines={1}>
          {formatPhone(user.phone)}
        </Text>
      </View>
    </View>
  );
}

export const ProfileHeader = memo(ProfileHeaderComponent);

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xl,
    gap: Spacing.lg,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
    gap: 4,
    justifyContent: 'center',
  },
  name: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: FontSize.xl,
    color: Colors.text,
  },
  phone: {
    fontFamily: 'DMSans_400Regular',
    fontSize: FontSize.md,
    color: Colors.textSecondary,
  },
});
