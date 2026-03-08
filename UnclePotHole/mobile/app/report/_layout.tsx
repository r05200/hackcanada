import { Stack } from 'expo-router'
import { Colors } from '@/constants/colors'

export default function ReportLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: Colors.bg },
        headerTintColor: Colors.textPrimary,
        contentStyle: { backgroundColor: Colors.bg },
      }}
    />
  )
}
