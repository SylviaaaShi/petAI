"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { MOCK_PROVIDERS, SERVICE_LABELS, SERVICE_ICONS, type Provider } from "@/lib/mockData";

// ─── Types ────────────────────────────────────────────────────────────────────
type Role = "ai" | "user";

interface ProviderCardMsg {
  providers: Provider[];
}

interface Message {
  id: string;
  role: Role;
  text: string;
  providerCards?: ProviderCardMsg;
  quickReplies?: string[];
}

// ─── Scripted AI responses ────────────────────────────────────────────────────
const AVATAR_COLORS = ["bg-rose-400","bg-teal-400","bg-sky-400","bg-emerald-400","bg-violet-400","bg-amber-400","bg-pink-400","bg-indigo-400"];

function matchProviders(input: string): Provider[] {
  const lower = input.toLowerCase();
  return MOCK_PROVIDERS.filter((p) => {
    const matchDog = (lower.includes("dog") || lower.includes("puppy") || lower.includes("pup")) && p.petTypes.includes("dog");
    const matchCat = lower.includes("cat") && p.petTypes.includes("cat");
    const matchRabbit = lower.includes("rabbit") && p.petTypes.includes("rabbit");
    const matchBoard = (lower.includes("board") || lower.includes("stay") || lower.includes("overnight") || lower.includes("week")) && p.services.includes("boarding");
    const matchWalk = (lower.includes("walk") || lower.includes("exercise")) && p.services.includes("dog-walking");
    const matchVisit = (lower.includes("visit") || lower.includes("drop") || lower.includes("feed")) && p.services.includes("home-visit");
    const matchYard = (lower.includes("yard") || lower.includes("space") || lower.includes("run")) && p.hasYard;
    const matchAnxious = (lower.includes("anxious") || lower.includes("nervous") || lower.includes("shy")) && p.aiTags.some(t => t.toLowerCase().includes("anxious") || t.toLowerCase().includes("nervous"));
    if (matchAnxious) return true;
    if (matchYard) return true;
    if (matchDog || matchCat || matchRabbit) {
      if (matchBoard || matchWalk || matchVisit) return true;
      return true;
    }
    if (matchBoard || matchWalk || matchVisit) return true;
    return false;
  }).sort((a, b) => b.aiScore - a.aiScore).slice(0, 3);
}

