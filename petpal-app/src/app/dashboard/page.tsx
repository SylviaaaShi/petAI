"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  MOCK_PROVIDERS,
  SERVICE_LABELS,
  PET_LABELS,
  SERVICE_ICONS,
  PET_ICONS,
  type ServiceType,
  type PetType,
  type Provider,
} from "@/lib/mockData";

// ─── Navbar ──────────────────────────────────────────────────────────────────
function DashboardNav() {
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem("petcare_auth");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function logout() {
    localStorage.removeItem("petcare_auth");
    router.push("/login");
  }

  const name = user?.name ?? "Sylvia";
  const initials = name.slice(0, 1).toUpperCase();

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">🐾</span>
          <span className="text-xl font-bold text-amber-500">Pet Care AI</span>
        </Link>

        {/* Search bar */}
        <div className="hidden md:flex items-center bg-gray-50 border border-gray-200 rounded-full px-4 py-2 gap-3 w-72 hover:border-amber-300 transition-colors">
          <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search suburb or postcode…"
            className="bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none w-full"
          />
        </div>

        <div className="flex items-center gap-3">
          <Link href="/login" className="hidden md:block text-sm text-gray-600 hover:text-amber-500 font-medium transition-colors">
            Become a Provider
          </Link>
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((o) => !o)}
              className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1.5 hover:bg-gray-200 transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-amber-400 flex items-center justify-center text-white text-xs font-bold">
                {initials}
              </div>
              <span className="text-sm font-medium text-gray-700 hidden sm:block">{name}</span>
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 top-11 w-44 bg-white border border-gray-100 rounded-xl shadow-lg py-1 z-50">
                <div className="px-4 py-2 border-b border-gray-50">
                  <p className="text-xs font-semibold text-gray-800 truncate">{name}</p>
                  <p className="text-xs text-gray-400">Pet Owner</p>
                </div>
                <button
                  onClick={logout}
                  className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
                >
                  Log out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

// ─── Filter Pill ──────────────────────────────────────────────────────────────
function FilterPill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium border transition-all ${
        active
          ? "bg-amber-500 text-white border-amber-500 shadow-sm"
          : "bg-white text-gray-600 border-gray-200 hover:border-amber-300 hover:text-amber-500"
      }`}
    >
      {label}
    </button>
  );
}

// ─── Star Rating ──────────────────────────────────────────────────────────────
function Stars({ rating }: { rating: number }) {
  return (
    <span className="text-yellow-400 text-sm">
      {"★".repeat(Math.floor(rating))}
      {rating % 1 >= 0.5 ? "½" : ""}
    </span>
  );
}

// ─── AI Score Badge ───────────────────────────────────────────────────────────
function AIScoreBadge({ score }: { score: number }) {
  const color =
    score >= 95 ? "bg-green-100 text-green-700" :
    score >= 85 ? "bg-blue-100 text-blue-700" :
    "bg-gray-100 text-gray-600";
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${color}`}>
      🤖 AI {score}
    </span>
  );
}

// ─── Avatar ───────────────────────────────────────────────────────────────────
const STAFF_PHOTOS = [
  "/staff/WechatIMG53.jpg",
  "/staff/WechatIMG54.jpg",
  "/staff/WechatIMG55.jpg",
  "/staff/WechatIMG57.jpg",
  "/staff/WechatIMG58.jpg",
  "/staff/WechatIMG59.jpg",
];
function Avatar({ index }: { index: number }) {
  return (
    <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 relative">
      <Image
        src={STAFF_PHOTOS[index % STAFF_PHOTOS.length]}
        alt="Provider"
        fill
        className="object-cover object-top"
        sizes="64px"
      />
    </div>
  );
}

