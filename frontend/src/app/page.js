import Image from "next/image";

const kantins = [
  {
    name: "Kantin A",
    desc: "FASILKOM - Nasi Goreng, Mie Ayam, Soto",
    rating: 4.8,
    status: "Open",
    time: "10 min",
    distance: "200m",
    gradient: "from-amber-200 to-orange-300",
  },
  {
    name: "Kantin B",
    desc: "FEB - Coffee, Pastries, Healthy Bowls",
    rating: 4.5,
    status: "Open",
    time: "5 min",
    distance: "50m",
    gradient: "from-emerald-200 to-teal-300",
  },
  {
    name: "Kantin C",
    desc: "FIB - Traditional Snacks, Bakso, Es Teh",
    rating: 4.9,
    status: "Coming Soon",
    time: "15 min",
    distance: "500m",
    gradient: "from-rose-200 to-red-300",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FBF3E4]">
      {/* Header */}
      <header className="bg-white border-b border-black/5">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2 font-bold text-lg text-[#2F4B2E]">
            <span className="inline-block h-6 w-6 rounded bg-[#2F4B2E]" />
            UI Food Hub
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-600">
            <a href="#" className="text-[#2F4B2E] border-b-2 border-[#2F4B2E] pb-1">
              Canteens
            </a>
            <a href="#" className="hover:text-[#2F4B2E]">
              My Orders
            </a>
            <a href="#" className="hover:text-[#2F4B2E]">
              Promos
            </a>
          </nav>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 bg-zinc-100 rounded-full px-4 py-2 text-sm text-zinc-500 w-64">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="7" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <span>Search food...</span>
            </div>
            <button className="text-zinc-500 hover:text-[#2F4B2E]" aria-label="Notifications">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.7 21a2 2 0 0 1-3.4 0" />
              </svg>
            </button>
            <button className="text-zinc-500 hover:text-[#2F4B2E]" aria-label="History">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 3v5h5" />
                <path d="M3.05 13A9 9 0 1 0 6 5.3L3 8" />
                <path d="M12 7v5l4 2" />
              </svg>
            </button>
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-amber-300 to-orange-400" />
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="max-w-6xl mx-auto px-6 pt-8">
          <div className="relative h-64 md:h-72 rounded-2xl overflow-hidden bg-gradient-to-br from-zinc-700 to-zinc-900 flex items-center justify-center text-center">
            <div className="absolute inset-0 bg-black/40" />
            <div className="relative z-10 px-4">
              <h1 className="text-white text-3xl md:text-4xl font-bold">
                Welcome to UI Food Hub
              </h1>
              <p className="text-white/90 mt-2 text-sm md:text-base">
                Discover the best meals across campus. Fast, fresh, and ready when you are.
              </p>
            </div>
          </div>
        </section>

        {/* Canteen list */}
        <section className="max-w-6xl mx-auto px-6 py-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-zinc-900">Temukan Kantin</h2>
            <a href="#" className="text-sm font-medium text-[#2F4B2E] flex items-center gap-1">
              View All
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {kantins.map((k) => (
              <div
                key={k.name}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-black/5"
              >
                <div className={`relative h-36 bg-gradient-to-br ${k.gradient}`}>
                  <span className="absolute top-3 right-3 bg-white/90 rounded-full px-2 py-1 text-xs font-semibold flex items-center gap-1">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="text-amber-500">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    {k.rating}
                  </span>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-zinc-900">{k.name}</h3>
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        k.status === "Open"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {k.status}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-500 mb-3">{k.desc}</p>
                  <div className="flex items-center gap-4 text-xs text-zinc-400">
                    <span className="flex items-center gap-1">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 6v6l4 2" />
                      </svg>
                      {k.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 21s7-6.5 7-11.8A7 7 0 0 0 5 9.2C5 14.5 12 21 12 21z" />
                        <circle cx="12" cy="9" r="2.5" />
                      </svg>
                      {k.distance}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#EFE7D3] border-t border-black/5">
        <div className="max-w-6xl mx-auto px-6 py-8 text-center">
          <h3 className="font-semibold text-zinc-800 mb-2">UI Food Hub</h3>
          <div className="flex justify-center gap-4 text-sm text-zinc-600 mb-3">
            <a href="#" className="hover:text-[#2F4B2E] underline">Support</a>
            <a href="#" className="hover:text-[#2F4B2E] underline">Privacy Policy</a>
            <a href="#" className="hover:text-[#2F4B2E] underline">Campus Map</a>
            <a href="#" className="hover:text-[#2F4B2E] underline">Terms of Service</a>
          </div>
          <p className="text-xs text-zinc-500">© 2024 Universitas Indonesia Food Services</p>
        </div>
      </footer>
    </div>
  );
}