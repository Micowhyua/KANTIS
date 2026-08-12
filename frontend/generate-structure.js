const fs = require("fs");
const path = require("path");

const root = path.dirname(__filename);
const srcDir = path.join(root, "src");

const appDir = fs.existsSync(path.join(srcDir, "app"))
  ? path.join(srcDir, "app")
  : path.join(root, "app");

const componentsDir = fs.existsSync(path.join(srcDir, "components"))
  ? path.join(srcDir, "components")
  : path.join(root, "components");

const files = {
  "app/(user)/page.tsx": `<div>
  <h1>Landing Page Kantin</h1>
  <p>Halaman sedang dikembangkan.</p>
</div>`,
  "app/(user)/canteens/[canteenId]/page.tsx": `<div>
  <h1>Detail Kantin</h1>
  <p>Halaman sedang dikembangkan.</p>
</div>`,
  "app/(user)/canteens/[canteenId]/vendors/[vendorId]/page.tsx": `<div>
  <h1>Detail Stand Pedagang &amp; Menu</h1>
  <p>Halaman sedang dikembangkan.</p>
</div>`,
  "app/(user)/checkout/page.tsx": `<div>
  <h1>Halaman Checkout</h1>
  <p>Halaman sedang dikembangkan.</p>
</div>`,
  "app/(user)/payment/[orderId]/page.tsx": `<div>
  <h1>Halaman Bayar QRIS</h1>
  <p>Halaman sedang dikembangkan.</p>
</div>`,
  "app/(user)/orders/page.tsx": `<div>
  <h1>Daftar Riwayat Pesanan</h1>
  <p>Halaman sedang dikembangkan.</p>
</div>`,
  "app/(user)/orders/[orderId]/page.tsx": `<div>
  <h1>Tracking Order Status</h1>
  <p>Halaman sedang dikembangkan.</p>
</div>`,
  "components/navbar.tsx": `<nav>Navbar Food Hub</nav>`,
  "components/footer.tsx": `<footer>Footer Food Hub</footer>`,
  "components/canteen-card.tsx": `<div>Kartu Kantin</div>`,
  "components/vendor-card.tsx": `<div>Kartu Pedagang</div>`,
  "components/menu-card.tsx": `<div>Kartu Menu</div>`,
  "components/cart-sidebar.tsx": `<aside>Keranjang Belanja</aside>`,
};

for (const [rel, jsx] of Object.entries(files)) {
  const isPage = rel.startsWith("app/");
  const base = isPage ? appDir : componentsDir;
  const relPath = isPage ? rel.replace(/^app\//, "") : rel.replace(/^components\//, "");
  const target = path.join(base, relPath);
  const name = rel.split("/").pop().replace(".tsx", "");
  const componentName = isPage
    ? "Page"
    : rel
        .split("/")
        .pop()
        .replace(".tsx", "")
        .split("-")
        .map((p) => p[0].toUpperCase() + p.slice(1))
        .join("");

  const content = `export default function ${componentName}() {
  return (
    ${jsx
      .split("\n")
      .map((l, i) => (i === 0 ? l : "    " + l))
      .join("\n")}
  );
}
`;

  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content, "utf8");
  console.log("created:", path.relative(root, target));
}

console.log("\nSelesai. Struktur dibuat di:", path.relative(root, appDir));