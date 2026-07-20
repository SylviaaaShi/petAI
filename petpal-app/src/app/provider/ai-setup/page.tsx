"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import ProviderNav from "@/components/ProviderNav";

// ─── Types ────────────────────────────────────────────────────────────────────
type Role = "ai" | "user";
type MessageType = "text" | "quick-reply" | "service-select" | "pet-select" | "done";

interface QuickReply { label: string; value: string }

interface Message {
  id: string;
  role: Role;
  text: string;
  type?: MessageType;
  options?: QuickReply[];
  multiSelect?: string[];
}

interface ProfileDraft {
  name?: string;
  location?: string;
  homeType?: string;
  hasYard?: boolean;
  yearsExp?: number;
  services?: string[];
  petTypes?: string[];
  bio?: string;
  maxPets?: number;
  rate?: number;
}

// ─── Scripted AI flow ─────────────────────────────────────────────────────────
const SERVICE_OPTIONS = [
  { label: "🏠 Home Boarding", value: "boarding" },
  { label: "🚶 Home Visit", value: "home-visit" },
  { label: "🦮 Dog Walking", value: "dog-walking" },
  { label: "🌙 Overnight Care", value: "overnight" },
  { label: "😺 Cat Sitting", value: "cat-sitting" },
  { label: "☀️ Doggy Daycare", value: "daycare" },
];
const PET_OPTIONS = [
  { label: "🐶 Dog", value: "dog" },
  { label: "🐱 Cat", value: "cat" },
  { label: "🐰 Rabbit", value: "rabbit" },
  { label: "🐦 Bird", value: "bird" },
  { label: "🐟 Fish", value: "fish" },
  { label: "🐹 Small Animals", value: "small-animal" },
];

// Conversation steps
type Step = "name" | "location" | "homeType" | "yard" | "experience" | "services" | "pets" | "maxPets" | "rate" | "bio" | "done";

function getNextStep(current: Step): Step | null {
  const order: Step[] = ["name","location","homeType","yard","experience","services","pets","maxPets","rate","bio","done"];
  const idx = order.indexOf(current);
  return idx < order.length - 1 ? order[idx + 1] : null;
}

function aiMessageForStep(step: Step, draft: ProfileDraft): Omit<Message, "id"> {
  switch (step) {
    case "name":
      return { role: "ai", text: "Hi there! 👋 I'm your PetPal AI assistant. I'll help you build your provider profile in just a few minutes.\n\nLet's start with the basics — what's your full name?" };
    case "location":
      return { role: "ai", text: `Nice to meet you, ${draft.name}! 🙌\n\nWhat suburb and city are you based in? (e.g. Fitzroy, Melbourne)` };
    case "homeType":
      return { role: "ai", text: "What type of home do you live in?", type: "quick-reply", options: [
        { label: "🏠 House", value: "house" },
        { label: "🏢 Apartment / Unit", value: "apartment" },
        { label: "🏕️ Farm / Rural property", value: "farm" },
      ]};
    case "yard":
      return { role: "ai", text: "Does your property have a secure yard or outdoor space for pets?", type: "quick-reply", options: [
        { label: "✅ Yes, fully fenced yard", value: "yes" },
        { label: "🌿 Yes, but not fully fenced", value: "partial" },
        { label: "❌ No outdoor space", value: "no" },
      ]};
    case "experience":
      return { role: "ai", text: "How many years of experience do you have caring for animals?", type: "quick-reply", options: [
        { label: "Less than 1 year", value: "0" },
        { label: "1–3 years", value: "2" },
        { label: "3–5 years", value: "4" },
        { label: "5+ years", value: "6" },
        { label: "10+ years", value: "10" },
      ]};
    case "services":
      return { role: "ai", text: "Which services would you like to offer? Select all that apply — you can adjust pricing later.", type: "service-select" };
    case "pets":
      return { role: "ai", text: "Great choices! 🐾 Now, which types of pets are you comfortable caring for?", type: "pet-select" };
    case "maxPets":
      return { role: "ai", text: "How many pets can you look after at the same time?", type: "quick-reply", options: [
        { label: "1 pet only", value: "1" },
        { label: "Up to 2 pets", value: "2" },
        { label: "Up to 3 pets", value: "3" },
        { label: "4 or more", value: "4" },
      ]};
    case "rate":
      return { role: "ai", text: "What's your starting rate per night / visit? (in AUD)\n\nJust type a number, e.g. **55**", type: "quick-reply", options: [
        { label: "$35", value: "35" },
        { label: "$45", value: "45" },
        { label: "$55", value: "55" },
        { label: "$70", value: "70" },
        { label: "$85+", value: "85" },
      ]};
    case "bio":
      return { role: "ai", text: `Almost done! 🎉 Let me generate a bio based on everything you've told me...\n\n✨ *Here's a draft:*\n\n> "${generateBio(draft)}"\n\nFeel free to type your own below, or just reply **"looks good"** to use this one.` };
    case "done":
      return { role: "ai", text: `Your profile is all set, ${draft.name}! 🎊\n\nHere's what we've built:\n• 📍 ${draft.location}\n• 🏠 ${draft.homeType} ${draft.hasYard ? "with yard" : ""}\n• 🐾 ${(draft.petTypes||[]).join(", ")}\n• 💼 ${(draft.services||[]).length} services offered\n• 💰 From $${draft.rate}/night\n\nYour profile is now live and pet owners in your area can find you. Good luck! 🐕`, type: "done" };
  }
}

