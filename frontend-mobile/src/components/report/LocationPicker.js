import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '../../constants';

export default function LocationPicker({ address = 'Detecting location...', detected = false }) {
  return (
    <View style={styles.container}>
      <View style={styles.mapPlaceholder}>
        <MaterialIcons name="map" size={48} color={Colors.primaryLight} />
      </View>
      <View style={styles.info}>
        <View style={styles.row}>
          <MaterialIcons
            name={detected ? 'my-location' : 'location-searching'}
            size={18}
            color={detected ? Colors.primary : Colors.textSecondary}
          />
          <Text style={[Typography.caption, { color: detected ? Colors.primary : Colors.textSecondary }]}>
            {detected ? 'Detected' : 'Searching...'}
          </Text>
        </View>
        <View style={styles.row}>
          <MaterialIcons name="location-on" size={18} color={Colors.text} />
          <Text style={[Typography.body, { color: Colors.text, flex: 1 }]} numberOfLines={1}>
            {address}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    overflow: 'hidden',
  },
  mapPlaceholder: {
    height: 120,
    backgroundColor: Colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: { padding: Spacing.md, gap: Spacing.sm },
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
});
