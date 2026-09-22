import { Ionicons } from '@expo/vector-icons';
import { memo } from 'react';
import { Pressable, StyleSheet, Text, View, type ColorValue } from 'react-native';

import { Colors, FontSize, Radii, Spacing } from '@/constants/theme';

export type ProfileMenuItem = {
  id: string;
  title: string;
  subtitle?: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconBg: ColorValue;
  iconColor: ColorValue;
  accentTitle?: boolean;
  disabled?: boolean;
  onPress?: () => void;
};

type ProfileMenuProps = {
  items: ProfileMenuItem[];
};

function MenuRow({ item, isLast }: { item: ProfileMenuItem; isLast: boolean }) {
  const disabled = Boolean(item.disabled);

  return (
    <Pressable
      onPress={disabled ? undefined : item.onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.row,
        disabled && styles.rowDisabled,
        pressed && !disabled && styles.pressed,
      ]}
      accessibilityRole="button"
      accessibilityLabel={item.title}
      accessibilityState={{ disabled }}
    >
      <View style={[styles.iconWrap, { backgroundColor: item.iconBg }]}>
        <Ionicons name={item.icon} size={20} color={item.iconColor} />
      </View>
      <View style={[styles.copy, !isLast && styles.rowBorder]}>
        <View style={styles.textCol}>
          <Text
            style={[
              styles.title,
              item.accentTitle && !disabled && styles.titleAccent,
              disabled && styles.titleDisabled,
            ]}
          >
            {item.title}
          </Text>
          {item.subtitle ? (
            <Text style={[styles.subtitle, disabled && styles.subtitleDisabled]}>
              {item.subtitle}
            </Text>
          ) : null}
        </View>
        <Ionicons
          name="chevron-forward"
          size={18}
          color={disabled ? Colors.border : Colors.textMuted}
        />
      </View>
    </Pressable>
  );
}

function ProfileMenuComponent({ items }: ProfileMenuProps) {
  return (
    <View style={styles.card}>
      {items.map((item, index) => (
        <MenuRow key={item.id} item={item} isLast={index === items.length - 1} />
      ))}
    </View>
  );
}

export const ProfileMenu = memo(ProfileMenuComponent);

const styles = StyleSheet.create({
  card: {
    marginTop: Spacing.xl,
    backgroundColor: Colors.surfaceElevated,
    borderTopLeftRadius: Radii.xxl,
    borderTopRightRadius: Radii.xxl,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.xxl,
    flexGrow: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: Spacing.lg,
    minHeight: 64,
  },
  rowDisabled: {
    opacity: 0.42,
  },
  pressed: {
    backgroundColor: Colors.brandSoft,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: Radii.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  copy: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: Spacing.lg,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  rowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
  },
  textCol: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontFamily: 'DMSans_500Medium',
    fontSize: FontSize.md,
    color: Colors.text,
  },
  titleAccent: {
    color: Colors.brand,
    fontFamily: 'DMSans_700Bold',
  },
  titleDisabled: {
    color: Colors.textSecondary,
  },
  subtitle: {
    fontFamily: 'DMSans_400Regular',
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  subtitleDisabled: {
    color: Colors.textMuted,
  },
});
