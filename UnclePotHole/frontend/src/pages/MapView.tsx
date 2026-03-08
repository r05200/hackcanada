import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import api from '../api'
import type { Riding, ReportItem } from '../types'

const CAT_COLORS: Record<string, string> = {
  pothole: '#C62828',
  'road-defect': '#E65100',
  flooding: '#1565C0',
  'fallen-trees': '#2E7D32',
  'damaged-lights': '#F57F17',
}

const CAT_ICONS: Record<string, string> = {
  pothole: 'fa-road',
  'road-defect': 'fa-triangle-exclamation',
  flooding: 'fa-water',
  'fallen-trees': 'fa-tree',
  'damaged-lights': 'fa-lightbulb',
}

function markerIcon(cat: string) {
  const color = CAT_COLORS[cat] || '#6C5CE7'
  const icon = CAT_ICONS[cat] || 'fa-exclamation'
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="width:32px;height:32px;border-radius:50%;background:${color};border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,0.4);display:flex;align-items:center;justify-content:center"><i class="fas ${icon}" style="color:#fff;font-size:14px"></i></div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -18],
  })
}

function fmtCat(c: string) {
  return c.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
}

function timeAgo(d: string) {
  const diff = Date.now() - new Date(d).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'Just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  const days = Math.floor(h / 24)
  if (days < 7) return `${days}d ago`
  return new Date(d).toLocaleDateString()
}

export default function MapView() {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<L.Map | null>(null)
  const markersRef = useRef<L.Marker[]>([])
  const [ridings, setRidings] = useState<Riding[]>([])
  const [ridingId, setRidingId] = useState('')

  // init map
  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return
    const m = L.map(mapRef.current, { center: [43.65, -79.38], zoom: 12 })
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(m)
    mapInstance.current = m

    // load ridings
    api.get('/ridings').then(({ data }) => setRidings(data)).catch(() => {})

    return () => {
      m.remove()
      mapInstance.current = null
    }
  }, [])

  // load reports when riding changes
  useEffect(() => {
    if (!mapInstance.current) return
    loadReports()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ridingId, ridings])

  async function loadReports() {
    const m = mapInstance.current!
    markersRef.current.forEach((mk) => m.removeLayer(mk))
    markersRef.current = []

    const sources = ridingId
      ? [ridingId]
      : ridings.map((r) => r._id)

    for (const rid of sources) {
      try {
        const { data } = await api.get(`/reports?ridingId=${rid}&limit=50`)
        const reports: ReportItem[] = data.data || []
        for (const r of reports) {
          if (!r.location?.coordinates) continue
          const [lng, lat] = r.location.coordinates
          const mk = L.marker([lat, lng], { icon: markerIcon(r.category) })
            .bindPopup(
              `<div style="font-family:system-ui">
                <strong>${r.userName || 'Anonymous'}</strong><br/>
                <span style="display:inline-block;padding:2px 8px;border-radius:10px;font-size:12px;font-weight:600;background:${CAT_COLORS[r.category] || '#6C5CE7'}22;color:${CAT_COLORS[r.category] || '#6C5CE7'}">${fmtCat(r.category)}</span>
                ${r.description ? `<p style="margin:4px 0;font-size:13px;color:#555">${r.description}</p>` : ''}
                <p style="font-size:11px;color:#999;margin-top:4px">${timeAgo(r.createdAt)}</p>
              </div>`,
            )
            .addTo(m)
          markersRef.current.push(mk)
        }
      } catch {
        /* skip */
      }
    }
  }

  // Resize map when it becomes visible
  useEffect(() => {
    const timer = setTimeout(() => mapInstance.current?.invalidateSize(), 200)
    return () => clearTimeout(timer)
  })

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-3 bg-dark-800 border-b border-dark-500">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <i className="fas fa-map-marked-alt text-accent" />
          Issue Map
        </h2>
        <select
          value={ridingId}
          onChange={(e) => setRidingId(e.target.value)}
          className="px-3 py-1.5 bg-dark-600 border border-dark-500 rounded-lg text-sm text-gray-100 outline-none focus:border-accent"
        >
          <option value="">All Ridings</option>
          {ridings.map((r) => (
            <option key={r._id} value={r._id}>
              {r.name}
            </option>
          ))}
        </select>
      </div>
      <div ref={mapRef} className="flex-1" />
    </div>
  )
}
