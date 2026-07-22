"use client";

import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import { useState, useRef, useEffect } from "react";

function IcSparkles({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
    </svg>
  );
}

const PETS = [
  { key: "dog", label: "Dog", emoji: "🐕" },
  { key: "cat", label: "Cat", emoji: "🐈" },
  { key: "rabbit", label: "Rabbit", emoji: "🐇" },
  { key: "bird", label: "Bird", emoji: "🦜" },
];

const MATCHES = [
  { name: "Emma R.", initials: "ER", score: 98, badge: "Superhost", price: 55, location: "Fitzroy", color: "bg-amber-500" },
  { name: "James L.", initials: "JL", score: 94, badge: "Top Rated", price: 48, location: "Collingwood", color: "bg-rose-400" },
  { name: "Mia C.", initials: "MC", score: 91, badge: "Verified", price: 42, location: "Richmond", color: "bg-blue-400" },
];

const SCAN_STEPS = [
  { at: 15, text: "Checking availability" },
  { at: 38, text: "Matching pet personality" },
  { at: 62, text: "Scoring home environments" },
  { at: 84, text: "Ranking by AI trust score" },
];

function AIMatcherCard() {
  const [step, setStep] = useState<"select" | "scanning" | "results">("select");
  const [petType, setPetType] = useState<string | null>(null);
  const [petSize, setPetSize] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [scores, setScores] = useState([0, 0, 0]);
  const cardRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: y * -14, y: x * 14 });
  }

  function handleMouseLeave() {
    setTilt({ x: 0, y: 0 });
  }

  function startScan() {
    if (!petType) return;
    setStep("scanning");
    setProgress(0);
    let p = 0;
    intervalRef.current = setInterval(() => {
      p += Math.random() * 12 + 5;
      if (p >= 100) {
        p = 100;
        if (intervalRef.current) clearInterval(intervalRef.current);
        setTimeout(() => {
          setStep("results");
          animateScores();
        }, 400);
      }
      setProgress(Math.min(p, 100));
    }, 110);
  }

  function animateScores() {
    const targets = MATCHES.map((m) => m.score);
    const start = Date.now();
    const duration = 900;
    function tick() {
      const elapsed = Date.now() - start;
      const t = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      setScores(targets.map((target) => Math.round(target * ease)));
      if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  function reset() {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setStep("select");
    setPetType(null);
    setPetSize(null);
    setProgress(0);
    setScores([0, 0, 0]);
  }

  useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current); }, []);

  const isIdle = tilt.x === 0 && tilt.y === 0;

  return (
    <div className="relative" style={{ perspective: "1200px" }}>
      {/* Ambient glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-72 h-72 rounded-full bg-amber-200/30 blur-3xl" />
      </div>

      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="card-3d relative bg-white rounded-3xl border border-amber-100/80 p-6 w-full max-w-sm mx-auto animate-float"
        style={{
          transform: `perspective(1200px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transition: isIdle ? "transform 0.6s ease" : "transform 0.08s ease",
          boxShadow: "0 30px 80px -10px rgba(245,158,11,0.2), 0 10px 30px -5px rgba(0,0,0,0.08)",
        }}
      >
        {/* Inner gradient */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-amber-50/60 via-white to-white pointer-events-none" />

        {/* Top badge */}
        <div className="relative flex justify-center mb-4">
          <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-400 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-md shadow-amber-200">
            <IcSparkles className="w-3.5 h-3.5" />
            AI Matching Engine
          </span>
        </div>

        {/* ── Step 1: Select ── */}
        {step === "select" && (
          <div className="relative">
            <h3 className="text-center font-bold text-gray-900 text-lg mb-0.5">What&apos;s your pet?</h3>
            <p className="text-center text-gray-400 text-xs mb-5">We&apos;ll find your perfect carer in seconds</p>

            <div className="grid grid-cols-4 gap-2 mb-5">
              {PETS.map((p) => (
                <button
                  key={p.key}
                  onClick={() => setPetType(p.key)}
                  className={`flex flex-col items-center gap-1 py-3 rounded-2xl border-2 transition-all duration-200 text-xs font-medium select-none ${
                    petType === p.key
                      ? "border-amber-400 bg-amber-50 text-amber-700 scale-105 shadow-lg shadow-amber-100"
                      : "border-gray-100 text-gray-500 hover:border-amber-200 hover:bg-amber-50/40"
                  }`}
                >
                  <span className="text-2xl">{p.emoji}</span>
                  {p.label}
                </button>
              ))}
            </div>

            <div className="mb-5">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Size</p>
              <div className="grid grid-cols-3 gap-2">
                {["Small", "Medium", "Large"].map((s) => (
                  <button
                    key={s}
                    onClick={() => setPetSize(s.toLowerCase())}
                    className={`py-2 rounded-xl border text-xs font-semibold transition-all duration-200 ${
                      petSize === s.toLowerCase()
                        ? "border-amber-500 bg-amber-500 text-white shadow-md shadow-amber-200"
                        : "border-gray-200 text-gray-500 hover:border-amber-300 hover:text-amber-600"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={startScan}
              disabled={!petType}
              className="w-full bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-600 hover:to-amber-500 disabled:from-gray-200 disabled:to-gray-200 disabled:text-gray-400 text-white font-bold py-3.5 rounded-2xl transition-all text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-200 hover:shadow-amber-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              <IcSparkles className="w-4 h-4" />
              Find My Perfect Match
            </button>
            {!petType && (
              <p className="text-center text-xs text-gray-300 mt-2">Select a pet type to continue</p>
            )}
          </div>
        )}

        {/* ── Step 2: Scanning ── */}
        {step === "scanning" && (
          <div className="relative py-2">
            <div className="flex justify-center mb-5 relative">
              <div className="w-20 h-20 relative">
                <div className="absolute inset-0 rounded-full border-4 border-amber-100" />
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-amber-400 animate-spin-slow" />
                <div className="absolute inset-2 rounded-full bg-amber-50 flex items-center justify-center">
                  <IcSparkles className="w-7 h-7 text-amber-500" />
                </div>
                <div className="absolute inset-0 rounded-full border-2 border-amber-300 animate-pulse-ring" />
              </div>
            </div>

            <h3 className="text-center font-bold text-gray-900 mb-1">AI is scanning…</h3>
            <p className="text-center text-gray-400 text-xs mb-4">Analysing 247 verified providers near you</p>

            <div className="space-y-2 mb-5 min-h-[88px]">
              {SCAN_STEPS.map((s) =>
                progress >= s.at ? (
                  <div key={s.text} className="flex items-center gap-2 text-xs text-gray-500 animate-fade-slide-up">
                    <span className="w-4 h-4 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0 text-[10px] font-bold">✓</span>
                    {s.text}
                  </div>
                ) : null
              )}
            </div>

            <div className="bg-gray-100 rounded-full h-2 overflow-hidden mb-1.5">
              <div
                className="bg-gradient-to-r from-amber-400 to-amber-500 h-2 rounded-full transition-all duration-150"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-center text-xs font-bold text-amber-500 tabular-nums">{Math.round(progress)}%</p>
          </div>
        )}

        {/* ── Step 3: Results ── */}
        {step === "results" && (
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-bold text-gray-900 flex items-center gap-1.5">
                  Top Matches <IcSparkles className="w-3.5 h-3.5 text-amber-500" />
                </h3>
                <p className="text-xs text-gray-400">247 providers scanned</p>
              </div>
              <button onClick={reset} className="text-xs text-amber-500 hover:text-amber-600 font-semibold transition-colors">
                ↩ Try again
              </button>
            </div>

            <div className="space-y-2.5">
              {MATCHES.map((m, i) => (
                <Link
                  href="/dashboard"
                  key={m.name}
                  className={`relative flex items-center gap-3 p-3 rounded-2xl border transition-all hover:scale-[1.02] cursor-pointer animate-fade-slide-up ${
                    i === 0
                      ? "border-amber-300 bg-gradient-to-r from-amber-50 to-white animate-score-glow"
                      : "border-gray-100 hover:border-amber-200 bg-white"
                  }`}
                  style={{ animationDelay: `${i * 120}ms` }}
                >
                  {i === 0 && (
                    <span className="absolute -top-2 left-3 text-[10px] bg-amber-500 text-white px-2 py-0.5 rounded-full font-bold shadow-sm">
                      Best Match
                    </span>
                  )}
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0 ${m.color}`}>
                    {m.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <p className="text-sm font-semibold text-gray-900">{m.name}</p>
                      <span className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded-full font-medium leading-none">{m.badge}</span>
                    </div>
                    <p className="text-xs text-gray-400">{m.location} · ${m.price}/night</p>
                  </div>
                  <div className={`text-base font-extrabold tabular-nums ${i === 0 ? "text-amber-500" : "text-gray-400"}`}>
                    {scores[i]}%
                  </div>
                </Link>
              ))}
            </div>

            <Link
              href="/dashboard"
              className="mt-4 w-full bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-600 hover:to-amber-500 text-white font-bold py-3 rounded-2xl transition-all text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-100 hover:scale-[1.01]"
            >
              See All Matches →
            </Link>
          </div>
        )}
      </div>

      {/* Floating stat chips */}
      <div className="absolute -left-6 top-1/4 bg-white rounded-2xl shadow-lg border border-gray-100 px-3 py-2 text-xs font-semibold text-gray-700 animate-float-slow pointer-events-none hidden lg:flex items-center gap-1.5" style={{ animationDelay: "0.5s" }}>
        <span className="text-yellow-400">★</span> 4.9 avg rating
      </div>
      <div className="absolute -right-4 top-16 bg-white rounded-2xl shadow-lg border border-gray-100 px-3 py-2 text-xs font-semibold text-gray-700 animate-float pointer-events-none hidden lg:flex items-center gap-1.5" style={{ animationDelay: "1.2s" }}>
        <span className="w-2 h-2 rounded-full bg-green-400 inline-block" /> 247 providers
      </div>
      <div className="absolute -right-2 bottom-20 bg-white rounded-2xl shadow-lg border border-gray-100 px-3 py-2 text-xs font-semibold text-gray-700 animate-float-slow pointer-events-none hidden lg:flex items-center gap-1.5" style={{ animationDelay: "2s" }}>
        🔒 Verified & insured
      </div>
    </div>
  );
}

// ── Static page content ───────────────────────────────────────────────────────

const services = [
  { title: "Home Boarding", desc: "Your pet stays at a verified provider's home in a warm, family environment." },
  { title: "Home Visits", desc: "A carer visits your home to feed, play and check on your pet." },
  { title: "Dog Walking", desc: "Daily walks by experienced, GPS-tracked local walkers." },
  { title: "Overnight Care", desc: "A carer stays at your home so your pet sleeps in familiar surroundings." },
  { title: "Cat Sitting", desc: "Specialist in-home care for cats who prefer their own territory." },
  { title: "AI Matching", desc: "Our AI finds the perfect provider based on your pet's unique profile." },
];

const steps = [
  { num: "01", title: "Create Your Pet Profile", desc: "Add breed, habits, health records and personality so carers know exactly what to expect." },
  { num: "02", title: "AI Finds the Best Match", desc: "Our algorithm scores every nearby provider and surfaces the top picks for you." },
  { num: "03", title: "Book & Pay Securely", desc: "Confirm in seconds, pay online, and receive instant confirmation." },
  { num: "04", title: "Relax & Track", desc: "Get real-time updates and AI-powered health reminders during the stay." },
];

const testimonials = [
  { name: "Sarah L.", pet: "Golden Retriever owner", text: "The AI matched us with the perfect carer. Buddy has never been happier away from home." },
  { name: "James T.", pet: "Two cats, one anxious", text: "Pet Care AI understood my anxious cat's needs instantly. Outstanding experience." },
  { name: "Mei W.", pet: "Rabbit owner", text: "Hard to find rabbit-friendly carers, but Pet Care AI found three great options in minutes." },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative bg-gradient-to-br from-amber-50 via-white to-amber-50/30 overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-100/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-amber-50/60 rounded-full blur-2xl translate-y-1/3 -translate-x-1/4 pointer-events-none" />
        {/* Dot grid */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{ backgroundImage: "radial-gradient(circle, #92400e 1px, transparent 1px)", backgroundSize: "28px 28px" }}
        />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Left: copy */}
            <div>
              <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-6 shadow-sm">
                <IcSparkles className="w-3.5 h-3.5" />
                AI-Powered Pet Care Matching
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight mb-6">
                Find Your Pet&apos;s{" "}
                <span className="shimmer-text">Perfect Carer</span>{" "}
                with AI
              </h1>
              <p className="text-lg text-gray-500 mb-8 leading-relaxed">
                Our AI reads your pet&apos;s personality, needs, and breed — then instantly scores hundreds of verified local carers to surface the one that&apos;s genuinely right for them.
              </p>

              {/* Trust bar */}
              <div className="flex flex-wrap gap-5 mb-8">
                {[
                  { icon: "✓", text: "247 verified providers" },
                  { icon: "★", text: "4.9 average rating" },
                  { icon: "🔒", text: "Insured & police checked" },
                ].map((t) => (
                  <div key={t.text} className="flex items-center gap-1.5 text-sm text-gray-500">
                    <span className="text-amber-500 font-bold">{t.icon}</span>
                    {t.text}
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/login"
                  className="bg-gradient-to-r from-amber-500 to-amber-400 text-white font-bold px-8 py-4 rounded-full text-base hover:from-amber-600 hover:to-amber-500 transition-all shadow-lg shadow-amber-200 text-center hover:scale-[1.02] active:scale-[0.98]"
                >
                  Find a Carer Today
                </Link>
                <Link
                  href="#how-it-works"
                  className="border border-gray-200 text-gray-700 font-semibold px-8 py-4 rounded-full text-base hover:border-amber-300 hover:text-amber-500 transition-colors text-center"
                >
                  How it Works
                </Link>
              </div>
            </div>

            {/* Right: Interactive AI Matcher */}
            <div className="flex justify-center lg:justify-end">
              <AIMatcherCard />
            </div>
          </div>
        </div>
      </section>

      {/* ── Services ── */}
      <section id="services" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">Services We Offer</h2>
            <p className="text-gray-400 max-w-xl mx-auto text-lg">From overnight boarding to quick drop-in visits — every care need covered.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((s) => (
              <div key={s.title} className="bg-white border border-gray-100 rounded-2xl p-8 hover:shadow-md hover:border-amber-200 transition-all group">
                <div className="w-8 h-0.5 bg-amber-400 mb-5 group-hover:w-14 transition-all duration-300" />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{s.title}</h3>
                <p className="text-gray-400 text-base leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Photo banner ── */}
      <section className="max-w-6xl mx-auto px-4 pb-6">
        <div className="rounded-2xl overflow-hidden h-96 sm:h-[520px]">
          <Image
            src="/homepage.jpg"
            alt="Pet carer with dogs, cats and rabbits"
            width={1600}
            height={1200}
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how-it-works" className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">How Pet Care AI Works</h2>
            <p className="text-gray-400 max-w-xl mx-auto text-lg">Book trusted care in four simple steps.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step) => (
              <div key={step.num} className="text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-amber-100 text-amber-500 text-xl font-bold mb-5 tabular-nums">
                  {step.num}
                </div>
                <h3 className="font-semibold text-gray-900 mb-3 text-lg">{step.title}</h3>
                <p className="text-gray-400 text-base leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section id="providers" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Loved by Pet Owners</h2>
            <p className="text-gray-400 max-w-xl mx-auto">Join thousands of happy owners who trust Pet Care AI.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-amber-100 transition-all">
                <div className="flex gap-0.5 text-yellow-400 text-sm mb-4">
                  {"★★★★★".split("").map((s, i) => <span key={i}>{s}</span>)}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-5">&ldquo;{t.text}&rdquo;</p>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                  <p className="text-gray-400 text-xs mt-0.5">{t.pet}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 px-4 bg-gradient-to-r from-amber-500 to-amber-400">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to Find the Perfect Carer?</h2>
          <p className="text-amber-100 mb-8 text-lg">Sign up free and let AI find the best match for your pet in seconds.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login" className="bg-white text-amber-500 font-bold px-8 py-4 rounded-full hover:bg-amber-50 transition-colors shadow-lg">
              Get Started Free
            </Link>
            <Link href="/login" className="border-2 border-white text-white font-bold px-8 py-4 rounded-full hover:bg-white/10 transition-colors">
              Become a Provider
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between gap-8 mb-8">
            <div>
              <p className="text-white text-lg font-bold mb-3">Pet Care AI</p>
              <p className="text-sm max-w-xs leading-relaxed">
                AI-powered marketplace connecting pet owners with verified pet care providers.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-8 text-sm">
              <div>
                <p className="text-white font-medium mb-3">Product</p>
                <ul className="space-y-2">
                  <li><Link href="#" className="hover:text-white transition-colors">How it Works</Link></li>
                  <li><Link href="#" className="hover:text-white transition-colors">Services</Link></li>
                  <li><Link href="#" className="hover:text-white transition-colors">Pricing</Link></li>
                </ul>
              </div>
              <div>
                <p className="text-white font-medium mb-3">Company</p>
                <ul className="space-y-2">
                  <li><Link href="#" className="hover:text-white transition-colors">About</Link></li>
                  <li><Link href="#" className="hover:text-white transition-colors">Blog</Link></li>
                  <li><Link href="#" className="hover:text-white transition-colors">Contact</Link></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6 text-xs text-center">
            © {new Date().getFullYear()} Pet Care AI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