function buildAIReply(input: string): Omit<Message, "id"> {
  const lower = input.toLowerCase();
  const providers = matchProviders(input);

  const greetings = ["hi","hello","hey","g'day"];
  if (greetings.some(g => lower.includes(g)) && lower.length < 20) {
    return {
      role: "ai",
      text: "Hey there! 👋 I'm your Pet Care AI — here to find the perfect carer for your pet.\n\nTell me a bit about your situation. For example:\n• What type of pet do you have?\n• What dates do you need care?\n• Any special requirements?",
      quickReplies: ["I need boarding for my dog 🐶", "Looking for a cat sitter 🐱", "Need someone for my anxious dog", "Dog walking service"],
    };
  }

  if (lower.includes("anxious") || lower.includes("nervous") || lower.includes("separation anxiety")) {
    return {
      role: "ai",
      text: "I understand — anxious pets need extra special care 💛\n\nI've filtered for providers who specifically mention experience with anxious animals, calm home environments, and patience. Here are my top picks:",
      providerCards: { providers: providers.length > 0 ? providers : MOCK_PROVIDERS.filter(p => p.aiTags.some(t => t.toLowerCase().includes("anxious"))).slice(0,3) },
      quickReplies: ["Tell me more about Emma", "Who has a yard?", "Which is cheapest?"],
    };
  }

  if (lower.includes("cat")) {
    const catProviders = MOCK_PROVIDERS.filter(p => p.petTypes.includes("cat")).sort((a,b) => b.aiScore - a.aiScore).slice(0,3);
    return {
      role: "ai",
      text: "Purrfect! 🐱 I've found our best-rated cat specialists for you.\n\nAll of these carers have experience with cats and understand feline needs — from solo cats who need quiet space, to multi-cat households.",
      providerCards: { providers: catProviders },
      quickReplies: ["I have 2 cats", "One of my cats needs medication", "Looking for in-home cat sitting"],
    };
  }

  if (lower.includes("rabbit") || lower.includes("bunny")) {
    const rabbitProviders = MOCK_PROVIDERS.filter(p => p.petTypes.includes("rabbit")).sort((a,b) => b.aiScore - a.aiScore).slice(0,3);
    return {
      role: "ai",
      text: "Great choice of pet! 🐰 Rabbits need specialist care — not every carer is comfortable with them.\n\nHere are our providers who are experienced and happy to look after rabbits:",
      providerCards: { providers: rabbitProviders },
      quickReplies: ["Does my rabbit need a special diet?", "Can they handle 2 rabbits?"],
    };
  }

  if (lower.includes("walk")) {
    const walkProviders = MOCK_PROVIDERS.filter(p => p.services.includes("dog-walking")).sort((a,b) => b.aiScore - a.aiScore).slice(0,3);
    return {
      role: "ai",
      text: "Great! I'll match you with our top-rated dog walkers 🦮\n\nAll of these walkers provide GPS-tracked walks and send you updates during the session.",
      providerCards: { providers: walkProviders },
      quickReplies: ["30 min walk daily", "My dog pulls on leash", "I need a walker near Fitzroy"],
    };
  }

  if (lower.includes("cheap") || lower.includes("budget") || lower.includes("afford") || lower.includes("cheapest")) {
    const cheap = [...MOCK_PROVIDERS].sort((a,b) => a.priceFrom - b.priceFrom).slice(0,3);
    return {
      role: "ai",
      text: "Budget-friendly options, coming right up! 💰\n\nThese providers offer great value without compromising on quality — all are verified with strong ratings:",
      providerCards: { providers: cheap },
      quickReplies: ["Do prices include all fees?", "Is there a discount for longer stays?"],
    };
  }

  if (lower.includes("yard") || lower.includes("space") || lower.includes("run around")) {
    const yardProviders = MOCK_PROVIDERS.filter(p => p.hasYard).sort((a,b) => b.aiScore - a.aiScore).slice(0,3);
    return {
      role: "ai",
      text: "Your dog deserves space to run! 🌳\n\nHere are providers with a secure, fenced yard where your pup can play safely:",
      providerCards: { providers: yardProviders },
      quickReplies: ["Is the yard fully fenced?", "How big is the yard?"],
    };
  }

  if ((lower.includes("dog") || lower.includes("board") || lower.includes("stay") || lower.includes("week") || lower.includes("holiday"))) {
    const dogProviders = MOCK_PROVIDERS.filter(p => p.petTypes.includes("dog") && p.services.includes("boarding")).sort((a,b) => b.aiScore - a.aiScore).slice(0,3);
    return {
      role: "ai",
      text: `Based on what you've told me, I've found ${dogProviders.length} great matches for your dog 🐶✨\n\nThese are ranked by our AI matching score, which considers your dog's needs, the provider's experience, and their track record with similar pets:`,
      providerCards: { providers: dogProviders },
      quickReplies: ["My dog is a large breed", "My dog needs medication", "I need someone nearby"],
    };
  }

  if (providers.length > 0) {
    return {
      role: "ai",
      text: `Got it! Here are the providers I think would be the best fit based on what you've described 🎯\n\nAll are verified and have strong ratings from previous pet owners:`,
      providerCards: { providers },
      quickReplies: ["Tell me more about the top result", "Any closer to me?", "Who has the most reviews?"],
    };
  }

  return {
    role: "ai",
    text: "I'd love to help find the perfect carer for your pet! Could you tell me a bit more?\n\n• What type of pet do you have?\n• What service are you looking for?\n• Any specific needs or dates?",
    quickReplies: ["Dog boarding", "Cat sitting", "Dog walking", "Anxious pet"],
  };
}

