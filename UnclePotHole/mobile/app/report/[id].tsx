import { useState, useEffect } from 'react'
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps'
import api from '@/services/api'
import { Colors } from '@/constants/colors'
import { CATEGORY_MAP } from '@/constants/categories'
import type { Report, Category } from '@/types'

export default function ReportDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const [report, setReport] = useState<Report | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadReport()
  }, [id])

  async function loadReport() {
    try {
      const { data } = await api.get(`/reports/${id}`)
      setReport(data)
    } catch {
      // handle error
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <View className="flex-1 bg-pulse-bg items-center justify-center">
        <ActivityIndicator size="large" color={Colors.accent} />
      </View>
    )
  }

  if (!report) {
    return (
      <View className="flex-1 bg-pulse-bg items-center justify-center px-8">
        <Ionicons name="alert-circle" size={48} color={Colors.red} />
        <Text className="text-text-primary text-lg font-bold mt-4">
          Report Not Found
        </Text>
        <TouchableOpacity
          className="mt-4 bg-pulse-accent rounded-xl px-6 py-3"
          onPress={() => router.back()}
        >
          <Text className="text-white font-semibold">Go Back</Text>
        </TouchableOpacity>
      </View>
    )
  }

  const info = CATEGORY_MAP[report.category as Category]
  const lat = report.location.coordinates[1]
  const lng = report.location.coordinates[0]

  return (
    <ScrollView
      className="flex-1 bg-pulse-bg"
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      {/* Back header */}
      <View className="flex-row items-center px-4 pt-14 pb-4">
        <TouchableOpacity onPress={() => router.back()} className="mr-3">
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text className="text-text-primary text-lg font-bold">
          Report Details
        </Text>
      </View>

      {/* Mini map */}
      <View className="mx-4 h-48 rounded-xl overflow-hidden mb-4">
        <MapView
          provider={PROVIDER_DEFAULT}
          style={{ flex: 1 }}
          initialRegion={{
            latitude: lat,
            longitude: lng,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
          scrollEnabled={false}
          zoomEnabled={false}
        >
          <Marker
            coordinate={{ latitude: lat, longitude: lng }}
            pinColor={info?.color ?? Colors.accent}
          />
        </MapView>
      </View>

      {/* Category badge */}
      <View className="mx-4 mb-4">
        <View
          className="self-start flex-row items-center rounded-full px-4 py-2"
          style={{ backgroundColor: (info?.color ?? Colors.accent) + '20' }}
        >
          <Ionicons
            name={(info?.icon as any) ?? 'alert-circle'}
            size={16}
            color={info?.color ?? Colors.accent}
          />
          <Text
            className="ml-2 font-semibold text-sm"
            style={{ color: info?.color ?? Colors.accent }}
          >
            {info?.label ?? report.category}
          </Text>
        </View>
      </View>

      {/* Info cards */}
      <View className="mx-4 gap-3">
        {/* Confidence */}
        <View className="bg-pulse-card rounded-xl border border-pulse-border p-4">
          <Text className="text-text-muted text-xs uppercase tracking-wider mb-2">
            AI Confidence
          </Text>
          <View className="flex-row items-end">
            <Text className="text-text-primary text-3xl font-bold">
              {Math.round((report.confidence ?? 0) * 100)}
            </Text>
            <Text className="text-text-secondary text-lg ml-1 mb-0.5">%</Text>
          </View>
          {/* Score bars */}
          {report.mlScores && Object.keys(report.mlScores).length > 0 && (
            <View className="mt-3 pt-3 border-t border-pulse-border">
              {Object.entries(report.mlScores)
                .sort(([, a], [, b]) => b - a)
                .map(([key, score]) => {
                  const catInfo = CATEGORY_MAP[key as Category]
                  return (
                    <View key={key} className="flex-row items-center mt-2">
                      <Text className="text-text-secondary text-xs w-28">
                        {catInfo?.label ?? key}
                      </Text>
                      <View className="flex-1 h-2 bg-pulse-surface rounded-full overflow-hidden">
                        <View
                          className="h-full rounded-full"
                          style={{
                            width: `${Math.round(score * 100)}%`,
                            backgroundColor:
                              catInfo?.color ?? Colors.accent,
                          }}
                        />
                      </View>
                      <Text className="text-text-muted text-xs ml-2 w-10 text-right">
                        {Math.round(score * 100)}%
                      </Text>
                    </View>
                  )
                })}
            </View>
          )}
        </View>

        {/* Points */}
        <View className="bg-pulse-card rounded-xl border border-pulse-border p-4 flex-row items-center">
          <View className="w-10 h-10 rounded-full bg-pulse-yellow/20 items-center justify-center">
            <Ionicons name="star" size={20} color={Colors.yellow} />
          </View>
          <View className="ml-3">
            <Text className="text-text-muted text-xs uppercase tracking-wider">
              Points Earned
            </Text>
            <Text className="text-text-primary text-xl font-bold">
              +{report.pointsAwarded}
            </Text>
          </View>
        </View>

        {/* Status */}
        <View className="bg-pulse-card rounded-xl border border-pulse-border p-4 flex-row items-center">
          <View
            className="w-10 h-10 rounded-full items-center justify-center"
            style={{
              backgroundColor:
                report.status === 'resolved'
                  ? Colors.green + '20'
                  : report.status === 'verified'
                    ? Colors.blue + '20'
                    : Colors.orange + '20',
            }}
          >
            <Ionicons
              name={
                report.status === 'resolved'
                  ? 'checkmark-circle'
                  : report.status === 'verified'
                    ? 'shield-checkmark'
                    : 'time'
              }
              size={20}
              color={
                report.status === 'resolved'
                  ? Colors.green
                  : report.status === 'verified'
                    ? Colors.blue
                    : Colors.orange
              }
            />
          </View>
          <View className="ml-3">
            <Text className="text-text-muted text-xs uppercase tracking-wider">
              Status
            </Text>
            <Text className="text-text-primary text-base font-semibold capitalize">
              {report.status}
            </Text>
          </View>
        </View>

        {/* Description */}
        {report.description && (
          <View className="bg-pulse-card rounded-xl border border-pulse-border p-4">
            <Text className="text-text-muted text-xs uppercase tracking-wider mb-2">
              Description
            </Text>
            <Text className="text-text-primary text-base leading-6">
              {report.description}
            </Text>
          </View>
        )}

        {/* Date */}
        <View className="bg-pulse-card rounded-xl border border-pulse-border p-4 flex-row items-center">
          <Ionicons name="calendar" size={18} color={Colors.textSecondary} />
          <Text className="text-text-secondary ml-2">
            {new Date(report.createdAt).toLocaleString()}
          </Text>
        </View>
      </View>
    </ScrollView>
  )
}
