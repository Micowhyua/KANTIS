"use client";

import { useState } from "react";
import {
  Search,
  Bell,
  History,
  User,
  MapPin,
  Minus,
  Plus,
  StickyNote,
  ChevronRight,
  Circle,
  CheckCircle2,
  Tag,
} from "lucide-react";

const initialItems = [
  {
    id: 1,
    name: "Nasi Campur Spesial",
    variant: "Tanpa krupuk, pedas sedang",
    price: 26500,
    qty: 2,
    image:
      "https://images.unsplash.com/photo-1512058564366-18510be2db19?q=80&w=200&auto=format&fit=crop",
  },
  {
    id: 2,
    name: "Es Teh Manis",
    variant: "Level normal",
    price: 5000,
    qty: 2,
    image:
      "https://images.unsplash.com/photo-1544145945-f90425340c7e?q=80&w=200&auto=format&fit=crop",
  },
];

function formatRupiah(value) {
  return "Rp " + value.toLocaleString("id-ID");
}

export default function CheckoutPage() {
  const [items, setItems] = useState(initialItems);
  const [promoCode, setPromoCode] = useState("");

  const updateQty = (id, delta) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, qty: Math.max(1, item.qty + delta) }
          : item
      )
    );
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const ongkosKirim = 4000;
  const biayaLayanan = 2000;
  const total = subtotal + ongkosKirim + biayaLayanan;

  return (
    <div className="min-h-screen bg-[#FBF7EF] text-stone-800">
      {/* Navbar */}
      <header className="sticky top-0 z-20 bg-[#FBF7EF]/90 backdrop-blur border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-wrap items-center gap-4">
          <a href="#" className="text-lg font-bold tracking-tight text-stone-900 shrink-0">
            UI Food Hub
          </a>

          <nav className="hidden md:flex items-center gap-6 order-2 text-sm font-medium text-stone-600 ml-2">
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

          <div className="flex-1 min-w-[160px] order-3 md:order-3">
            <div className="relative max-w-md w-full ml-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="text"
                placeholder="Cari..."
                className="w-full bg-white border border-stone-200 rounded-full pl-9 pr-4 py-2 text-sm text-stone-700 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-olive-500/40"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 order-4">
            <button aria-label="Notifications" className="text-stone-500 hover:text-stone-800 transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            <button aria-label="Order history" className="text-stone-500 hover:text-stone-800 transition-colors">
              <History className="w-5 h-5" />
            </button>
            <button
              aria-label="Profile"
              className="w-8 h-8 rounded-full bg-olive-600 flex items-center justify-center text-white overflow-hidden"
            >
              <User className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left column */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Lokasi Pengiriman */}
            <section className="bg-white rounded-xl shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-stone-900">Lokasi Pengiriman</h2>
                <button className="text-sm text-olive-700 font-medium hover:underline">
                  Ubah
                </button>
              </div>

              <div className="flex gap-3">
                <MapPin className="w-4 h-4 text-olive-600 mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-sm text-stone-900">
                    Fakultas Ilmu Komputer (FASILKOM)
                  </p>
                  <p className="text-sm text-stone-500 mt-0.5">
                    Gedung Baru, Lantai 2, Ruang B201, UI Kampus Depok, Jawa
                    Barat 16424
                  </p>
                  <p className="text-xs text-stone-400 mt-1.5 italic">
                    Catatan: titip di depan jika tidak ada di tempat
                  </p>
                </div>
              </div>
            </section>

            {/* Pesanan Anda */}
            <section className="bg-white rounded-xl shadow-sm p-5">
              <h2 className="font-semibold text-stone-900 mb-1">Pesanan Anda</h2>
              <p className="text-xs text-stone-400 mb-4">
                dari: Kantin Merdeka &middot; Nasi Campur Bu Siti
              </p>

              <div className="divide-y divide-stone-100">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 py-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-14 h-14 rounded-lg object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-stone-900 truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-stone-400 mt-0.5">
                        {item.variant}
                      </p>
                      <p className="text-sm font-semibold text-stone-800 mt-1">
                        {formatRupiah(item.price)}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 bg-stone-100 rounded-full px-1.5 py-1 shrink-0">
                      <button
                        onClick={() => updateQty(item.id, -1)}
                        aria-label="Kurangi jumlah"
                        className="w-6 h-6 rounded-full bg-white shadow-sm flex items-center justify-center text-stone-600 hover:bg-stone-50"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-sm font-medium w-4 text-center">
                        {item.qty}
                      </span>
                      <button
                        onClick={() => updateQty(item.id, 1)}
                        aria-label="Tambah jumlah"
                        className="w-6 h-6 rounded-full bg-white shadow-sm flex items-center justify-center text-stone-600 hover:bg-stone-50"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full flex items-center justify-between pt-4 mt-1 border-t border-stone-100 text-sm text-stone-500 hover:text-stone-700 transition-colors">
                <span className="inline-flex items-center gap-2">
                  <StickyNote className="w-4 h-4" />
                  Tambah Catatan untuk Pesanan
                </span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </section>
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-6">
            {/* Metode Pembayaran */}
            <section className="bg-[#F3EEE1] rounded-xl p-5">
              <h2 className="font-semibold text-stone-900 mb-4">
                Metode Pembayaran
              </h2>

              <div className="bg-white rounded-lg p-3 flex items-center gap-3 shadow-sm">
                <div className="w-9 h-9 rounded-md bg-[#4C2A86] flex items-center justify-center shrink-0">
                  <span className="text-white text-[10px] font-bold">OVO</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-stone-900">OVO</p>
                  <p className="text-xs text-stone-400">
                    Saldo: Rp 250.000
                  </p>
                </div>
                <CheckCircle2 className="w-5 h-5 text-olive-600 shrink-0" />
              </div>

              <button className="w-full text-center text-sm text-olive-700 font-medium mt-4 hover:underline">
                Pilih Metode Lain
              </button>
            </section>

            {/* Ringkasan Pembayaran */}
            <section className="bg-[#F3EEE1] rounded-xl p-5">
              <h2 className="font-semibold text-stone-900 mb-4">
                Ringkasan Pembayaran
              </h2>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-stone-500">
                  <span>Subtotal ({items.length} item)</span>
                  <span>{formatRupiah(subtotal)}</span>
                </div>
                <div className="flex justify-between text-stone-500">
                  <span>Ongkos Kirim</span>
                  <span>{formatRupiah(ongkosKirim)}</span>
                </div>
                <div className="flex justify-between text-stone-500">
                  <span>Biaya Layanan</span>
                  <span>{formatRupiah(biayaLayanan)}</span>
                </div>
              </div>

              <div className="border-t border-stone-300/60 my-4" />

              <div className="flex justify-between items-center mb-4">
                <span className="font-semibold text-stone-900">
                  Total Pembayaran
                </span>
                <span className="font-bold text-olive-700 text-lg">
                  {formatRupiah(total)}
                </span>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <div className="relative flex-1">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Masukkan kode promo"
                    className="w-full bg-white border border-stone-200 rounded-lg pl-9 pr-3 py-2 text-sm text-stone-700 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-olive-500/40"
                  />
                </div>
                <button className="bg-stone-700 hover:bg-stone-800 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors shrink-0">
                  Terapkan
                </button>
              </div>

              <button className="w-full bg-olive-600 hover:bg-olive-700 text-white text-sm font-semibold py-3 rounded-lg transition-colors">
                Bayar Sekarang
              </button>
            </section>
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