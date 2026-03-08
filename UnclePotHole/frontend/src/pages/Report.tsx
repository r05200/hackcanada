import { useState, useRef, type FormEvent, type ChangeEvent } from 'react'
import api from '../api'

function fmtCat(c: string) {
  return c.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
}

export default function Report() {
  const [lat, setLat] = useState('')
  const [lng, setLng] = useState('')
  const [desc, setDesc] = useState('')
  const [preview, setPreview] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{
    ok: boolean
    msg: string
  } | null>(null)

  function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (ev) => setPreview(ev.target?.result as string)
      reader.readAsDataURL(file)
    }
  }

  function getLocation() {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(pos.coords.latitude.toFixed(6))
        setLng(pos.coords.longitude.toFixed(6))
      },
      () => alert('Could not get location'),
      { enableHighAccuracy: true },
    )
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const file = fileRef.current?.files?.[0]
    if (!file) return
    if (!lat || !lng) return

    setLoading(true)
    setResult(null)

    const fd = new FormData()
    fd.append('image', file)
    fd.append('latitude', lat)
    fd.append('longitude', lng)
    fd.append('description', desc)
    try {
      const { data } = await api.post('/reports', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }) // image will be sent to backend, then
      setResult({
        ok: true,
        msg: `Submitted! Category: ${fmtCat(data.category)} (${data.confidence}% confidence) — ${data.pointsAwarded} pt${data.pointsAwarded !== 1 ? 's' : ''} earned`,
      })
      // reset
      setPreview(null)
      setDesc('')
      setLat('')
      setLng('')
      if (fileRef.current) fileRef.current.value = ''
    } catch (err: any) {
      setResult({
        ok: false,
        msg: err.response?.data?.error || err.message,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 bg-dark-800 border-b border-dark-500">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <i className="fas fa-camera text-accent" />
          Report an Issue
        </h2>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        {/* Photo */}
        <div>
          <label className="block text-sm text-gray-400 mb-1">
            Photo of Issue
          </label>
          <div
            onClick={() => fileRef.current?.click()}
            className="relative h-48 bg-dark-600 border-2 border-dashed border-dark-500 rounded-xl overflow-hidden cursor-pointer hover:border-accent/50 transition"
          >
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFile}
              className="hidden"
            />
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-500 gap-2">
                <i className="fas fa-camera text-3xl" />
                <p className="text-sm">Tap to take a photo or upload</p>
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm text-gray-400 mb-1">
            Description (optional)
          </label>
          <textarea
            rows={3}
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Describe the issue..."
            className="w-full px-3 py-2.5 bg-dark-600 border border-dark-500 rounded-lg text-gray-100 placeholder-gray-500 outline-none focus:border-accent focus:ring-2 focus:ring-accent/30 transition resize-none"
          />
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm text-gray-400 mb-1">Location</label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Latitude"
              required
              value={lat}
              onChange={(e) => setLat(e.target.value)}
              className="flex-1 px-3 py-2.5 bg-dark-600 border border-dark-500 rounded-lg text-gray-100 placeholder-gray-500 outline-none focus:border-accent transition"
            />
            <input
              type="text"
              placeholder="Longitude"
              required
              value={lng}
              onChange={(e) => setLng(e.target.value)}
              className="flex-1 px-3 py-2.5 bg-dark-600 border border-dark-500 rounded-lg text-gray-100 placeholder-gray-500 outline-none focus:border-accent transition"
            />
            <button
              type="button"
              onClick={getLocation}
              className="px-3 py-2.5 bg-dark-600 border border-dark-500 rounded-lg text-gray-400 hover:text-accent hover:border-accent transition"
            >
              <i className="fas fa-crosshairs" />
            </button>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-accent hover:bg-accent-hover text-white font-semibold rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <span className="inline-block h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <i className="fas fa-paper-plane" /> Submit Report
            </>
          )}
        </button>

        {/* Result */}
        {result && (
          <div
            className={`p-3 rounded-lg text-sm ${
              result.ok
                ? 'bg-green-500/10 text-green-400 border border-green-500/30'
                : 'bg-red-500/10 text-red-400 border border-red-500/30'
            }`}
          >
            {result.msg}
          </div>
        )}
      </form>
    </div>
  )
}
