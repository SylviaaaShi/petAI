"use client";

import { useState } from "react";
import ProviderNav from "@/components/ProviderNav";
import { MOCK_BOOKINGS, type Booking, type BookingStatus } from "@/lib/providerMockData";

const AVATAR_COLORS = ["bg-rose-400", "bg-teal-400", "bg-sky-400", "bg-emerald-400", "bg-violet-400", "bg-amber-400", "bg-pink-400"];

const STATUS_TABS: { key: BookingStatus | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "confirmed", label: "Confirmed" },
  { key: "in-progress", label: "In Progress" },
  { key: "completed", label: "Completed" },
  { key: "cancelled", label: "Cancelled" },
];

function StatusBadge({ status }: { status: BookingStatus }) {
  const styles: Record<BookingStatus, string> = {
    pending: "bg-amber-100 text-amber-700 border-amber-200",
    confirmed: "bg-blue-100 text-blue-700 border-blue-200",
    "in-progress": "bg-green-100 text-green-700 border-green-200",
    completed: "bg-gray-100 text-gray-600 border-gray-200",
    cancelled: "bg-red-100 text-red-600 border-red-200",
  };
  const labels: Record<BookingStatus, string> = {
    pending: "⏳ Pending",
    confirmed: "✅ Confirmed",
    "in-progress": "🐾 In Progress",
    completed: "✓ Completed",
    cancelled: "✗ Cancelled",
  };
  return (
    <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}

function BookingCard({ booking, index }: { booking: Booking; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const [status, setStatus] = useState<BookingStatus>(booking.status);

  return (
    <div className={`bg-white rounded-2xl border transition-all overflow-hidden ${
      status === "pending" ? "border-amber-200 shadow-amber-50 shadow-md" : "border-gray-100"
    }`}>
      {/* Card header */}
      <div
        className="p-5 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 rounded-xl ${AVATAR_COLORS[index % AVATAR_COLORS.length]} flex items-center justify-center text-white font-bold shrink-0`}>
            {booking.ownerAvatar}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 flex-wrap">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-gray-900">{booking.petName}</h3>
                  <span className="text-sm text-gray-400">{booking.petBreed} · {booking.petAge}</span>
                </div>
                <p className="text-sm text-gray-500 mt-0.5">Owner: {booking.ownerName}</p>
              </div>
              <StatusBadge status={status} />
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-gray-500">
              <span>📋 {booking.service}</span>
              <span>📅 {booking.checkIn} → {booking.checkOut}</span>
              <span>🐾 {booking.pets} pet{booking.pets > 1 ? "s" : ""}</span>
              <span className="font-semibold text-gray-800 text-sm">${booking.total} AUD</span>
            </div>
          </div>

          <svg
            className={`w-4 h-4 text-gray-400 shrink-0 transition-transform mt-1 ${expanded ? "rotate-180" : ""}`}
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div className="border-t border-gray-100 px-5 pb-5 pt-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {/* Pet details */}
            <div className="bg-amber-50 rounded-xl p-4">
              <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-2">Pet Details</p>
              <div className="space-y-1 text-sm text-gray-700">
                <p>🐾 {booking.petName} — {booking.petType}</p>
                <p>🏷️ {booking.petBreed}, {booking.petAge}</p>
                {booking.specialNeeds && (
                  <p className="text-amber-700 bg-amber-50 rounded-lg p-2 text-xs mt-2 border border-amber-200">
                    ⚠️ {booking.specialNeeds}
                  </p>
                )}
              </div>
            </div>

            {/* Booking details */}
            <div className="bg-blue-50 rounded-xl p-4">
              <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-2">Booking Details</p>
              <div className="space-y-1 text-sm text-gray-700">
                <p>📅 {booking.checkIn} → {booking.checkOut}</p>
                <p>🌙 {booking.nights} night{booking.nights > 1 ? "s" : ""} · {booking.pets} pet{booking.pets > 1 ? "s" : ""}</p>
                <p>💰 <span className="font-semibold">${booking.total} AUD</span> total</p>
              </div>
            </div>
          </div>

          {/* Owner message */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Message from owner</p>
            <p className="text-sm text-gray-600 bg-gray-50 rounded-xl p-3 leading-relaxed italic">
              &ldquo;{booking.message}&rdquo;
            </p>
          </div>

          {/* Review (completed) */}
          {booking.rating && (
            <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-100">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-yellow-400">{"★".repeat(booking.rating)}</span>
                <span className="text-xs text-gray-500">{booking.ownerName}</span>
              </div>
              <p className="text-sm text-gray-700 italic">&ldquo;{booking.reviewText}&rdquo;</p>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-wrap gap-2 pt-1">
            {status === "pending" && (
              <>
                <button
                  onClick={() => setStatus("confirmed")}
                  className="bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold px-5 py-2 rounded-xl transition-colors"
                >
                  ✅ Accept Booking
                </button>
                <button
                  onClick={() => setStatus("cancelled")}
                  className="border border-red-200 text-red-500 text-sm font-medium px-5 py-2 rounded-xl hover:bg-red-50 transition-colors"
                >
                  ✗ Decline
                </button>
              </>
            )}
            {status === "confirmed" && (
              <>
                <button
                  onClick={() => setStatus("in-progress")}
                  className="bg-green-500 hover:bg-green-600 text-white text-sm font-semibold px-5 py-2 rounded-xl transition-colors"
                >
                  🐾 Mark In Progress
                </button>
                <button
                  onClick={() => setStatus("cancelled")}
                  className="border border-gray-200 text-gray-500 text-sm font-medium px-5 py-2 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </>
            )}
            {status === "in-progress" && (
              <button
                onClick={() => setStatus("completed")}
                className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold px-5 py-2 rounded-xl transition-colors"
              >
                ✓ Mark Completed
              </button>
            )}
            <button className="border border-gray-200 text-gray-600 text-sm font-medium px-5 py-2 rounded-xl hover:bg-gray-50 transition-colors">
              💬 Message Owner
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProviderBookingsPage() {
  const [activeTab, setActiveTab] = useState<BookingStatus | "all">("all");

  const filtered = activeTab === "all"
    ? MOCK_BOOKINGS
    : MOCK_BOOKINGS.filter((b) => b.status === activeTab);

  const counts = STATUS_TABS.reduce((acc, t) => {
    acc[t.key] = t.key === "all" ? MOCK_BOOKINGS.length : MOCK_BOOKINGS.filter((b) => b.status === t.key).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="min-h-screen bg-gray-50">
      <ProviderNav />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
            <p className="text-gray-500 text-sm mt-1">{MOCK_BOOKINGS.length} total bookings</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500 bg-white border border-gray-200 rounded-full px-4 py-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h18M7 12h10M11 20h2" />
            </svg>
            Filter
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 overflow-x-auto pb-1 mb-6 scrollbar-hide">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeTab === tab.key
                  ? "bg-gray-900 text-white"
                  : "bg-white text-gray-500 border border-gray-200 hover:border-gray-400"
              }`}
            >
              {tab.label}
              {counts[tab.key] > 0 && (
                <span className={`text-xs rounded-full px-1.5 py-0.5 font-bold ${
                  activeTab === tab.key ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"
                }`}>
                  {counts[tab.key]}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Booking list */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-3">📭</div>
            <p className="text-gray-500">No bookings in this category</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((b, i) => (
              <BookingCard key={b.id} booking={b} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
