export interface User {
  _id: string
  displayName: string
  email: string
  ridingId?: string
  totalPoints: number
  totalReports: number
  createdAt: string
}

export interface Riding {
  _id: string
  name: string
  slug: string
  type: 'mp' | 'mpp'
  center?: {
    type: 'Point'
    coordinates: [number, number]
  }
  boundary?: {
    type: 'Polygon'
    coordinates: number[][][]
  }
}

export type Category =
  | 'road-defect'
  | 'flooding'
  | 'fallen-trees'
  | 'damaged-lights'
  | 'pothole'

export interface Report {
  _id: string
  userId: string
  ridingId?: string
  category: Category
  description: string
  location: {
    type: 'Point'
    coordinates: [number, number] // [lng, lat]
  }
  mlScores: Record<string, number>
  confidence: number
  pointsAwarded: number
  status: 'pending' | 'verified' | 'resolved'
  createdAt: string
}

export interface LeaderboardEntry {
  _id: string
  displayName: string
  totalPoints: number
  totalReports: number
}

export interface AuthResponse {
  token: string
  user: User
}

export interface ProfileStats {
  user: User
  categoryBreakdown: Array<{
    _id: Category
    count: number
  }>
}

export interface PaginatedResponse<T> {
  data: T[]
  page: number
  totalPages: number
  total: number
}
