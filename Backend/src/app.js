const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const fakultasRoutes = require("./routes/fakultasRoutes");
const kantinRoutes = require("./routes/kantinRoutes");
const adminRoutes = require("./routes/adminRoutes");
const kategoriRoutes = require("./routes/kategoriRoutes");
const produkRoutes = require("./routes/produkRoutes");
const publicRoutes = require("./routes/publicRoutes");
const pesananRoutes = require("./Routes/PesananRoutes");
const pembayaranRoutes = require("./routes/pembayaranRoutes");

const app = express();


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "API Kantin Kampus berjalan",
  });
});


app.use("/api/auth", authRoutes);
app.use("/api/fakultas", fakultasRoutes);
app.use("/api/kantin", kantinRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/kategori", kategoriRoutes);
app.use("/api/produk", produkRoutes);
app.use("/api/public", publicRoutes);
app.use( "/api/pesanan",pesananRoutes);
app.use("/api/pembayaran", pembayaranRoutes);
module.exports = app;