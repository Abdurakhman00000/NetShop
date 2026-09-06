import { Ionicons } from '@expo/vector-icons';
import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AuthButton } from '@/components/auth/AuthButton';
import { Colors, FontSize, Radii, Spacing } from '@/constants/theme';
import type { User } from '@/types/auth';

type ProfileHeaderProps = {
  user: User;
  onEdit: () => void;
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

function ProfileHeaderComponent({ user, onEdit }: ProfileHeaderProps) {
  return (
    <View style={styles.wrap}>
      <View style={styles.avatar}>
        <Ionicons name="person" size={42} color={Colors.avatarIcon} />
      </View>
      <Text style={styles.name}>{displayName(user)}</Text>
      <Text style={styles.phone}>{formatPhone(user.phone)}</Text>
      <AuthButton
        label="Редактировать профиль"
        variant="outline"
        onPress={onEdit}
        style={styles.editBtn}
      />
    </View>
  );
}

export const ProfileHeader = memo(ProfileHeaderComponent);

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xxl,
    gap: Spacing.sm,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  name: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: FontSize.xxl,
    color: Colors.text,
    textAlign: 'center',
  },
  phone: {
    fontFamily: 'DMSans_400Regular',
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  editBtn: {
    alignSelf: 'stretch',
    maxWidth: 280,
    borderRadius: Radii.lg,
  },
});
