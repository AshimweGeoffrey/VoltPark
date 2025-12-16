export const uid = (p = 'vp'): string =>
  `${p}_${Math.random().toString(36).slice(2)}_${Date.now().toString(36)}`

export const minutesUntil = (entryISO: string, paidMinutes: number): number => {
  const entry = new Date(entryISO).getTime()
  const end = entry + paidMinutes * 60 * 1000
  const diff = Math.floor((end - Date.now()) / 60000)
  return diff
}

export const money = (v: number) => `$${v.toFixed(2)}`

export const nowISO = () => new Date().toISOString()
