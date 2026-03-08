import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Colors, Typography, BorderRadius, Spacing } from '../../constants';

const VARIANTS = {
  primary: { bg: Colors.primary, text: Colors.textOnPrimary },
  secondary: { bg: Colors.primaryBg, text: Colors.primaryDark },
  outline: { bg: 'transparent', text: Colors.primary, border: Colors.primary },
  danger: { bg: Colors.error, text: Colors.textOnPrimary },
  ghost: { bg: 'transparent', text: Colors.text },
};

export default function Button({
  title,
  onPress,
  variant = 'primary',
  icon,
  loading,
  disabled,
  style,
  textStyle,
  size = 'md',
}) {
  const v = VARIANTS[variant];
  const height = size === 'sm' ? 36 : size === 'lg' ? 56 : 46;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      style={[
        styles.button,
        {
          backgroundColor: v.bg,
          height,
          borderColor: v.border || 'transparent',
          borderWidth: v.border ? 1.5 : 0,
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={v.text} />
      ) : (
        <>
          {icon}
          <Text style={[Typography.button, { color: v.text, fontSize: size === 'sm' ? 13 : 16 }, textStyle]}>
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.xl,
    gap: Spacing.sm,
  },
});
