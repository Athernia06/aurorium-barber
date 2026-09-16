import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  Scissors,
  MapPin,
  Clock,
  Star,
  LogIn,
  LogOut,
  Ticket,
  Navigation,
  Phone,
  Sparkles,
  ChevronRight,
  Award,
  History,
  Timer,
  Users,
  CheckCircle2,
  Zap,
  BadgeCheck,
  Store,
  Crown,
  LocateFixed,
  User,
  Bell,
  Wallet,
  CalendarDays,
  Coffee,
  Camera,
  ThumbsUp,
  MessageCircle,
  X,
  ArrowRight,
  SlidersHorizontal,
} from 'lucide-react'

const VIEWS = ['home', 'branches', 'services', 'queue']

const NAV_ITEMS = [
  { id: 'home', label: 'Home' },
  { id: 'branches', label: 'Branches' },
  { id: 'services', label: 'Services' },
  { id: 'queue', label: 'Live Queue' },
]

const MOCK_USER = {
  name: 'Muhammad Rafi',
  email: 'rafi@example.com',
  tier: 'Gold Member',
  avatarInitials: 'MR',
}

const BRANCHES = [
  {
    id: 'jkt-selatan',
    code: 'A',
    name: 'Jakarta South',
    area: 'Kemang, South Jakarta',
    address: 'Jl. Kemang Raya No. 21, Jakarta Selatan',
    distance: 1.2,
    x: 38,
    y: 30,
    baseServing: 5,
    liveWaiters: 6,
    rating: 4.9,
    reviews: 412,
    openUntil: '22:00',
    barbers: 8,
    phone: '+62 21 7280 1121',
  },
  {
    id: 'depok-central',
    code: 'B',
    name: 'Depok Central',
    area: 'Beji, Depok',
    address: 'Jl. Margonda Raya No. 88, Depok',
    distance: 3.5,
    x: 62,
    y: 68,
    baseServing: 3,
    liveWaiters: 4,
    rating: 4.8,
    reviews: 338,
    openUntil: '21:30',
    barbers: 6,
    phone: '+62 21 7500 4488',
  },
  {
    id: 'bsd-serpong',
    code: 'C',
    name: 'BSD Serpong',
    area: 'Gading Serpong, Tangerang',
    address: 'Ruko Golden Boulevard No. 4, Tangerang',
    distance: 8.7,
    x: 18,
    y: 55,
    baseServing: 8,
    liveWaiters: 9,
    rating: 4.9,
    reviews: 501,
    openUntil: '22:00',
    barbers: 10,
    phone: '+62 21 5315 9902',
  },
  {
    id: 'bekasi-gateway',
    code: 'D',
    name: 'Bekasi Gateway',
    area: 'Grand Galaxy, Bekasi',
    address: 'Jl. Boulevard Raya No. 12, Bekasi',
    distance: 14.3,
    x: 80,
    y: 42,
    baseServing: 2,
    liveWaiters: 2,
    rating: 4.7,
    reviews: 264,
    openUntil: '21:00',
    barbers: 5,
    phone: '+62 21 8998 6610',
  },
]

const SERVICES = [
  {
    id: 'gentleman-cut',
    category: 'Haircut',
    name: 'Gentleman Cut',
    price: 85000,
    duration: 30,
    tag: 'Best Seller',
    icon: Scissors,
    description: 'Signature precision scissor cut with hot towel finish and styling consultation.',
  },
  {
    id: 'skin-fade',
    category: 'Haircut',
    name: 'Skin Fade',
    price: 95000,
    duration: 40,
    tag: 'Popular',
    icon: Zap,
    description: 'Razor-sharp gradient fade blended seamlessly into your preferred length.',
  },
  {
    id: 'beard-grooming',
    category: 'Beard',
    name: 'Beard Grooming',
    price: 60000,
    duration: 25,
    tag: 'Classic',
    icon: Sparkles,
    description: 'Full beard sculpting, straight razor detailing, and beard oil treatment.',
  },
  {
    id: 'shave-ritual',
    category: 'Beard',
    name: 'Royal Shave Ritual',
    price: 110000,
    duration: 35,
    tag: 'Relaxing',
    icon: Coffee,
    description: 'Traditional hot lather shave with steam, cold towel, and balm finish.',
  },
  {
    id: 'hair-coloring',
    category: 'Grooming Treatments',
    name: 'Hair Coloring',
    price: 250000,
    duration: 75,
    tag: 'Premium',
    icon: Crown,
    description: 'Ammonia-free color application with gloss sealing by certified colorists.',
  },
  {
    id: 'hair-spa',
    category: 'Grooming Treatments',
    name: 'Hair & Scalp Spa',
    price: 150000,
    duration: 45,
    tag: 'New',
    icon: BadgeCheck,
    description: 'Deep-cleansing scalp massage, nutrient mask, and energizing tonic rinse.',
  },
]

const SERVICE_CATEGORIES = ['All', 'Haircut', 'Beard', 'Grooming Treatments']

const DISTANCE_FILTERS = [
  { label: 'All outlets', value: null },
  { label: '≤ 5 km', value: 5 },
  { label: '≤ 10 km', value: 10 },
]

const INITIAL_HISTORY = [
  { id: 'h1', service: 'Gentleman Cut', branch: 'Jakarta South', date: '24 Aug 2026', price: 85000, points: 85 },
  { id: 'h2', service: 'Beard Grooming', branch: 'Depok Central', date: '09 Aug 2026', price: 60000, points: 60 },
  { id: 'h3', service: 'Skin Fade', branch: 'BSD Serpong', date: '27 Jul 2026', price: 95000, points: 95 },
]

const TICKET_STEP_MS = 3000

const cx = (...parts) => parts.filter(Boolean).join(' ')

const formatIDR = (value) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value)

const padNumber = (n) => String(n).padStart(2, '0')

function SectionHeading({ kicker, title, description, align = 'left' }) {
  const centered = align === 'center'
  return (
    <div className={cx('max-w-2xl', centered && 'mx-auto text-center')}>
      <span
        className={cx(
          'inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-gradient-to-r from-amber-400/10 to-ember/10 px-3.5 py-1.5 text-[11px] font-bold tracking-[0.18em] text-amber-400 uppercase shadow-[0_0_20px_rgba(255,107,0,0.12)]',
          centered && 'mx-auto',
        )}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-amber-400 to-ember shadow-[0_0_6px_rgba(255,107,0,0.8)]" />
        {kicker}
      </span>
      <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">{title}</h2>
      {description && <p className="mt-3 text-sm leading-relaxed text-slate-400">{description}</p>}
    </div>
  )
}

