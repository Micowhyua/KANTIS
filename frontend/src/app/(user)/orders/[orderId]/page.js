"use client";

import {
  Search,
  Bell,
  History,
  User,
  HelpCircle,
  Bike,
  Clock,
} from "lucide-react";

const orderItems = [
  {
    id: 1,
    name: "Ayam Geprek Pak Slamet",
    variant: "Level Pedas: Sedang",
    qty: 1,
    price: 22000,
    image:
      "https://images.unsplash.com/photo-1603133872878-684f208fb84b?q=80&w=200&auto=format&fit=crop",
  },
  {
    id: 2,
    name: "Es Teh Manis",
    variant: "-",
    qty: 1,
    price: 6000,
    image:
      "https://images.unsplash.com/photo-1499638673689-79a0b5115d87?q=80&w=200&auto=format&fit=crop",
  },
];

const updates = [
  {
    id: 1,
    title: "Sedang diantar",
    description: "Pesananmu sedang diantar oleh kurir menuju Kantin B.",
    time: "10:38 AM",
    active: true,
  },
  {
    id: 2,
    title: "Pesanan diterima",
    description: "Penjual telah menerima dan menyiapkan pesananmu.",
    time: "10:15 AM",
    active: false,
  },
  {
    id: 3,
    title: "Pesanan dibuat",
    description: "Pembayaran berhasil diverifikasi.",
    time: "10:10 AM",
    active: false,
  },
];

function formatRupiah(value) {
  return "Rp " + value.toLocaleString("id-ID");
}

