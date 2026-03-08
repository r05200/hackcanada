import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { Button, SectionHeader } from '../components/common';
import CategorySelector from '../components/report/CategorySelector';
import PhotoCapture from '../components/report/PhotoCapture';
import LocationPicker from '../components/report/LocationPicker';
import TextInput from '../components/common/TextInput';
import ProgressBar from '../components/common/ProgressBar';
import { Colors, Typography, Spacing, BorderRadius } from '../constants';

export default function ReportScreen({ navigation }) {
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [details, setDetails] = useState('');

  const totalSteps = 3;

  const handleTakePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 0.8,
      });
      if (!result.canceled) setPhoto(result.assets[0].uri);
      return;
    }
    const result = await ImagePicker.launchCameraAsync({ quality: 0.8 });
    if (!result.canceled) setPhoto(result.assets[0].uri);
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      navigation.navigate('ReportSuccess', { category, photo });
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
    else navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        {/* Header */}
        <View style={styles.header}>
          <MaterialIcons name="arrow-back" size={24} color={Colors.text} onPress={handleBack} />
          <Text style={[Typography.h3, { color: Colors.text, flex: 1, textAlign: 'center' }]}>
            Report an Issue
          </Text>
          <View style={styles.rewardBadge}>
            <MaterialIcons name="stars" size={14} color={Colors.accentYellow} />
            <Text style={[Typography.small, { color: Colors.accentOrange }]}>+50 Points</Text>
          </View>
        </View>

        {/* Progress */}
        <View style={styles.progress}>
          <Text style={[Typography.caption, { color: Colors.textSecondary }]}>
            Step {step} of {totalSteps}
          </Text>
          <ProgressBar progress={step / totalSteps} />
        </View>

        {/* Step 1: Category */}
        {step === 1 && (
          <View style={styles.stepContent}>
            <SectionHeader title="What's the problem?" />
            <Text style={[Typography.body, { color: Colors.textSecondary, marginBottom: Spacing.lg }]}>
              Select the type of issue you've encountered to help us direct it to the right department.
            </Text>
            <CategorySelector selected={category} onSelect={setCategory} />
          </View>
        )}

        {/* Step 2: Photo & Location */}
        {step === 2 && (
          <View style={styles.stepContent}>
            <SectionHeader title="Capture the Evidence" icon="add-a-photo" />
            <PhotoCapture photo={photo} onCapture={handleTakePhoto} />
            <View style={styles.spacer} />
            <SectionHeader title="Current Location" icon="location-on" />
            <LocationPicker address="452 Market St, San Francisco, CA 94104" detected />
          </View>
        )}

        {/* Step 3: Details */}
        {step === 3 && (
          <View style={styles.stepContent}>
            <SectionHeader title="Quest Details" icon="description" />
            <TextInput
              placeholder="Describe the issue in detail..."
              value={details}
              onChangeText={setDetails}
              multiline
            />
            <Text style={[Typography.caption, { color: Colors.textSecondary, marginTop: Spacing.sm }]}>
              You will earn +50 XP for this report
            </Text>
          </View>
        )}

        {/* Action */}
        <Button
          title={step < totalSteps ? 'Continue to Details' : 'Complete Quest'}
          onPress={handleNext}
          disabled={step === 1 && !category}
          icon={
            step < totalSteps ? (
              <MaterialIcons name="arrow-forward" size={20} color={Colors.textOnPrimary} />
            ) : (
              <MaterialIcons name="auto-awesome" size={20} color={Colors.textOnPrimary} />
            )
          }
          size="lg"
          style={styles.actionBtn}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  container: { padding: Spacing.xl, paddingBottom: Spacing.xxxl },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  rewardBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.accentYellow + '15',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.md,
  },
  progress: { gap: Spacing.sm, marginBottom: Spacing.xxl },
  stepContent: { marginBottom: Spacing.xxl },
  spacer: { height: Spacing.xl },
  actionBtn: { marginTop: Spacing.lg },
});
