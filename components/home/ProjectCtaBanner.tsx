import { Ionicons } from '@expo/vector-icons';
import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Colors, FontSize, Radii, Spacing } from '@/constants/theme';
import type { ProjectCta } from '@/types/home';

type ProjectCtaBannerProps = {
  data: ProjectCta;
  onPress?: () => void;
};

function ProjectCtaBannerComponent({ data, onPress }: ProjectCtaBannerProps) {
  const disabled = Boolean(data.disabled);

  return (
    <View style={[styles.container, disabled && styles.containerDisabled]}>
      <View style={styles.iconWrap}>
        <Ionicons name="home-outline" size={20} color={Colors.brand} />
      </View>
      <View style={styles.textBlock}>
        <Text style={styles.title}>{data.title}</Text>
        <Text style={styles.subtitle}>{data.subtitle}</Text>
      </View>
      <Pressable
        onPress={disabled ? undefined : onPress}
        disabled={disabled}
        style={[styles.button, disabled && styles.buttonDisabled]}
        accessibilityRole="button"
        accessibilityLabel={data.buttonLabel}
        accessibilityState={{ disabled }}
      >
        <Text style={styles.buttonText}>{data.buttonLabel}</Text>
      </Pressable>
    </View>
  );
}

export const ProjectCtaBanner = memo(ProjectCtaBannerComponent);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.brandSoft,
    borderColor: 'rgba(139, 26, 42, 0.14)',
    borderWidth: 1,
    borderRadius: Radii.xl,
    padding: Spacing.md,
  },
  containerDisabled: {
    opacity: 0.45,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textBlock: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: FontSize.sm,
    fontWeight: '700',
    color: Colors.text,
  },
  subtitle: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    lineHeight: 16,
  },
  button: {
    backgroundColor: Colors.brand,
    paddingHorizontal: Spacing.lg,
    paddingVertical: 10,
    borderRadius: Radii.md,
  },
  buttonDisabled: {
    backgroundColor: Colors.textMuted,
  },
  buttonText: {
    color: Colors.textOnDark,
    fontSize: FontSize.sm,
    fontWeight: '700',
  },
});
