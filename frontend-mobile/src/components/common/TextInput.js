import React from 'react';
import { View, Text, TextInput as RNTextInput, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, BorderRadius, Spacing } from '../../constants';

export default function TextInput({ label, icon, placeholder, value, onChangeText, secureTextEntry, multiline, style, ...props }) {
  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.inputWrapper, multiline && styles.multiline]}>
        {icon && <MaterialIcons name={icon} size={20} color={Colors.textTertiary} />}
        <RNTextInput
          style={[styles.input, multiline && styles.multilineInput]}
          placeholder={placeholder}
          placeholderTextColor={Colors.textTertiary}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          multiline={multiline}
          {...props}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: Spacing.xs },
  label: { ...Typography.captionBold, color: Colors.textSecondary },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceAlt,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    paddingHorizontal: Spacing.md,
    height: 48,
    gap: Spacing.sm,
  },
  multiline: { height: 100, alignItems: 'flex-start', paddingVertical: Spacing.md },
  input: { ...Typography.body, color: Colors.text, flex: 1 },
  multilineInput: { textAlignVertical: 'top', height: '100%' },
});
