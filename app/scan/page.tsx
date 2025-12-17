'use client'

import { useState, useEffect, useRef } from 'react'
import { getZones, processImage, createPublicSession } from './actions'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import Loading from '../ui/Loading'
import Image from 'next/image'
import Link from 'next/link'
import logo from '../logo.png'

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

  if (loading) return <Loading />

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--background)] p-4 md:p-8">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="flex flex-col items-center text-center space-y-4">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <Image
              src={logo}
              alt="VoltPark"
              width={180}
              height={48}
              className="h-12 w-auto"
              priority
            />
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">
              Scan to Park
            </h1>
            <p className="text-sm text-[var(--muted-foreground)]">
              Automated Entry System
            </p>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl shadow-sm p-6 md:p-8 space-y-6">
          {success ? (
            <div className="flex flex-col items-center justify-center space-y-6 py-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600 shadow-sm animate-in zoom-in duration-300">
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
                  Session Started!
                </h2>
                <p className="text-[var(--muted-foreground)]">
                  Vehicle registered successfully:
                </p>
                <div className="bg-[var(--secondary)] py-2 px-4 rounded-lg font-mono text-xl font-bold tracking-wider border border-[var(--border)]">
                  {plate}
                </div>
              </div>
              <Button
                onClick={() => setSuccess(false)}
                className="w-full"
                variant="outline"
              >
                Scan Next Vehicle
              </Button>
            </div>
          ) : (
            <>
              {/* Zone Selector */}
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Select Parking Zone
                </label>
                <div className="relative">
                  <select
                    value={selectedZone}
                    onChange={(e) => setSelectedZone(e.target.value)}
                    className="flex h-10 w-full items-center justify-between rounded-md border border-[var(--input)] bg-[var(--background)] px-3 py-2 text-sm ring-offset-[var(--background)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none"
                  >
                    {zones.map((z) => (
                      <option key={z.id} value={z.id}>
                        {z.name} — {z.rate_per_hour} {z.currency}/hr
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[var(--muted-foreground)]">
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
              <div className="space-y-4">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative flex flex-col items-center justify-center w-full h-48 rounded-lg border-2 border-dashed transition-colors cursor-pointer overflow-hidden ${
                    image
                      ? 'border-[var(--primary)] bg-[var(--primary)]/5'
                      : 'border-[var(--border)] hover:bg-[var(--secondary)]'
                  }`}
                >
                  {image ? (
                    <Image
                      src={image}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg
                        className="w-10 h-10 mb-3 text-[var(--muted-foreground)]"
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
                      <p className="mb-2 text-sm text-[var(--muted-foreground)]">
                        <span className="font-semibold">Tap to take photo</span>
                      </p>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </div>

                {image && !plate && (
                  <Button
                    onClick={handleScan}
                    disabled={processing}
                    className="w-full"
                  >
                    {processing ? 'Scanning...' : 'Scan Plate'}
                  </Button>
                )}
              </div>

              {/* Manual Entry / Result */}
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Vehicle Plate Number
                </label>
                <Input
                  value={plate}
                  onChange={(e) => setPlate(e.target.value.toUpperCase())}
                  placeholder="RAA 123 A"
                  className="text-center text-lg font-mono uppercase tracking-wider"
                />
              </div>

              {error && (
                <div className="p-3 text-sm text-red-500 bg-red-50 rounded-lg border border-red-100">
                  {error}
                </div>
              )}

              <Button
                onClick={handleStartSession}
                disabled={!plate || !selectedZone || loading}
                className="w-full h-12 text-base shadow-lg shadow-[var(--primary)]/20"
              >
                {loading ? 'Starting Session...' : 'Start Parking Session'}
              </Button>
            </>
          )}
        </div>

        <footer className="text-center text-xs text-[var(--muted-foreground)]">
          &copy; {new Date().getFullYear()} VoltPark Kigali. All rights
          reserved.
        </footer>
      </div>
    </div>
  )
}
