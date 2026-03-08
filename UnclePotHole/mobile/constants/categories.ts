import { Category } from '@/types'

export interface CategoryInfo {
  key: Category
  label: string
  icon: string
  color: string
}

export const CATEGORIES: CategoryInfo[] = [
  {
    key: 'pothole',
    label: 'Pothole',
    icon: 'alert-circle',
    color: '#EF4444',
  },
  {
    key: 'road-defect',
    label: 'Road Defect',
    icon: 'car',
    color: '#FB923C',
  },
  {
    key: 'flooding',
    label: 'Flooding',
    icon: 'water',
    color: '#60A5FA',
  },
  {
    key: 'fallen-trees',
    label: 'Fallen Trees',
    icon: 'leaf',
    color: '#34D399',
  },
  {
    key: 'damaged-lights',
    label: 'Damaged Lights',
    icon: 'flashlight',
    color: '#FBBF24',
  },
]

export const CATEGORY_MAP: Record<Category, CategoryInfo> =
  Object.fromEntries(CATEGORIES.map((c) => [c.key, c])) as Record<
    Category,
    CategoryInfo
  >
