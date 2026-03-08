import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import Card from '../components/common/Card';
import { Colors, Typography, Spacing, BorderRadius } from '../constants';

export default function MapScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <MaterialIcons name="menu" size={24} color={Colors.text} />
        <Text style={[Typography.h2, { color: Colors.text }]}>Toronto Centre</Text>
        <View style={styles.filters}>
          <FilterChip label="Active District" icon="tune" active />
        </View>
      </View>

      {/* Map placeholder */}
      <View style={styles.mapContainer}>
        <View style={styles.mapPlaceholder}>
          <MaterialIcons name="map" size={80} color={Colors.primaryLight} />
          <Text style={[Typography.body, { color: Colors.textSecondary }]}>Map View</Text>
        </View>

        {/* Map controls */}
        <View style={styles.mapControls}>
          <MapButton icon="search" />
          <MapButton icon="my-location" />
          <MapButton icon="add" />
          <MapButton icon="remove" />
          <MapButton icon="layers" />
        </View>

        {/* Issue pin card */}
        <Card style={styles.issueCard}>
          <View style={styles.issueHeader}>
            <View style={styles.urgentBadge}>
              <MaterialIcons name="warning" size={14} color={Colors.accentOrange} />
              <Text style={[Typography.small, { color: Colors.accentOrange, fontWeight: '700' }]}>
                Urgent Issue
              </Text>
            </View>
          </View>
          <Text style={[Typography.h4, { color: Colors.text }]}>Pothole</Text>
          <View style={styles.issueScore}>
            <Text style={[Typography.caption, { color: Colors.textSecondary }]}>Score</Text>
            <Text style={[Typography.h3, { color: Colors.primary }]}>87%</Text>
          </View>
          <View style={styles.issueMeta}>
            <View style={styles.reporter}>
              <MaterialIcons name="person" size={14} color={Colors.textSecondary} />
              <Text style={[Typography.caption, { color: Colors.textSecondary }]}>Jane Doe</Text>
            </View>
            <View style={styles.rewardSmall}>
              <Text style={[Typography.captionBold, { color: Colors.success }]}>+1 POINT</Text>
              <Text style={[Typography.small, { color: Colors.textSecondary }]}>Awarded</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.viewDetails}
            onPress={() => navigation.navigate('ReportDetails')}
            activeOpacity={0.7}
          >
            <Text style={[Typography.captionBold, { color: Colors.primary }]}>VIEW DETAILS</Text>
            <MaterialIcons name="arrow-forward-ios" size={12} color={Colors.primary} />
          </TouchableOpacity>
        </Card>
      </View>

      {/* Report FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('Report')}
        activeOpacity={0.8}
      >
        <MaterialIcons name="photo-camera" size={22} color={Colors.textOnPrimary} />
        <Text style={styles.fabText}>REPORT ISSUE</Text>
        <View style={styles.fabBadge}>
          <Text style={styles.fabBadgeText}>+5</Text>
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

function FilterChip({ label, icon, active }) {
  return (
    <View style={[styles.chip, active && styles.chipActive]}>
      <MaterialIcons name={icon} size={14} color={active ? Colors.textOnPrimary : Colors.textSecondary} />
      <Text style={[Typography.small, { color: active ? Colors.textOnPrimary : Colors.textSecondary }]}>
        {label}
      </Text>
    </View>
  );
}

function MapButton({ icon }) {
  return (
    <TouchableOpacity style={styles.mapBtn} activeOpacity={0.7}>
      <MaterialIcons name={icon} size={20} color={Colors.text} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: { padding: Spacing.xl, gap: Spacing.sm },
  filters: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.xs },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surfaceAlt,
  },
  chipActive: { backgroundColor: Colors.primary },
  mapContainer: { flex: 1, position: 'relative' },
  mapPlaceholder: {
    flex: 1,
    backgroundColor: Colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  mapControls: {
    position: 'absolute',
    right: Spacing.lg,
    top: Spacing.lg,
    gap: Spacing.sm,
  },
  mapBtn: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  issueCard: {
    position: 'absolute',
    bottom: Spacing.xl,
    left: Spacing.xl,
    right: Spacing.xl,
  },
  issueHeader: { flexDirection: 'row', marginBottom: Spacing.sm },
  urgentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.accentOrange + '15',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  issueScore: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginTop: Spacing.xs },
  issueMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.md,
  },
  reporter: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  rewardSmall: { alignItems: 'flex-end' },
  viewDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  fab: {
    position: 'absolute',
    bottom: Spacing.xxl,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  fabText: { ...Typography.captionBold, color: Colors.textOnPrimary },
  fabBadge: {
    backgroundColor: Colors.textOnPrimary,
    borderRadius: BorderRadius.full,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabBadgeText: { ...Typography.small, color: Colors.primary, fontWeight: '800' },
});
