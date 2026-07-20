"use client";

import Link from "next/link";
import ProviderNav from "@/components/ProviderNav";
import { MOCK_BOOKINGS, MONTHLY_EARNINGS } from "@/lib/providerMockData";

const AVATAR_COLORS = ["bg-rose-400", "bg-teal-400", "bg-sky-400", "bg-emerald-400", "bg-violet-400", "bg-amber-400"];

// ── Icons ─────────────────────────────────────────────────────────────────────
function IconCash() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}
function IconCalendar() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
    </svg>
  );
}
function IconStar() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
    </svg>
  );
}
function IconRefresh() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
    </svg>
  );
}
function IconSparkles() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
    </svg>
  );
}
function IconClipboard() {
  return (
    <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
    </svg>
  );
}
function IconPaw() {
  return (
    <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2a2 2 0 100 4 2 2 0 000-4zM6.5 5a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm11 0a1.5 1.5 0 100 3 1.5 1.5 0 000-3zM4 10a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm16 0a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm-8 2c-2.5 0-5 2-5 4 0 2 1.5 3 3 3 .7 0 1.3-.2 2-.2s1.3.2 2 .2c1.5 0 3-1 3-3 0-2-2.5-4-5-4z"/>
    </svg>
  );
}
function IconAlert() {
  return (
    <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>
  );
}

