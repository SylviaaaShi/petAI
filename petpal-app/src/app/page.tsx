import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";

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
  { name: "James T.", pet: "Two cats, one anxious", text: "Pet Care understood my anxious cat's needs instantly. Outstanding experience." },
  { name: "Mei W.", pet: "Rabbit owner", text: "Hard to find rabbit-friendly carers, but Pet Care found three great options in minutes." },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* ── Hero ── */}
      <section className="bg-gradient-to-br from-amber-50 to-amber-50/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Left: copy */}
            <div>
              <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
                AI-Powered Pet Care Matching
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight mb-6">
                Your Pet Deserves the{" "}
                <span className="text-amber-500">Best Care</span>{" "}
                While You&apos;re Away
              </h1>
              <p className="text-lg text-gray-500 mb-10 leading-relaxed">
                Pet Care AI connects you with verified, local pet care providers. Our AI matches your pet with the perfect carer so you can travel worry-free.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/login"
                  className="bg-amber-500 text-white font-semibold px-8 py-4 rounded-full text-base hover:bg-amber-600 transition-colors shadow-lg shadow-amber-100 text-center"
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
              <div className="mt-10 flex flex-wrap gap-6 text-sm text-gray-400">
                <span>Verified providers</span>
                <span className="text-gray-200">|</span>
                <span>Secure payments</span>
                <span className="text-gray-200">|</span>
                <span>4.9 average rating</span>
                <span className="text-gray-200">|</span>
                <span>AI smart matching</span>
              </div>
            </div>

            {/* Right: photo grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl overflow-hidden aspect-square">
                <Image
                  src="/WechatIMG15.jpg"
                  alt="Golden Retriever"
                  width={600}
                  height={600}
                  className="w-full h-full object-cover"
                  priority
                />
              </div>
              <div className="rounded-2xl overflow-hidden aspect-square mt-8">
                <Image
                  src="/WechatIMG14.jpg"
                  alt="Tabby Cat"
                  width={600}
                  height={600}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="rounded-2xl overflow-hidden aspect-square">
                <Image
                  src="/WechatIMG17.jpg"
                  alt="Goldfish"
                  width={600}
                  height={600}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="rounded-2xl overflow-hidden aspect-square mt-8">
                <Image
                  src="/WechatIMG16.jpg"
                  alt="Blue Budgie"
                  width={600}
                  height={600}
                  className="w-full h-full object-cover"
                />
              </div>
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
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">How Pet Care Works</h2>
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
              <div key={t.name} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
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
      <section className="py-20 px-4 bg-gradient-to-r from-amber-500 to-amber-500">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to Find the Perfect Carer?</h2>
          <p className="text-amber-100 mb-8 text-lg">Sign up free and let AI find the best match for your pet in seconds.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login" className="bg-white text-amber-500 font-semibold px-8 py-4 rounded-full hover:bg-amber-50 transition-colors">
              Get Started Free
            </Link>
            <Link href="/login" className="border-2 border-white text-white font-semibold px-8 py-4 rounded-full hover:bg-white/10 transition-colors">
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
