import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Avatar from '../common/Avatar';
import { Colors, Typography, Spacing, BorderRadius } from '../../constants';

const RANK_COLORS = [Colors.gold, Colors.silver, Colors.bronze];

export default function LeaderboardItem({ rank, name, reports, points, isYou, avatarUri }) {
  const isTop3 = rank <= 3;
  const rankColor = isTop3 ? RANK_COLORS[rank - 1] : Colors.textSecondary;

  return (
    <View style={[styles.container, isYou && styles.youContainer]}>
      <View style={styles.rankWrapper}>
        {isTop3 ? (
          <MaterialIcons name="emoji-events" size={22} color={rankColor} />
        ) : (
          <Text style={[Typography.h4, { color: rankColor }]}>{rank}</Text>
        )}
      </View>

      <Avatar uri={avatarUri} name={name} size={40} />

      <View style={styles.info}>
        <View style={styles.nameRow}>
          <Text style={[Typography.bodyBold, { color: Colors.text }]}>{name}</Text>
          {isYou && (
            <View style={styles.youBadge}>
              <Text style={styles.youText}>YOU</Text>
            </View>
          )}
        </View>
        <Text style={[Typography.caption, { color: Colors.textSecondary }]}>{reports} Reports</Text>
      </View>

      <View style={styles.points}>
        <Text style={[Typography.h4, { color: isYou ? Colors.primary : Colors.text }]}>
          {points.toLocaleString()}
        </Text>
        <Text style={[Typography.small, { color: Colors.textSecondary }]}>
          {isYou ? `RANK #${rank}` : 'PTS'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    gap: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.sm,
  },
  youContainer: {
    backgroundColor: Colors.primaryBg,
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  rankWrapper: { width: 28, alignItems: 'center' },
  info: { flex: 1, gap: 2 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  youBadge: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  youText: { ...Typography.small, color: Colors.textOnPrimary, fontWeight: '700' },
  points: { alignItems: 'flex-end' },
});
