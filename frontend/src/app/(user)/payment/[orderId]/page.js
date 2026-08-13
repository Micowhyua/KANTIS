  "use client";

  import { useState, useEffect } from "react";
  import {
    Bell,
    History,
    User,
    X,
    Clock,
    CheckCircle2,
  } from "lucide-react";

  function formatCountdown(totalSeconds) {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }

  export default function PaymentPage() {
    const [secondsLeft, setSecondsLeft] = useState(5 * 60);

    useEffect(() => {
      if (secondsLeft <= 0) return;
      const timer = setInterval(() => {
        setSecondsLeft((prev) => Math.max(0, prev - 1));
      }, 1000);
      return () => clearInterval(timer);
    }, [secondsLeft]);

    const isExpired = secondsLeft === 0;

    return (
      <div className="min-h-screen bg-[#FBF7EF] text-stone-800">
        {/* Navbar */}
        <header className="sticky top-0 z-20 bg-[#FBF7EF]/90 backdrop-blur border-b border-stone-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-3 shrink-0">
              <button
                aria-label="Tutup"
                className="text-stone-400 hover:text-stone-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <a href="#" className="text-lg font-bold tracking-tight text-stone-900">
                UI Food Hub
              </a>
            </div>

            <nav className="hidden md:flex items-center gap-6 order-2 text-sm font-medium text-stone-600 mx-auto">
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

            <div className="flex items-center gap-4 order-3 ml-auto">
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

        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12 flex justify-center">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-sm overflow-hidden">
            {/* Header */}
            <div className="bg-[#F0E9D6] px-6 py-5 text-center">
              <h1 className="font-bold text-stone-900 mb-1">Pembayaran</h1>
              <p className="text-xs text-stone-500">
                Scan QR code di bawah ini dengan aplikasi pembayaranmu.
              </p>
            </div>

            <div className="p-6">
              {/* Order info */}
              <div className="bg-[#F3EEE1] rounded-lg px-4 py-3 flex items-center justify-between mb-6">
                <div>
                  <p className="text-xs text-stone-400 mb-0.5">Order ID</p>
                  <p className="text-sm font-semibold text-stone-900">PSN-1024</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-stone-400 mb-0.5">Total Tagihan</p>
                  <p className="text-sm font-bold text-olive-700">Rp 20.000</p>
                </div>
              </div>

              {/* QR Code */}
              <div className="flex justify-center mb-5">
                <div className="bg-stone-100 rounded-xl p-4">
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <QRCodePlaceholder />
                    <p className="text-center text-[10px] text-stone-400 mt-2">
                      Kantin B &middot; Pak Slamet
                    </p>
                  </div>
                </div>
              </div>

              {/* Countdown */}
              <div className="flex justify-center mb-6">
                <span
                  className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full ${
                    isExpired
                      ? "bg-red-100 text-red-600"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  {isExpired
                    ? "Waktu pembayaran habis"
                    : `Menunggu pembayaran ${formatCountdown(secondsLeft)}`}
                </span>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3">
                <button
                  disabled={isExpired}
                  className="w-full inline-flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-500 disabled:bg-stone-200 disabled:text-stone-400 disabled:cursor-not-allowed text-stone-900 text-sm font-semibold py-3 rounded-lg transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Saya Sudah Bayar
                </button>
                <button className="w-full border border-stone-200 text-stone-600 text-sm font-medium py-3 rounded-lg hover:bg-stone-50 transition-colors">
                  Batalkan Pesanan
                </button>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-[#F3EEE1] border-t border-stone-200 mt-4">
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

  function QRCodePlaceholder() {
    // Deterministic pseudo-random QR-like pattern, purely decorative.
    const size = 21;
    const cells = [];
    let seed = 42;
    const rand = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };

    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        const isFinder =
          (row < 7 && col < 7) ||
          (row < 7 && col >= size - 7) ||
          (row >= size - 7 && col < 7);
        if (isFinder) continue;
        if (rand() > 0.55) {
          cells.push([row, col]);
        }
      }
    }

    const cellSize = 6;
    const dim = size * cellSize;

    const finderPattern = (x, y) => (
      <g key={`finder-${x}-${y}`}>
        <rect x={x} y={y} width={7 * cellSize} height={7 * cellSize} fill="#1c1917" />
        <rect
          x={x + cellSize}
          y={y + cellSize}
          width={5 * cellSize}
          height={5 * cellSize}
          fill="#ffffff"
        />
        <rect
          x={x + 2 * cellSize}
          y={y + 2 * cellSize}
          width={3 * cellSize}
          height={3 * cellSize}
          fill="#1c1917"
        />
      </g>
    );

    return (
      <svg
        viewBox={`0 0 ${dim} ${dim}`}
        width="180"
        height="180"
        role="img"
        aria-label="QR code pembayaran"
      >
        <rect width={dim} height={dim} fill="#ffffff" />
        {cells.map(([row, col]) => (
          <rect
            key={`${row}-${col}`}
            x={col * cellSize}
            y={row * cellSize}
            width={cellSize}
            height={cellSize}
            fill="#1c1917"
          />
        ))}
        {finderPattern(0, 0)}
        {finderPattern((size - 7) * cellSize, 0)}
        {finderPattern(0, (size - 7) * cellSize)}
      </svg>
    );
  }