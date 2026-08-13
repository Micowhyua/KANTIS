"use client";

import { useState, useMemo } from "react";
import {
  Search,
  Bell,
  History,
  User,
  Star,
  Clock,
  Footprints,
  Plus,
  Minus,
  ShoppingCart,
  CreditCard,
  UtensilsCrossed,
  Coffee,
} from "lucide-react";

const menuItems = [
  {
    id: 1,
    category: "Makanan",
    name: "Nasi Goreng Spesial",
    description: "Nasi goreng dengan telur, ayam suwir, dan acar segar.",
    price: 28000,
    image:
      "https://images.unsplash.com/photo-1603133872878-684f208fb84b?q=80&w=300&auto=format&fit=crop",
  },
  {
    id: 2,
    category: "Makanan",
    name: "Mie Ayam Bakso",
    description: "Mie ayam berisi ditambah 2 bakso sapi pilihan.",
    price: 18000,
    image:
      "https://images.unsplash.com/photo-1585032226651-759b368d7246?q=80&w=300&auto=format&fit=crop",
  },
  {
    id: 3,
    category: "Makanan",
    name: "Ayam Geprek Nasi",
    description: "Ayam crispy pedas dengan sambal bawang khas.",
    price: 22000,
    image: null,
  },
  {
    id: 4,
    category: "Minuman",
    name: "Es Teh Manis",
    description: "Teh manis segar dengan es batu.",
    price: 6000,
    image:
      "https://images.unsplash.com/photo-1499638673689-79a0b5115d87?q=80&w=300&auto=format&fit=crop",
  },
  {
    id: 5,
    category: "Minuman",
    name: "Kopi Susu Gula Aren",
    description: "Kopi susu dengan manis alami gula aren.",
    price: 15000,
    image: null,
  },
];

const tabs = ["Semua", "Makanan", "Minuman", "Snack"];

function formatRupiah(value) {
  return "Rp " + value.toLocaleString("id-ID");
}

