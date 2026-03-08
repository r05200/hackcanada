import { useState, useEffect } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native'
import { useRouter } from 'expo-router'
import * as ImagePicker from 'expo-image-picker'
import * as Location from 'expo-location'
import { Ionicons } from '@expo/vector-icons'
import api from '@/services/api'
import { Colors } from '@/constants/colors'

export default function NewReportScreen() {
  const router = useRouter()
  const [image, setImage] = useState<string | null>(null)
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState<{
    latitude: number
    longitude: number
  } | null>(null)
  const [locationName, setLocationName] = useState('Detecting location...')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    getCurrentLocation()
  }, [])

  async function getCurrentLocation() {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        setLocationName('Location permission denied')
        return
      }
      const loc = await Location.getCurrentPositionAsync({})
      setLocation({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      })
      // Reverse geocode for display name
      const [address] = await Location.reverseGeocodeAsync({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      })
      if (address) {
        setLocationName(
          [address.street, address.city].filter(Boolean).join(', ') ||
            'Location found',
        )
      } else {
        setLocationName('Location found')
      }
    } catch {
      setLocationName('Could not detect location')
    }
  }

  async function pickImage() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Camera roll access is needed')
      return
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: true,
      aspect: [4, 3],
    })
    if (!result.canceled && result.assets[0]) {
      setImage(result.assets[0].uri)
    }
  }

  async function takePhoto() {
    const { status } = await ImagePicker.requestCameraPermissionsAsync()
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Camera access is needed')
      return
    }
    const result = await ImagePicker.launchCameraAsync({
      quality: 0.8,
      allowsEditing: true,
      aspect: [4, 3],
    })
    if (!result.canceled && result.assets[0]) {
      setImage(result.assets[0].uri)
    }
  }

  async function handleSubmit() {
    if (!image) {
      Alert.alert('Photo Required', 'Please take or select a photo')
      return
    }
    if (!location) {
      Alert.alert('Location Required', 'Please wait for location detection')
      return
    }
    setSubmitting(true)
    try {
      const formData = new FormData()
      formData.append('image', {
        uri: image,
        type: 'image/jpeg',
        name: 'report.jpg',
      } as any)
      formData.append('latitude', location.latitude.toString())
      formData.append('longitude', location.longitude.toString())
      if (description.trim()) {
        formData.append('description', description.trim())
      }

      const { data } = await api.post('/reports', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      Alert.alert(
        'Quest Complete! 🎉',
        `Detected: ${data.category.replace('-', ' ')}\nConfidence: ${Math.round(data.confidence * 100)}%\nPoints earned: +${data.pointsAwarded}`,
        [
          {
            text: 'View Details',
            onPress: () => router.replace(`/report/${data._id}`),
          },
          { text: 'Back to Map', onPress: () => router.back() },
        ],
      )
    } catch (err: any) {
      Alert.alert(
        'Submission Failed',
        err.response?.data?.error ?? 'Something went wrong',
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <ScrollView
      className="flex-1 bg-pulse-bg"
      contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
      keyboardShouldPersistTaps="handled"
    >
      {/* Header */}
      <View className="flex-row items-center mb-6">
        <TouchableOpacity onPress={() => router.back()} className="mr-3">
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <View>
          <Text className="text-text-primary text-xl font-bold">
            New Report Quest
          </Text>
          <Text className="text-text-secondary text-sm">
            Submit a photo and we'll identify the issue
          </Text>
        </View>
      </View>

      {/* Photo area */}
      <View className="mb-6">
        <Text className="text-text-secondary text-sm mb-2 ml-1">
          Photo Evidence
        </Text>
        {image ? (
          <TouchableOpacity onPress={pickImage}>
            <Image
              source={{ uri: image }}
              className="w-full h-56 rounded-xl"
              resizeMode="cover"
            />
            <View className="absolute top-2 right-2 bg-black/50 rounded-full p-1.5">
              <Ionicons name="pencil" size={16} color="#fff" />
            </View>
          </TouchableOpacity>
        ) : (
          <View className="flex-row gap-3">
            <TouchableOpacity
              className="flex-1 h-40 rounded-xl bg-pulse-surface border border-dashed border-pulse-border items-center justify-center"
              onPress={takePhoto}
            >
              <Ionicons name="camera" size={32} color={Colors.accent} />
              <Text className="text-text-secondary text-sm mt-2">
                Take Photo
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 h-40 rounded-xl bg-pulse-surface border border-dashed border-pulse-border items-center justify-center"
              onPress={pickImage}
            >
              <Ionicons name="images" size={32} color={Colors.accent} />
              <Text className="text-text-secondary text-sm mt-2">
                Gallery
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Location */}
      <View className="mb-6">
        <Text className="text-text-secondary text-sm mb-2 ml-1">
          Location
        </Text>
        <View className="bg-pulse-surface rounded-xl border border-pulse-border px-4 py-3 flex-row items-center">
          <Ionicons
            name="location"
            size={18}
            color={location ? Colors.green : Colors.textMuted}
          />
          <Text className="text-text-primary ml-3 flex-1">
            {locationName}
          </Text>
          {!location && (
            <ActivityIndicator size="small" color={Colors.accent} />
          )}
        </View>
      </View>

      {/* Description */}
      <View className="mb-8">
        <Text className="text-text-secondary text-sm mb-2 ml-1">
          Description (optional)
        </Text>
        <TextInput
          className="bg-pulse-surface border border-pulse-border rounded-xl px-4 py-3 text-text-primary text-base min-h-[100px]"
          placeholder="Describe the issue..."
          placeholderTextColor="#64748B"
          multiline
          textAlignVertical="top"
          value={description}
          onChangeText={setDescription}
        />
      </View>

      {/* AI note */}
      <View className="bg-pulse-card rounded-xl border border-pulse-border p-4 mb-6 flex-row items-start">
        <Ionicons name="sparkles" size={20} color={Colors.accent} />
        <View className="ml-3 flex-1">
          <Text className="text-text-primary font-medium text-sm">
            AI-Powered Detection
          </Text>
          <Text className="text-text-muted text-xs mt-1">
            Our ML models will automatically identify the type of issue from
            your photo — pothole, road defect, flooding, fallen trees, or
            damaged lights.
          </Text>
        </View>
      </View>

      {/* Submit */}
      <TouchableOpacity
        className={`rounded-xl py-4 items-center ${
          submitting ? 'bg-pulse-accent/60' : 'bg-pulse-accent'
        }`}
        onPress={handleSubmit}
        disabled={submitting}
      >
        {submitting ? (
          <View className="flex-row items-center">
            <ActivityIndicator size="small" color="#fff" />
            <Text className="text-white font-semibold text-base ml-2">
              Analyzing & Submitting...
            </Text>
          </View>
        ) : (
          <Text className="text-white font-semibold text-base">
            Submit Report
          </Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  )
}
