import Link from 'next/link'
import Image from 'next/image'
import logo from './logo.png'
import { Button } from './ui/Button'

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[var(--background)]">
      <header className="sticky top-0 z-50 w-full bg-[var(--background)]/80 backdrop-blur-md border-b border-[var(--border)]/50">
        <div className="container mx-auto flex h-20 items-center justify-between px-6">
          <Link
            href="/"
            className="flex items-center gap-3 hover:opacity-90 transition-opacity"
          >
            <Image
              src={logo}
              alt="VoltPark logo"
              width={160}
              height={42}
              className="h-10 w-auto"
            />
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/officer">
              <Button
                variant="ghost"
                className="text-base font-medium text-[var(--muted-foreground)] hover:text-[var(--primary)]"
              >
                Officer
              </Button>
            </Link>
            <Link href="/driver">
              <Button className="text-base font-medium px-6 shadow-md shadow-[var(--primary)]/20 hover:shadow-[var(--primary)]/40 transition-all hover:-translate-y-0.5">
                Driver App
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-20 md:py-32 lg:py-40 relative overflow-hidden">
          {/* Hero Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=2000&auto=format&fit=crop"
              alt="City Background"
              fill
              className="object-cover opacity-40 animate-in fade-in duration-1000"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[var(--background)]/30 via-[var(--background)]/70 to-[var(--background)]"></div>
          </div>

          <div className="container px-4 md:px-6 mx-auto relative z-10">
            <div className="grid gap-12 lg:grid-cols-[1fr_500px] lg:gap-16 xl:grid-cols-[1fr_600px] items-center">
              <div className="flex flex-col justify-center space-y-8 animate-in slide-in-from-left-10 duration-700 fade-in">
                <div className="space-y-6">
                  <div className="inline-flex items-center rounded-full border border-[var(--primary)]/20 bg-[var(--accent)] px-4 py-1.5 text-sm font-semibold text-[var(--primary)] w-fit shadow-sm hover:bg-[var(--primary)]/10 transition-colors cursor-default">
                    <span className="flex h-2 w-2 rounded-full bg-[var(--primary)] mr-2 animate-pulse"></span>
                    Next Gen Parking
                  </div>
                  <h1 className="text-5xl font-bold tracking-tighter sm:text-6xl xl:text-7xl/none text-[var(--foreground)] drop-shadow-sm">
                    Smart Parking <br />
                    <span className="text-[var(--primary)] bg-clip-text text-transparent bg-gradient-to-r from-[var(--primary)] to-blue-400">
                      Simplified.
                    </span>
                  </h1>
                  <p className="max-w-[600px] text-[var(--muted-foreground)] text-xl leading-relaxed">
                    Manage parking zones, tickets, and revenue across Kigali
                    with a refined operator and driver experience.
                  </p>
                </div>
                <div className="flex flex-col gap-4 min-[400px]:flex-row">
                  <Link href="/officer">
                    <Button
                      size="lg"
                      variant="outline"
                      className="text-lg px-8 py-6 h-auto rounded-xl border-2 bg-white hover:bg-[var(--secondary)] hover:text-[var(--foreground)] transition-all hover:scale-105 active:scale-95"
                    >
                      Officer Dashboard
                    </Button>
                  </Link>
                  <Link href="/driver">
                    <Button
                      size="lg"
                      className="text-lg px-8 py-6 h-auto rounded-xl shadow-xl shadow-[var(--primary)]/20 hover:translate-y-[-4px] hover:shadow-[var(--primary)]/40 transition-all active:scale-95"
                    >
                      Driver App
                    </Button>
                  </Link>
                </div>

                {/* Mini Stats */}
                <div className="flex items-center gap-8 pt-4 text-sm text-[var(--muted-foreground)]">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                    <span>99.9% Uptime</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-500"></div>
                    <span>Real-time Sync</span>
                  </div>
                </div>
              </div>

              {/* Automated Entry Feature */}
              <div className="mx-auto w-full aspect-[4/3] relative rounded-2xl overflow-hidden shadow-2xl shadow-slate-200 border border-[var(--border)] group bg-white animate-in slide-in-from-right-10 duration-700 fade-in delay-200 hover:shadow-[var(--primary)]/20 transition-all">
                <Image
                  src="https://images.unsplash.com/photo-1506521781263-d8422e82f27a?q=80&w=1000&auto=format&fit=crop"
                  alt="Automated Entry Gate"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {/* Scanning Effect Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--primary)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none translate-y-[-100%] group-hover:translate-y-[100%] transition-transform ease-linear duration-[2s]"></div>

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8">
                  <div className="transform transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-white/20 backdrop-blur-md rounded-lg border border-white/10 group-hover:bg-[var(--primary)] group-hover:border-[var(--primary)] transition-colors">
                        <svg
                          className="w-5 h-5 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 10l7-7m0 0l7 7m-7-7v18"
                          />
                        </svg>
                      </div>
                      <span className="text-white/90 font-bold tracking-wide uppercase text-xs">
                        Feature Spotlight
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-1">
                      Automated Entry
                    </h3>
                    <p className="text-white/80 text-base font-medium">
                      Seamless license plate recognition.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="border-y border-[var(--border)] bg-[var(--secondary)]/50 backdrop-blur-sm py-12">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { label: 'Active Zones', value: '50+' },
                { label: 'Daily Transactions', value: '5k' },
                { label: 'Happy Drivers', value: '10k+' },
                { label: 'Districts', value: '3' },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="space-y-2 hover:scale-110 transition-transform cursor-default"
                >
                  <div className="text-4xl font-bold text-[var(--primary)]">
                    {stat.value}
                  </div>
                  <div className="text-sm font-medium text-[var(--muted-foreground)] uppercase tracking-wider">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-[var(--foreground)] sm:text-4xl mb-4">
                Everything you need
              </h2>
              <p className="text-[var(--muted-foreground)] text-lg">
                Powerful features to streamline your parking operations.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: 'Real-time Analytics',
                  desc: 'Track revenue and occupancy as it happens.',
                  icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
                },
                {
                  title: 'Smart Notifications',
                  desc: 'Alerts for violations, payments, and capacity.',
                  icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9',
                },
                {
                  title: 'Secure Payments',
                  desc: 'End-to-end encrypted processing with MOMO & Airtel Money.',
                  icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
                },
              ].map((feature, i) => (
                <div
                  key={i}
                  className="group p-8 rounded-2xl bg-[var(--muted)]/30 border border-[var(--border)] hover:border-[var(--primary)]/50 hover:bg-white hover:shadow-xl hover:shadow-[var(--primary)]/5 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="h-12 w-12 rounded-xl bg-[var(--primary)]/10 flex items-center justify-center mb-6 group-hover:bg-[var(--primary)] group-hover:text-white transition-colors text-[var(--primary)]">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d={feature.icon}
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-[var(--foreground)]">
                    {feature.title}
                  </h3>
                  <p className="text-[var(--muted-foreground)] leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="w-full py-20 md:py-32 bg-[var(--muted)] border-t border-[var(--border)]">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid gap-10 sm:px-10 md:gap-16 md:grid-cols-2">
              {/* Operator Card */}
              <div className="group relative overflow-hidden rounded-3xl bg-white shadow-xl shadow-slate-200/50 border border-[var(--border)] transition-all hover:-translate-y-2 hover:shadow-2xl hover:shadow-[var(--primary)]/10 h-full flex flex-col">
                <div className="relative h-72 w-full overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop"
                    alt="Operator Dashboard"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500"></div>
                </div>
                <div className="p-8 pt-0 flex-1 flex flex-col relative">
                  <div className="-mt-10 mb-6 inline-flex items-center gap-2 rounded-full bg-[var(--primary)] px-4 py-2 text-sm font-bold text-white tracking-wide uppercase shadow-lg shadow-[var(--primary)]/30 w-fit z-10 group-hover:scale-105 transition-transform">
                    For Operators
                  </div>
                  <h2 className="text-3xl font-bold tracking-tight text-[var(--foreground)] mb-3">
                    Complete Control
                  </h2>
                  <p className="text-[var(--muted-foreground)] text-lg leading-relaxed mb-6 flex-1">
                    Monitor occupancy, manage rates, and view analytics in
                    real-time with our powerful dashboard.
                  </p>
                  <Link href="/admin" className="inline-block mt-auto">
                    <Button
                      variant="ghost"
                      className="text-base font-bold text-[var(--primary)] pl-0 hover:bg-transparent flex items-center gap-2 group-hover:gap-3 transition-all"
                    >
                      Go to Admin <span className="text-xl">→</span>
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Driver Card */}
              <div className="group relative overflow-hidden rounded-3xl bg-white shadow-xl shadow-slate-200/50 border border-[var(--border)] transition-all hover:-translate-y-2 hover:shadow-2xl hover:shadow-slate-800/10 h-full flex flex-col">
                <div className="relative h-72 w-full overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=1000&auto=format&fit=crop"
                    alt="Driver Experience"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500"></div>
                </div>
                <div className="p-8 pt-0 flex-1 flex flex-col relative">
                  <div className="-mt-10 mb-6 inline-flex items-center gap-2 rounded-full bg-slate-800 px-4 py-2 text-sm font-bold text-white tracking-wide uppercase shadow-lg shadow-slate-800/30 w-fit z-10 group-hover:scale-105 transition-transform">
                    For Drivers
                  </div>
                  <h2 className="text-3xl font-bold tracking-tight text-[var(--foreground)] mb-3">
                    Easy Payments
                  </h2>
                  <p className="text-[var(--muted-foreground)] text-lg leading-relaxed mb-6 flex-1">
                    Find spots, pay securely, and get notifications. The
                    smoothest parking experience for your users.
                  </p>
                  <Link href="/driver" className="inline-block mt-auto">
                    <Button
                      variant="ghost"
                      className="text-base font-bold text-slate-800 pl-0 hover:bg-transparent flex items-center gap-2 group-hover:gap-3 transition-all"
                    >
                      Open Driver App <span className="text-xl">→</span>
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-white border-t border-[var(--border)] py-12 md:py-16">
        <div className="container mx-auto px-6">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-[var(--primary)] flex items-center justify-center text-white font-bold">
                  V
                </div>
                <span className="text-xl font-bold text-[var(--foreground)]">
                  VoltPark
                </span>
              </div>
              <p className="text-[var(--muted-foreground)] text-sm leading-relaxed max-w-xs">
                Revolutionizing urban parking with smart technology and seamless
                experiences.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-[var(--foreground)] mb-4">
                Product
              </h3>
              <ul className="space-y-2 text-sm text-[var(--muted-foreground)]">
                <li>
                  <Link
                    href="#"
                    className="hover:text-[var(--primary)] transition-colors"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-[var(--primary)] transition-colors"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-[var(--primary)] transition-colors"
                  >
                    API
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-[var(--primary)] transition-colors"
                  >
                    Integration
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-[var(--foreground)] mb-4">
                Company
              </h3>
              <ul className="space-y-2 text-sm text-[var(--muted-foreground)]">
                <li>
                  <Link
                    href="#"
                    className="hover:text-[var(--primary)] transition-colors"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-[var(--primary)] transition-colors"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-[var(--primary)] transition-colors"
                  >
                    Careers
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-[var(--primary)] transition-colors"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-[var(--foreground)] mb-4">
                Legal
              </h3>
              <ul className="space-y-2 text-sm text-[var(--muted-foreground)]">
                <li>
                  <Link
                    href="#"
                    className="hover:text-[var(--primary)] transition-colors"
                  >
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-[var(--primary)] transition-colors"
                  >
                    Terms
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-[var(--primary)] transition-colors"
                  >
                    Security
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-[var(--border)] flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-[var(--muted-foreground)]">
            <p>© 2024 VoltPark Rwanda Ltd. All rights reserved.</p>
            <div className="flex gap-6">
              <Link
                href="#"
                className="hover:text-[var(--foreground)] transition-colors"
              >
                Twitter
              </Link>
              <Link
                href="#"
                className="hover:text-[var(--foreground)] transition-colors"
              >
                GitHub
              </Link>
              <Link
                href="#"
                className="hover:text-[var(--foreground)] transition-colors"
              >
                LinkedIn
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