export default function VendorPage() {
  const [activeTab, setActiveTab] = useState("Semua");
  const [basketView, setBasketView] = useState("order"); // "order" | "checkout"
  const [basket, setBasket] = useState({ 1: 1, 4: 1 });

  const updateQty = (id, delta) => {
    setBasket((prev) => {
      const nextQty = Math.max(0, (prev[id] || 0) + delta);
      const next = { ...prev, [id]: nextQty };
      if (nextQty === 0) delete next[id];
      return next;
    });
  };

  const visibleItems = useMemo(() => {
    if (activeTab === "Semua") return menuItems;
    return menuItems.filter((item) => item.category === activeTab);
  }, [activeTab]);

  const grouped = useMemo(() => {
    return visibleItems.reduce((acc, item) => {
      acc[item.category] = acc[item.category] || [];
      acc[item.category].push(item);
      return acc;
    }, {});
  }, [visibleItems]);

  const basketItems = Object.entries(basket)
    .map(([id, qty]) => {
      const item = menuItems.find((m) => m.id === Number(id));
      return item ? { ...item, qty } : null;
    })
    .filter(Boolean);

  const subtotal = basketItems.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  return (
    <div className="min-h-screen bg-[#FBF7EF] text-stone-800">
      {/* Navbar */}
      <header className="sticky top-0 z-20 bg-[#FBF7EF]/90 backdrop-blur border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-wrap items-center gap-4">
          <a href="#" className="text-lg font-bold tracking-tight text-stone-900 shrink-0">
            UI Food Hub
          </a>

          <nav className="hidden md:flex items-center gap-6 order-2 text-sm font-medium text-stone-600 ml-2">
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

          <div className="flex-1 min-w-[160px] order-3">
            <div className="relative max-w-md w-full ml-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="text"
                placeholder="Cari menu..."
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
              className="w-8 h-8 rounded-full bg-olive-600 flex items-center justify-center text-white"
            >
              <User className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left column */}
          <div className="lg:col-span-2">
            {/* Vendor hero */}
            <section className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
              <div className="relative h-48 sm:h-56">
                <img
                  src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1200&auto=format&fit=crop"
                  alt="Pak Slamet"
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-3 right-3 inline-flex items-center gap-1 bg-white/95 text-stone-700 text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  4.9 (250+)
                </span>
              </div>

              <div className="p-5">
                <div className="flex items-start justify-between gap-3 mb-1">
                  <h1 className="text-2xl font-bold text-stone-900">Pak Slamet</h1>
                  <span className="inline-flex items-center gap-1.5 bg-amber-400 text-stone-900 text-xs font-semibold px-3 py-1 rounded-full shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-stone-900" />
                    Open
                  </span>
                </div>
                <p className="text-sm text-stone-500 mb-4">
                  Indonesian Comfort Food &middot; Kantin Teknik
                </p>

                <div className="border-t border-stone-100 pt-3 flex items-center gap-5 text-sm text-stone-500">
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    08:00 - 17:00
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Footprints className="w-4 h-4" />
                    2 mins away
                  </span>
                </div>
              </div>
            </section>

            {/* Category tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeTab === tab
                      ? "bg-olive-600 text-white"
                      : "bg-[#F3EEE1] text-stone-600 hover:bg-stone-200"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Menu sections */}
            {Object.keys(grouped).length === 0 && (
              <p className="text-sm text-stone-400">
                Belum ada menu untuk kategori ini.
              </p>
            )}

            {Object.entries(grouped).map(([category, items]) => (
              <section key={category} className="mb-8">
                <h2 className="text-lg font-bold text-stone-900 mb-3">
                  {category}
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {items.map((item) => {
                    const qty = basket[item.id] || 0;
                    return (
                      <div
                        key={item.id}
                        className="bg-white rounded-xl shadow-sm p-3 flex gap-3"
                      >
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 rounded-lg object-cover shrink-0"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-lg bg-[#F3EEE1] flex items-center justify-center shrink-0">
                            {category === "Minuman" ? (
                              <Coffee className="w-6 h-6 text-stone-400" />
                            ) : (
                              <UtensilsCrossed className="w-6 h-6 text-stone-400" />
                            )}
                          </div>
                        )}

                        <div className="flex-1 min-w-0 flex flex-col">
                          <p className="text-sm font-semibold text-stone-900 truncate">
                            {item.name}
                          </p>
                          <p className="text-xs text-stone-400 mt-0.5 line-clamp-2">
                            {item.description}
                          </p>
                          <div className="flex items-center justify-between mt-auto pt-1">
                            <span className="text-sm font-semibold text-olive-700">
                              {formatRupiah(item.price)}
                            </span>

                            {qty === 0 ? (
                              <button
                                onClick={() => updateQty(item.id, 1)}
                                aria-label={`Tambah ${item.name}`}
                                className="w-7 h-7 rounded-full bg-amber-400 hover:bg-amber-500 text-stone-900 flex items-center justify-center transition-colors shrink-0"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            ) : (
                              <div className="flex items-center gap-1.5 bg-stone-100 rounded-full px-1 py-1 shrink-0">
                                <button
                                  onClick={() => updateQty(item.id, -1)}
                                  aria-label={`Kurangi ${item.name}`}
                                  className="w-6 h-6 rounded-full bg-white shadow-sm flex items-center justify-center text-stone-600 hover:bg-stone-50"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="text-xs font-medium w-4 text-center">
                                  {qty}
                                </span>
                                <button
                                  onClick={() => updateQty(item.id, 1)}
                                  aria-label={`Tambah ${item.name}`}
                                  className="w-6 h-6 rounded-full bg-white shadow-sm flex items-center justify-center text-stone-600 hover:bg-stone-50"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>

          {/* Right column - Basket */}
          <div>
            <div className="bg-[#F3EEE1] rounded-xl p-5 sticky top-24">
              <div className="flex items-center gap-2.5 pb-4 border-b border-stone-300/50 mb-4">
                <ShoppingCart className="w-5 h-5 text-olive-700" />
                <div>
                  <p className="font-semibold text-stone-900 text-sm">
                    Your Basket
                  </p>
                  <p className="text-xs text-stone-400">
                    Item yang kamu tambahkan akan muncul di sini
                  </p>
                </div>
              </div>

              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setBasketView("order")}
                  className={`flex-1 inline-flex items-center justify-center gap-1.5 text-sm font-medium py-2 rounded-lg transition-colors ${
                    basketView === "order"
                      ? "bg-amber-400 text-stone-900"
                      : "text-stone-500 hover:bg-stone-200/60"
                  }`}
                >
                  <ShoppingCart className="w-4 h-4" />
                  Current Order
                </button>
                <button
                  onClick={() => setBasketView("checkout")}
                  className={`flex-1 inline-flex items-center justify-center gap-1.5 text-sm font-medium py-2 rounded-lg transition-colors ${
                    basketView === "checkout"
                      ? "bg-amber-400 text-stone-900"
                      : "text-stone-500 hover:bg-stone-200/60"
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  Checkout
                </button>
              </div>

              {basketItems.length === 0 ? (
                <p className="text-sm text-stone-400 text-center py-8">
                  Keranjang masih kosong.
                </p>
              ) : (
                <div className="flex flex-col gap-3 mb-4">
                  {basketItems.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-lg p-3 shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className="text-sm font-semibold text-stone-900">
                          {item.name}
                        </p>
                        <span className="text-sm font-semibold text-olive-700 shrink-0">
                          {formatRupiah(item.price)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <button
                          onClick={() => updateQty(item.id, -item.qty)}
                          className="text-xs font-medium text-red-500 hover:underline"
                        >
                          Hapus
                        </button>

                        <div className="flex items-center gap-1.5 bg-stone-100 rounded-full px-1 py-1">
                          <button
                            onClick={() => updateQty(item.id, -1)}
                            aria-label={`Kurangi ${item.name}`}
                            className="w-6 h-6 rounded-full bg-white shadow-sm flex items-center justify-center text-stone-600 hover:bg-stone-50"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-medium w-4 text-center">
                            {item.qty}
                          </span>
                          <button
                            onClick={() => updateQty(item.id, 1)}
                            aria-label={`Tambah ${item.name}`}
                            className="w-6 h-6 rounded-full bg-white shadow-sm flex items-center justify-center text-stone-600 hover:bg-stone-50"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="border-t border-stone-300/50 pt-4 flex items-center justify-between mb-4">
                <span className="text-sm text-stone-500">Subtotal</span>
                <span className="font-bold text-stone-900">
                  {formatRupiah(subtotal)}
                </span>
              </div>

              <button
                disabled={basketItems.length === 0}
                className="w-full bg-olive-600 hover:bg-olive-700 disabled:bg-stone-300 disabled:cursor-not-allowed text-white text-sm font-semibold py-3 rounded-lg transition-colors"
              >
                Checkout Now
              </button>
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