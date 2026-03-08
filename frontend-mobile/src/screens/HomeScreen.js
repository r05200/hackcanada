import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing } from '../constants';
import { CommunityImpactBanner, DailyQuestCard, PollCard, TrendingActionCard } from '../components/home';
import { useAuth } from '../context/AuthContext';

export default function HomeScreen({ navigation }) {
  const { user } = useAuth();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Top bar */}
        <View style={styles.topBar}>
          <View style={styles.logoBadge}>
            <MaterialIcons name="favorite" size={18} color={Colors.primary} />
            <Text style={[Typography.h4, { color: Colors.primary }]}>Civic Pulse</Text>
          </View>
          <View style={styles.points}>
            <MaterialIcons name="star" size={16} color={Colors.accentYellow} />
            <Text style={[Typography.bodyBold, { color: Colors.text }]}>
              {user ? `${(user.xp || 0).toLocaleString()} pts` : '0 pts'}
            </Text>
          </View>
        </View>

        {/* Welcome */}
        <Text style={[Typography.h1, styles.welcome]}>
          Welcome back,{'\n'}{user?.username || 'Citizen'}!
        </Text>
        <Text style={[Typography.body, styles.welcomeSub]}>Ready to make a difference today?</Text>

        {/* Community Impact */}
        <CommunityImpactBanner />

        {/* Daily Quest */}
        <View style={styles.section}>
          <DailyQuestCard onReport={() => navigation.navigate('Report')} />
        </View>

        {/* Poll */}
        <View style={styles.section}>
          <PollCard />
        </View>

        {/* Trending Action */}
        <View style={styles.section}>
          <TrendingActionCard />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  container: { padding: Spacing.xl, paddingBottom: Spacing.xxxl },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xxl,
  },
  logoBadge: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  points: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
  welcome: { color: Colors.text, marginBottom: Spacing.sm },
  welcomeSub: { color: Colors.textSecondary, marginBottom: Spacing.xl },
  section: { marginBottom: Spacing.lg },
});