function StarRating({ rating, reviews }) {
  return (
    <span className="flex items-center gap-1 text-amber-400">
      <Star className="h-3.5 w-3.5 fill-amber-400" />
      <span className="text-xs font-bold">{rating.toFixed(1)}</span>
      <span className="text-xs text-slate-500">({reviews})</span>
    </span>
  )
}

function GlowBadge({ children }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-gradient-to-r from-amber-400/10 to-ember/10 px-3.5 py-1.5 text-[11px] font-bold tracking-[0.18em] text-amber-400 uppercase shadow-[0_0_20px_rgba(255,107,0,0.12)]">
      {children}
    </span>
  )
}

function LoaderIcon() {
  return (
    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  )
}

function Navbar({ view, onNavigate, user, onOpenAuth, onOpenMember, onLogout }) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-ink/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <button onClick={() => onNavigate('home')} className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-ember text-slate-950 shadow-lg shadow-ember/30">
            <Scissors className="h-4.5 w-4.5" strokeWidth={2.5} />
          </span>
          <span className="text-lg font-extrabold tracking-tight text-white">
            Aurorium<span className="text-amber-400">.</span>
          </span>
        </button>

        <nav className="hidden items-center gap-1 rounded-2xl border border-slate-800/80 bg-coal/80 p-1 md:flex">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={cx(
                'rounded-xl px-4 py-2 text-sm font-semibold transition-all',
                view === item.id
                  ? 'bg-gradient-to-r from-amber-400 to-ember text-slate-950 shadow-md shadow-ember/25'
                  : 'text-slate-400 hover:text-amber-300',
              )}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2.5">
          {user ? (
            <>
              <button
                onClick={onOpenMember}
                title="Open member profile"
                className="flex items-center gap-2.5 rounded-2xl border border-slate-800/80 bg-coal/80 py-1.5 pr-4 pl-1.5 transition-colors hover:border-amber-400/40"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-ember text-xs font-extrabold text-slate-950">
                  {user.avatarInitials}
                </span>
                <span className="hidden text-left leading-tight sm:block">
                  <span className="block text-xs font-bold text-white">{user.name.split(' ')[0]}</span>
                  <span className="block text-[10px] font-bold tracking-widest text-amber-400 uppercase">
                    {user.tier}
                  </span>
                </span>
              </button>
              <button
                onClick={onLogout}
                aria-label="Log out"
                title="Logout"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-800/80 bg-coal/80 text-slate-400 transition-colors hover:border-red-500/40 hover:text-red-400"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-ember px-4 py-2.5 text-sm font-bold text-slate-950 shadow-lg shadow-ember/25 transition-transform hover:scale-[1.03] active:scale-95"
            >
              <LogIn className="h-4 w-4" />
              <span className="hidden sm:inline">Member Login</span>
            </button>
          )}
        </div>
      </div>

      <nav className="flex items-center gap-1 overflow-x-auto border-t border-slate-800/60 px-3 py-2 md:hidden">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={cx(
              'flex-1 rounded-xl px-3 py-2 text-xs font-semibold whitespace-nowrap transition-colors',
              view === item.id
                ? 'bg-gradient-to-r from-amber-400 to-ember text-slate-950'
                : 'text-slate-400 hover:text-amber-300',
            )}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </header>
  )
}