// ── StatCard ──────────────────────────────────────────────────────────────────
function StatCard({ icon, label, value, sub, color }: { icon: React.ReactNode; label: string; value: string; sub?: string; color: string }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 flex items-start gap-4">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${color}`}>{icon}</div>
      <div>
        <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{label}</p>
        <p className="text-2xl font-bold text-gray-900 mt-0.5">{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

function MiniEarningsChart() {
  const max = Math.max(...MONTHLY_EARNINGS.map((e) => e.amount));
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-semibold text-gray-900">Earnings</h3>
          <p className="text-xs text-gray-400 mt-0.5">Last 6 months</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-gray-900">$7,910</p>
          <p className="text-xs text-green-500 font-medium">↑ 18% vs last period</p>
        </div>
      </div>
      <div className="flex items-end gap-2 h-28">
        {MONTHLY_EARNINGS.map((e, i) => {
          const height = Math.round((e.amount / max) * 100);
          const isLatest = i === MONTHLY_EARNINGS.length - 1;
          return (
            <div key={e.month} className="flex-1 flex flex-col items-center gap-1.5">
              <div className="w-full relative group cursor-pointer">
                <div
                  className={`w-full rounded-t-lg transition-all ${isLatest ? "bg-amber-500" : "bg-amber-200 group-hover:bg-amber-400"}`}
                  style={{ height: `${height * 0.9 + 10}px` }}
                />
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs rounded px-1.5 py-0.5 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  ${e.amount}
                </div>
              </div>
              <span className="text-xs text-gray-400">{e.month}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function BookingStatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending: "bg-amber-100 text-amber-700",
    confirmed: "bg-blue-100 text-blue-700",
    "in-progress": "bg-green-100 text-green-700",
    completed: "bg-gray-100 text-gray-600",
    cancelled: "bg-red-100 text-red-600",
  };
  const labels: Record<string, string> = {
    pending: "Pending",
    confirmed: "Confirmed",
    "in-progress": "In Progress",
    completed: "Completed",
    cancelled: "Cancelled",
  };
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${map[status]}`}>
      {labels[status]}
    </span>
  );
}

export default function ProviderOverviewPage() {
  const pending = MOCK_BOOKINGS.filter((b) => b.status === "pending");
  const upcoming = MOCK_BOOKINGS.filter((b) => b.status === "confirmed" || b.status === "in-progress");
  const totalEarnings = MONTHLY_EARNINGS.reduce((s, e) => s + e.amount, 0);
  const totalBookings = MONTHLY_EARNINGS.reduce((s, e) => s + e.bookings, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <ProviderNav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Welcome */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Good morning, Emma</h1>
            <p className="text-gray-500 text-sm mt-1">
              You have <span className="font-semibold text-amber-600">{pending.length} new requests</span> waiting for your response.
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-sm font-medium px-4 py-2 rounded-full">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Profile Active
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon={<IconCash />} label="Total Earnings" value={`$${totalEarnings.toLocaleString()}`} sub="Last 6 months" color="bg-amber-100 text-amber-600" />
          <StatCard icon={<IconCalendar />} label="Total Bookings" value={String(totalBookings)} sub="Last 6 months" color="bg-blue-100 text-blue-600" />
          <StatCard icon={<IconStar />} label="Avg Rating" value="4.97" sub="143 reviews" color="bg-yellow-100 text-yellow-600" />
          <StatCard icon={<IconRefresh />} label="Repeat Clients" value="38" sub="67% return rate" color="bg-green-100 text-green-600" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left: Chart + upcoming */}
          <div className="lg:col-span-2 space-y-6">
            <MiniEarningsChart />

            {/* Upcoming bookings */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-semibold text-gray-900">Upcoming Stays</h3>
                <Link href="/provider/bookings" className="text-xs text-amber-500 hover:underline font-medium">View all →</Link>
              </div>
              {upcoming.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-8">No upcoming bookings</p>
              ) : (
                <div className="space-y-3">
                  {upcoming.map((b, i) => (
                    <div key={b.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                      <div className={`w-10 h-10 rounded-full ${AVATAR_COLORS[i % AVATAR_COLORS.length]} flex items-center justify-center text-white text-sm font-bold shrink-0`}>
                        {b.ownerAvatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-gray-800 truncate">{b.petName}</p>
                          <span className="text-xs text-gray-400">— {b.petBreed}</span>
                        </div>
                        <p className="text-xs text-gray-400">{b.ownerName} · {b.checkIn} → {b.checkOut}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <BookingStatusBadge status={b.status} />
                        <p className="text-xs text-gray-400 mt-1">${b.total}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent reviews */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-5">Recent Reviews</h3>
              <div className="space-y-4">
                {MOCK_BOOKINGS.filter((b) => b.rating).slice(0, 2).map((b, i) => (
                  <div key={b.id} className="flex gap-3">
                    <div className={`w-9 h-9 rounded-full ${AVATAR_COLORS[i % AVATAR_COLORS.length]} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                      {b.ownerAvatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-gray-800">{b.ownerName}</p>
                        <span className="text-yellow-400 text-sm">{"★".repeat(b.rating ?? 5)}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed">&ldquo;{b.reviewText}&rdquo;</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Pending requests */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-semibold text-gray-900">New Requests</h3>
                <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-0.5 rounded-full">{pending.length} pending</span>
              </div>

              {pending.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-8">All caught up!</p>
              ) : (
                <div className="space-y-4">
                  {pending.map((b, i) => (
                    <div key={b.id} className="border border-amber-100 bg-amber-50 rounded-xl p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`w-9 h-9 rounded-full ${AVATAR_COLORS[i % AVATAR_COLORS.length]} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                          {b.ownerAvatar}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-800">{b.ownerName}</p>
                          <p className="text-xs text-gray-500">{b.petName} · {b.petBreed}</p>
                        </div>
                      </div>
                      <div className="text-xs text-gray-600 space-y-1.5 mb-3">
                        <p className="flex items-center gap-1.5"><IconClipboard /> {b.service}</p>
                        <p className="flex items-center gap-1.5"><IconCalendar /><span className="w-3 h-3" />{b.checkIn} → {b.checkOut} ({b.nights}n)</p>
                        <p className="flex items-center gap-1.5"><IconPaw /> {b.pets} pet · <span className="font-semibold text-gray-800">${b.total}</span></p>
                      </div>
                      {b.specialNeeds && (
                        <p className="flex items-center gap-1.5 text-xs bg-white border border-amber-200 text-amber-700 px-2 py-1.5 rounded-lg mb-3">
                          <IconAlert /> {b.specialNeeds}
                        </p>
                      )}
                      <div className="flex gap-2">
                        <button className="flex-1 bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold py-2 rounded-lg transition-colors">
                          Accept
                        </button>
                        <button className="flex-1 border border-gray-200 text-gray-600 text-xs font-semibold py-2 rounded-lg hover:bg-gray-50 transition-colors">
                          Decline
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* AI Insight */}
            <div className="bg-gradient-to-br from-amber-500 to-amber-500 rounded-2xl p-5 text-white">
              <p className="text-sm font-semibold mb-1 flex items-center gap-1.5"><IconSparkles /> AI Insight</p>
              <p className="text-xs text-amber-100 leading-relaxed">
                Your response time is <strong className="text-white">under 1 hour</strong> — this puts you in the top 10% of providers! Owners are 3× more likely to book when you respond within 2 hours.
              </p>
            </div>

            {/* Profile completeness */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-gray-800">Profile Strength</p>
                <span className="text-sm font-bold text-green-600">85%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2 mb-3">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: "85%" }} />
              </div>
              <div className="space-y-1.5 text-xs text-gray-500">
                <p className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-green-500 shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                  Photos uploaded
                </p>
                <p className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-green-500 shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                  Identity verified
                </p>
                <p className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-green-500 shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                  Police check done
                </p>
                <p className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-amber-400 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /></svg>
                  Add intro video <Link href="/provider/profile" className="text-amber-500 underline ml-0.5">+10%</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
