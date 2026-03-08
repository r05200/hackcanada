import { useState, useEffect, useRef, useCallback } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native'
import MapView, { Marker, Region, PROVIDER_DEFAULT } from 'react-native-maps'
import * as Location from 'expo-location'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useFocusEffect } from 'expo-router'
import api from '@/services/api'
import { Colors, TORONTO_CENTER } from '@/constants/colors'
import { CATEGORY_MAP } from '@/constants/categories'
import type { Report, Riding } from '@/types'
import PinPopup from '@/components/pin-popup'

export default function MapScreen() {
  const router = useRouter()
  const mapRef = useRef<MapView>(null)
  const [reports, setReports] = useState<Report[]>([])
  const [ridings, setRidings] = useState<Riding[]>([])
  const [selectedRiding, setSelectedRiding] = useState<string | null>(null)
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [userLocation, setUserLocation] = useState<{
    latitude: number
    longitude: number
  } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    requestLocation()
    loadRidings()
  }, [])

  useFocusEffect(
    useCallback(() => {
      loadReports()
    }, [selectedRiding]),
  )

  async function requestLocation() {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status === 'granted') {
        const loc = await Location.getCurrentPositionAsync({})
        setUserLocation({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        })
      }
    } catch {
      // Location is optional
    }
  }

  async function loadRidings() {
    try {
      const { data } = await api.get('/ridings')
      setRidings(data)
    } catch {
      // Non-critical
    }
  }

  async function loadReports() {
    try {
      setLoading(true)
      const params: Record<string, string> = {}
      if (selectedRiding) params.ridingId = selectedRiding
      const { data } = await api.get('/reports', { params })
      setReports(data.data ?? data)
    } catch {
      // Show empty map
    } finally {
      setLoading(false)
    }
  }

  function getMarkerColor(category: string): string {
    return CATEGORY_MAP[category as keyof typeof CATEGORY_MAP]?.color ?? Colors.accent
  }

  function handleMarkerPress(report: Report) {
    setSelectedReport(report)
  }

  function handleNewReport() {
    router.push('/report/new')
  }

  function handleReportDetail(id: string) {
    setSelectedReport(null)
    router.push(`/report/${id}`)
  }

  return (
    <View className="flex-1 bg-pulse-bg">
      {/* Riding filter bar */}
      <View className="absolute top-14 left-4 right-4 z-10">
        <View className="bg-pulse-card/95 rounded-xl px-4 py-3 flex-row items-center border border-pulse-border">
          <Ionicons name="location" size={18} color={Colors.accent} />
          <Text className="text-text-primary ml-2 flex-1 font-medium">
            {selectedRiding
              ? ridings.find((r) => r._id === selectedRiding)?.name ??
                'All Ridings'
              : 'All Ridings'}
          </Text>
          <TouchableOpacity
            onPress={() => {
              // Cycle through ridings or clear
              if (!selectedRiding && ridings.length > 0) {
                setSelectedRiding(ridings[0]._id)
              } else {
                const idx = ridings.findIndex(
                  (r) => r._id === selectedRiding,
                )
                if (idx < ridings.length - 1) {
                  setSelectedRiding(ridings[idx + 1]._id)
                } else {
                  setSelectedRiding(null)
                }
              }
            }}
          >
            <Ionicons name="chevron-forward" size={18} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Map */}
      <MapView
        ref={mapRef}
        provider={PROVIDER_DEFAULT}
        style={{ flex: 1 }}
        initialRegion={
          userLocation
            ? {
                ...userLocation,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
              }
            : TORONTO_CENTER
        }
        showsUserLocation
        showsMyLocationButton={false}
        customMapStyle={darkMapStyle}
      >
        {reports.map((report) => (
          <Marker
            key={report._id}
            coordinate={{
              latitude: report.location.coordinates[1],
              longitude: report.location.coordinates[0],
            }}
            pinColor={getMarkerColor(report.category)}
            onPress={() => handleMarkerPress(report)}
          />
        ))}
      </MapView>

      {/* My location button */}
      <TouchableOpacity
        className="absolute bottom-28 right-4 w-12 h-12 rounded-full bg-pulse-card border border-pulse-border items-center justify-center"
        onPress={() => {
          if (userLocation && mapRef.current) {
            mapRef.current.animateToRegion({
              ...userLocation,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            })
          }
        }}
      >
        <Ionicons name="navigate" size={22} color={Colors.accent} />
      </TouchableOpacity>

      {/* New Report FAB */}
      <TouchableOpacity
        className="absolute bottom-28 left-1/2 -ml-7 w-14 h-14 rounded-full bg-pulse-accent items-center justify-center shadow-lg"
        onPress={handleNewReport}
      >
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>

      {/* Pin popup */}
      {selectedReport && (
        <PinPopup
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
          onDetail={() => handleReportDetail(selectedReport._id)}
        />
      )}

      {loading && (
        <View className="absolute top-28 left-1/2 -ml-4">
          <ActivityIndicator size="small" color={Colors.accent} />
        </View>
      )}
    </View>
  )
}

const darkMapStyle = [
  { elementType: 'geometry', stylers: [{ color: '#1d2c4d' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#8ec3b9' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#1a3646' }] },
  {
    featureType: 'administrative.country',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#4b6878' }],
  },
  {
    featureType: 'land',
    elementType: 'geometry',
    stylers: [{ color: '#1d2c4d' }],
  },
  {
    featureType: 'poi',
    elementType: 'geometry',
    stylers: [{ color: '#283d6a' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#304a7d' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#255763' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#0e1626' }],
  },
]
