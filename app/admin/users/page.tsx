'use client'
import { useState } from 'react'
import { useStore } from '../../core/store'
import type { Role, Profile } from '../../core/types'
import Shell from '../../ui/Shell'
import { Button } from '../../ui/Button'
import { Input } from '../../ui/Input'

const roles: Role[] = ['ADMIN', 'OFFICER', 'DRIVER']

export default function UsersPage() {
  const store = useStore()
  const [form, setForm] = useState<{
    id?: string
    fullName: string
    role: Role
    balance: number
  }>({ fullName: '', role: 'DRIVER', balance: 0 })

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.fullName || !form.id) return
    await store.upsertUser(form)
    setForm({ fullName: '', role: 'DRIVER', balance: 0 })
  }

  const edit = (u: Profile) => setForm({
      id: u.id,
      fullName: u.fullName || '',
      role: u.role,
      balance: u.balance
  })

  return (
    <Shell
      title="Users"
      nav={[
        { label: 'Home', href: '/admin', icon: 'home' },
        { label: 'System Config', href: '/admin/config', icon: 'config' },
        { label: 'Users', href: '/admin/users', icon: 'users' },
        { label: 'Analytics', href: '/admin/analytics', icon: 'analytics' },
      ]}
    >
      <div className="grid gap-8">
        <div className="rounded-xl bg-[var(--background)] p-8 shadow-sm">
          <h2 className="mb-6 text-xl font-bold text-[var(--foreground)]">Edit User</h2>
          <form
            onSubmit={submit}
            className="grid grid-cols-1 gap-6 sm:grid-cols-4"
          >
            <Input
              placeholder="Full name"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            />
            <Input
              type="number"
              placeholder="Balance"
              value={form.balance}
              onChange={(e) => setForm({ ...form, balance: Number(e.target.value) })}
            />
            <div className="relative">
              <select
                className="flex h-12 w-full appearance-none rounded-lg bg-[var(--background)] px-4 py-2 text-base shadow-sm ring-1 ring-[var(--border)]/50 transition-all focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                value={form.role}
                onChange={(e) =>
                  setForm({ ...form, role: e.target.value as Role })
                }
              >
                {roles.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-4">
              <Button type="submit" disabled={!form.id}>
                Update
              </Button>
              {form.id && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() =>
                    setForm({ fullName: '', role: 'DRIVER', balance: 0 })
                  }
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </div>

        <div className="rounded-xl bg-[var(--background)] p-8 shadow-sm">
          <h2 className="mb-6 text-xl font-bold text-[var(--foreground)]">Users</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-base">
              <thead className="text-[var(--muted-foreground)] font-medium">
                <tr>
                  <th className="pb-4 pl-2">Name</th>
                  <th className="pb-4">Role</th>
                  <th className="pb-4">Balance</th>
                  <th className="pb-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]/30">
                {store.users.map((u) => (
                  <tr key={u.id} className="group">
                    <td className="py-4 pl-2 font-medium">{u.fullName || 'N/A'}</td>
                    <td className="py-4">
                      <span className="inline-flex items-center rounded-full bg-[var(--secondary)] px-2.5 py-0.5 text-xs font-medium text-[var(--foreground)]">
                        {u.role}
                      </span>
                    </td>
                    <td className="py-4">{u.balance}</td>
                    <td className="py-4 text-right flex gap-2 justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => edit(u)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => store.deleteUser(u.id)}
                        className="text-red-600 hover:bg-red-50 hover:text-red-700"
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Shell>
  )
}