// ─── Provider Card ────────────────────────────────────────────────────────────
function ProviderCard({ provider, index }: { provider: Provider; index: number }) {
  const [saved, setSaved] = useState(false);

  return (
    <Link href={`/providers/${provider.id}`}>
      <div className="bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-lg hover:border-amber-200 transition-all group cursor-pointer relative">
        {/* Wishlist button */}
        <button
          className="absolute top-4 right-4 z-10 text-gray-300 hover:text-red-400 transition-colors"
          onClick={(e) => { e.preventDefault(); setSaved(!saved); }}
        >
          {saved ? (
            <svg className="w-5 h-5 text-red-400 fill-current" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
          )}
        </button>

        <div className="flex gap-4">
          <div className="relative">
            <Avatar index={index} />
            {provider.verified && (
              <span className="absolute -bottom-1 -right-1 bg-blue-500 text-white text-[9px] rounded-full w-4 h-4 flex items-center justify-center font-bold">✓</span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-gray-900 group-hover:text-amber-500 transition-colors">{provider.name}</h3>
                  {provider.badge && (
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                      provider.badge === "Superhost" ? "bg-amber-100 text-amber-600" :
                      provider.badge === "Top Rated" ? "bg-yellow-100 text-yellow-700" :
                      "bg-green-100 text-green-600"
                    }`}>
                      {provider.badge === "Superhost" ? "🏆" : provider.badge === "Top Rated" ? "⭐" : "🌟"} {provider.badge}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-0.5">{provider.location} · {provider.distance} km away</p>
              </div>
              <AIScoreBadge score={provider.aiScore} />
            </div>

            <div className="flex items-center gap-1.5 mt-1.5">
              <Stars rating={provider.rating} />
              <span className="text-sm font-semibold text-gray-800">{provider.rating}</span>
              <span className="text-xs text-gray-400">({provider.reviewCount} reviews)</span>
            </div>
          </div>
        </div>

        {/* Bio */}
        <p className="text-sm text-gray-500 mt-3 leading-relaxed line-clamp-2">{provider.bio}</p>

        {/* AI Tags */}
        <div className="flex flex-wrap gap-2 mt-3">
          {provider.aiTags.map((tag) => (
            <span key={tag} className="text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-medium">
              {tag}
            </span>
          ))}
        </div>

        {/* Services */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {provider.services.map((s) => (
            <span key={s} className="text-xs bg-amber-50 text-amber-600 border border-amber-100 px-2 py-0.5 rounded-full">
              {SERVICE_ICONS[s]} {SERVICE_LABELS[s]}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
          <div className="flex items-center gap-4 text-xs text-gray-400">
            {provider.hasBackgroundCheck && (
              <span className="flex items-center gap-1 text-green-600"><span>🛡️</span> Police check</span>
            )}
            <span>⏱ Replies {provider.responseTime}</span>
            <span>🔄 {provider.repeatClients} repeat clients</span>
          </div>
          <div className="text-right shrink-0">
            <span className="text-lg font-bold text-gray-900">${provider.priceFrom}</span>
            <span className="text-xs text-gray-400"> /night</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

// ─── Sort Dropdown ────────────────────────────────────────────────────────────
type SortKey = "ai-score" | "rating" | "price-asc" | "price-desc" | "distance";
const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "ai-score", label: "🤖 Best AI Match" },
  { value: "rating", label: "⭐ Highest Rated" },
  { value: "price-asc", label: "💰 Price: Low to High" },
  { value: "price-desc", label: "💰 Price: High to Low" },
  { value: "distance", label: "📍 Nearest First" },
];

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const [selectedServices, setSelectedServices] = useState<ServiceType[]>([]);
  const [selectedPets, setSelectedPets] = useState<PetType[]>([]);
  const [maxPrice, setMaxPrice] = useState<number>(200);
  const [minRating, setMinRating] = useState<number>(0);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [backgroundCheck, setBackgroundCheck] = useState(false);
  const [hasYard, setHasYard] = useState(false);
  const [sortBy, setSortBy] = useState<SortKey>("ai-score");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");

  function toggleService(s: ServiceType) {
    setSelectedServices((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  }
  function togglePet(p: PetType) {
    setSelectedPets((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
    );
  }

  const filtered = useMemo(() => {
    let list = MOCK_PROVIDERS.filter((p) => {
      if (selectedServices.length > 0 && !selectedServices.some((s) => p.services.includes(s))) return false;
      if (selectedPets.length > 0 && !selectedPets.some((pt) => p.petTypes.includes(pt))) return false;
      if (p.priceFrom > maxPrice) return false;
      if (p.rating < minRating) return false;
      if (verifiedOnly && !p.verified) return false;
      if (backgroundCheck && !p.hasBackgroundCheck) return false;
      if (hasYard && !p.hasYard) return false;
      return true;
    });

    list = [...list].sort((a, b) => {
      if (sortBy === "ai-score") return b.aiScore - a.aiScore;
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "price-asc") return a.priceFrom - b.priceFrom;
      if (sortBy === "price-desc") return b.priceFrom - a.priceFrom;
      if (sortBy === "distance") return a.distance - b.distance;
      return 0;
    });

    return list;
  }, [selectedServices, selectedPets, maxPrice, minRating, verifiedOnly, backgroundCheck, hasYard, sortBy]);

  const activeFilterCount = selectedServices.length + selectedPets.length +
    (maxPrice < 200 ? 1 : 0) + (minRating > 0 ? 1 : 0) +
    (verifiedOnly ? 1 : 0) + (backgroundCheck ? 1 : 0) + (hasYard ? 1 : 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav />

      {/* Hero strip */}
      <div className="bg-gradient-to-r from-amber-500 to-amber-500 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">Find a carer near you</h1>
              <p className="text-amber-100 text-sm">Melbourne · {filtered.length} providers available</p>
            </div>
            <Link
              href="/ai"
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 border border-white/30 text-white text-sm font-semibold px-4 py-2.5 rounded-full transition-all backdrop-blur-sm shrink-0"
            >
              <span>🤖</span> Ask AI to match me
            </Link>
          </div>

          {/* Mobile search */}
          <div className="mt-4 md:hidden flex items-center bg-white rounded-full px-4 py-2.5 gap-2 shadow">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
            <input type="text" placeholder="Search suburb…" className="text-sm text-gray-700 outline-none w-full placeholder-gray-400" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* Quick service filter pills */}
        <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide">
          {(Object.keys(SERVICE_LABELS) as ServiceType[]).map((s) => (
            <FilterPill
              key={s}
              label={`${SERVICE_ICONS[s]} ${SERVICE_LABELS[s]}`}
              active={selectedServices.includes(s)}
              onClick={() => toggleService(s)}
            />
          ))}
        </div>

        {/* Pet type pills */}
        <div className="flex gap-2 overflow-x-auto pb-3 mt-2 scrollbar-hide">
          {(Object.keys(PET_LABELS) as PetType[]).map((p) => (
            <FilterPill
              key={p}
              label={`${PET_ICONS[p]} ${PET_LABELS[p]}`}
              active={selectedPets.includes(p)}
              onClick={() => togglePet(p)}
            />
          ))}
        </div>

        {/* Toolbar row */}
        <div className="flex items-center justify-between mt-4 mb-5 gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            {/* More filters button */}
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                filtersOpen || activeFilterCount > 0
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-white text-gray-700 border-gray-200 hover:border-gray-400"
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h18M7 12h10M11 20h2" />
              </svg>
              Filters
              {activeFilterCount > 0 && (
                <span className="bg-amber-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                  {activeFilterCount}
                </span>
              )}
            </button>

            <span className="text-sm text-gray-400">{filtered.length} providers found</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortKey)}
              className="text-sm border border-gray-200 rounded-full px-3 py-2 bg-white text-gray-700 outline-none hover:border-gray-400 cursor-pointer"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>

            {/* View toggle */}
            <div className="hidden sm:flex border border-gray-200 rounded-full overflow-hidden">
              <button
                onClick={() => setViewMode("list")}
                className={`px-3 py-2 text-xs ${viewMode === "list" ? "bg-gray-900 text-white" : "bg-white text-gray-500 hover:bg-gray-50"}`}
              >
                ☰ List
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`px-3 py-2 text-xs ${viewMode === "grid" ? "bg-gray-900 text-white" : "bg-white text-gray-500 hover:bg-gray-50"}`}
              >
                ⊞ Grid
              </button>
            </div>
          </div>
        </div>

        {/* Expanded filter panel */}
        {filtersOpen && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

              {/* Price range */}
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-3">Max Price</label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={20}
                    max={200}
                    step={5}
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="flex-1 accent-amber-500"
                  />
                  <span className="text-sm font-bold text-amber-500 w-16 text-right">
                    {maxPrice === 200 ? "Any" : `$${maxPrice}`}
                  </span>
                </div>
              </div>

              {/* Min rating */}
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-3">Minimum Rating</label>
                <div className="flex gap-2">
                  {[0, 4, 4.5, 4.8].map((r) => (
                    <button
                      key={r}
                      onClick={() => setMinRating(r)}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                        minRating === r
                          ? "bg-amber-500 text-white border-amber-500"
                          : "border-gray-200 text-gray-600 hover:border-amber-300"
                      }`}
                    >
                      {r === 0 ? "Any" : `${r}+`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Home features */}
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-3">Home Features</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={hasYard} onChange={(e) => setHasYard(e.target.checked)} className="rounded accent-amber-500" />
                    <span className="text-sm text-gray-600">🌳 Has a yard</span>
                  </label>
                </div>
              </div>

              {/* Safety */}
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-3">Safety & Trust</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={verifiedOnly} onChange={(e) => setVerifiedOnly(e.target.checked)} className="rounded accent-amber-500" />
                    <span className="text-sm text-gray-600">✅ Verified only</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={backgroundCheck} onChange={(e) => setBackgroundCheck(e.target.checked)} className="rounded accent-amber-500" />
                    <span className="text-sm text-gray-600">🛡️ Police check done</span>
                  </label>
                </div>
              </div>
            </div>

            {activeFilterCount > 0 && (
              <button
                onClick={() => {
                  setSelectedServices([]);
                  setSelectedPets([]);
                  setMaxPrice(200);
                  setMinRating(0);
                  setVerifiedOnly(false);
                  setBackgroundCheck(false);
                  setHasYard(false);
                }}
                className="mt-5 text-sm text-red-500 hover:text-red-600 font-medium underline"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}

        {/* Results */}
        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No providers found</h3>
            <p className="text-gray-400 text-sm">Try adjusting your filters or search in a different area.</p>
            <button
              onClick={() => {
                setSelectedServices([]);
                setSelectedPets([]);
                setMaxPrice(200);
                setMinRating(0);
                setVerifiedOnly(false);
                setBackgroundCheck(false);
                setHasYard(false);
              }}
              className="mt-4 text-sm text-amber-500 underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className={viewMode === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
            : "flex flex-col gap-4"
          }>
            {filtered.map((provider, i) => (
              <ProviderCard key={provider.id} provider={provider} index={i} />
            ))}
          </div>
        )}

        {filtered.length > 0 && (
          <p className="text-center text-sm text-gray-400 mt-10 pb-6">
            Showing {filtered.length} of {MOCK_PROVIDERS.length} providers · <span className="text-amber-500 cursor-pointer hover:underline">Load more</span>
          </p>
        )}
      </div>

      {/* Floating Ask AI button */}
      <Link
        href="/ai"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-amber-500 hover:bg-amber-600 text-white font-semibold px-5 py-3.5 rounded-full shadow-lg shadow-amber-200 hover:shadow-amber-300 transition-all hover:scale-105 active:scale-95"
      >
        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
        </svg>
        Ask AI
      </Link>
    </div>
  );
}
