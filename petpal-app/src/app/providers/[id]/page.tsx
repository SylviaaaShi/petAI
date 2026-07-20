"use client";

import { use, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MOCK_PROVIDERS, SERVICE_LABELS, PET_LABELS } from "@/lib/mockData";

// ── SVG Icons ─────────────────────────────────────────────────────────────────
const IcPin = () => <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"/></svg>;
const IcSparkles = ({ className = "w-4 h-4" }) => <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z"/></svg>;
const IcCheck = ({ className = "w-4 h-4" }) => <svg className={className} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg>;
const IcShield = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"/></svg>;
const IcHeart = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"/></svg>;
const IcCamera = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"/><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z"/></svg>;
const IcChat = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"/></svg>;
const IcHome = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"/></svg>;
const IcBuilding = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21"/></svg>;
const IcPaw = ({ className = "w-4 h-4" }) => <svg className={className} fill="currentColor" viewBox="0 0 24 24"><path d="M12 2a2 2 0 100 4 2 2 0 000-4zM6.5 5a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm11 0a1.5 1.5 0 100 3 1.5 1.5 0 000-3zM4 10a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm16 0a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm-8 2c-2.5 0-5 2-5 4 0 2 1.5 3 3 3 .7 0 1.3-.2 2-.2s1.3.2 2 .2c1.5 0 3-1 3-3 0-2-2.5-4-5-4z"/></svg>;
const IcTree = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m-7-9H4m16 0h-1M6.343 6.343l-.707-.707m12.728 12.728l-.707-.707M6.343 17.657l-.707.707M17.657 6.343l-.707.707M12 8a4 4 0 100 8 4 4 0 000-8z"/></svg>;
const IcClock = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>;
const IcGlobe = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"/></svg>;
const IcCalendar = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"/></svg>;

// ── Service icons map ──────────────────────────────────────────────────────────
const SERVICE_SVG: Record<string, React.ReactNode> = {
  boarding: <IcHome />,
  "home-visit": <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z"/></svg>,
  "dog-walking": <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.82m5.84-2.56a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.819m2.562-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/></svg>,
  overnight: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"/></svg>,
  "cat-sitting": <IcPaw />,
  daycare: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"/></svg>,
};

// ── Pet icons map ──────────────────────────────────────────────────────────────
const PET_SVG: Record<string, React.ReactNode> = {
  dog: <IcPaw className="w-3.5 h-3.5" />,
  cat: <IcPaw className="w-3.5 h-3.5" />,
  rabbit: <IcPaw className="w-3.5 h-3.5" />,
  bird: <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z"/></svg>,
  fish: <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>,
  "small-animal": <IcPaw className="w-3.5 h-3.5" />,
};

const MOCK_REVIEWS = [
  { author: "Alice M.", rating: 5, date: "June 2026", text: "Absolutely fantastic! My dog Biscuit was so well looked after. Daily photos and updates gave me real peace of mind." },
  { author: "Tom K.", rating: 5, date: "May 2026", text: "Professional, caring and communicative. I'll definitely be booking again. My two cats were very relaxed when I came to pick them up." },
  { author: "Jess R.", rating: 4, date: "April 2026", text: "Great experience overall. The carer was very patient with my anxious rescue dog. Would recommend!" },
  { author: "David C.", rating: 5, date: "March 2026", text: "Outstanding service. You can really tell they love animals. Worth every cent." },
];

const ALL_PHOTOS = [
  "/dashboard/WechatIMG38.jpg",
  "/dashboard/WechatIMG39.jpg",
  "/dashboard/WechatIMG40.jpg",
  "/dashboard/WechatIMG41.jpg",
  "/dashboard/WechatIMG46.jpg",
  "/dashboard/WechatIMG47.jpg",
  "/dashboard/WechatIMG48.jpg",
  "/dashboard/WechatIMG49.jpg",
];
const STAFF_PHOTOS = [
  "/staff/WechatIMG53.jpg",
  "/staff/WechatIMG54.jpg",
  "/staff/WechatIMG55.jpg",
  "/staff/WechatIMG57.jpg",
  "/staff/WechatIMG58.jpg",
  "/staff/WechatIMG59.jpg",
];

