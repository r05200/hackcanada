import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Card } from '../components/common';
import { Colors, Typography, Spacing, BorderRadius } from '../constants';

export default function ReportSuccessScreen({ navigation, route }) {
  const category = route?.params?.category || 'pothole';

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* Close button */}
        <MaterialIcons
          name="close"
          size={24}
          color={Colors.textSecondary}
          onPress={() => navigation.popToTop()}
          style={styles.close}
        />

        {/* Success icon */}
        <View style={styles.successIcon}>
          <MaterialIcons name="check-circle" size={64} color={Colors.primary} />
        </View>

        <Text style={[Typography.caption, { color: Colors.textSecondary }]}>Points Earned</Text>
        <Text style={[Typography.h1, { color: Colors.primary, marginBottom: Spacing.md }]}>+1 Point</Text>

        <Text style={[Typography.h1, { color: Colors.text, textAlign: 'center' }]}>Civic Hero!</Text>
        <Text style={[Typography.body, { color: Colors.textSecondary, textAlign: 'center', marginTop: Spacing.sm }]}>
          Your report has been submitted successfully.
        </Text>

        {/* Report Summary */}
        <Card style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <MaterialIcons name="description" size={18} color={Colors.primary} />
            <Text style={[Typography.h4, { color: Colors.text }]}>Report Summary</Text>
          </View>

          <SummaryRow label="Issue" value="Pothole on Queen St W" />
          <SummaryRow label="Verified by AI" value="87%" valueColor={Colors.primary} />
          <SummaryRow label="Status" value="Submitted" valueColor={Colors.success} />
        </Card>

        {/* Actions */}
        <View style={styles.actions}>
          <Button
            title="Return Home"
            icon={<MaterialIcons name="home" size={20} color={Colors.textOnPrimary} />}
            onPress={() => navigation.popToTop()}
            size="lg"
          />
          <Button
            title="Share to Community"
            variant="outline"
            icon={<MaterialIcons name="share" size={20} color={Colors.primary} />}
            onPress={() => {}}
            size="lg"
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

function SummaryRow({ label, value, valueColor = Colors.text }) {
  return (
    <View style={styles.summaryRow}>
      <Text style={[Typography.caption, { color: Colors.textSecondary }]}>{label}</Text>
      <Text style={[Typography.bodyBold, { color: valueColor }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  container: { flex: 1, padding: Spacing.xl, alignItems: 'center', justifyContent: 'center' },
  close: { position: 'absolute', top: Spacing.xl, right: Spacing.xl },
  successIcon: { marginBottom: Spacing.lg },
  summaryCard: { width: '100%', marginTop: Spacing.xxl },
  summaryHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.lg },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  actions: { width: '100%', gap: Spacing.md, marginTop: Spacing.xxl },
});
