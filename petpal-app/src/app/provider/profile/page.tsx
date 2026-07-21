"use client";

import { useState } from "react";
import ProviderNav from "@/components/ProviderNav";
import { PROVIDER_PROFILE } from "@/lib/providerMockData";
import { PET_ICONS, PET_LABELS, type PetType } from "@/lib/mockData";

// Build a simple calendar for the current month
function buildCalendar(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  return { firstDay, daysInMonth };
}

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const DAYS = ["Su","Mo","Tu","We","Th","Fr","Sa"];

function AvailabilityCalendar({ unavailable, onToggle }: {
  unavailable: string[];
  onToggle: (date: string) => void;
}) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const { firstDay, daysInMonth } = buildCalendar(viewYear, viewMonth);
  const cells: (number | null)[] = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];

  function dateStr(day: number) {
    return `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  }

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); }
    else setViewMonth((m) => m - 1);
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); }
    else setViewMonth((m) => m + 1);
  }

  const todayStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,"0")}-${String(today.getDate()).padStart(2,"0")}`;

  return (
    <div className="select-none">
      {/* Month nav */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 transition-colors">‹</button>
        <span className="font-semibold text-gray-800">{MONTHS[viewMonth]} {viewYear}</span>
        <button onClick={nextMonth} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 transition-colors">›</button>
      </div>

      {/* Day labels */}
      <div className="grid grid-cols-7 mb-1">
        {DAYS.map((d) => (
          <div key={d} className="text-center text-xs text-gray-400 py-1 font-medium">{d}</div>
        ))}
      </div>

      {/* Cells */}
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          if (!day) return <div key={i} />;
          const ds = dateStr(day);
          const isUnavail = unavailable.includes(ds);
          const isToday = ds === todayStr;
          const isPast = ds < todayStr;
          return (
            <button
              key={i}
              onClick={() => !isPast && onToggle(ds)}
              disabled={isPast}
              className={`h-9 w-full rounded-lg text-sm font-medium transition-all ${
                isPast
                  ? "text-gray-200 cursor-not-allowed"
                  : isUnavail
                  ? "bg-red-400 text-white hover:bg-red-500"
                  : isToday
                  ? "bg-amber-500 text-white"
                  : "hover:bg-amber-100 text-gray-700 hover:text-amber-600"
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-amber-500 inline-block" /> Today</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-red-400 inline-block" /> Unavailable</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-white border border-gray-300 inline-block" /> Available</span>
      </div>
    </div>
  );
}

export default function ProviderProfilePage() {
  const [profile, setProfile] = useState({ ...PROVIDER_PROFILE });
  const [services, setServices] = useState([...PROVIDER_PROFILE.services]);
  const [sizeSurcharge, setSizeSurcharge] = useState({ ...PROVIDER_PROFILE.sizeSurcharge });
  const [holidaySurcharge, setHolidaySurcharge] = useState(PROVIDER_PROFILE.holidaySurcharge);
  const [addOns, setAddOns] = useState([...PROVIDER_PROFILE.addOns]);
  const [petTypes, setPetTypes] = useState<string[]>([...PROVIDER_PROFILE.petTypes]);
  const [unavailable, setUnavailable] = useState<string[]>([...PROVIDER_PROFILE.unavailableDates]);
  const [saved, setSaved] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("about");

  function toggleUnavailable(date: string) {
    setUnavailable((prev) =>
      prev.includes(date) ? prev.filter((d) => d !== date) : [...prev, date]
    );
    setSaved(false);
  }

  function togglePet(pet: string) {
    setPetTypes((prev) =>
      prev.includes(pet) ? prev.filter((p) => p !== pet) : [...prev, pet]
    );
    setSaved(false);
  }

  function toggleAddOn(i: number) {
    const updated = [...addOns];
    updated[i] = { ...updated[i], enabled: !updated[i].enabled };
    setAddOns(updated);
    setSaved(false);
  }

  function updateAddOnPrice(i: number, price: number) {
    const updated = [...addOns];
    updated[i] = { ...updated[i], price };
    setAddOns(updated);
    setSaved(false);
  }

  function toggleService(i: number) {
    const updated = [...services];
    updated[i] = { ...updated[i], enabled: !updated[i].enabled };
    setServices(updated);
    setSaved(false);
  }

  function updatePrice(i: number, price: number) {
    const updated = [...services];
    updated[i] = { ...updated[i], price };
    setServices(updated);
    setSaved(false);
  }

  const SECTIONS = [
    { key: "about", label: "About Me", icon: "👤" },
    { key: "services", label: "Services & Pricing", icon: "💰" },
    { key: "pets", label: "Pet Types", icon: "🐾" },
    { key: "availability", label: "Availability", icon: "📅" },
    { key: "verification", label: "Verification", icon: "🛡️" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <ProviderNav />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
            <p className="text-gray-500 text-sm mt-1">Manage how pet owners see you</p>
          </div>
          <button
            onClick={() => setSaved(true)}
            className="bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors flex items-center gap-2"
          >
            {saved ? "✓ Saved!" : "Save Changes"}
          </button>
        </div>

        {/* Profile header card */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6 flex items-center gap-5">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-rose-400 flex items-center justify-center text-white text-2xl font-bold">
              ER
            </div>
            <button className="absolute -bottom-1 -right-1 bg-amber-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shadow hover:bg-amber-600 transition-colors">
              +
            </button>
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900">{profile.name}</h2>
            <p className="text-sm text-gray-500 mt-0.5">{profile.location}</p>
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">✅ Verified</span>
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">🛡️ Police Check</span>
              <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-medium">⭐ 4.97 · 143 reviews</span>
            </div>
          </div>
          <div className="hidden sm:block text-right">
            <p className="text-xs text-gray-400 mb-1">Profile strength</p>
            <div className="flex items-center gap-2">
              <div className="w-24 bg-gray-100 rounded-full h-1.5">
                <div className="bg-green-500 h-1.5 rounded-full" style={{ width: "85%" }} />
              </div>
              <span className="text-sm font-bold text-green-600">85%</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar nav */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 p-2">
              {SECTIONS.map((s) => (
                <button
                  key={s.key}
                  onClick={() => setActiveSection(s.key)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left ${
                    activeSection === s.key
                      ? "bg-amber-50 text-amber-600"
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                  }`}
                >
                  <span>{s.icon}</span>
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">

            {/* About Me */}
            {activeSection === "about" && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
                <h3 className="font-semibold text-gray-900 text-lg">About Me</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Full Name</label>
                    <input
                      value={profile.name}
                      onChange={(e) => { setProfile({ ...profile, name: e.target.value }); setSaved(false); }}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Location</label>
                    <input
                      value={profile.location}
                      onChange={(e) => { setProfile({ ...profile, location: e.target.value }); setSaved(false); }}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Phone</label>
                    <input
                      value={profile.phone}
                      onChange={(e) => { setProfile({ ...profile, phone: e.target.value }); setSaved(false); }}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Email</label>
                    <input
                      value={profile.email}
                      onChange={(e) => { setProfile({ ...profile, email: e.target.value }); setSaved(false); }}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Bio</label>
                  <textarea
                    rows={4}
                    value={profile.bio}
                    onChange={(e) => { setProfile({ ...profile, bio: e.target.value }); setSaved(false); }}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 resize-none focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-400 mt-1">{profile.bio.length}/500 characters</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Home Type</label>
                    <select
                      value={profile.homeType}
                      onChange={(e) => { setProfile({ ...profile, homeType: e.target.value as "house"|"apartment"|"farm" }); setSaved(false); }}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
                    >
                      <option value="house">🏠 House</option>
                      <option value="apartment">🏢 Apartment</option>
                      <option value="farm">🏕️ Farm</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Max Pets</label>
                    <input
                      type="number"
                      min={1}
                      max={10}
                      value={profile.maxPets}
                      onChange={(e) => { setProfile({ ...profile, maxPets: Number(e.target.value) }); setSaved(false); }}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Service Radius (km)</label>
                    <input
                      type="number"
                      min={1}
                      max={50}
                      value={profile.serviceRadius}
                      onChange={(e) => { setProfile({ ...profile, serviceRadius: Number(e.target.value) }); setSaved(false); }}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={profile.hasYard}
                      onChange={(e) => { setProfile({ ...profile, hasYard: e.target.checked }); setSaved(false); }}
                      className="w-4 h-4 rounded accent-amber-500"
                    />
                    <span className="text-sm text-gray-700 font-medium">🌳 My property has a secure yard</span>
                  </label>
                </div>
              </div>
            )}

            {/* Services & Pricing */}
            {activeSection === "services" && (
              <div className="space-y-5">

                {/* Base service prices */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <h3 className="font-semibold text-gray-900 text-lg mb-1">Services & Base Prices</h3>
                  <p className="text-sm text-gray-400 mb-5">Toggle services on/off and set your base price per unit.</p>
                  <div className="space-y-3">
                    {services.map((svc, i) => (
                      <div
                        key={svc.type}
                        className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                          svc.enabled ? "border-amber-200 bg-amber-50" : "border-gray-100 bg-gray-50 opacity-60"
                        }`}
                      >
                        <button
                          onClick={() => toggleService(i)}
                          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                            svc.enabled ? "bg-amber-500" : "bg-gray-300"
                          }`}
                        >
                          <span className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow ring-0 transition-transform ${svc.enabled ? "translate-x-5" : "translate-x-0"}`} />
                        </button>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-800">{svc.name}</p>
                          <p className="text-xs text-gray-400">per {svc.unit}</p>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm text-gray-500">$</span>
                          <input
                            type="number" min={10} max={500} value={svc.price}
                            onChange={(e) => updatePrice(i, Number(e.target.value))}
                            disabled={!svc.enabled}
                            className="w-20 border border-gray-200 rounded-lg px-2 py-1.5 text-sm text-right font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-400 disabled:opacity-40 bg-white"
                          />
                          <span className="text-xs text-gray-400">AUD</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Size surcharge */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <h3 className="font-semibold text-gray-900 text-base mb-1">Pet Size Surcharge</h3>
                  <p className="text-sm text-gray-400 mb-5">Extra charge added on top of base price based on pet size.</p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50">
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-800">Small (under 10 kg)</p>
                        <p className="text-xs text-gray-400">Base price — no surcharge</p>
                      </div>
                      <span className="text-sm font-semibold text-gray-400">+$0</span>
                    </div>
                    {(["medium", "large"] as const).map((size) => (
                      <div key={size} className="flex items-center gap-4 p-4 rounded-xl border border-amber-100 bg-amber-50">
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-800 capitalize">{size} {size === "medium" ? "(10–25 kg)" : "(25 kg+)"}</p>
                          <p className="text-xs text-gray-400">Added per night / visit</p>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm text-gray-500">+$</span>
                          <input
                            type="number" min={0} max={100}
                            value={sizeSurcharge[size]}
                            onChange={(e) => { setSizeSurcharge({ ...sizeSurcharge, [size]: Number(e.target.value) }); setSaved(false); }}
                            className="w-20 border border-gray-200 rounded-lg px-2 py-1.5 text-sm text-right font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
                          />
                          <span className="text-xs text-gray-400">AUD</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Holiday surcharge */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-gray-900 text-base">Holiday Surcharge</h3>
                    <button
                      onClick={() => { setHolidaySurcharge(holidaySurcharge === 0 ? 20 : 0); setSaved(false); }}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${holidaySurcharge > 0 ? "bg-amber-500" : "bg-gray-300"}`}
                    >
                      <span className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow ring-0 transition-transform ${holidaySurcharge > 0 ? "translate-x-5" : "translate-x-0"}`} />
                    </button>
                  </div>
                  <p className="text-sm text-gray-400 mb-4">Apply a percentage surcharge during public holidays and peak periods.</p>
                  {holidaySurcharge > 0 && (
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-600">Surcharge rate</span>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number" min={5} max={100} step={5}
                          value={holidaySurcharge}
                          onChange={(e) => { setHolidaySurcharge(Number(e.target.value)); setSaved(false); }}
                          className="w-20 border border-gray-200 rounded-lg px-2 py-1.5 text-sm text-right font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
                        />
                        <span className="text-sm text-gray-500">%</span>
                      </div>
                      <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-full">e.g. $55 → ${Math.round(55 * (1 + holidaySurcharge / 100))}/night on holidays</span>
                    </div>
                  )}
                </div>

                {/* Add-on services */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <h3 className="font-semibold text-gray-900 text-base mb-1">Add-on Services</h3>
                  <p className="text-sm text-gray-400 mb-5">Optional extras pet owners can add to their booking.</p>
                  <div className="space-y-3">
                    {addOns.map((addon, i) => (
                      <div
                        key={addon.type}
                        className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                          addon.enabled ? "border-amber-200 bg-amber-50" : "border-gray-100 bg-gray-50 opacity-60"
                        }`}
                      >
                        <button
                          onClick={() => toggleAddOn(i)}
                          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${addon.enabled ? "bg-amber-500" : "bg-gray-300"}`}
                        >
                          <span className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow ring-0 transition-transform ${addon.enabled ? "translate-x-5" : "translate-x-0"}`} />
                        </button>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-800">{addon.name}</p>
                          <p className="text-xs text-gray-400">per booking</p>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm text-gray-500">$</span>
                          <input
                            type="number" min={5} max={200}
                            value={addon.price}
                            onChange={(e) => updateAddOnPrice(i, Number(e.target.value))}
                            disabled={!addon.enabled}
                            className="w-20 border border-gray-200 rounded-lg px-2 py-1.5 text-sm text-right font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-400 disabled:opacity-40 bg-white"
                          />
                          <span className="text-xs text-gray-400">AUD</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* Pet Types */}
            {activeSection === "pets" && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h3 className="font-semibold text-gray-900 text-lg mb-2">Pet Types</h3>
                <p className="text-sm text-gray-400 mb-6">Select which types of pets you are comfortable caring for.</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {(Object.keys(PET_LABELS) as PetType[]).map((p) => {
                    const selected = petTypes.includes(p);
                    return (
                      <button
                        key={p}
                        onClick={() => togglePet(p)}
                        className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left ${
                          selected
                            ? "border-amber-400 bg-amber-50 text-amber-700"
                            : "border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-300"
                        }`}
                      >
                        <span className="text-2xl">{PET_ICONS[p]}</span>
                        <span className="text-sm font-medium">{PET_LABELS[p]}</span>
                        {selected && <span className="ml-auto text-amber-500 text-xs">✓</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Availability */}
            {activeSection === "availability" && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h3 className="font-semibold text-gray-900 text-lg mb-1">Availability Calendar</h3>
                <p className="text-sm text-gray-400 mb-6">Click dates to mark them as unavailable (shown in red). Available dates are open for booking.</p>
                <AvailabilityCalendar unavailable={unavailable} onToggle={toggleUnavailable} />
                {unavailable.length > 0 && (
                  <div className="mt-5 border-t border-gray-100 pt-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Blocked dates ({unavailable.length})</p>
                    <div className="flex flex-wrap gap-2">
                      {unavailable.sort().map((d) => (
                        <span
                          key={d}
                          onClick={() => toggleUnavailable(d)}
                          className="text-xs bg-red-100 text-red-600 px-2.5 py-1 rounded-full cursor-pointer hover:bg-red-200 transition-colors flex items-center gap-1"
                        >
                          {d} <span>×</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Verification */}
            {activeSection === "verification" && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6">
                <h3 className="font-semibold text-gray-900 text-lg">Verification & Certificates</h3>

                {/* Existing certs */}
                <div className="space-y-3">
                  {PROVIDER_PROFILE.certificates.map((cert) => (
                    <div key={cert.name} className="flex items-center gap-4 p-4 bg-green-50 rounded-xl border border-green-100">
                      <span className="text-2xl">📜</span>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-800">{cert.name}</p>
                        <p className="text-xs text-gray-400">{cert.issuer} · {cert.year}</p>
                      </div>
                      <span className="text-xs bg-green-100 text-green-700 border border-green-200 px-2.5 py-1 rounded-full font-medium">✓ Verified</span>
                    </div>
                  ))}
                </div>

                {/* Upload zone */}
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-amber-300 transition-colors cursor-pointer group">
                  <div className="text-3xl mb-2">📎</div>
                  <p className="text-sm font-medium text-gray-700 group-hover:text-amber-500 transition-colors">Upload new certificate</p>
                  <p className="text-xs text-gray-400 mt-1">PDF, JPG or PNG up to 10MB</p>
                </div>

                {/* Identity check status */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { icon: "🪪", label: "Identity Document", status: "verified" },
                    { icon: "🛡️", label: "Police Check", status: "verified" },
                    { icon: "💊", label: "First Aid Cert", status: "verified" },
                    { icon: "🏠", label: "Home Inspection Photos", status: "pending" },
                  ].map((item) => (
                    <div key={item.label} className={`flex items-center gap-3 p-4 rounded-xl border ${
                      item.status === "verified"
                        ? "border-green-100 bg-green-50"
                        : "border-amber-100 bg-amber-50"
                    }`}>
                      <span className="text-xl">{item.icon}</span>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">{item.label}</p>
                      </div>
                      {item.status === "verified" ? (
                        <span className="text-xs text-green-600 font-semibold">✓ Done</span>
                      ) : (
                        <button className="text-xs bg-amber-100 text-amber-700 px-3 py-1 rounded-full font-medium hover:bg-amber-200 transition-colors">
                          Upload
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
