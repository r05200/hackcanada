import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, TextInput } from '../components/common';
import { Colors, Typography, Spacing, BorderRadius } from '../constants';
import { authApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function AuthScreen({ navigation }) {
  const [handle, setHandle] = useState('');
  const [email, setEmail] = useState('');
  const [riding, setRiding] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const { login } = useAuth();

  const handleRegister = async () => {
    if (!handle || !email || !password) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }
    setLoading(true);
    try {
      const res = await authApi.register({
        username: handle,
        email,
        password,
        neighborhood: riding || undefined,
      });
      await login(res.access_token, res.user);
      navigation.replace('MainTabs');
    } catch (e) {
      Alert.alert('Registration Failed', e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in email and password');
      return;
    }
    setLoading(true);
    try {
      const res = await authApi.login({ email, password });
      await login(res.access_token, res.user);
      navigation.replace('MainTabs');
    } catch (e) {
      Alert.alert('Login Failed', e.message);
    } finally {
      setLoading(false);
    }
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

            <Text style={[Typography.h1, styles.title]}>
              {isLogin ? 'Welcome\nBack' : 'Become a\nHero'}
            </Text>
            <Text style={[Typography.body, styles.subtitle]}>
              {isLogin
                ? 'Log in to continue making a difference!'
                : 'Your community needs your voice. Join thousands of Toronto citizens making a difference!'}
            </Text>
          </View>

          <View style={styles.form}>
            {!isLogin && (
              <TextInput
                label="Hero Handle"
                icon="person"
                placeholder="Choose your hero name"
                value={handle}
                onChangeText={setHandle}
                autoCapitalize="none"
              />
            )}
            <TextInput
              label="Email Address"
              icon="mail"
              placeholder="you@example.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {!isLogin && (
              <TextInput
                label="Riding"
                icon="location-on"
                placeholder="Your neighborhood / riding"
                value={riding}
                onChangeText={setRiding}
              />
            )}
            <TextInput
              label="Secret Key"
              icon="lock"
              placeholder={isLogin ? 'Enter your password' : 'Create a password'}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <Button
            title={isLogin ? 'Log In' : 'Assemble the Squad'}
            onPress={isLogin ? handleLogin : handleRegister}
            loading={loading}
            icon={<MaterialIcons name="bolt" size={20} color={Colors.textOnPrimary} />}
            size="lg"
            style={styles.registerBtn}
          />

          <Button
            title={isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Log In'}
            variant="ghost"
            onPress={() => setIsLogin(!isLogin)}
            style={styles.switchBtn}
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
  registerBtn: { marginBottom: Spacing.sm },
  switchBtn: { marginBottom: Spacing.lg },
  terms: { ...Typography.caption, color: Colors.textTertiary, textAlign: 'center' },
});