export default function ProviderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const providerIndex = MOCK_PROVIDERS.findIndex((p) => p.id === id);
  const provider = MOCK_PROVIDERS[providerIndex];
  const [selectedService, setSelectedService] = useState(provider?.services[0]);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [petCount, setPetCount] = useState(1);
  const [activePhoto, setActivePhoto] = useState(0);

  if (!provider) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"/></svg>
          <h2 className="text-xl font-semibold text-gray-700">Provider not found</h2>
          <Link href="/dashboard" className="text-amber-500 hover:underline mt-2 block text-sm">← Back to search</Link>
        </div>
      </div>
    );
  }

  const nights = checkIn && checkOut
    ? Math.max(0, Math.round((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000))
    : 0;
  const subtotal = provider.priceFrom * Math.max(nights, 1) * petCount;
  const serviceFee = Math.round(subtotal * 0.1);
  const total = subtotal + serviceFee;

  const providerPhotos = [0, 1, 2, 3].map((i) => ALL_PHOTOS[(providerIndex + i) % ALL_PHOTOS.length]);

  const homeTypeIcon = provider.homeType === "house" ? <IcHome /> : provider.homeType === "apartment" ? <IcBuilding /> : <IcTree />;
  const homeTypeLabel = provider.homeType === "house" ? "House" : provider.homeType === "apartment" ? "Apartment" : "Farm";

  const homeEnv = [
    { icon: homeTypeIcon, label: homeTypeLabel },
    { icon: <IcPaw />, label: `Up to ${provider.maxPets} pets` },
    { icon: <IcTree />, label: provider.hasYard ? "Has a yard" : "No yard" },
    { icon: <IcClock />, label: `Replies in ${provider.responseTime}` },
    { icon: <IcGlobe />, label: provider.languages.join(", ") },
    { icon: <IcCalendar />, label: `From ${new Date(provider.availableFrom).toLocaleDateString("en-AU", { day: "numeric", month: "short" })}` },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Nav */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 text-gray-600 hover:text-amber-500 text-sm font-medium transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
            Back to search
          </Link>
          <Link href="/" className="flex items-center gap-2">
            <IcPaw className="w-5 h-5 text-amber-500" />
            <span className="text-lg font-bold text-amber-500">PetPal AI</span>
          </Link>
          <div className="flex items-center gap-3">
            <button className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/></svg>
              Share
            </button>
            <button className="text-sm text-gray-500 hover:text-red-400 flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
              Save
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── Left column ── */}
          <div className="lg:col-span-2 space-y-8">

            {/* Photo gallery */}
            <div className="relative grid grid-cols-3 gap-2 h-56 sm:h-72 rounded-2xl overflow-hidden">
              <div className="col-span-2 relative cursor-pointer" onClick={() => setActivePhoto((activePhoto + 1) % providerPhotos.length)}>
                <Image src={providerPhotos[activePhoto]} alt="Provider home" fill className="object-cover hover:opacity-95 transition-opacity" sizes="66vw" priority />
              </div>
              <div className="grid grid-rows-2 gap-2">
                {[1, 2].map((offset) => {
                  const idx = (activePhoto + offset) % providerPhotos.length;
                  return (
                    <div key={offset} className="relative cursor-pointer overflow-hidden rounded-lg" onClick={() => setActivePhoto(idx)}>
                      <Image src={providerPhotos[idx]} alt={`Photo ${idx + 1}`} fill className="object-cover hover:opacity-90 transition-opacity" sizes="33vw" />
                    </div>
                  );
                })}
              </div>
              <button
                onClick={() => setActivePhoto((activePhoto + 1) % providerPhotos.length)}
                className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm text-xs font-semibold px-3 py-1.5 rounded-full shadow text-gray-700 hover:bg-white transition-colors"
              >
                {activePhoto + 1} / {providerPhotos.length} photos
              </button>
            </div>

            {/* Header */}
            <div className="flex items-start gap-5">
              <div className="w-20 h-20 rounded-2xl overflow-hidden relative shrink-0">
                <Image src={STAFF_PHOTOS[providerIndex % STAFF_PHOTOS.length]} alt={provider.name} fill className="object-cover object-top" sizes="80px" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl font-bold text-gray-900">{provider.name}</h1>
                  {provider.badge && (
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                      provider.badge === "Superhost" ? "bg-amber-100 text-amber-600" :
                      provider.badge === "Top Rated" ? "bg-yellow-100 text-yellow-700" :
                      "bg-green-100 text-green-600"
                    }`}>{provider.badge}</span>
                  )}
                </div>
                <p className="text-gray-500 text-sm mt-1 flex items-center gap-1"><IcPin /> {provider.location} · {provider.distance} km away</p>
                <div className="flex items-center gap-4 mt-2 flex-wrap">
                  <span className="text-yellow-400">{"★".repeat(Math.floor(provider.rating))}</span>
                  <span className="font-semibold text-gray-800">{provider.rating}</span>
                  <span className="text-gray-400 text-sm">({provider.reviewCount} reviews)</span>
                  <span className="text-gray-300">·</span>
                  <span className="text-sm text-green-600 font-medium flex items-center gap-1"><IcSparkles className="w-3.5 h-3.5" /> AI Score: {provider.aiScore}/100</span>
                </div>
              </div>
            </div>

            {/* AI Match summary */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-100">
              <div className="flex items-center gap-2 mb-3">
                <IcSparkles className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-blue-800">Why AI recommends {provider.name.split(" ")[0]}</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {provider.aiTags.map((tag) => (
                  <span key={tag} className="text-base bg-white text-blue-700 border border-blue-200 px-4 py-1.5 rounded-full font-medium flex items-center gap-1.5">
                    <IcCheck className="w-3.5 h-3.5" /> {tag}
                  </span>
                ))}
              </div>
              <div className="mt-3 grid grid-cols-3 gap-3 text-center">
                <div className="bg-white rounded-xl p-3">
                  <p className="text-xl font-bold text-blue-600">{provider.aiScore}%</p>
                  <p className="text-xs text-gray-500">Match score</p>
                </div>
                <div className="bg-white rounded-xl p-3">
                  <p className="text-xl font-bold text-blue-600">{provider.repeatClients}</p>
                  <p className="text-xs text-gray-500">Repeat clients</p>
                </div>
                <div className="bg-white rounded-xl p-3">
                  <p className="text-xl font-bold text-blue-600">{provider.yearsExp}yr</p>
                  <p className="text-xs text-gray-500">Experience</p>
                </div>
              </div>
            </div>

            {/* About */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-3">About {provider.name.split(" ")[0]}</h2>
              <p className="text-gray-600 leading-relaxed">{provider.bio}</p>
            </div>

            {/* Services */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-3">Services offered</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {provider.services.map((s) => (
                  <div key={s} className="border border-gray-100 rounded-xl p-3 flex items-center gap-2.5 bg-white">
                    <span className="text-amber-500">{SERVICE_SVG[s] ?? <IcPaw />}</span>
                    <span className="text-sm font-medium text-gray-700">{SERVICE_LABELS[s]}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pet types */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-3">Pets accepted</h2>
              <div className="flex flex-wrap gap-2">
                {provider.petTypes.map((p) => (
                  <span key={p} className="flex items-center gap-1.5 bg-amber-50 text-amber-700 border border-amber-100 px-3 py-1.5 rounded-full text-sm font-medium">
                    {PET_SVG[p] ?? <IcPaw className="w-3.5 h-3.5" />} {PET_LABELS[p]}
                  </span>
                ))}
              </div>
            </div>

            {/* Home info */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-3">Home & environment</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {homeEnv.map((item) => (
                  <div key={item.label} className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="text-gray-400 shrink-0">{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Trust badges */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-3">Trust & safety</h2>
              <div className="flex flex-wrap gap-3">
                {provider.verified && (
                  <span className="flex items-center gap-2 bg-blue-50 text-blue-700 border border-blue-100 px-4 py-2 rounded-xl text-sm font-medium">
                    <IcCheck className="w-4 h-4" /> Identity Verified
                  </span>
                )}
                {provider.hasBackgroundCheck && (
                  <span className="flex items-center gap-2 bg-green-50 text-green-700 border border-green-100 px-4 py-2 rounded-xl text-sm font-medium">
                    <IcShield /> Police Check Done
                  </span>
                )}
                <span className="flex items-center gap-2 bg-purple-50 text-purple-700 border border-purple-100 px-4 py-2 rounded-xl text-sm font-medium">
                  <IcHeart /> Pet First Aid Certified
                </span>
                <span className="flex items-center gap-2 bg-amber-50 text-amber-700 border border-amber-100 px-4 py-2 rounded-xl text-sm font-medium">
                  <IcCamera /> Daily Photo Updates
                </span>
              </div>
            </div>

            {/* Reviews */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">
                  Reviews <span className="text-gray-400 font-normal text-base">({provider.reviewCount})</span>
                </h2>
                <div className="flex items-center gap-1.5">
                  <span className="text-yellow-400">★</span>
                  <span className="font-bold text-gray-900">{provider.rating}</span>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-5 grid grid-cols-2 sm:grid-cols-5 gap-4 text-center">
                {[
                  { label: "Cleanliness", score: 4.9 },
                  { label: "Communication", score: 5.0 },
                  { label: "Reliability", score: 4.8 },
                  { label: "Pet happiness", score: 4.9 },
                  { label: "Value", score: 4.7 },
                ].map((r) => (
                  <div key={r.label}>
                    <p className="text-xl font-bold text-amber-500">{r.score}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{r.label}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                {MOCK_REVIEWS.map((r) => (
                  <div key={r.author} className="bg-white rounded-2xl border border-gray-100 p-5">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 font-bold text-sm flex items-center justify-center">
                          {r.author[0]}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-800">{r.author}</p>
                          <p className="text-xs text-gray-400">{r.date}</p>
                        </div>
                      </div>
                      <div className="text-yellow-400 text-sm">{"★".repeat(r.rating)}</div>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{r.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right column: Booking Card ── */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6">
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-2xl font-bold text-gray-900">${provider.priceFrom}</span>
                  <span className="text-gray-400 text-sm">/night</span>
                </div>
                <div className="flex items-center gap-1 mb-5">
                  <span className="text-yellow-400 text-sm">★</span>
                  <span className="text-sm font-semibold">{provider.rating}</span>
                  <span className="text-gray-400 text-sm">· {provider.reviewCount} reviews</span>
                </div>

                {/* Service selector */}
                <div className="mb-4">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Service</label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {provider.services.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSelectedService(s)}
                        className={`text-xs px-2 py-2 rounded-xl border transition-all text-left flex items-center gap-1.5 ${
                          selectedService === s
                            ? "bg-amber-500 text-white border-amber-500"
                            : "border-gray-200 text-gray-600 hover:border-amber-300"
                        }`}
                      >
                        <span className={selectedService === s ? "text-white" : "text-amber-500"}>{SERVICE_SVG[s] ?? <IcPaw />}</span>
                        {SERVICE_LABELS[s]}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Date picker */}
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Check-in</label>
                    <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Check-out</label>
                    <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent" />
                  </div>
                </div>

                {/* Pet count */}
                <div className="mb-5">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Number of pets</label>
                  <div className="flex items-center gap-3">
                    <button onClick={() => setPetCount(Math.max(1, petCount - 1))} className="w-8 h-8 rounded-full border border-gray-200 text-gray-700 hover:border-amber-400 hover:text-amber-500 font-bold transition-colors">−</button>
                    <span className="text-lg font-semibold text-gray-900 w-8 text-center">{petCount}</span>
                    <button onClick={() => setPetCount(Math.min(provider.maxPets, petCount + 1))} className="w-8 h-8 rounded-full border border-gray-200 text-gray-700 hover:border-amber-400 hover:text-amber-500 font-bold transition-colors">+</button>
                    <span className="text-xs text-gray-400">max {provider.maxPets}</span>
                  </div>
                </div>

                {/* Price breakdown */}
                {nights > 0 && (
                  <div className="border-t border-gray-100 pt-4 mb-4 space-y-2 text-sm">
                    <div className="flex justify-between text-gray-600">
                      <span>${provider.priceFrom} × {nights} night{nights > 1 ? "s" : ""} × {petCount} pet{petCount > 1 ? "s" : ""}</span>
                      <span>${subtotal}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Service fee (10%)</span>
                      <span>${serviceFee}</span>
                    </div>
                    <div className="flex justify-between font-bold text-gray-900 border-t border-gray-100 pt-2">
                      <span>Total</span>
                      <span>${total} AUD</span>
                    </div>
                  </div>
                )}

                <button className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3.5 rounded-xl transition-colors text-sm">
                  {checkIn && checkOut ? "Request to Book" : "Check Availability"}
                </button>
                <p className="text-center text-xs text-gray-400 mt-3">You won&apos;t be charged yet</p>

                <button className="w-full mt-3 border border-gray-200 hover:border-amber-400 hover:text-amber-500 text-gray-700 font-medium py-3 rounded-xl transition-colors text-sm flex items-center justify-center gap-2">
                  <IcChat /> Message {provider.name.split(" ")[0]}
                </button>
              </div>

              {/* Quick stats */}
              <div className="mt-4 bg-white rounded-2xl border border-gray-100 p-4 grid grid-cols-3 gap-3 text-center text-xs text-gray-500">
                <div>
                  <p className="text-base font-bold text-gray-800">{provider.repeatClients}</p>
                  <p>Repeat clients</p>
                </div>
                <div>
                  <p className="text-base font-bold text-gray-800">{provider.responseTime}</p>
                  <p>Response</p>
                </div>
                <div>
                  <p className="text-base font-bold text-gray-800">{provider.yearsExp}yrs</p>
                  <p>Experience</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
