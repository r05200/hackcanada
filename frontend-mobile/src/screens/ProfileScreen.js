import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Avatar, Badge } from '../components/common';
import { StatCard } from '../components/profile';
import { CategoryBreakdown } from '../components/profile';
import { Colors, Typography, Spacing, BorderRadius } from '../constants';
import { useAuth } from '../context/AuthContext';
import { usersApi } from '../services/api';

const BADGE_ICONS = {
  'Early Bird': 'wb-twilight',
  'Poll Master': 'query-stats',
  'First Report': 'flag',
  'Community Hero': 'military-tech',
};

export default function ProfileScreen({ navigation }) {
  const { user, logout } = useAuth();
  const [badges, setBadges] = useState([]);

  useEffect(() => {
    const fetchBadges = async () => {
      try {
        const res = await usersApi.getMyBadges();
        setBadges(res.badges || []);
      } catch (e) {
        // Keep empty badges on error
      }
    };
    fetchBadges();
  }, []);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await logout();
          navigation.reset({ index: 0, routes: [{ name: 'Auth' }] });
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={{ width: 24 }} />
          <Text style={[Typography.h4, { flex: 1, textAlign: 'center', color: Colors.text }]}>
            Civic Stat Sheet
          </Text>
          <TouchableOpacity onPress={handleLogout}>
            <MaterialIcons name="logout" size={22} color={Colors.text} />
          </TouchableOpacity>
        </View>

        {/* Profile info */}
        <View style={styles.profile}>
          <Avatar name={user?.username || 'User'} size={72} level={user?.level || 1} />
          <Text style={[Typography.h2, { color: Colors.text, marginTop: Spacing.md }]}>
            {user?.username || 'User'}
          </Text>
          <View style={styles.ridingRow}>
            <MaterialIcons name="location-on" size={16} color={Colors.textSecondary} />
            <Text style={[Typography.body, { color: Colors.textSecondary }]}>
              {user?.neighborhood || 'No riding set'}
            </Text>
          </View>
          <Text style={[Typography.caption, { color: Colors.textTertiary }]}>
            Level {user?.level || 1}
          </Text>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <StatCard
            icon="military-tech"
            label="Total Points"
            value={String(user?.xp || 0)}
            color={Colors.accentYellow}
          />
          <StatCard
            icon="description"
            label="Level"
            value={String(user?.level || 1)}
            color={Colors.accentBlue}
          />
        </View>

        {/* Earned Badges */}
        <Text style={[Typography.h4, { color: Colors.text, marginBottom: Spacing.md }]}>Earned Badges</Text>
        <View style={styles.badges}>
          {badges.length > 0 ? (
            badges.map((badge, i) => (
              <Badge
                key={i}
                icon={BADGE_ICONS[badge] || 'stars'}
                label={badge}
                color={i % 2 === 0 ? Colors.accentOrange : Colors.accentPurple}
              />
            ))
          ) : (
            <Text style={[Typography.body, { color: Colors.textSecondary }]}>
              No badges earned yet. Start reporting!
            </Text>
          )}
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
    flexWrap: 'wrap',
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
