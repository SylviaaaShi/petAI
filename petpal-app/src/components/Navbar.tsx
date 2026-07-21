"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
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
    setUser(null);
    setDropdownOpen(false);
    router.push("/login");
  }

  const initials = user?.name?.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase() ?? "U";

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🐾</span>
            <span className="text-xl font-bold text-amber-500">Pet Care AI</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="#how-it-works" className="text-gray-600 hover:text-amber-500 text-sm font-medium transition-colors">How it Works</Link>
            <Link href="#services" className="text-gray-600 hover:text-amber-500 text-sm font-medium transition-colors">Services</Link>
            <Link href="#providers" className="text-gray-600 hover:text-amber-500 text-sm font-medium transition-colors">Find Providers</Link>
          </div>

          {/* Auth area */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen((o) => !o)}
                  className="w-9 h-9 rounded-full bg-amber-500 flex items-center justify-center text-white text-sm font-bold hover:bg-amber-600 transition-colors"
                >
                  {initials}
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 top-11 w-44 bg-white border border-gray-100 rounded-xl shadow-lg py-1 z-50">
                    <div className="px-4 py-2 border-b border-gray-50">
                      <p className="text-xs font-semibold text-gray-800 truncate">{user.name}</p>
                      <p className="text-xs text-gray-400 capitalize">{user.role === "provider" ? "Care Provider" : "Pet Owner"}</p>
                    </div>
                    <Link
                      href={user.role === "provider" ? "/provider" : "/dashboard"}
                      className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
                    >
                      Log out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium text-gray-700 hover:text-amber-500 transition-colors">Login</Link>
                <Link href="/register" className="text-sm font-medium bg-amber-500 text-white px-4 py-2 rounded-full hover:bg-amber-600 transition-colors">Sign Up</Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-md text-gray-600 hover:text-amber-500"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 pb-4 pt-2 space-y-2">
          <Link href="#how-it-works" className="block py-2 text-sm text-gray-600 hover:text-amber-500">How it Works</Link>
          <Link href="#services" className="block py-2 text-sm text-gray-600 hover:text-amber-500">Services</Link>
          <Link href="#providers" className="block py-2 text-sm text-gray-600 hover:text-amber-500">Find Providers</Link>
          {user ? (
            <div className="pt-2 border-t border-gray-100">
              <p className="text-xs text-gray-400 mb-2">{user.name}</p>
              <button onClick={logout} className="w-full text-left text-sm text-red-500 font-medium py-2">Log out</button>
            </div>
          ) : (
            <div className="flex gap-3 pt-2">
              <Link href="/login" className="flex-1 text-center text-sm font-medium border border-gray-300 py-2 rounded-full hover:border-amber-500 hover:text-amber-500 transition-colors">Login</Link>
              <Link href="/register" className="flex-1 text-center text-sm font-medium bg-amber-500 text-white py-2 rounded-full hover:bg-amber-600 transition-colors">Sign Up</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
