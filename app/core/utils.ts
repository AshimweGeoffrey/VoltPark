export const uid = (p = 'vp'): string => {
  // If we need a valid UUID for the database, we should ignore the prefix 'p'
  // or use it only for display purposes if the DB wasn't strict.
  // Since the DB expects UUID type, we must return a valid UUID.
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  // Fallback for environments without crypto.randomUUID (unlikely in modern browsers/node)
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export const minutesUntil = (entryISO: string, paidMinutes: number): number => {
  const entry = new Date(entryISO).getTime()
  const end = entry + paidMinutes * 60 * 1000
  const diff = Math.floor((end - Date.now()) / 60000)
  return diff
}

export const money = (v: number | null | undefined) => {
  if (v === null || v === undefined) return 'RWF 0'
  return `RWF ${v.toLocaleString()}`
}

export const nowISO = () => new Date().toISOString()