// ─── Provider Card (inline in chat) ──────────────────────────────────────────
function InlinePoviderCard({ provider, index }: { provider: Provider; index: number }) {
  return (
    <Link href={`/providers/${provider.id}`}>
      <div className="bg-white border border-gray-100 rounded-2xl p-4 hover:shadow-md hover:border-amber-200 transition-all group cursor-pointer">
        <div className="flex gap-3">
          <div className={`w-11 h-11 rounded-xl ${AVATAR_COLORS[index % AVATAR_COLORS.length]} flex items-center justify-center text-white text-sm font-bold shrink-0`}>
            {provider.avatar}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 flex-wrap">
                <p className="font-semibold text-gray-900 text-sm group-hover:text-amber-500 transition-colors">{provider.name}</p>
                {provider.badge && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    provider.badge === "Superhost" ? "bg-amber-100 text-amber-600" : "bg-yellow-100 text-yellow-700"
                  }`}>{provider.badge}</span>
                )}
              </div>
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full shrink-0">🤖 {provider.aiScore}</span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">{provider.location} · {provider.distance}km</p>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-yellow-400 text-xs">★</span>
              <span className="text-xs font-semibold text-gray-700">{provider.rating}</span>
              <span className="text-xs text-gray-400">({provider.reviewCount})</span>
            </div>
          </div>
          <div className="text-right shrink-0">
            <p className="text-sm font-bold text-gray-900">${provider.priceFrom}</p>
            <p className="text-[10px] text-gray-400">/night</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mt-2.5">
          {provider.aiTags.slice(0, 2).map(t => (
            <span key={t} className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">{t}</span>
          ))}
        </div>

        <div className="flex flex-wrap gap-1 mt-1.5">
          {provider.services.slice(0, 3).map(s => (
            <span key={s} className="text-[10px] bg-amber-50 text-amber-500 border border-amber-100 px-2 py-0.5 rounded-full">
              {SERVICE_ICONS[s]} {SERVICE_LABELS[s]}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}

// ─── Typing indicator ─────────────────────────────────────────────────────────
function TypingIndicator() {
  return (
    <div className="flex gap-3 items-end">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center text-white shrink-0">🤖</div>
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

// ─── Main Page ────────────────────────────────────────────────────────────────
const INITIAL_MSG: Message = {
  id: "init",
  role: "ai",
  text: "Hi! I'm Pet Care AI 🐾\n\nTell me about your pet and what you need — I'll find the best carers near you instantly.\n\nFor example: *\"I have an anxious golden retriever who needs boarding for 5 nights next week\"*",
  quickReplies: ["🐶 Dog boarding", "🐱 Cat sitter", "🦮 Dog walking", "😰 Anxious pet", "💰 Budget options", "🌳 Has a yard"],
};

export default function AIPage() {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MSG]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  async function sendMessage(text: string) {
    if (!text.trim()) return;
    setInput("");

    const userMsg: Message = { id: crypto.randomUUID(), role: "user", text };
    setMessages(prev => [...prev, userMsg]);

    setTyping(true);
    await new Promise(r => setTimeout(r, 800 + Math.random() * 700));
    setTyping(false);

    const reply = buildAIReply(text);
    setMessages(prev => [...prev, { ...reply, id: crypto.randomUUID() }]);
    setTimeout(() => inputRef.current?.focus(), 100);
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Nav */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 text-gray-600 hover:text-amber-500 text-sm font-medium transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
            Browse providers
          </Link>
          <Link href="/" className="flex items-center gap-2">
            <span>🐾</span>
            <span className="font-bold text-amber-500">Pet Care AI</span>
          </Link>
          <div className="w-8 h-8 rounded-full bg-amber-400 flex items-center justify-center text-white text-xs font-bold">S</div>
        </div>
      </nav>

      {/* Chat window */}
      <div className="flex-1 max-w-3xl mx-auto w-full px-4 py-6 flex flex-col" style={{ height: "calc(100vh - 64px)" }}>
        <div className="flex-1 overflow-y-auto space-y-5 pb-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "items-end"}`}>
              {msg.role === "ai" && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center text-white shrink-0 mb-auto mt-1">🤖</div>
              )}

              <div className={`flex flex-col gap-3 ${msg.role === "user" ? "items-end max-w-[75%]" : "items-start flex-1"}`}>
                {/* Bubble */}
                <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
                  msg.role === "ai"
                    ? "bg-white border border-gray-100 shadow-sm rounded-bl-sm text-gray-700"
                    : "bg-amber-500 text-white rounded-br-sm"
                }`}>
                  {msg.text.split(/\*(.*?)\*/).map((part, i) =>
                    i % 2 === 1 ? <em key={i} className="font-medium not-italic text-amber-200">{part}</em> : part
                  )}
                </div>

                {/* Provider cards */}
                {msg.providerCards && (
                  <div className="w-full space-y-2">
                    {msg.providerCards.providers.map((p, i) => (
                      <InlinePoviderCard key={p.id} provider={p} index={i} />
                    ))}
                    <Link href="/dashboard" className="block text-center text-xs text-amber-500 hover:underline py-1 font-medium">
                      See all providers →
                    </Link>
                  </div>
                )}

                {/* Quick replies */}
                {msg.quickReplies && (
                  <div className="flex flex-wrap gap-2">
                    {msg.quickReplies.map((r) => (
                      <button
                        key={r}
                        onClick={() => sendMessage(r)}
                        className="text-xs bg-white border border-gray-200 text-gray-600 px-3 py-1.5 rounded-full hover:border-amber-400 hover:text-amber-500 hover:bg-amber-50 transition-all font-medium"
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {typing && <TypingIndicator />}
          <div ref={bottomRef} />
        </div>

        {/* Input bar */}
        <div className="border-t border-gray-100 pt-4 bg-gray-50">
          <form
            onSubmit={(e) => { e.preventDefault(); sendMessage(input); }}
            className="flex gap-3 items-center bg-white border border-gray-200 rounded-2xl px-4 py-2.5 shadow-sm focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-100 transition-all"
          >
            <span className="text-xl">🐾</span>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tell me about your pet and what you need…"
              disabled={typing}
              className="flex-1 text-sm text-gray-800 placeholder-gray-400 outline-none bg-transparent disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!input.trim() || typing}
              className="bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-white rounded-xl w-9 h-9 flex items-center justify-center shrink-0 transition-colors"
            >
              <svg className="w-4 h-4 rotate-90" fill="currentColor" viewBox="0 0 24 24"><path d="M2 21l21-9L2 3v7l15 2-15 2v7z"/></svg>
            </button>
          </form>
          <p className="text-center text-[10px] text-gray-300 mt-2">Pet Care AI · Responses are simulated for demo purposes</p>
        </div>
      </div>
    </div>
  );
}
