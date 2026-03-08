import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Avatar, Badge } from '../components/common';
import { StatCard } from '../components/profile';
import { CategoryBreakdown } from '../components/profile';
import { Colors, Typography, Spacing, BorderRadius } from '../constants';

export default function ProfileScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <MaterialIcons name="arrow-back" size={24} color={Colors.text} onPress={() => navigation.goBack()} />
          <Text style={[Typography.h4, { flex: 1, textAlign: 'center', color: Colors.text }]}>
            Civic Stat Sheet
          </Text>
          <TouchableOpacity>
            <MaterialIcons name="settings" size={22} color={Colors.text} />
          </TouchableOpacity>
        </View>

        {/* Profile info */}
        <View style={styles.profile}>
          <Avatar name="Alex Chen" size={72} level={5} />
          <Text style={[Typography.h2, { color: Colors.text, marginTop: Spacing.md }]}>Alex Chen</Text>
          <View style={styles.ridingRow}>
            <MaterialIcons name="location-on" size={16} color={Colors.textSecondary} />
            <Text style={[Typography.body, { color: Colors.textSecondary }]}>Toronto Centre Riding</Text>
          </View>
          <Text style={[Typography.caption, { color: Colors.textTertiary }]}>Member since 2023</Text>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <StatCard icon="military-tech" label="Total Points" value="15" color={Colors.accentYellow} />
          <StatCard icon="description" label="Total Reports" value="18" color={Colors.accentBlue} />
        </View>

        {/* Earned Badges */}
        <Text style={[Typography.h4, { color: Colors.text, marginBottom: Spacing.md }]}>Earned Badges</Text>
        <View style={styles.badges}>
          <Badge icon="wb-twilight" label="Early Bird" color={Colors.accentOrange} />
          <Badge icon="query-stats" label="Poll Master" color={Colors.accentPurple} />
        </View>

        {/* Category Breakdown */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[Typography.h4, { color: Colors.text }]}>Category Breakdown</Text>
            <Text style={[Typography.captionBold, { color: Colors.primary }]}>View All</Text>
          </View>
          <CategoryBreakdown />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  container: { padding: Spacing.xl, paddingBottom: Spacing.xxxl },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.xxl },
  profile: { alignItems: 'center', marginBottom: Spacing.xxl },
  ridingRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: Spacing.xs },
  statsRow: { flexDirection: 'row', gap: Spacing.md, marginBottom: Spacing.xxl },
  badges: {
    flexDirection: 'row',
    gap: Spacing.xl,
    marginBottom: Spacing.xxl,
  },
  section: { marginBottom: Spacing.xl },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
});