function HeroView({ onNavigate, onDetect, detecting, nearestBranch, selectedBranch, serving, ticket, isLoggedIn }) {
  const stats = [
    { icon: Store, value: '4+', label: 'Franchise Outlets' },
    { icon: Users, value: '25k+', label: 'Happy Members' },
    { icon: Award, value: '4.9', label: 'Average Rating' },
    { icon: Timer, value: '~3 min', label: 'Avg. Booking Time' },
  ]

  const highlights = [
    { icon: Zap, text: 'Real-time queue tracking' },
    { icon: MapPin, text: 'GPS branch detection' },
    { icon: Wallet, text: 'Points on every visit' },
  ]

  return (
    <section className="relative mx-auto max-w-6xl px-4 pt-14 pb-16 sm:px-6 lg:pt-20 lg:pb-24">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div>
          <GlowBadge>
            <Sparkles className="h-3.5 w-3.5" />
            Premium Barber Franchise
          </GlowBadge>
          <h1 className="mt-5 text-4xl leading-[1.1] font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Grooming Fit for Kings —{' '}
            <span className="bg-gradient-to-r from-amber-400 to-ember bg-clip-text text-transparent">
              Without the Wait.
            </span>
          </h1>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-slate-400">
            Reserve your chair across our franchise network, track the barber&apos;s queue live from your sofa,
            and stack loyalty points on every cut. No crowd, no clipboard, no guesswork.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('queue')}
              className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-400 to-ember px-6 py-3.5 text-sm font-bold text-slate-950 shadow-lg shadow-ember/30 transition-transform hover:scale-[1.03] active:scale-95"
            >
              <Ticket className="h-4 w-4" />
              Quick Ticket Booking
            </button>
            <button
              onClick={onDetect}
              disabled={detecting}
              className="flex items-center gap-2 rounded-2xl border border-slate-800 bg-coal px-6 py-3.5 text-sm font-semibold text-slate-200 transition-colors hover:border-amber-400/40 hover:text-amber-300 disabled:opacity-60"
            >
              {detecting ? <LoaderIcon /> : <LocateFixed className={cx('h-4 w-4', nearestBranch && 'text-emerald-400')} />}
              {detecting ? 'Locating…' : 'Detect Nearest Barber'}
            </button>
          </div>

          {nearestBranch && (
            <div className="mt-5 flex items-center gap-2.5 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
              <CheckCircle2 className="h-4.5 w-4.5 shrink-0" />
              <span>
                Nearest outlet: <strong className="font-bold">{nearestBranch.name}</strong> — {nearestBranch.distance} km
                away, pre-selected for you.
              </span>
            </div>
          )}

          <div className="mt-8 flex flex-wrap gap-2.5">
            {highlights.map((h) => (
              <span
                key={h.text}
                className="flex items-center gap-2 rounded-full border border-slate-800/80 bg-coal/70 px-3.5 py-2 text-xs font-semibold text-slate-300"
              >
                <h.icon className="h-3.5 w-3.5 text-amber-400" />
                {h.text}
              </span>
            ))}
          </div>

          <div className="mt-10 grid grid-cols-2 gap-5 border-t border-slate-800/60 pt-6 sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="leading-tight">
                <s.icon className="h-4.5 w-4.5 text-amber-400" />
                <p className="mt-2 text-xl font-extrabold text-white">{s.value}</p>
                <p className="mt-0.5 text-[11px] text-slate-500">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative hidden lg:block">
          <div className="absolute -inset-6 rounded-[2.5rem] bg-gradient-to-br from-amber-400/15 via-transparent to-ember/15 blur-2xl" />
          <div className="relative overflow-hidden rounded-[2rem] border border-slate-800/80 bg-gradient-to-b from-slate-900 to-coal p-6 shadow-2xl shadow-black/50">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold tracking-widest text-slate-500 uppercase">Live Board</span>
              <span className="flex items-center gap-2 text-[11px] font-bold tracking-widest text-emerald-400 uppercase">
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                Online
              </span>
            </div>
            <p className="mt-3 font-mono text-6xl font-extrabold tracking-tight text-amber-400 tabular-nums">
              {selectedBranch.code}-{padNumber(serving)}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {selectedBranch.name} · {selectedBranch.barbers} barbers on duty
            </p>

            <div className="mt-6 space-y-2.5">
              {ticket ? (
                <div className="flex items-center justify-between rounded-2xl border border-amber-400/40 bg-amber-400/10 px-4 py-3">
                  <span className="font-mono text-sm font-extrabold text-amber-400">{ticket.id}</span>
                  <span className="text-xs text-slate-400">{ticket.serviceName}</span>
                  <span className="rounded-full bg-amber-400/20 px-2.5 py-1 text-[10px] font-bold tracking-widest text-amber-300 uppercase">
                    You
                  </span>
                </div>
              ) : (
                [1, 2, 3].map((n) => (
                  <div
                    key={n}
                    className="flex items-center justify-between rounded-2xl border border-slate-800/60 bg-ink/60 px-4 py-3"
                  >
                    <span className="font-mono text-sm font-bold text-slate-400">
                      {selectedBranch.code}-{padNumber(serving + n)}
                    </span>
                    <span className="text-xs text-slate-600">in queue</span>
                  </div>
                ))
              )}
            </div>

            <button
              onClick={() => onNavigate('queue')}
              className={cx(
                'mt-6 flex w-full items-center justify-center gap-2 rounded-2xl border py-3 text-sm font-bold transition-colors',
                isLoggedIn
                  ? 'border-amber-400/40 bg-amber-400/10 text-amber-300 hover:bg-amber-400/20'
                  : 'border-slate-800 bg-ink/60 text-slate-300 hover:border-amber-400/30 hover:text-amber-300',
              )}
            >
              Open Live Tracker
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

function MapPlaceholder({ branches, selectedId, nearestId, onSelect }) {
  return (
    <div className="relative h-72 overflow-hidden rounded-3xl border border-slate-800/80 bg-gradient-to-b from-ink to-coal lg:h-full lg:min-h-[26rem]">
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)',
          backgroundSize: '36px 36px',
        }}
      />
      <div className="absolute top-6 left-8 h-40 w-52 rotate-6 rounded-2xl bg-slate-800/40" />
      <div className="absolute right-10 bottom-8 h-32 w-44 -rotate-3 rounded-2xl bg-slate-800/40" />
      <div className="absolute top-1/2 left-1/3 h-24 w-32 rounded-xl bg-slate-800/60" />

      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path
          d="M0,45 C25,40 35,55 55,48 S85,30 100,38"
          fill="none"
          stroke="rgba(255,107,0,0.3)"
          strokeWidth="0.7"
          strokeDasharray="3 2"
        />
        <path d="M20,0 C28,25 45,35 60,55 S75,85 82,100" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="0.6" />
      </svg>

      {branches.map((b) => {
        const isNearest = b.id === nearestId
        const isSelected = b.id === selectedId
        return (
          <button
            key={b.id}
            title={`${b.name} — ${b.distance} km`}
            onClick={() => onSelect(b.id)}
            className={cx('group absolute -translate-x-1/2 -translate-y-full', isSelected ? 'z-20' : 'z-10')}
            style={{ left: `${b.x}%`, top: `${b.y}%` }}
          >
            <span className="relative flex flex-col items-center">
              {isNearest && (
                <span className="absolute -top-1 h-10 w-10 animate-pulse rounded-full bg-amber-400/25" />
              )}
              <span
                className={cx(
                  'relative flex h-8 w-8 items-center justify-center rounded-full border-2 shadow-lg transition-transform group-hover:scale-110',
                  isNearest || isSelected
                    ? 'border-amber-300 bg-amber-400 text-slate-950 shadow-ember/40'
                    : 'border-slate-600 bg-coal text-amber-400',
                )}
              >
                <MapPin className="h-4 w-4" />
              </span>
              <span
                className={cx(
                  'mt-1.5 rounded-full border px-2 py-0.5 text-[10px] font-bold whitespace-nowrap',
                  isNearest || isSelected
                    ? 'border-amber-400/40 bg-ink/90 text-amber-300'
                    : 'border-slate-700/60 bg-ink/80 text-slate-400',
                )}
              >
                {b.name} · {b.distance} km
              </span>
            </span>
          </button>
        )
      })}

      <span className="absolute right-3 bottom-3 flex items-center gap-1.5 rounded-lg border border-slate-800/80 bg-ink/85 px-2.5 py-1.5 text-[10px] font-semibold text-slate-400">
        <Navigation className="h-3 w-3 text-amber-400" />
        Simulated live map — Greater Jakarta
      </span>
    </div>
  )
}

