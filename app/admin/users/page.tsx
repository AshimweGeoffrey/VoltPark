'use client'
import { useState } from 'react'
import { useStore } from '../../core/store'
import type { Role, User } from '../../core/types'
import Shell from '../../ui/Shell'
import { Button } from '../../ui/Button'

const roles: Role[] = ['ADMIN', 'OFFICER', 'DRIVER']

export default function UsersPage() {
  const store = useStore()
  const [form, setForm] = useState<{
    id?: string
    name: string
    email: string
    role: Role
  }>({ name: '', email: '', role: 'DRIVER' })

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email) return
    store.upsertUser(form)
    setForm({ name: '', email: '', role: 'DRIVER' })
  }

  const edit = (u: User) => setForm(u)

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
          <h2 className="mb-6 text-xl font-bold text-[var(--foreground)]">Create / Edit User</h2>
          <form
            onSubmit={submit}
            className="grid grid-cols-1 gap-6 sm:grid-cols-4"
          >
            <Input
              placeholder="Full name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <Input
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
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
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[var(--muted-foreground)]">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>
            <div className="flex gap-4">
              <Button type="submit">
                {form.id ? 'Update' : 'Create'}
              </Button>
              {form.id && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() =>
                    setForm({ name: '', email: '', role: 'DRIVER' })
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
                  <th className="pb-4">Email</th>
                  <th className="pb-4">Role</th>
                  <th className="pb-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]/30">
                {store.users.map((u) => (
                  <tr key={u.id} className="group">
                    <td className="py-4 pl-2 font-medium">{u.name}</td>
                    <td className="py-4 text-[var(--muted-foreground)]">{u.email}</td>
                    <td className="py-4">
                      <span className="inline-flex items-center rounded-full bg-[var(--primary)]/10 px-2.5 py-0.5 text-xs font-medium text-[var(--primary)]">
                        {u.role}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => edit(u)}
                      >
                        Edit
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

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`flex h-12 w-full rounded-lg bg-[var(--background)] px-4 py-2 text-base shadow-sm ring-1 ring-[var(--border)]/50 transition-all placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] ${props.className || ''}`}
    />
  )
}
