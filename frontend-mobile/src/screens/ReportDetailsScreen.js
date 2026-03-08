import React from 'react';
import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import Card from '../components/common/Card';
import { Colors, Typography, Spacing, BorderRadius } from '../constants';

export default function ReportDetailsScreen({ navigation, route }) {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <MaterialIcons name="arrow-back" size={24} color={Colors.text} onPress={() => navigation.goBack()} />
          <Text style={[Typography.h4, { flex: 1, textAlign: 'center', color: Colors.text }]}>
            Report Details
          </Text>
          <TouchableOpacity>
            <MaterialIcons name="share" size={22} color={Colors.text} />
          </TouchableOpacity>
        </View>

        {/* Image placeholder */}
        <View style={styles.imagePlaceholder}>
          <MaterialIcons name="image" size={60} color={Colors.primaryLight} />
          <View style={styles.verifiedBadge}>
            <MaterialIcons name="verified" size={16} color={Colors.success} />
            <Text style={[Typography.captionBold, { color: Colors.success }]}>Verified</Text>
          </View>
        </View>

        {/* Title & meta */}
        <Text style={[Typography.h2, { color: Colors.text, marginBottom: Spacing.md }]}>
          Large Pothole on Maple Avenue
        </Text>

        <View style={styles.metaRow}>
          <MetaChip icon="schedule" label="Reported 2 hours ago" />
          <MetaChip icon="warning" label="Road Hazard" color={Colors.accentOrange} />
          <MetaChip icon="check-circle" label="Submitted" color={Colors.success} />
          <MetaChip icon="stars" label="+1 Point" color={Colors.accentYellow} />
        </View>

        {/* Severity Score */}
        <Card style={styles.severityCard}>
          <Text style={[Typography.caption, { color: Colors.textSecondary }]}>Pothole Severity Score</Text>
          <Text style={[Typography.h1, { color: Colors.primary }]}>87%</Text>
          <Text style={[Typography.caption, { color: Colors.textSecondary, textAlign: 'center' }]}>
            Based on AI analysis, this hazard is prioritized for immediate repair due to depth and traffic volume.
          </Text>
        </Card>

        {/* Description */}
        <View style={styles.section}>
          <Text style={[Typography.h4, { color: Colors.text, marginBottom: Spacing.sm }]}>Description</Text>
          <Text style={[Typography.body, { color: Colors.textSecondary, lineHeight: 22 }]}>
            This pothole is located right in the middle of the northbound lane. It's approximately 10 inches deep
            and very sharp. Multiple cars have been swerving to avoid it, creating a dangerous situation for
            oncoming traffic.
          </Text>
        </View>

        {/* Location */}
        <View style={styles.section}>
          <Text style={[Typography.h4, { color: Colors.text, marginBottom: Spacing.sm }]}>Location</Text>
          <Text style={[Typography.body, { color: Colors.textSecondary }]}>124 Maple Ave, Downtown</Text>
          <View style={styles.mapPlaceholder}>
            <MaterialIcons name="map" size={40} color={Colors.primaryLight} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function MetaChip({ icon, label, color = Colors.textSecondary }) {
  return (
    <View style={[styles.chip, { borderColor: color + '30', backgroundColor: color + '10' }]}>
      <MaterialIcons name={icon} size={14} color={color} />
      <Text style={[Typography.small, { color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  container: { padding: Spacing.xl, paddingBottom: Spacing.xxxl },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  imagePlaceholder: {
    height: 200,
    backgroundColor: Colors.surfaceAlt,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
    position: 'relative',
  },
  verifiedBadge: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginBottom: Spacing.xl },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  severityCard: { alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.xl },
  section: { marginBottom: Spacing.xl },
  mapPlaceholder: {
    height: 120,
    backgroundColor: Colors.surfaceAlt,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.md,
  },
});