function BranchCard({ branch, selected, nearest, onSelect, onQueue }) {
  return (
    <div
      onClick={() => onSelect(branch.id)}
      className={cx(
        'group cursor-pointer rounded-3xl border p-5 transition-all duration-300',
        selected
          ? 'border-amber-400/60 bg-slate-900 shadow-xl shadow-ember/10'
          : 'border-slate-800/80 bg-slate-900/50 hover:-translate-y-0.5 hover:border-amber-400/30 hover:bg-slate-900/80 hover:shadow-lg hover:shadow-black/30',
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span
            className={cx(
              'flex h-10 w-10 items-center justify-center rounded-xl font-mono text-sm font-extrabold',
              selected ? 'bg-gradient-to-br from-amber-400 to-ember text-slate-950' : 'bg-coal text-amber-400',
            )}
          >
            {branch.code}
          </span>
          <div className="leading-tight">
            <p className="flex items-center gap-2 font-bold text-white">
              {branch.name}
              {nearest && (
                <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[9px] font-bold tracking-widest text-emerald-400 uppercase">
                  Nearest
                </span>
              )}
            </p>
            <p className="mt-0.5 text-xs text-slate-500">{branch.area}</p>
          </div>
        </div>
        <StarRating rating={branch.rating} reviews={branch.reviews} />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2.5 text-xs">
        <span className="flex items-center gap-2 text-slate-400">
          <Navigation className="h-3.5 w-3.5 text-amber-400" />
          <strong className="font-bold text-amber-300">{branch.distance} km</strong> away
        </span>
        <span className="flex items-center gap-2 text-slate-400">
          <Clock className="h-3.5 w-3.5 text-amber-400" />
          Open until {branch.openUntil}
        </span>
        <span className="flex items-center gap-2 text-slate-400">
          <Users className="h-3.5 w-3.5 text-amber-400" />
          {branch.barbers} barbers
        </span>
        <span className="flex items-center gap-2 text-slate-400">
          <Timer className="h-3.5 w-3.5 text-amber-400" />
          ~{branch.liveWaiters * 3} min wait
        </span>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-slate-800/60 pt-3.5">
        <span className="flex items-center gap-1.5 text-[11px] text-slate-500">
          <Phone className="h-3 w-3" />
          {branch.phone}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onSelect(branch.id)
            onQueue(branch.id)
          }}
          className={cx(
            'flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-colors',
            selected
              ? 'bg-gradient-to-r from-amber-400 to-ember text-slate-950'
              : 'border border-slate-700/80 bg-coal text-amber-400 hover:border-amber-400/40',
          )}
        >
          Queue here
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  )
}