export default function OrderTrackingPage() {
  const subtotal = orderItems.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );
  const deliveryFee = 3000;
  const platformFee = 1000;
  const total = subtotal + deliveryFee + platformFee;

  return (
    <div className="min-h-screen bg-[#FBF7EF] text-stone-800">
      {/* Navbar */}
      <header className="sticky top-0 z-20 bg-[#FBF7EF]/90 backdrop-blur border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-wrap items-center gap-4">
          <a href="#" className="text-lg font-bold tracking-tight text-stone-900 shrink-0">
            UI Food Hub
          </a>

          <div className="flex-1 min-w-[160px] order-3 sm:order-2">
            <div className="relative max-w-md w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="text"
                placeholder="Cari..."
                className="w-full bg-white border border-stone-200 rounded-full pl-9 pr-4 py-2 text-sm text-stone-700 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-olive-500/40"
              />
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 order-2 sm:order-3 text-sm font-medium text-stone-600">
            <a href="#" className="hover:text-stone-900 transition-colors">
              Canteens
            </a>
            <a href="#" className="text-olive-700 border-b-2 border-olive-600 pb-1">
              My Orders
            </a>
            <a href="#" className="hover:text-stone-900 transition-colors">
              Promos
            </a>
          </nav>

          <div className="flex items-center gap-4 order-4 ml-auto sm:ml-0">
            <button aria-label="Notifications" className="text-stone-500 hover:text-stone-800 transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            <button aria-label="Order history" className="text-stone-500 hover:text-stone-800 transition-colors">
              <History className="w-5 h-5" />
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
        {/* Page header */}
        <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-stone-900">Order #UI-1024</h1>
            <p className="text-sm text-stone-400 mt-1">Dipesan pada 24 Okt, 10:37 AM</p>
          </div>
          <button className="inline-flex items-center gap-1.5 border border-stone-200 bg-white text-stone-600 text-sm font-medium px-4 py-2 rounded-full hover:bg-stone-50 transition-colors">
            <HelpCircle className="w-4 h-4" />
            Butuh Bantuan?
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left column */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Status banner */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="bg-amber-50 px-5 py-3 flex items-center justify-between">
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-amber-700">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  Sedang Diantar
                </span>
                <Bike className="w-5 h-5 text-amber-600" />
              </div>

              {/* Item summary */}
              <div className="p-4 flex items-center gap-4 border-b border-stone-100">
                <img
                  src="https://images.unsplash.com/photo-1603133872878-684f208fb84b?q=80&w=200&auto=format&fit=crop"
                  alt="Ayam Geprek Pak Slamet"
                  className="w-14 h-14 rounded-lg object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-stone-900 truncate">
                    Ayam Geprek Pak Slamet
                  </p>
                  <p className="text-xs text-stone-400 mt-0.5">
                    di Kantin Fakultas Teknik
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs text-stone-400 mb-0.5">Est. Kedatangan</p>
                  <p className="text-sm font-bold text-olive-700">10:45 AM</p>
                </div>
              </div>

              {/* Map */}
              <div className="relative h-52 sm:h-60">
                <MapPlaceholder />
              </div>

              {/* Courier row */}
              <div className="p-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-amber-400 flex items-center justify-center text-stone-900 font-bold text-sm shrink-0">
                  WA
                </div>
                <div>
                  <p className="text-sm font-semibold text-stone-900">Wahyu Ari</p>
                  <p className="text-xs text-stone-400">
                    Sedang menuju Kantin B, ikuti rute di atas.
                  </p>
                </div>
              </div>
            </div>

            {/* Order updates */}
            <div className="bg-white rounded-xl shadow-sm p-5">
              <h2 className="font-semibold text-stone-900 mb-4">Order Updates</h2>

              <div className="flex flex-col">
                {updates.map((update, idx) => (
                  <div key={update.id} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <span
                        className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${
                          update.active ? "bg-amber-500" : "bg-olive-600"
                        }`}
                      />
                      {idx < updates.length - 1 && (
                        <span className="w-px flex-1 bg-stone-200 my-1" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0 pb-5">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-semibold text-stone-900">
                          {update.title}
                        </p>
                        <span className="inline-flex items-center gap-1 text-xs text-stone-400 shrink-0">
                          <Clock className="w-3 h-3" />
                          {update.time}
                        </span>
                      </div>
                      <p className="text-xs text-stone-400 mt-0.5">
                        {update.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right column */}
          <div>
            <div className="bg-white rounded-xl shadow-sm p-5 sticky top-24">
              <h2 className="font-semibold text-stone-900 mb-4">Detail Pesanan</h2>

              <div className="flex flex-col gap-4 mb-4">
                {orderItems.map((item) => (
                  <div key={item.id} className="flex items-start gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 rounded-lg object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium text-stone-900">
                          {item.name}
                        </p>
                        <span className="text-sm font-semibold text-stone-800 shrink-0">
                          {formatRupiah(item.price)}
                        </span>
                      </div>
                      <p className="text-xs text-stone-400 mt-0.5">
                        {item.variant}
                      </p>
                      <span className="inline-block mt-1.5 bg-amber-400 text-stone-900 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                        {item.qty}x
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-stone-100 pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-stone-500">
                  <span>Subtotal</span>
                  <span>{formatRupiah(subtotal)}</span>
                </div>
                <div className="flex justify-between text-stone-500">
                  <span>Delivery Fee</span>
                  <span>{formatRupiah(deliveryFee)}</span>
                </div>
                <div className="flex justify-between text-stone-500">
                  <span>Platform Fee</span>
                  <span>{formatRupiah(platformFee)}</span>
                </div>
              </div>

              <div className="border-t border-stone-100 mt-4 pt-4 flex justify-between items-center">
                <span className="font-semibold text-stone-900">Total</span>
                <span className="font-bold text-olive-700 text-lg">
                  {formatRupiah(total)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#F3EEE1] border-t border-stone-200 mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 text-center">
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

function MapPlaceholder() {
  return (
    <svg
      viewBox="0 0 400 240"
      className="w-full h-full"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label="Peta rute pengiriman"
    >
      <rect width="400" height="240" fill="#EAE6D9" />

      {/* streets */}
      <rect x="0" y="110" width="400" height="14" fill="#F7F4EC" />
      <rect x="180" y="0" width="14" height="240" fill="#F7F4EC" />
      <rect x="280" y="0" width="10" height="240" fill="#F7F4EC" />

      {/* buildings */}
      <rect x="30" y="30" width="90" height="60" rx="4" fill="#D8CFB0" />
      <rect x="30" y="140" width="70" height="50" rx="4" fill="#D8CFB0" />
      <rect x="210" y="30" width="55" height="60" rx="4" fill="#CFE0CF" />
      <rect x="310" y="30" width="70" height="70" rx="4" fill="#D8CFB0" />
      <rect x="210" y="140" width="150" height="70" rx="4" fill="#E4D9BE" />

      {/* green patches */}
      <circle cx="150" cy="60" r="10" fill="#B8CBA0" />
      <circle cx="170" cy="150" r="8" fill="#B8CBA0" />
      <circle cx="300" cy="120" r="9" fill="#B8CBA0" />

      {/* route path */}
      <path
        d="M60 175 L60 117 L186 117 L186 60 L300 60"
        fill="none"
        stroke="#D97706"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="1 10"
      />

      {/* courier marker */}
      <circle cx="130" cy="117" r="9" fill="#F59E0B" stroke="white" strokeWidth="2" />
      <circle cx="130" cy="117" r="3" fill="white" />

      {/* destination marker */}
      <path
        d="M300 40 C292 40 286 46 286 54 C286 64 300 78 300 78 C300 78 314 64 314 54 C314 46 308 40 300 40 Z"
        fill="#66722F"
      />
      <circle cx="300" cy="54" r="5" fill="white" />
    </svg>
  );
}