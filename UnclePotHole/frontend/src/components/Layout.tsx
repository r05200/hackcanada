import { type ReactNode } from 'react'
import BottomNav from './BottomNav'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col h-full">
      <main className="flex-1 overflow-y-auto">{children}</main>
      <BottomNav />
    </div>
  )
}