function BranchesView({ selectedId, nearestId, onSelect, onQueue, onDetect, detecting }) {
  const [radius, setRadius] = useState(null)
  const [nearestFirst, setNearestFirst] = useState(false)

  const visible = useMemo(() => {
    const filtered = BRANCHES.filter((b) => radius === null || b.distance <= radius)
    return nearestFirst ? [...filtered].sort((a, b) => a.distance - b.distance) : filtered
  }, [radius, nearestFirst])

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <SectionHeading
        kicker="Our Network"
        title="Branches & Locations"
        description="Four flagship outlets across Greater Jakarta. Detect your location to auto-select the closest chair, or filter by travel distance."
      />

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <button
          onClick={onDetect}
          disabled={detecting}
          className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-400 to-ember px-5 py-2.5 text-sm font-bold text-slate-950 shadow-lg shadow-ember/25 transition-transform hover:scale-[1.03] active:scale-95 disabled:opacity-60"
        >
          {detecting ? <LoaderIcon /> : <LocateFixed className="h-4 w-4" />}
          {detecting ? 'Locating…' : 'Detect Nearest Outlet'}
        </button>

        <div className="flex items-center gap-1 rounded-2xl border border-slate-800/80 bg-coal/80 p-1">
          <SlidersHorizontal className="mx-2 h-3.5 w-3.5 text-slate-500" />
          {DISTANCE_FILTERS.map((f) => (
            <button
              key={f.label}
              onClick={() => setRadius(f.value)}
              className={cx(
                'rounded-xl px-3.5 py-2 text-xs font-bold transition-colors',
                radius === f.value
                  ? 'bg-amber-400/15 text-amber-300'
                  : 'text-slate-500 hover:text-slate-300',
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        <button
          onClick={() => setNearestFirst((v) => !v)}
          className={cx(
            'flex items-center gap-2 rounded-2xl border px-4 py-2.5 text-xs font-bold transition-colors',
            nearestFirst
              ? 'border-amber-400/40 bg-amber-400/10 text-amber-300'
              : 'border-slate-800/80 bg-coal/80 text-slate-400 hover:text-slate-200',
          )}
        >
          <ArrowRight className="h-3.5 w-3.5" />
          Nearest first {nearestFirst ? '· on' : ''}
        </button>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <MapPlaceholder branches={visible} selectedId={selectedId} nearestId={nearestId} onSelect={onSelect} />
          <p className="mt-3 text-xs text-slate-600">
            {visible.length} of {BRANCHES.length} outlets shown · tap a pin or card to select
          </p>
        </div>
        <div className={cx('grid content-start gap-4 sm:grid-cols-2 lg:col-span-2 lg:grid-cols-1')}>
          {visible.map((b) => (
            <BranchCard
              key={b.id}
              branch={b}
              selected={selectedId === b.id}
              nearest={nearestId === b.id}
              onSelect={onSelect}
              onQueue={onQueue}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function ServiceCard({ service, selected, onSelect, onReserve }) {
  const Icon = service.icon
  return (
    <div
      onClick={() => onSelect(service.id)}
      className={cx(
        'group flex cursor-pointer flex-col rounded-3xl border p-6 transition-all duration-300',
        selected
          ? 'border-amber-400/60 bg-gradient-to-b from-amber-400/10 to-slate-900 shadow-xl shadow-ember/10'
          : 'border-slate-800/80 bg-slate-900/50 hover:-translate-y-0.5 hover:border-amber-400/30 hover:bg-slate-900/80 hover:shadow-lg hover:shadow-black/30',
      )}
    >
      <div className="flex items-start justify-between">
        <span
          className={cx(
            'flex h-11 w-11 items-center justify-center rounded-2xl transition-colors',
            selected
              ? 'bg-gradient-to-br from-amber-400 to-ember text-slate-950'
              : 'bg-coal text-amber-400 group-hover:bg-amber-400/15',
          )}
        >
          <Icon className="h-5 w-5" />
        </span>
        <GlowBadge>{service.tag}</GlowBadge>
      </div>
      <p className="mt-2 text-[10px] font-bold tracking-widest text-slate-500 uppercase">{service.category}</p>
      <h3 className="mt-1 text-lg font-bold text-white">{service.name}</h3>
      <p className="mt-2 flex-1 text-xs leading-relaxed text-slate-500">{service.description}</p>
      <div className="mt-5 flex items-center justify-between border-t border-slate-800/60 pt-4">
        <div className="leading-tight">
          <p className="text-sm font-extrabold text-amber-400">{formatIDR(service.price)}</p>
          <p className="mt-0.5 flex items-center gap-1 text-[11px] text-slate-500">
            <Clock className="h-3 w-3" />
            {service.duration} min · +{Math.round(service.price / 1000)} pts
          </p>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onSelect(service.id)
            onReserve()
          }}
          className={cx(
            'flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition-colors',
            selected
              ? 'bg-gradient-to-r from-amber-400 to-ember text-slate-950'
              : 'border border-slate-700/80 bg-coal text-amber-400 hover:border-amber-400/40',
          )}
        >
          Reserve
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  )
}

function ServicesView({ selectedId, onSelect, onReserve }) {
  const [category, setCategory] = useState('All')
  const visible = category === 'All' ? SERVICES : SERVICES.filter((s) => s.category === category)

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <SectionHeading
        kicker="Service Menu"
        title="The Treatment Menu"
        description="Transparent pricing, master-barber craftsmanship. Every service earns Aurora Points automatically."
        align="center"
      />

      <div className="mx-auto mt-8 flex w-fit max-w-full flex-wrap items-center justify-center gap-1 rounded-2xl border border-slate-800/80 bg-coal/80 p-1">
        {SERVICE_CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={cx(
              'rounded-xl px-4 py-2 text-xs font-bold whitespace-nowrap transition-all',
              category === c
                ? 'bg-gradient-to-r from-amber-400 to-ember text-slate-950 shadow-md shadow-ember/25'
                : 'text-slate-400 hover:text-amber-300',
            )}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((s) => (
          <ServiceCard key={s.id} service={s} selected={selectedId === s.id} onSelect={onSelect} onReserve={onReserve} />
        ))}
      </div>
    </section>
  )
}

function StatTile({ icon: Icon, value, sub }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-800/80 bg-ink/60 px-4 py-3">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-coal text-amber-400">
        <Icon className="h-4 w-4" />
      </span>
      <div className="leading-tight">
        <p className="text-sm font-extrabold text-white tabular-nums">{value}</p>
        <p className="text-[11px] text-slate-500">{sub}</p>
      </div>
    </div>
  )
}

function QueueView({
  user,
  selectedBranch,
  selectedService,
  serving,
  ticket,
  ticketServing,
  confirmed,
  onSelectBranch,
  onTakeTicket,
  onCancel,
  onNavigateServices,
}) {
  const isTurn = ticket ? ticketServing >= ticket.number : false
  const position = ticket ? Math.max(0, ticket.number - ticketServing) : 0
  const upcoming = [1, 2, 3].map((n) => serving + n)

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <SectionHeading
        kicker="Live Tracker"
        title="Real-Time Online Queue"
        description="Reserve your spot from anywhere. The serving counter ticks forward live — watch the board move while you enjoy your coffee at home."
        align="center"
      />

      <div className="mt-10 grid gap-6 lg:grid-cols-5">
        <div className="space-y-5 lg:col-span-2">
          <div className="rounded-3xl border border-slate-800/80 bg-slate-900/60 p-6">
            <h3 className="flex items-center gap-2 text-xs font-bold tracking-widest text-slate-400 uppercase">
              <Store className="h-4 w-4 text-amber-400" />
              Step 1 · Choose Branch
            </h3>
            <div className="mt-4 grid gap-2.5">
              {BRANCHES.map((b) => (
                <button
                  key={b.id}
                  onClick={() => onSelectBranch(b.id)}
                  className={cx(
                    'flex items-center justify-between rounded-2xl border px-4 py-3 text-sm transition-all',
                    selectedBranch.id === b.id
                      ? 'border-amber-400/50 bg-amber-400/10 text-white shadow-md shadow-ember/10'
                      : 'border-slate-800/60 bg-ink/50 text-slate-400 hover:border-amber-400/25 hover:text-slate-200',
                  )}
                >
                  <span className="flex items-center gap-2.5">
                    <span className="font-mono font-extrabold text-amber-400">{b.code}</span>
                    {b.name}
                  </span>
                  <span className="flex items-center gap-2 text-[11px] text-slate-600">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                    {b.liveWaiters} waiting · {b.distance} km
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800/80 bg-slate-900/60 p-6">
            <h3 className="flex items-center gap-2 text-xs font-bold tracking-widest text-slate-400 uppercase">
              <Scissors className="h-4 w-4 text-amber-400" />
              Step 2 · Your Service
            </h3>
            <div className="mt-4 flex items-center justify-between rounded-2xl border border-amber-400/30 bg-amber-400/10 px-4 py-3.5">
              <div className="leading-tight">
                <p className="text-sm font-bold text-white">{selectedService.name}</p>
                <p className="mt-0.5 text-[11px] text-slate-400">
                  {formatIDR(selectedService.price)} · {selectedService.duration} min
                </p>
              </div>
              <button
                onClick={onNavigateServices}
                className="flex items-center gap-1.5 rounded-xl border border-slate-700/80 bg-ink/60 px-3 py-1.5 text-xs font-bold text-amber-400 transition-colors hover:border-amber-400/40"
              >
                Change
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          <button
            onClick={onTakeTicket}
            disabled={Boolean(ticket)}
            className="w-full rounded-2xl bg-gradient-to-r from-amber-400 to-ember py-4 text-sm font-bold text-slate-950 shadow-lg shadow-ember/30 transition-all hover:scale-[1.02] active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none disabled:hover:scale-100"
          >
            {ticket
              ? `Ticket ${ticket.id} Active`
              : user
                ? 'Take Queue Ticket'
                : 'Login to Take a Ticket'}
          </button>
          {ticket && (
            <button
              onClick={onCancel}
              className="w-full rounded-2xl border border-slate-800/80 bg-coal/80 py-3 text-xs font-bold text-slate-400 transition-colors hover:border-red-500/40 hover:text-red-400"
            >
              Cancel My Ticket
            </button>
          )}
        </div>

        <div className="lg:col-span-3">
          <div className="flex h-full flex-col overflow-hidden rounded-3xl border border-slate-800/80 bg-gradient-to-b from-slate-900 to-ink">
            <div className="flex items-center justify-between border-b border-slate-800/80 bg-coal/70 px-6 py-4">
              <span className="flex items-center gap-2.5">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
                </span>
                <span className="text-[11px] font-bold tracking-widest text-emerald-400 uppercase">Live Board</span>
              </span>
              <span className="text-xs text-slate-500">
                {selectedBranch.name} · {selectedBranch.code}-series · {selectedBranch.barbers} barbers
              </span>
            </div>

            <div className="flex flex-1 flex-col p-6">
              <div className="rounded-3xl border border-amber-400/20 bg-gradient-to-b from-amber-400/10 to-transparent p-6 text-center">
                <p className="text-[11px] font-bold tracking-widest text-slate-400 uppercase">Currently Serving</p>
                <p className="mt-2 font-mono text-7xl font-extrabold tracking-tight text-amber-400 tabular-nums">
                  {selectedBranch.code}-{padNumber(serving)}
                </p>
                <p className="mt-2 text-xs text-slate-500">
                  {serving % 3 === 0 ? 'Chair 2 · Andi' : serving % 3 === 1 ? 'Chair 3 · Fajar' : 'Chair 1 · Bagas'} ·
                  updates every {TICKET_STEP_MS / 1000}s
                </p>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <StatTile icon={Users} value={`${selectedBranch.liveWaiters} people`} sub="waiting in queue" />
                <StatTile icon={Timer} value={`~${selectedBranch.liveWaiters * 3} min`} sub="estimated wait" />
              </div>

              <div className="mt-4 grid gap-2">
                {upcoming.map((n) => {
                  const isYou = ticket && ticket.branchId === selectedBranch.id && ticket.number === n
                  return (
                    <div
                      key={n}
                      className={cx(
                        'flex items-center justify-between rounded-2xl border px-4 py-3',
                        isYou ? 'border-amber-400/40 bg-amber-400/10' : 'border-slate-800/60 bg-ink/50',
                      )}
                    >
                      <span
                        className={cx(
                          'font-mono text-sm font-extrabold',
                          isYou ? 'text-amber-400' : 'text-slate-400',
                        )}
                      >
                        {selectedBranch.code}-{padNumber(n)}
                      </span>
                      {isYou && (
                        <span className="rounded-full bg-amber-400/20 px-2.5 py-1 text-[10px] font-bold tracking-widest text-amber-300 uppercase">
                          You
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>

              <div className="mt-auto pt-5">
                {ticket && ticket.branchId === selectedBranch.id ? (
                  <div
                    className={cx(
                      'rounded-3xl border p-5 transition-colors',
                      isTurn ? 'border-emerald-400/40 bg-emerald-400/10' : 'border-amber-400/40 bg-amber-400/10',
                    )}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2.5">
                          <p
                            className={cx(
                              'text-[10px] font-bold tracking-widest uppercase',
                              isTurn ? 'text-emerald-300' : 'text-slate-400',
                            )}
                          >
                            {isTurn ? 'You are being served' : 'Your Ticket'}
                          </p>
                          {confirmed && !isTurn && (
                            <span className="view-in flex items-center gap-1 rounded-full bg-emerald-400/20 px-2.5 py-1 text-[9px] font-extrabold tracking-widest text-emerald-300 uppercase animate-pulse">
                              <CheckCircle2 className="h-3 w-3" />
                              Confirmed
                            </span>
                          )}
                        </div>
                        <p
                          className={cx(
                            'mt-1 font-mono text-4xl font-extrabold',
                            isTurn ? 'text-emerald-400' : 'text-white',
                          )}
                        >
                          {ticket.id}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {ticket.serviceName} · {formatIDR(ticket.price)}
                        </p>
                      </div>
                      <span
                        className={cx(
                          'rounded-full px-3 py-1.5 text-[10px] font-bold tracking-widest uppercase',
                          isTurn ? 'bg-emerald-400/20 text-emerald-300' : 'bg-amber-400/20 text-amber-300',
                        )}
                      >
                        {isTurn ? 'Chair ready' : `~${position * 3} min · ${position} ahead`}
                      </span>
                    </div>
                    <div className="mt-4 flex items-center gap-3">
                      <button
                        onClick={onCancel}
                        className="rounded-xl border border-slate-700/80 px-4 py-2 text-xs font-bold text-slate-400 transition-colors hover:border-red-500/40 hover:text-red-400"
                      >
                        Cancel Ticket
                      </button>
                      <span className="flex items-center gap-1.5 text-[11px] text-slate-600">
                        <Bell className="h-3 w-3" />
                        We will ping when it is your turn
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-4 rounded-3xl border border-dashed border-slate-800 p-5 text-center">
                    <Ticket className="h-7 w-7 shrink-0 text-slate-700" />
                    <p className="text-sm text-slate-500">
                      {ticket
                        ? `Your ticket ${ticket.id} belongs to ${BRANCHES.find((b) => b.id === ticket.branchId)?.name ?? 'another branch'}. Switch branches to view it.`
                        : user
                          ? 'Ready when you are — grab a ticket to jump the line.'
                          : 'Login as a member to take a ticket and skip the walk-in line.'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function useEscapeKey(onEscape) {
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') onEscape()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onEscape])
}

function MemberModal({ user, points, ticket, ticketServing, history, onClose, onCancelTicket, onLogout }) {
  useEscapeKey(onClose)
  const isTurn = ticket ? ticketServing >= ticket.number : false
  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Member profile"
        onClick={(e) => e.stopPropagation()}
        className="view-in mx-auto my-8 max-w-2xl overflow-hidden rounded-3xl border border-slate-800 bg-coal shadow-2xl shadow-black/60"
      >
        <div className="relative overflow-hidden bg-gradient-to-r from-amber-400/15 to-ember/10 px-7 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-ember text-lg font-extrabold text-slate-950 shadow-lg shadow-ember/30">
                {user.avatarInitials}
              </span>
              <div>
                <h3 className="text-xl font-extrabold text-white">{user.name}</h3>
                <p className="text-xs text-slate-400">{user.email}</p>
                <span className="mt-1.5 inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-2.5 py-1 text-[10px] font-bold tracking-widest text-amber-300 uppercase">
                  <Crown className="h-3 w-3" />
                  {user.tier}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-700/60 bg-ink/60 text-slate-400 transition-colors hover:border-amber-400/40 hover:text-amber-300"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="grid gap-4 px-7 py-6 sm:grid-cols-2">
          <div className="relative overflow-hidden rounded-3xl border border-amber-400/20 bg-gradient-to-br from-amber-400/10 to-ink p-5">
            <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-amber-400 uppercase">
              <Wallet className="h-4 w-4" />
              Loyalty Wallet
            </div>
            <p className="mt-3 font-mono text-4xl font-extrabold text-white tabular-nums">{points}</p>
            <p className="mt-1 text-[11px] text-slate-400">Aurora Points · 100 pts = Rp 10.000 off</p>
            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-800">
              <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-amber-400 to-ember" />
            </div>
            <p className="mt-2 text-[11px] text-slate-600">230 more points to Platinum tier</p>
          </div>

          <div className="rounded-3xl border border-slate-800/80 bg-ink/60 p-5">
            <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-slate-400 uppercase">
              <Ticket className="h-4 w-4 text-amber-400" />
              Active Ticket
            </div>
            {ticket ? (
              <div className="mt-3">
                <p
                  className={cx(
                    'font-mono text-4xl font-extrabold',
                    isTurn ? 'text-emerald-400' : 'text-amber-400',
                  )}
                >
                  {ticket.id}
                </p>
                <p className="mt-1 text-xs text-slate-400">{ticket.serviceName}</p>
                <span
                  className={cx(
                    'mt-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold tracking-widest uppercase',
                    isTurn ? 'bg-emerald-400/15 text-emerald-300' : 'bg-amber-400/15 text-amber-300',
                  )}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  {isTurn ? 'Being served now' : `${Math.max(0, ticket.number - ticketServing)} ahead of you`}
                </span>
                {!isTurn && (
                  <button
                    onClick={onCancelTicket}
                    className="mt-3 block text-[11px] font-bold text-slate-500 transition-colors hover:text-red-400"
                  >
                    Cancel this ticket
                  </button>
                )}
              </div>
            ) : (
              <div className="mt-3">
                <Ticket className="h-8 w-8 text-slate-700" />
                <p className="mt-2 text-xs text-slate-500">No active ticket. Grab one from the Live Queue tab.</p>
              </div>
            )}
          </div>
        </div>

        <div className="px-7 pb-2">
          <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-slate-400 uppercase">
            <CalendarDays className="h-4 w-4 text-amber-400" />
            Visit History
          </div>
        </div>
        <div className="mx-7 mb-6 mt-3 divide-y divide-slate-800/80 rounded-2xl border border-slate-800/80 bg-ink/40">
          {history.map((h) => (
            <div key={h.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3.5">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-400">
                  <CheckCircle2 className="h-4 w-4" />
                </span>
                <div className="leading-tight">
                  <p className="text-sm font-bold text-white">{h.service}</p>
                  <p className="text-[11px] text-slate-500">
                    {h.branch} · {h.date}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm font-bold text-slate-300">{formatIDR(h.price)}</span>
                <span className="rounded-full bg-amber-400/10 px-2.5 py-1 text-[10px] font-bold text-amber-400">
                  +{h.points} pts
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between border-t border-slate-800/80 px-7 py-4">
          <span className="flex items-center gap-1.5 text-[11px] text-slate-600">
            <History className="h-3.5 w-3.5" />
            {history.length} visits recorded
          </span>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 rounded-xl border border-slate-700/80 px-4 py-2 text-xs font-bold text-slate-300 transition-colors hover:border-red-500/40 hover:text-red-400"
          >
            <LogOut className="h-3.5 w-3.5" />
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}

function AuthModal({ onClose }) {
  useEscapeKey(onClose)
  const [email, setEmail] = useState('rafi@example.com')
  const [password, setPassword] = useState('demo1234')
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Member login"
        onClick={(e) => e.stopPropagation()}
        className="view-in w-full max-w-sm rounded-3xl border border-slate-800 bg-coal p-7 shadow-2xl shadow-black/60"
      >
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-ember text-slate-950">
            <User className="h-5 w-5" />
          </span>
          <div>
            <h3 className="text-lg font-extrabold text-white">Welcome Back</h3>
            <p className="text-xs text-slate-500">Sign in to your Aurorium account</p>
          </div>
        </div>
        <form
          className="mt-6 space-y-4"
          onSubmit={(e) => {
            e.preventDefault()
            onClose()
          }}
        >
          <div>
            <label className="mb-1.5 block text-[11px] font-bold tracking-widest text-slate-400 uppercase">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-2xl border border-slate-800 bg-ink px-4 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-slate-600 focus:border-amber-400/60"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[11px] font-bold tracking-widest text-slate-400 uppercase">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-2xl border border-slate-800 bg-ink px-4 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-slate-600 focus:border-amber-400/60"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-2xl bg-gradient-to-r from-amber-400 to-ember py-3 text-sm font-bold text-slate-950 shadow-lg shadow-ember/25 transition-transform hover:scale-[1.02] active:scale-95"
          >
            Sign In
          </button>
          <p className="text-center text-[11px] text-slate-600">
            Prototype mode — any credentials sign you in as {MOCK_USER.name}
          </p>
        </form>
      </div>
    </div>
  )
}

function Footer({ onNavigate }) {
  return (
    <footer className="border-t border-slate-800/80 bg-ink/60">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-6 px-4 py-10 sm:px-6">
        <button onClick={() => onNavigate('home')} className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-ember text-slate-950">
            <Scissors className="h-4 w-4" strokeWidth={2.5} />
          </span>
          <span className="font-extrabold text-white">
            Aurorium<span className="text-amber-400">.</span>
          </span>
        </button>
        <p className="text-xs text-slate-600">© 2026 Aurorium Franchise Group · Crafted for gentlemen</p>
        <div className="flex items-center gap-2">
          {[Camera, ThumbsUp, MessageCircle].map((Icon, i) => (
            <span
              key={i}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-800/80 bg-coal text-slate-400 transition-colors hover:border-amber-400/40 hover:text-amber-400"
            >
              <Icon className="h-4 w-4" />
            </span>
          ))}
        </div>
      </div>
    </footer>
  )
}

function Toast({ toast }) {
  if (!toast) return null
  return (
    <div className="view-in fixed bottom-6 left-1/2 z-[70] flex -translate-x-1/2 items-center gap-2.5 rounded-2xl border border-amber-400/30 bg-coal/95 px-5 py-3.5 text-sm font-semibold text-white shadow-2xl shadow-black/50 backdrop-blur">
      <CheckCircle2 className="h-4.5 w-4.5 text-amber-400" />
      {toast}
    </div>
  )
}

export default function App({ initialView = 'home' }) {
  const [view, setView] = useState(VIEWS.includes(initialView) ? initialView : 'home')
  const [user, setUser] = useState(null)
  const [showAuth, setShowAuth] = useState(false)
  const [showMember, setShowMember] = useState(false)
  const [selectedBranchId, setSelectedBranchId] = useState(null)
  const [selectedServiceId, setSelectedServiceId] = useState(null)
  const [nearestId, setNearestId] = useState(null)
  const [detecting, setDetecting] = useState(false)
  const [ticket, setTicket] = useState(null)
  const [servingByBranch, setServingByBranch] = useState(() =>
    Object.fromEntries(BRANCHES.map((b) => [b.id, b.baseServing])),
  )
  const [history, setHistory] = useState(INITIAL_HISTORY)
  const [toast, setToast] = useState(null)
  const [ticketConfirmed, setTicketConfirmed] = useState(false)

  const servingRef = useRef(servingByBranch)
  const ticketRef = useRef(null)
  const toastTimer = useRef(null)
  const confirmTimer = useRef(null)

  const selectedBranch = useMemo(
    () => BRANCHES.find((b) => b.id === selectedBranchId) ?? BRANCHES[0],
    [selectedBranchId],
  )
  const selectedService = useMemo(
    () => SERVICES.find((s) => s.id === selectedServiceId) ?? SERVICES[0],
    [selectedServiceId],
  )
  const nearestBranch = useMemo(() => BRANCHES.find((b) => b.id === nearestId) ?? null, [nearestId])
  const serving = servingByBranch[selectedBranch.id] ?? selectedBranch.baseServing ?? 0

  const ticketBranch = ticket ? (BRANCHES.find((b) => b.id === ticket.branchId) ?? null) : null
  const ticketServing = ticket
    ? (servingByBranch[ticket.branchId] ?? ticketBranch?.baseServing ?? 0)
    : 0

  const earnedPoints = useMemo(
    () => history.reduce((sum, h) => sum + h.points, 0) - INITIAL_HISTORY.reduce((sum, h) => sum + h.points, 0),
    [history],
  )
  const points = user ? 340 + earnedPoints : 0

  const notify = useCallback((message) => {
    setToast(message)
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(null), 3200)
  }, [])

  useEffect(() => {
    ticketRef.current = ticket
  }, [ticket])

  useEffect(() => {
    const interval = setInterval(() => {
      const next = {}
      for (const b of BRANCHES) {
        const current = servingRef.current[b.id]
        const ceiling = b.baseServing + b.liveWaiters + 8
        next[b.id] = current < ceiling ? current + 1 : current
      }
      servingRef.current = next
      setServingByBranch(next)

      const active = ticketRef.current
      if (active) {
        const branch = BRANCHES.find((b) => b.id === active.branchId) ?? BRANCHES[0]
        const current = next[active.branchId] ?? branch.baseServing ?? 0
        if (current > active.number) {
          const earned = Math.round(active.price / 1000)
          ticketRef.current = null
          setHistory((prev) => [
            {
              id: `h-${active.id}`,
              service: active.serviceName,
              branch: branch.name,
              date: 'Today',
              price: active.price,
              points: earned,
            },
            ...prev,
          ])
          setTicket(null)
          notify(`Service complete at ${branch.name} — +${earned} Aurora Points earned!`)
        }
      }
    }, TICKET_STEP_MS)
    return () => clearInterval(interval)
  }, [notify])

  const handleDetect = () => {
    setDetecting(true)
    setNearestId(null)
    setTimeout(() => {
      const nearest = [...BRANCHES].sort((a, b) => a.distance - b.distance)[0]
      setNearestId(nearest.id)
      setSelectedBranchId(nearest.id)
      setDetecting(false)
      notify(`Location locked — ${nearest.name} is your nearest outlet (${nearest.distance} km).`)
    }, 1400)
  }

  const handleTakeTicket = () => {
    if (!user) {
      setShowAuth(true)
      notify('Login as a member to take a queue ticket.')
      return
    }
    if (ticket) {
      notify(`You already hold ticket ${ticket.id}.`)
      return
    }
    const branch = selectedBranch
    const service = selectedService
    const last = Math.max(
      servingRef.current[branch.id] ?? branch.baseServing ?? 0,
      branch.baseServing + branch.liveWaiters,
    )
    const number = last + 1
    const next = {
      id: `${branch.code}-${padNumber(number)}`,
      number,
      branchId: branch.id,
      serviceId: service.id,
      serviceName: service.name,
      price: service.price,
      duration: service.duration,
    }
    ticketRef.current = next
    setTicket(next)
    clearTimeout(confirmTimer.current)
    setTicketConfirmed(true)
    confirmTimer.current = setTimeout(() => setTicketConfirmed(false), 4000)
    notify(`Ticket ${next.id} reserved at ${branch.name}. See you soon!`)
  }

  const handleCancelTicket = () => {
    ticketRef.current = null
    setTicket(null)
    clearTimeout(confirmTimer.current)
    setTicketConfirmed(false)
    notify('Ticket cancelled — no hard feelings.')
  }

  const handleLogin = () => {
    setUser(MOCK_USER)
    setShowAuth(false)
    notify(`Welcome back, ${MOCK_USER.name}! Loyalty wallet unlocked.`)
  }

  const handleLogout = () => {
    setUser(null)
    ticketRef.current = null
    setTicket(null)
    setShowMember(false)
    notify('Signed out. Your queue spot has been released.')
  }

  const handleQueueHere = (branchId) => {
    setSelectedBranchId(branchId)
    setView('queue')
  }

  return (
    <div className="relative min-h-screen bg-ink text-slate-100">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(245,158,11,0.07),transparent_55%)]" />
        <div className="absolute top-0 left-1/2 h-[28rem] w-[50rem] -translate-x-1/2 rounded-full bg-amber-500/[0.05] blur-3xl" />
        <div className="absolute right-0 bottom-0 h-[28rem] w-[28rem] rounded-full bg-ember/[0.05] blur-3xl" />
        <div className="absolute bottom-0 left-0 h-80 w-80 rounded-full bg-orange-600/[0.04] blur-3xl" />
      </div>

      <Navbar
        view={view}
        onNavigate={setView}
        user={user}
        onOpenAuth={() => setShowAuth(true)}
        onOpenMember={() => setShowMember(true)}
        onLogout={handleLogout}
      />

      <main key={view} className="view-in">
        {view === 'home' && (
          <HeroView
            onNavigate={setView}
            onDetect={handleDetect}
            detecting={detecting}
            nearestBranch={nearestBranch}
            selectedBranch={selectedBranch}
            serving={serving}
            ticket={user ? ticket : null}
            isLoggedIn={Boolean(user)}
          />
        )}
        {view === 'branches' && (
          <BranchesView
            selectedId={selectedBranch.id}
            nearestId={nearestId}
            onSelect={setSelectedBranchId}
            onQueue={handleQueueHere}
            onDetect={handleDetect}
            detecting={detecting}
          />
        )}
        {view === 'services' && (
          <ServicesView
            selectedId={selectedService.id}
            onSelect={setSelectedServiceId}
            onReserve={() => setView('queue')}
          />
        )}
        {view === 'queue' && (
          <QueueView
            user={user}
            selectedBranch={selectedBranch}
            selectedService={selectedService}
            serving={serving}
            ticket={user ? ticket : null}
            ticketServing={ticketServing}
            confirmed={user ? ticketConfirmed : false}
            onSelectBranch={setSelectedBranchId}
            onSelectService={setSelectedServiceId}
            onTakeTicket={handleTakeTicket}
            onCancel={handleCancelTicket}
            onNavigateServices={() => setView('services')}
          />
        )}
      </main>

      <Footer onNavigate={setView} />

      {showAuth && <AuthModal onClose={handleLogin} />}
      {showMember && user && (
        <MemberModal
          user={user}
          points={points}
          ticket={ticket}
          ticketServing={ticketServing}
          history={history}
          onClose={() => setShowMember(false)}
          onCancelTicket={handleCancelTicket}
          onLogout={handleLogout}
        />
      )}
      <Toast toast={toast} />
    </div>
  )
}