function generateBio(draft: ProfileDraft): string {
  const expStr = draft.yearsExp && draft.yearsExp >= 10 ? "over 10 years" : draft.yearsExp ? `${draft.yearsExp}+ years` : "several years";
  const yardStr = draft.hasYard ? " My home has a secure yard where dogs can run and play freely." : "";
  const petsStr = (draft.petTypes || []).join(" and ");
  return `I'm a passionate animal lover based in ${draft.location || "Melbourne"} with ${expStr} of experience caring for pets. I specialise in looking after ${petsStr || "dogs and cats"} and treat every animal as if they were my own.${yardStr} I'm committed to giving your pet a safe, happy and loving environment while you're away.`;
}

// ─── Components ───────────────────────────────────────────────────────────────
function TypingIndicator() {
  return (
    <div className="flex gap-3 items-end">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center text-white text-sm shrink-0">🤖</div>
      <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
        <div className="flex gap-1 items-center h-4">
          <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
          <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
          <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    </div>
  );
}

function ProfilePreview({ draft }: { draft: ProfileDraft }) {
  const pct = Object.values(draft).filter(Boolean).length;
  const total = 9;
  const progress = Math.min(100, Math.round((pct / total) * 100));

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 sticky top-24">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900 text-sm">Profile Preview</h3>
        <span className="text-xs font-bold text-amber-500">{progress}%</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-1.5 mb-5">
        <div className="bg-amber-500 h-1.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
      </div>

      <div className="flex items-center gap-3 mb-5">
        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center text-white text-lg font-bold shrink-0">
          {draft.name ? draft.name.split(" ").map((w) => w[0]).join("").slice(0, 2) : "?"}
        </div>
        <div>
          <p className="font-semibold text-gray-900">{draft.name || <span className="text-gray-300">Your name</span>}</p>
          <p className="text-xs text-gray-400">{draft.location || <span className="text-gray-300">Location</span>}</p>
        </div>
      </div>

      <div className="space-y-2.5 text-xs">
        {[
          { icon: "🏠", label: "Home", value: draft.homeType ? `${draft.homeType}${draft.hasYard ? " · has yard" : ""}` : null },
          { icon: "⏱️", label: "Experience", value: draft.yearsExp ? `${draft.yearsExp}+ years` : null },
          { icon: "💰", label: "From", value: draft.rate ? `$${draft.rate} AUD/night` : null },
          { icon: "🐾", label: "Pets", value: draft.petTypes?.join(", ") || null },
          { icon: "📋", label: "Services", value: draft.services ? `${draft.services.length} services` : null },
        ].map((item) => (
          <div key={item.label} className={`flex items-start gap-2 ${item.value ? "text-gray-700" : "text-gray-300"}`}>
            <span>{item.icon}</span>
            <span className="font-medium w-16 shrink-0">{item.label}</span>
            <span className="flex-1">{item.value || "—"}</span>
          </div>
        ))}
      </div>

      {draft.bio && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-500 leading-relaxed line-clamp-4 italic">&ldquo;{draft.bio}&rdquo;</p>
        </div>
      )}
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function ProviderAISetupPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [currentStep, setCurrentStep] = useState<Step>("name");
  const [draft, setDraft] = useState<ProfileDraft>({});
  const [multiSelected, setMultiSelected] = useState<string[]>([]);
  const [isDone, setIsDone] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const initialized = useRef(false);

  // Send first AI message on mount
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    setTimeout(() => {
      const msg = aiMessageForStep("name", {});
      setMessages([{ ...msg, id: "init" }]);
    }, 500);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  function addMessage(msg: Omit<Message, "id">) {
    setMessages((prev) => [...prev, { ...msg, id: crypto.randomUUID() }]);
  }

  function parseUserInput(step: Step, value: string): Partial<ProfileDraft> {
    switch (step) {
      case "name": return { name: value };
      case "location": return { location: value };
      case "homeType": return { homeType: value };
      case "yard": return { hasYard: value === "yes" || value === "partial" };
      case "experience": return { yearsExp: Number(value) };
      case "services": return { services: multiSelected };
      case "pets": return { petTypes: multiSelected };
      case "maxPets": return { maxPets: Number(value) };
      case "rate": return { rate: Number(value.replace(/\D/g, "")) || Number(value) };
      case "bio": return { bio: value === "looks good" || value === "Looks good" ? generateBio(draft) : value };
      default: return {};
    }
  }

  async function handleSubmit(value: string) {
    if (!value.trim() || isDone) return;
    setInput("");
    setMultiSelected([]);

    // User message
    addMessage({ role: "user", text: value });

    // Update draft
    const updates = parseUserInput(currentStep, value);
    const newDraft = { ...draft, ...updates };
    setDraft(newDraft);

    // Advance step
    const nextStep = getNextStep(currentStep);

    setTyping(true);
    await new Promise((r) => setTimeout(r, 900 + Math.random() * 600));
    setTyping(false);

    if (nextStep) {
      setCurrentStep(nextStep);
      const nextMsg = aiMessageForStep(nextStep, newDraft);
      addMessage(nextMsg);
      if (nextStep === "done") setIsDone(true);
    }
  }

  function handleMultiConfirm() {
    if (multiSelected.length === 0) return;
    const labels = currentStep === "services"
      ? multiSelected.map((v) => SERVICE_OPTIONS.find((o) => o.value === v)?.label || v)
      : multiSelected.map((v) => PET_OPTIONS.find((o) => o.value === v)?.label || v);
    handleSubmit(labels.join(", "));
  }

  // Get the last AI message type to determine input mode
  const lastAIMsg = [...messages].reverse().find((m) => m.role === "ai");

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <ProviderNav />

      <div className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Chat column */}
        <div className="lg:col-span-2 flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden" style={{ height: "calc(100vh - 140px)" }}>

          {/* Chat header */}
          <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center text-white text-lg">🤖</div>
            <div>
              <p className="font-semibold text-gray-900 text-sm">PetPal AI Assistant</p>
              <p className="text-xs text-green-500 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block" /> Online · Profile Builder
              </p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "items-end"}`}>
                {msg.role === "ai" && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center text-white text-sm shrink-0">🤖</div>
                )}
                <div className={`max-w-[78%] ${msg.role === "user" ? "items-end" : "items-start"} flex flex-col gap-2`}>
                  <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
                    msg.role === "ai"
                      ? "bg-white border border-gray-100 shadow-sm rounded-bl-sm text-gray-700"
                      : "bg-amber-500 text-white rounded-br-sm"
                  }`}>
                    {msg.text.split(/\*\*(.*?)\*\*/).map((part, i) =>
                      i % 2 === 1 ? <strong key={i}>{part}</strong> : part
                    )}
                  </div>

                  {/* Quick reply buttons (only for the latest AI message) */}
                  {msg.role === "ai" && msg.type === "quick-reply" && msg === lastAIMsg && !isDone && (
                    <div className="flex flex-wrap gap-2 mt-1">
                      {msg.options?.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => handleSubmit(opt.label)}
                          className="text-xs bg-amber-50 border border-amber-200 text-amber-600 px-3 py-1.5 rounded-full hover:bg-amber-500 hover:text-white hover:border-amber-500 transition-all font-medium"
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Service multi-select */}
                  {msg.role === "ai" && msg.type === "service-select" && msg === lastAIMsg && !isDone && (
                    <div className="w-full">
                      <div className="grid grid-cols-2 gap-2 mt-1">
                        {SERVICE_OPTIONS.map((opt) => {
                          const sel = multiSelected.includes(opt.value);
                          return (
                            <button
                              key={opt.value}
                              onClick={() => setMultiSelected((p) => sel ? p.filter((x) => x !== opt.value) : [...p, opt.value])}
                              className={`text-xs px-3 py-2 rounded-xl border-2 text-left transition-all font-medium ${
                                sel ? "bg-amber-500 text-white border-amber-500" : "border-gray-200 text-gray-600 hover:border-amber-300 bg-white"
                              }`}
                            >
                              {opt.label}
                            </button>
                          );
                        })}
                      </div>
                      <button
                        onClick={handleMultiConfirm}
                        disabled={multiSelected.length === 0}
                        className="mt-2 w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-white text-xs font-semibold py-2 rounded-xl transition-colors"
                      >
                        Confirm {multiSelected.length > 0 ? `(${multiSelected.length} selected)` : "selection"}
                      </button>
                    </div>
                  )}

                  {/* Pet multi-select */}
                  {msg.role === "ai" && msg.type === "pet-select" && msg === lastAIMsg && !isDone && (
                    <div className="w-full">
                      <div className="grid grid-cols-3 gap-2 mt-1">
                        {PET_OPTIONS.map((opt) => {
                          const sel = multiSelected.includes(opt.value);
                          return (
                            <button
                              key={opt.value}
                              onClick={() => setMultiSelected((p) => sel ? p.filter((x) => x !== opt.value) : [...p, opt.value])}
                              className={`text-xs px-2 py-2 rounded-xl border-2 text-center transition-all font-medium ${
                                sel ? "bg-amber-500 text-white border-amber-500" : "border-gray-200 text-gray-600 hover:border-amber-300 bg-white"
                              }`}
                            >
                              {opt.label}
                            </button>
                          );
                        })}
                      </div>
                      <button
                        onClick={handleMultiConfirm}
                        disabled={multiSelected.length === 0}
                        className="mt-2 w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-white text-xs font-semibold py-2 rounded-xl transition-colors"
                      >
                        Confirm {multiSelected.length > 0 ? `(${multiSelected.length} selected)` : "selection"}
                      </button>
                    </div>
                  )}

                  {/* Done CTA */}
                  {msg.type === "done" && (
                    <div className="flex gap-2 mt-1">
                      <Link href="/provider/profile" className="text-xs bg-amber-500 text-white px-4 py-2 rounded-full font-semibold hover:bg-amber-600 transition-colors">
                        View My Profile
                      </Link>
                      <Link href="/provider" className="text-xs border border-gray-200 text-gray-600 px-4 py-2 rounded-full font-semibold hover:bg-gray-50 transition-colors">
                        Go to Dashboard
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {typing && <TypingIndicator />}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="border-t border-gray-100 px-4 py-3">
            {isDone ? (
              <p className="text-center text-xs text-gray-400 py-1">Your profile setup is complete 🎉</p>
            ) : (
              <form
                onSubmit={(e) => { e.preventDefault(); handleSubmit(input); }}
                className="flex gap-2 items-center"
              >
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={
                    lastAIMsg?.type === "service-select" || lastAIMsg?.type === "pet-select"
                      ? "Use the buttons above, or type your answer…"
                      : lastAIMsg?.type === "quick-reply"
                      ? "Choose an option above or type your own…"
                      : "Type your answer…"
                  }
                  disabled={typing}
                  className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || typing}
                  className="bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-white rounded-xl w-10 h-10 flex items-center justify-center shrink-0 transition-colors"
                >
                  <svg className="w-4 h-4 rotate-90" fill="currentColor" viewBox="0 0 24 24"><path d="M2 21l21-9L2 3v7l15 2-15 2v7z"/></svg>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Profile preview sidebar */}
        <div className="hidden lg:block">
          <ProfilePreview draft={draft} />
        </div>
      </div>
    </div>
  );
}
