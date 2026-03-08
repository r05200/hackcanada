import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Card from '../common/Card';
import { Colors, Typography, Spacing, BorderRadius } from '../../constants';

export default function PollCard({ question = 'New Bike Lanes on 5th Ave?', endsIn = '4h' }) {
  const [vote, setVote] = useState(null);

  return (
    <Card>
      <View style={styles.header}>
        <Text style={[Typography.caption, { color: Colors.textSecondary }]}>Quick Poll</Text>
        <Text style={[Typography.caption, { color: Colors.accentOrange }]}>Ends in {endsIn}</Text>
      </View>
      <Text style={[Typography.h4, { color: Colors.text, marginBottom: Spacing.md }]}>{question}</Text>
      <View style={styles.buttons}>
        <TouchableOpacity
          style={[styles.voteBtn, vote === 'support' && styles.voteBtnActive]}
          onPress={() => setVote('support')}
          activeOpacity={0.7}
        >
          <MaterialIcons
            name="thumb-up"
            size={18}
            color={vote === 'support' ? Colors.textOnPrimary : Colors.primary}
          />
          <Text style={[styles.voteText, vote === 'support' && styles.voteTextActive]}>Support</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.voteBtn, vote === 'oppose' && styles.voteBtnOppose]}
          onPress={() => setVote('oppose')}
          activeOpacity={0.7}
        >
          <MaterialIcons
            name="thumb-down"
            size={18}
            color={vote === 'oppose' ? Colors.textOnPrimary : Colors.accent}
          />
          <Text style={[styles.voteText, vote === 'oppose' && styles.voteTextActive]}>Oppose</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.sm },
  buttons: { flexDirection: 'row', gap: Spacing.md },
  voteBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  voteBtnActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  voteBtnOppose: { backgroundColor: Colors.accent, borderColor: Colors.accent },
  voteText: { ...Typography.bodyBold, color: Colors.text },
  voteTextActive: { color: Colors.textOnPrimary },
});
