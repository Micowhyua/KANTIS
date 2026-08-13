"use client";

import {
  Search,
  ShoppingBag,
  Clock,
  User,
  Share2,
  Bookmark,
  Star,
  Wallet,
  ChevronRight,
} from "lucide-react";

const vendors = [
  {
    id: 1,
    name: "Nasi Ayam Pak Slamet",
    description: "Legendary! Nasi ayam dengan rasa autentik dan favorit turun temurun di FIB.",
    image:
      "https://images.unsplash.com/photo-1512058564366-18510be2db19?q=80&w=800&auto=format&fit=crop",
    rating: 4.8,
    time: "10-15 min",
    price: "Rp 12rb - 20rb",
  },
  {
    id: 2,
    name: "Minuman Segar Miko",
    description: "Teh jeruk, kopi es, dan jus segar. Yang terbaik untuk kembali fokus belajar.",
    image:
      "https://images.unsplash.com/photo-1544145945-f90425340c7e?q=80&w=800&auto=format&fit=crop",
    rating: 4.6,
    time: "3-5 min",
    price: "Rp 5rb - 12rb",
  },
  {
    id: 3,
    name: "Mie Ayam Bang Ojan",
    description: "Comforting mie ayam dengan topping lengkap, favorit segala kalangan mahasiswa.",
    image:
      "https://images.unsplash.com/photo-1585032226651-759b368d7246?q=80&w=800&auto=format&fit=crop",
    rating: 4.7,
    time: "8-12 min",
    price: "Rp 10rb - 18rb",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FBF7EF] text-stone-800">
      {/* Navbar */}
      <header className="sticky top-0 z-20 bg-[#FBF7EF]/90 backdrop-blur border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-wrap items-center gap-4">
          <a href="#" className="text-lg font-bold tracking-tight text-stone-900 shrink-0">
            UI Food Hub
          </a>

          <div className="flex-1 min-w-[180px] order-3 sm:order-2">
            <div className="relative max-w-md w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="text"
                placeholder="Cari kantin, pedagang, menu..."
                className="w-full bg-white border border-stone-200 rounded-full pl-9 pr-4 py-2 text-sm text-stone-700 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-olive-500/40"
              />
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 order-2 sm:order-3 text-sm font-medium text-stone-600">
            <a href="#" className="text-olive-700 border-b-2 border-olive-600 pb-1">
              Canteens
            </a>
            <a href="#" className="hover:text-stone-900 transition-colors">
              My Orders
            </a>
            <a href="#" className="hover:text-stone-900 transition-colors">
              Promos
            </a>
          </nav>

          <div className="flex items-center gap-4 order-4 ml-auto sm:ml-0">
            <button aria-label="Shopping bag" className="text-stone-500 hover:text-stone-800 transition-colors">
              <ShoppingBag className="w-5 h-5" />
            </button>
            <button aria-label="Order history" className="text-stone-500 hover:text-stone-800 transition-colors">
              <Clock className="w-5 h-5" />
            </button>
            <button
              aria-label="Profile"
              className="w-8 h-8 rounded-full bg-olive-600 flex items-center justify-center text-white"
            >
              <User className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-sm text-stone-500 mb-5">
          <a href="#" className="hover:text-stone-700 transition-colors">
            Home
          </a>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-stone-800 font-medium">Kantin B</span>
        </div>

        {/* Hero / Canteen info card */}
        <section className="bg-white rounded-2xl shadow-sm overflow-hidden mb-12 grid md:grid-cols-2">
          <div className="h-56 md:h-full min-h-[260px]">
            <img
              src="https://images.unsplash.com/photo-1567521464027-f127ff144326?q=80&w=1200&auto=format&fit=crop"
              alt="Suasana Kantin B"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="p-6 sm:p-8 flex flex-col justify-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 mb-1.5">
              Kantin B
            </h1>
            <p className="text-sm text-stone-500 mb-4">
              Fakultas Ilmu Pengetahuan Budaya (FIB)
            </p>
            <p className="text-stone-600 text-sm leading-relaxed mb-5">
              Sebuah hub kuliner ramai di jantung Fakultas Ilmu Pengetahuan
              Budaya, tempat mahasiswa berkumpul untuk menikmati beragam
              hidangan lezat di antara jam kuliah.
            </p>

            <div className="mb-6">
              <span className="inline-flex items-center gap-1.5 bg-olive-100 text-olive-700 text-xs font-semibold px-3 py-1.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-olive-600" />
                Open Now (08:00 - 16:00)
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button className="inline-flex items-center gap-2 border border-stone-200 text-stone-600 text-sm font-medium px-4 py-2 rounded-full hover:bg-stone-50 transition-colors">
                <Share2 className="w-4 h-4" />
                Share
              </button>
              <button className="inline-flex items-center gap-2 border border-stone-200 text-stone-600 text-sm font-medium px-4 py-2 rounded-full hover:bg-stone-50 transition-colors">
                <Bookmark className="w-4 h-4" />
                Save
              </button>
            </div>
          </div>
        </section>

        {/* Vendors */}
        <section>
          <h2 className="text-xl font-bold text-stone-900 mb-5">
            Pedagang di Kantin B
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {vendors.map((vendor) => (
              <div
                key={vendor.id}
                className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col"
              >
                <div className="relative h-40">
                  <img
                    src={vendor.image}
                    alt={vendor.name}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-2.5 right-2.5 inline-flex items-center gap-1 bg-white/95 text-stone-700 text-xs font-semibold px-2 py-1 rounded-full shadow-sm">
                    <Star className="w-3.5 h-3.5 fill-olive-500 text-olive-500" />
                    {vendor.rating}
                  </span>
                </div>

                <div className="p-4 flex flex-col flex-1">
                  <h3 className="font-semibold text-stone-900 mb-1">
                    {vendor.name}
                  </h3>
                  <p className="text-sm text-stone-500 mb-4 leading-relaxed flex-1">
                    {vendor.description}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-stone-500 mb-4">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {vendor.time}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Wallet className="w-3.5 h-3.5" />
                      {vendor.price}
                    </span>
                  </div>

                  <button className="w-full bg-olive-600 hover:bg-olive-700 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors">
                    Lihat Menu
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#F3EEE1] border-t border-stone-200 mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 text-center">
          <p className="font-semibold text-stone-800 mb-4">
            Universitas Indonesia Food Services
          </p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-stone-500 mb-6">
            <a href="#" className="hover:text-stone-800 transition-colors">
              Support
            </a>
            <a href="#" className="hover:text-stone-800 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-stone-800 transition-colors">
              Campus Map
            </a>
            <a href="#" className="hover:text-stone-800 transition-colors">
              Terms of Service
            </a>
          </div>
          <p className="text-xs text-stone-400">
            © {new Date().getFullYear()} Universitas Indonesia Food Services. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}