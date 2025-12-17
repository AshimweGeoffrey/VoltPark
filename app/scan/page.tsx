'use client'

import { useState, useEffect, useRef } from 'react'
import { getZones, processImage, createPublicSession } from './actions'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import Loading from '../ui/Loading'
import Image from 'next/image'
import logo from '../logo.png'

// Modern Layout Component
const PublicLayout = ({
  children,
  title,
}: {
  children: React.ReactNode
  title: string
}) => (
  <div className="min-h-screen bg-[var(--background)] flex flex-col items-center justify-center p-4 md:p-8">
    <div className="w-full max-w-md space-y-8">
      <header className="flex flex-col items-center text-center space-y-2">
        <div className="relative h-12 w-12 overflow-hidden rounded-xl bg-[var(--primary)] shadow-lg">
          <Image src={logo} alt="VoltPark" fill className="object-cover" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">
            {title}
          </h1>
          <p className="text-sm text-[var(--muted-foreground)]">
            Automated Parking Entry System
          </p>
        </div>
      </header>
      <main className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-6 shadow-xl md:p-8">
        {children}
      </main>
      <footer className="text-center text-xs text-[var(--muted-foreground)]">
        &copy; {new Date().getFullYear()} VoltPark Kigali. All rights reserved.
      </footer>
    </div>
  </div>
)

export default function ScanPage() {
  const [zones, setZones] = useState<any[]>([])
  const [selectedZone, setSelectedZone] = useState('')
  const [image, setImage] = useState<string | null>(null)
  const [plate, setPlate] = useState('')
  const [loading, setLoading] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    loadZones()
  }, [])

  const loadZones = async () => {
    try {
      const data = await getZones()
      setZones(data || [])
      if (data && data.length > 0) setSelectedZone(data[0].id)
    } catch (err) {
      console.error('Failed to load zones', err)
      setError('Failed to load parking zones')
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImage(reader.result as string)
        setPlate('')
        setSuccess(false)
        setError('')
      }
      reader.readAsDataURL(file)
    }
  }

  const handleScan = async () => {
    if (!image) return
    setProcessing(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('image', image)

      const result = await processImage(formData)
      if (result.success && result.text) {
        setPlate(result.text.toUpperCase().trim())
      } else {
        setError(result.error || 'Could not detect text')
      }
    } catch (err) {
      setError('OCR processing failed')
    } finally {
      setProcessing(false)
    }
  }

  const handleStartSession = async () => {
    if (!plate || !selectedZone) return
    setLoading(true)
    setError('')

    try {
      const result = await createPublicSession(plate, selectedZone)
      if (result.success) {
        setSuccess(true)
        setImage(null)
        setPlate('')
        setTimeout(() => setSuccess(false), 3000)
      }
    } catch (err: any) {
      setError(err.message || 'Failed to start session')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <PublicLayout title="Session Active">
        <div className="flex flex-col items-center justify-center space-y-6 py-8">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600 shadow-sm">
            <svg
              className="h-10 w-10"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <div className="text-center space-y-2">
            <h2 className="text-xl font-bold text-[var(--foreground)]">
              Success!
            </h2>
            <p className="text-[var(--muted-foreground)]">
              Parking session has been started for <br />
              <span className="font-mono font-bold text-[var(--foreground)]">
                {plate}
              </span>
            </p>
          </div>
          <Button onClick={() => setSuccess(false)} className="w-full">
            Scan Next Vehicle
          </Button>
        </div>
      </PublicLayout>
    )
  }

  return (
    <PublicLayout title="Camera Entry">
      <div className="space-y-6">
        {/* Zone Selector */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-[var(--foreground)]">
            Select Zone
          </label>
          <div className="relative">
            <select
              value={selectedZone}
              onChange={(e) => setSelectedZone(e.target.value)}
              className="block w-full appearance-none rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-[var(--foreground)] shadow-sm focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
            >
              {zones.map((z) => (
                <option key={z.id} value={z.id}>
                  {z.name} — {z.rate_per_hour} {z.currency}/hr
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[var(--muted-foreground)]">
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Camera/Image Input */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-[var(--foreground)]">
            Capture Vehicle
          </label>
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileChange}
            ref={fileInputRef}
            className="hidden"
          />

          {!image ? (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="group flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-[var(--border)] bg-[var(--secondary)] p-12 transition hover:border-[var(--primary)] hover:bg-[var(--accent)]"
            >
              <div className="mb-4 rounded-full bg-[var(--background)] p-4 shadow-sm group-hover:scale-110 transition-transform">
                <svg
                  className="h-8 w-8 text-[var(--muted-foreground)] group-hover:text-[var(--primary)]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <span className="font-medium text-[var(--foreground)]">
                Tap to take photo
              </span>
              <span className="text-sm text-[var(--muted-foreground)]">
                or upload image
              </span>
            </button>
          ) : (
            <div className="relative overflow-hidden rounded-xl border border-[var(--border)] shadow-sm">
              <img
                src={image}
                alt="Preview"
                className="h-64 w-full object-cover"
              />
              <button
                onClick={() => {
                  setImage(null)
                  setPlate('')
                }}
                className="absolute right-3 top-3 rounded-full bg-black/50 p-2 text-white backdrop-blur-sm hover:bg-black/70 transition-colors"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Actions */}
        {image && !plate && (
          <Button
            onClick={handleScan}
            disabled={processing}
            className="w-full py-6 text-lg"
          >
            {processing ? (
              <div className="flex items-center justify-center gap-2">
                <Loading /> <span>Scanning Plate...</span>
              </div>
            ) : (
              'Scan Plate'
            )}
          </Button>
        )}

        {/* Result & Confirmation */}
        {plate && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-4 rounded-xl border border-blue-100 bg-blue-50/50 p-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-blue-900">
                Detected Plate Number
              </label>
              <Input
                value={plate}
                onChange={(e) => setPlate(e.target.value.toUpperCase())}
                className="border-blue-200 bg-white text-center text-2xl font-bold tracking-widest text-blue-950 shadow-sm"
              />
            </div>
            <Button
              onClick={handleStartSession}
              disabled={loading}
              className="w-full py-6 text-lg shadow-blue-200"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loading /> <span>Starting Session...</span>
                </div>
              ) : (
                'Confirm & Start Session'
              )}
            </Button>
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600 flex items-center gap-3">
            <svg
              className="h-5 w-5 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {error}
          </div>
        )}
      </div>
    </PublicLayout>
  )
}
