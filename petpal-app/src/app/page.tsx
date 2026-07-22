"use client";

import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";

function FadeUp({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -80px 0px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

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

// ── AI Journey Section ────────────────────────────────────────────────────────

const CHECK_ITEMS = ["Experience", "Availability", "Reviews", "Distance", "Pet compatibility"];
const PROC_STEPS = [
  { icon: "🐾", label: "Pet Profile" },
  { icon: "🧠", label: "AI Matching" },
  { icon: "🏡", label: "Best Provider" },
  { icon: "📅", label: "Booking Confirmed" },
];

function AIJourneySection() {
  const [stage, setStage] = useState(-1);
  const [checkedCount, setCheckedCount] = useState(0);
  const [providerCount, setProviderCount] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const hasStarted = useRef(false);

  function startAnimation() {
    timersRef.current.forEach(clearTimeout);
    setStage(0); setCheckedCount(0); setProviderCount(0);
    const schedule: [number, () => void][] = [
      [300,  () => setStage(1)],
      [700,  () => setStage(2)],
      [1100, () => setStage(3)],
      [1600, () => setStage(4)],
      [2400, () => setStage(5)],
      [2900, () => setStage(6)],
      [3200, () => setCheckedCount(1)],
      [3500, () => setCheckedCount(2)],
      [3800, () => setCheckedCount(3)],
      [4100, () => setCheckedCount(4)],
      [4400, () => setCheckedCount(5)],
      [4800, () => setStage(7)],
      [5800, () => setStage(8)],
      [6300, () => setStage(9)],
    ];
    timersRef.current = schedule.map(([d, fn]) => setTimeout(fn, d));
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting && !hasStarted.current) { hasStarted.current = true; startAnimation(); } },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => { observer.disconnect(); timersRef.current.forEach(clearTimeout); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (stage === 7) {
      let n = 0;
      const iv = setInterval(() => {
        n += Math.floor(Math.random() * 16) + 8;
        if (n >= 247) { n = 247; clearInterval(iv); }
        setProviderCount(n);
      }, 50);
      return () => clearInterval(iv);
    }
  }, [stage]);

  const procActive = stage >= 9 ? 3 : stage >= 7 ? 2 : stage >= 4 ? 1 : stage >= 1 ? 0 : -1;
  const lineWidth = procActive >= 3 ? "100%" : procActive >= 2 ? "66%" : procActive >= 1 ? "33%" : "0%";

  return (
    <section ref={sectionRef} id="how-it-works" className="py-24 px-4 bg-white">
      <div className="max-w-[1200px] mx-auto">

        {/* Header */}
        <div className="text-center mb-14">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            How Pet Care AI Finds<br />Your Perfect Match
          </h2>
          <p className="text-gray-400 text-lg">
            Simply tell us about your pet. Our AI handles everything else.
          </p>
        </div>

        {/* Split panel */}
        <div className="flex flex-col lg:flex-row rounded-[28px] overflow-hidden shadow-2xl shadow-gray-200/70 border border-gray-100">

          {/* LEFT — Chat */}
          <div className="lg:w-[45%] bg-[#0E0E0E] p-7 flex flex-col" style={{ minHeight: 520 }}>
            {/* Chat header */}
            <div className="flex items-center gap-3 mb-7 pb-5 border-b border-white/[0.06]">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-900/30">
                <IcSparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-white text-sm font-semibold">Pet Care AI</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
                  <span className="text-green-400 text-[11px]">Online</span>
                </div>
              </div>
              <button
                onClick={() => { hasStarted.current = false; startAnimation(); }}
                className="ml-auto text-[11px] text-white/25 hover:text-white/60 transition-colors font-medium"
              >
                ↺ Replay
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 space-y-3">
              <AnimatePresence>
                {stage >= 1 && (
                  <motion.div key="u1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-end">
                    <div className="bg-amber-500 text-white text-sm px-4 py-2.5 rounded-2xl rounded-tr-sm max-w-[82%] leading-relaxed">
                      👤 I&apos;m traveling to Sydney next weekend.
                    </div>
                  </motion.div>
                )}
                {stage >= 2 && (
                  <motion.div key="u2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-end">
                    <div className="bg-amber-500 text-white text-sm px-4 py-2.5 rounded-2xl rounded-tr-sm max-w-[82%] leading-relaxed">
                      I have a 3-year-old Golden Retriever.
                    </div>
                  </motion.div>
                )}
                {stage >= 3 && (
                  <motion.div key="u3" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-end">
                    <div className="bg-amber-500 text-white text-sm px-4 py-2.5 rounded-2xl rounded-tr-sm max-w-[82%] leading-relaxed">
                      Friendly with other dogs. Needs two walks per day.
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Typing indicator */}
              <AnimatePresence>
                {stage === 4 && (
                  <motion.div key="typing" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-end gap-2">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shrink-0">
                      <IcSparkles className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div className="bg-[#1C1C1C] border border-white/[0.07] px-4 py-3 rounded-2xl rounded-bl-sm flex gap-1.5 items-center">
                      <span className="typing-dot w-1.5 h-1.5 rounded-full bg-white/40 inline-block" />
                      <span className="typing-dot w-1.5 h-1.5 rounded-full bg-white/40 inline-block" />
                      <span className="typing-dot w-1.5 h-1.5 rounded-full bg-white/40 inline-block" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* AI response bubble */}
              <AnimatePresence>
                {stage >= 5 && (
                  <motion.div key="ai-reply" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex items-end gap-2">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shrink-0">
                      <IcSparkles className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div className="bg-[#1C1C1C] border border-white/[0.07] px-4 py-3.5 rounded-2xl rounded-bl-sm text-sm text-white/85 max-w-[88%]">
                      <p>Thanks! Searching verified providers nearby…</p>

                      {stage >= 6 && (
                        <div className="mt-3 space-y-1.5">
                          <p className="text-white/30 text-xs mb-2">Checking:</p>
                          {CHECK_ITEMS.slice(0, checkedCount).map((item, i) => (
                            <motion.div
                              key={item}
                              initial={{ opacity: 0, x: -6 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.04 }}
                              className="flex items-center gap-2 text-xs text-white/65"
                            >
                              <span className="text-green-400 font-bold text-sm">✓</span>{item}
                            </motion.div>
                          ))}
                        </div>
                      )}

                      {stage >= 7 && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 pt-3 border-t border-white/[0.06]">
                          <p className="text-white/40 text-xs tabular-nums">
                            {providerCount} providers analyzed
                          </p>
                        </motion.div>
                      )}

                      {stage >= 8 && (
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 300, damping: 20 }} className="mt-3">
                          <span className="inline-flex items-center gap-1.5 bg-amber-500/15 border border-amber-400/20 text-amber-300 text-xs font-semibold px-3 py-1.5 rounded-full">
                            <IcSparkles className="w-3 h-3" /> Best match found!
                          </span>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* RIGHT — Provider Card */}
          <div className="lg:w-[55%] bg-gradient-to-br from-amber-50/50 via-white to-white p-10 flex items-center justify-center" style={{ minHeight: 520 }}>
            <AnimatePresence mode="wait">
              {stage >= 9 ? (
                <motion.div
                  key="card"
                  initial={{ opacity: 0, x: 40, y: 8 }}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                  className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden w-full max-w-[340px]"
                >
                  <div className="relative h-44 bg-amber-100 overflow-hidden">
                    <Image src="/staff/WechatIMG53.jpg" alt="Sarah Johnson" fill className="object-cover object-top" sizes="340px" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.35 }}
                      className="absolute top-3 right-3 bg-amber-500 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg"
                    >
                      <IcSparkles className="w-3 h-3" /> 95% Match
                    </motion.div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-bold text-gray-900 text-xl">Sarah Johnson</h3>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-yellow-400 text-sm">★★★★★</span>
                          <span className="text-sm font-bold text-gray-800">4.9</span>
                          <span className="text-gray-400 text-sm">· 218 reviews</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-extrabold text-gray-900">$42</p>
                        <p className="text-xs text-gray-400">/day</p>
                      </div>
                    </div>

                    <p className="text-xs text-gray-400 mb-4 flex items-center gap-1">
                      <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                      1.2 km away
                    </p>

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {["✓ Golden Retriever Expert", "✓ Verified", "✓ First Aid Certified"].map((b, i) => (
                        <motion.span
                          key={b}
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 + i * 0.1 }}
                          className="text-[11px] bg-green-50 text-green-700 border border-green-100 px-2.5 py-1 rounded-full font-medium"
                        >
                          {b}
                        </motion.span>
                      ))}
                    </div>

                    <div className="bg-amber-50 border border-amber-100 rounded-2xl p-3 mb-5">
                      <p className="text-xs text-amber-800 leading-relaxed">
                        Matched because Sarah has cared for over 80 Golden Retrievers and is available during your travel dates.
                      </p>
                    </div>

                    <Link
                      href="/login"
                      className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3.5 rounded-2xl text-sm text-center block transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-amber-100"
                    >
                      Book Now →
                    </Link>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="placeholder" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-4 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center">
                    <IcSparkles className="w-7 h-7 text-gray-300" />
                  </div>
                  <p className="text-gray-300 text-sm">Your perfect match will appear here</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Processing bar */}
        <div className="mt-8 bg-[#FAFAFA] rounded-2xl border border-gray-100 px-8 py-6">
          <div className="relative flex items-start justify-between">
            {/* Track line */}
            <div className="absolute left-5 right-5 top-5 h-0.5 bg-gray-100 z-0 overflow-hidden rounded-full">
              <motion.div
                className="h-full rounded-full animate-flow-line"
                initial={{ width: "0%" }}
                animate={{ width: lineWidth }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>

            {PROC_STEPS.map((s, i) => (
              <div key={s.label} className="relative z-10 flex flex-col items-center gap-2">
                <motion.div
                  animate={i <= procActive ? { scale: [1, 1.15, 1], boxShadow: ["0 0 0 0 rgba(245,158,11,0)", "0 0 0 8px rgba(245,158,11,0.12)", "0 0 0 0 rgba(245,158,11,0)"] } : {}}
                  transition={{ duration: 0.6, delay: i * 0.15 }}
                  className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-base bg-white transition-all duration-500 ${i <= procActive ? "border-amber-400 shadow-md shadow-amber-100" : "border-gray-200"}`}
                >
                  {s.icon}
                </motion.div>
                <span className={`text-xs font-medium transition-colors duration-500 whitespace-nowrap ${i <= procActive ? "text-gray-700" : "text-gray-300"}`}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

// ── Static page content ───────────────────────────────────────────────────────

const services = [
  { title: "Home Boarding", desc: "Your pet stays in a warm home, not a kennel.", photo: "/dashboard/WechatIMG38.jpg", tag: "Most Popular" },
  { title: "Home Visits", desc: "A carer visits your home to feed and check in.", photo: "/dashboard/WechatIMG46.jpg", tag: null },
  { title: "Dog Walking", desc: "Daily walks by GPS-tracked local walkers.", photo: "/WechatIMG15.jpg", tag: null },
  { title: "Emergency Care", desc: "Last-minute or urgent bookings, matched within minutes.", photo: "/dashboard/WechatIMG49.jpg", tag: "24/7" },
  { title: "Cat Sitting", desc: "In-home care for cats who prefer their own space.", photo: "/WechatIMG14.jpg", tag: null },
  { title: "AI Matching", desc: "Instantly matched to the perfect carer for your pet.", photo: "/dashboard/WechatIMG47.jpg", tag: "New" },
];

const _steps = [
  {
    num: "01",
    title: "Build Your Pet's Profile",
    desc: "Add breed, age, personality quirks, diet, and health records. The more we know, the smarter the match.",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    ),
    detail: "Breed · Age · Diet · Health · Personality",
    color: "bg-amber-50 text-amber-500 border-amber-200",
    dot: "bg-amber-400",
  },
  {
    num: "02",
    title: "AI Scans 247 Providers",
    desc: "Our model scores every nearby carer on compatibility, availability, home environment, and past reviews.",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
      </svg>
    ),
    detail: "Match score · Availability · Home type · Reviews",
    color: "bg-blue-50 text-blue-500 border-blue-200",
    dot: "bg-blue-400",
  },
  {
    num: "03",
    title: "Pick Your Top Match",
    desc: "Browse AI-ranked results with trust scores, real photos of their home, and verified reviews.",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
      </svg>
    ),
    detail: "Ranked results · Real photos · Trust score",
    color: "bg-purple-50 text-purple-500 border-purple-200",
    dot: "bg-purple-400",
  },
  {
    num: "04",
    title: "Book, Pay & Relax",
    desc: "Confirm in seconds, pay securely online, then get live updates and photo reports during the stay.",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    detail: "Instant booking · Secure pay · Live updates",
    color: "bg-green-50 text-green-600 border-green-200",
    dot: "bg-green-400",
  },
];

const testimonials = [
  { name: "Sarah L.", pet: "Golden Retriever owner", text: "The AI matched us with the perfect carer. Buddy has never been happier away from home." },
  { name: "James T.", pet: "Two cats, one anxious", text: "Pet Care AI understood my anxious cat's needs instantly. Outstanding experience." },
  { name: "Mei W.", pet: "Rabbit owner", text: "Hard to find rabbit-friendly carers, but Pet Care AI found three great options in minutes." },
  { name: "Emily C.", pet: "Beagle owner", text: "Booked same-day through Emergency Care. The carer was at my door in under an hour. Incredible." },
  { name: "David K.", pet: "Two dogs", text: "The match score was spot on — our dogs immediately loved Emma. Will use every trip." },
  { name: "Aisha R.", pet: "Persian cat owner", text: "My cat is very particular. Pet Care AI found someone who has kept Persians for 6 years. Perfect." },
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
      <section id="services" className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <FadeUp className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-5">Services We Offer</h2>
            <p className="text-gray-400 max-w-md mx-auto text-lg">Every care need covered — matched by AI to your pet.</p>
          </FadeUp>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s, i) => (
              <FadeUp key={s.title} delay={i * 0.08}>
              <div
                className="group relative bg-white rounded-3xl overflow-hidden border border-gray-100 cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-amber-100/60 hover:border-amber-200 h-full"
              >
                {/* Photo */}
                <div className="relative h-52 overflow-hidden">
                  <Image
                    src={s.photo}
                    alt={s.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  {/* Tag */}
                  {s.tag && (
                    <span className="absolute top-3 left-3 bg-amber-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow">
                      {s.tag}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-7">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{s.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{s.desc}</p>
                  <div className="mt-5 flex items-center gap-1 text-amber-500 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    Learn more
                    <svg className="w-4 h-4 translate-x-0 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
                  </div>
                </div>

                {/* Glow ring on hover */}
                <div className="absolute inset-0 rounded-3xl ring-0 group-hover:ring-2 ring-amber-300/50 transition-all duration-300 pointer-events-none" />
              </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      <AIJourneySection />

      {/* ── Photo banner ── */}
      <section className="max-w-6xl mx-auto px-4 pb-6">
        <FadeUp>
        <div className="rounded-2xl overflow-hidden h-96 sm:h-[520px]">
          <Image
            src="/homepage.jpg"
            alt="Pet carer with dogs, cats and rabbits"
            width={1600}
            height={1200}
            className="w-full h-full object-cover"
          />
        </div>
        </FadeUp>
      </section>

      {/* ── Testimonials ── */}
      <section id="providers" className="py-20 overflow-hidden">
        <FadeUp className="text-center mb-12 px-4">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Loved by Pet Owners</h2>
          <p className="text-gray-400 max-w-xl mx-auto">Join thousands of happy owners who trust Pet Care AI.</p>
        </FadeUp>

        {/* Scrolling track */}
        <div className="relative">
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

          <div className="flex gap-5 w-max animate-marquee hover:[animation-play-state:paused]">
            {[...testimonials, ...testimonials].map((t, i) => (
              <div
                key={i}
                className="w-72 shrink-0 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-amber-200 transition-all"
              >
                <div className="flex gap-0.5 text-yellow-400 text-sm mb-4">★★★★★</div>
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
        <FadeUp className="max-w-3xl mx-auto text-center text-white">
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
        </FadeUp>
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
