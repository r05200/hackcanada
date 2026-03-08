import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, TextInput } from '../components/common';
import { Colors, Typography, Spacing, BorderRadius } from '../constants';

export default function AuthScreen({ navigation }) {
  const [handle, setHandle] = useState('');
  const [email, setEmail] = useState('');
  const [riding, setRiding] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = () => {
    setLoading(true);
    // TODO: integrate with backend auth
    setTimeout(() => {
      setLoading(false);
      navigation.replace('MainTabs');
    }, 1000);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <View style={styles.levelBadge}>
              <MaterialIcons name="stars" size={18} color={Colors.accentYellow} />
              <Text style={styles.levelText}>LVL 1</Text>
            </View>

            <Text style={[Typography.h1, styles.title]}>Become a{'\n'}Hero</Text>
            <Text style={[Typography.body, styles.subtitle]}>
              Your community needs your voice. Join thousands of Toronto citizens making a difference!
            </Text>
          </View>

          <View style={styles.form}>
            <TextInput
              label="Hero Handle"
              icon="person"
              placeholder="Choose your hero name"
              value={handle}
              onChangeText={setHandle}
              autoCapitalize="none"
            />
            <TextInput
              label="Email Address"
              icon="mail"
              placeholder="you@example.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              label="Riding"
              icon="location-on"
              placeholder="Your neighborhood / riding"
              value={riding}
              onChangeText={setRiding}
            />
            <TextInput
              label="Secret Key"
              icon="lock"
              placeholder="Create a password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <Button
            title="Assemble the Squad"
            onPress={handleRegister}
            loading={loading}
            icon={<MaterialIcons name="bolt" size={20} color={Colors.textOnPrimary} />}
            size="lg"
            style={styles.registerBtn}
          />

          <Text style={styles.terms}>
            By joining, you agree to our Code of Conduct and Privacy Policy
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  flex: { flex: 1 },
  container: { padding: Spacing.xxl, paddingTop: Spacing.xxxl },
  header: { marginBottom: Spacing.xxxl },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    alignSelf: 'flex-start',
    backgroundColor: Colors.accentYellow + '20',
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    marginBottom: Spacing.lg,
  },
  levelText: { ...Typography.captionBold, color: Colors.accentOrange },
  title: { color: Colors.text, marginBottom: Spacing.md },
  subtitle: { color: Colors.textSecondary },
  form: { gap: Spacing.lg, marginBottom: Spacing.xxl },
  registerBtn: { marginBottom: Spacing.lg },
  terms: { ...Typography.caption, color: Colors.textTertiary, textAlign: 'center' },
});
