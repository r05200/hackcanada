export interface User {
  _id: string
  displayName: string
  email: string
  ridingId: string | null
  totalPoints: number
  totalReports: number
  createdAt: string
}

export interface Riding {
  _id: string
  name: string
  type: string
  slug: string
  center: { type: string; coordinates: [number, number] }
}

export interface ReportItem {
  _id: string
  userId: string
  userName: string
  description: string
  category: string
  location: { type: string; coordinates: [number, number] }
  ridingId: string | null
  mlScores: Record<string, number>
  confidence: number
  pointsAwarded: number
  status: string
  createdAt: string
}

export interface LeaderboardEntry {
  rank: number
  _id: string
  displayName: string
  totalPoints: number
  totalReports: number
}

export interface CategoryBreakdown {
  _id: string
  count: number
}
