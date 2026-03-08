import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '../../constants';

export default function PhotoCapture({ photo, onCapture }) {
  return (
    <TouchableOpacity style={styles.container} onPress={onCapture} activeOpacity={0.7}>
      {photo ? (
        <Image source={{ uri: photo }} style={styles.image} />
      ) : (
        <View style={styles.placeholder}>
          <MaterialIcons name="add-a-photo" size={36} color={Colors.primary} />
          <Text style={[Typography.bodyBold, { color: Colors.primary }]}>Add Photo</Text>
          <Text style={[Typography.caption, { color: Colors.textSecondary }]}>Tap to capture evidence</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: BorderRadius.xl,
    borderWidth: 2,
    borderColor: Colors.primaryLight,
    borderStyle: 'dashed',
    overflow: 'hidden',
  },
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primaryBg,
    gap: Spacing.sm,
  },
  image: { width: '100%', height: '100%', resizeMode: 'cover' },
});
